import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * Existing environmental prediction integration.
 */
export const requestPestPrediction = async ({
  cropData,
  weatherData,
  farmData,
}) => {
  const aiServiceUrl = process.env.AI_SERVICE_URL;

  if (!aiServiceUrl) {
    return {
      available: false,
      message: 'FastAPI AI/ML service is not currently configured (AI_SERVICE_URL is unset). AI integration scheduled for future phase.',
    };
  }

  try {
    const response = await axios.post(
      `${aiServiceUrl}/predict`,
      {
        crop: cropData,
        weather: weatherData,
        farm: farmData,
      },
      { timeout: 15000 }
    );

    return { available: true, data: response.data };
  } catch (error) {
    console.error('Environmental AI service error:', error.message);
    throw new Error(
      `AI service connection error: ${
        error.response?.data?.detail || error.message
      }`
    );
  }
};

/**
 * NEW: Forward an uploaded insect image to FastAPI.
 */
export const predictInsectImage = async ({
  filePath,
  originalName,
  mimeType,
}) => {
  const aiServiceUrl = process.env.AI_SERVICE_URL;

  if (!aiServiceUrl) {
    const error = new Error('AI_SERVICE_URL is not configured.');
    error.status = 503;
    throw error;
  }

  const form = new FormData();

  form.append('file', fs.createReadStream(filePath), {
    filename: originalName,
    contentType: mimeType,
  });

  try {
    const response = await axios.post(
      `${aiServiceUrl}/predict/image`,
      form,
      {
        headers: form.getHeaders(),
        timeout: 60000,
        maxBodyLength: 6 * 1024 * 1024,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      'Image AI service error:',
      error.response?.data || error.message
    );

    const serviceError = new Error(
      error.response?.data?.detail ||
      'Image prediction service is currently unavailable.'
    );

    serviceError.status = 502;
    throw serviceError;
  }
};

/**
 * Existing FastAPI health check.
 */
export const checkAiServiceHealth = async () => {
  const aiServiceUrl = process.env.AI_SERVICE_URL;

  if (!aiServiceUrl) {
    return {
      status: 'unconfigured',
      message: 'AI_SERVICE_URL environment variable is not set.',
    };
  }

  try {
    const response = await axios.get(
      `${aiServiceUrl}/health`,
      { timeout: 5000 }
    );

    return {
      status: 'connected',
      details: response.data,
    };
  } catch (error) {
    return {
      status: 'unavailable',
      message: error.message,
    };
  }
};

export default {
  requestPestPrediction,
  predictInsectImage,
  checkAiServiceHealth,
};

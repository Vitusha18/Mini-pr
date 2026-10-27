import axios from 'axios';

/**
 * Weather service to fetch real-time environmental indicators from Open-Meteo API
 * @param {number} latitudeN
 * @param {number} longitude
 * @returns {Promise<Object>} Structured environmental indicators
 */
export const getCurrentWeather = async (latitude, longitude) => {
  const baseUrl = process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1';

  try {
    const response = await axios.get(`${baseUrl}/forecast`, {
      params: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'precipitation',
          'rain',
          'wind_speed_10m',
          'surface_pressure',
          'soil_temperature_0cm',
          'soil_moisture_0_to_1cm',
        ].join(','),
        timezone: 'auto',
      },
      timeout: 10000,
    });

    const current = response.data?.current || {};

    return {
      latitude: Number(latitude),
      longitude: Number(longitude),
      temperature: current.temperature_2m !== undefined ? current.temperature_2m : null,
      humidity: current.relative_humidity_2m !== undefined ? current.relative_humidity_2m : null,
      rainfall: current.precipitation !== undefined ? current.precipitation : (current.rain !== undefined ? current.rain : null),
      windSpeed: current.wind_speed_10m !== undefined ? current.wind_speed_10m : null,
      pressure: current.surface_pressure !== undefined ? current.surface_pressure : null,
      soilTemperature: current.soil_temperature_0cm !== undefined ? current.soil_temperature_0cm : null,
      soilMoisture: current.soil_moisture_0_to_1cm !== undefined ? current.soil_moisture_0_to_1cm : null,
      elevation: response.data?.elevation !== undefined ? response.data.elevation : null,
      recordedAt: current.time || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Weather Service Error:', error.message);
    const detail = error.response?.data?.reason || error.message;
    throw new Error(`Weather provider error: ${detail}`);
  }
};

export default {
  getCurrentWeather,
};

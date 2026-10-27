import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:8080/api/v1';
const FASTAPI_BASE = 'http://127.0.0.1:8000';

async function runLiveIntegrationTests() {
  console.log('\n======================================================');
  console.log('🚀 PESTGUARD AI — END-TO-END LIVE INTEGRATION VERIFICATION');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   ${err.response?.data?.message || err.message}`);
      failed++;
    }
  };

  // 1. Health checks
  await test('Express backend health check (GET /api/v1/health)', async () => {
    const res = await axios.get(`${API_BASE}/health`);
    if (!res.data.success) throw new Error('Backend health reported false');
  });

  await test('FastAPI AI service health check (GET http://127.0.0.1:8000/health)', async () => {
    const res = await axios.get(`${FASTAPI_BASE}/health`);
    if (res.data.status !== 'healthy') throw new Error(`FastAPI not healthy: ${res.data.status}`);
    if (res.data.image_model !== 'ready') throw new Error(`Image model not ready: ${res.data.image_model}`);
    console.log(`   [FastAPI] Status: ${res.data.status}, Image Model: ${res.data.image_model}, Env Model: ${res.data.environmental_model}`);
  });

  // 2. Authentication
  const testEmail = `farmer_test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let authToken = '';
  let authUser = null;

  await test('Farmer registration (POST /api/v1/auth/register)', async () => {
    const res = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Ramesh Patel',
      email: testEmail,
      password: testPassword,
    });
    if (!res.data.token) throw new Error('No token returned on registration');
    authToken = res.data.token;
    authUser = res.data.user;
  });

  await test('Farmer login (POST /api/v1/auth/login)', async () => {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: testEmail,
      password: testPassword,
    });
    if (!res.data.token) throw new Error('No token returned on login');
    authToken = res.data.token;
  });

  await test('Current user profile retrieval (GET /api/v1/auth/me)', async () => {
    const res = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.data.user.email !== testEmail.toLowerCase()) throw new Error('Email mismatch');
  });

  // 3. Farm CRUD
  let createdFarmId = '';
  await test('Create farm with geo-coordinates (POST /api/v1/farms)', async () => {
    const res = await axios.post(
      `${API_BASE}/farms`,
      {
        farmName: 'Krishna Valley Farm',
        location: 'Palghar, Maharashtra',
        latitude: 19.6967,
        longitude: 72.7656,
        farmArea: 8.5,
        areaUnit: 'Acre',
        soilType: 'Black Soil',
        irrigationType: 'Drip Irrigation',
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    if (!res.data.data?._id) throw new Error('Farm ID missing');
    createdFarmId = res.data.data._id;
  });

  await test('List farmer farms (GET /api/v1/farms)', async () => {
    const res = await axios.get(`${API_BASE}/farms`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const found = res.data.data.find((f) => f._id === createdFarmId);
    if (!found) throw new Error('Created farm not found in list');
  });

  // 4. Crop CRUD
  let createdCropId = '';
  await test('Create crop linked to farm (POST /api/v1/crops)', async () => {
    const res = await axios.post(
      `${API_BASE}/crops`,
      {
        farm: createdFarmId,
        cropName: 'Rice',
        variety: 'Basmati 370',
        growthStage: 'Tillering',
        plantingDate: '2026-06-15',
        expectedHarvestDate: '2026-11-20',
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    if (!res.data.data?._id) throw new Error('Crop ID missing');
    createdCropId = res.data.data._id;
  });

  await test('List farmer crops (GET /api/v1/crops)', async () => {
    const res = await axios.get(`${API_BASE}/crops`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const found = res.data.data.find((c) => c._id === createdCropId);
    if (!found) throw new Error('Created crop not found in list');
  });

  // 5. Weather Telemetry
  await test('Live Open-Meteo weather telemetry (GET /api/v1/weather/current)', async () => {
    const res = await axios.get(`${API_BASE}/weather/current`, {
      params: { latitude: 19.6967, longitude: 72.7656 },
    });
    const w = res.data.data;
    if (w.temperature === undefined || w.humidity === undefined) {
      throw new Error('Incomplete weather payload');
    }
    console.log(`   [Live Weather] Temp: ${w.temperature}°C, Humidity: ${w.humidity}%, Rain: ${w.rainfall}mm, Wind: ${w.windSpeed}km/h`);
  });

  // 6. Environmental Risk Prediction
  let createdPredictionId = '';
  await test('Execute environmental risk prediction (POST /api/v1/predictions)', async () => {
    const res = await axios.post(
      `${API_BASE}/predictions`,
      {
        farm: createdFarmId,
        crop: createdCropId,
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    const p = res.data.data;
    if (!p?._id || !p.riskLevel) throw new Error('Invalid prediction result');
    createdPredictionId = p._id;
    console.log(`   [Environmental Prediction] Threat: ${p.prediction}, Risk: ${p.riskLevel}, Confidence: ${(p.confidence * 100).toFixed(0)}%`);
  });

  await test('Retrieve prediction history (GET /api/v1/predictions)', async () => {
    const res = await axios.get(`${API_BASE}/predictions`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const found = res.data.data.find((p) => p._id === createdPredictionId);
    if (!found) throw new Error('New prediction not found in history');
  });

  // 7. Image-based AI Prediction (React -> Express -> FastAPI -> MobileNetV3)
  const sampleImagePath = path.resolve('ai-services/datasets/ip102_v1.1/images/00000.jpg');
  await test('Insect image prediction via Express & FastAPI MobileNetV3 (POST /api/v1/ai/predict/image)', async () => {
    if (!fs.existsSync(sampleImagePath)) {
      throw new Error(`Sample image not found at ${sampleImagePath}`);
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(sampleImagePath), {
      filename: '00000.jpg',
      contentType: 'image/jpeg',
    });

    const res = await axios.post(`${API_BASE}/ai/predict/image`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${authToken}`,
      },
      timeout: 30000,
    });

    if (!res.data.success || !res.data.data) {
      throw new Error('Image prediction failed');
    }

    const prediction = res.data.data;
    if (!prediction.predicted_class || prediction.confidence === undefined) {
      throw new Error('Malformed prediction payload');
    }

    console.log(`   [AI Vision] Predicted Class: ${prediction.predicted_class} (ID: ${prediction.class_id})`);
    console.log(`   [AI Vision] Confidence: ${(prediction.confidence * 100).toFixed(1)}% (Model: ${prediction.model})`);
    console.log(`   [AI Vision] Notice: ${prediction.message}`);
  });

  // 8. Cleanup test resources
  await test('Delete test crop (DELETE /api/v1/crops/:id)', async () => {
    await axios.delete(`${API_BASE}/crops/${createdCropId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  });

  await test('Delete test farm (DELETE /api/v1/farms/:id)', async () => {
    await axios.delete(`${API_BASE}/farms/${createdFarmId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  });

  console.log('\n------------------------------------------------------');
  console.log(`TOTAL LIVE TESTS: ${passed + failed}`);
  console.log(`PASSED:           ${passed}`);
  console.log(`FAILED:           ${failed}`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL END-TO-END INTEGRATION TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  }
}

runLiveIntegrationTests().catch((err) => {
  console.error('Fatal test error:', err.message);
  process.exit(1);
});

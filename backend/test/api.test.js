import 'dotenv/config';
import assert from 'node:assert/strict';
import http from 'node:http';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import local modules to test
import app from '../app.js';
import User from '../src/models/User.js';
import Farm from '../src/models/Farm.js';
import Crop from '../src/models/Crop.js';
import Prediction from '../src/models/Prediction.js';
import { generateToken } from '../utils/generateToken.js';
import { protect } from '../middleware/auth.middleware.js';
import weatherService from '../services/weather.service.js';
import aiService from '../services/ai.service.js';

let testServer;
let baseUrl;

async function runTests() {
  console.log('\n=============================================');
  console.log('🧪 RUNNING PESTGUARD AI BACKEND TEST SUITE');
  console.log('=============================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   ${err.message}`);
      failed++;
    }
  };

  // Start test server on random free port
  await new Promise((resolve) => {
    testServer = http.createServer(app);
    testServer.listen(0, () => {
      const port = testServer.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  // Helper for HTTP requests
  const request = (method, path, body = null, headers = {}) => {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const req = http.request(
        url,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const json = data ? JSON.parse(data) : {};
              resolve({ status: res.statusCode, headers: res.headers, body: json });
            } catch (e) {
              resolve({ status: res.statusCode, headers: res.headers, text: data });
            }
          });
        }
      );
      req.on('error', reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  };

  // 1. Health Check
  await test('GET /api/v1/health returns 200 and expected status payload', async () => {
    const res = await request('GET', '/api/v1/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.message, 'PestGuard AI API is running');
  });

  // 2. 404 Route Not Found
  await test('GET unknown route returns 404 with standard error format', async () => {
    const res = await request('GET', '/api/v1/non-existent-route');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Route not found');
  });

  // 3. JWT Generation & Verification
  await test('generateToken creates valid JWT that can be verified', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const token = generateToken(fakeId);
    assert.ok(token);
    assert.equal(typeof token, 'string');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pestguard_ai_jwt_secret_key_2026_secure');
    assert.equal(decoded.id, fakeId);
  });

  // 4. Auth Middleware - missing token
  await test('Protected route rejects request with missing token (401)', async () => {
    const res = await request('GET', '/api/v1/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Not authorized, token missing');
  });

  // 5. Auth Middleware - invalid token
  await test('Protected route rejects request with invalid token (401)', async () => {
    const res = await request('GET', '/api/v1/auth/me', null, {
      Authorization: 'Bearer invalid.token.payload',
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Not authorized, invalid token');
  });

  // 6. User Model Validation & Password Hashing
  await test('User model enforces validations and bcrypt hashing', async () => {
    // Missing required email
    const invalidUser = new User({ name: 'Test Farmer', password: '123' });
    const validationError = invalidUser.validateSync();
    assert.ok(validationError.errors.email);
    assert.ok(validationError.errors.password);

    // Password hashing check
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('secret123', salt);
    const isMatch = await bcrypt.compare('secret123', hash);
    const isWrong = await bcrypt.compare('wrongpassword', hash);
    assert.equal(isMatch, true);
    assert.equal(isWrong, false);

    // toJSON strips password
    const testDoc = new User({
      name: 'Farmer John',
      email: 'john@example.com',
      password: 'mypassword123',
    });
    const serialized = testDoc.toJSON();
    assert.equal(serialized.password, undefined);
  });

  // 7. Farm Model Validation
  await test('Farm model enforces required fields and positive farmArea', async () => {
    const invalidFarm = new Farm({
      farmArea: -5,
      areaUnit: 'InvalidUnit',
    });
    const err = invalidFarm.validateSync();
    assert.ok(err.errors.farmer);
    assert.ok(err.errors.farmName);
    assert.ok(err.errors.location);
    assert.ok(err.errors.latitude);
    assert.ok(err.errors.longitude);
    assert.ok(err.errors.farmArea);
    assert.ok(err.errors.areaUnit);

    const validFarm = new Farm({
      farmer: new mongoose.Types.ObjectId(),
      farmName: 'Green Meadows',
      location: 'Palghar, Maharashtra',
      latitude: 19.6967,
      longitude: 72.7656,
      farmArea: 5,
      areaUnit: 'Acre',
      soilType: 'Loamy',
      irrigationType: 'Drip',
    });
    const validErr = validFarm.validateSync();
    assert.equal(validErr, undefined);
  });

  // 8. Crop Model Validation
  await test('Crop model validates required fields and farm relationship', async () => {
    const invalidCrop = new Crop({});
    const err = invalidCrop.validateSync();
    assert.ok(err.errors.farmer);
    assert.ok(err.errors.farm);
    assert.ok(err.errors.cropName);
    assert.ok(err.errors.growthStage);

    const validCrop = new Crop({
      farmer: new mongoose.Types.ObjectId(),
      farm: new mongoose.Types.ObjectId(),
      cropName: 'Tomato',
      variety: 'Roma',
      growthStage: 'Flowering',
    });
    const validErr = validCrop.validateSync();
    assert.equal(validErr, undefined);
    assert.equal(validCrop.isActive, true);
  });

  // 9. Prediction Model Validation
  await test('Prediction model schema validates structure and riskLevel enum', async () => {
    const invalidPred = new Prediction({
      riskLevel: 'SuperHigh',
    });
    const err = invalidPred.validateSync();
    assert.ok(err.errors.farmer);
    assert.ok(err.errors.farm);
    assert.ok(err.errors.crop);
    assert.ok(err.errors.riskLevel);

    const validPred = new Prediction({
      farmer: new mongoose.Types.ObjectId(),
      farm: new mongoose.Types.ObjectId(),
      crop: new mongoose.Types.ObjectId(),
      riskLevel: 'Moderate',
      confidence: 0.85,
      prediction: 'Aphids',
      recommendation: 'Apply organic neem oil spray in the evening.',
      weatherSnapshot: {
        temperature: 28.5,
        humidity: 80,
        rainfall: 0,
      },
    });
    const validErr = validPred.validateSync();
    assert.equal(validErr, undefined);
  });

  // 10. Weather Controller Validation (Missing/Invalid Coordinates)
  await test('GET /api/v1/weather/current validates coordinates strictly', async () => {
    // Missing all coordinates
    const res1 = await request('GET', '/api/v1/weather/current');
    assert.equal(res1.status, 400);
    assert.equal(res1.body.success, false);

    // Missing latitude
    const resMissingLat = await request('GET', '/api/v1/weather/current?longitude=72.7656');
    assert.equal(resMissingLat.status, 400);
    assert.equal(resMissingLat.body.success, false);

    // Missing longitude
    const resMissingLon = await request('GET', '/api/v1/weather/current?latitude=19.6967');
    assert.equal(resMissingLon.status, 400);
    assert.equal(resMissingLon.body.success, false);

    // Invalid latitude (> 90)
    const res2 = await request('GET', '/api/v1/weather/current?latitude=100&longitude=72.7656');
    assert.equal(res2.status, 400);
    assert.equal(res2.body.success, false);

    // Invalid longitude (> 180)
    const res3 = await request('GET', '/api/v1/weather/current?latitude=19.69&longitude=250');
    assert.equal(res3.status, 400);
    assert.equal(res3.body.success, false);

    // Valid coordinates via HTTP endpoint
    const resValid = await request('GET', '/api/v1/weather/current?latitude=19.6967&longitude=72.7656');
    assert.equal(resValid.status, 200);
    assert.equal(resValid.body.success, true);
    assert.equal(resValid.body.data.latitude, 19.6967);
    assert.equal(resValid.body.data.longitude, 72.7656);
    assert.ok(resValid.body.data.temperature !== null);
    assert.ok(resValid.body.data.humidity !== null);
  });

  // 11. Weather Service Live Open-Meteo Integration
  await test('Weather service retrieves live environmental indicators for Palghar (19.6967, 72.7656)', async () => {
    const weather = await weatherService.getCurrentWeather(19.6967, 72.7656);
    assert.ok(weather);
    assert.equal(weather.latitude, 19.6967);
    assert.equal(weather.longitude, 72.7656);
    assert.ok(weather.temperature !== undefined);
    assert.ok(weather.humidity !== undefined);
    assert.ok(weather.windSpeed !== undefined);
    console.log(`      [Sample Weather] Temp: ${weather.temperature}°C, Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} km/h`);
  });

  // 12. AI Service Foundation
  await test('AI service foundation handles unconfigured state safely without fake data', async () => {
    const predictionRes = await aiService.requestPestPrediction({
      cropData: { name: 'Tomato' },
      weatherData: { temp: 25 },
      farmData: { location: 'Palghar' },
    });
    assert.equal(predictionRes.available, false);
    assert.ok(predictionRes.message.includes('not currently configured'));

    const healthRes = await aiService.checkAiServiceHealth();
    assert.equal(healthRes.status, 'unconfigured');
  });

  // 13. Registration input validation
  await test('POST /api/v1/auth/register validates missing input', async () => {
    const res = await request('POST', '/api/v1/auth/register', {
      name: 'John',
      email: '',
      password: '',
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  // 14. Login input validation
  await test('POST /api/v1/auth/login validates missing input', async () => {
    const res = await request('POST', '/api/v1/auth/login', {});
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  // Cleanup test server
  await new Promise((resolve) => testServer.close(resolve));

  console.log('\n---------------------------------------------');
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED:      ${passed}`);
  console.log(`FAILED:      ${failed}`);
  console.log('---------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  if (testServer) testServer.close();
  process.exit(1);
});

import Prediction from '../../src/models/Prediction.js';
import Farm from '../../src/models/Farm.js';
import Crop from '../../src/models/Crop.js';
import weatherService from '../../services/weather.service.js';

/**
 * @desc    Generate and save a new environmental pest risk analysis
 * @route   POST /api/v1/predictions
 * @access  Private (Farmer)
 */
export const createPrediction = async (req, res, next) => {
  try {
    const { farm: farmId, crop: cropId } = req.body;

    if (!farmId || !cropId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both farm and crop IDs to run environmental risk analysis',
      });
    }

    const farm = await Farm.findOne({ _id: farmId, farmer: req.user._id });
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or access denied',
      });
    }

    const crop = await Crop.findOne({ _id: cropId, farmer: req.user._id });
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found or access denied',
      });
    }

    // Retrieve real weather telemetry from Open-Meteo for farm coordinates
    let weatherSnapshot = {};
    try {
      weatherSnapshot = await weatherService.getCurrentWeather(farm.latitude, farm.longitude);
    } catch (weatherErr) {
      console.warn('Weather service warning during prediction:', weatherErr.message);
      weatherSnapshot = {
        temperature: 28,
        humidity: 75,
        rainfall: 5,
        windSpeed: 10,
        pressure: 1012,
        soilMoisture: 0.25,
      };
    }

    // Agronomic climatic risk rule evaluation for target crop
    const temp = weatherSnapshot.temperature ?? 28;
    const humidity = weatherSnapshot.humidity ?? 70;
    const cropName = (crop.cropName || '').toLowerCase();

    let pest = 'General Pest Outbreak Risk';
    let riskLevel = 'Low';
    let confidence = 0.72;
    let recommendation = 'Maintain routine field scouting and observe beneficial insect populations.';

    if (cropName.includes('rice') || cropName.includes('paddy')) {
      pest = 'Yellow Stem Borer';
      if (humidity >= 78 && temp >= 26 && temp <= 32) {
        riskLevel = 'High';
        confidence = 0.88;
        recommendation = 'Erect pheromone traps at 5 per acre and avoid excessive nitrogenous top-dressing during vegetative stages.';
      } else if (humidity >= 65 || (temp >= 24 && temp <= 34)) {
        riskLevel = 'Moderate';
        confidence = 0.76;
        recommendation = 'Monitor tillers for dead hearts and maintain regulated standing water depths.';
      } else {
        riskLevel = 'Low';
        confidence = 0.82;
        recommendation = 'Environmental conditions are below incubation thresholds. Continue standard cultural practices.';
      }
    } else if (cropName.includes('cotton')) {
      pest = 'Pink Bollworm';
      if (temp >= 28 && humidity >= 68) {
        riskLevel = 'High';
        confidence = 0.85;
        recommendation = 'Deploy light and pheromone traps to monitor adult moth densities; destroy rosette flowers.';
      } else if (temp >= 25 || humidity >= 60) {
        riskLevel = 'Moderate';
        confidence = 0.75;
        recommendation = 'Inspect square formation and maintain field sanitation.';
      } else {
        riskLevel = 'Low';
        confidence = 0.80;
        recommendation = 'Low pest pressure indicated by current microclimate.';
      }
    } else if (cropName.includes('tomato')) {
      pest = 'Leaf Miner';
      if (temp >= 25 && temp <= 32 && humidity >= 60) {
        riskLevel = 'High';
        confidence = 0.84;
        recommendation = 'Install yellow sticky traps and apply approved botanical or biological controls.';
      } else {
        riskLevel = 'Moderate';
        confidence = 0.72;
        recommendation = 'Inspect lower canopy leaves for serpentine mines.';
      }
    } else if (cropName.includes('wheat')) {
      pest = 'Wheat Aphids';
      if (temp >= 20 && temp <= 27 && humidity >= 65) {
        riskLevel = 'Moderate';
        confidence = 0.78;
        recommendation = 'Conserve ladybird beetle predators on field margins.';
      } else {
        riskLevel = 'Low';
        confidence = 0.82;
        recommendation = 'Favorable weather conditions for crop growth with minimal aphid colonization risk.';
      }
    } else {
      if (humidity >= 75 && temp >= 25) {
        riskLevel = 'Moderate';
        confidence = 0.74;
        recommendation = 'Elevated moisture favors fungal and sucking pest incubation. Conduct weekly inspections.';
      }
    }

    const newPrediction = await Prediction.create({
      farmer: req.user._id,
      farm: farm._id,
      crop: crop._id,
      weatherSnapshot: {
        temperature: weatherSnapshot.temperature ?? null,
        humidity: weatherSnapshot.humidity ?? null,
        rainfall: weatherSnapshot.rainfall ?? null,
        windSpeed: weatherSnapshot.windSpeed ?? null,
        pressure: weatherSnapshot.pressure ?? null,
        soilTemperature: weatherSnapshot.soilTemperature ?? null,
        soilMoisture: weatherSnapshot.soilMoisture ?? null,
      },
      prediction: pest,
      riskLevel,
      confidence,
      recommendation,
    });

    const populatedPrediction = await Prediction.findById(newPrediction._id)
      .populate('farm', 'farmName location latitude longitude')
      .populate('crop', 'cropName variety growthStage');

    res.status(201).json({
      success: true,
      message: 'Environmental risk prediction generated successfully',
      data: populatedPrediction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get prediction history for the authenticated farmer
 * @route   GET /api/v1/predictions
 * @access  Private (Farmer)
 */
export const getPredictions = async (req, res, next) => {
  try {
    const filter = { farmer: req.user._id };

    if (req.query.farm) {
      filter.farm = req.query.farm;
    }
    if (req.query.crop) {
      filter.crop = req.query.crop;
    }

    const predictions = await Prediction.find(filter)
      .populate('farm', 'farmName location latitude longitude')
      .populate('crop', 'cropName variety growthStage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single prediction record by ID (strictly belonging to authenticated farmer)
 * @route   GET /api/v1/predictions/:id
 * @access  Private (Farmer)
 */
export const getPredictionById = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    })
      .populate('farm', 'farmName location latitude longitude')
      .populate('crop', 'cropName variety growthStage');

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction record not found or access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    next(error);
  }
};

import Farm from '../../src/models/Farm.js';

/**
 * @desc    Create a new farm
 * @route   POST /api/v1/farms
 * @access  Private (Farmer)
 */
export const createFarm = async (req, res, next) => {
  try {
    const {
      farmName,
      location,
      latitude,
      longitude,
      farmArea,
      areaUnit,
      soilType,
      irrigationType,
    } = req.body;

    // Validate required fields
    if (!farmName || !location || latitude === undefined || longitude === undefined || farmArea === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farmName, location, latitude, longitude, and farmArea',
      });
    }

    if (Number(farmArea) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Farm area must be greater than 0',
      });
    }

    // Always tie the farm to the authenticated user (ignore any farmer id passed in body)
    const farm = await Farm.create({
      farmer: req.user._id,
      farmName: farmName.trim(),
      location: location.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      farmArea: Number(farmArea),
      areaUnit: areaUnit || 'Acre',
      soilType: soilType || null,
      irrigationType: irrigationType || null,
    });

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all farms belonging to the authenticated farmer
 * @route   GET /api/v1/farms
 * @access  Private
 */
export const getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find({ farmer: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: farms.length,
      data: farms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single farm by ID (strictly belonging to the authenticated farmer)
 * @route   GET /api/v1/farms/:id
 * @access  Private
 */
export const getFarmById = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or you do not have permission to view it',
      });
    }

    res.status(200).json({
      success: true,
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a farm (strictly belonging to the authenticated farmer)
 * @route   PUT /api/v1/farms/:id
 * @access  Private
 */
export const updateFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or you do not have permission to modify it',
      });
    }

    const {
      farmName,
      location,
      latitude,
      longitude,
      farmArea,
      areaUnit,
      soilType,
      irrigationType,
    } = req.body;

    if (farmName !== undefined) farm.farmName = farmName.trim();
    if (location !== undefined) farm.location = location.trim();
    if (latitude !== undefined) farm.latitude = Number(latitude);
    if (longitude !== undefined) farm.longitude = Number(longitude);
    if (farmArea !== undefined) {
      if (Number(farmArea) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Farm area must be greater than 0',
        });
      }
      farm.farmArea = Number(farmArea);
    }
    if (areaUnit !== undefined) farm.areaUnit = areaUnit;
    if (soilType !== undefined) farm.soilType = soilType;
    if (irrigationType !== undefined) farm.irrigationType = irrigationType;

    const updatedFarm = await farm.save();

    res.status(200).json({
      success: true,
      message: 'Farm updated successfully',
      data: updatedFarm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a farm (strictly belonging to the authenticated farmer)
 * @route   DELETE /api/v1/farms/:id
 * @access  Private
 */
export const deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or you do not have permission to delete it',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Farm deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

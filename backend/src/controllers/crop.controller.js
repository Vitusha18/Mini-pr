import Crop from '../../src/models/Crop.js';
import Farm from '../../src/models/Farm.js';

const normalizeCropPhoto = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const photo = value.trim();

  if (
    photo === '' ||
    photo === 'null' ||
    photo === 'undefined'
  ) {
    return null;
  }

  return photo;
};

/**
 * @desc    Create a new crop entry
 * @route   POST /api/v1/crops
 * @access  Private (Farmer)
 */
export const createCrop = async (req, res, next) => {
  try {
    const {
      farm,
      cropName,
      variety,
      growthStage,
      plantingDate,
      expectedHarvestDate,
      cropPhoto,
      isActive,
    } = req.body;

    // Validate required fields
    if (
      typeof farm !== 'string' ||
      !farm.trim() ||
      typeof cropName !== 'string' ||
      !cropName.trim() ||
      typeof growthStage !== 'string' ||
      !growthStage.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farm, cropName, and growthStage',
      });
    }

    // Verify that the farm belongs to the authenticated farmer
    const farmExists = await Farm.findOne({
      _id: farm,
      farmer: req.user._id,
    });

    if (!farmExists) {
      return res.status(404).json({
        success: false,
        message:
          'Associated farm not found or you do not have permission to add crops to it',
      });
    }

    // Prefer the uploaded file over a body-provided photo path
    const finalPhoto = req.file
      ? `/uploads/crops/${req.file.filename}`
      : normalizeCropPhoto(cropPhoto);

    const newCrop = await Crop.create({
      farmer: req.user._id,
      farm,
      cropName: cropName.trim(),
      variety:
        typeof variety === 'string' && variety.trim()
          ? variety.trim()
          : null,
      growthStage: growthStage.trim(),
      plantingDate: plantingDate || null,
      expectedHarvestDate: expectedHarvestDate || null,
      cropPhoto: finalPhoto,
      isActive:
        isActive !== undefined
          ? isActive === true || isActive === 'true'
          : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Crop created successfully',
      data: newCrop,
    });
  } catch (error) {
    next(error);
  }
};

export const getCrops = async (req, res, next) => {
  try {
    const filter = {
      farmer: req.user._id,
    };

    // Support optional filtering by farm
    if (req.query.farm) {
      filter.farm = req.query.farm;
    }

    const crops = await Crop.find(filter)
      .populate('farm', 'farmName location latitude longitude')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single crop belonging to the authenticated farmer
 * @route   GET /api/v1/crops/:id
 * @access  Private
 */
export const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    }).populate('farm', 'farmName location latitude longitude');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message:
          'Crop not found or you do not have permission to view it',
      });
    }

    return res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a crop belonging to the authenticated farmer
 * @route   PUT /api/v1/crops/:id
 * @access  Private
 */
export const updateCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message:
          'Crop not found or you do not have permission to modify it',
      });
    }

    const {
      farm,
      cropName,
      variety,
      growthStage,
      plantingDate,
      expectedHarvestDate,
      cropPhoto,
      isActive,
    } = req.body;

    // Validate and verify a new farm assignment if supplied
    if (farm !== undefined && farm !== crop.farm.toString()) {
      const validFarm = await Farm.findOne({
        _id: farm,
        farmer: req.user._id,
      });

      if (!validFarm) {
        return res.status(404).json({
          success: false,
          message:
            'Target farm not found or you do not have permission to assign to it',
        });
      }

      crop.farm = farm;
    }

    // Update only fields supplied by the client
    if (cropName !== undefined) {
      if (typeof cropName !== 'string' || !cropName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Crop name must be a non-empty string',
        });
      }

      crop.cropName = cropName.trim();
    }

    if (variety !== undefined) {
      crop.variety =
        typeof variety === 'string' && variety.trim()
          ? variety.trim()
          : null;
    }

    if (growthStage !== undefined) {
      if (
        typeof growthStage !== 'string' ||
        !growthStage.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'Growth stage must be a non-empty string',
        });
      }

      crop.growthStage = growthStage.trim();
    }

    if (plantingDate !== undefined) {
      crop.plantingDate = plantingDate || null;
    }

    if (expectedHarvestDate !== undefined) {
      crop.expectedHarvestDate = expectedHarvestDate || null;
    }

    // An uploaded file takes priority over a body photo value
    if (req.file) {
      crop.cropPhoto = `/uploads/crops/${req.file.filename}`;
    } else if (cropPhoto !== undefined) {
      crop.cropPhoto = normalizeCropPhoto(cropPhoto);
    }

    if (isActive !== undefined) {
      crop.isActive =
        isActive === true || isActive === 'true';
    }

    const updatedCrop = await crop.save();

    return res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      data: updatedCrop,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a crop belonging to the authenticated farmer
 * @route   DELETE /api/v1/crops/:id
 * @access  Private
 */
export const deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message:
          'Crop not found or you do not have permission to delete it',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Crop deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

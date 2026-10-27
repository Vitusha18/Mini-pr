
import fs from 'fs/promises';
import {
  predictInsectImage,
} from '../../services/ai.service.js';

/**
 * @route POST /api/v1/ai/predict/image
 * @access Private
 */
export const predictImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an insect image using the file field.',
    });
  }

  const uploadedFilePath = req.file.path;

  try {
    const prediction = await predictInsectImage({
      filePath: uploadedFilePath,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    return res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    return next(error);
  } finally {
    // Remove this temporary upload after inference.
    try {
      await fs.unlink(uploadedFilePath);
    } catch (cleanupError) {
      if (cleanupError.code !== 'ENOENT') {
        console.error(
          'Unable to remove temporary image:',
          cleanupError.message
        );
      }
    }
  }
};

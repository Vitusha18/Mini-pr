import weatherService from '../../services/weather.service.js';

/**
 * @desc    Get current environmental/weather indicators for given latitude and longitude
 * @route   GET /api/v1/weather/current
 * @access  Public
 */
export const getCurrentWeather = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (latitude === undefined || longitude === undefined || latitude === '' || longitude === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide both latitude and longitude query parameters (e.g., ?latitude=19.6967&longitude=72.7656)',
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude value. Latitude must be a number between -90 and 90',
      });
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid longitude value. Longitude must be a number between -180 and 180',
      });
    }

    try {
      const weatherData = await weatherService.getCurrentWeather(lat, lon);

      res.status(200).json({
        success: true,
        data: weatherData,
      });
    } catch (weatherErr) {
      console.error('[Weather Service Provider Error]:', weatherErr.message);
      return res.status(502).json({
        success: false,
        message: 'Weather telemetry service temporarily unavailable. Please try again shortly.',
      });
    }
  } catch (error) {
    next(error);
  }
};

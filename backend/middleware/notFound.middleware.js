/**
 * Middleware for 404 Route Not Found
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

export default notFound;

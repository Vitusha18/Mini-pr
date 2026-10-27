/**
 * Centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || 'Internal server error';

  // Handle Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists`;
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Handle JSON parse error from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body';
  }

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Maximum allowed file size is 5 MB.';
    } else {
      message = `Upload error: ${err.message}`;
    }
  }

  if (err.code === 'INVALID_FILE_TYPE') {
    statusCode = 400;
    message = err.message;
  }

  // Terminal logging for debugging
  console.error(`[Error] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;

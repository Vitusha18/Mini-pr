import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';

/**
 * Authentication middleware to verify JWT and attach user to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'pestguard_ai_jwt_secret_key_2026_secure';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token expired',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    });
  }
};

export default protect;

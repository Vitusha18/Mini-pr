import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT for a given user ID
 * @param {string} id - User ID
 * @returns {string} Signed JWT token
 */
export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'pestguard_ai_jwt_secret_key_2026_secure';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id }, secret, {
    expiresIn,
  });
};

export default generateToken;

const jwt = require('jsonwebtoken');
const DB = require('../database.js');

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Verifies a JWT token and returns the user
 * @param {string} token - The JWT token to verify
 * @returns {Promise<object|null>} The user object or null if verification fails
 */
async function verifyTokenAndGetUser(token) {
  if (!token) {
    return null;
  }
  
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get the user from the database
    return await DB.getUserById(decoded.id);
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return null;
  }
}

/**
 * Express middleware to verify JWT token and attach user to request
 */
function requireAuth(req, res, next) {
  const token = req.cookies['access'];
  
  if (!token) {
    return res.status(401).send({ msg: "Authentication required" });
  }
  
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ msg: "Invalid or expired token" });
    }
    
    const user = await DB.getUserById(decoded.id);
    if (!user) {
      return res.status(401).send({ msg: "User not found" });
    }
    
    req.user = user;
    next();
  });
}

module.exports = {
  verifyTokenAndGetUser,
  requireAuth
};
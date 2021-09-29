const authController = require('../controllers/auth.controller');
const jwt = require('jsonwebtoken');

module.exports = {
  ensureAuth: async (req, res, next) => {
    const token = req.headers.token;
    if(token) {
      jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
        if(error) {
          res.status(401).json({message: 'Invalid Token'});
        } else {
          const decoded = await jwt.verify(token, process.env.SECRET_KEY);
          const user = await authController.getAuthenticatedUser(decoded._id);
          res.locals.user = user;
          return next();
        }
      });
    } else {
      res.status(401).json({message: 'Restricted Access'});
    }
  }
}
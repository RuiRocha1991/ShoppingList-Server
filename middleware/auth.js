const authController = require('../controllers/auth.controller');

module.exports = {
  ensureAuth: async (req, res, next) => {
    const user = await authController.getAuthenticatedUser(req.headers.token);
    if (user) {
      res.locals.user = user;
      return next();
    } else {
      res.status(401).json({message: 'Unauthorized'});
    }
  }
}
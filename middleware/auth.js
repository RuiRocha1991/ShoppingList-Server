module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.send(401).json({message: 'Unauthorized'});
    }
  }
}
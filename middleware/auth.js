module.exports = {
  ensureAuth: (req, res, next) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({message: 'Unauthorized'});
    }
  }
}
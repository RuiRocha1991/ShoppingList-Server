module.exports = {
  ensureAuth: (req, res, next) => {
    console.log(req);
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({message: 'Unauthorized'});
    }
  }
}
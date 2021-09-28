module.exports = {
  ensureAuth: (req, res, next) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
      console.log("authenticated")
      return next();
    } else {
      console.log("unauthenticated")
      res.status(401).json({message: 'Unauthorized'});
    }
  }
}
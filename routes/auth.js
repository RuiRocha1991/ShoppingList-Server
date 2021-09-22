const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// @desc Auth with Google
// @route POST /auth/google
router.post('/google', passport.authenticate('customStrategy',{ failureRedirect: (req, res) => res.status(401).json({error: "Unauthorized"})}), authController.getUserOnSuccessSignIn);


// @desc Google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('customStrategy', {failureRedirect: (req, res) => res.status(401).json({error: "Unauthorized"})}), authController.getUserOnSuccessSignIn);


// @desc Logout user
// @route /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({success: "logout"});
})


/*router.post('/reactgooglelogin', (req, res) => {
  const {tokenId} = req.body;
  client.verifyIdToken(
      {idToken: tokenId,
        audience: '162632094197-rgqlvrvgoa38jtsqrp0uob1hsmvpjf7q.apps.googleusercontent.com'}
      ).then(response => {
        const {name, email} = response.getPayload();
        console.log(response.getPayload());
  });
})*/

module.exports = router;
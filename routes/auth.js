const express = require('express');
const passport = require('passport');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');
const authController = require('../controllers/auth.controller');


// @desc Auth with Google
// @route POST /auth/google
router.post('/google', passport.authenticate('customStrategy',{ failureRedirect: (req, res) => res.status(401).json({error: "Unauthorized"})}), authController.getUserOnSuccessSignIn);


// @desc Google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('customStrategy', {failureRedirect: (req, res) => res.status(401).json({error: "Unauthorized"})}), authController.getUserOnSuccessSignIn);


// @desc Logout user
// @route /auth/logout
router.get('/logout', ensureAuth, authController.logout);


module.exports = router;
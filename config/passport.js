const CustomStrategy = require('passport-custom').Strategy;
const {OAuth2Client} = require('google-auth-library');
const mongoose = require('mongoose');
const User = require('../models/User');


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = function (passport) {
  passport.use('customStrategy',new CustomStrategy(
      async ( req, done) => {
        const {tokenId} = req.body;
        client.verifyIdToken(
            {
              idToken: tokenId,
              audience: process.env.GOOGLE_CLIENT_ID
            }
        ).then(async (response) => {
          const {name, sub, given_name, family_name, picture} = response.getPayload();
          const newUser = {
            googleId: sub,
            displayName: name,
            firstName: given_name,
            lastName: family_name,
            image: picture
          };

          try {
            let user = await User.findOne({googleId: sub});
            if (user) {
              done(null, user);
            } else {
              user = await User.create(newUser);
              done(null, user);
            }
          } catch (e) {
            console.error(e);
          }
        });

      }))

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
}
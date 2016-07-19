var passport = require('passport');
var PoniverseStrategy = require('passport-poniverse');
var moment = require('moment');
var models = require('./database/models');
var User = models.User;
var ExternalUser = models.ExternalUser;

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    new User({id: id})
      .fetch()
      .then(function (user) {
        done(null, user);
      });
  });

  passport.use(new PoniverseStrategy({
    clientID: process.env.PONIVERSE_CLIENT_ID,
    clientSecret: process.env.PONIVERSE_CLIENT_SECRET,
    callbackURL: process.env.PONIVERSE_CALLBACK_URL,

    // For Testing against a local install of the Poniverse API
    authorizationURL: process.env.PONIVERSE_AUTHORIZATION_CODE_URL || null,
    tokenURL: process.env.PONIVERSE_ACCESS_TOKEN_URL || null,
    profileUrl: process.env.PONIVERSE_PROFILE_URL || null,

    passReqToCallback: true
  },
  function (req, token, refreshToken, tokenParams, profile, done) {
    // asynchronous
    process.nextTick(function () {

      // check if the user is already logged in
      if (!req.user) {

        ExternalUser.forge({service: 'poniverse', external_user_id: profile.id})
          .fetch()
          .then(function (externalUser) {
            if (externalUser && externalUser.get('access_token')) {
              externalUser.set('access_token', token);
              externalUser.set('refresh_token', refreshToken !== undefined ? refreshToken : null);
              externalUser.set('expires', moment().add(tokenParams['expires_in'], 'seconds'));
              externalUser.set('type', tokenParams['token_type']);
              externalUser.save();

              User.forge({id: externalUser.id})
                .fetch()
                .then(function (user) {
                  done(null, user);
                });
            } else {
              var newUser = User.forge({
                username: profile.username,
                display_name: profile.displayName,
                email: profile.email
              });
              newUser.fetch()
                .then(function (user) {
                  if (!user) {
                    newUser.save()
                      .then(function (newUser) {
                        ExternalUser.forge({
                          user_id: newUser.get('id'),
                          external_user_id: profile.id,
                          access_token: token,
                          refresh_token: refreshToken,
                          expires: moment().add(tokenParams['expires_in'], 'seconds'),
                          type: tokenParams['token_type'],
                          service: 'poniverse'
                        })
                          .save()
                          .then(function () {
                            done(null, newUser);
                          });
                      });
                  } else {
                    done(null, user);
                  }
                });
            }
          });
      }
    });
  }));
};

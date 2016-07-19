module.exports = function(app, passport) {

  // home page
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // profile page
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });

  // logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // local login
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // local signup
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // facebook
  // app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  // app.get('/auth/facebook/callback',
  //   passport.authenticate('facebook', {
  //     successRedirect : '/profile',
  //     failureRedirect : '/'
  //   }));

  // twitter
  // app.get('/auth/twitter', passport.authenticate('twitter', { scope: 'email' }));
  // app.get('/auth/twitter/callback',
  //   passport.authenticate('twitter', {
  //     successRedirect: '/profile',
  //     failureRedirect: '/'
  //   }));


  // google
  // app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  // app.get('/auth/google/callback',
  //   passport.authenticate('google', {
  //     successRedirect: '/profile',
  //     failureRedirect: '/'
  //   }));

  // poniverse
  app.get('/auth/poniverse', passport.authenticate('poniverse', { scope: 'basic' }));
  app.get('/auth/poniverse/callback',
    passport.authenticate('poniverse', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

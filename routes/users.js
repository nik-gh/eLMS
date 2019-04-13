const express = require('express');

const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const Student = require('../models/student');
const Instructor = require('../models/instructor');

/* GET users listing. */
router.get('/signup', (req, res, next) => {
  res.render('users/signup');
});

router.post('/signup', (req, res, next) => {
  // Get Form values
  const { first_name } = req.body;
  const { last_name } = req.body;
  const { street_address } = req.body;
  const { city } = req.body;
  const { state } = req.body;
  const { zip } = req.body;
  const { email } = req.body;
  const { username } = req.body;
  const { password } = req.body;
  const { password2 } = req.body;
  const { type } = req.body;

  // Form Field Validation
  req.checkBody('first_name', 'First name field is required').notEmpty();
  req.checkBody('last_name', 'Last name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email must be a valid email address').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req
    .checkBody('password2', 'Passwords do not match')
    .equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    res.render('users/signup', {
      errors,
      first_name,
      last_name,
      street_address,
      city,
      state,
      zip,
      email,
      username,
      password,
      password2,
    });
  } else {
    const newUser = User({
      email,
      username,
      password,
      type,
    });

    const newStudent = new Student({
      first_name,
      last_name,
      address: [
        {
          street_address,
          city,
          state,
          zip,
        },
      ],
      email,
      username,
    });

    const newInstructor = new Instructor({
      first_name,
      last_name,
      address: [
        {
          street_address,
          city,
          state,
          zip,
        },
      ],
      email,
      username,
    });

    if (type === 'student') {
      User.saveStudent(newUser, newStudent, (err, user) => {
        console.log('Student created');
      });
    } else {
      User.saveInstructor(newUser, newInstructor, (err, user) => {
        console.log('Instructor created');
      });
    }

    req.flash('success', 'User added');
    res.redirect('/');
  }
});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Wrong Username or Password',
  }),
  (req, res) => {
    console.log('Authentication Successful');
    // req.flash('success', 'You are now logged in');
    const usertype = req.user.type;
    res.redirect(`/${usertype}s/classes`);
  },
);

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);

    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;

      if (!user) {
        console.log(`Unknown user ${username}`);
        return done(null, false, { message: `Unknown user ${username}` });
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) {
          console.log(`error ${err}`);
          return done(err);
        }

        if (isMatch) {
          console.log('Password Match');
          return done(null, user);
        }
        console.log('Invalid Password');
        return done(null, false, { message: 'Invalid password' });
      });
    });
  }),
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;

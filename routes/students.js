const express = require('express');

const router = express.Router();

// const Class = require('../models/class');
// const User = require('../models/user');
const Student = require('../models/student');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.get('/classes', ensureAuthenticated, (req, res) => {
  Student.getStudentByUsername(req.user.username, (err, student) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.render('students/classes', { student });
    }
  });
});

router.post('/classes/register', (req, res) => {
  const info = [];
  info.student_username = req.user.username;
  info.class_id = req.body.class_id;
  info.class_title = req.body.class_title;

  Student.register(info, (err, student) => {
    if (err) throw err;
    console.log(student);
  });

  req.flash('success', 'You are now registered');
  res.redirect('/students/classes');
});

module.exports = router;

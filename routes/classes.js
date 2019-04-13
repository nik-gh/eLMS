const express = require('express');

const router = express.Router();

const Class = require('../models/class');

router.get('/', (req, res) => {
  Class.getClasses((err, classes) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(`Classes Page: ${classes}`);
      res.render('classes/index', { classes });
    }
  }, 3);
});

router.get('/:id/details', (req, res) => {
  Class.getClassById([req.params.id], (err, classname) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/details', { class: classname });
    }
  });
});

router.get('/:id/lessons', (req, res) => {
  Class.getClassById([req.params.id], (err, classname) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(`router.get(/:id/lessons... ${classname}`);

      res.render('classes/lessons', { class: classname });
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.get('/:id/lessons/:lesson_id', ensureAuthenticated, (req, res) => {
  Class.getClassById([req.params.id], (err, classname) => {
    let lesson;

    if (err) {
      console.log(err);
      res.send(err);
    } else {
      for (let i = 0; i < classname.lessons.length; i++) {
        if (classname.lessons[i].lesson_number === req.params.lesson_id) {
          lesson = classname.lessons[i];
          console.log(`lesson ${lesson}`);
        }
      }
      res.render('classes/lesson', {
        class: classname,
        lesson,
      });
    }
  });
});

module.exports = router;

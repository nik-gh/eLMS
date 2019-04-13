const express = require('express');

const router = express.Router();

const Class = require('../models/class');

router.get('/', (req, res) => {
  Class.getClasses((err, classes) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.render('index', { classes, messages: req.flash('success') });
    }
  }, 3);
});

module.exports = router;

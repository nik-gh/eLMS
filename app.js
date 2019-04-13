const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

mongoose.connect('mongodb://root:root123@ds135776.mlab.com:35776/elearn', {
  useNewUrlParser: true,
});
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');
const classes = require('./routes/classes');
const students = require('./routes/students');
const instructors = require('./routes/instructors');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(
  expressValidator({
    errorFormatter(param, msg, value) {
      const namespace = param.split('.'),
        root = namespace.shift();
      let formParam = root;

      while (namespace.length) {
        formParam += `[${namespace.shift()}]`;
      }
      return {
        param: formParam,
        msg,
        value,
      };
    },
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);

  if (req.url === '/') {
    res.locals.isHome = true;
  }
  next();
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  if (req.user) {
    res.locals.usertype = req.user.type;
  }
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/classes', classes);
app.use('/students', students);
app.use('/instructors', instructors);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('express-flash');
const session = require('express-session');
require('dotenv').config();

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Defaults for every view
const navigation = [
  {name: 'Weather', link: '/weather'}, // Default root
  {name: 'Rainy Forecast', link: '/rainy_forecast'},
  {name: 'Email Alerts', link: '/email_alerts'}
]
app.use((req, res, next) => {
  res.locals.baseTitle = 'Rain Sentry'; 
  res.locals.navigation = navigation;
  next();
});

app.use(session({ 
  cookie: { maxAge: 60000 }, 
  secret: 'Whatever',
  resave: false,
  saveUninitialized: true, 
}));
app.use(flash());

// Routers
app.use('/', indexRouter);
//app.use('/users', usersRouter);

// 404 handler
app.use(function(req, res, next) {
  res.render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var whitelist = ['https://4events.net']

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
const authController = require('./controllers/authController');
const i18n = require('./lib/i18nConfigure');

var app = express();
app.use(cors());

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

require('./lib/connectMongoose');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the internationalitation
app.use(i18n.init);

/**
 * Rutas del API
 */
app.post('/api/v1/user/login', authController.postJWT);
app.use('/api/v1/user/register', require('./routes/api/v1/register'));
app.use('/api/v1/events', require('./routes/api/v1/event'));
app.use('/api/v1/tags', require('./routes/api/v1/tag'));
app.use('/api/v1/eventsuser', require('./routes/api/v1/eventuser'));


app.use('/api/v1/users', require('./routes/api/v1/users'));
app.use('/api/v0/routesTest', require('./routes/api/v0/routesTest'));
//app.use('/', indexRouter);
//app.use('/users', usersRouter);

/**
 * Swagger 
 */

 app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  if (isAPIRequest(req)) {
    return res.json({ error: err.message });
  }

  res.render('error');
});

function isAPIRequest(req) {
  return req.originalUrl.indexOf('/api/') === 0;
}

module.exports = app;

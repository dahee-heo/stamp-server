var express = require('express');

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var cors = require('cors')

const { mongooseInit } = require('./util/mongoose.util')

mongooseInit()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var departmentRouter = require('./routes/department');
var attendanceRouter = require('./routes/attendance');
const { verify } = require('./util/auth.util');

var app = express();

const corsOptions = {
  origin: ['http://localhost:3001'],
  credentials: true
}

const globalMiddleware = function (req, res, next) {
  try {

    if (req?.headers?.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      req.userInfo = verify(token)
      // console.log('req.userInfo: ', req.userInfo);
    }

    next()
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({
      statusMessage: 'UNCONTROLLED_ERROR'
    })

  }
};

const authMiddleware = function (req, res, next) {

  if (!req?.userInfo) {
    res.status(401).json({
      stateMessage: 'AUTHORIZATION_FAIL'
    })
  } else {
    console.log(res.userInfo)
    next()
  }
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(globalMiddleware);

//regist router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
// app.use('/department', authMiddleware, departmentRouter);
app.use('/department', departmentRouter);
app.use('/attendance', attendanceRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

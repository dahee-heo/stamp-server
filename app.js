var express = require('express');

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var cors = require('cors')
var multer = require('multer')
const mime = require("mime-types");

const { mongooseInit } = require('./util/mongoose.util')

mongooseInit()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var departmentRouter = require('./routes/department');
var attendanceRouter = require('./routes/attendance');
var noticeRouter = require('./routes/notice');
var adminAttendanceRouter = require('./routes/admin-attendance');
const { verify } = require('./util/auth.util');
const roleMiddlewareMixin = require('./middleware/role.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const globalMiddleware = require('./middleware/global.middleware');
const config = require('./secret/config');
const fs = require('fs-extra')

var app = express();

console.log('CURRENT NODE_ENV ::: ', process.env.NODE_ENV);
const corsOptions = config[process.env.NODE_ENV]?.corsOptions ?? config?.LOCAL?.corsOptions
console.log('corsOptions: ', corsOptions);

// var storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     console.log('req: ', req.userInfo._id);
//     const path = `./public/images/temp/${req.userInfo._id}`;

//     //이미지 임시저장 
//     !fs.existsSync(path) && fs.mkdirSync(path, (err) => {
//       if(err) cb(err)
//     });
//     cb(null, `public/images/temp/${req.userInfo._id}`)
//   },
//   filename: function(req, file, cb) {
//     let ext = file.originalname.split('.');
//     ext = ext[ext.length - 1];
//     cb(null, `${Date.now()}.${ext}`)
//   }
// });

// const upload = multer({ 
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       cb(null, 'public/uploads');
//     },
//     filename(req, file, cb) {
//       const ext = path.extname(file.originalname); //파일 확장자
//       console.log('file.originalname: ', file.originalname);
//       cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
//     } 
//   }),
//   // fileFilter: (req, file, cb) => {
//   //   if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
//   //     return cb(null, true);
//   //   } else {
//   //     return cb(new Error('해당 파일의 형식을 지원하지 않습니다.', false));
//   //   }
//   // }
// })

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
// app.use(upload.array('files'))

//regist router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/department', authMiddleware, departmentRouter);
// app.use('/department', departmentRouter);
app.use('/attendance', attendanceRouter);
app.use('/admin-attendance', roleMiddlewareMixin('ADMIN'), adminAttendanceRouter);
app.use('/notice', noticeRouter);

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

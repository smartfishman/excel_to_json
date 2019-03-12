/*
作者：李青山
日期：2019年3月11日
概述：该项目主要是为了练习express的基本使用。
实现功能为提供上传页面给用户，将EXCEL文件解析为用户定制的json格式。
*/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')
var util    = require('util')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var upload_excel_Router = require('./routes/upload_excel');
var excel_parse_Router = require('./routes/excel_parse');

var app = express();

//添加console.log输出日志文件
var logFile = fs.createWriteStream(path.join(__dirname,"logFile.log"),{flags:'a'})
console.log = function(){
  logFile.write(util.format.apply(null,arguments)+"\n")
  process.stdout.write(util.format.apply(null,arguments)+"\n")
}

// create a write stream (in append mode)
console.log(__dirname)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(logger('combined', { stream: accessLogStream }))

// view engine setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
//Excel文件上传
app.use('/upload_excel', upload_excel_Router);
//Excel文件解析
app.use('/excel_parse', excel_parse_Router);

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
  console.log(err)
  res.render(err);
});

module.exports = app;

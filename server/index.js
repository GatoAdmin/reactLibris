var createError = require('http-errors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var flash = require("connect-flash");
const bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

const join = require('path').join;


// 모델파일 뭉치를 뭉쳐서 읽어와서 리콰이어해버림
const fs = require('fs');
const models_path = join(__dirname, '../models');

fs.readdirSync(models_path)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(models_path, file)));

  var route = require('./routes');
  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');
  var replaysRouter = require('./routes/replays');
  var scenariosRouter = require('./routes/scenarios');
  var commentsRouter = require('./routes/comments');
  var newsRouter = require('./routes/news');
  var adminRouter = require('./routes/admin');
  var libraryRouter = require('./routes/library');
  var chroniclesRouter = require('./routes/chronicles');
//=======================리콰이어 선언 부분=======================//

const app = express();

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ limit:"50mb",extended: true }));
app.use(bodyParser.json({limit:"50mb"}));
mongoose.Promise = global.Promise;


const dbUrl = require('./config/keys').mongoURI;
mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology: true })
  .then(()=>  console.log('Connected!'))
  .catch(err=> console.log(err.message));

var db = mongoose.connection;

// 패스포트 모듈 설정
require('./config/passport')(passport);

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:"TKRvOIJs=HyqrvagQ#&!f!%V]Ww/4KiVs$s,<<MX",
  //TODO: 우선 블로그에서 긁어온거 그대로니까 나중에 임의의 문자로 바꿀것
  resave:true,
  saveUninitialized:true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/replays', replaysRouter);
app.use('/scenarios',scenariosRouter);
app.use('/library',libraryRouter);
app.use('/comments',commentsRouter);
app.use('/chronicles',chroniclesRouter);
app.use('/news',newsRouter);
app.use('/admin',adminRouter);

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
//   모든 request에 대해서 build폴더 아래 index.html을 보내도록 되어 있는데,
//       이부분을 수정하여 server side 프로그래밍을 한다.

app.use(bodyParser.urlencoded({ limit:"50mb",extended: true }));
app.use(bodyParser.json({limit:"50mb"}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var aboutRouter = require('./routes/about');
app.use('/about', aboutRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html')); 
});

const PORT = process.env.PORT || 9000; // use 9000 port 

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);

});
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
  res.render('error');
});

module.exports = app;
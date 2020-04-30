const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//flash  메시지 관련
const flash = require('connect-flash');
 
//passport 로그인 관련
const passport = require('passport');
const session = require('express-session');

const admin = require('./routes/admin');
const account = require('./routes/account');
const auth = require('./routes/auth');
const home = require('./routes/home');
const chat = require('./routes/chat');

const app = express();
const port = 3000;

nunjucks.configure('template', {
    autoescape: true,
    express: app
});

// 미들웨어 셋팅
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

//session 관련 셋팅
app.use(session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
}));

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash());

//로그인 정보 뷰에서만 변수로 셋팅, 전체 미들웨어는 router위에 두어야 에러가 안난다
app.use(function(req, res, next) {
    app.locals.isLogin = req.isAuthenticated();
    //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
    //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
    next();
});

// Routing
app.use('/', home);
app.use('/admin', admin);
app.use('/account', account);
app.use('/auth', auth);
app.use('/chat', chat);

// db 관련
const db = require('./models');

// DB authentication
db.sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
    return db.sequelize.sync();
})
.then(() => {
    console.log('DB Sync complete.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

const server = app.listen( port, function(){
    console.log('Express listening on port', port);
});

const listen = require('socket.io');
const io = listen(server);

io.on('connection', (socket) => {
    socket.on('client message', (data) => {
        io.emit('server message', data.message);
    });
});
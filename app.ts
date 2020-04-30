import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import socket from 'socket.io';

import passport from 'passport';
import expressSession from 'express-session';
import connectFlash from 'connect-flash';

import admin from './routes/admin';  
import account from './routes/account';
import auth from './routes/auth';
import chat from './routes/chat';
import home from './routes/home';

import socketConnection from './helpers/socketConnection';

import { sequelize } from './models';

const app = express();
const port: number = 3000;

nunjucks.configure('template', {
    autoescape: true,
    express: app
});

// 미들웨어 셋팅
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use(expressSession({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(connectFlash());

//로그인 정보 뷰에서만 변수로 셋팅, 전체 미들웨어는 router위에 두어야 에러가 안난다
app.use(function(req, res, next) {
    app.locals.isLogin = req.isAuthenticated();
    //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
    //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
    next();
});

// Routing
app.use('/admin', admin);
app.use('/account', account);
app.use('/auth', auth);
app.use('/chat', chat);
app.use('/', home);

// DB authentication
sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
})
.then(() => {
    console.log('DB Sync complete.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

const server = app.listen(port, () => {
    console.log('Express listening on port', port);
});

socketConnection(server);
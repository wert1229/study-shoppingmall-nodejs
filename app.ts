import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import passport from 'passport';
import expressSession from 'express-session';
import connectFlash from 'connect-flash';

import admin from './routes/admin';  
import account from './routes/account';

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

// Routing
app.use('/admin', admin);
app.use('/account', account);

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

app.get('/', (req,res) => {
    res.send('first app');
});

app.listen(port, () => {
    console.log('Express listening on port', port);
});
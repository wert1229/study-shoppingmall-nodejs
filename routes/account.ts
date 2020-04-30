import * as express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';

import passwordHash from '../helpers/passwordHash'; 
import models from '../models';

passport.use(new Strategy({ 
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    async (req, username, password, done) => {
        const user = await models.User.findOne({
            where: {
                username: username,
                password: passwordHash(password)
            },
            attributes: {
                exclude: [
                    'password'
                ]
            }
        });
        
        if(!user){
            return done(null, false, { message: '일치하는 아이디 패스워드가 존재하지 않습니다.' });
        } else {
            return done(null, user.dataValues);
        }
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});
   
passport.deserializeUser(function(user, done) {
    done(null, user);
});

const router = express.Router();

router.get('/', ( _ , res) => {
    res.send('account app');
});

router.get('/join', ( _ , res) => {
    res.render('account/join.html');
});

router.post('/join', async(req, res) => {
    try{
        console.log(req.body);
        await models.User.create(req.body);
        res.send('<script>alert("회원가입 성공");location.href="/account/login";</script>');
    }catch(e){

    }
});

router.get('/login', (req, res) => {
    const error: string[] = req.flash().error;
    let message: string = "";

    if (error) message = error[0];
    
    res.render('account/login.html', { flashMessage : message });
});

router.post('/login',
    passport.authenticate('local', { 
        failureRedirect: '/account/login', 
        failureFlash: true 
    }), 
    (req, res) => {
        res.send('<script>alert("로그인 성공");location.href="/";</script>');
});

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

export default router;
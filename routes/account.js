const express = require('express');
const router = express.Router();
const models = require('../models');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('../helpers/passwordHash');

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser((user, done) => {
    const result = user;
    result.password = '';
    console.log('deserializeUser');
    done(null, result);
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    const user = await models.User.findOne({
        where: {
            username,
            password: passwordHash(password)
        },
        attributes: {
            exclude: ['password']
        }
    });    

    if (!user) {
        return done(null, false, { message : '일치하는 정보 없음'});
    } else {
        return done(null, user.dataValues);
    }
}));

router.get('/', ( _ , res) => {
    res.send('account app');
});

router.get('/join', ( _ , res) => {
    res.render('account/join.html');
});

router.post('/join', async(req, res) => {
    try{
        const user = await models.User.findOne({
            where : {
                username : req.body.username
            }
        });
        
        if (user) {
            res.send('<script>alert("아이디 중복");location.href="/account/join";</script>');
        } else {
            await models.User.create(req.body);
            res.send('<script>alert("회원가입 성공");location.href="/account/login";</script>');
        }
    }catch(e){

    }
});

router.get('/login', ( req , res) => {
    res.render('account/login.html', { flashMessage: req.flash().error });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/account/login',
    failureFlash: true
}), (_, res) => {
    res.send('<script>alert("로그인성공"); location.href = "/";</script>');
});

router.get('/success', (req, res) => {
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/account/login');
});

module.exports = router;
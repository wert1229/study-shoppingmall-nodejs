const express = require('express');
const router = express.Router();
const models = require('../models');

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

router.get('/login', ( _ , res) => {
    res.render('account/login.html');
});

module.exports = router;
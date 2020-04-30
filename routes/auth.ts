import * as express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as NaverStrategy } from 'passport-naver';

import models from '../models';

dotenv.config(); //LOAD CONFIG

passport.use(new NaverStrategy({
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN_URL}/auth/naver/callback`
    }, 
    async (accessToken, refreshToken, profile, done) => {      
        const username = 'naver_' + profile.id;
        
        let user = await models.User.findOne({
            where: {
                username: username
            }
        });
            
        if (!user) {
            user = await models.User.create({
                username: username,
                password: 'TODO:',
                displayname: profile.displayName
            });
        }

        return done(null, user);
    }
));

const router = express.Router();

router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback', passport.authenticate('naver', {
    failureRedirect: '/account/login',
    successRedirect: '/'
}));

export default router;
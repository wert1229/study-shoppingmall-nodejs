const dotenv = require('dotenv');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const models = require('../models');
const passwordHash = require('../helpers/passwordHash');

dotenv.config(); 

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// LocalStrategy
passport.use(
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, username, password, done) => {
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
            return done(null, false, { message : '일치하는 정보 없음' });
        } else {
            return done(null, user.dataValues);
        }
    })
);

// FacebookStrategy
passport.use(
    new FacebookStrategy({
        clientID: process.env.FACEBOOK_APPID,
        clientSecret: process.env.FACEBOOK_SECRETCODE,
        callbackURL: `${process.env.SITE_DOMAIN}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
    },
    async (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(refreshToken);
        // console.log(profile);
        // console.log(profile.displayName);
        // console.log(profile.emails[0].value);
        // console.log(profile._raw);
        // console.log(profile._json);
        
        try{
            const username =`fb_${profile.id}`;

            const exist = await models.User.count({
                where: {
                    username
                }
            });

            if (!exist) {
                user = await models.User.create({
                    username,
                    displayname: profile.displayName,
                    password: 'facebook'
                });
            } else {
                user = await models.User.findOne({
                    where: { 
                        username
                    } 
                });
            }

            return done(null, user);

        } catch(e) {
            console.log(e);
        }
    })
);

module.exports = passport;
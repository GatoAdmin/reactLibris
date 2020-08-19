const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var passport = require("passport");
const mongoose = require('mongoose');
var LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = '376934500468-n23i56vurbm1eakqio5v3gmadhkmnfp2.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'Ud0UgQNcPOzpLTSiCnZdTgau';

const User = require('../../models/userInfo');
// const User = mongoose.model(UserInfoModel);

const keys = require('./keys').secretOrKey;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys;
// opts.passReqToCallback = true;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/login/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}
));

passport.use("login",new LocalStrategy({ usernameField: 'email',passwordField: 'password'},
  function(userEmail,userPasswd,done){
    User.findOne({userEmail:userEmail}, function(err,user){
      if(err){return done(err);}
      if(!user){
        return done(null,false,{message:"이메일이나 비밀번호를 확인해주세요"});
      }
      user.checkPassword(userPasswd,function(err,isMatch){
        if(err){return done(err);}
        if(isMatch){
          return done(null,user);
        }else{
          return done(null,false,{message:"이메일이나 비밀번호를 확인해주세요"});
        }
      });
    });
  }));
  
module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        User.findById(jwt_payload.id)
            .then(user => {
                if(user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
    //사용자 개체를 id로 전환
    passport.serializeUser(function(user,done){
        done(null,user._id);
      });
      //id를 사용자 개체로 전환
      passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
          done(err,user);
        });
      });
    
};
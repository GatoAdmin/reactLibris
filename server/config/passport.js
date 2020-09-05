const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var passport = require("passport");
const mongoose = require('mongoose');
var LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var {OAuth2Client} = require('google-auth-library');

const GOOGLE_CLIENT_ID = '376934500468-n23i56vurbm1eakqio5v3gmadhkmnfp2.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'Ud0UgQNcPOzpLTSiCnZdTgau';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const User = require('../../models/userInfo');
// const User = mongoose.model(UserInfoModel);

const keys = require('./keys').secretOrKey;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys;
// opts.passReqToCallback = true;

// passport.use('google',new GoogleStrategy({
//   clientID: GOOGLE_CLIENT_ID,
//   clientSecret: GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost/login/google/callback"
// },
// function (accessToken, refreshToken, profile, cb) {
//   console.log("들어감3");
//   try {
//     const user = User.findOne({'connections.connectType':'Google','connections.email':profile.email});
//     if (user) {
//       return cb(null, user);
//     } // 회원 정보가 있으면 로그인
//     console.log("들어감4");
//     const newUser = new User({
//       // 없으면 회원 생성
//       userName:profile.name,
//       userEmail:profile.email,
//       userPasswd:"",
//       portrait:profile.imageUrl,
//       connections:[{
//         connectType: 'Google',
//         email: profile.email,
//       }]
//     });
//     newUser.save(user => {
//       return cb(null, user); // 새로운 회원 생성 후 로그인
//     });
//   } catch (err) {
//     return cb(err, false);
//   }
// }
// ));

passport.use('google',new LocalStrategy({usernameField:'userEmail', 
passwordField: 'tokenId', 
session: true
},
function (userEmail,tokenId,done) {
  client.verifyIdToken({idToken:tokenId, audience:GOOGLE_CLIENT_ID})
  .then(response=>{
    const {email_verified, name, email} = response.payload;
    if(email_verified){
      User.findOne({'connections.connectType':'Google','connections.email':email})
      .exec((err, user)=>{
        if(err){
          console.log(err);
          return done(err);
        }else{
          if (user) { // 회원 정보가 있으면 로그인
            return done(null, user);
          }else{
            // 없으면 회원 생성
            const newUser = new User({
              userName:name,
              userPasswd: email+'google',
              userEmail:email,
              portrait:response.payload.picture,
              connections:[{
                connectType: 'Google',
                email: email,
              }]
            });
            newUser.save((err,result) => {
              if(err){
                console.log(err);
                return done(err);
              }
              return done(null, result); // 새로운 회원 생성 후 로그인
            });
          }
        }
      })
    }
  })
}
));
passport.use("login",new LocalStrategy({ 
  usernameField: 'email',passwordField: 'password'},
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
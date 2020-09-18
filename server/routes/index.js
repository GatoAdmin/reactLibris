var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');
var {OAuth2Client} = require('google-auth-library');
var User = mongoose.model('UserInfo');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const client = new OAuth2Client("376934500468-n23i56vurbm1eakqio5v3gmadhkmnfp2.apps.googleusercontent.com");
var HashTag = mongoose.model('HashTag');
var MasterTag = mongoose.model('MasterTag');
var Chronicle = mongoose.model('Chronicle');

//템플릿용 변수 설정
router.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.title = '리브리스';
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

//컬렉션을 쿼리하고, 가장 최근 사용자를 먼저 반환(descending)
router.post("/",function(req,res,next){
  Chronicle.find()
  .populate('works works.author')
  .sort({'works.updated':"descending"})
  .exec(function(err,chronicles){
    if(err){return next(err);}
    req.session.current_url = req.originalUrl;
    if(req.user){//TODO:나중에 처음 방문한 경우만 랜딩페이지를 띄워주는것으로 바꿀것
      data = this.sortWorks(chronicles,req.user);
      res.json({users:users});
    }
  });
});

router.post("/masterTags", function (req, res, next) {
  MasterTag.find({enabled:true})
  .select('name tags')
  .exec((err, results) => {
    if(err)console.log(err)
    res.json({ masterTags: results });
  });
});

router.post("/hashTags", function (req, res, next) {
  HashTag.find({enabled:true})
  .select('name article onModel')
  .exec((err, results) => {
    if(err)console.log(err)
    res.json({ hashTag: results });
  });
});

router.post("/search", function (req, res, next) {
  var formData = req.query;
  var hashTag = null;
  if(formData.sw!=null||formData.sw!="")
  {
    HashTag.findOne({name:formData.sw})
    .exec((err, result) => {
      if(err)console.log(err)
      if(result==null||result==undefined){
        var newHash = new HashTag({
          name : formData.sw
        });
        newHash.save();
        hashTag = newHash;
      }else{    
        hashTag = result;
      }
      Chronicle.find({enabled:true})//({$or:[{}],enabled: true})//,] },
      .populate({path:'works', match:{enabled:true,$or:[{'versions.title':new RegExp(formData.sw,"i")},{'versions.content':new RegExp(formData.sw,"i")},{hashTags:hashTag._id}]}})
      .exec((err,results)=>{
        if(err)console.log(err)
        results = results.filter(chronicle=>chronicle.works.length>0);
        // res.redirect('/search/'+formData.sw,{results:results});
        var replays = results.filter(chronicle=>chronicle.onModel==='Replay');
        var scenarios= results.filter(chronicle=>chronicle.onModel==='Scenario');
        replays = replays.map((chronicle)=>{
             return chronicle.works.filter(work=>work.filterSearchWord(formData.sw));
           });
        scenarios = scenarios.map((chronicle)=>{
          return chronicle.works.filter(work=>work.filterSearchWord(formData.sw));
        });
        scenarios = scenarios.filter(scenario=>scenario.length>0);
        replays = replays.filter(replay=>replay.length>0);
         var chronicles = results.filter((chronicle)=>{
              if(chronicle.title.includes(formData.sw)){return true}
              return false;
          });
        res.json({chronicles:chronicles, replays:replays,scenarios:scenarios });
      });
    });
  }else{
    Chronicle.find({enabled:true})//({$or:[{}],enabled: true})//,] },
    .populate({path:'works', match:{enabled:true,$or:[{'versions.title':new RegExp(formData.sw,"i")},
    {'versions.content':new RegExp(formData.sw,"i")},{hashTags:hashTag._id}]}})
    .exec((err,results)=>{
      if(err)console.log(err)
      results = results.filter(chronicle=>chronicle.works.length>0);
      // res.redirect('/search/'+formData.sw,{results:results});
      var replays = results.filter(chronicle=>chronicle.onModel==='Replay');
      var scenarios= results.filter(chronicle=>chronicle.onModel==='Scenario');
      replays = replays.map((chronicle)=>{
           return chronicle.works.filter(work=>work.filterSearchWord(formData.sw));
         });
      scenarios = scenarios.map((chronicle)=>{
        return chronicle.works.filter(work=>work.filterSearchWord(formData.sw));
      });
      scenarios = scenarios.filter(scenario=>scenario.length>0);
      replays = replays.filter(replay=>replay.length>0);
       var chronicles = results.filter((chronicle)=>{
            if(chronicle.title.includes(formData.sw)){return true}
            return false;
        });
      res.json({chronicles:chronicles, replays:replays,scenarios:scenarios });
    });
  }
    // res.json({ result: result });
});

router.post("/signup",function(req,res,next){  
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ userEmail: email })
      .then(user => {
        if(user) {
          req.flash("error","사용자가 이미 있습니다.");
          return res.redirect("/signup");          
          // return res.status(400).json({
          //   userEmail: "해당 이메일을 가진 사용자가 존재합니다."
          // })
        } else {
          var newUser = new User({
            userEmail: email,
            userPasswd: password
          });
          
        newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      }
      req.flash("info","성공적인 회원가입을 축하드립니다!");
      return res.redirect("/");
    })
    .catch(err => console.log(err));
}
// ,passport.authenticate("login",{
//   successRedirect:"/",
//   failureRedirect:"/signup",
//   failureFlash:true
// })
);
router.post("/signup/google",function(req,res,next){  
  passport.authenticate('google', { scope: ['profile'] })

  User.findOne({ userEmail: email })
      .then(user => {
        if(user) {
          req.flash("error","사용자가 이미 있습니다.");
          return res.redirect("/signup");          
          // return res.status(400).json({
          //   userEmail: "해당 이메일을 가진 사용자가 존재합니다."
          // })
        } else {
          var newUser = new User({
            userEmail: email,
            userPasswd: password
          });
          
        newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      }
      req.flash("info","성공적인 회원가입을 축하드립니다!");
      return res.redirect("/");
    })
    .catch(err => console.log(err));
});
router.post("/login",passport.authenticate("login",{failureFlash: true }),(req,res)=>{
  if(req.session.current_url != "undefined"&&req.session.current_url != undefined){
    console.log(req.session.current_url)
    // res.redirect(req.session.current_url);
    res.json({redirect:req.session.current_url, currentUser:req.user})
  }else{
    // res.redirect("/");
    res.json({redirect:"/", currentUser:req.user})
  }
}
);

router.post('/login/google', passport.authenticate('google',{failureFlash: true }),(req,res)=>{
  if(req.session.current_url != "undefined"&&req.session.current_url != undefined){
    console.log(req.session.current_url)
    res.json({redirect:req.session.current_url, currentUser:req.user})
  }else{
    res.json({redirect:"/", currentUser:req.user})
  }
}
);
// router.post('/login/google', function (req, res, next) {
//   const tokenId = req.body.data;
//   passport.authenticate('google');
//   // client.verifyIdToken({idToken:tokenId, audience:"376934500468-n23i56vurbm1eakqio5v3gmadhkmnfp2.apps.googleusercontent.com"})
//   // .then(response=>{
//   //   const {email_verified, name, email,picture} = response.payload;
//   //   console.log(response.payload)
//   //   if(email_verified){
//   //     User.findOne({'connections.connectType':'Google','connections.email':email})
//   //     .exec((err, user)=>{
//   //       if(err){
//   //         return res.status(400).json({error:"무언가 문제가 있습니다.;ㅁ;"});
//   //       }else{
//   //         if (user) { // 회원 정보가 있으면 로그인
//   //           console.log("들어감4");
//   //           return cb(null, user);
//   //         }else{
//   //           const newUser = new User({
//   //             // 없으면 회원 생성
//   //             userName:name,
//   //             userEmail:email,
//   //             userPasswd:"",
//   //             portrait:response.payload.picture,
//   //             connections:[{
//   //               connectType: 'Google',
//   //               email: email,
//   //             }]
//   //           });
//   //           newUser.save(user => {
//   //             return cb(null, user); // 새로운 회원 생성 후 로그인
//   //           });
//   //         }
//   //       }
//   //     })
//   //   }
//   // })
// });

router.post('/login/google/callback', passport.authenticate('google',  {
  failureRedirect: '/login',
  successRedirect: '/'
}));

// router.post("/passwd/check",passport.authenticate("password-check",{failureFlash: true }),(req,res)=>{
//     res.json({success:true, redirect:"/"})
// });
router.post("/test",function (req, res, next) {
  var data = req.body;
  console.log(data);
}
);

router.post("/logout",function(req,res){
  req.logout();
//   req.session.destroy((err)=>{
//     if (err) {
//         console.log(err);
//         return next(err);
//     }
//     req.user = null;
//     res.json({success:true, currentUser:[], redirect:"/"});
// });
  res.json({success:true, currentUser:[], redirect:"/"});
});

function sortWorks(chronicles, user){
  var newsWorks =[]; 
  var scenarioWorks =[]; 
  var replayWorks =[]; 
  chronicles.map(chronicle=>{
    if(chronicle.onModel==='News'){
      newsWorks.concat(chronicle.works);
    }
  })

  var news;
  var recommandScenarios;
  var recommandReplays;
  var monthScenarios;
  var monthReplays;
  var dayScenarios;
  var dayReplays;
  var weekScenarios;
  var weekReplays;
  var newScenarios;
  var newReplays;

  newsWorks.map(work=>{
    
  });



  return {news: news, 
    recommandScenarios:recommandScenarios,
    recommandReplays:recommandReplays,
    monthScenarios:monthScenarios,
    monthReplays:monthReplays,
    dayScenarios:dayScenarios,
    dayReplays:dayReplays,
    weekScenarios:weekScenarios,
    weekReplays:weekReplays,
    newScenarios:newScenarios,
    newReplays:newReplays}
}

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    next();
  }else{
    req.flash("info","먼저 로그인해야 이 페이지를 볼 수 있습니다.");
    res.redirect("/login");
  }
}
module.exports = router;

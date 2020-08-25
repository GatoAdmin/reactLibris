var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
const bcrypt = require('bcryptjs');
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
router.get("/",function(req,res,next){
  User.find().sort({create:"descending"})
  .exec(function(err,users){
    if(err){return next(err);}
    // res.render('main/index', { title: 'Express' });
    req.session.current_url = req.originalUrl;
    if(req.user){//TODO:나중에 처음 방문한 경우만 랜딩페이지를 띄워주는것으로 바꿀것
      res.render("main/index",{users:users});
    }else{
      res.render("main/landing");
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
    .populate({path:'works', match:{$or:[{title:new RegExp(formData.sw,"i")},{'versions.content':new RegExp(formData.sw,"i")},{hashTag:hashTag._id}]}})
    .exec((err,results)=>{
      if(err)console.log(err)
      results = results.filter(result=>result.works.length>0)
      // res.redirect('/search/'+formData.sw,{results:results});
      res.json({results:results});
    });
  });
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

// router.get("/users/:useremail",function(req,res,next){
//   User.findOne({userEmail:req.params.useremail},function(err,user){
//     if(err) {return next(err);}
//     if(!user){return next(404);}
//     res.render("profile",{user:user});
//   });
// });
router.get("/login",function(req,res){
  if(!req.user){
    res.render("login/login");
  }else{
    req.flash("error","이미 로그인 되어있습니다.");
    return res.redirect(req.session.current_url);          
  }
});

router.post("/login",passport.authenticate("login",{
  // successRedirect: "/",
  failureRedirect: "/login",
  failureFlash : true
}),(req,res)=>{
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
router.get('/login/google', function (req, res, next) {
  passport.authenticate('google', { scope: ['profile'] })
});
router.get('/login/google/callback', passport.authenticate('google',  {
  failureRedirect: '/login',
  successRedirect: '/'
}));


router.post("/test",function (req, res, next) {
  var data = req.body;
  console.log(data);
}
);
router.get("/logout",function(req,res){
  req.logout();
  res.json({currentUser:[], redirect:"/"});
  // res.redirect("/");
});

router.post("/logout",function(req,res){
  req.logout();
  res.json({currentUser:[], redirect:"/"});
});
function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    next();
  }else{
    req.flash("info","먼저 로그인해야 이 페이지를 볼 수 있습니다.");
    res.redirect("/login");
  }
}
module.exports = router;

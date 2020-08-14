var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
const bcrypt = require('bcryptjs');

//템플릿용 변수 설정
router.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.title = '리브리스';
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('main/index', { title: 'Express' });
// });

// router.get('/login', function(req, res, next) {
//   res.render('login/login', { title: 'Express' });
// });

// router.get('/regist', function(req, res, next) {
//   res.render('account/registration', { title: 'Express' });
// });

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

router.get("/undefined",function(req,res,next){
    res.redirect("/");
  });
  
router.get("/signup",function(req,res){
  res.render('account/signup');
});
router.post("/masterTags", function (req, res, next) {
    MasterTag.aggregate().match({ enabled: true, })
  .project({
    _id: 0,
    name: 1,
    tags: { _id: 1, tag: 1 },
  })
  .exec((err, results) => {
    return res.json({ masterTags: results });
  });
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
  if(req.session.current_url != "undefined"){
    res.redirect(req.session.current_url);
  }
}
);

router.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});
function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    next();
  }else{
    req.flash("info","먼저 로그인해야 이 페이지를 볼 수 있습니다.");
    res.redirect("/login");
  }
}
// router.get("/edit",ensureAuthenticated,function(req,res){
//   res.render("edit");
// });
// //put메서드는 현재 html에서 get post만 되니까 post로 일단 구현
// router.post("/edit",ensureAuthenticated,function(req,res,next){
//   req.user.displayName = req.body.displayname;
//   req.user.bio = req.body.bio;
//   req.user.save(function(err){
//     if(err){next(err);return;}
//     req.flash("info","Profile updated!");
//     res.redirect("/edit");
//   });
// });
module.exports = router;

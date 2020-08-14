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
  
  router.get("/",function(req,res,next){
    User.find().sort({create:"descending"})
    .exec(function(err,users){
       if(err){return next(err);}
       res.render("news/news",{users:users});
    });
  });

  
module.exports = router;
var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
var Chronicle = mongoose.model('Chronicle');
var Replay = mongoose.model('Replay');
var Scenario = mongoose.model('Scenario');
var Comment = mongoose.model('Comment');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash("info", "먼저 로그인해야 댓글을 달 수 있습니다.");
      res.redirect("/login");
    }
  }

  router.post("/:id", function (req, res, next) {
    var findId = toObjectId(req.param("id"));
    Chronicle.findOne({_id:findId,enabled: true})
    .populate({path:'works',populate:{path:'author',select:'userName userEmail -_id'},select:'isAgreeComment author versions rule price viewUsers enabled isOpened -_id'})
    .exec(function (err, result){
        if (err) { console.log(err); return next(err); }
        if (!result) { return next(404); }
        if(req.user){
          if(req.user.userEmail!==result.author.userEmail){
            if(!result.isOpened){
              result = null;
            }else{
              result.works.filter(work=>work.enabled&&work.isOpened);
            }
          }
        }
        return res.json({chronicle: result,currentUser:req.user!=null?req.user.userEmail:null});
      });
  });

  function toObjectId(strings) {
    if (Array.isArray(strings)) {
      return strings.map(mongoose.Types.ObjectId);
    }
    return mongoose.Types.ObjectId(strings);
  }
  
module.exports = router;
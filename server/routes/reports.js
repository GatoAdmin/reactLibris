var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
var Chronicle = mongoose.model('Chronicle');
var Replay = mongoose.model('Replay');
var Scenario = mongoose.model('Scenario');
var Comment = mongoose.model('Comment');
var Report = mongoose.model('Report');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash("info", "먼저 로그인해야 댓글을 달 수 있습니다.");
      res.redirect("/login");
    }
  }

  router.post("/replays/:id/:version", function (req, res, next) {
    User.findOne({_id:req.user._id}).exec(function (err, user) {
      if (err) { console.log(err); return next(err); }
      if (typeof (user) == undefined || typeof (user) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
      Replay.findOne({_id: toObjectId(req.params.id), isOpened:true, enabled: true})
        .exec(function (err, result) {
          if (err) { console.log(err); return next(err); }
          if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
          var formData = req.body;
          console.log(formData);
          // newReport = new Report({
          //   user : req.user._id,
          //   reportObject:{
          //     work:{
          //       article: toObjectId(req.params("id")),
          //       version: req.params("version")
          //     }
          //   },
          //   reason:{
          //     reasonKind :reportForm.reasonKind,
          //     detail:reportForm.detail
          //   }
          // });
  
          // newReport.save();
          // result.reported.push([{
          //   reason:newReport._id
          // }]);
          
          // result.save(); 
          res.json(true);
        });
    });
  });
  

  router.post("/add/:id", ensureAuthenticated, function (req, res, next) {
    var findId = toObjectId(req.param("id"));
    Chronicle.findOne({works:findId,enabled: true, isOpened: true}).populate('works')
    .exec(function (err, result){
        if (err) { return next(err); }
        if (!result) { return next(404); }

        var formData = req.body;
        var user = req.user;
        var work = result.works.find(value => value.id === req.param("id"));
    
        var newComment = new Comment({
          user: user._id,
          onModel: result.onModel,
          article: work.id,
          version: work.versions.length - 1,
          content: formData.comment,
        });
        newComment.save(err, comment => {
          if (err) { console.error(err); return next(err); }
          var returnUrlStr = "/";
          if(result.onModel === 'Replay'){
            returnUrlStr = "/replays/view/"
          }else if(result.onModel === 'Scenario'){
            returnUrlStr = "/scenarios/view/"
          }else if(result.onModel === 'News'){
            returnUrlStr = "/news/view/"
          }
          return res.redirect(returnUrlStr + req.param("id"));
        });

    });
  });

  router.post("/delete/:id", ensureAuthenticated, function (req, res, next) {
      console.log("들어옴");
    Comment.findOne({ _id: toObjectId(req.param("id")), user:req.user._id, enabled: true})
    .populate('article')
    .exec(function (err, result) {
      if (err) { return next(err); }
      if (!result) { return next(404); }
  
      result.enabled = false;
      result.save(err, comment => {
        if (err) { console.error(err); return next(err); }
        var returnUrlStr = "/";
        if(result.onModel === 'Replay'){
          returnUrlStr = "/replays/view/"
        }else if(result.onModel === 'Scenario'){
          returnUrlStr = "/scenarios/view/"
        }else if(result.onModel === 'News'){
          returnUrlStr = "/news/view/"
        }
        return res.redirect(returnUrlStr + result.article.id );
      });
  
    });
  });
  
  router.post("/recomment/:id", ensureAuthenticated, function (req, res, next) {
    Comment.findOne({ _id: toObjectId(req.param("id")), enabled: true })
    .populate('article')
    .exec(function (err, result) {
      if (err) { return next(err); }
      if (!result) { return next(404); }
  
      var formData = req.body;
      var user = req.user;
      var article = result.article;

      var newComment = new Comment({
        user: user._id, 
        onModel: result.onModel,
        article: article.id,
        version: article.versions.length - 1,
        content: formData.comment,
        replyOrigin : result._id
      });
      newComment.save(err, comment => {
        if (err) { console.error(err); return next(err); }
        var returnUrlStr = "/";
        if(result.onModel === 'Replay'){
          returnUrlStr = "/replays/view/"
        }else if(result.onModel === 'Scenario'){
          returnUrlStr = "/scenarios/view/"
        }else if(result.onModel === 'News'){
          returnUrlStr = "/news/view/"
        }
        return res.redirect(returnUrlStr + article.id);
      });
  
    });
  });
  

  function toObjectId(strings) {
    if (Array.isArray(strings)) {
      return strings.map(mongoose.Types.ObjectId);
    }
    return mongoose.Types.ObjectId(strings);
  }
  
module.exports = router;
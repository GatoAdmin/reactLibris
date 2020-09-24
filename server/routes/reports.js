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
      req.flash("info", "먼저 로그인해야 신고할 수 있습니다.");
      res.redirect("/login");
    }
  }

  router.post("/replays/:id/:version",ensureAuthenticated, function (req, res, next) {
    User.findOne({_id:req.user._id}).exec(function (err, user) {
      if (err) { console.log(err); return next(err); }
      if (typeof (user) == undefined || typeof (user) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
      Replay.findOne({_id: toObjectId(req.params.id), isOpened:true, enabled: true})
        .exec(function (err, result) {
          if (err) { console.log(err); return next(err); }
          if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
          var formData = req.body;
          console.log(formData);
          
          newReport = new Report({
            user : req.user._id,
            reportObject:{
              work:{
                article: toObjectId(req.params.id),
                onModel:'Replay',
                version: req.params.version
              }
            },
            reason:{
              reasonKind :formData.reasonKind,
              detail:formData.detail
            }
          });
  
          newReport.save();
          res.json({success:true});
        });
    });
  });
  
  router.post("/scenarios/:id/:version",ensureAuthenticated, function (req, res, next) {
    User.findOne({_id:req.user._id}).exec(function (err, user) {
      if (err) { console.log(err); return next(err); }
      if (typeof (user) == undefined || typeof (user) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
      Scenario.findOne({_id: toObjectId(req.params.id), isOpened:true, enabled: true})
        .exec(function (err, result) {
          if (err) { console.log(err); return next(err); }
          if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
          var formData = req.body;
          console.log(formData);
          
          newReport = new Report({
            user : req.user._id,
            reportObject:{
              work:{
                article: toObjectId(req.params.id),
                onModel:'Scenario',
                version: req.params.version
              }
            },
            reason:{
              reasonKind :formData.reasonKind,
              detail:formData.detail
            }
          });
  
          newReport.save();
          res.json({success:true});
        });
    });
  });
  
  router.post("/comment/:id",ensureAuthenticated, function (req, res, next) {
    User.findOne({_id:req.user._id}).exec(function (err, user) {
      if (err) { console.log(err); return next(err); }
      if (typeof (user) == undefined || typeof (user) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
      Comment.findOne({_id: toObjectId(req.params.id), 'stopped.isStopped':false, enabled: true})
        .exec(function (err, result) {
          if (err) { console.log(err); return next(err); }
          if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
          var formData = req.body;
          
          newReport = new Report({
            user : req.user._id,
            reportObject:{
              comment: toObjectId(req.params.id)
            },
            reason:{
              reasonKind :formData.reasonKind,
              detail:formData.detail
            }
          });
  
          newReport.save();

          res.json({success:true});
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
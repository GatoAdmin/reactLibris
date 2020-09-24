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

  router.post("/:id", function (req, res, next) {
    var findId = toObjectId(req.params.id);
    Chronicle.findOne({works:findId,enabled: true, isOpened: true})
    .populate({path:'works',match:{'_id':findId},populate:{path:'author',select:'userName userEmail -_id'},select:'isAgreeComment author -_id'})
    .exec(function (err, result){
        if (err) { return next(err); }
        if (!result) { return next(404); }

        var formData = req.body;
        var user = req.user;
        var work = result.works.find(value => value.id === findId);
    Comment.find({article:findId, enabled: true, replyOrigin:null})
    .populate({path:'user',select:'userName userEmail -_id'})
    .populate({path:'recomments', populate:{path:'user',select:'userName userEmail -_id'}})
    .exec(function (err, comments){
        if (err) { return next(err); }
        if (!comments) { return next(404); }
        if(req.user != null){
          Report.find({user:req.user._id, enabled:true}).exec(function(err, reports){
            if(err){console.log(err);next(err);}
            comments= comments.map(function(comment){
              comment.isRecommend = comment.recommendUsers.findIndex(element=>element.user.equals(user._id))>-1?true:false;
              comment.isDecommend = comment.decommendUsers.findIndex(element=>element.user.equals(user._id))>-1?true:false;
              if(reports!=undefined)comment.isReported = reports.findIndex(element=>comment._id.equals(element.reportObject.comment))>-1?true:false;
              return comment;
            });
            return res.json({comments: comments,article:result.works[0],currentUser:req.user!=null?req.user.userEmail:null});
          });
        }else{
          return res.json({comments: comments,article:result.works[0],currentUser:req.user!=null?req.user.userEmail:null});
        }
      });
    });
  });

  router.post("/view/:id", function (req, res, next) {
    var findId = toObjectId(req.param("id"));
    var user = req.user;
    Comment.find({'_id':findId, enabled: true})
    .populate('article')
    .populate({path:'user',select:'userName userEmail -_id'})
    .populate({path:'recomments', populate:{path:'user',select:'userName userEmail -_id'}})
    .exec(function (err, comments){
        if (err) { return next(err); }
        if (!comments) { return next(404); }
        
        if(req.user != null){
          comments.map(function(comment){
            comment.is_recommend = comment.recommendUsers.findIndex(element=>element.user.equals(user._id))>-1?true:false;
            comment.is_decommend = comment.decommendUsers.findIndex(element=>element.user.equals(user._id))>-1?true:false;
          });
        }
        return res.json({comments: comments, article:comments[0].article, currentUser:req.user!=null?req.user.userEmail:null});
      });
  });

  router.post("/recommend/:id", ensureAuthenticated, function (req, res, next) {
    var currentUserId = req.user._id;
    Comment.findOne({ _id: toObjectId(req.param("id")), enabled: true})
    .exec(function (err, result) {
      if (err) { return next(err); }
      if (!result) { return next(404); }
 
      var recommendUserIndex = result.recommendUsers.findIndex(element=>element.user.equals(currentUserId));
        
      if(recommendUserIndex > -1)
      {
        result.recommendUsers.splice(recommendUserIndex,1);
      }else{
        result.recommendUsers.push({user:currentUserId});
        var decommendUserIndex = result.decommendUsers.findIndex(element=>element.user.equals(currentUserId));
        if(decommendUserIndex > -1){
          result.decommendUsers.splice(decommendUserIndex,1);
        }
      }

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
        return res.redirect(returnUrlStr + result.article );
      });
  });
});

router.post("/decommend/:id", ensureAuthenticated, function (req, res, next) {
  var currentUserId = req.user._id;
  Comment.findOne({ _id: toObjectId(req.param("id")), enabled: true})
  .exec(function (err, result) {
    if (err) { return next(err); }
    if (!result) { return next(404); }

    var decommendUserIndex = result.decommendUsers.findIndex(element=>element.user.equals(currentUserId));
      
    if(decommendUserIndex > -1)
    {
      result.decommendUsers.splice(decommendUserIndex,1);
    }else{
      result.decommendUsers.push({user:currentUserId}); 
      var recommendUserIndex = result.recommendUsers.findIndex(element=>element.user.equals(currentUserId));
      if(recommendUserIndex > -1)
      {
        result.recommendUsers.splice(recommendUserIndex,1);
      }
    }

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
      return res.redirect(returnUrlStr + result.article );
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
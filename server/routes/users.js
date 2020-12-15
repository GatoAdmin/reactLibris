var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
var Scenario = mongoose.model('Scenario');
var Replay = mongoose.model('Replay');
var Comment = mongoose.model('Comment');
var Report = mongoose.model('Report');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
var MasterTag = mongoose.model('MasterTag');
var masterTags = null;
MasterTag.aggregate().match({ enabled: true, })
.project({
  _id: 0,
  name: 1,
  tags: { _id: 1, tag: 1 },
})
.exec((err, results) => {
  masterTags = results
});

// var passport = require('../config/passport'); // 1
//템플릿용 변수 설정
router.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "먼저 로그인해야 이 페이지를 볼 수 있습니다.");
    res.redirect("/login");
  }
}
var mongoose = require('mongoose');
// var UserSchaema = require('../models/userInfo').UserInfoSchema;

var User = mongoose.model('UserInfo');

const bcrypt = require('bcryptjs');


/* POST users listing. */
router.post('/', function(req, res, next) {
  var currentUser = null;
  if(!req.user){
    currentUser = [];
  }else{
    currentUser = req.user;
    console.log(currentUser.saveScenarios)
  }
  res.json({currentUser:currentUser})
});

router.post("/block/user/:username",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(!user._id.equals(req.user._id)){
      var redirectStr = "/user/" + req.params.username;
      var findIndex=req.user.blockList.userList.findIndex(blockUser=>blockUser.content.equals(user._id));
      if(findIndex>-1){
        req.user.blockList.userList.splice(findIndex,1);
        req.user.save(err,result=>{
          if (err) { console.error(err); return next(err); }
          req.flash("info", "해당 유저차단이 해제되었습니다.");
          return res.json({redirect:req.session.current_url});
        });
      }else{
        req.user.blockList.userList.push({content:user._id});
        req.user.save(err,result=>{
          if (err) { console.error(err); return next(err); }
          req.flash("info", "해당 유저가 차단되었습니다.");
          return res.json({redirect:req.session.current_url});
        });
      }
    }else{
      req.flash("error", "잘못된 접근방식입니다.");
      return res.redirect("/");
    }
  });
});

router.post("/block/scenarios/:id",ensureAuthenticated,function(req,res,next){
  Scenario.findOne({$and:[{_id:req.param("id")},{enabled: true}]})
  .exec(function(err,result){
    if(err) {return next(err);}
    if(!result){return next(404);}
      var redirectStr = "/scenarios/view/"+ req.param("id");
      var findIndex=req.user.blockList.scenarioList.findIndex(block=>block.content.equals(result._id));
      if(findIndex>-1){
        req.user.blockList.scenarioList.splice(findIndex,1);
        req.user.save(err,result=>{
          if (err) { console.error(err); return next(err); }
          req.flash("info", "해당 작품의 차단이 해제되었습니다.");
          return res.json({redirect:req.session.current_url});
        });
      }else{
        req.user.blockList.scenarioList.push({content:result._id});
        req.user.save(err,result=>{
          if (err) { console.error(err); return next(err); }
          req.flash("info", "해당 작품이 차단되었습니다.");
          return res.json({redirect:req.session.current_url});
        });
      }
  });
});

router.post("/block/replays/:id",ensureAuthenticated,function(req,res,next){
  Replay.findOne({$and:[{_id:req.param("id")},{enabled: true}]})
  .exec(function(err,result){
    if(err) {return next(err);}
    if(!result){return next(404);}
    var redirectStr = "/replays/view/"+ req.param("id");
      var findIndex=req.user.blockList.replayList.findIndex(block=>block.content.equals(result._id));
      if(findIndex>-1){
        req.user.blockList.replayList.splice(findIndex,1);
        req.user.save(err,user=>{
          if (err) { console.error(err); return next(err); }
          req.flash("info", "해당 작품의 차단이 해제되었습니다.");
          return res.json({redirect:req.session.current_url});
        });
      }else{
        req.user.blockList.replayList.push({content:result._id});
        req.user.save(err,user=>{
          if (err) { console.error(err); return next(err); }
          req.flash("info", "해당 작품이 차단되었습니다.");
          return res.json({redirect:req.session.current_url});
        });
      }
  });
});

router.post("/:username",function(req,res,next){
  User.findOne({userName:req.params.username})
  .populate('chronicles')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    var isReported = false;
    req.session.current_url = req.originalUrl;
    if(req.user!=null){
      Report.find({user:req.user._id, enabled:true}).exec(function(err,results){
        if(err) {return next(err);}
        if(results!==undefined&&results!==null){
          isReported = true;
          return res.json({user:user, isReported:isReported,masterTagRules:masterTags.find(tags=>tags.name=="rule").tags})
        }
      });
    }else{ 
      return res.json({user:user, isReported:isReported, masterTagRules:masterTags.find(tags=>tags.name=="rule").tags});
    }
  });
});

router.post("/:username/edit",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(user._id.equals(req.user._id)){
      res.json({profile:user.profile, masterTagRules:masterTags.find(tags=>tags.name=="rule").tags});
    }else{
      req.flash("error", "잘못된 접근방식입니다.");
      res.redirect("/");
    }
  });
});

router.post("/:username/save",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(user._id.equals(req.user._id)){
      var formData = req.body;
      var dataProfile = JSON.parse(formData.data_profile);

      user.profile.contacts = dataProfile.contacts;
      user.profile.preferPlayStyle = dataProfile.preferPlayStyle;
      user.profile.preferRules = dataProfile.preferRules;
      user.profile.canMasterRules =  dataProfile.canMasterRules;
      user.profile.haveRules = dataProfile.haveRules;
      user.profile.wentToScenarios = dataProfile.wentToScenarios;
      user.profile.canMasterScenarios = dataProfile.canMasterScenarios;
      user.profile.ngMaterials = dataProfile.ngMaterials;
      
      user.save(err, result =>{ 
        if (err) { console.error(err); return next(err); }
        req.flash("info", "성공적으로 수정되었습니다.");
        return res.redirect("/user/" + req.params.username);
      });

    }else{
      req.flash("error", "잘못된 접근방식입니다.");
      res.redirect("/");
    }
  });
});
router.post("/:username/introudtion/save",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(user._id.equals(req.user._id)){
      var formData = req.body;
      
      user.profile.introduction = formData.article;
      
      user.save(err, result =>{ 
        if (err) { console.error(err); return next(err); }
        req.flash("info", "성공적으로 수정되었습니다.");
        return res.redirect("/user/" + req.params.username);
      });
    }else{
      req.flash("error", "잘못된 접근방식입니다.");
      res.redirect("/");
    }
  });
});

router.post("/:username/calendar",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(user._id.equals(req.user._id)){
      req.session.current_url = req.originalUrl;
      res.json({calendar:user.profile.calendar});
    }else{
      req.flash("error", "잘못된 접근방식입니다.");
      res.redirect("/");
    }
  });
});

router.post("/:username/calendar/repeat/save",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(user._id.equals(req.user._id)){
      var formData = req.body.data;

      if(formData._id !=null){
        var userList = user.profile.calendar.repeatSchedules;
        if(userList.some(schedule=>schedule.equals(toObjectId(formData._id)))){
            var startTime = formData.startTime.split(":");
            var endTime= formData.endTime.split(":");
            startTime = startTime.map(t=> Number(t));
            endTime = endTime.map(t=> Number(t));
            editSchedule = {
              title:formData.title,
              repeat:formData.repeat,
              color:formData.color,
              startTime:startTime,
              endTime:endTime,
              desc: formData.desc
            }
            userList.splice(userList.findIndex(schedule=>schedule.equals(toObjectId(formData._id))),1,editSchedule);
            user.profile.calendar.repeatSchedules = userList;

            user.save(err, result =>{ 
              if (err) { console.error(err); return next(err); }
              req.flash("info", "성공적으로 수정되었습니다.");
              return res.json({success:true});
            });
            return true;
      }
    }else{
        var startTime = formData.times[0].split(":");
        var endTime= formData.times[1].split(":");
        startTime = startTime.map(t=> Number(t));
        endTime = endTime.map(t=> Number(t));
        user.profile.calendar.repeatSchedules.push({
            title:formData.title,
            repeat:formData.rrule,
            color:formData.color,
            startTime:startTime,
            endTime:endTime,
            desc: formData.desc
        });
      }
      
      user.save(err, result =>{ 
        if (err) { console.error(err); return next(err); }
        req.flash("info", "성공적으로 추가 되었습니다.");
        return res.json({success:true});
      });
      return true;
    }else{
      req.flash("error", "잘못된 접근방식입니다.");
      res.redirect("/");
    }
  });
});


router.post("/:username/calendar/save",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(user._id.equals(req.user._id)){
      var formData = req.body;
      var startTime = new Date(formData.dateTimes_from);
      var endTime= new Date(formData.dateTimes_to);
      if(formData.id !=null&&formData.id !=''){
        var  editSchedule = {
            title:formData.title,
            allDay:formData.allDay,
            color:formData.color,
            start:startTime,
            end:endTime,
            desc: formData.desc
        };

        var userList = user.profile.calendar.schedules;
        if(userList.some(schedule=>schedule.equals(toObjectId(formData.id)))){
              userList.splice(userList.findIndex(schedule=>schedule.equals(toObjectId(formData.id))),1,editSchedule);
              user.profile.calendar.schedules = userList;
        }      
      }else{
        user.profile.calendar.schedules.push({
            title:formData.title,
            allDay:formData.allDay,
            color:formData.color,
            start:startTime,
            end:endTime,
            desc: formData.desc
        });
        
      }
      user.save(err, result =>{ 
        if (err) { console.error(err); return next(err); }
        req.flash("info", "성공적으로 추가 되었습니다.");
        // return res.json({success:true});
        res.redirect(req.session.current_url);
      });
   }else{
      req.flash("error", "잘못된 접근방식입니다.");
      res.redirect("/");
    }
  });
});


router.post("/:username/calendar/repeat/edit",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(user._id.equals(req.user._id)){
      var formData = req.body.data;
      var startTime = formData.times[0].split(":");
      var endTime= formData.times[1].split(":");
      startTime = startTime.map(t=> Number(t));
      endTime = endTime.map(t=> Number(t));
      editSchedule = {
        title:formData.title,
        repeat:formData.rrule,
        startTime:startTime,
        endTime:endTime,
        desc: formData.desc
    }

      var userList = user.profile.calendar.repeatSchedules;
      if(userList.some(schedule=>schedule.equals(toObjectId(req.param("id"))))){
            userList.splice(userList.findIndex(schedule=>schedule.equals(toObjectId(req.param("id")))),1,editSchedule);
            user.profile.calendar.repeatSchedules = userList;

            user.save(err, result =>{ 
              if (err) { console.error(err); return next(err); }
              req.flash("info", "성공적으로 수정되었습니다.");
              return res.json({success:true});
            });
      }      
      
    }else{
      req.flash("error", "잘못된 접근방식입니다.");
      res.redirect("/");
    }
  });
});


router.post("/:username/calendar/:id/edit",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(user._id.equals(req.user._id)){
      var formData = req.body;
      var startTime = new Date(formData.dateTimes_from);
      var endTime= new Date(formData.dateTimes_to);
      editSchedule = {
          title:formData.title,
          allDay:formData.allDay,
          start:startTime,
          end:endTime,
          desc: formData.desc
      };

      var userList = user.profile.calendar.schedules;
      if(userList.some(schedule=>schedule.equals(toObjectId(req.param("id"))))){
            userList.splice(userList.findIndex(schedule=>schedule.equals(toObjectId(req.param("id")))),1,editSchedule);
            user.profile.calendar.schedules = userList;

            user.save(err, result =>{ 
              if (err) { console.error(err); return next(err); }
              req.flash("info", "성공적으로 수정되었습니다.");
              // return res.json({success:true});
              res.redirect(req.session.current_url);
            });
      }      
   }else{
      req.flash("error", "잘못된 접근방식입니다.");
      res.redirect("/");
    }
  });
});
// router.post("/:username/calendar/repeat/:id/delete",ensureAuthenticated,function(req,res,next){
//   User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
//   .exec(function(err,user){
//     if(err) {return next(err);}
//     if(!user){return next(404);}
//     if(user._id.equals(req.user._id)){


//     }else{
//       req.flash("error", "잘못된 접근방식입니다.");
//       res.redirect("/");
//     }
//   });
// });


router.post("/:username/calendar/delete",ensureAuthenticated,function(req,res,next){
  User.findOne({$and:[{userName:req.params.username},{enabled: true}]})
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    if(user._id.equals(req.user._id)){
      var calendar = user.profile.calendar;
      var schedulesId = req.body.data;
      if(calendar.schedules.some(schedule=>schedule.equals(toObjectId(schedulesId)))){
        var userList = calendar.schedules;
            userList.splice(userList.findIndex(schedule=>schedule.equals(toObjectId(schedulesId))),1);
            user.profile.calendar.schedules = userList;
            user.save(err, result =>{ 
              if (err) { console.error(err); return next(err); }
              req.flash("info", "성공적으로 수정되었습니다.");
              return res.json({success:true,calendar:user.profile.calendar});
              // res.redirect(req.session.current_url);
            });
      }else if(calendar.repeatSchedules.some(schedule=>schedule.equals(toObjectId(schedulesId)))){
        
        console.log("들어옴");
          var userList = calendar.repeatSchedules;
              userList.splice(userList.findIndex(schedule=>schedule.equals(toObjectId(schedulesId))),1);
              user.profile.calendar.repeatSchedules = userList;
  
              user.save(err, result =>{ 
                if (err) { console.error(err); return next(err); }
                req.flash("info", "성공적으로 삭제되었습니다.");
                return res.json({success:true,calendar:user.profile.calendar});
              });
      }
   }else{
      req.flash("error", "잘못된 접근방식입니다.");
      res.redirect("/");
    }
  });
});
/*
router.get("/comments", ensureAuthenticated,function(req,res,next){
  Comment.find({user:req.user._id})
  .exec(function(err,results){
    if(err) {return next(err);}
    if(!results){return next(404);}
    req.session.current_url = req.originalUrl;
    res.render("userPage/myComments",{user:req.user.toJSON(),moment});
  });
});

router.post("/comments", ensureAuthenticated,function(req,res,next){
  Comment.find({user:req.user._id})
  .exec(function(err,results){
    if(err) {return next(err);}
    if(!results){return next(404);}
    req.session.current_url = req.originalUrl;
   res.json({comments:results, moment});
  });
});



router.get("/bookmark/replays", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('bookmarks.replayList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    req.session.current_url = req.originalUrl;
   res.render("userPage/userBookmarkReplay",{user:user.toJSON(), moment});
  });
});

router.post("/bookmark/replays", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('bookmarks.replayList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";
    var after_searchs = {};

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
      if (order == "descending") {
        if (alignType == "title") {
          alignType = "-versions.title"
        }else if(alignType == "author"){
          alignType = "-author.userName"
        }else {
          alignType = "-" + alignType;
        }
      } else {
        if (alignType == "title") {
          alignType = "versions.title"
        }else if(alignType == "author"){
          alignType = "author.userName"
        }
      }
  
      var search = data.searchs;

      if(search!=undefined){
        if(search.filter_author != ""){
          after_searchs.author = {};
          after_searchs.author.userName=search.filter_author;
        }
        if(search.filter_title != ""){
          after_searchs.versions = {};
          after_searchs.versions.title = {$regex:search.filter_title };
        }
         
        if (search.filter_rule.length > 0) {
          if (search.filter_rule[0] != "") {
            after_searchs.rule= { $in: toObjectId(search.filter_rule) };
          }
        }
      }
    }
    
    var results = user.bookmarks.replayList;
    
    // results = searchResult(results,after_searchs);
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,data.align_type, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({user:user, articles:results,masterTags : masterTags,  moment});
  });
});

router.post("/bookmark/replays/memo", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('bookmarks.replayList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
      if (order == "descending") {
        if (alignType == "title") {
          alignType = "-versions.title"
        }else if(alignType == "author"){
          alignType = "-author.userName"
        }else {
          alignType = "-" + alignType;
        }
      } else {
        if (alignType == "title") {
          alignType = "versions.title"
        }else if(alignType == "author"){
          alignType = "author.userName"
        }
      }
    }
    var results = user.bookmarks.replayList;
    var changeIndex = results.findIndex(result=>result.version==data.memo.version&&result.content._id.equals(data.memo.article))

    if(changeIndex > -1){
      results[changeIndex].memo = data.memo.text;
      user.bookmarks.replayList = results;
      user.save();
    }
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,data.align_type, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({user:user, articles:results,masterTags : masterTags,  moment});
  });
});

router.post("/bookmark/replays/delete", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('bookmarks.replayList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
      if (order == "descending") {
        if (alignType == "title") {
          alignType = "-versions.title"
        }else if(alignType == "author"){
          alignType = "-author.userName"
        }else {
          alignType = "-" + alignType;
        }
      } else {
        if (alignType == "title") {
          alignType = "versions.title"
        }else if(alignType == "author"){
          alignType = "author.userName"
        }
      }
    }
    var results = user.bookmarks.replayList;
    var deleteIndex = results.findIndex(result=>result.version==data.delete.version&&result.content._id.equals(data.delete.article))

    if(deleteIndex > -1){
      results.splice(deleteIndex,1);
      user.bookmarks.replayList = results;
      user.save();
    }
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,data.align_type, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({user:user, articles:results,masterTags : masterTags,  moment});
  });
});


router.get("/bookmark/scenarios", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('bookmarks.scenarioList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    req.session.current_url = req.originalUrl;
   res.render("userPage/userBookmarkScenario",{user:user.toJSON(), moment});
  });
});

router.post("/bookmark/scenarios", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('bookmarks.scenarioList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";
    var after_searchs = {};

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
      if (order == "descending") {
        if (alignType == "title") {
          alignType = "-versions.title"
        }else if(alignType == "author"){
          alignType = "-author.userName"
        }else {
          alignType = "-" + alignType;
        }
      } else {
        if (alignType == "title") {
          alignType = "versions.title"
        }else if(alignType == "author"){
          alignType = "author.userName"
        }
      }
  
      var search = data.searchs;

      if(search!=undefined){
        if(search.filter_author != ""){
          after_searchs.author = {};
          after_searchs.author.userName=search.filter_author;
        }
        if(search.filter_title != ""){
          after_searchs.versions = {};
          after_searchs.versions.title = {$regex:search.filter_title };
        }
         
        if (search.filter_rule.length > 0) {
          if (search.filter_rule[0] != "") {
            after_searchs.rule= { $in: toObjectId(search.filter_rule) };
          }
        }
      }
    }
    
    var results = user.bookmarks.scenarioList;
    
    // results = searchResult(results,after_searchs);
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,data.align_type, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({user:user, articles:results,masterTags : masterTags,  moment});
  });
});

router.post("/bookmark/scenarios/memo", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('bookmarks.scenarioList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
      if (order == "descending") {
        if (alignType == "title") {
          alignType = "-versions.title"
        }else if(alignType == "author"){
          alignType = "-author.userName"
        }else {
          alignType = "-" + alignType;
        }
      } else {
        if (alignType == "title") {
          alignType = "versions.title"
        }else if(alignType == "author"){
          alignType = "author.userName"
        }
      }
    }
    var results = user.bookmarks.scenarioList;
    var changeIndex = results.findIndex(result=>result.version==data.memo.version&&result.content._id.equals(data.memo.article))

    if(changeIndex > -1){
      results[changeIndex].memo = data.memo.text;
      user.bookmarks.scenarioList = results;
      user.save();
    }
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,data.align_type, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({user:user, articles:results,masterTags : masterTags,  moment});
  });
});

router.post("/bookmark/scenarios/delete", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('bookmarks.scenarioList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
      if (order == "descending") {
        if (alignType == "title") {
          alignType = "-versions.title"
        }else if(alignType == "author"){
          alignType = "-author.userName"
        }else {
          alignType = "-" + alignType;
        }
      } else {
        if (alignType == "title") {
          alignType = "versions.title"
        }else if(alignType == "author"){
          alignType = "author.userName"
        }
      }
    }
    var results = user.bookmarks.scenarioList;
    var deleteIndex = results.findIndex(result=>result.version==data.delete.version&&result.content._id.equals(data.delete.article))

    if(deleteIndex > -1){
      results.splice(deleteIndex,1);
      user.bookmarks.scenarioList = results;
      user.save();
    }
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,data.align_type, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({user:user, articles:results,masterTags : masterTags,  moment});
  });
});

function sortAfterResult(a, b, alignType,order){
  if(order =="descending" && alignType =="ruleTag"){   
    return a.content[alignType]<b.content[alignType]?-1:(a.content[alignType]>b.content[alignType]?1:0);
  }else if(order =="ascending" && alignType =="ruleTag"){   
    return a.content[alignType]<b.content[alignType]?1:(a.content[alignType]>b.content[alignType]?-1:0);
  }else if(order =="descending" && alignType =="title"){   
    return a.content.versions[a.version-1][alignType]<b.content.versions[b.version-1][alignType]?-1:(a.content.versions[a.version-1][alignType]>b.content.versions[b.version-1][alignType]?1:0);
  }else if(order =="ascending" && alignType =="title"){   
    return a.content.versions[a.version-1][alignType]<b.content.versions[b.version-1][alignType]?1:(a.content.versions[a.version-1][alignType]>b.content.versions[b.version-1][alignType]?-1:0);
  }else if(order =="descending" && alignType =="author"){   
    return a.content.author.userName<b.content.author.userName?-1:(a.content.author.userName>b.content.author.userName?1:0);
  }else if(order =="ascending" && alignType =="author"){   
    return a.content.author.userName<b.content.author.userName?1:(a.content.author.userName>b.content.author.userName?-1:0);
  }else if(order =="descending" && alignType =="created"){   
    return a[alignType] - b[alignType];
  }else if(order =="ascending" && alignType =="created"){   
    return b[alignType] -a[alignType] ;
  }
  return 0;
}
// function searchResult(results,search){
//   if(results != undefined){
//     if(search.author!=undefined){
//       results.filter(function(result){
//         return result.findAuthorUserName(search);
//       });
//     }
//     else if(search.versions !=undefined){//title
//       results.filter(function(result){
//         var search = new RegExp(search.versions.title, "i");
//         return result.versions[].title.match(search)!=""?true:false;
//       });

//     }else if(search.rule != undefined){
//       results.filter(function(result){
//         var search = new RegExp(obj.author.userName, "i");
//         return this.author.userName.match(search)!=""?true:false;
//       });

//     }
//   }

//   return results;
// }


*/

// router.post('/login',function(req, res, next){
  
//   const userEmail = req.body.email;
//   const userPasswd = req.body.password;

//   User.findOne({ userEmail })
//       .then(user => {
//         if(!user) {
//           errors.email = "해당하는 회원이 존재하지 않습니다."
//           return res.status(400).json(errors);
//         } 
        
//         bcrypt.compare(userPasswd, user.userPasswd)
//           .then(isMatch => {
//             if(isMatch) {
//                 // 회원 비밀번호가 일치할 때
//                 // JWT PAYLOAD 생성
//                 const payload = {
//                     id: user.id,
//                     email: user.userEmail
//                 };

//                 // JWT 토큰 생성
//                 // 1시간 동안 유효
//                 jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
//                     res.json({
//                         success: true,
//                         token: 'Libris ' + token
//                     })
//                 });
//                 res.redirect('/');
//                 // passport.authenticate()
//             } else {
//                 errors.password = "패스워드가 일치하지 않습니다.";
//                 return res.status(400).json(errors);
//             }
//         });
//       })
//  });
function toObjectId(strings) {
  if (Array.isArray(strings)) {
    return strings.map(mongoose.Types.ObjectId);
  }
  return mongoose.Types.ObjectId(strings);
}

module.exports = router;

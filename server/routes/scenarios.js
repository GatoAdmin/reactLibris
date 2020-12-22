var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
var Scenario = mongoose.model('Scenario');
var Chronicle = mongoose.model('Chronicle');
var MasterTag = mongoose.model('MasterTag');
var Comment = mongoose.model('Comment');
var HashTag = mongoose.model('HashTag');
var Report =  mongoose.model('Report');


const bcrypt = require('bcryptjs');
var moment = require('moment');
const { merge } = require('.');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
var nowDate = moment().format();
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
//템플릿용 변수 설정
router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.title = '리브리스';
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.current_url = req.originalUrl;
    req.flash("info", "먼저 로그인해야 이 페이지를 볼 수 있습니다.");
    res.redirect("/login");
  }
}

router.post("/", function (req, res, next) {
  var page= 0;
  var pageSize= 30;
  var data = req.body.params;
  if(req.query.p !== undefined||req.query.p !== null||req.query.ps !== undefined||req.query.ps !== null){ 
    page = req.query.p-1>0?req.query.p-1:0;
    pageSize = parseInt(req.query.ps,10);
  }

  var alignType = "-created";
  var order = "descending";
  if (data) {
    order = data.align_order;
    if (order == "descending") {
      if(alignType == "author"){
        alignType = "-author.userName"
      } else {
        alignType = "-" + data.align_type.toString();
      }
    } else {
      if(alignType == "author"){
        alignType = "author.userName"
      } else {
        alignType = data.align_type.toString();
      }
    }
  }

  var findSearch = {enabled: true,isOpened: true};
  Scenario.count(findSearch,function (err, count){
    if (err) { console.log(err); next(err); }
    Scenario.find(findSearch)
    .sort(alignType)
    .skip(pageSize*page)
    .limit(pageSize)
    .exec(function (err, results) {
      if (err) { console.log(err); next(err); }
      results = filterBlockResult(req.user,results);
      return res.json({ articles: results, totalSize: count, masterTags: masterTags });
    });
  })
});

router.post("/make", ensureAuthenticated, function (req, res, next) {
  User.findOne({id:req.user._id}, function (err, author) {
     newScenario = new Scenario({author:req.user._id});
     newScenario.save(function(err,scenario){
       res.json({id:scenario._id});  
    });
  })
})
// router.post("/make", ensureAuthenticated, function (req, res, next) {
//   var formData = req.body;
//   var article = formData.article;
//   var capacityMin = 1;
//   var capacityMax = 1;
//   var trpgTime = 1;
//   var orpgTime = 1;
//   var price = 0;
//   var user = req.user;
//   capacityMin = formData.capacity_min;
//   capacityMax = isChecked(formData.is_multiple_capacity) ? formData.capacity_max : formData.capacity_min;

//   if (isChecked(formData.is_online_time)) {
//     orpgTime = formData.predicting_time;
//     trpgTime = null;
//   } else {
//     orpgTime = null;
//     trpgTime = formData.predicting_time;
//   }

//   if (isChecked(formData.is_paid)) {
//     if (user.agreeList.paidContent.agree) {
//       price = formData.price;
//     } else {
//       if (isChecked(formData.is_agree_paid)) {
//         var nowDate = moment().format();
//         price = formData.price;
//         user.agreeList.paidContent = { agree: true, agreeDate: new Date(nowDate) };
//       }
//       user.save();
//     }
//   }

//   HashTag.findOne({name:formData.title_short})
//          .exec((err,result)=>{
//           if(err){next(err);}
//           var hashTags = [];

//           var newScenario = new Scenario({
//             author: user._id,
//             title: formData.title,
//             isFree: isChecked(formData.is_paid) ? false : true,
//             isAgreeComment: isChecked(formData.is_agree_comment),
//             rule: toObjectId(formData.rule),
//             price: isChecked(formData.is_paid) ? 0 : price,
//             versions: {
//               capacity: { max: capacityMax, min: capacityMin },
//               rating: formData.rating,
//               masterDifficulty: formData.masterDifficulty,
//               playerDifficulty: formData.playerDifficulty,
//               content: article,
//               backgroundTag: toObjectId(formData.background_tag),
//               genreTags: toObjectId(formData.genre_tags),
//               subTags: toObjectId(formData.sub_tags),
//               orpgPredictingTime: orpgTime,
//               trpgPredictingTime: trpgTime,
//             }
//           });
//           newScenario.save()
//           if(result==null||result==undefined){
//             var newHash = new HashTag({
//               name:formData.title_short,
//               article: newScenario._id,
//               onModel :'Replay'
//             })
//             newHash.save();
//             hashTags.push(newHash);
//           }else{
//             result.article = newScenario._id;
//             result.onModel = 'Replay';
//             result.save();
//             hashTags.push(result);
//           }
//           newScenario.hashTags = hashTags;
//           newScenario.save();

//           var newChronicle = new Chronicle({
//             title: formData.title,
//             author: user._id,
//             onModel: 'Scenario',//TODO:ENUM 값으로 바꿀것
//             works: [newScenario._id]
//           });
//           newChronicle.save()
//             .then(chronicle => {
//               req.flash("info", "성공적으로 발행되었습니다.");
//               res.redirect("/scenarios");
//             })
//             .catch(err=>console.log(err));
//         });

// });

// router.post("/make/setting",ensureAuthenticated, function (req, res, next) {
//   var formData = req.body;
//   var capacityMin = 1;
//   var capacityMax = 1;
//   var trpgTime = 1;
//   var orpgTime = 1;
//   var price = 0;
//   var user = req.user;
//   capacityMin = formData.capacity_min;
//   capacityMax = isChecked(formData.is_multiple_capacity) ? formData.capacity_max : formData.capacity_min;

//   if (isChecked(formData.is_online_time)) {
//     orpgTime = formData.predicting_time;
//     trpgTime = null;
//   } else {
//     orpgTime = null;
//     trpgTime = formData.predicting_time;
//   }

//   if (isChecked(formData.is_paid)) {
//     if (user.agreeList.paidContent.agree) {
//       price = formData.price;
//     } else {
//       if (isChecked(formData.is_agree_paid)) {
//         var nowDate = moment().format();
//         price = formData.price;
//         user.agreeList.paidContent = { agree: true, agreeDate: new Date(nowDate) };
//       }
//       user.save();
//     }
//   }

//   HashTag.findOne({name:formData.title_short})
//          .exec((err,result)=>{
//           if(err){next(err);}
//           var hashTags = [];

//           var newScenario = new Scenario({
//             author: user._id,
//             isFree: isChecked(formData.is_paid) ? false : true,
//             isAgreeComment: isChecked(formData.is_agree_comment),
//             rule: toObjectId(formData.rule),
//             price: isChecked(formData.is_paid) ? 0 : price,
//             versions: {
//               capacity: { max: capacityMax, min: capacityMin },
//               rating: formData.rating,
//               masterDifficulty: formData.masterDifficulty,
//               playerDifficulty: formData.playerDifficulty,
//               backgroundTag: toObjectId(formData.background_tag),
//               genreTags: toObjectId(formData.genre_tags),
//               subTags: toObjectId(formData.sub_tags),
//               orpgPredictingTime: orpgTime,
//               trpgPredictingTime: trpgTime,
//             }
//           });
//           newScenario.save()
//           if(result==null||result==undefined){
//             var newHash = new HashTag({
//               name:formData.title_short,
//               article: newScenario._id,
//               onModel :'Scenario'
//             })
//             newHash.save();
//             hashTags.push(newHash);
//           }else{
//             result.article = newScenario._id;
//             result.onModel = 'Scenario';
//             result.save();
//             hashTags.push(result);
//           }
//           newScenario.hashTags = hashTags;
//           newScenario.save()
//           .then(scenario => {
//             req.json({articleSetting: scenario});
//           })
//           .catch(err=>console.log(err));

//           // var newChronicle = new Chronicle({
//           //   title: formData.title,
//           //   author: user._id,
//           //   onModel: 'Scenario',//TODO:ENUM 값으로 바꿀것
//           //   works: [newScenario._id]
//           // });
//           // newChronicle.save()
//           //   .then(chronicle => {
//           //     req.flash("info", "성공적으로 발행되었습니다.");
//           //     res.redirect("/scenarios");
//           //   })
//           //   .catch(err=>console.log(err));
//         });

// });

router.post("/make/:id", ensureAuthenticated, function (req, res, next) {
  Chronicle.findOne({ _id: toObjectId(req.param("id")), author: req.user._id, enabled: true }, function (err, chronicle) {
    if (err) { return next(err); }
    if (!chronicle) { return next(404); }

    var formData = req.body;
    var article = formData.article;
    var capacityMin = 1;
    var capacityMax = 1;
    var trpgTime = 1;
    var orpgTime = 1;
    var price = 0;
    var user = req.user;
    capacityMin = formData.capacity_min;
    capacityMax = isChecked(formData.is_multiple_capacity) ? formData.capacity_max : formData.capacity_min;

    if (isChecked(formData.is_online_time)) {
      orpgTime = formData.predicting_time;
      trpgTime = null;
    } else {
      orpgTime = null;
      trpgTime = formData.predicting_time;
    }

    if (isChecked(formData.is_paid)) {
      if (user.agreeList.paidContent.agree) {
        price = formData.price;
      } else {
        if (isChecked(formData.is_agree_paid)) {
          var nowDate = moment().format();
          price = formData.price;
          user.agreeList.paidContent = { agree: true, agreeDate: new Date(nowDate) };
        }
        user.save();
      }
    }

    HashTag.findOne({name:formData.title_short})
    .exec((err,result)=>{
     if(err){next(err);}
     var hashTags = [];

     var newScenario = new Scenario({
      author: user._id,
      title: formData.title,
      isFree: isChecked(formData.is_paid) ? false : true,
      isAgreeComment: isChecked(formData.is_agree_comment),
      rule: toObjectId(formData.rule),
      price: isChecked(formData.is_paid) ? 0 : price,
      versions: {
        capacity: { max: capacityMax, min: capacityMin },
        rating: formData.rating,
        masterDifficulty: formData.masterDifficulty,
        playerDifficulty: formData.playerDifficulty,
        content: article,
        backgroundTag: toObjectId(formData.background_tag),
        genreTags: toObjectId(formData.genre_tags),
        subTags: toObjectId(formData.sub_tags),
        orpgPredictingTime: orpgTime,
        trpgPredictingTime: trpgTime,
      }
    });
    newScenario.save();

     if(result==null||result==undefined){
       var newHash = new HashTag({
         name:formData.title_short,
         article: newScenario._id,
         onModel :'Replay'
       })
       newHash.save();
       hashTags.push(newHash);
     }else{
       result.article = newScenario._id;
       result.onModel = 'Replay';
       result.save();
       hashTags.push(result);
     }
     newScenario.hashTags = hashTags;
     newScenario.save();

     chronicle.works.push(newScenario);
     chronicle.save(err, chronicle => {
       if (err) { console.error(err); return next(err); }
       req.flash("info", "성공적으로 발행되었습니다.");
       return res.redirect("/scenarios/chronicles/" + req.param("id"));
     });
   });

  });
});

router.post("/edit/:id", ensureAuthenticated, function (req, res, next) {
  console.log(req.params.id)
  Scenario.findOne({ _id: toObjectId(req.params.id), author: req.user._id })
    .populate('author')
    .exec(function (err, result) {
      if (err) { return next(err); }
      if (!result) {
        req.flash("error", "잘못된 접속 방법입니다.");
        return res.redirect("/scenarios/" + req.params.id);
      }
      res.json({ result: result, masterTags: masterTags });
    });
});



router.post("/edit/setting/save/:id", ensureAuthenticated, function (req, res, next) {
  Scenario.findOne({ _id: toObjectId(req.params.id), author: req.user._id, enabled: true }, function (err, scenario) {
    if (err) { return next(err); }
    if (!scenario) { return next(404); }
    
    var formData = req.body;
    var capacityMin = 1;
    var capacityMax = 1;
    var trpgTime = 1;
    var orpgTime = 1;
    var price = 0;
    var user = req.user;
    capacityMin = formData.capacity_min;
    capacityMax = isChecked(formData.is_multiple_capacity) ? formData.capacity_max : formData.capacity_min;

    if (isChecked(formData.is_online_time)) {
      orpgTime = formData.predicting_time;
      trpgTime = null;
    } else {
      orpgTime = null;
      trpgTime = formData.predicting_time;
    }

    if (isChecked(formData.is_paid)) {
      if (user.agreeList.paidContent.agree) {
        price = formData.price;
      } else {
        if (isChecked(formData.is_agree_paid)) {
          var nowDate = moment().format();
          price = formData.price;
          user.agreeList.paidContent = { agree: true, agreeDate: new Date(nowDate) };
        }
        user.save();
      }
    }
    
    scenario.rule= toObjectId(formData.rule);
    scenario.carte = {
      capacity: { max: capacityMax, min: capacityMin },
      rating: formData.rating,
      masterDifficulty: formData.masterDifficulty,
      playerDifficulty: formData.playerDifficulty,
      backgroundTag: toObjectId(formData.background_tag),
      genreTags: toObjectId(formData.genre_tags),
      subTags: toObjectId(formData.sub_tags),
      orpgPredictingTime: orpgTime,
      trpgPredictingTime: trpgTime,
    };
    scenario.isFree = isChecked(formData.is_paid) ? false : true;
    scenario.isAgreeComment = isChecked(formData.is_agree_comment);
    scenario.price = isChecked(formData.is_paid) ? 0 : price;
    scenario.save(err, result => {
      if (err) { console.error(err); return next(err); }
      req.flash("info", "성공적으로 수정되었습니다.");
      return res.redirect("/scenarios/edit/" + req.params.id);
    });

  });
});


router.post("/edit/save/:id", ensureAuthenticated, function (req, res, next) {
  Scenario.findOne({ _id: toObjectId(req.params.id), author: req.user._id, enabled: true }, function (err, scenario) {
    if (err) { return next(err); }
    if (!scenario) { return next(404); }
    var formData = req.body;
    var article = formData.article;
    // var capacityMin = 1;
    // var capacityMax = 1;
    // var trpgTime = 1;
    // var orpgTime = 1;
    // var price = 0;
    var user = req.user;
    /*capacityMin = formData.capacity_min;
    capacityMax = isChecked(formData.is_multiple_capacity) ? formData.capacity_max : formData.capacity_min;

    if (isChecked(formData.is_online_time)) {
      orpgTime = formData.predicting_time;
      trpgTime = null;
    } else {
      orpgTime = null;
      trpgTime = formData.predicting_time;
    }

    if (isChecked(formData.is_paid)) {
      if (user.agreeList.paidContent.agree) {
        price = formData.price;
      } else {
        if (isChecked(formData.is_agree_paid)) {
          var nowDate = moment().format();
          price = formData.price;
          user.agreeList.paidContent = { agree: true, agreeDate: new Date(nowDate) };
        }
        user.save();
      }
    }
    */
    scenario.title= formData.title;
    scenario.versions.push({
      title:formData.title,
      content: article,
    });
    var isSave = true;
    if(formData.publication!==undefined){
      scenario.isOpened = true;
      isSave = false;
    }
    
    scenario.save(err, result => {
      if (err) { console.error(err); return next(err); }
      req.flash("info", "성공적으로 수정되었습니다.");
      if(!isSave){
        return res.redirect("/scenarios/view/" + req.params.id);
      }else{
        return res.redirect("/scenarios/edit/" + req.params.id);
      }
    });
  });
});

router.post("/view/:id/:version", function (req, res, next) {

  User.find({"paidContentList.scenarioList.content":{$in:[toObjectId(req.param("id"))]}},function(err,users)
  {
    var isCanDelete = true;
    if(err){ console.log(err); return next(err);}
    if(users.length>0){
      isCanDelete = false;
    }

    Scenario.findOne({_id: toObjectId(req.param("id")), enabled: true})
    .populate('author reported.reason')
    .exec(function (err, result) {
      if (err) { console.log(err); return next(err); }
      if (typeof (result) == undefined || typeof (result) == "undefined"||result === null) { return res.redirect("/") }
      var isUser = false;
      var isAuthor = false;
      var isCanReport = true;
      var isPaid = false;
      if(req.user){
        isUser= true;
        if(req.user.userEmail == result.author.userEmail){
          isAuthor = true;
          isCanReport = false;
        }else{
          if(!result.viewUsers.some(view=>view.user.equals(req.user._id))){
            result.updateOne(
              { _id: result._id, viewUsers:result.viewUsers},
              { $set: { "viewUsers.$" : result.viewUsers.push({user:req.user._id}) } }
              );
              result.save();
          }

          Report.find({user:req.user._id,'reportObject.work.article':toObjectId(req.params.id),enabled: true})
          .exec(function (err, reports){
            if (err) { console.log(err); return next(err); }
            if(reports.length>0){
              isCanReport = false;
            }
          })
        }
      }
      if(!result.isFree ||!result.isOpened ){
        if(isUser&&!isAuthor){
            if(req.user.paidContentList.replayList.find(content=>content===results._id!=null))
            {              
              isPaid = true;
              res.json({ result: result,version: req.params.version,isAuthor: isAuthor,isCanDelete:isCanDelete,isCanReport:isCanReport,isPaid:isPaid  });
            }
        }else if(!isUser){        
          req.session.current_url = req.originalUrl;
          return res.json({result: '로그인 필요'});
        }
      }
      req.session.current_url = req.originalUrl;
      res.json({ result: result,version: req.params.version,isAuthor: isAuthor,isCanDelete:isCanDelete,isCanReport:isCanReport,isPaid:isPaid  });
    });
  });
});

router.post("/view/:id", function (req, res, next) {
  // var agg_match = { _id: toObjectId(req.param("id")), enabled: true };

  User.find({ "paidContentList.scenarioList.content": { $in: [toObjectId(req.params.id)] } }, function (err, users) {
    var isCanDelete = true;
    if (err) { console.log(err); return next(err); }
    if (users.length > 0) {
      isCanDelete = false;
    }
      Scenario.findOne({ _id: toObjectId(req.params.id), enabled: true })
      .populate('author reported.reason')
      .exec(function (err, result) {
        if (err) { console.log(err); return next(err); }
        if (typeof (result) == undefined || typeof (result) == "undefined"|| result === null) { return res.redirect("/") }
        var isUser = false;
        var isAuthor = false;
        var isCanReport = true;
        var isPaid = false;
        if (req.user) {
          isUser = true;
          if (req.user.userEmail == result.author.userEmail) {
            isAuthor = true;
            isCanReport = false;
          }else{
            if(!result.viewUsers.some(view=>view.user.equals(req.user._id))){
              result.updateOne(
                { _id: result._id, viewUsers:result.viewUsers},
                { $set: { "viewUsers.$" : result.viewUsers.push({user:req.user._id}) } }
                );
                result.save();
            }
            Report.find({user:req.user._id,'reportObject.work.article':toObjectId(req.params.id),enabled: true})
            .exec(function (err, reports){
              if (err) { console.log(err); return next(err); }
              if(reports.length>0){
                isCanReport = false;
              }
            })
          }
        }
        if (!result.isFree || !result.isOpened) {
          if (isUser && !isAuthor) {
            if (req.user.paidContentList.scenarioList.find(content => content === result._id != null)) {
              isPaid = true;
              return res.json({ result: result, version: result.versions.length ,isAuthor: isAuthor, isCanDelete: isCanDelete ,isCanReport:isCanReport,isPaid:isPaid });
            }
          } else if (!isUser) {
            req.session.current_url = req.originalUrl;
            return res.json({result: '로그인 필요'});
          }
        }
        req.session.current_url = req.originalUrl;
        res.json({ result: result, version: result.versions.length ,isAuthor: isAuthor, isCanDelete: isCanDelete ,isCanReport:isCanReport,isPaid:isPaid });
      });
  });
});

router.post("/switchOpen/:id", function (req, res, next) {
  Scenario.findOne({ _id: toObjectId(req.param("id")), author: req.user._id, isOpened: req.body.params.isOpened, enabled: true })
    .exec(function (err, result) {

      if (err) { console.log(err); return next(err); }
      if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
      result.isOpened = result.isOpened ? false : true;

      result.save();
      res.json(true);
    });
});

router.post("/delete/:id", function (req, res, next) {

  User.find({ "paidContentList.scenarioList.content": { $in: [toObjectId(req.param("id"))] } }, function (err, users) {
    if (err) { console.log(err); return next(err); }
    if (users.length > 0) {
      req.flash("error", "해당 시나리오는 구매한 유저가 있는 유료 시나리오이므로 삭제할 수 없습니다.");
      var errMsg = "해당 시나리오는 구매한 유저가 있는 유료 시나리오이므로 삭제할 수 없습니다.";
      redirectStr = "/scenarios/view/" + req.param("id");
      res.json({ redirect: redirectStr, err: errMsg });
      // return res.redirect("/scenarios/view/"+req.param("id"));
    } else {
      Scenario.findOne({ _id: toObjectId(req.param("id")), author: req.user._id, enabled: true })
        .exec(function (err, result) {
          if (err) { console.log(err); return next(err); }
          if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
          User.find({ "paidContentList.scenarioList": { $in: [toObjectId(req.param("id"))] } })
          Chronicle.findOne({ works: { $in: result._id } }).exec(function (err, chronicle) {
            if (err) { console.log(err); return next(err); }
            if (typeof (chronicle) == undefined || typeof (chronicle) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }

            result.enabled = false;

            result.save();
            redirectStr = "/scenarios/chronicles/" + chronicle._id;
            res.json({ redirect: redirectStr });
          });
        });
    }
  });
});

router.post("/search", function (req, res, next) {  var page= 0;
  var pageSize= 30;
  var data = req.body.params;
  if(req.query.p !== undefined||req.query.p !== null||req.query.ps !== undefined||req.query.ps !== null){ 
    page = req.query.p-1>0?req.query.p-1:0;
    pageSize = parseInt(req.query.ps,10);
  }
  var data = req.body.params;
  var alignType = "-created";
  var order = "descending";
  var before_searchs = {};
  var after_searchs = {};

  if (data) {
    if (data.align_order) order = data.align_order;
    if (data.align_type) alignType = data.align_type;
    if (order == "descending") {
      if(alignType == "author"){
        alignType = "-author.userName"
      }else {
        alignType = "-" + alignType;
      }
    } else {
      if(alignType == "author"){
        alignType = "author.userName"
      }
    }

    // data.searchs.forEach(tag => {
    //   searchs.push({ "versions.useSearchTags": { $in: Array.isArray(tag) ? tag : [tag] } });
    // });
    var search = data.searchs;
    
    if(search.filter_author != ""){
      after_searchs.author = {};
      after_searchs.author.userName=search.filter_author;
    }
    
    if(search.filter_title != "")before_searchs.title = {$regex:search.filter_title };
 
    if (search.filter_background.length > 0) {
      if (search.filter_background[0] != "") {
        Object.assign(before_searchs, {'versions.backgroundTag':{ $in: toObjectId(search.filter_background) }});
      }
    }
    if (search.filter_genre.length > 0) {
      if (search.filter_genre[0] != "") {
        Object.assign(before_searchs,  { 'versions.genreTags':{ $in: toObjectId(search.filter_genre) }});
      }
    }
    if (search.filter_rule.length > 0) {
      if (search.filter_rule[0] != "") {
        before_searchs.rule= { $in: toObjectId(search.filter_rule) };
      }
    }
    if (search.filter_sub_tags.length > 0) {
      if (search.filter_sub_tags[0] != "") {
        Object.assign(before_searchs, {'versions.subTags':{ $in: toObjectId(search.filter_sub_tags) }});
      }
    }
    
    if (search.filter_price_min != "" || search.filter_price_max != "") {
      before_searchs.price = convertGteLte(search.filter_price_min, search.filter_price_max) ;
    }
  }
  
    var findSearch = before_searchs;
    findSearch.enabled = true;
    findSearch.isOpened= true;
    console.log(findSearch)
    Scenario.count(findSearch,function (err, count){
      if (err) { console.log(err); next(err); }
      Scenario.find(findSearch)
      .sort(alignType)
      .skip(pageSize*page)
      .limit(pageSize)
      .exec(function (err, results) {
        if (err) { console.log(err); next(err); }
        if(results != undefined && after_searchs.author != undefined){
          results = results.filter(function(result){
            return result.findAuthorUserName(after_searchs);
          });
        }
        if(results.length >0 && checkAfterAlignType(alignType)){
          results =results.sort(function(a,b){
            return sortAfterResult(a,b,data.align_type, order);
          });
        }
        results = filterBlockResult(req.user,results);
        return res.json({ articles: results, totalSize: count, masterTags: masterTags });
      });
    })
});

router.post("/comment/add/:id", ensureAuthenticated, function (req, res, next) {
  Scenario.findOne({ _id: toObjectId(req.param("id")), enabled: true, isOpened: true }, function (err, result) {
    if (err) { return next(err); }
    if (!result) { return next(404); }

    var formData = req.body;
    var user = req.user;

    var newComment = new Comment({
      user: user._id,
      onModel: 'Scenario',
      article: result._id,
      version: result.versions.length - 1,
      content: formData.comment,
    });
    newComment.save(err, result => {
      if (err) { console.error(err); return next(err); }
      return res.redirect("/scenarios/view/" + req.param("id"));
    });

  });
});


router.post("/bookmark/:id/:version", function (req, res, next) {
  User.findOne({_id:req.user._id, enabled: true})
      .exec(function (err, user){
        if (err) { console.log(err); return next(err); }
        if (typeof (user) == undefined || typeof (user) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
        var userList = user.bookmarks.scenarioList;
        if(userList.some(scenario=>scenario.content.equals(toObjectId(req.param("id"))))){  
              userList.splice(userList.findIndex(scenario=>scenario.content.equals(toObjectId(req.param("id")))&&scenario.version==req.param("version")),1);
              user.bookmarks.scenarioList = userList;
              user.save();
              return res.json(true);
        }
        Scenario.findOne({_id: toObjectId(req.param("id")), enabled: true})
          .exec(function (err, result) {
            if (err) { console.log(err); return next(err); }
            if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
            user.bookmarks.scenarioList.push({content:result._id, version: req.param("version")});
            user.save();
            return res.json(true);
          });
  });
});

function isChecked(value) {
  if (value === "check") { return true; }
  else { return false; }
}
function capacitySetting(formData) {
  if (formData.is_multiple_capacity) {
    return
  }
  else {

  }
}
function filterBlockResult(user,results){
  if(results!=null && user!=null){
    var blockList = user.blockList;
    // if(results[0] instanceof User){
    // }
    if(results[0] instanceof Scenario){
      results = results.filter(function(result){
         return !blockList.scenarioList.some(scenario=>scenario.content._id.equals(result._id));
      });
      results = results.filter(function(result){
         return !blockList.userList.some(scenario=>scenario.content._id.equals(result.author._id));
      });
      
    }
    // if(results[0] instanceof Replay){
    //   console.log("dk1");
    // }
    if(results[0] instanceof Chronicle){
      console.log("dk1");
    }
  }
  return results;
}
function sortAfterResult(a, b, alignType,order){
  if(order =="descending" && alignType =="ruleTag"){   
    return a[alignType]<b[alignType]?-1:(a[alignType]>b[alignType]?1:0);
  }else if(order =="ascending" && alignType =="ruleTag"){   
    return a[alignType]<b[alignType]?1:(a[alignType]>b[alignType]?-1:0);
  }else if(order =="descending" && alignType =="view"){   
    return a[alignType] - b[alignType];
  }else if(order =="ascending" && alignType =="view"){   
    return b[alignType]-a[alignType] ;
  }else if(order =="descending" && alignType =="author"){   
    return a.author.userName<b.author.userName?-1:(a.author.userName>b.author.userName?1:0);
  }else if(order =="ascending" && alignType =="author"){   
    return a.author.userName<b.author.userName?1:(a.author.userName>b.author.userName?-1:0);
  }
}
function checkAfterAlignType(alignType){
  if(alignType=="ruleTag"||alignType=="-ruleTag"){
    return true;
  }else if(alignType=="view"||alignType=="-view"){
    return true;
  }else if(alignType=="author.userName"||alignType=="-author.userName"){
    return true;
  }
  return false;
}

function toObjectId(strings) {
  if (Array.isArray(strings)) {
    return strings.map(string=>mongoose.Types.ObjectId(string));
  }
  return mongoose.Types.ObjectId(strings);
}
function lastIndex(array) {
  return array[array.length - 1];
}

function convertGteLte(gte, lte) {
  if (gte != "" && lte != "") return { $gte: Number(gte), $lte: Number(lte) };
  else if (gte != "") return { $gte: Number(gte) };
  else if (lte != "") return { $lte: Number(lte) };
}
module.exports = router;
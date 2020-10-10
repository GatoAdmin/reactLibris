var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
var Chronicle = mongoose.model('Chronicle');
var Replay = mongoose.model('Replay');
var MasterTag = mongoose.model('MasterTag');
var HashTag = mongoose.model('HashTag');
var Comment = mongoose.model('Comment');
var Report =  mongoose.model('Report');
const bcrypt = require('bcryptjs');
var moment = require('moment');
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
router.use(function(req,res,next){
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
    var data = req.body.params;
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
        
    var findSearch = {enabled: true,isOpened: true}
    Replay.find(findSearch)
    .sort(alignType)
    .exec(function (err, results) {
      if (err) { console.log(err); next(err); }
      results = filterBlockResult(req.user,results);
      return res.json({ articles: results, masterTags: masterTags });
    });

  });
  
router.post("/make", ensureAuthenticated, function (req, res, next) {
  var formData = req.body;

  var article = formData.article;
  var price = 0;
  var user = req.user;
  var aboutScenarioId = null;

  var data_players = JSON.parse(formData.play_peoples);

  if(isChecked(formData.is_base_scenario)){
    aboutScenarioId=formData.scenario_name; //추후 ID로 교체
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
          var newReplay = new Replay({
            author: user._id,
            title: formData.title,
            isFree: isChecked(formData.is_paid) ? false : true,
            isAgreeComment: isChecked(formData.is_agree_comment),
            rule: toObjectId(formData.rule),
            price: isChecked(formData.is_paid) ? price: 0 ,
            aboutScenario: isChecked(formData.is_base_scenario) ? aboutScenarioId : null,
            versions: {
              peoples:{
                master: isMirrorChecked(formData.is_need_master)?formData.master_name:null,
                players: data_players
              },
              rating: formData.rating,
              content: article,
              backgroundTag: toObjectId(formData.background_tag),
              genreTags: toObjectId(formData.genre_tags),
              subTags: toObjectId(formData.sub_tags),
            }
          });
          newReplay.save()
          if(result==null||result==undefined){
            var newHash = new HashTag({
              name:formData.title_short,
              article: newReplay._id,
              onModel :'Replay'
            })
            newHash.save();
            hashTags.push(newHash);
          }else{
            result.article = newReplay._id;
            result.onModel = 'Replay';
            result.save();
            hashTags.push(result);
          }
          newReplay.hashTags = hashTags;
          console.log(newReplay.hashTags);
          newReplay.save();
          var newChronicle = new Chronicle({
            title: formData.title,
            author: user._id,
            onModel: 'Replay',//TODO:ENUM 값으로 바꿀것
            works: [newReplay._id]
          });
          
          newChronicle.save()
            .then(chronicle => {
              req.flash("info", "성공적으로 발행되었습니다.");
              res.redirect("/replays");
            })
            .catch(err=>console.log(err));
        });
});
  
router.post("/make/:id", ensureAuthenticated, function (req, res, next) {
  Chronicle.findOne({ _id: toObjectId(req.param("id")), author: req.user._id, enabled: true }, function (err, chronicle) {
    if (err) { return next(err); }
    if (!chronicle) { return next(404); }

    var formData = req.body;
    var article = formData.article;
    var price = 0;
    var user = req.user;
    var aboutScenarioId = null;
    var data_players = JSON.parse(formData.play_peoples);
  
    if(isChecked(formData.is_base_scenario)){
      aboutScenarioId=formData.scenario_name; //추후 ID로 교체
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

     var newReplay = new Replay({
      author: user._id,
      title: formData.title,
      isFree: isChecked(formData.is_paid) ? false : true,
      isAgreeComment: isChecked(formData.is_agree_comment),
      rule: toObjectId(formData.rule),
      price: isChecked(formData.is_paid) ? price: 0 ,
      aboutScenario: isChecked(formData.is_base_scenario) ? aboutScenarioId : null,
      versions: {
        peoples:{
          master: isMirrorChecked(formData.is_need_master)?formData.master_name:null,
          players: data_players
        },
        rating: formData.rating,
        content: article,
        backgroundTag: toObjectId(formData.background_tag),
        genreTags: toObjectId(formData.genre_tags),
        subTags: toObjectId(formData.sub_tags),
      }
    });
    newReplay.save()
     if(result==null||result==undefined){
       var newHash = new HashTag({
         name:formData.title_short,
         article: newReplay._id,
         onModel :'Replay'
       })
       newHash.save();
       hashTags.push(newHash);
     }else{
       result.article = newReplay._id;
       result.onModel = 'Replay';
       result.save();
       hashTags.push(result);
     }
     newReplay.hashTags = hashTags;
     console.log(newReplay.hashTags);
     newReplay.save();

     chronicle.works.push(newReplay);
     chronicle.save(err, chronicle => {
       if (err) { console.error(err); return next(err); }
       req.flash("info", "성공적으로 발행되었습니다.");
       return res.redirect("/replays/chronicles/" + req.param("id"));
     });
   });
  });
});

router.post("/search", function (req, res, next) {
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

    // search.filter_author != "" ? after_searchs.push({ "author.userName":{$regex:search.filter_author} }) : "";
    // search.filter_title != "" ? before_searchs.push({ "versions.title": {$regex:search.filter_title }}) : "";
    if(search.filter_author != ""){
      after_searchs.author = {};
      // after_searchs.author.userName={$regex:search.filter_author};

      after_searchs.author.userName=search.filter_author;
    }
    
    search.filter_title != "" ? before_searchs.versions.title = {$regex:search.filter_title } : "";
 
    if (search.filter_background.length > 0) {
      if (search.filter_background[0] != "") {
        // before_searchs.push({ "versions.backgroundTag": { $in: toObjectId(search.filter_background) } });

        before_searchs.versions = {};
        before_searchs.versions.backgroundTag={ $in: toObjectId(search.filter_background) };
      }
    }
    if (search.filter_genre.length > 0) {
      if (search.filter_genre[0] != "") {
        before_searchs.versions = {};
        // before_searchs.push({ "versions.genreTags": { $in: toObjectId(search.filter_genre) } });
        before_searchs.versions.genreTags= { $in: toObjectId(search.filter_genre) } ;
      }
    }
    if (search.filter_rule.length > 0) {
      if (search.filter_rule[0] != "") {
        before_searchs.versions = {};
        // before_searchs.push({ "rule": { $in: toObjectId(search.filter_rule) } });
        before_searchs.rule= { $in: toObjectId(search.filter_rule) };
      }
    }
    if (search.filter_sub_tags.length > 0) {
      if (search.filter_sub_tags[0] != "") {
        before_searchs.versions = {};
        // before_searchs.push({ "versions.subTags": { $in: toObjectId(search.filter_sub_tags) } });
        before_searchs.versions.subTags = { $in: toObjectId(search.filter_sub_tags) };
      }
    }
    if (search.filter_price_min != "" || search.filter_price_max != "") {
      before_searchs.versions = {};
      // before_searchs.push({ "price": convertGteLte(search.filter_price_min, search.filter_price_max) });
      before_searchs.price = convertGteLte(search.filter_price_min, search.filter_price_max) ;
    }
  }

  var agg_match = {
    $and:[{enabled: true},{isOpened: true}] 
  };
  var agg_after_match = {};
  if (before_searchs.length > 0) {
    agg_match = {
      $and:[{$and:[{enabled: true},{isOpened: true}]}, {$and: before_searchs}]
    };
  }
  if (after_searchs.length > 0) {
    agg_after_match ={$and:after_searchs};
  }

  // Replay.aggregate().match(agg_match)
  //   .lookup(agg_lookup_user)
  //   .lookup(agg_lookup_rule)
  //   .lookup(agg_lookup_genre)
  //   .lookup(agg_lookup_background)
  //   .lookup(agg_lookup_subtags)
  //   .match(agg_after_match)
  //   .project(agg_replay_project)
  //   // .sort("version.title")
  //   .sort(alignType)
  //   .exec(function (err, results) {
  //     if (err) { console.log(err); next(err); }
  //     return res.json({ articles: results, masterTags: masterTags });
  //   });
  var findSearch = before_searchs;
  findSearch.enabled = true;
  findSearch.isOpened= true;
  // if(after_searchs.author.userName != undefined){
  //   findSearch["author.userName"] = after_searchs.author.userName;
  // }
  // findSearch["author.userName"] = after_searchs["author.userName"]!=undefined?after_searchs["author.userName"]:"";
  
    Replay.find(findSearch)
    .sort(alignType)
    .exec(function (err, results) {
      if (err) { console.log(err); next(err); }
      if(results != undefined&& after_searchs.author != undefined){
        results.filter(function(result){
          result.findAuthorUserName(after_searchs);
        });
      }
      if(results.length > 0 && checkAfterAlignType(alignType)){
        results = results.sort(function(a,b){
          return sortAfterResult(a,b,data.align_type, order);
        });
      }
      results = filterBlockResult(req.user,results);
      return res.json({ articles: results, masterTags: masterTags });
    });

});

router.post("/edit/:id", ensureAuthenticated, function (req, res, next) {
  Replay.findOne({ $and:[{_id: toObjectId(req.params.id)}, {author: req.user._id}] })
  .populate('author')
  .exec( function (err, result) {
    if (err) { return next(err); }
    if (!result) {
      req.flash("error", "잘못된 접속 방법입니다.");
      return res.redirect("/replays/" + req.param("id"));
    }
    res.json({ result: result, masterTags: masterTags });
  });
});

router.post("/edit/save/:id", ensureAuthenticated, function (req, res, next) {
  Replay.findOne({ $and:[{_id: toObjectId(req.param("id"))}, {author: req.user._id},{enabled: true}]}, function (err, result) {
    if (err) { return next(err); }
    if (!result) { return next(404); }

    var formData = req.body;
    var article = formData.article;
    var price = 0;
    var user = req.user;
    var aboutScenarioId = null;
    var data_players = JSON.parse(formData.play_peoples);
  
    if(isChecked(formData.is_base_scenario)){
      aboutScenarioId=formData.scenario_name; //추후 ID로 교체
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

    result.title = formData.title;
    result.versions.push({
        peoples:{
          master: isMirrorChecked(formData.is_need_master)?formData.master_name:null,
          players: data_players
        },
        rating: formData.rating,
        content: article,
        backgroundTag: toObjectId(formData.background_tag),
        genreTags: toObjectId(formData.genre_tags),
        subTags: toObjectId(formData.sub_tags),
    });
    result.isFree = isChecked(formData.is_paid) ? false : true;
    result.isAgreeComment=isChecked(formData.is_agree_comment);
    result.price=isChecked(formData.is_paid) ? 0 : price;
    result.save(err, result =>{
      if (err) { console.error(err); return next(err); }
      req.flash("info", "성공적으로 수정되었습니다.");
      return res.redirect("/replays/view/" + req.param("id"));
    });
  });
});

router.post("/view/:id/:version", function (req, res, next) {

  User.find({"paidContentList.replayList.content":{$in:[toObjectId(req.param("id"))]}},function(err,users)
  {
    var isCanDelete = true;
    if(err){ console.log(err); return next(err);}
    if(users.length>0){
      isCanDelete = false;
    }

    Replay.findOne({_id: toObjectId(req.params.id), enabled: true})
    .populate('author')
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
              res.json({ result: result,version: req.params.version,isAuthor: isAuthor,isCanDelete:isCanDelete,isCanReport:isCanReport,isPaid:isPaid });
            }
        }else if(!isUser){        
          req.session.current_url = req.originalUrl;
          return res.json({result: '로그인 필요'});
        }
      }
      req.session.current_url = req.originalUrl;
      res.json({ result: result,version: req.params.version,isAuthor: isAuthor,isCanDelete:isCanDelete,isCanReport:isCanReport,isPaid:isPaid });
    });
  });
});

router.post("/view/:id", function (req, res, next) {
    User.find({"paidContentList.replayList.content":{$in:[toObjectId(req.params.id)]}},function(err,users)
    {
      var isCanDelete = true;
      if(err){ console.log(err); return next(err);}
      if(users.length>0){
        isCanDelete = false;
      }
      Replay.findOne({_id: toObjectId(req.params.id), enabled: true})
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
                res.json( { result: result,version: result.versions.length ,isAuthor: isAuthor,isCanDelete:isCanDelete,isCanReport:isCanReport ,isPaid:isPaid  });
              }
          }else if(!isUser){        
            req.session.current_url = req.originalUrl;
            return res.json({result: '로그인 필요'});
          }
        }
        req.session.current_url = req.originalUrl;
        res.json({ result: result,version: result.versions.length ,isAuthor: isAuthor,isCanDelete:isCanDelete,isCanReport:isCanReport,isPaid:isPaid  });
      });
    });
  });

router.post("/delete/:id", function (req, res, next) {
  
  User.find({"paidContentList.replayList.content":{$in:[toObjectId(req.param("id"))]}},function(err,users)
  {
    if(err){ console.log(err); return next(err);}
    if(users.length>0){
      req.flash("error","해당 리플레이는 구매한 유저가 있는 유료 리플레이 이므로 삭제할 수 없습니다.");
      var errMsg = "해당 리플레이는 구매한 유저가 있는 유료 리플레이 이므로 삭제할 수 없습니다.";
      redirectStr ="/replays/view/"+req.param("id");
      res.json({redirect:redirectStr, err:errMsg});
    }else{
      Replay.findOne({_id: toObjectId(req.param("id")), author: req.user._id,enabled: true})
        .exec(function (err, result) {
          if (err) { console.log(err); return next(err); }
          if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
          Chronicle.findOne({works: {$in: result._id}}).exec(function (err,chronicle){
            if (err) { console.log(err); return next(err); }
            if (typeof (chronicle) == undefined || typeof (chronicle) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
            
            result.enabled= false;
          
            result.save(); 
            redirectStr ="/replays/chronicles/"+chronicle._id;
            res.json({redirect:redirectStr});
          });
        });
    }
  });
});

router.post("/switchOpen/:id", function (req, res, next) {
  Replay.findOne({_id: toObjectId(req.param("id")), author: req.user._id, isOpened:req.body.params.isOpened,enabled: true})
    .exec(function (err, result) {
      if (err) { console.log(err); return next(err); }
      if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
      result.isOpened=result.isOpened ? false:true;
      
      result.save(); 
      res.json(true);
    });
});

router.post("/bookmark/:id/:version", function (req, res, next) {
  User.findOne({_id:req.user._id, enabled: true})
      .exec(function (err, user){
        if (err) { console.log(err); return next(err); }
        if (typeof (user) == undefined || typeof (user) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
        var userList = user.bookmarks.replayList;
        if(userList.some(replay=>replay.content.equals(toObjectId(req.param("id")))&&replay.version==req.param("version"))){
              userList.splice(userList.findIndex(replay=>replay.content.equals(toObjectId(req.param("id")))&&replay.version==req.param("version")),1);
              user.bookmarks.replayList = userList;
              user.save();
              return res.json(true);
        }
        Replay.findOne({_id: toObjectId(req.param("id")), enabled: true})
          .exec(function (err, result) {
            if (err) { console.log(err); return next(err); }
            if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
            user.bookmarks.replayList.push({content:result._id, version: req.param("version")});
            user.save();
            return res.json(true);
          });
  });
});

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

function filterBlockResult(user,results){
  if(results!=null && user!=null){
    var blockList = user.blockList;
    // if(results[0] instanceof User){
    // }
    // if(results[0] instanceof Scenario){
    //   results = results.filter(function(result){
    //      return !blockList.scenarioList.some(scenario=>scenario.content._id.equals(result._id));
    //   });
    //   results = results.filter(function(result){
    //     console.log(blockList.userList.some(scenario=>scenario.content._id.equals(result.author._id)));
    //      return !blockList.userList.some(scenario=>scenario.content._id.equals(result.author._id));
    //   });
      
    // }
    if(results[0] instanceof Replay){
      results = results.filter(function(result){
        return !blockList.replayList.some(scenario=>scenario.content._id.equals(result._id));
     });
     results = results.filter(function(result){
        return !blockList.userList.some(scenario=>scenario.content._id.equals(result.author._id));
     });
    }
    if(results[0] instanceof Chronicle){
      console.log("dk1");
    }
  }
  return results;
}
function isChecked(value) {
  if (value === "check" ||value === "on" ) { return true; }
  else { return false; }
}
function isMirrorChecked(value) {
  if (value === undefined|| value === "undefined") { return true; }
  else { return false; }
}
function toObjectId(strings) {
  if (Array.isArray(strings)) {
    return strings.map(mongoose.Types.ObjectId);
  }
  return mongoose.Types.ObjectId(strings);
}
function convertGteLte(gte, lte) {
  if (gte != "" && lte != "") return { $gte: Number(gte), $lte: Number(lte) };
  else if (gte != "") return { $gte: Number(gte) };
  else if (lte != "") return { $lte: Number(lte) };
}
module.exports = router;
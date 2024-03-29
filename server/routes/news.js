var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
var Chronicle = mongoose.model('Chronicle');
var News = mongoose.model('News');
var MasterTag = mongoose.model('MasterTag');
var HashTag = mongoose.model('HashTag');
var Comment = mongoose.model('Comment');

const bcrypt = require('bcryptjs');
//템플릿용 변수 설정
router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.title = '리브리스';
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
  });
var hashTags = null;
HashTag.aggregate().match({ enabled: true, })
.project({
  _id: 0,
  name: 1,
  tags: { _id: 1, tag: 1 },
})
.exec((err, results) => {
  hashTags = results
});
  router.post("/", function (req, res, next) {
    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";
    if (data) {
      order = data.align_order;
      if (order == "descending") {
        if (data.align_type === "title") {
          alignType = "-versions.title"
        } else {
          alignType = "-" + data.align_type.toString();
        }
      } else {
        if (data.align_type === "title") {
          alignType = "versions.title"
        } else {
          alignType = data.align_type.toString();
        }
      }
    }
    
    var findSearch = {isOpened:true,enabled: true}
    News.find(findSearch)
    .populate('author')
    .sort(alignType)
    .exec(function (err, results) {
      if (err) { console.log(err); next(err); }
      results = filterBlockResult(req.user,results);
      return res.json({ articles : results, hashTags: hashTags });
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
        if (alignType == "title") {
          alignType = "-versions.title"
        }else if(alignType == "author"){
          alignType = "-author.username"
        }else {
          alignType = "-" + alignType;
        }
      } else {
        if (alignType == "title") {
          alignType = "versions.title"
        }else if(alignType == "author"){
          alignType = "author.username"
        }
      }
      
      var search = data.searchs;
  
      if(search.filter_author != ""){
        after_searchs.author = {};
        after_searchs.author.username=search.filter_author;
      }
       
      if(search.filter_title != "" ){
        before_searchs = {'versions.title': {$regex:search.filter_title}};
      }
      if (!Array.isArray(search.filter_hash_tags)) {
        // if (search.filter_sub_tags[0] != "") {
          if(search.filter_hash_tags!=""){
          before_searchs.hashTags = {};
          var hashTag = hashTags.find(tag => tag.name.includes( search.filter_hash_tags) );
          if(hashTag === undefined){
            newHashTag = new HashTag({name:search.filter_hash_tags});
            newHashTag.save();
            hashTag = newHashTag;
          } 
          // before_searchs.push({ "versions.subTags": { $in: toObjectId(search.filter_sub_tags) } });
          before_searchs.hashTags = { $in: toObjectId(hashTag._id) };
        }
      }
    }
    var findSearch = before_searchs;
    findSearch.enabled = true;
    findSearch.isOpened= true;
    console.log(findSearch)
      News.find(findSearch)
      .populate('author hashTags')
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
        // results = filterBlockResult(req.user,results);
        return res.json({ articles: results, hashTags: hashTags });
      });
  
  });
  
  router.post("/chronicle/:id", function (req, res, next) {
    var findId = toObjectId(req.param("id"));
    Chronicle.findOne({_id:findId,enabled: true})
    .populate({path:'works',populate:{path:'adminAuthor',select:'username -_id'},select:'isAgreeComment adminAuthor versions viewUsers enabled bookingOpen isOpened banner -_id'})
    .exec(function (err, result){
      console.log(result)
        if (err) { console.log(err); return next(err); }
        if (!result) { return next(404); }
        return res.json({chronicle: result,currentUser:req.user!=null?req.user.email:null});
      });
  });

  router.post("/view/:id", function (req, res, next) {
    News.findOne({_id: toObjectId(req.param("id")), isOpened:true ,enabled: true})
      .populate('author')
      .exec(function (err, result) {
        if (err) { console.log(err); return next(err); }
        if (typeof (result) == undefined || typeof (result) == "undefined"||result === null) { return res.json({redirect:"/"}) }

        req.session.current_url = req.originalUrl;
        res.json({ result: result});
    });
  });

  router.post("/bookmark/:id", function (req, res, next) {
    User.findOne({_id:req.user._id, enabled: true})
        .exec(function (err, user){
          if (err) { console.log(err); return next(err); }
          if (typeof (user) == undefined || typeof (user) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
          var userList = user.bookmarks.newsList;
          if(userList.some(news=>news.content.equals(toObjectId(req.param("id"))))){
                userList.splice(userList.findIndex(news=>news.content.equals(toObjectId(req.param("id")))),1);
                user.bookmarks.newsList = userList;
                user.save();
                return res.json(true);
          }
          News.findOne({_id: toObjectId(req.param("id")), enabled: true})
            .exec(function (err, result) {
              if (err) { console.log(err); return next(err); }
              if (typeof (result) == undefined || typeof (result) == "undefined") { req.flash("error", "잘못된 접근입니다."); return res.redirect("/") }
              user.bookmarks.newsList.push({content:result._id});
              user.save();
              return res.json(true);
            });
    });
  });
  
  function sortAfterResult(a, b, alignType,order){
    if(order =="descending" && alignType =="view"){   
      return a[alignType] - b[alignType];
    }else if(order =="ascending" && alignType =="view"){   
      return b[alignType]-a[alignType] ;
    }else if(order =="descending" && alignType =="author"){   
      return a.author.username<b.author.username?-1:(a.author.username>b.author.username?1:0);
    }else if(order =="ascending" && alignType =="author"){   
      return a.author.username<b.author.username?1:(a.author.username>b.author.username?-1:0);
    }
  }
  
  function checkAfterAlignType(alignType){
    if(alignType=="view"||alignType=="-view"){
      return true;
    }else if(alignType=="author.username"||alignType=="-author.username"){
      return true;
    }
    return false;
  }
  

  function toObjectId(strings) {
    if (Array.isArray(strings)) {
      return strings.map(mongoose.Types.ObjectId);
    }
    return mongoose.Types.ObjectId(strings);
  }

  function filterBlockResult(user,results){
    //tag를 통해서 삭제할 수 있어야함
    // if(results!=null && user!=null){
    //   var blockList = user.blockList;
    //   if(results[0] instanceof News){
    //     results = results.filter(function(result){
    //       return !blockList.NewsList.some(scenario=>scenario.content._id.equals(result._id));
    //    });
    //    results = results.filter(function(result){
    //       return !blockList.userList.some(scenario=>scenario.content._id.equals(result.author._id));
    //    });
    //   }
    //   if(results[0] instanceof Chronicle){
    //     console.log("dk1");
    //   }
    // }
    return results;
  }
module.exports = router;
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
var Comment = mongoose.model('Comment');
var Chronicle = mongoose.model('Chronicle');
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

/* GET users listing. */
router.get('/', ensureAuthenticated,function(req, res, next) {
  User.findOne({userEmail:req.user.userEmail},function(err,user){

    res.render("library/index",{user:user.toJSON(),moment});
  });
});
  
router.get("/chronicles", ensureAuthenticated,function(req,res,next){
  User.findOne({_id:req.user._id})
  .populate('chronicles')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    req.session.current_url = req.originalUrl;
    res.render("library/myChronicles",{user:user.toJSON(),masterTags :masterTags,moment});
  });
});
  
router.get("/comments", ensureAuthenticated,function(req,res,next){
  Comment.find({user:req.user._id})
  .exec(function(err,results){
    if(err) {return next(err);}
    if(!results){return next(404);}
    req.session.current_url = req.originalUrl;
    res.render("library/myComments",{user:req.user.toJSON(),moment});
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
   res.render("library/bookmarkReplay",{user:user.toJSON(), moment});
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
   res.render("library/bookmarkScenario",{user:user.toJSON(), moment});
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

router.get("/block/user", ensureAuthenticated,function(req,res,next){
    req.session.current_url = req.originalUrl;
   res.render("library/blockUser",{user:req.user.toJSON(), moment});
});

router.post("/block/user", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('blockList.userList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    
    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
    }
    var results = user.blockList.userList;
    
    // results = searchResult(results,after_searchs);
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,alignType, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({userList:results, moment});
  
  });
});
router.post("/block/user/:username", ensureAuthenticated,function(req,res,next){
  User.findOne({userName:req.param("username")})
  .populate('blockList.userList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    
    var findIndex=req.user.blockList.userList.findIndex(blockUser=>blockUser.content.equals(user._id));
    if(findIndex>-1){
      req.user.blockList.userList.splice(findIndex,1);
      req.user.save(err,result=>{
        if (err) { console.error(err); return next(err); }
        req.flash("info", "해당 유저차단이 해제되었습니다.");
      });
    }

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
    }
    var results = req.user.blockList.userList;
    
    // results = searchResult(results,after_searchs);
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,alignType, order);
    });

    req.session.current_url = req.originalUrl;
    res.json({userList:results, moment});
  
  });
});


router.get("/block/replays", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('blockList.replayList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    req.session.current_url = req.originalUrl;
   res.render("library/blockReplay",{user:user.toJSON(), moment});
  });
});

router.post("/block/replays", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('blockList.replayList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
    }
    var results = user.blockList.replayList;
    
    // results = searchResult(results,after_searchs);
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,data.align_type, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({user:user, articles:results,masterTags : masterTags,  moment});
  });
});

router.post("/block/replays/delete", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('blockList.replayList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
    }
    var results = user.blockList.replayList;
    var deleteIndex = results.findIndex(result=>result.content._id.equals(data.delete.article))

    if(deleteIndex > -1){
      results.splice(deleteIndex,1);
      user.blockList.replayList = results;
      user.save();
    }
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,data.align_type, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({user:user, articles:results,masterTags : masterTags,  moment});
  });
});


router.get("/block/scenarios", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('blockList.scenarioList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    req.session.current_url = req.originalUrl;
   res.render("library/blockScenario",{user:user.toJSON(), moment});
  });
});

router.post("/block/scenarios", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('blockList.scenarioList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
    }
    var results = user.blockList.scenarioList;
    
    // results = searchResult(results,after_searchs);
    results = results.sort(function(a,b){
      return sortAfterResult(a,b,data.align_type, order);
    });
    req.session.current_url = req.originalUrl;
   res.json({user:user, articles:results,masterTags : masterTags,  moment});
  });
});

router.post("/block/scenarios/delete", ensureAuthenticated,function(req,res,next){
  User.findOne({userEmail:req.user.userEmail})
  .populate('blockList.scenarioList.content')
  .exec(function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}

    var data = req.body.params;
    var alignType = "-created";
    var order = "descending";

    if (data) {
      if (data.align_order) order = data.align_order;
      if (data.align_type) alignType = data.align_type;
    }
    var results = user.blockList.scenarioList;
    var deleteIndex = results.findIndex(result=>result.content._id.equals(data.delete.article))

    if(deleteIndex > -1){
      results.splice(deleteIndex,1);
      user.blockList.scenarioList = results;
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
  }else if(order =="descending" && alignType =="title" && a.version!=null){   
    return a.content.versions[a.version-1][alignType]<b.content.versions[b.version-1][alignType]?-1:(a.content.versions[a.version-1][alignType]>b.content.versions[b.version-1][alignType]?1:0);
  }else if(order =="ascending" && alignType =="title"&& a.version!=null){   
    return a.content.versions[a.version-1][alignType]<b.content.versions[b.version-1][alignType]?1:(a.content.versions[a.version-1][alignType]>b.content.versions[b.version-1][alignType]?-1:0);
  }else if(order =="descending" && alignType =="author"){   
    return a.content.author.userName<b.content.author.userName?-1:(a.content.author.userName>b.content.author.userName?1:0);
  }else if(order =="ascending" && alignType =="author"){   
    return a.content.author.userName<b.content.author.userName?1:(a.content.author.userName>b.content.author.userName?-1:0);
  }else if(order =="descending" && alignType =="created"){   
    return a[alignType] - b[alignType];
  }else if(order =="ascending" && alignType =="created"){   
    return b[alignType] -a[alignType] ;
  }else if(order =="descending" && alignType =="userName"){   
    return a.content.userName<b.content.userName?-1:(a.content.userName>b.content.userName?1:0);
  }else if(order =="ascending" && alignType =="userName"){   
    return a.content.userName<b.content.userName?1:(a.content.userName>b.content.userName?-1:0);
  }else if(order =="descending" && alignType =="title" ){   
    return a.content.versions[a.content.versions.length-1][alignType]<b.content.versions[b.content.versions.length-1][alignType]?-1:(a.content.versions[a.content.versions.length-1][alignType]>b.content.versions[b.content.versions.length-1][alignType]?1:0);
  }else if(order =="ascending" && alignType =="title"){   
    return a.content.versions[a.content.versions.length-1][alignType]<b.content.versions[b.content.versions.length-1][alignType]?1:(a.content.versions[a.content.versions.length-1][alignType]>b.content.versions[b.content.versions.length-1][alignType]?-1:0);
  }
  return 0;
}

module.exports = router;

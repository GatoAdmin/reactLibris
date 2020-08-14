var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');
var User = mongoose.model('UserInfo');
var MasterTag = mongoose.model('MasterTag');
const bcrypt = require('bcryptjs');

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
        req.flash("info", "먼저 로그인해야 이 페이지를 볼 수 있습니다.");
        res.redirect("/login");
    }
}
router.get("/tag",/*ensureAuthenticated,*/function (req, res, next) {
    var agg_match = {
        "tags.enabled": true,
        enabled: true
    };
    var agg_project = {
        name: 1,
        tags: {
            tag: 1,
        }
    };
    MasterTag.aggregate().match(agg_match).sort({ created: "asc" })
        .project(agg_project)
        .exec(function (err, results) {
            if (err) return next(err);
            res.render("admin/adminTagManage", { tags: results });
        });
});

router.post("/tag/add", /*ensureAuthenticated,*/ function (req, res, next) {

    var data = req.body;
    var agg_match = {
        name: data.name,
        enabled: true
    };
    var dataTags = data.tags.split(',');
    MasterTag.findOne(agg_match)
        .exec(function (err, result) {
            if (err) return next(err);
            if (result) {
                dataTags.forEach(tag => {
                    result.tags.push({ tag: tag });
                });
                result.save(function (err, tags) {
                    if (err) return console.error(err);
                    // console.log(tags.name + " saved to bookstore collection.");
                });
            }else{
                var newTags = [];
                dataTags.forEach(tag => {
                    newTags.push({ tag: tag });
                });
                var newMasterTag = new MasterTag({
                    name : data.name,
                    tags: newTags
                });
                newMasterTag.save();
            }
            res.redirect('/admin/tag');
        });
});
module.exports = router;
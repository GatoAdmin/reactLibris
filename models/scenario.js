var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
var MasterTag = mongoose.model('MasterTag');
var nowDate = moment().format();

const ScenarioSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'UserInfo' },
    price: { type: Number, default: 0 },
    // view: { type: Number, default: 0 },
    rule: {type: Schema.Types.ObjectId, ref: 'MasterTag'},//String,
    hashTags:[{type: Schema.Types.ObjectId, ref:'HashTag'}],
    summary:{type:String},
    versions: [{
        title: String,
        capacity: { max: { type: Number, default: 1 }, min: { type: Number, default: 1 } },//인원수
        rating: Number,
        orpgPredictingTime: { type: Number },
        trpgPredictingTime: { type: Number },
        censoredGrade: [{
            exposure: Number, //노출
            sex: Number, //성행위
            violence: Number, //폭력
            language: Number, //언어
            etc: [String]
        }],
        masterDifficulty: Number,
        playerDifficulty:Number,
        content: [{ type: String }], //본문. TODO: Quill에 맞춰서 수정할것.
        backgroundTag:{type: Schema.Types.ObjectId, ref: 'MasterTag'},
        genreTags:[{type: Schema.Types.ObjectId, ref: 'MasterTag'}],
        subTags: [{type: Schema.Types.ObjectId, ref: 'MasterTag'}],//[String],
        checked: { isChecked: { type: Boolean, default: false }, date: { type: Date } },
        created: { type: Date, default: Date.now }
    }],
    viewUsers: [{
        user:{type:Schema.Types.ObjectId, ref:'UserInfo'},
        created:{ type: Date, default: Date.now }
    }],
    isAgreeComment: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    isOpened: { type: Boolean, default: true },
    // stopped: {
    //     isStopped: { type: Boolean, default: false },
    //     reason: { type: String }
    // },

    reported: [{
        isStopped: { type: Boolean, default: false },
        isCancelPaid: { type: Boolean, default: false },
        reason:  {type:String},
        created: { type: Date, default: Date.now },
        solvedReport: { isSolved: { type: Boolean, default: false }, date: { type: Date } },
        //true인 경우 모든 조치가 없는걸로 처리한다.
        userSolvedRequest: [{
            requestDetail: { type: String }, //요청 내용, 수정했으니 취소해달라는 내용 등
            checked: { isChecked: { type: Boolean, default: false }, date: { type: Date } },
            rejectReason: { type: String },//안되는 사유
            created: { type: Date, default: Date.now },
        }]
    }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});

ScenarioSchema.pre("save", function (done) {
    // var scenario = this;
    // var curruntVersion = scenario.versions[scenario.versions.length-1]//.versions[0]; //TODO:제대로 바꿔줄것
    // var array = curruntVersion.tags;
    // // array.push();
    // array.push(scenario.rule);
    // if (curruntVersion.capacity.min == curruntVersion.capacity.max) {
    //     array.push("인원_" + curruntVersion.capacity.min);
    // } else {
    //     for (var i = curruntVersion.capacity.min; i <= curruntVersion.capacity.max; i++) {
    //         array.push("인원_" + i);
    //     }
    // }
    // if (curruntVersion.capacity.min == 1) { array.push("타이만"); }
    // curruntVersion.useSearchTags = array;
    return done();
});


ScenarioSchema.virtual('chronicle',{
     lookup:(doc)=>{
         return {
            ref: 'Chronicle', 
            localField: '_id', 
            foreignField: 'works', 
            justOne:true,
            // as: 'chronicle'
        };
    },
});
ScenarioSchema.virtual('comments',{
    lookup:(doc)=>{
        return {
           ref: 'Comment', 
           localField: '_id', 
           foreignField: 'works.article', 
           justOne:false,
       };
   },
});
// ScenarioSchema.virtual('author',{
//     lookup:(doc)=>{
//         return {
//             from: 'userinfos', 
//             localField: 'author', 
//             foreignField: '_id', 
//             as: 'author'
//         };
//     },
// });

ScenarioSchema.virtual('lastVersion').get(function(){
    if(this.versions != undefined)
    return this.versions[this.versions.length-1];
});

ScenarioSchema.virtual('view').get(function(){
    if(this.viewUsers != undefined)
    return this.viewUsers.length;
});

var masterTags = null;
ScenarioSchema.pre(/^find/, function(next) {
    this.populate('author');
    this.populate('hashTags');
    MasterTag.find({enabled:true})
    .exec((err,tags)=>{
        if(err){console.log(err); return false};
        masterTags = tags;
        next();
        });
});


ScenarioSchema.virtual('ruleTag').get(function(){
    var tag = "";
    var masterTag = masterTags.find(tag=>tag.name==="rule");
    var tag_check = masterTag.tags.find(tag=>tag._id.equals(this.rule));
    if(tag_check!=undefined){
        tag = tag_check.tag;        
    }
    return tag;
});

ScenarioSchema.methods.findAuthorUserName = function(obj){
    //obj {afterSearch.author.userName : ""}
    if(obj.author!=undefined){
        var search = new RegExp(obj.author.userName, "i");
//        return this.author.userName.match(search)!=null?true:false;
        return search.test(this.author.userName);
    }
    return false;
}
ScenarioSchema.methods.filterSearchWord = function(searchWord){
    if(this.lastVersion.title.includes(searchWord)){return true}
        var delta = JSON.parse(this.lastVersion.content);
        delta.ops = delta.ops.map((obj)=>{
          if(typeof(obj.insert)!='string'){
              delete obj.insert;
            }
            return obj;
        });
        delta.ops = delta.ops.filter((obj)=>obj.insert!=undefined?obj.insert.includes(searchWord):false);
        if(delta.ops.length>0){ return  true}
        return false;
}
ScenarioSchema.set('toObject', { virtuals: true });
ScenarioSchema.set('toJSON', { virtuals: true,
    transform: function(doc,ret, options){
        if(masterTags==undefined || masterTags==null){
            MasterTag.find({enabled:true})
            .exec((err,tags)=>{
                if(err){console.log(err); return false};
                masterTags = tags;
                console.log(masterTags);
                });
        }

        if(ret.ruleTag != "" && ret.ruleTag != undefined){
            delete ret.rule;
        }

        delete ret.viewUsers;
        delete ret.decommendUsers;
        var backgroundMasterTags = masterTags.find(tag=>tag.name==="background").tags;
        var genreMasterTags = masterTags.find(tag=>tag.name==="genre").tags;
        var subMasterTags = masterTags.find(tag=>tag.name==="subTag").tags;

        if(ret.versions != undefined){
            // ret.versions=
            ret.versions.map((version)=>{
                var findBackground= backgroundMasterTags.find(tags=>tags._id.equals(version.backgroundTag));
                version.backgroundTag = findBackground!=undefined?findBackground.tag:"";
                var subTags = [];
                version.subTags.map((subTag)=>{
                    var findResult = subMasterTags.find(tags=>tags._id.equals(subTag));
                    subTags.push(findResult!=undefined?findResult.tag:""); 
                });
                version.subTags = subTags;
                var genreTags = [];
                version.genreTags.map((genreTag)=>{
                    var findResult = genreMasterTags.find(tags=>tags._id.equals(genreTag));
                    genreTags.push(findResult!=undefined?findResult.tag:"");
                });
                version.genreTags = genreTags;
            })
            ret.lastVersion = ret.versions[ret.versions.length-1];
        }
        return ret;
    }
 });
module.exports = mongoose.model('Scenario', ScenarioSchema);
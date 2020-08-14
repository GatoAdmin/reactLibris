var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var MasterTag = mongoose.model('MasterTag');

const ReplaySchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'UserInfo' },
    // works : [{
    price: { type: Number, default: 0 },
    // view: { type: Number, default: 0 },
    aboutScenario : String,//{ type: Schema.Types.ObjectId, ref: 'Scenario' },
    rule: {type: Schema.Types.ObjectId, ref: 'MasterTag'},//String,
    isAgreeComment: { type: Boolean, default: false },
    hashTags:[{type: Schema.Types.ObjectId, ref:'HashTag'}],
    versions: [{
        title: String,
        peoples: {
            master: String,
            players: [{
                playerName: { type: String },
                characters: [{characterName: { type: String }}] //TODO : 캐릭터세트를 넣어서 해결할 수 있도록
            }]
        },//참가인원
        rating: Number,
        censoredGrade: [{
            exposure: Number, //노출
            sex: Number, //성행위
            violence: Number, //폭력
            language: Number, //언어
            etc: [String]
        }],
        content: { type: String }, //본문. TODO: Quill에 맞춰서 수정할것.
        backgroundTag:{type: Schema.Types.ObjectId, ref: 'MasterTag'},
        genreTags:[{type: Schema.Types.ObjectId, ref: 'MasterTag'}],
        subTags: [{type: Schema.Types.ObjectId, ref: 'MasterTag'}],//[String],
        checked: { isChecked: { type: Boolean, default: false }, date: { type: Date } },
        created: { type: Date, default: Date.now }
    }],
    // reported: [{
    //     isStopped: { type: Boolean, default: false },
    //     isCancelPaid: { type: Boolean, default: false },
    //     reason: { type: String },
    //     created: { type: Date, default: Date.now },
    //     solvedReport: { isSolved: { type: Boolean, default: false }, date: { type: Date } },
    //     //true인 경우 모든 조치가 없는걸로 처리한다.
    //     userSolvedRequest: [{
    //         requestDetail: { type: String }, //요청 내용, 수정했으니 취소해달라는 내용 등
    //         checked: { isChecked: { type: Boolean, default: false }, date: { type: Date } },
    //         created: { type: Date, default: Date.now },
    //     }]
    // }],
    // enabled: { type: Boolean, default: false },
    // }],
    viewUsers: [{
        user:{type:Schema.Types.ObjectId, ref:'UserInfo'},
        created:{ type: Date, default: Date.now }
    }],
    isOpened: { type: Boolean, default: true },
    isFree: { type: Boolean, default: true },
    reported: [{
        isStopped: { type: Boolean, default: false },
        isCancelPaid: { type: Boolean, default: false },
        reason: { type: String },
        created: { type: Date, default: Date.now },
        solvedReport: { isSolved: { type: Boolean, default: false }, date: { type: Date } },
        //true인 경우 모든 조치가 없는걸로 처리한다.
        userSolvedRequest: [{
            requestDetail: { type: String }, //요청 내용, 수정했으니 취소해달라는 내용 등
            checked: { isChecked: { type: Boolean, default: false }, date: { type: Date } },
            rejectReason: { type: String },//안되는 사유
            created: { type: Date, default: Date.now },
        }],
    }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});

ReplaySchema.virtual('chronicle',{
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
ReplaySchema.virtual('comments',{
   lookup:(doc)=>{
       return {
          ref: 'Comment',
          localField: '_id',
          foreignField: 'works.article',
          justOne:false,
      };
  },
});
ReplaySchema.virtual('lastVersion').get(function(){
    if(this.versions != undefined)
    return this.versions[this.versions.length-1];
});

ReplaySchema.virtual('view').get(function(){
    if(this.viewUsers != undefined)
    return this.viewUsers.length;
});

// ReplaySchema.virtual('backgroundTags',{
//     ref: 'MasterTag',
//     localField: 'versions.backgroundTag',
//     foreignField: 'tags._id',
//     justOne:true
// });

// ReplaySchema.virtual('genreTags',{
//     ref: 'MasterTag',
//     localField: 'versions.genreTags',
//     foreignField: 'tags._id',
//     justOne:true
// });
// ReplaySchema.virtual('subTags',{
//     ref: 'MasterTag',
//     localField: 'versions.subTags',
//     foreignField: 'tags._id',
//     justOne:true
// });
// ReplaySchema.virtual('masterTags');
var masterTags = null;
ReplaySchema.pre(/^find/, function(next) {
    this.populate('author');
    this.populate('hashTags');
    MasterTag.find({enabled:true})
    .exec((err,tags)=>{
        if(err){console.log(err); return false};
        masterTags = tags;
        next();
        });
});

// ReplaySchema.post('init', function(doc) {
//     var backgroundMasterTags = masterTags.find(tag=>tag.name==="background").tags;
//     // var genreMasterTags = masterTags.find(tag=>tag.name==="genre").tags;
//     // var subMasterTags = masterTags.find(tag=>tag.name==="subTag").tags;
//     doc.versions.map((version)=>{
//         version.backgroundTag.set(backgroundMasterTags.find(tag=>tag._id.equals(version.backgroundTag)).tag);
//         console.log(version.backgroundTag);
//         // version.subTags = backgroundMasterTags.find(tag=>tag._id.equals(version.backgroundTag)).tag;
//         // version.genreTags = backgroundMasterTags.find(tag=>tag._id.equals(version.backgroundTag)).tag;
//     })
//     return doc;
// });

ReplaySchema.virtual('ruleTag').get(function(){
    var tag = "";
    var masterTag = masterTags.find(tag=>tag.name==="rule");
    var tag_check = masterTag.tags.find(tag=>tag._id.equals(this.rule));
    if(tag_check!=undefined){
        tag = tag_check.tag;        
    }
    return tag;
});

ReplaySchema.methods.findAuthorUserName = function(obj){
    //obj {afterSearch.author.userName : ""}
    if(obj.author!=undefined){
        // var search = new RegExp('^'+obj.author.userName+'$', "i");

        var search = new RegExp(obj.author.userName, "i");
        return this.author.userName.match(search)!=""?true:false;
    }
    return false;
}

ReplaySchema.set('toObject', { virtuals: true });
ReplaySchema.set('toJSON', { virtuals: true,
    transform: function(doc,ret, options){
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
                version.backgroundTag=backgroundMasterTags.find(tag=>tag._id.equals(version.backgroundTag)).tag;
                var subTags = [];
                version.subTags.map((subTag)=>{
                    subTags.push(subMasterTags.find(tag=>tag._id.equals(subTag)).tag); 
                });
                version.subTags = subTags;
                var genreTags = [];
                version.genreTags.map((genreTag)=>{genreTags.push(genreMasterTags.find(tag=>tag._id.equals(genreTag)).tag);});
                version.genreTags = genreTags;
            })
            ret.lastVersion = ret.versions[ret.versions.length-1];
        }
        return ret;
    }
 });

module.exports = mongoose.model('Replay', ReplaySchema);
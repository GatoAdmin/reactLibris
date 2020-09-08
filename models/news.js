var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var HashTag = mongoose.model('HashTag');
 
const NewsSchema = new Schema({
    author : {type: Schema.Types.ObjectId, ref:'AdminInfo'},
    aboutFestival : {type: Schema.Types.ObjectId, ref:'Festival'},
    hashTags:[{type: Schema.Types.ObjectId, ref:'HashTag'}],
    viewUsers: [{
        user:{type:Schema.Types.ObjectId, ref:'UserInfo'},
        created:{ type: Date, default: Date.now }
    }],
    banner : [{
        imageName :{type:String, default:"none",require:true}, //표기될 이미지
        imageData:{type:String, require:true},
        bannerKind :{type:String, default:"Banner", enum: [ 'Banner']}, //어디에 표기될것인가. 헤더 광고도 고려해야함
    }],
    versions: [{
        title: String,
        content: { type: String }, //본문. TODO: Quill에 맞춰서 수정할것.
        checked: { isChecked: { type: Boolean, default: false }, date: { type: Date } },
        created: { type: Date, default: Date.now }
    }],
    isOpened : {type: Boolean, default : true},
    isAgreeComment : {type: Boolean, default : false},
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});

var hashTags = null;
NewsSchema.pre(/^find/, function(next) {
    HashTag.find({enabled:true})
    .exec((err,tags)=>{
        if(err){console.log(err); return false};
        hashTags = tags;
        next();
        });
});
NewsSchema.virtual('chronicle',{
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
NewsSchema.virtual('comments',{
   lookup:(doc)=>{
       return {
          ref: 'Comment',
          localField: '_id',
          foreignField: 'works.article',
          justOne:false,
      };
  },
});
NewsSchema.virtual('lastVersion').get(function(){
    if(this.versions != undefined)
    return this.versions[this.versions.length-1];
});

NewsSchema.virtual('view').get(function(){
    if(this.viewUsers != undefined)
    return this.viewUsers.length;
});
NewsSchema.methods.findAuthorUserName = function(obj){
    if(obj.staff!=undefined){
        var search = new RegExp(obj.staff.username, "i");
        return this.staff.username.match(search)!=""?true:false;
    }
    return false;
}
NewsSchema.set('toJSON', { virtuals: true,
    transform: function(doc,ret, options){
        delete ret.viewUsers;
        if(ret.versions != undefined){
            ret.lastVersion = ret.versions[ret.versions.length-1];
        }
        var hash_tags = [];
        if(ret.hashTags){
            ret.hashTags.map(hashTag=>{
                var findResult = hashTags.find(tag=>tag._id.equals(hashTag));
                hash_tags.push(findResult!=undefined?findResult.name:""); 
            })
        }
        ret.hashTags = hash_tags;
        return ret;
    }
 });

module.exports =  mongoose.model('News', NewsSchema);
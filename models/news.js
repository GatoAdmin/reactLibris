var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const NewsSchema = new Schema({
    staff : {type: Schema.Types.ObjectId, ref:'AdminInfo'},
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
// NewsSchema.pre(/^find/, function(next) {
//     this.populate('staff');
//     this.populate('hashTags');
// });
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
    if(obj.author!=undefined){
        var search = new RegExp(obj.author.userName, "i");
        return this.author.userName.match(search)!=""?true:false;
    }
    return false;
}
NewsSchema.set('toJSON', { virtuals: true,
    transform: function(doc,ret, options){
        delete ret.viewUsers;
        if(ret.versions != undefined){
            ret.lastVersion = ret.versions[ret.versions.length-1];
        }
        return ret;
    }
 });

module.exports =  mongoose.model('News', NewsSchema);
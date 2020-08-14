var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const CommentSchema = new Schema({
    user : {type: Schema.Types.ObjectId, required:true,ref:'UserInfo'},
    onModel: {type:String, required:true, enum: [ 'News','Scenario', 'Replay']},
    article: {type: Schema.Types.ObjectId, required:true, refPath: 'onModel'},            
    version: {type: Number, default:0},
    content : {type:String,required:true},
    recommendUsers :[{user:{type: Schema.Types.ObjectId,ref:'UserInfo'}},{created:{ type: Date, default: Date.now }}],
    decommendUsers :[{user:{type: Schema.Types.ObjectId,ref:'UserInfo'}},{created:{ type: Date, default: Date.now }}],
    replyOrigin:{
        type:Schema.Types.ObjectId, ref:'Comment'
    },
    stopped : {
        isStopped : {type:Boolean, default: false},
        reason : {type:String}
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});

CommentSchema.post(/^find/, async function(docs, next) {
    for (let doc of docs) {
        if (doc.replyOrigin!= null) {
          await doc.populate({path:'replyOrigin', populate:{path:'user',select:'userName userEmail -_id'}}).execPopulate();
        }
      }
});

CommentSchema.virtual('recomments',{
    ref: 'Comment', 
    localField: '_id', 
    foreignField: 'replyOrigin', 
    justOne:false,
    options: {sort:{created:1}}
});

CommentSchema.virtual('recommends').get(function(){
    return this.recommendUsers.length;
});

CommentSchema.virtual('decommends').get(function(){
    return this.decommendUsers.length;
});

CommentSchema.virtual('is_recommend').get(function(){
    return this._is_recommend;
}).set(function(data) { this._is_recommend = data; });


CommentSchema.virtual('is_decommend').get(function(){
    return this._is_decommend;
}).set(function(data) { this._is_decommend = data; });

CommentSchema.set('toObject', { virtuals: true });
CommentSchema.set('toJSON', { virtuals: true,
    transform: function(doc,ret, options){
        delete ret.recommendUsers;
        delete ret.decommendUsers;
        return ret;
    }
 });

module.exports =  mongoose.model('Comment', CommentSchema);
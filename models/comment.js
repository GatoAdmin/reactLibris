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
    if(Array.isArray(docs)){
        for (let doc of docs) {
            if (doc.replyOrigin!= null) {
              await doc.populate({path:'replyOrigin', populate:{path:'user',select:'userName userEmail -_id'}}).execPopulate();
            }
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

CommentSchema.virtual('isRecommend').get(function(){
    return this._isRecommend;
}).set(function(data) {return  this._isRecommend = data; });


CommentSchema.virtual('isDecommend').get(function(){
    return this._isDecommend;
}).set(function(data) {return  this._isDecommend = data; });

CommentSchema.virtual('isReported').get(function(){
    return this._isReported;
}).set(function(data) {return  this._isReported = data; });


CommentSchema.set('toObject', { virtuals: true });
CommentSchema.set('toJSON', { getters: true, virtuals: true,
    transform: function(doc,ret, options){
        delete ret.recommendUsers;
        delete ret.decommendUsers;
        return ret;
    }
 });

module.exports =  mongoose.model('Comment', CommentSchema);
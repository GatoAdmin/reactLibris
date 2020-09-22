var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const ReportSchema = new Schema({
    user : {type: Schema.Types.ObjectId, ref:'UserInfo'},
    reportObject:{   //유저신고, 아티클 신고, 댓글 신고 
        user :{type: Schema.Types.ObjectId, ref:'UserInfo' },
        work :{
            article: {type: Schema.Types.ObjectId},     
            onModel: {type:String, enum:['Replay','Scenario']},       
            version: {type: Number, default:0}
        },
        comment :{type: Schema.Types.ObjectId, ref:'Comment'}
    },
    reason : {
        reasonKind:{type: String},
        detail :{type:String}        
    },
    isChecked:{ type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});
 
module.exports =  mongoose.model('Report', ReportSchema);
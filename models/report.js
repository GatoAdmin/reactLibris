var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const ReportSchema = new Schema({
    user : {type: Schema.Types.ObjectId, ref:'UserInfo'},
    reportObject:{    
        user :{type: Schema.Types.ObjectId, ref:'UserInfo' },
        work :{
            content: {type: Schema.Types.ObjectId},            
            article: {type: Number, default:0}
        },
        comment :{type: Schema.Types.ObjectId, ref:'Comment'}
    },
    reason : {
        reasonKind:{type: Number},
        detail :{type:String}        
    },
    isChecked:{ type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});
 
module.exports =  mongoose.model('Report', ReportSchema);
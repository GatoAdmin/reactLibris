var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const VoteSchema = new Schema({
    //유저기반
    // user : {type: Schema.Types.ObjectId, ref:'UserInfo'},
    // aboutFestival : {type: Schema.Types.ObjectId, ref:'Festival'},
    // votes:[{
    //     work :{
    //         content: {type: Schema.Types.ObjectId},            
    //         article: {type: Number, default:0},
    //     },
    //     created: { type: Date, default: Date.now },
    // }],

    //작품기반
    work :{
        content: {type: Schema.Types.ObjectId},            
        article: {type: Number, default:0},
    },
    aboutFestival : {type: Schema.Types.ObjectId, ref:'Festival'},
    votes : [{ //이 경우 기간에 따라 뷰와 투표수를 바로 계산이 가능하니 로그기능도 따로 뺄필요는 없다. 
        user :{type: Schema.Types.ObjectId, ref:'UserInfo'},
        created: { type: Date, default: Date.now }
    }],
    views : [{
        user :{type: Schema.Types.ObjectId, ref:'UserInfo'},
        created: { type: Date, default: Date.now }
    }],    
    created: { type: Date, default: Date.now }, //참가 날짜
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});
 
module.exports =  mongoose.model('Vote', VoteSchema);
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const AdminInfoSchema = new Schema({
    userName: String, //유저에게 밝혀지는 이름
    email : String,
    userPasswd: String,
    salt: String,
    roles:[{type: Number}],//1번이면 올 어드민, 그 후부턴 몇개씩 추가 가능.
    //TODO: 몇번이 어떤 역할인지 정해둘것.
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});
 
module.exports = mongoose.model('AdminInfo', AdminInfoSchema);
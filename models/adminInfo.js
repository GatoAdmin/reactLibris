var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 //해시 알고리즘 적용 회수, 높을수록 보안은 높음 속도는 느려짐
var SALT_FACTOR = 10;
const bcrypt = require('bcryptjs');
const AdminInfoSchema = new Schema({
    username: {type:String,unique : true }, //유저에게 밝혀지는 이름
    email: {
        type: String,
        // validate:{isEmail: true}, 
        required: true,
        unique: true
    },
    passwd: { type: String, required: true },
    salt: { type: String,/*required:true*/ },
    roles: [{type:String, required:true, enum: [ 'All','Event','User','AdminManager', 'News','Report']}],//All이면 올 어드민, 그 후부턴 몇개씩 추가 가능.
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});
AdminInfoSchema.pre("save", function (done) {
    var user = this;
    if (!user.isModified("passwd")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) { return done(err); }
        bcrypt.hash(user.passwd, salt, (err, hashedPassword) => {
            if (err) { return done(err); }
            user.passwd = hashedPassword;
            user.salt = salt;
            done();
        });
    });
});

AdminInfoSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.passwd, function (err, isMatch) {
        done(err, isMatch);
    });
};
AdminInfoSchema.set('toObject', { virtuals: true });
AdminInfoSchema.set('toJSON', { virtuals: true,
    transform: function(doc,ret, options){
        delete ret.passwd;
        delete ret.salt;
        delete ret.enabled;
        return ret;
    }
 });
module.exports = mongoose.model('AdminInfo', AdminInfoSchema);
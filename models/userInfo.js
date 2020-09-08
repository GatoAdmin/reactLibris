var mongoose = require('mongoose');
const Schema = mongoose.Schema;
//해시 알고리즘 적용 회수, 높을수록 보안은 높음 속도는 느려짐
var SALT_FACTOR = 10;
const bcrypt = require('bcryptjs');

const UserInfoSchema = new Schema({
    userName: String,
    userEmail: {
        type: String,
        // validate:{isEmail: true}, 
        required: true,
        unique: true
    },
    userPasswd: { type: String, required: true },
    salt: { type: String,/*required:true*/ },
    portrait : {type:String},
    coin: { type: Number, default: 0 },
    agreeList: {
        sendEmail: {
            agree: { type: Boolean, default: false },
            agreeDate: { type: Date }
        },
        saveUserInfo: {
            agree: { type: Boolean, default: false },
            agreeDate: { type: Date }
        },
        saveOrder: {
            agree: { type: Boolean, default: false },
            agreeDate: { type: Date }
        },
        paidContent: {
            agree: { type: Boolean, default: false },
            agreeDate: { type: Date }
        },
        cancleMembership: {
            agree: { type: Boolean, default: false },
            agreeDate: { type: Date }
        },
    },
    connections: [{
        connectType: {type:String, enum: [ 'Google']},
        email: String,
        connectDate: { type: Date, default: Date.now }
    }],
    profile: {
        introduction: { type: String },
        contacts: [{
            contactType: [{ type: String }],//연락처 종류. 트위터, 이메일, 카카오톡 오픈챗방 주소 등
            contact: [{ type: String }] //종류에 맞는 연락처
        }], //연락 가능한 트위터 아이디 같은것
        preferPlayStyle: { //선호 스타일
            playTypes: [{ type: Number }],//온라인(보이스, 텍스트), 오프라인
            canConditions: [{ type: Number }] //관전허용, 2차캐릭터 허용, 초면 가능, 타세션PC허용
        },
        preferRules: [{ 
            rule: { type: String },
            rule_tag:{ type: Schema.Types.ObjectId},
            rule_kind : { type:String,  enum: [ 'MasterTag','ETC'] },
        }], //선호룰
        canMasterRules: [{ 
            rule: { type: String },
            rule_tag:{ type: Schema.Types.ObjectId},
            rule_kind : { type:String, enum: [ 'MasterTag','ETC'] },
        }], //마스터링 가능 룰
        haveRules: [{//가지고 있는 룰북 
            rule: { type: String },
            rule_tag:{ type: Schema.Types.ObjectId},
            // language: { type: String },
            rule_kind : { type:String,  enum: [ 'MasterTag','ETC'] },
            // supplements: [{
            //     title: { type: String },
            //     // language: { type: String },
            //     title_tag:{ type: Schema.Types.ObjectId},
            //     kind : { type:String,  enum: [ 'MasterTag','ETC'] },
            // }] //룰마다 서플리먼트 체크 가능
        }],
        wentToScenarios: [{ //다녀온 시나리오
            title: String,
            author: { type: String },//TODO: 또는 우리 회원의 아이디 링크 
            rule: { type: String },
            rule_tag:{ type: Schema.Types.ObjectId},
            rule_kind : { type:String, enum: [ 'MasterTag','ETC'] },
        }],
        canMasterScenarios: [{ //마스터가능 시나리오
            title: String,
            author: { type: String },//TODO: 또는 우리 회원의 아이디 링크 
            rule: { type: String },
            rule_tag:{ type: Schema.Types.ObjectId},
            rule_kind : { type:String, enum: [ 'MasterTag','ETC'] },
        }],
        ngMaterials:[{type:String}]
    },
    favoriteList: {
        scenarioList: [{
            content: { type: Schema.Types.ObjectId, ref: 'Scenario' },
            created: { type: Date, default: Date.now }
        }],
        replayList: [{
            content: { type: Schema.Types.ObjectId, ref: 'Replay' },
            created: { type: Date, default: Date.now }
        }],
        userList: [{
            content: { type: Schema.Types.ObjectId, ref: 'UserInfo' },
            created: { type: Date, default: Date.now }
        }]
    },
    blockList: {
        scenarioList: [{
            content: { type: Schema.Types.ObjectId, ref: 'Scenario' },
            created: { type: Date, default: Date.now }
        }],
        replayList: [{
            content: { type: Schema.Types.ObjectId, ref: 'Replay' },
            created: { type: Date, default: Date.now }
        }],
        userList: [{
            content: { type: Schema.Types.ObjectId, ref: 'UserInfo' },
            created: { type: Date, default: Date.now }
        }],
        censoredGrade: [{
            exposure: { min: { type: Number }, max: { type: Number } }, //노출
            sex: { min: { type: Number }, max: { type: Number } }, //성행위
            violence: { min: { type: Number }, max: { type: Number } }, //폭력
            language: { min: { type: Number }, max: { type: Number } }, //언어
            etc: [String]
        }],
        tagList: { type: String }
    },
    paidContentList: {
        scenarioList: [{
            content: { type: Schema.Types.ObjectId, ref: 'Scenario' },
            created: { type: Date, default: Date.now }
        }],
        replayList: [{
            content: { type: Schema.Types.ObjectId, ref: 'Replay' },
            created: { type: Date, default: Date.now }
        }]
    },
    bookmarks: {
        scenarioList: [{
            content: { type: Schema.Types.ObjectId, ref: 'Scenario' },
            version: { type: Number, default: 0 },
            memo:{type:String},
            created: { type: Date, default: Date.now }
        }],
        replayList: [{
            content: { type: Schema.Types.ObjectId, ref: 'Replay' },
            version: { type: Number, default: 0 },
            memo:{type:String},
            created: { type: Date, default: Date.now }
        }],        
        newsList: [{
            content: { type: Schema.Types.ObjectId, ref: 'News' },
            memo:{type:String},
            created: { type: Date, default: Date.now }
        }]
    },
    userPaymentMethod: [{
        name: String,
        creditCard: String,
        salt: String,
        expirationDate: String,
        cvc: String
    }],
    userAddresses: [{
        addressName: { type: String, default: '배송주소' },
        receiver: String,
        address: String,
        phone: String
    }],
    // userCustomTags:{//TODO: 공식화 된 것은 삭제 필요 어떻게?
    //     name:String, // "rule","background","subTag"
    //     tags :[{
    //         tag:String,
    //         created:{ type: Date, default: Date.now },
    //         updated: { type: Date, default: Date.now },
    //         enabled: { type: Boolean, default: true }
    //     }],
    //     created: { type: Date, default: Date.now },
    //     updated: { type: Date, default: Date.now },
    //     enabled: { type: Boolean, default: true }
    // },
    stopped: {
        isStopped: { type: Boolean, default: false },
        reason: { type: String }
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
}, { toJSON: { virtuals: true } });
//bcrypt를 위한 빈 함수
var noop = function () { };
//모델이 저장되기("save") 전(.pre)에 실행되는 함수
UserInfoSchema.pre("save", function (done) {
    var user = this;
    if (!user.isModified("userPasswd")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) { return done(err); }
        bcrypt.hash(user.userPasswd, salt, (err, hashedPassword) => {
            if (err) { return done(err); }
            user.userPasswd = hashedPassword;
            user.salt = salt;
            done();
        });
    });
});

UserInfoSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.userPasswd, function (err, isMatch) {
        done(err, isMatch);
    });
};

UserInfoSchema.virtual('chronicles', {
    ref: 'Chronicle',
    localField: '_id',
    foreignField: 'author',
    justOne: false,
    options: { sort: { created: -1 }, limit: 5 },
    match:{$and:[{enabled:true},{isOpened:true}]}
    //     lookup:(doc)=>{
    //         return {
    //            ref: 'Chronicle', 
    //            localField: '_id', 
    //            foreignField: 'author',
    //        };
    //    },
    //     match:(doc)=>{
    //         return{
    //             refId: doc._id,
    //             refModel: 'Scenario',
    //             chronicle:{$in: doc._id}
    //         };
    //     },
});

UserInfoSchema.set('toObject', { virtuals: true });
UserInfoSchema.set('toJSON', { virtuals: true,
    transform: function(doc,ret, options){
        delete ret.userPasswd;
        delete ret.salt;
        delete ret.enabled;
        return ret;
    }
 });
module.exports = mongoose.model('UserInfo', UserInfoSchema);

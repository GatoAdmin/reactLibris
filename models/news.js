var mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const NewsSchema = new Schema({
    staff : {type: Schema.Types.ObjectId, ref:'AdminInfo'},
    aboutFestival : {type: Schema.Types.ObjectId, ref:'Festival'},
    hashTags:[{type: Schema.Types.ObjectId, ref:'HashTag'}],
    works :[{
        review : {type: Number, default:0},
        banner : {
            image :{String}, //표기될 이미지
            bannerKind :{Number} //어디에 표기될것인가. 헤더 광고도 고려해야함
        },
        versions:[{
            title: String,
            content:{type: String}, //본문. TODO: Quill에 맞춰서 수정할것.
            tags :[String],
            created : {type:Date, default:Date.now}
        }],
        isAgreeComment : {type: Boolean, default : false},
        isOpened : {type: Boolean, default : true},
        enabled : {type: Boolean,default:false}
    }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});
 
module.exports =  mongoose.model('News', NewsSchema);
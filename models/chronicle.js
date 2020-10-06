var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChronicleSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'UserInfo' },
    adminAuthor: { type: Schema.Types.ObjectId, ref: 'AdminInfo' },
    title:{type:String, default:""},
    banner:{
        imageName :{type:String, default:"none",require:true}, //표기될 이미지
        imageData:{type:String, require:true},
    },
    // image:{type:Image},
    description:{type:String, default:""},
    onModel: {type:String, required:true, enum: [ 'News','Scenario', 'Replay']},
    works: [{type: Schema.Types.ObjectId,refPath: 'onModel'}],
    isOpened: { type: Boolean, default: true },
    bookingOpen:{
        start:{ type: Date, default: Date.now },
        end:{ type: Date}
    },
    reported: [{
        isStopped: { type: Boolean, default: false },
        isCancelPaid: { type: Boolean, default: false },
        reason: { type: String },
        created: { type: Date, default: Date.now },
        solvedReport: { isSolved: { type: Boolean, default: false }, date: { type: Date } },
        //true인 경우 모든 조치가 없는걸로 처리한다.
        userSolvedRequest: [{
            requestDetail: { type: String }, //요청 내용, 수정했으니 취소해달라는 내용 등
            checked: { isChecked: { type: Boolean, default: false }, date: { type: Date } },
            rejectReason: { type: String },//안되는 사유
            created: { type: Date, default: Date.now },
        }]
    }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});

// ChronicleSchema.pre(/^find/, function(next) {
//     this.populate('works');
// });

// ChronicleSchema.methods.filterSearchWord = function(searchWord){
//     this.works.filter((work)=>{
//         if(work.lastVersion.title.includes(searchWord)){return true}
//         var delta = JSON.parse(work.lastVersion.content);
//         delta.ops = delta.ops.map((obj)=>{
//           if(typeof(obj.insert)!='string'){
//               delete obj.insert;
//             }
//             return obj;
//         });
//         delta.ops = delta.ops.filter((obj)=>obj.insert!=undefined?obj.insert.includes(searchWord):false);
//         if(delta.ops.length>0){ return true}
//         // if(work.hashTags.includes())
//         return false;
//     })
//     return this;
// }
module.exports = mongoose.model('Chronicle', ChronicleSchema);

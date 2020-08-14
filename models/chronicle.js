var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChronicleSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'UserInfo' },
    title:{type:String, default:""},
    description:{type:String, default:""},
    onModel: {type:String, required:true, enum: [ 'News','Scenario', 'Replay']},
    works: [{type: Schema.Types.ObjectId,refPath: 'onModel'}],
    isOpened: { type: Boolean, default: true },
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
module.exports = mongoose.model('Chronicle', ChronicleSchema);

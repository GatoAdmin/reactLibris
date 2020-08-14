var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HashTagSchema = new Schema({
    name :{type:String, default:""},
    article: {type: Schema.Types.ObjectId, refPath: 'onModel'},
    onModel: {type:String, enum: [ 'News','Scenario', 'Replay']},
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('HashTag', HashTagSchema);

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MasterTagSchema = new Schema({
/*    ruleTags : [{
        tag:String,
        created:{ type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
        enabled: { type: Boolean, default: true }
    }],
    backgroundTags:[{
        tag:String,
        created:{ type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
        enabled: { type: Boolean, default: true }
    }],
    subTags:[{
        tag:String,
        created:{ type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
        enabled: { type: Boolean, default: true }
    }],*/
    name:String, // "rule","background","subTag"
    tags :[{
        tag:String,
        created:{ type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
        enabled: { type: Boolean, default: true }
    }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true }
});


module.exports = mongoose.model('MasterTag', MasterTagSchema);
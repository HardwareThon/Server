const mongoose = require('mongoose');

const voiceValueSchema = mongoose.Schema({
 	tone_id: String,
 	tone_name: String,
    score: mongoose.Schema.Types.Decimal128 
});

const voiceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: Number,
    date: Date,
    value: [voiceValueSchema]
});

module.exports = mongoose.model('voice', voiceSchema);
const mongoose = require('mongoose');

const pulseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    user: Number,
    value: Number
});

module.exports = mongoose.model('pulse', pulseSchema);

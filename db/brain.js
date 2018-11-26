const mongoose = require('mongoose');

const brainSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    user: Number,
    value: Number
});

module.exports = mongoose.model('brain', brainSchema);
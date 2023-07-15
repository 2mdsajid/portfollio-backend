const mongoose = require('mongoose');

const dailyUserVisitSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        default: 0
    }
});

const DailyVisit = mongoose.model('dailyvisit', dailyUserVisitSchema);

module.exports = DailyVisit;

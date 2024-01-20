const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema ({
    ign: {
        type: String
    },
    review: {
        type: Number
    }
})

module.exports = mongoose.model('Review', ReviewSchema);
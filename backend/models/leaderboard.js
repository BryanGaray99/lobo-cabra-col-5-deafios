const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema ({
    gameName : {
        type: String,
        enum: ['nivel-1', 'nivel-2', 'nivel-3', 'nivel-4', 'nivel-5']
    },
    ign: {
        type: String
    },
    hashedEmail: {
        type: String
    },
    score: {
        type: Number
    }
})

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
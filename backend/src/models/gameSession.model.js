const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema({
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    
    status: {
        type: String,
        enum: ["WAITING", "ACTIVE", "FINISHED"],
        default: "WAITING"
    },

    gameState: {
        type: Object,
        default: {}
    },

    currentTurn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model("GameSession", gameSessionSchema);
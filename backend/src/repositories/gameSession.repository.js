const GameSession = require("../models/gameSession.model");

const createSession = async (data) => {
    return await GameSession.create(data);
};

const getSessionById = async (id) => {
    return await GameSession.findById(id).populate("players");
};

module.exports = {
    createSession,
    getSessionById
};
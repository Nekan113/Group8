const gameSessionRepo = require("../repositories/gameSession.repository");

const createGameSession = async (userId) => {
    return await gameSessionRepo.createSession({
        players: [userId],
        status: "WAITING"
    });
};

const getGameSession = async (sessionId) => {
    return await gameSessionRepo.getSessionById(sessionId);
};

module.exports = {
    createGameSession,
    getGameSession
};
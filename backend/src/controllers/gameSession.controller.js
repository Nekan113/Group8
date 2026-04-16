const gameSessionService = require("../services/gameSession.service");

const createSession = async (req, res) => {
    try {
        console.log("req.user:", req.user);

        const userId = req.user.userId;
        const session = await gameSessionService.createGameSession(userId);

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSession = async (req, res) => {
    try {
        const session = await gameSessionService.getGameSession(req.params.id);
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSession,
    getSession
};
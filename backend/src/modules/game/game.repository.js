const Game = require('../../shared/models/game.model');
const mongoose = require('mongoose');

class GameRepository {
    async createGame(gameData) {
        return await Game.create(gameData);
    }

    async findById(gameId) {
        return await Game.findById(gameId);
    }

    async findUserGames(userId) {
        const oid = new mongoose.Types.ObjectId(userId);
        return await Game.find({
            $or: [
                { 'player1.userId': oid },
                { 'player2.userId': oid },
            ],
            status: { $ne: 'ACTIVE' },
        }).sort({ startTime: -1 });
    }

    async searchUserGames(userId, query) {
        const oid = new mongoose.Types.ObjectId(userId);

        if (!query) {
            return await Game.find({
                $or: [{ 'player1.userId': oid }, { 'player2.userId': oid }],
                status: { $ne: 'ACTIVE' },
            }).sort({ startTime: -1 });
        }

        return await Game.aggregate([
            {
                $match: {
                    $or: [{ 'player1.userId': oid }, { 'player2.userId': oid }],
                    status: { $ne: 'ACTIVE' },
                },
            },
            { $addFields: { idString: { $toLower: { $toString: '$_id' } } } },
            {
                $match: {
                    $or: [
                        { 'player1.username': { $regex: query, $options: 'i' } },
                        { 'player2.username': { $regex: query, $options: 'i' } },
                        { idString: { $regex: query.toLowerCase() } },
                    ],
                },
            },
            { $sort: { startTime: -1 } },
        ]);
    }

    async filterUserGames(userId, { startDate, endDate, result, gameType, sortOrder }) {
        const oid = new mongoose.Types.ObjectId(userId);
        const filter = {
            $or: [{ 'player1.userId': oid }, { 'player2.userId': oid }],
            status: { $ne: 'ACTIVE' },
        };

        if (startDate || endDate) {
            filter.startTime = {};
            if (startDate) filter.startTime.$gte = new Date(startDate);
            if (endDate) filter.startTime.$lte = new Date(endDate);
        }

        if (gameType) filter.gameType = gameType;

        const sort = { startTime: sortOrder === 'asc' ? 1 : -1 };
        const games = await Game.find(filter).sort(sort);

        if (!result) return games;

        return games.filter((game) => {
            if (result === 'aborted') return game.status === 'ABORTED';
            if (game.status !== 'FINISHED') return false;
            if (result === 'draw') return game.winner === 'draw';

            const isPlayer1 = game.player1.userId?.toString() === userId.toString();
            const mySlot = isPlayer1 ? 'player1' : 'player2';
            if (result === 'win') return game.winner === mySlot;
            if (result === 'lose') return game.winner !== mySlot && game.winner !== 'draw';
            return true;
        });
    }

    async findWaitingOnlineGames() {
        return await Game.find({
            gameType: 'ONLINE',
            status: 'WAITING',
            'player2.userId': null,
        }).sort({ startTime: -1 });
    }

    async deleteUserWaitingRooms(userId) {
        const oid = new mongoose.Types.ObjectId(userId);
        return await Game.deleteMany({
            gameType: 'ONLINE',
            status: 'WAITING',
            'player1.userId': oid,
            'player2.userId': null,
        });
    }

    async findOnlineGames() {
        return await Game.find({ gameType: 'ONLINE' }).sort({ startTime: -1 });
    }

    async findActiveOnlineGames() {
        return await Game.find({ gameType: 'ONLINE', status: 'ACTIVE' }).sort({ startTime: -1 });
    }

    async searchOnlineGamesForAdmin(query) {
        if (!query) {
            return await Game.find({ gameType: 'ONLINE' }).sort({ startTime: -1 });
        }

        // $toString on _id lets partial shortcodes (e.g. last-6 chars shown in UI) match
        return await Game.aggregate([
            { $match: { gameType: 'ONLINE' } },
            { $addFields: { idString: { $toLower: { $toString: '$_id' } } } },
            {
                $match: {
                    $or: [
                        { 'player1.username': { $regex: query, $options: 'i' } },
                        { 'player2.username': { $regex: query, $options: 'i' } },
                        { idString: { $regex: query.toLowerCase() } },
                    ],
                },
            },
            { $sort: { startTime: -1 } },
        ]);
    }
}

module.exports = new GameRepository();

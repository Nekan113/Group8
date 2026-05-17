const gameService = require('../services/game.service');

module.exports = {
    // Profile module
    findUserGames: (userId) => gameService.getGameHistory(userId),
    searchUserGames: (userId, query) => gameService.searchGameHistory(userId, query),
    filterUserGames: (userId, filters) => gameService.filterGameHistory(userId, filters),

    // Admin module
    findAllOnlineGames: () => gameService.getOnlineGames(),
    searchOnlineGames: (query) => gameService.searchOnlineGamesAdmin(query),
    adminCloseGame: (gameId) => gameService.adminAbortGame(gameId),
};

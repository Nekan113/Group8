const gameService = require('./game.service');

module.exports = {
    findUserGames:      (userId)          => gameService.getGameHistory(userId),
    searchUserGames:    (userId, query)   => gameService.searchGameHistory(userId, query),
    filterUserGames:    (userId, filters) => gameService.filterGameHistory(userId, filters),
    findAllOnlineGames: ()                => gameService.getOnlineGames(),
    searchOnlineGames:  (query)           => gameService.searchOnlineGamesAdmin(query),
    adminCloseGame:     (gameId)          => gameService.adminAbortGame(gameId),
};

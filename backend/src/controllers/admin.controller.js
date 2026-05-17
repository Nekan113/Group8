const adminService = require('../services/admin.service');
const { userResponseDTO } = require('../dtos/user.dto');
const { adminGameDTO } = require('../dtos/game.dto');

class AdminController {
    //Player management

    async getAllPlayers(req, res) {
        try {
            const players = await adminService.getAllPlayers();
            res.status(200).json(players.map(userResponseDTO));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async toggleStatus(req, res) {
        try {
            const { status } = req.body;
            const targetUserId = req.params.id;
            const adminId = req.user.userId;

            const updatedUser = await adminService.toggleUserStatus(adminId, targetUserId, status);
            res.status(200).json({
                message: `User account has been ${status.toLowerCase()}`,
                user: userResponseDTO(updatedUser),
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    //Online game room management

    async getOnlineGames(req, res) {
        try {
            const games = await adminService.getOnlineGames();
            res.status(200).json(games.map(adminGameDTO));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async searchOnlineGames(req, res) {
        try {
            const { query } = req.query;
            const games = await adminService.searchOnlineGames(query || '');
            res.status(200).json(games.map(adminGameDTO));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async closeGameRoom(req, res) {
        try {
            const game = await adminService.closeGameRoom(req.params.id);
            res.status(200).json({ message: 'Game room closed successfully', game: adminGameDTO(game) });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AdminController();

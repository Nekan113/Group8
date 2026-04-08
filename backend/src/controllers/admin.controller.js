const adminService = require('../services/admin.service');

class AdminController {
    async getAllPlayers(req, res) {
        try {
            const players = await adminService.getAllPlayers();
            res.status(200).json(players);
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
                user: updatedUser
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AdminController();
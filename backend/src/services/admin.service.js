const adminRepository = require('../repositories/admin.repository');

class AdminService {
    async getAllPlayers() {
        return await adminRepository.findAllPlayers();
    }

    async toggleUserStatus(adminId, targetUserId, status) {
        if (adminId === targetUserId) {
            throw new Error('Admins cannot change their own status');
        }

        const user = await adminRepository.findUserById(targetUserId);
        if (!user) {
            throw new Error('User not found');
        }

        return await adminRepository.updateStatus(targetUserId, status);
    }
}

module.exports = new AdminService();
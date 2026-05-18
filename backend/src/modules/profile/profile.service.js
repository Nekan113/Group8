const bcrypt = require('bcryptjs');
const profileRepository = require('./profile.repository');
const gameInterface = require('../game/game.interface');
const { sendPremiumConfirmationEmail } = require('../../shared/utils/email.service');

class ProfileService {
    async getProfile(userId) {
        const user = await profileRepository.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
    }

    async isUserPremium(userId) {
        const user = await profileRepository.findById(userId);
        return user?.isPremium || false;
    }

    async updateProfile(userId, { username, email, country }) {
        const updates = {};
        if (username !== undefined) updates.username = username;
        if (email !== undefined) updates.email = email;
        if (country !== undefined) updates.country = country;

        if (Object.keys(updates).length === 0) throw new Error('No fields provided to update');

        if (updates.email || updates.username) {
            const conflict = await profileRepository.findConflict(
                userId,
                updates.email,
                updates.username
            );
            if (conflict) {
                const field = conflict.email === updates.email ? 'Email' : 'Username';
                throw new Error(`${field} is already taken`);
            }
        }

        return await profileRepository.updateProfile(userId, updates);
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await profileRepository.findByIdWithPassword(userId);
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw new Error('Current password is incorrect');

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        return await profileRepository.updatePassword(userId, hashed);
    }

    async updateAvatar(userId, avatarPath) {
        if (!avatarPath) throw new Error('No avatar file provided');
        return await profileRepository.updateAvatar(userId, avatarPath);
    }

    async getGameHistory(userId) {
        return await gameInterface.findUserGames(userId);
    }

    async searchGameHistory(userId, query) {
        return await gameInterface.searchUserGames(userId, query);
    }

    async filterGameHistory(userId, filters) {
        return await gameInterface.filterUserGames(userId, filters);
    }

    async deposit(userId, amount) {
        if (amount <= 0) throw new Error('Deposit amount must be greater than zero');
        return await profileRepository.updateWallet(userId, amount);
    }

    async subscribe(userId) {
        const user = await profileRepository.findById(userId);
        if (!user) throw new Error('User not found');
        if (user.wallet < 10) throw new Error('Insufficient wallet balance. Please deposit at least $10.');

        const now = new Date();
        const expiry = new Date(now);
        expiry.setMonth(expiry.getMonth() + 1);

        await profileRepository.updateWallet(userId, -10);
        const updated = await profileRepository.updatePremiumStatus(userId, true, expiry);

        sendPremiumConfirmationEmail(user.email, user.username, expiry).catch((err) =>
            console.error('[Email] Failed to send premium confirmation:', err.message)
        );

        return updated;
    }
}

module.exports = new ProfileService();

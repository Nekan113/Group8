const User = require('../models/auth.model');

class AuthRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
        return await User.findById(id);
    }

    async createUser(userData) {
       return await User.create(userData);
    }

    async updateLoginAttempts(userId, attempts, lockUntil = null ) {
        return await User.findByIdAndUpdate(userId, { loginAttempts: attempts, lockUntil});
    }
    

    async findAllPlayers() {
        return await User.find({}).select('-password');
    }

 
    async updateAccountStatus(userId, status) {
        return await User.findByIdAndUpdate(userId, { accountStatus: status }, { new: true });
    }

    async updateUserProfile(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }

}

module.exports = new AuthRepository();


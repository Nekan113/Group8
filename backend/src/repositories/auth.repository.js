const User = require('../models/user.model');

class AuthRepository {
    async findByEmailOrUsername(email, username) { 
        return await User.findOne({ 
            $or: [
                { email: email }, 
                { username: username }
            ] 
        });
    }

    async createUser(userData) {
       return await User.create(userData);
    }

    async updateLoginAttempts(userId, attempts, lockUntil = null ) {
        return await User.findByIdAndUpdate(userId, { loginAttempts: attempts, lockUntil});
    }
    
}

module.exports = new AuthRepository();


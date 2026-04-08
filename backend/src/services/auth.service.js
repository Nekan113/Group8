const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/auth.repository');


class AuthService {
  async register(userData) {
    const existingUser = await authRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email address already in use');
    }

  
    return await authRepository.createUser(userData);
  }

  
  async login(email, password) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    

   
    const now = Date.now();
    if (user.lockUntil && user.lockUntil > now) {
      const remainingTime = Math.ceil((user.lockUntil - now) / 1000);
      throw new Error(`Account locked. Please try again in ${remainingTime} seconds`);
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      let attempts = (user.loginAttempts || 0) + 1;
      let lockUntil = null;

      if (attempts >= 5) {
        lockUntil = now + 60000; 
      }

      await authRepository.updateLoginAttempts(user._id, attempts, lockUntil);
      throw new Error('Invalid email or password');
    }


    
    await authRepository.updateLoginAttempts(user._id, 0, null);


    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user };
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await authRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error('Current password is incorrect'); 

    user.password = newPassword;
    return await user.save();
  }

  async getUserById(id) {
        const user = await authRepository.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    async updateProfile(userId, updateData) {
        return await authRepository.updateUserProfile(userId, updateData);
    }

    async getAllUsers() {
        return await authRepository.findAllPlayers();
    }
}

module.exports = new AuthService();
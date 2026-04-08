const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/auth.repository');


class AuthService {
  async register(userData) {
    const existingUser = await authRepository.findByEmailOrUsername(userData.email, userData.username);
    if (existingUser) {
      const field = existingUser.email === userData.email ? 'Email' : 'Username';
      throw new Error(`${field} already exists`);
    }
    return await authRepository.createUser(userData);
  }

  
  async login(identifier, password) {
    const user = await authRepository.findByEmailOrUsername(identifier, identifier);
    if (!user) {
      throw new Error('Invalid username/email or password');
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
      throw new Error('Invalid username/email or password');
    }

    if (user.status === 'BANNED') {
      throw new Error('Your account has been banned. Please contact support for more information.');
    }
    
    await authRepository.updateLoginAttempts(user._id, 0, null);


    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status
    };

    return { token, user: userResponse };
  }

  // async updatePassword(userId, currentPassword, newPassword) {
  //   const user = await authRepository.findById(userId);
  //   if (!user) throw new Error('User not found');

  //   const isMatch = await bcrypt.compare(currentPassword, user.password);
  //   if (!isMatch) throw new Error('Current password is incorrect'); 

  //   user.password = newPassword;
  //   return await user.save();
  // }

}


module.exports = new AuthService();
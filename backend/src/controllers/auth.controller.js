
const authService = require('../services/auth.service');


const { userResponseDTO } = require('../dtos/auth.dto');

class AuthController {
    async register(req, res) {
        try {
            const userData = req.body;
            const newUser = await authService.register(userData);
         
            res.status(201).json({
                message: "User registered successfully",
                user: userResponseDTO(newUser)
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, user } = await authService.login(email, password);
            
        
            res.status(200).json({
                message: "Login successful",
                token, 
                user: userResponseDTO(user)
            });
        } catch (error) {
          
            res.status(401).json({ message: error.message });
        }
    }

    
    async logout(req, res) {
        try {
           
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            res.status(500).json({ message: "Logout failed" });
        }
    }

    
    async getAllPlayers(req, res) {
        try {
            const players = await authService.getAllUsers();
            const playersData = players.map(player => userResponseDTO(player));
            
            res.status(200).json(playersData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            const user = await authService.getUserById(req.user.userId);
            res.status(200).json(userResponseDTO(user)); 
        } catch (error) {
            res.status(404).json({ message: "User not found" });
        }
    }

    async updateProfile(req, res) {
        try {
            const updatedUser = await authService.updateProfile(req.user.userId, req.body);
            res.status(200).json(userResponseDTO(updatedUser));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            await authService.updatePassword(req.user.userId, currentPassword, newPassword);
            res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}


module.exports = new AuthController();
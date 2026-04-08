const userResponseDTO = (user) => {
    return {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        country: user.country,
        premiumStatus: user.premiumStatus || false
    };
};

module.exports = { userResponseDTO };

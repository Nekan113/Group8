const express = require("express");
const router = express.Router();
const gameSessionController = require("../controllers/gameSession.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/", verifyToken, gameSessionController.createSession);
router.get("/:id", gameSessionController.getSession);

module.exports = router;
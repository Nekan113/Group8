require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes"); 

const app = express();


app.use(cors());
app.use(express.json());

connectDB();

// API routes
app.use("/api/auth", authRoutes); 

app.get("/", (req, res) => {
  res.send("TicTacToang API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
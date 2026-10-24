const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();

const app = express();

const PropertyRoutes = require("./routes/PropertyRoutes");
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/properties", PropertyRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Real Estate Portal API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
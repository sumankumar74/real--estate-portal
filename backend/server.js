
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

const authRoutes = require("./routes/Authroutes");
const PropertyRoutes = require("./routes/PropertyRoutes");
const EnquiryRoutes = require("./routes/EnquiryRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/enquiries", EnquiryRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Real Estate Portal API is running",
  });
});

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataRouter = require("./routes/data");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: "credenceanalytics"
}).then(() => {
  console.log("MongoDB connected successfully...");
}).catch((err) => {
  console.log("MongoDB connection failed", err);
});

// Routes
app.use("/", dataRouter);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

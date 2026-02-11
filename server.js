const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
const referenceRoutes = require("./routes/referenceRoutes");
app.use("/api/references", referenceRoutes);

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

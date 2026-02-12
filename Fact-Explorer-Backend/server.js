require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const factRoutes = require('./routes/facts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/facts', factRoutes);

// Database Connection (Local)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Local MongoDB Connected Successfully!"))
  .catch(err => {
      console.error("❌ Connection Failed:", err.message);
      console.log("👉 Tip: Make sure the 'MongoDB' service is running in Task Manager.");
  });

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/equipment', require('./routes/equipment.routes'));
app.use('/api/request', require('./routes/request.routes'));
app.use('/api/teams', require('./routes/team.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

// Connect DB
connectDB();

module.exports = app;

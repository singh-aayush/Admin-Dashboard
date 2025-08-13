// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const postRoutes = require('./src/routes/posts');
const logRoutes = require('./src/routes/logs');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const allowedOrigins = process.env.FRONTEND_ORIGIN?.split(",") || 'https://admin-dashboard-frontend-ivory.vercel.app';

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
  },
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/history', logRoutes);

app.get('/health', (req, res) => res.json({ ok: "API is successfully running. Congratulations!!! 😅" }));

app.use(errorHandler);

module.exports = app;

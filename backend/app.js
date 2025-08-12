const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const postRoutes = require('./src/routes/posts');
const logRoutes = require('./src/routes/logs');

const app = express();

// middlewares
app.use(express.json());
app.use(morgan('dev'));
const allowedOrigins = process.env.FRONTEND_ORIGIN?.split(",") || [];

app.use(cors({
  origin: allowedOrigins || 'https://admin-dashboard-frontend-ivory.vercel.app', 
  credentials: true
}));



// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/history', logRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: "Api is successfully running. Congratulations!!! 😅" }));

// error handler (last)
app.use(errorHandler);

module.exports = app;

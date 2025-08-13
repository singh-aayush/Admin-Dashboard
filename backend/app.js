// index.js (or your main backend entry file)

require('dotenv').config(); // <-- load env variables at the top

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
  origin: function(origin, callback) {
    // allow requests with no origin (like curl or mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
    }
  },
  credentials: true,
}));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/history', logRoutes);

// health check
app.get('/health', (req, res) => res.json({ ok: "API is successfully running. Congratulations!!! 😅" }));

// error handler (last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

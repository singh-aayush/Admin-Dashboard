require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/rbac_dashboard').then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

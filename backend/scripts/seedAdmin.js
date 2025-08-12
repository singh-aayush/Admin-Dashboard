require('dotenv').config();
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

async function seed() {
  console.log('Starting seed process...');
  await connectDB(process.env.MONGO_URI);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  console.log(`Checking for existing admin with email: ${adminEmail}`);
  const exists = await User.findOne({ email: adminEmail });

  if (exists) {
    console.log('Admin already exists:', adminEmail);
    process.exit(0);
  }

  console.log('Creating admin user...');
  const admin = new User({
    fullName: 'Admin User',
    email: adminEmail,
    password: adminPassword,
    role: 'admin'
  });

  await admin.save();
  console.log('Seeded admin successfully:');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Error seeding admin:', err);
  process.exit(1);
});

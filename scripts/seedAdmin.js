/**
 * Seed Admin Script
 * -----------------
 * Run this once to make specific email addresses admin users.
 * Users must have logged in at least once via Google before running this.
 *
 * Usage:
 *   node scripts/seedAdmin.js admin@example.com another@example.com
 *
 * Or edit the DEFAULT_ADMINS array below and run:
 *   node scripts/seedAdmin.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { UserModel } from '../src/features/auth/user.model.js';

// ─── Default admin emails (edit this list) ────────────────────────────────────
const DEFAULT_ADMINS = [
  // Add your admin email addresses here, e.g.:
  // 'your.email@gmail.com',
];

async function seedAdmins() {
  const emails = process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : DEFAULT_ADMINS;

  if (emails.length === 0) {
    console.error('❌ No emails provided.');
    console.error('   Usage: node scripts/seedAdmin.js email1@gmail.com email2@gmail.com');
    console.error('   Or edit DEFAULT_ADMINS in this file.');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB\n');

  for (const email of emails) {
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`⚠️  ${email} — user not found (they need to log in via Google first)`);
      continue;
    }

    if (user.role === 'admin') {
      console.log(`✅ ${email} — already an admin`);
      continue;
    }

    user.role = 'admin';
    await user.save();
    console.log(`🔑 ${email} — promoted to admin`);
  }

  await mongoose.disconnect();
  console.log('\n✅ Done');
}

seedAdmins().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

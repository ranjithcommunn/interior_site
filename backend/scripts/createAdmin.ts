import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../src/config/env";
import { AdminUser } from "../src/models/AdminUser";

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4];

  if (!email || !password) {
    console.error("Usage: npm run create-admin -- <email> <password> [name]");
    process.exit(1);
  }

  await mongoose.connect(env.mongoUri);

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash, name, role: "owner", isActive: true },
    { upsert: true, new: true }
  );

  console.log(`Admin user ready: ${admin.email}`);

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});

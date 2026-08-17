import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { User } from "../models/User.js";
import { Member } from "../models/Member.js";

dotenv.config();

const SEED_USER = {
  name: "Sujal",
  email: "sujal@docvault.local",
};

const SEED_MEMBERS = [
  { name: "Sujal", relationship: "self" },
  { name: "Father", relationship: "father" },
  { name: "Mother", relationship: "mother" },
  { name: "XYZ", relationship: "son" },
];

async function seed() {
  await connectDatabase();

  const user = await User.findOneAndUpdate(
    { email: SEED_USER.email },
    { $set: SEED_USER },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  for (const memberData of SEED_MEMBERS) {
    await Member.findOneAndUpdate(
      {
        userId: user._id,
        name: memberData.name,
        relationship: memberData.relationship,
      },
      {
        $set: {
          userId: user._id,
          name: memberData.name,
          relationship: memberData.relationship,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const members = await Member.find({ userId: user._id }).sort({ createdAt: 1 }).lean();

  console.log("Seed complete.");
  console.log(`User ID: ${user._id.toString()}`);
  console.log(`Members: ${members.length}`);
  members.forEach((member) => {
    console.log(`  - ${member.name} (${member.relationship}) [${member._id.toString()}]`);
  });
  console.log("\nSet this in apps/frontend/.env:");
  console.log(`VITE_DEV_USER_ID=${user._id.toString()}`);

  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await disconnectDatabase();
  process.exit(1);
});

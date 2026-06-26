import mongoose from "mongoose";
import slugify from "slugify";
import { env } from "../src/config/env";
import { Category } from "../src/models/Category";

const topLevelCategories = [
  {
    name: "Living Room",
    handle: "living",
    subCategories: ["Sofas", "Sofa Cum Bed", "Recliners", "Chairs", "Tables", "Bean Bags", "Pouffes"],
  },
  {
    name: "Dining",
    handle: "dining",
    subCategories: ["Dining Tables", "Dining Chairs", "Crockery Units"],
  },
  {
    name: "Bedroom",
    handle: "bedroom",
    subCategories: ["Bed Cots", "Head Boards", "Bed Room Tables", "Bunker Beds"],
  },
  {
    name: "Office",
    handle: "office",
    subCategories: [
      "Cabin Tables",
      "Work Station Tables",
      "Office Boss Chairs",
      "Office Visitors Chair",
      "Office Waiting Chairs",
    ],
  },
  {
    name: "Storage",
    handle: "storage",
    subCategories: ["TV Units", "Box Shelves", "Shoe Rack", "Dressing Table", "Wardrobes"],
  },
  {
    name: "Study Room",
    handle: "study",
    subCategories: ["Study Tables", "Chairs"],
  },
  {
    name: "Outdoor",
    handle: "outdoor",
    subCategories: ["Outdoor Dining", "Outdoor Seating & Chairs", "Outdoor Sofas", "Sun Loungers"],
  },
  {
    name: "Mattress",
    handle: "matress",
    subCategories: ["King Size", "Queen Size", "Single Bed", "Double Bed"],
  },
];

async function seed() {
  await mongoose.connect(env.mongoUri);

  for (const [index, cat] of topLevelCategories.entries()) {
    const parent = await Category.findOneAndUpdate(
      { handle: cat.handle },
      { name: cat.name, handle: cat.handle, parentCategory: null, rank: index, isActive: true },
      { upsert: true, new: true }
    );
    console.log(`Seeded category: ${cat.name}`);

    for (const [subIndex, subName] of cat.subCategories.entries()) {
      const subHandle = `${cat.handle}-${slugify(subName, { lower: true })}`;
      await Category.findOneAndUpdate(
        { handle: subHandle },
        {
          name: subName,
          handle: subHandle,
          parentCategory: parent._id,
          rank: subIndex,
          isActive: true,
        },
        { upsert: true, new: true }
      );
      console.log(`  Seeded sub-category: ${subName} (${subHandle})`);
    }
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

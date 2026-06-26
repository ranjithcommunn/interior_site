import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import slugify from "slugify";
import { env } from "../src/config/env";
import { Category } from "../src/models/Category";
import { Product } from "../src/models/Product";

const CSV_PATH = path.join(__dirname, "data", "catalog.csv");

// Minimal RFC4180-style CSV parser: handles quoted fields containing
// commas, embedded newlines, and escaped double-quotes ("").
function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const next = content[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // skip, \n handles the line break
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

// Top-level categories already seeded by scripts/seed.ts — map every
// casing variant found in the sheet ("BedRoom", "living", "office", ...)
// to the canonical handle.
const TOP_LEVEL_BY_NAME: Record<string, string> = {
  dining: "dining",
  study: "study",
  bedroom: "bedroom",
  storage: "storage",
  living: "living",
  office: "office",
  outdoor: "outdoor",
  mattress: "matress",
};

// Known casing fixes so near-duplicate sub-categories collapse into one
// (e.g. "Tv Units" / "TV Units", "chairs " / "Chairs").
const SUBCATEGORY_ALIASES: Record<string, string> = {
  "tv units": "TV Units",
  "chairs": "Chairs",
  "recliners": "Recliners",
  "office boss chairs": "Office Boss Chairs",
  "cabin tables": "Cabin Tables",
  "bunker beds": "Bunker Beds",
  "sun loungers": "Sun Loungers",
  "outdoor sofas": "Outdoor Sofas",
  "pouffers": "Pouffes",
  "pouffes": "Pouffes",
  "work tables": "Work Tables",
  "work station tables": "Work Station Tables",
  "wing chair": "Wing Chair",
};

function normalizeSubCategoryName(raw: string): string {
  const cleaned = cleanText(raw);
  const key = cleaned.toLowerCase();
  return SUBCATEGORY_ALIASES[key] || cleaned;
}

interface ParsedProduct {
  topLevelHandle: string;
  subCategoryName: string;
  title: string;
  details: string;
}

function loadCatalog(): ParsedProduct[] {
  const content = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCsv(content);
  const [, ...dataRows] = rows; // skip header row

  const products: ParsedProduct[] = [];

  for (const row of dataRows) {
    const [, , categoryRaw, subCategoryRaw, titleRaw, detailsRaw] = row;
    if (!categoryRaw || !subCategoryRaw) continue;

    const topLevelHandle = TOP_LEVEL_BY_NAME[cleanText(categoryRaw).toLowerCase()];
    if (!topLevelHandle) {
      console.warn(`Skipping unrecognized category: "${categoryRaw}"`);
      continue;
    }

    products.push({
      topLevelHandle,
      subCategoryName: normalizeSubCategoryName(subCategoryRaw),
      title: cleanText(titleRaw || ""),
      details: cleanText(detailsRaw || ""),
    });
  }

  return products;
}

async function run() {
  await mongoose.connect(env.mongoUri);

  const products = loadCatalog();
  console.log(`Parsed ${products.length} product rows from catalog.csv`);

  // 1) Create/find sub-categories per top-level category
  const subCategoryIdByKey = new Map<string, mongoose.Types.ObjectId>();
  const subCategoryRankByParent = new Map<string, number>();

  for (const p of products) {
    const key = `${p.topLevelHandle}::${p.subCategoryName.toLowerCase()}`;
    if (subCategoryIdByKey.has(key)) continue;

    const parent = await Category.findOne({ handle: p.topLevelHandle });
    if (!parent) {
      throw new Error(
        `Top-level category "${p.topLevelHandle}" not found — run "npm run seed" first.`
      );
    }

    const subHandle = `${p.topLevelHandle}-${slugify(p.subCategoryName, { lower: true })}`;
    const rank = subCategoryRankByParent.get(p.topLevelHandle) || 0;
    subCategoryRankByParent.set(p.topLevelHandle, rank + 1);

    const subCategory = await Category.findOneAndUpdate(
      { handle: subHandle },
      {
        name: p.subCategoryName,
        handle: subHandle,
        parentCategory: parent._id,
        rank,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    subCategoryIdByKey.set(key, subCategory._id as mongoose.Types.ObjectId);
    console.log(`Sub-category: ${parent.name} > ${p.subCategoryName} (${subHandle})`);
  }

  // 2) Create products under their sub-category
  const usedHandles = new Set<string>();
  let createdCount = 0;
  let rankByCategory = new Map<string, number>();

  for (const p of products) {
    const key = `${p.topLevelHandle}::${p.subCategoryName.toLowerCase()}`;
    const categoryId = subCategoryIdByKey.get(key)!;

    const title = p.title || `Untitled ${p.subCategoryName}`;
    let baseHandle = slugify(`${p.topLevelHandle}-${p.subCategoryName}-${title}`, { lower: true });
    let handle = baseHandle;
    let suffix = 2;
    while (usedHandles.has(handle)) {
      handle = `${baseHandle}-${suffix}`;
      suffix++;
    }
    usedHandles.add(handle);

    const rank = rankByCategory.get(key) || 0;
    rankByCategory.set(key, rank + 1);

    await Product.findOneAndUpdate(
      { handle },
      {
        title,
        handle,
        description: p.details,
        category: categoryId,
        images: [],
        thumbnail: "",
        isActive: true,
        isFeatured: false,
        rank,
      },
      { upsert: true, new: true }
    );
    createdCount++;
  }

  console.log(`Imported/updated ${createdCount} products.`);
  await mongoose.disconnect();
  console.log("Import complete.");
}

run().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});

import fs from "fs";
import path from "path";

const CSV_PATH = path.join(__dirname, "data", "catalog.csv");

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
      // skip
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

const content = fs.readFileSync(CSV_PATH, "utf-8");
const rows = parseCsv(content);
const [header, ...dataRows] = rows;

console.log("Header:", header);
console.log("Total data rows:", dataRows.length);

const unrecognized = new Set<string>();
const grouping = new Map<string, Set<string>>();
let blankTitles = 0;

for (const row of dataRows) {
  const [, , categoryRaw, subCategoryRaw, titleRaw] = row;
  if (!categoryRaw || !subCategoryRaw) continue;

  const topKey = cleanText(categoryRaw).toLowerCase();
  const topLevelHandle = TOP_LEVEL_BY_NAME[topKey];
  if (!topLevelHandle) {
    unrecognized.add(categoryRaw);
    continue;
  }

  if (!titleRaw || cleanText(titleRaw) === "") blankTitles++;

  if (!grouping.has(topLevelHandle)) grouping.set(topLevelHandle, new Set());
  grouping.get(topLevelHandle)!.add(cleanText(subCategoryRaw));
}

console.log("\nUnrecognized categories:", [...unrecognized]);
console.log("Blank titles:", blankTitles);
console.log("\nCategory -> Sub-categories:");
for (const [cat, subs] of grouping) {
  console.log(`\n${cat} (${subs.size} sub-categories):`);
  for (const s of subs) console.log(`  - ${s}`);
}

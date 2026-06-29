// Generates public/sitemap.xml from live categories/products so search engines
// can discover dynamic routes that don't exist as static files. Run via
// `npm run generate-sitemap` (also wired into `npm run build`).
import { writeFileSync, readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(rootDir, ".env");
  const env = { ...process.env };
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key) env[key.trim()] = rest.join("=").trim();
    }
  }
  return env;
}

const env = loadEnv();
const BACKEND_URL = env.VITE_BACKEND_URL || "http://localhost:9000";
const API_KEY = env.VITE_API_KEY || "";
const SITE_URL = "https://vibrer.co.in";

const headers = {
  "x-publishable-api-key": API_KEY,
  "Content-Type": "application/json",
};

async function fetchJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }
  return response.json();
}

function flattenCategories(categories) {
  const flat = [];
  for (const cat of categories) {
    flat.push(cat);
    if (cat.category_children?.length) {
      flat.push(...flattenCategories(cat.category_children));
    }
  }
  return flat;
}

function urlEntry(loc, { changefreq = "weekly", priority = "0.7" } = {}) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  const entries = [
    urlEntry(`${SITE_URL}/`, { changefreq: "daily", priority: "1.0" }),
    urlEntry(`${SITE_URL}/shop`, { changefreq: "daily", priority: "0.9" }),
    urlEntry(`${SITE_URL}/about-us`, { changefreq: "monthly", priority: "0.6" }),
    urlEntry(`${SITE_URL}/contact-us`, { changefreq: "monthly", priority: "0.6" }),
  ];

  try {
    const { product_categories } = await fetchJson(`${BACKEND_URL}/store/product-categories`);
    const allCategories = flattenCategories(product_categories || []);

    for (const cat of allCategories) {
      if (!cat.handle) continue;
      const isTopLevel = cat.parent_category_id === null;
      if (isTopLevel) {
        entries.push(urlEntry(`${SITE_URL}/${cat.handle}/${cat.id}`, { priority: "0.8" }));
      } else {
        const parent = allCategories.find((c) => c.id === cat.parent_category_id);
        const parentHandle = parent?.handle;
        if (parentHandle) {
          entries.push(
            urlEntry(`${SITE_URL}/${parentHandle}/${cat.handle}/${cat.id}`, { priority: "0.7" })
          );
        }
      }
    }

    // Products: walk every category and collect its products' detail pages.
    const seenProductIds = new Set();
    for (const cat of allCategories) {
      const { products } = await fetchJson(
        `${BACKEND_URL}/store/products?category_id=${cat.id}`
      );
      for (const product of products || []) {
        if (seenProductIds.has(product.id)) continue;
        seenProductIds.add(product.id);
        entries.push(urlEntry(`${SITE_URL}/product/${product.id}`, { priority: "0.6" }));
      }
    }

    console.log(
      `Sitemap: ${allCategories.length} categories, ${seenProductIds.size} products fetched from ${BACKEND_URL}`
    );
  } catch (err) {
    console.warn(
      `Sitemap: could not reach backend at ${BACKEND_URL} (${err.message}). Writing static-only sitemap.`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  const outPath = path.join(rootDir, "public", "sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");
  console.log(`Sitemap written to ${outPath} (${entries.length} URLs)`);
}

main();

# Vibrer Interior/Furniture Site — Product Requirements Document (Current State Audit)

> This PRD documents the **current state** of the codebase as of 2026-06-25, including identified gaps and risks. It is meant as the baseline for scoping future work — no implementation has been done yet.

> **Update (2026-06-25):** The Medusa backend's data was lost. It has been replaced by a custom Node.js + TypeScript + MongoDB backend (`backend/`) and a React + TypeScript admin panel (`admin/`), both in this repo. See the build plan at the bottom of this section for what changed and what's still open. Sections 1–6 below describe the pre-rebuild state and are kept for historical context; items resolved by the rebuild are marked **[RESOLVED]**.

## 1. Overview

**Product:** Vibrer — a marketing + catalog website for SREGA Electronics & Furniture LLP's luxury furniture and interior design brand.

**What it does today:** Lets visitors browse furniture categories and products (synced live from a Medusa commerce backend), view product details, see kitchen-interior marketing content, and submit enquiry/contact forms. There is **no cart or checkout** — the site is a lead-generation catalog, not a transactional store.

**Stack:**
- React 18 + TypeScript, built with Vite
- Routing: `react-router-dom` v7
- Data: `medusa-react` / `@tanstack/react-query` v4, talking to a Medusa store API
- Styling: Tailwind CSS + a couple of shadcn/Radix UI primitives (`alert-dialog`, `button`)
- Animation/carousels: `framer-motion`, `swiper`, `react-slick`
- Backend: Medusa headless commerce (`VITE_BACKEND_URL`), used **only** for product/category catalog data

## 2. Routes & Pages (current)

| Path | Component | Data source |
|---|---|---|
| `/` | `Home` | Static sections + live "Trending Products" |
| `/search` | `Search` | **Fully static/mock data** |
| `/product/:product_id` and `/product/:category/:subCategory/:product_id` | `ProductViewPage` | Live (Medusa product + related-by-collection) |
| `/:category/:category_id` and `/:category/:subCategory/:category_id` | `CategoryPage` | Live (Medusa products by category) |
| `/kitchen-interior` | `KitchenInterior` | Static marketing content |
| `/contact-us` | `ContactUs` | Static + client-only form |

`NavBar` and `Footer` both independently fetch `/store/product-categories` from Medusa to build menus.

## 3. Components Inventory

- `HeroSection`, `ProductCategories` (carousel, hardcoded category→ID links), `Segments`, `TrendingProducts` (live products grid), `InteriorDesigning`, `AboutUs`, `OurProcess`, `StandsOut` — Home page sections, mostly static marketing blocks
- `EnquireNowBtn` — modal form (name/phone/email/message) used on product cards and product detail pages
- `Categories/CategoryPage` — category listing with sidebar sub-category nav + bestsellers carousel
- `ui/alert-dialog.tsx`, `ui/button.tsx` — Radix-based primitives

## 4. Findings: Issues & Risks

These are observations from reading the code, not yet prioritized or scoped — for triage in a follow-up conversation.

### Critical — lead capture is non-functional **[RESOLVED]**
- `EnquireNowBtn.tsx` and `ContactUs.tsx` forms **only `console.log` the submission** on submit. There is no API call, no email/CRM/webhook integration. Every "Enquire Now" and "Contact Us" submission today is silently lost — this is the core conversion mechanism of a lead-gen site and it doesn't work.
- **Resolved:** both forms now `POST /store/enquiries` on the new backend, with inline loading/success/error states (the blocking `alert()` in `ContactUs` was removed). Submissions land in a unified `Enquiry` collection, visible/manageable in the admin panel's Enquiries inbox.

### High — Search page is not real
- `src/Pages/Search.tsx` uses hardcoded arrays (`searchdata`, `menuList`, `BestsellersList`) instead of querying Medusa. Most sidebar sub-category links point to `"/"` (broken). The page renders but is disconnected from the actual catalog.

### High — secrets exposure in git history
- `.env` (containing `VITE_API_KEY` and `VITE_BACKEND_URL`) was committed to the repo in earlier commits (`API URL`, `Backend Integeration`, etc.) before `.env` was added to `.gitignore`. It's untracked now, but the key is recoverable from `git log`. Should confirm whether this is a sensitive secret (it's a Medusa *publishable* key, typically lower-risk, but worth a deliberate decision — rotate or accept). **Still open** — the same key value was reused as the new backend's `STORE_API_KEY` for continuity; consider rotating it now that a fresh backend exists.

### Medium — hardcoded backend identifiers scattered in UI — **still open, now higher-risk**
- `ProductCategories.tsx`, `Segments.tsx`, and `TrendingProducts.tsx` hardcode Medusa category IDs (e.g. `pcat_01JMM5XCCR5XDCDQ6Z0M1A9M0W`) directly in component code to build links. These IDs no longer exist at all (new backend uses MongoDB ObjectIds from the seed script) — **these links are now dangling and must be updated** to the new seeded category IDs (or, better, rewritten to look up categories by handle instead of hardcoding IDs). Not fixed as part of the backend rebuild — flagged as required follow-up.

### Medium — dead/duplicate config
- `src/config/config.ts` exports an unused `BackendURL` constant hardcoded to `https://api.vibrer.co.in`. Actual network calls use `import.meta.env.VITE_BACKEND_URL` instead (currently `http://localhost:9000` in the local `.env`). Two sources of truth for the backend URL — confusing and a likely source of "works locally, breaks in prod" bugs. **Still open** — `https://api.vibrer.co.in` no longer points at anything real now that Medusa is gone; this dead constant should be deleted once a production hosting target for the new `backend/` is chosen.

### Medium — no 404 / catch-all route
- `App.tsx`'s `<Routes>` has no wildcard route. Unmatched URLs render a blank page (just `NavBar`/`Footer`, no content).

### Medium — significant duplication
- `CategoryPage.tsx` and `Search.tsx` reimplement nearly identical sidebar/sub-category-menu and bestsellers-carousel logic independently.
- `CategoryPage`, `ProductViewPage`, and `TrendingProducts` each separately implement a "product grid card" (image + title + Enquire/View Details button) with slightly different markup.
- Category-fetching logic (`fetchProductCategories`) is copy-pasted across `NavBar`, `Footer`, and `CategoryPage`.
- Candidates for extraction: `useProductCategories()` hook, `ProductCard` component, `CategorySidebar` component.

### Low — orphaned route
- `/kitchen-interior` is not linked from `NavBar` or `Footer`; only reachable via direct URL.

### Low — debug leftovers & inconsistent loading/error UX
- `Footer.tsx` has 3 stray `console.log` statements.
- Loading states are inconsistent: some components show `MoonLoader`, one shows plain text `"loading.."`, `TrendingProducts` fails silently (console-only) with no user-facing fallback if the fetch errors.
- `ContactUs` success feedback is a blocking `alert()`.

### Low — form input correctness
- Phone number fields use `type="number"` (drops leading zeros, allows scientific notation/`e`, no max-length) instead of `type="tel"` with pattern validation.

### Low — no automated testing or CI
- No test files, no CI configuration found in the repo.

## 5. Out of Scope (confirmed by current architecture)
- Cart, checkout, payments, order management — not present and not implied by current routes/components.
- User accounts/auth — `UserIcon` button in `NavBar` is decorative, no auth flow wired up.

## 6. Open Questions (for prioritization later)
1. ~~Should "Enquire Now" / "Contact Us" submissions go to email, a CRM, a Medusa custom endpoint, or a third-party form service?~~ Resolved: they now persist to the new backend's `Enquiry` collection, manageable via the admin panel. (No email/CRM forwarding yet — purely in-app inbox for now.)
2. Is `/search` meant to become a real search/filter experience against the new backend, or is it slated for removal/replacement? **Still open** — `Search.tsx` remains fully mock/static; not touched by the backend rebuild.
3. Should `/kitchen-interior` be linked into navigation, or is it a legacy/unused page? **Still open.**
4. Is the committed `.env` API key considered sensitive enough to rotate? **Still open** — same key reused as the new backend's `STORE_API_KEY`.

## 7. Backend Rebuild (2026-06-25)

The Medusa backend and all its data are gone. Replaced with:
- **`backend/`** — Node.js + TypeScript + Express + MongoDB/Mongoose. Public `/store/*` endpoints replicate the old Medusa response shapes closely (categories with nested children, products by category, single product, "featured" products) so most storefront components needed no changes. New: `POST /store/enquiries` for the lead-capture fix above. Full admin REST API (`/admin/*`, JWT-protected) for categories/products/enquiries CRUD and Cloudinary signed image uploads.
- **`admin/`** — React + TypeScript (Vite) panel for the site owner to manage categories, sub-categories, products (with multi-image upload), and the enquiry inbox. No public registration; first admin user created via `backend/scripts/createAdmin.ts`.
- **Storefront changes required and made:** `ProductViewPage.tsx`'s related-products lookup switched from Medusa's `collection_id` to `category_id` (the "Collection" concept was dropped — one taxonomy instead of two); `TrendingProducts.tsx` switched from `?limit=12` (arbitrary "first N") to `?featured=true&limit=12` (a real curated flag, set per-product in the admin panel).
- **Data:** all old category/product data is unrecoverable. Only the 8 top-level categories (Living Room, Dining, Bedroom, Office, Storage, Study Room, Outdoor, Mattress) were pre-seeded (`backend/scripts/seed.ts`) to unblock frontend testing; all sub-categories and products must be entered manually via the admin panel.
- **Explicitly not addressed by the rebuild** (carried forward as open work): the hardcoded `pcat_...` IDs in `ProductCategories.tsx`/`Segments.tsx`/`TrendingProducts.tsx` (now dangling, see above), `Search.tsx` remaining static, no `SiteSettings`/editable contact info, no hosting platform chosen yet for `backend/`.

---
*This document reflects a code-reading audit only. No prioritization or implementation has occurred — next step is for you to specify which items to act on.*

# Vibrer Backend

Node.js + TypeScript + Express + MongoDB (Mongoose) API that replaces the lost Medusa backend. Serves the public storefront catalog/enquiry endpoints under `/store/*` and the admin panel's CRUD API under `/admin/*`.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, CLOUDINARY_* etc.
```

Required env vars (see `.env.example`):
- `MONGO_URI` — your MongoDB connection string (Atlas or self-hosted)
- `JWT_SECRET` — long random string for signing admin JWTs
- `STORE_API_KEY` — value the storefront sends as `x-publishable-api-key` (reuse the storefront's existing `VITE_API_KEY`)
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard, needed for the admin panel's image uploader
- `STORE_CORS_ORIGIN` / `ADMIN_CORS_ORIGIN` — origins allowed to call this API (storefront dev server / admin dev server)

## Running

```bash
npm run dev     # ts-node + nodemon, watches src/
npm run build   # compiles to dist/
npm start       # runs compiled dist/index.js
```

## One-off scripts

```bash
npm run seed                                   # upserts the 8 top-level categories
npm run create-admin -- <email> <password> [name]   # creates/updates an admin login
```

## API surface

- `GET /store/product-categories`, `GET /store/products`, `GET /store/products/:id`, `POST /store/enquiries` — public, require `x-publishable-api-key` header.
- `POST /admin/auth/login`, `GET /admin/auth/me` — admin auth.
- `/admin/categories`, `/admin/products`, `/admin/enquiries`, `/admin/upload/signature` — JWT-protected admin CRUD (Bearer token from login).

No automated tests exist yet — verify manually via the storefront and admin panel, or `curl`/Postman against `/health` and the above routes.

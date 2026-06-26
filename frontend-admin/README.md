# Vibrer Admin Panel

React + TypeScript (Vite) admin panel for managing categories, sub-categories, products, and viewing "Enquire Now" / "Contact Us" submissions. Talks to the `backend/` API.

## Setup

```bash
cd admin
npm install
cp .env.example .env   # point VITE_BACKEND_URL at the running backend
```

## Running

```bash
npm run dev      # starts on http://localhost:5174
npm run build
npm run preview
```

## First login

The backend has no public registration endpoint by design (single site-owner tool). Create the first admin user from `backend/`:

```bash
cd ../backend
npm run create-admin -- you@example.com yourpassword "Your Name"
```

Then log in at `http://localhost:5174/login` with those credentials.

## Pages

- **Dashboard** — counts of categories, products, new enquiries
- **Categories** — top-level + sub-category list, create/edit/delete, reorder via ↑/↓ (writes `rank`)
- **Products** — searchable/filterable list, create/edit form with multi-image upload (direct-to-Cloudinary, first image = thumbnail), Featured/Active toggles
- **Enquiries** — inbox of all "Enquire Now" and "Contact Us" submissions, filter by source/status, inline status update

Image uploads go straight from the browser to Cloudinary using a short-lived signature issued by the backend — no images pass through this app's own server.

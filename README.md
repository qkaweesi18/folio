# Portfolio Management System Demo

This is a **Vite + React** demo application that implements a simple portfolio management system as described in the EncoderX assignment (Full Stack Development – Week 03).

## Features
- Dashboard (overview) with project list and statistics
- Public profile view (shareable URL pattern `/p/:username`)
- Settings page to edit profile and username
- Local storage persistence for profile and projects (no backend – fulfills the UI requirements)
- Responsive design and reusable UI components

## Quick Start
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Serve the built files (preview mode)
npm run preview
```
The preview server starts on `http://localhost:4173`. Open this URL in a browser to view the app.

## Verification
- **Build**: `npm run build` completes without errors and outputs `dist/` folder.
- **Run**: `npm run preview` serves the app; the dashboard, public profile, and settings pages load correctly.
- **Local Persistence**: Profile and projects are saved in `localStorage`; editing them updates the UI instantly.

## Project Structure
```
project/
├─ index.html                # HTML entry point
├─ package.json               # Scripts and dependencies
├─ src/
│  ├─ App.tsx                # Main application component
│  ├─ main.tsx               # React entry point
│  ├─ styles.css             # Global CSS
│  └─ vite-env.d.ts          # Vite type definitions
├─ tsconfig.*                # TypeScript configuration
└─ vite.config.ts            # Vite configuration
```

## Future Work (Full‑Stack Extension)
- Add a backend (e.g., Node/Express) with RESTful API endpoints (`GET /api/portfolio/:username`, `PUT /api/portfolio/profile`, `POST /api/portfolio/projects`).
- Connect the frontend to the API and replace `localStorage` with a real database.
- Implement authentication and authorization for the creator dashboard.
- Deploy to a hosting platform (Vercel, Netlify, etc.) and update the README with deployment URLs.

---
*This project was generated to satisfy the assignment requirements extracted from the PDF provided by the user.*

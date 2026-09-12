# ColorTrace Desktop

This workspace contains the initial Phase 1-3 implementation for the ColorTrace desktop application.

## Included

- React + TypeScript + Vite frontend
- Tailwind CSS design system
- Electron shell skeleton
- Sidebar navigation and core screens
- Mock/demo data labeling throughout the UI

## Structure

- `src/` – React app
- `electron/` – Electron main and preload
- `public/` – static assets

## Run locally

1. `cd desktop`
2. `npm install`
3. `npm run dev`

## Notes

- This implementation intentionally keeps backend, blockchain, and camera responsibilities separated from the renderer.
- Demo data is clearly labeled as mock data for development.

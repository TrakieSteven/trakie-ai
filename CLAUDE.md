# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trakie.ai is a cannabis retail intelligence product demo/sales site built with **Next.js (App Router)** and TypeScript.

## Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run start    # Start production server
```

## Deployment

Deployed to Vercel with auto-detected Next.js framework. `vercel.json` sets `"framework": "nextjs"`.

## Architecture

Next.js App Router project with the following structure:

### File Structure

- `app/layout.tsx` — Root layout with metadata and security headers
- `app/page.tsx` — Main page orchestrator (client component), manages `activeSection` state
- `app/globals.css` — All CSS (verbatim from original `<style>` block), global classes
- `data/` — TypeScript data files: `categories.ts`, `products.ts`, `productCatalog.ts`
- `components/` — React components for each section
- `components/demo/` — Demo flow sub-components (IntroScreen, QrScreen, etc.)
- `public/` — All media assets (`.mov`, `.mp4`, `.webp`, `.png`, `product-photos/`)

### Page Sections

Sections are toggled via `activeSection` state in `app/page.tsx`:
- `home` — HomeSection (hero, features pyramid, StatsCarousel, demo CTA)
- `bubbles` — BubblesSection (product category video bubbles)
- `receive` — ReceiveSection (interactive receiving workflow demo)
- `pricing` — PricingSection
- `contact` — ContactSection

### Components

Key components:
- `Navbar.tsx` — Fixed nav, calls `onNavigate` prop
- `HomeSection.tsx` + `StatsCarousel.tsx` — Hero and carousel with autoplay
- `BubblesSection.tsx` — Video bubbles with hover play/pause via refs
- `ReceiveSection.tsx` — Demo state machine managing 10 demo steps
- `demo/` — IntroScreen, QrScreen, InvoiceScreen, UnderstandingScreen, MetrcVaultScreen, ProcessingScreen, ReceivingFormScreen, DutchieSyncScreen, ResultsScreen
- `ProductModal.tsx` — Product detail overlay
- `ProductGridScreen.tsx` — Category product grid overlay
- `SecurityLayer.tsx` — Anti-devtools, right-click block, console warnings
- `Watermark.tsx` — Copyright watermark overlay

### Receiving Demo Flow

The demo in `ReceiveSection.tsx` uses a `demoStep` state machine:
1. `intro` → Start button
2. `qr` → QR/camera video (click to advance)
3. `invoice` → Invoice video (click to advance)
4. `understandingInvoice` → AI processing animation (auto-advance 2s)
5. `product` → Product camera video (click to advance)
6. `understandingProducts` → AI processing animation (auto-advance 2s)
7. `metrcVault` → METRC checklist animation (auto-advance)
8. `processing` → Progress bar (click to advance)
9. `receivingForm` → Animated form fill (button to advance)
10. `dutchieSync` → Dutchie sync checklist (auto-advance)
11. `results` → Final results with product cards and SmartMove controls

### Password / Security

- WelcomeScreen is currently disabled (`style={{ display: 'none' }}`)
- SecurityLayer handles anti-devtools, right-click block, key combos, console warnings
- Watermark adds copyright overlay
- `robots: noindex, nofollow` set in layout metadata

## Assets

Media files live in `public/` and `public/product-photos/`. Product catalog images reference GitHub raw content URLs. Videos use `.mov` (quicktime) and `.mp4` sources.

## Design System

- **Background**: dark green `#0D1F0D` → near-black `#000000` gradient
- **Accent**: gold `#C9A961` / `#8B7355`
- **Fonts**: `'Outfit'` (sans-serif, body), `'Bodoni Moda'` (serif, display/logo)
- Active/shown states use `.active` or `.show` CSS classes
- CSS is global (no CSS modules) — all original class names preserved

## Legacy

The original `index.html` is still in the repo for reference but is no longer the active site.

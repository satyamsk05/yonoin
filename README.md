# Yono Games Hub - Affiliate Portal

Yono Games Hub is a static affiliate portal for premium Indian skill-gaming applications (Rummy, Slots, Spin, etc.). It pre-renders 75+ landing pages and a responsive search-and-filter enabled homepage card grid using high-fidelity static site generation (SSG) to ensure optimal SEO crawlability and fast load times.

## Folder Structure

```
├── index.html               # Compiled pre-rendered homepage (SSG)
├── index.template.html      # Source template for compiling the homepage
├── index.css                # Centralized global styles (incl. game page & modals)
├── app.js                   # Client-side routing, search, tabs & overlay logic
├── data.js                  # Frontend client-side data mirror
├── apps_data.json           # Master data database containing app fields & links
├── generate_pages.js        # SSG script to generate landing pages & index.html
├── site.webmanifest         # PWA Manifest
├── robots.txt               # Crawler instructions
├── sitemap.xml              # Search engine XML sitemap (auto-generated)
├── favicon.svg              # Main site favicon
├── games/                   # Target folder containing generated game html pages
├── logos/                   # Optimized game logo assets (.webp)
└── README.md                # Project documentation
```

## Setup & Compilation

To compile or regenerate the entire static site from the JSON database:

1. **Verify or install Node.js** (v14+ recommended).
2. **Compile the site**:
   ```bash
   node generate_pages.js
   ```
   This will:
   - Generate all 75+ individual HTML landing pages in `games/` with unique, randomized content variants.
   - Inject pre-rendered game cards inside `index.html` (replacing the cards placeholder).
   - Compile a dynamic `sitemap.xml` with the current last-modified dates.

## Compliance and SEO Features

- **Age Verification Gate**: Viewers must confirm they are 18+ before accessing content. Choices are persisted via local storage.
- **Link Interstitial**: Alerts users with a 3-second redirect countdown screen before sending them to external download URLs.
- **Structured Data**: Injects customized `FAQPage` and `SoftwareApplication` JSON-LD schemas in every page for rich google snippet integrations.
- **Unique Contents**: Uses rotating text variants for About descriptions and FAQ question sets, and custom pulls app-specific database variables (`min_withdrawal`, `payout_methods`, `unique_selling_point`) to eliminate duplicate boilerplate content warnings.

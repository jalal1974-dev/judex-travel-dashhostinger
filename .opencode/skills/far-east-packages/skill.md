# Far East Packages — Rich View Implementation

## Overview
7 Far East countries implemented with PDF itinerary embedding and 3-tab detail panels (Pricing | Itinerary (PDF) | Info) in both `packages.html` and `hotels-transport.html`.

## Countries Implemented
| Country | Code | Packages | PDF Folder | Ticket Default (JOD) | Profit Default (JOD) |
|---------|------|----------|------------|---------------------|---------------------|
| Vietnam | vn | 6 | `itineraries/vn/` | 349 | 30 |
| Sri Lanka | sl | 4 | `itineraries/sl/` | 349 | 30 |
| Maldives | mv | 4 | `itineraries/mv/` | 399 | 30 |
| Thailand | th | 7 | `itineraries/th/` | 299 | 30 |
| Singapore | sg | 4 | `itineraries/sg/` | 299 | 30 |
| Malaysia | my | 8 | `itineraries/my/` | 299 | 30 |
| Bali/Indonesia | bi | 8 | `itineraries/bi/` | 349 | 30 |

## File Structure
```
itineraries/{vn,sl,mv,th,sg,my,bi}/{country}_pkg{N}.pdf
  |-- packages.html      (full package prices: base + ticket + profit)
  |-- hotels-transport.html  (hotel-only prices: base + profit, no ticket)
```

## Pricing (Type 4 Tariff)
**Formula:** `final_price = base_jod + ticket_jod + profit_jod`

**Source:** `destination_configs` table in Supabase (set via `admin.html` → Pricing section → ticket/profit inputs).

**Init flow:**
1. `initFEConfig()` fetches `destination_configs` from Supabase for all 7 countries
2. Falls back to hardcoded defaults (FE_TICKET, FE_PROFIT) if fetch fails
3. Mutates package arrays in-place: `p.double += ticket + profit`

### packages.html vs hotels-transport.html
| Page | Formula | Purpose |
|------|---------|---------|
| `packages.html` | `base + ticket + profit` | Full package price including flights |
| `hotels-transport.html` | `base + profit` (no ticket) | Hotel & transport only |

**Config variables:**
```javascript
// packages.html
const FE_TICKET = {vietnam:349, srilanka:349, maldives:399, thailand:299, singapore:299, malaysia:299, bali:349};
const FE_PROFIT = {vietnam:30, srilanka:30, maldives:30, thailand:30, singapore:30, malaysia:30, bali:30};

// hotels-transport.html
const HT_FE_TICKET = {vietnam:349, ...};
const HT_FE_PROFIT = {vietnam:30, ...};
```

## Package Data Structure
```javascript
{
  id: 1,                          // Package number
  title: "Hotel A + Hotel B...",  // English title
  arabic: "...",                  // Arabic title
  subtitle: "City1 (2) → City2 (3)",  // City breakdown
  route: "Amman ↔ Hanoi",         // Flight route
  stars: 5,                       // Star rating
  meal: "BB",                     // Meal plan
  single: 443,                    // Base single price (DMC)
  double: 443,                    // Base double price (DMC)
  room: "Deluxe / Suite",         // Room types
  location: "City1 - City2",      // Cities
  nights: 8,                      // Number of nights
  pdf: "itineraries/vn/vn_pkg5.pdf"  // PDF path
}
```

## renderDest Override Pattern
```javascript
const _origRenderDest = renderDest;  // Save original
renderDest = function(dest) {
  if (dest === 'georgia') { /* georgia rich view */; return; }
  if (dest === 'azerbaijan') { /* azerbaijan rich view */; return; }
  if (dest === 'vietnam') { /* vietnam rich view */; return; }
  // ... more far east countries ...
  _origRenderDest(dest);  // Fallback for non-rich-view countries
};
```

## Per-Country Functions
Each country defines:
```
{prefix}_PACKAGES          // Data array
{prefix}_ACTIVE_ID        // Currently selected package ID
{prefix}_ACTIVE_TAB       // Active tab ('pricing'|'itinerary'|'info')
{prefix}ShowDetail(id)    // Click handler
{prefix}SwitchTab(t)      // Tab switcher
{prefix}CloseDetail()     // Close detail panel
{prefix}ShowAllTabs()     // Show all tabs (for print)
{prefix}RestoreTabs()     // Restore single-tab view
{prefix}PrintPkg(id,title)  // Print
{prefix}PdfPkg(id,title)    // Download PDF
{prefix}RenderDetail()      // Render detail panel HTML
```

For `hotels-transport.html` the prefix is `ht{Country}` (e.g., `htVn`, `htSl`).

## Print/PDF Implementation

### How It Works
1. User clicks Print or PDF button on a package detail
2. `_fePrintAction()` (or `_htFePrintAction()`) is called
3. It shows all 3 tabs (pricing, itinerary, info)
4. Replaces the itinerary `<iframe>` with pdf.js rendered pages:
   - Fetches the PDF using `pdfjsLib.getDocument()`
   - Renders each page as a `<canvas>`
5. Converts canvases to `<img>` tags with `canvas.toDataURL('image/png')` — this embeds pixel data inline
6. Calls `PJ.printElement()` or `PJ.downloadPDF()` to capture the DOM (pricing + all PDF pages + info)
7. Restores the original iframe and tab visibility

### Key Functions
```javascript
// Renders all PDF pages as canvases
feRenderPDF(pdfUrl, container)

// Converts canvases to <img> with inline dataURLs
canvasesToImages(container)

// Orchestrates the full print/PDF flow
_fePrintAction(id, title, prefix, pkgs, isPdf)
```

### Why Canvases → Images?
DOM cloning (`cloneNode()`) loses canvas pixel data — cloned canvases are blank. Converting to `<img>` with `dataURL` preserves the rendered content for print/PDF capture.

### Dependencies
```html
<!-- pdf.js for rendering PDF pages -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>pdfjsLib.GlobalWorkerOptions.workerSrc='.../pdf.worker.min.js';</script>

<!-- html2pdf.js (already loaded) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

<!-- Print/PDF utility -->
<script src="print-pdf.js"></script>
```

## Adding a New Far East Country

1. **Create PDFs:** Place in `itineraries/{code}/{code}_pkg{N}.pdf`
2. **Add config:** Update `FE_TICKET` and `FE_PROFIT` objects
3. **Create data array:** Copy pattern from existing country
4. **Add functions:** Copy all per-country functions (`{code}ShowDetail`, etc.)
5. **Add renderDest case:** Insert before `_origRenderDest(dest)` fallback
6. **Add to initFEConfig:** Add forEach mutation line
7. **Repeat in hotels-transport.html** with `HT_` prefix and `ht{Code}` prefix

## Admin Dashboard Connection
- **Used:** `admin.html` (not `admin2.html`)
- **Table:** `destination_configs` in Supabase
- **Fields:** `ticket_jod`, `profit_jod`
- **Setting values:** Admin → "حاسبة الأسعار" → select country → set ticket/profit → حفظ الإعدادات
- **Auto-fetch:** `initFEConfig()` loads from Supabase on page load

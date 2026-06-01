# Print/PDF Combined Document — Technique

## Problem
You have a detail panel with multiple tabs (e.g., Pricing, Itinerary PDF, Info). When the user clicks Print or Download PDF, you need to output **all tabs together in one document** — including **all pages of an embedded PDF itinerary**.

The naive approach (showing all tabs + DOM clone) fails because:
- `<iframe>` PDF embeds only capture the first page when printing
- `<canvas>` elements lose pixel data when cloned (`cloneNode()` produces blank canvases)

## Complete Solution

### 1. Dependencies
```html
<!-- html2pdf.js for generating PDFs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

<!-- pdf.js for rendering PDF pages programmatically -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>

<!-- Print utility (opens new window + calls window.print()) -->
<script src="print-pdf.js"></script>
```

### 2. Print/PDF Utility (`print-pdf.js`)
The utility provides `PJ.printElement(el, title)` and `PJ.downloadPDF(el, filename)`:
- Clones the DOM element (`el.cloneNode(true)`)
- Opens a new window with the cloned HTML
- Calls `window.print()` (user selects printer or "Save as PDF")

### 3. Per-Country Functions Pattern
Each country/entity needs these functions:

```javascript
var ACTIVE_TAB = 'pricing';

function showAllTabs() {
  ['tab-pricing', 'tab-itinerary', 'tab-info'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.style.display = 'block';
  });
}

function restoreTabs() {
  var t = ACTIVE_TAB;
  ['tab-pricing', 'tab-itinerary', 'tab-info'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.style.display = (id === 'tab-pricing' ? t === 'pricing' : id === 'tab-itinerary' ? t === 'itinerary' : t === 'info') ? 'block' : 'none';
  });
}
```

### 4. PDF Rendering — The Core Technique

**Step 1: Render PDF pages as canvases using pdf.js**
```javascript
async function renderPDF(pdfUrl, container) {
  var pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  container.innerHTML = '';
  for (var i = 1; i <= pdf.numPages; i++) {
    var page = await pdf.getPage(i);
    var vp = page.getViewport({scale: 1.5});       // 1.5x for good print quality
    var canvas = document.createElement('canvas');
    canvas.width = vp.width;
    canvas.height = vp.height;
    canvas.style.cssText = 'width:100%;max-width:800px;height:auto;margin:0 auto 10px;display:block;border:1px solid #ddd;border-radius:6px';
    await page.render({canvasContext: canvas.getContext('2d'), viewport: vp}).promise;
    container.appendChild(canvas);
  }
}
```

**Step 2: Convert canvases to `<img>` tags before DOM clone**
```javascript
function canvasesToImages(container) {
  var canvases = container.querySelectorAll('canvas');
  canvases.forEach(function(c){
    var img = document.createElement('img');
    img.src = c.toDataURL('image/png');   // ⭐ Embed pixel data as dataURL
    img.style.cssText = c.style.cssText;
    c.parentNode.replaceChild(img, c);
  });
}
```

**Why this is necessary:** When you call `el.cloneNode(true)`, the cloned `<canvas>` elements are **blank** — canvas pixel data is stored in the GPU/bitmap, not in the DOM. Converting to `<img>` with `data:image/png` URL embeds the pixel data directly in the HTML, so `cloneNode` preserves it.

### 5. Orchestrator Function
```javascript
async function printAction(id, title, prefix, packages, isPdf) {
  var itinTab = document.getElementById(prefix + '-tab-itinerary');
  var origHTML = itinTab ? itinTab.innerHTML : '';
  var pkg = packages.find(function(p){ return p.id === id; });
  var showFn = window[prefix + 'ShowAllTabs'];
  var restoreFn = window[prefix + 'RestoreTabs'];

  // Show all tabs
  if (showFn) showFn();

  // Replace iframe with rendered PDF pages
  if (itinTab && pkg && pkg.pdf) {
    itinTab.innerHTML = '<div style="text-align:center;padding:20px;color:var(--muted)">⏳ Loading itinerary pages...</div>';
    await renderPDF(pkg.pdf, itinTab);       // Step 1: render PDF → canvases
    canvasesToImages(itinTab);               // Step 2: canvases → <img> dataURLs
  }

  // Capture and print/PDF
  setTimeout(function(){
    if (isPdf) PJ.downloadPDF(document.getElementById(prefix + '-print-area-' + id), title);
    else PJ.printElement(document.getElementById(prefix + '-print-area-' + id), title);
    // Restore original state after capture
    setTimeout(function(){
      if (itinTab) itinTab.innerHTML = origHTML;
      if (restoreFn) restoreFn();
    }, 500);
  }, 200);
}
```

### 6. The Print/PDF Buttons
In the detail panel HTML, add inline onclick handlers:
```html
<button onclick="printPkg(1, 'Package Title')">🖨️ Print</button>
<button onclick="pdfPkg(1, 'Package Title')">📄 PDF</button>
```

Each calls the orchestrator with the appropriate flag:
```javascript
function printPkg(id, title) { printAction(id, title, 'prefix', PACKAGES, false); }
function pdfPkg(id, title)   { printAction(id, title, 'prefix', PACKAGES, true); }
```

### 7. Normal View vs Print View
| State | Itinerary Tab Content |
|-------|----------------------|
| Normal browsing | `<iframe src="itinerary.pdf">` — clean, scrollable |
| During print/PDF | `<img>` tags from pdf.js — all pages inline |
| After print/PDF | Restored to original `<iframe>` |

### 8. Complete Call Flow
```
User clicks Print button
  → printPkg(1, "Title")
    → showAllTabs()                     // reveal pricing + itinerary + info
    → renderPDF(pdfUrl, itinTab)        // fetch PDF → render each page as canvas
    → canvasesToImages(itinTab)         // canvas → <img dataURL>
    → setTimeout(200ms)
      → PJ.printElement(printArea)      // clone DOM + open print window
        → cloneNode(true) captures <img> dataURLs (not blank canvases!)
        → new window with clone
        → window.print()
      → setTimeout(500ms)
        → itinTab.innerHTML = origHTML  // restore iframe
        → restoreTabs()                 // restore single-tab view
```

### 9. Multiple Entities Pattern
For multiple countries/packages with the same structure, create a shared orchestrator and one-liner functions per entity:

```javascript
// Shared orchestrator
async function _printAction(id, title, prefix, pkgs, isPdf) { /* ... */ }

// Per-entity one-liners
function vnPrintPkg(id, t) { _printAction(id, t, 'vn', VIETNAM_PACKAGES, false); }
function vnPdfPkg(id, t)   { _printAction(id, t, 'vn', VIETNAM_PACKAGES, true); }
function thPrintPkg(id, t) { _printAction(id, t, 'th', THAILAND_PACKAGES, false); }
function thPdfPkg(id, t)   { _printAction(id, t, 'th', THAILAND_PACKAGES, true); }
// ... etc
```

### 10. Key Lessons
1. **Canvases lose content on clone** — always convert to `<img dataURL>` before DOM clone
2. **Increase pdf.js scale for print quality** — `{scale: 1.5}` minimum, `2.0` for hi-res
3. **Async flow matters** — `await renderPDF()`, then `canvasesToImages()`, then `setTimeout(PJ.call)`
4. **Save and restore** — save original iframe HTML, restore it after print/PDF completes
5. **Loading indicator** — show "⏳ Loading..." while pdf.js processes (may take 1-5 seconds for multi-page PDFs)
6. **Fallback** — if pdf.js fails, show a direct link: `<a href="pdfUrl">Open PDF directly</a>`

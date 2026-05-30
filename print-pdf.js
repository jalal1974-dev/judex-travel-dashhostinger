// Print & PDF utility for Al Jude Travel website
// Uses browser native print for reliability

var PJ = window.PJ || {
  COMPANY: 'AL JUDE Travel & Tourism',
  PHONE: '077-706-6800',
  WA: '962777066005',
  URL: 'judextravel.com',
  LOGO: 'J',

  brandHTML() {
    return '<div class="pj-brand" style="text-align:center;padding:10px 0;border-bottom:2px solid #C9A84C;margin-bottom:12px;font-family:Cairo,sans-serif">' +
      '<div style="font-size:22px;font-weight:900;color:#C9A84C">' + this.LOGO + '</div>' +
      '<div style="font-size:16px;font-weight:800;color:#0a1628">' + this.COMPANY + '</div>' +
      '<div style="font-size:11px;color:#666">Phone: ' + this.PHONE + ' | WA: ' + this.WA + ' | ' + this.URL + '</div>' +
    '</div>';
  },

  brandPrintCSS() {
    return [
    '.pj-brand{text-align:center;padding:10px 0;border-bottom:2px solid #C9A84C;margin-bottom:12px}',
    '.price-main{gap:6px!important}',
    '.price-cur{margin-inline-start:2px}',
    '.price-num,.price-cur{white-space:nowrap}',
    '.card-expanded{display:none!important}',
    '.selected .card-expanded{display:block!important;break-inside:avoid}',
    '@media print {',
    '  @page{margin:10mm 8mm}',
    '  body{background:#fff!important;color:#000!important;font-size:12pt;line-height:1.5}',
    '  .nav,.nav-overlay,.hamburger,.nav-wa,.wa-btn,.wa-btn-sm,.filter-btn,.search-wrap,.filters-row,.sort-wrap,',
    '  .currency-bar,.dest-tabs-wrap,.btn-print,.btn-pdf,.btn-print-pdf,.spinner,.loading-state,.floating-wa,',
    '  .hamburger,.nav-overlay,[class*=wa-btn],.pj-no-print,footer.footer,footer:not(.pj-force){display:none!important}',
    '  .main{max-width:100%!important;padding:0!important;margin:0!important}',
    '  .dest-section{display:block!important}',
    '  .dest-section:not(.active){display:none!important}',
    '  .hotel-card,.offer-card,.umrah-card,.airline-section{break-inside:avoid;page-break-inside:avoid;border:1px solid #ddd!important;margin-bottom:8px!important;border-radius:6px!important}',
    '  .hotel-card{background:#fff!important;box-shadow:none!important}',
    '  .card-top,.card-price,.card-body{background:#fff!important}',
    '  .card-name{color:#000!important}',
    '  .price-num{color:#C9A84C!important;font-size:20pt!important}',
    '  .price-cur{color:#C9A84C!important}',
    '  .star,.star.e{color:#C9A84C!important;font-size:10pt}',
    '  .tag{background:#f5f5f5!important;color:#333!important}',
    '  .nights-hero{background:#fafafa!important;border:1px solid #ddd!important}',
    '  .night-btn{border:1px solid #ddd!important;background:#fff!important;box-shadow:none!important;min-width:70px;padding:8px 14px}',
    '  .night-btn .nb-num{color:#000!important;font-size:18pt!important}',
    '  .night-btn .nb-lbl,.night-btn .nb-price{color:#666!important}',
    '  .night-btn.active{background:#f5f0e0!important;border-color:#C9A84C!important}',
    '  .hero{padding:12px 0!important;background:none!important}',
    '  .hero h1{font-size:20pt!important;color:#000!important}',
    '  .hero h1 .hl{color:#C9A84C!important}',
    '  .hero p,.hero-badge,.hero-note{color:#333!important}',
    '  .hero-badge{border-color:#C9A84C!important}',
    '  .results-count{color:#333!important}',
    '  .price-main{gap:4px}',
    '  .pkg-table{font-size:10pt!important}',
    '  .pkg-table th{color:#333!important;background:#f5f5f5!important}',
    '  .pkg-table td{color:#333!important}',
    '  .pkg-price{color:#C9A84C!important}',
    '  .flights-box{border:1px solid #ddd!important}',
    '  .flight-route,.flight-time,.flight-days,.flight-luggage{color:#333!important}',
    '  .umrah-card .card-header{background:#fafafa!important}',
    '  .umrah-card .card-title{color:#000!important}',
    '  .hotel-row .hotel-name{color:#000!important}',
    '  .inc-tag{background:#f5f5f5!important;color:#333!important}',
    '  .price-includes{color:#333!important}',
    '  .price-label{color:#666!important}',
    '  .no-ticket{color:#666!important;border-color:#ddd!important}',
    '  .pj-brand{display:block!important}',
    '  .pj-footer{display:block!important;text-align:center;padding:8px 0;border-top:2px solid #C9A84C;margin-top:16px;font-size:10px;color:#666}',
    '  .offer-card .card-image{height:80px!important;padding:10px!important}',
    '  .offer-price-row{background:#fafafa!important}',
    '  .note-banner{background:#fafafa!important;color:#333!important}',
    '  .hotels-grid{grid-template-columns:1fr 1fr!important;gap:10px!important}',
    '  .umrah-grid{grid-template-columns:1fr 1fr!important;gap:10px!important}',
    '  .offers-grid{grid-template-columns:1fr 1fr 1fr!important;gap:10px!important}',
    '  .pj-no-print,.pj-no-print *{display:none!important}',
    '}',
    '@media print and (max-width:600px){',
    '  .hotels-grid,.umrah-grid,.offers-grid{grid-template-columns:1fr!important}',
    '}'
    ].join('\n');
  },

  injectPrintCSS() {
    var id = 'pj-print-css';
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.textContent = this.brandPrintCSS();
    document.head.appendChild(style);
  },

  makeBtn(text, icon, cls, fn) {
    var b = document.createElement('button');
    b.className = 'btn-print-pdf ' + (cls || '');
    b.innerHTML = icon + ' ' + text;
    b.onclick = fn;
    var sty = b.style;
    sty.display = 'inline-flex';
    sty.alignItems = 'center';
    sty.gap = '4px';
    sty.padding = '5px 11px';
    sty.border = '1px solid var(--border)';
    sty.borderRadius = '7px';
    sty.background = 'var(--card)';
    sty.color = 'var(--muted)';
    sty.fontFamily = 'Cairo,sans-serif';
    sty.fontSize = '11px';
    sty.fontWeight = '600';
    sty.cursor = 'pointer';
    sty.transition = 'all .2s';
    sty.whiteSpace = 'nowrap';
    b.onmouseover = function(){ b.style.borderColor = '#C9A84C'; b.style.color = 'var(--text)'; };
    b.onmouseout = function(){ b.style.borderColor = 'var(--border)'; b.style.color = 'var(--muted)'; };
    return b;
  },

  printElement(el, title) {
    if (!el) return;
    var clone = el.cloneNode(true);
    var wrapper = document.createElement('div');
    wrapper.innerHTML = this.brandHTML();
    wrapper.appendChild(clone);
    wrapper.innerHTML += '<div class="pj-footer">Document issued by ' + this.COMPANY + ' — ' + new Date().toLocaleDateString('en-US') + '</div>';

    var win = window.open('', '_blank', 'width=800,height=600');
    win.document.write('<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>' + title + '</title>');
    win.document.write('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet">');
    win.document.write('<style>body{font-family:Cairo,sans-serif;padding:20px;color:#000;background:#fff}');
    win.document.write(this.brandPrintCSS());
    win.document.write('</style></head><body>');
    win.document.write(wrapper.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    setTimeout(function(){ win.print(); }, 500);
  },

  downloadPDF(el, filename) {
    if (!el) return;
    // Uses same approach as printElement - opens new window then triggers print
    // User selects "Save as PDF" from the print dialog
    var clone = el.cloneNode(true);
    var bodyHtml = '<div style="text-align:center;padding:8px 0;border-bottom:2px solid #C9A84C;margin-bottom:12px"><div style="font-size:22px;font-weight:900;color:#C9A84C">' + this.LOGO + '</div><div style="font-size:16px;font-weight:800;color:#0a1628">' + this.COMPANY + '</div><div style="font-size:11px;color:#666">Phone: ' + this.PHONE + ' | WA: ' + this.WA + ' | ' + this.URL + '</div></div>';
    bodyHtml += clone.outerHTML;
    bodyHtml += '<div style="text-align:center;padding:8px 0;border-top:2px solid #C9A84C;margin-top:16px;font-size:10px;color:#666">Document issued by ' + this.COMPANY + ' — ' + new Date().toLocaleDateString('en-US') + '</div>';

    var win = window.open('', '_blank', 'width=800,height=600');
    win.document.write('<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8">');
    win.document.write('<title>' + filename + '</title>');
    win.document.write('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet">');
    win.document.write('<style>');
    win.document.write('@page{size:A4;margin:8mm}');
    win.document.write('body{font-family:Cairo,sans-serif;padding:0;background:#fff;color:#000;font-size:12px;line-height:1.6;margin:0}');
    win.document.write('*{box-sizing:border-box}');
    win.document.write('.hotel-card,.pkg-card,.offer-card,.umrah-card{background:#fff;border:1px solid #ddd;border-radius:8px;margin-bottom:8px;padding:10px;page-break-inside:avoid;break-inside:avoid}');
    win.document.write('.card-name,.pkg-name,.offer-title{font-size:14px;font-weight:700;color:#000;margin-bottom:4px}');
    win.document.write('.card-stars,.pkg-stars{color:#C9A84C;font-size:11px;margin-bottom:3px}');
    win.document.write('.card-price,.pkg-price,.offer-price{font-size:15px;font-weight:800;color:#C9A84C;margin-top:4px}');
    win.document.write('.price-num{font-size:18px;font-weight:900;color:#C9A84C}');
    win.document.write('.price-cur{color:#C9A84C;font-size:13px}');
    win.document.write('.tag,.pkg-tag{display:inline-block;background:#f5f5f5;border-radius:4px;padding:2px 7px;font-size:10px;color:#333;margin:1px}');
    win.document.write('.card-top,.pkg-top{padding-bottom:6px;border-bottom:1px solid #eee;margin-bottom:6px}');
    win.document.write('.hotel-card:hover,.pkg-card:hover{border-color:#C9A84C}');
    win.document.write('.dest-title{font-size:18px;font-weight:800;color:#C9A84C;margin:12px 0 8px}');
    win.document.write('.airline-section{margin-bottom:12px}');
    win.document.write('.airline-name{font-size:15px;font-weight:700;color:#C9A84C;margin-bottom:4px}');
    win.document.write('.flight-row{padding:5px 0;border-bottom:1px solid #eee;font-size:11px}');
    win.document.write('.btn-print-pdf,.pj-no-print,.floating-wa,.wa-btn,[class*=btn]{display:none!important}');
    win.document.write('img{max-width:100%}table{width:100%;border-collapse:collapse}td,th{padding:4px 6px;border:1px solid #ddd;font-size:11px}');
    win.document.write('.nights-hero{background:#fafafa;border:1px solid #ddd;border-radius:6px;padding:10px;margin:6px 0}');
    win.document.write('.night-btn{border:1px solid #ddd;border-radius:4px;padding:4px 8px;font-size:11px;background:#fff}');
    win.document.write('.selected .night-btn{background:#C9A84C;color:#fff;border-color:#C9A84C}');
    win.document.write('.card-expanded{border-top:1px solid #eee;margin-top:6px;padding-top:6px}');
    win.document.write('.currency-bar,.dest-tabs-wrap,.filters-row,.sort-wrap,.search-wrap,.spinner,.loading-state{display:none!important}');
    win.document.write('footer{display:none!important}');
    win.document.write('</style></head><body>');
    win.document.write(bodyHtml);
    win.document.write('</body></html>');
    win.document.close();

    setTimeout(function(){
      try{ win.focus(); }catch(e){}
      win.print();
    }, 800);
  },

  addDestPrintBtn(container, destName, destEl) {
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap';
    bar.appendChild(this.makeBtn('Print ' + destName, '', 'pj-no-print', function(){ PJ.printElement(destEl, destName); }));
    bar.appendChild(this.makeBtn('PDF ' + destName, '', 'pj-no-print', function(){ PJ.downloadPDF(destEl, destName); }));
    container.insertBefore(bar, container.firstChild);
  },

  addHotelCardBtns(card, hotelName) {
    var btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:6px;margin-top:6px';
    btns.className = 'pj-no-print';
    btns.appendChild(this.makeBtn('Print', '', '', function(e){
      e.stopPropagation();
      PJ.printElement(card, hotelName);
    }));
    btns.appendChild(this.makeBtn('PDF', '', '', function(e){
      e.stopPropagation();
      PJ.downloadPDF(card, hotelName);
    }));
    var priceSection = card.querySelector('.card-price, .card-body, .price-section');
    if (priceSection) {
      priceSection.appendChild(btns);
    } else {
      card.appendChild(btns);
    }
  }
};

// Delegated click handler for data-pj-action buttons
// Use: <button data-pj-action="print|pdf" data-pj-target="#selector" data-pj-title="Title">
document.addEventListener('click', function(e){
  var btn = e.target.closest('[data-pj-action]');
  if (!btn) return;
  var action = btn.getAttribute('data-pj-action');
  var targetSel = btn.getAttribute('data-pj-target');
  var title = btn.getAttribute('data-pj-title') || 'Document';
  if (!targetSel) return;
  var el = document.querySelector(targetSel);
  if (!el) return;
  e.stopPropagation();
  if (action === 'print') {
    PJ.printElement(el, title);
  } else if (action === 'pdf') {
    PJ.downloadPDF(el, title);
  }
});

// Delegated click handler for hotel/umrah card buttons
// Use: <button data-pj-card="print|pdf">
// Name derived from .card-name or .card-title inside the card element.
// No inline onclick needed, avoiding quoting issues with Arabic/hotel names.
document.addEventListener('click', function(e){
  var btn = e.target.closest('[data-pj-card]');
  if (!btn) return;
  var action = btn.getAttribute('data-pj-card');
  var card = btn.closest('.hotel-card, .umrah-card');
  if (!card) return;
  var nameEl = card.querySelector('.card-name, .card-title');
  var title = nameEl ? nameEl.textContent : 'Hotel';
  e.stopPropagation();
  if (action === 'print') {
    PJ.printElement(card, title);
  } else if (action === 'pdf') {
    PJ.downloadPDF(card, title);
  }
});

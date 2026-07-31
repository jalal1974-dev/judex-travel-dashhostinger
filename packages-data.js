
const SB_URL='https://rmpuvrmxakukgvtxethj.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcHV2cm14YWt1a2d2dHhldGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODAyMjcsImV4cCI6MjA5Mzg1NjIyN30.lO8rNtwfLXYFnyGk5dOthPEUj3XIWkfFvSOziTeDFeE';
function toggleNav(){const h=document.getElementById('hamburger'),o=document.getElementById('navOverlay');if(!h||!o)return;h.classList.toggle('open');o.classList.toggle('open');}
function __t(s){return typeof LC!=='undefined'&&LC.t?LC.t(s):s;}

let ALL_PACKAGES = [];
let CURRENT_DEST = '';
let CURRENT_NIGHTS = 0;
let FILTERS = { stars: 'all', area: 'all', search: '' };
let SORT = 'price_asc';

const WA_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const DEST_NAMES = {
  istanbul:'إسطنبول', trabzon:'طرابزون', 'trabzon-bungalow':'طرابزون والأكواخ', 'batumi-trabzon':'باتومي وطرابزون', antalya:'أنطاليا',
  sharm:'شرم الشيخ', hurghada:'الغردقة', aqaba:'العقبة',
  georgia:'جورجيا',    azerbaijan:'أذربيجان', kosovo:'كوسوفو', malaysia:'ماليزيا', bali:'بالي',
  singapore:'سنغافورة', vietnam:'فيتنام',
  thailand:'تايلاند', maldives:'المالديف', srilanka:'سريلانكا',
  cairo:'القاهرة', alexandria:'الإسكندرية',
  'cairo-north-coast':'القاهرة والساحل الشمالي',
  'cairo-alexandria':'القاهرة و الإسكندرية',
  'cairo-alex-northcoast':'القاهرة والإسكندرية والساحل الشمالي',
  'alexandria-northcoast':'الإسكندرية والساحل الشمالي',
  'cairo-ain-sokhna':'القاهرة والعين السخنة',
  'cairo-aswan-luxor-cruise':'القاهرة وأسوان والأقصر كروز'
};
const DEST_FLAGS = {
  istanbul:'🇹🇷', trabzon:'🇹🇷', 'trabzon-bungalow':'🏞️', 'batumi-trabzon':'🇬🇪', antalya:'🇹🇷',
  sharm:'🇪🇬', hurghada:'🇪🇬', aqaba:'🇯🇴',
  georgia:'🇬🇪',    azerbaijan:'🇦🇿', kosovo:'🇽🇰', malaysia:'🇲🇾', bali:'🇮🇩',
  singapore:'🇸🇬', vietnam:'🇻🇳',
  thailand:'🇹🇭', maldives:'🇲🇻', srilanka:'🇱🇰',
  cairo:'🇪🇬', alexandria:'🇪🇬',
  'cairo-north-coast':'🇪🇬',
  'cairo-alexandria':'🇪🇬',
  'cairo-alex-northcoast':'🇪🇬',
  'alexandria-northcoast':'🇪🇬',
  'cairo-ain-sokhna':'🇪🇬',
  'cairo-aswan-luxor-cruise':'🇪🇬'
};

function starsHtml(n){
  let h='';
  for(let i=0;i<5;i++) h+=`<span class="star${i<n?'':' e'}">★</span>`;
  return h;
}
function fmt(n){ return Math.round(n).toLocaleString('ar-JO'); }
function safePrice(jod){ return (typeof lcPrice==='function') ? lcPrice(jod) : fmt(jod); }
function safeSym(){ return (typeof LC!=='undefined') ? (LC.symbols[LC.curr]||'د.أ') : 'د.أ'; }

async function sbGet(path){
  const r = await fetch(SB_URL+'/rest/v1/'+path, {
    headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY}
  });
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

async function loadPackages(){
  try{
    let allData = [];
    const knownDests=Object.keys(DEST_NAMES);
    const COLS='destination,hotel_name,nights,base_price_jod,ticket_jod,profit_jod,visa_jod,final_price_jod,stars,location,meal_plan,period_label,room_type,includes,tariff_type';
    // Fast path: paged bulk requests (Supabase caps each response at 1000 rows;
    // was 26 sequential per-destination round trips)
    try {
      const PAGE=1000;
      for(let off=0; off<20000; off+=PAGE){
        const r = await fetch(SB_URL+'/rest/v1/packages?destination=in.('+knownDests.join(',')+')&is_active=eq.true&select='+COLS+'&order=destination,hotel_name,nights',
          {headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Range':off+'-'+(off+PAGE-1)}});
        if(!r.ok && r.status!==416) throw new Error('bulk fetch HTTP '+r.status);
        const batch = r.status===416 ? [] : await r.json();
        allData.push(...batch);
        if(batch.length<PAGE) break;
      }
    } catch(bulkErr) {
      console.warn('loadPackages: bulk fetch failed, falling back to per-destination', bulkErr.message);
      for(const d of knownDests){
        try {
          const batch=await sbGet('packages?destination=eq.'+d+'&is_active=eq.true&select='+COLS+'&order=hotel_name,nights&limit=100000');
          allData.push(...batch);
        } catch(e) {
          console.warn('loadPackages: skipped '+d, e.message);
        }
      }
    }
    ALL_PACKAGES = allData.map(p => {
      if ((p.destination === 'georgia' || p.destination === 'azerbaijan' || p.destination === 'kosovo') && p.nights !== 7) {
        p.nights = 7;
      }
      return p;
    });

    await applyDbPrices();

    const supabaseDests = new Set(ALL_PACKAGES.map(p=>p.destination));
    const dests = Object.keys(DEST_NAMES).filter(d => supabaseDests.has(d) || d.startsWith('cairo') || d.startsWith('alexandria'));

    const tabsEl = document.getElementById('dest-tabs');
    if(!dests.length){
      tabsEl.innerHTML = '<div style="color:var(--muted);padding:12px">لا توجد وجهات منشورة بعد</div>';
      document.getElementById('main-content').innerHTML = `
        <div style="text-align:center;padding:80px 24px">
          <div style="font-size:48px;margin-bottom:16px">🏗️</div>
          <h3 style="font-size:20px;margin-bottom:10px">قريباً — جاري إعداد الباقات</h3>
          <p style="color:var(--muted)">يرجى التواصل معنا مباشرة عبر واتساب للاستفسار عن الأسعار</p>
          <a href="https://wa.me/962777066005" style="display:inline-flex;align-items:center;gap:8px;margin-top:20px;padding:12px 28px;background:var(--green);color:#fff;border-radius:10px;text-decoration:none;font-weight:700">${WA_SVG} تواصل معنا</a>
        </div>`;
      return;
    }

    // Read ?dest= from URL to auto-select destination
    const urlDest = new URLSearchParams(window.location.search).get('dest');
    const initIdx = (urlDest && dests.includes(urlDest)) ? dests.indexOf(urlDest) : 0;

    tabsEl.innerHTML = dests.map((d,i) => {
      const count = ALL_PACKAGES.filter(p=>p.destination===d).length;
      return `<div class="dest-tab${i===initIdx?' active':''}" onclick="switchDest('${d}',this)" id="tab-${d}">
        <span class="flag">${DEST_FLAGS[d]||'🌍'}</span>
        ${DEST_NAMES[d]||d}
      </div>`;
    }).join('');

    const mainEl = document.getElementById('main-content');
    mainEl.innerHTML = dests.map((d,i) =>
      `<div class="dest-section${i===initIdx?' active':''}" id="sec-${d}"></div>`
    ).join('');

    if(dests.length>0){
      CURRENT_DEST = dests[initIdx];
      renderDest(dests[initIdx]);
    }

  }catch(e){
    document.getElementById('main-content').innerHTML = `
      <div style="text-align:center;padding:60px;color:var(--muted)">
        <div style="font-size:40px;margin-bottom:16px">⚠️</div>
        <h3 style="color:var(--text);margin-bottom:8px">خطأ في تحميل البيانات</h3>
        <p>${e.message}</p>
      </div>`;
    document.getElementById('dest-tabs').innerHTML='';
  }
}

function switchDest(dest, el){
  document.querySelectorAll('.dest-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.dest-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('sec-'+dest).classList.add('active');
  el.classList.add('active');
  CURRENT_DEST = dest;
  FILTERS = {stars:'all',area:'all',search:''};
  CURRENT_NIGHTS = 0;
  renderDest(dest);
}

function renderDest(dest){
  const sec = document.getElementById('sec-'+dest);
  const destPkgs = ALL_PACKAGES.filter(p=>p.destination===dest);

  if(!destPkgs.length){
    sec.innerHTML = `<div class="empty-state"><div class="emoji">🏗️</div><h3>قريباً</h3><p>جاري إضافة باقات ${DEST_NAMES[dest]||dest}</p></div>`;
    return;
  }

  // Unique nights for this destination
  const nightOptions = [...new Set(destPkgs.map(p=>p.nights))].sort((a,b)=>a-b);

  // Default to first available nights
  if(!CURRENT_NIGHTS || !nightOptions.includes(CURRENT_NIGHTS)){
    CURRENT_NIGHTS = nightOptions[0];
  }

  // For each nights option, find the lowest price (for showing in button)
  const nightMinPrices = {};
  nightOptions.forEach(n=>{
    const pkgs = destPkgs.filter(p=>p.nights===n && p.final_price_jod>0);
    if(pkgs.length) nightMinPrices[n] = Math.min(...pkgs.map(p=>p.final_price_jod));
  });

  // Unique locations
  const locations = [...new Set(destPkgs.filter(p=>p.nights===CURRENT_NIGHTS).map(p=>p.location).filter(Boolean))];

  // Filter
  let filtered = destPkgs.filter(p=>{
    if(p.nights !== CURRENT_NIGHTS) return false;
    if(FILTERS.stars !== 'all' && p.stars !== FILTERS.stars) return false;
    if(FILTERS.area !== 'all' && p.location !== FILTERS.area) return false;
    if(FILTERS.search && !p.hotel_name.toLowerCase().includes(FILTERS.search.toLowerCase())) return false;
    return true;
  });

  // Sort
  if(SORT==='price_asc') filtered.sort((a,b)=>a.final_price_jod-b.final_price_jod);
  if(SORT==='price_desc') filtered.sort((a,b)=>b.final_price_jod-a.final_price_jod);
  if(SORT==='stars_desc') filtered.sort((a,b)=>b.stars-a.stars);
  if(SORT==='name') filtered.sort((a,b)=>a.hotel_name.localeCompare(b.hotel_name,'ar'));

  // Build location filters
  const locFilters = locations.length>1 ? `
    <span class="sep"></span>
    <span class="filter-label">المنطقة:</span>
    <button class="filter-btn${FILTERS.area==='all'?' active':''}" onclick="setFilter('area','all',this)">الكل</button>
    ${locations.map(l=>`<button class="filter-btn${FILTERS.area===l?' active':''}" onclick="setFilter('area','${l}',this)">${l}</button>`).join('')}` : '';

  sec.innerHTML = `
    <!-- ══ NIGHTS SELECTOR ══ -->
    <div class="nights-hero">
      <div class="nights-hero-label">
        ${nightOptions.length > 1 ? 'اختر <span>عدد الليالي</span> — السعر يتغير تلقائياً' : 'عدد <span>الليالي</span>'}
      </div>
      <div class="nights-btns" id="nights-btns-${dest}">
        ${nightOptions.map(n => {
          const minP = nightMinPrices[n];
          const priceTag = minP ? `<span class="nb-price">من ${safePrice(minP)} ${safeSym()}</span>` : '';
          return `<button class="night-btn${n===CURRENT_NIGHTS?' active':''}" onclick="setNights(${n},'${dest}',this)">
            <span class="nb-num">${n}</span>
            <span class="nb-lbl">ليالي</span>
            ${priceTag}
          </button>`;
        }).join('')}
      </div>
    </div>

    <!-- ══ FILTERS ══ -->
    <div class="filters-row">
      <span class="filter-label">النجوم:</span>
      <button class="filter-btn${FILTERS.stars==='all'?' active':''}" onclick="setFilter('stars','all',this)">الكل</button>
      <button class="filter-btn${FILTERS.stars===3?' active':''}" onclick="setFilter('stars',3,this)">★★★</button>
      <button class="filter-btn${FILTERS.stars===4?' active':''}" onclick="setFilter('stars',4,this)">★★★★</button>
      <button class="filter-btn${FILTERS.stars===5?' active':''}" onclick="setFilter('stars',5,this)">★★★★★</button>
      ${locFilters}
      <div class="search-wrap" style="margin-right:auto">
        <input type="text" placeholder="ابحث عن فندق..." value="${FILTERS.search}" oninput="setSearch(this.value,'${dest}')">
      </div>
    </div>

    <!-- ══ RESULTS BAR ══ -->
    <div class="results-meta">
      <div class="results-count">${__t('عرض')} <span>${filtered.length}</span> ${__t('باقة —')} ${CURRENT_NIGHTS} ${__t('ليالي')}</div>
      <div class="sort-wrap">
        <select onchange="SORT=this.value;renderDest('${dest}')">
          <option value="price_asc" ${SORT==='price_asc'?'selected':''}>السعر: الأقل أولاً</option>
          <option value="price_desc" ${SORT==='price_desc'?'selected':''}>السعر: الأعلى أولاً</option>
          <option value="stars_desc" ${SORT==='stars_desc'?'selected':''}>النجوم: الأعلى أولاً</option>
          <option value="name" ${SORT==='name'?'selected':''}>الاسم أبجدياً</option>
        </select>
      </div>
    </div>

    <!-- ══ CARDS ══ -->
    <div class="hotels-grid" id="grid-${dest}">
      ${filtered.length ? filtered.map(p=>buildCard(p)).join('') : `
        <div class="empty-state">
          <div class="emoji">🔍</div>
          <h3>لا توجد نتائج</h3>
          <p>حاول تغيير الفلاتر أو اختر عدد ليالٍ مختلف</p>
        </div>`}
    </div>
    <!-- ══ PRINT / PDF BUTTONS (hidden on print) ══ -->
    <div class="pj-no-print" style="display:flex;gap:8px;justify-content:center;margin-top:20px;flex-wrap:wrap">
      <button class="btn-print-pdf" data-pj-action="print" data-pj-target="#sec-${dest}" data-pj-title="${DEST_NAMES[dest]||dest}" style="display:inline-flex;align-items:center;gap:4px;padding:8px 18px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--muted);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ ${__t('طباعة ')}${DEST_NAMES[dest]||dest}</button>
      <button class="btn-print-pdf" data-pj-action="pdf" data-pj-target="#sec-${dest}" data-pj-title="${DEST_NAMES[dest]||dest}" style="display:inline-flex;align-items:center;gap:4px;padding:8px 18px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--muted);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">📄 ${__t('تحميل PDF ')}${DEST_NAMES[dest]||dest}</button>
    </div>`;
}

function buildCard(p){
  const destName = DEST_NAMES[p.destination]||p.destination;
  const includes = p.includes||'';
  const period = p.period_label||'';
  const isPackage = (p.tariff_type||0) >= 4;

  const totalPrice = p.final_price_jod || 0;

  let tags = '';
  if(p.location && p.location!==p.hotel_name) tags += '<span class="tag tag-loc">📍 '+p.location+'</span>';
  if(p.meal_plan && p.meal_plan!=='باقة كاملة') tags += '<span class="tag tag-meal">🍽️ '+p.meal_plan+'</span>';
  if((p.tariff_type||0)===5) tags += '<span class="tag tag-inc" style="background:rgba(39,174,96,.2);border-color:#27ae60">✈️ التذكرة مشمولة</span>';
  if(includes) tags += '<span class="tag tag-inc">✅ '+(includes.length>30?includes.substring(0,30)+'...':includes)+'</span>';

  const wa = {type:'package',hotel:p.hotel_name,destination:destName,
    price:fmt(totalPrice),nights:p.nights||'?',
    room:p.room_type||'مزدوجة',includes:includes};

  return `<div class="hotel-card">
    <div class="card-top">
      <div class="card-stars">${starsHtml(p.stars||3)}</div>
      <div class="card-name">${p.hotel_name}</div>
      ${tags?'<div class="card-tags">'+tags+'</div>':''}
    </div>
    <div class="card-price">
      ${period?'<div style="font-size:11px;color:rgba(201,168,76,.6);margin-bottom:4px">📅 '+period+'</div>':''}
      <div class="price-label">${CURRENT_NIGHTS} ${__t('ليالي — السعر للشخص الواحد')}</div>
      <div class="price-main">
        <span class="price-num" data-jod="${totalPrice}">${safePrice(totalPrice)}</span>
        <span class="price-cur" data-curr-sym>${safeSym()}</span>
        <span class="price-per">/ شخص</span>
      </div>
      ${includes?'<div class="price-includes">✅ '+__t('يشمل:')+' '+includes+'</div>':''}
      <button onclick='openBooking(${JSON.stringify(wa)})' class="wa-btn">
        ${WA_SVG} احجز الآن
      </button>
      <div style="display:flex;gap:5px;margin-top:8px" class="pj-no-print">
        <button data-pj-card="print" style="flex:1;padding:5px;border:1px solid var(--border);border-radius:6px;background:var(--dark3);color:var(--muted);font-family:Cairo,sans-serif;font-size:10px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>
        <button data-pj-card="pdf" style="flex:1;padding:5px;border:1px solid var(--border);border-radius:6px;background:var(--dark3);color:var(--muted);font-family:Cairo,sans-serif;font-size:10px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>
      </div>
    </div>
  </div>`;
}

function setNights(n, dest, btn){
  CURRENT_NIGHTS = n;
  FILTERS = {stars:'all', area:'all', search:''};
  renderDest(dest);
}

function setFilter(key, val, btn){
  FILTERS[key] = val;
  const parent = btn.closest('.filters-row');
  parent.querySelectorAll('.filter-btn').forEach(b=>{
    if(b.getAttribute('onclick')&&b.getAttribute('onclick').includes("'"+key+"'")) b.classList.remove('active');
  });
  btn.classList.add('active');
  renderDest(CURRENT_DEST);
}

function setSearch(val, dest){
  FILTERS.search = val;
  renderDest(dest);
}

// ════════════════════════════════════════════════════════════════
// AZERBAIJAN RICH PACKAGE DATA (dashboard-style with itinerary)
// ════════════════════════════════════════════════════════════════
const AZ_BAKU_ITIN = [
  {day:"Day 1",title:"Arrival in Baku — Evening City Tour",loc:"Baku",desc:"Reception by the company representative at Heydar Aliyev International Airport. Transfer to the hotel and check-in. Evening Baku tour with dinner (dinner at own expense), then return to the hotel and overnight."},
  {day:"Day 2",title:"Highland Park · Flame Towers · Mini Venice · Baku Boulevard",loc:"Baku",desc:"Breakfast, then a full-day tour: Dagustu (Highland) Park with Martyrs' Square and the Flame Towers — magical panoramic views over all of Baku, the Caspian Sea and the Corniche. Then the seafront, National Carpet Museum, Deniz Mall and the Baku Eye. Mini Venice boat trip through the blue waterway canals. Baku Boulevard beaches and seaside promenade. Lunch, then return to the hotel."},
  {day:"Day 3",title:"Heydar Aliyev Museum · Fire Mountain (Yanar Dag)",loc:"Absheron",desc:"Breakfast, then visit the Heydar Aliyev Museum. Drive to Absheron to see Fire Mountain (Yanar Dag) — the eternal flame burning from the rocks since ancient times that never goes out. Seafood lunch on the Caspian Sea, then return to the hotel."},
  {day:"Day 4",title:"Old City Heritage — Maiden Tower · Shirvanshah Palace · Nizami Street",loc:"Baku Old City",desc:"Breakfast, then explore the Old City: Maiden Tower with its museum telling the story of Baku's development — climb to the top for panoramic views of Baku, the Caspian and the Flame Towers. Juma Mosque (the oldest mosque in Azerbaijan) and Shirvanshah Palace (built 1411). Then Nizami Street, Baku's most famous street. Lunch, then return to the hotel."},
  {day:"Day 5",title:"Optional Gabala Day Trip — Tufandag · 7 Waterfalls · Nohur Lake",loc:"Gabala (optional)",desc:"Breakfast, then optional full-day trip to Gabala (at own expense) passing the Ismailli village. Big cable car up Tufandag Mountain — activities, mountain ATVs and stunning nature from the summit. Gabala's beautiful Seven Waterfalls, then Nohur Lake with boat rides. Lunch, then return to the hotel in Baku."},
  {day:"Day 6",title:"Free Day — Shopping & Optional Trips",loc:"Baku",desc:"Breakfast at the hotel, then a free day to explore Baku and go shopping, with many optional excursions available."},
  {day:"Day 7",title:"Optional Shahdag Adventures",loc:"Qusar / Shahdag (optional)",desc:"Breakfast, then optional full-day adventure: drive to Qusar city and Shahdag Mountain — waterfalls, cable car, mountain coaster, ATVs, horse riding and the Qusar River. Traditional lunch amid beautiful nature, then return to the hotel in Baku."},
  {day:"Day 8",title:"Departure",loc:"Baku",desc:"Breakfast at the hotel, then check-out and transfer to the airport for the return flight home."}
];
const AZ_COMBO_ITIN = [
  {day:"Day 1",title:"Arrival in Baku — Evening City Tour",loc:"Baku",desc:"Reception by the company representative at Heydar Aliyev International Airport. Transfer to the hotel and check-in. Evening Baku tour with dinner (dinner at own expense), then return to the hotel and overnight."},
  {day:"Day 2",title:"Highland Park · Flame Towers · Mini Venice · Baku Boulevard",loc:"Baku",desc:"Breakfast, then a full-day tour: Dagustu (Highland) Park with Martyrs' Square and the Flame Towers — panoramic views over Baku, the Caspian Sea and the Corniche. Seafront, National Carpet Museum, Deniz Mall and Baku Eye. Mini Venice boat trip through the canals. Baku Boulevard beaches and promenade. Lunch, then return to the hotel."},
  {day:"Day 3",title:"Heydar Aliyev Museum · Fire Mountain (Yanar Dag)",loc:"Absheron",desc:"Breakfast, then the Heydar Aliyev Museum and drive to Absheron to see Fire Mountain (Yanar Dag) — the eternal flame burning from the rocks that never goes out. Seafood lunch on the Caspian Sea, then return to the hotel."},
  {day:"Day 4",title:"Old City Heritage — Maiden Tower · Shirvanshah Palace · Nizami Street",loc:"Baku Old City",desc:"Breakfast, then the Old City: Maiden Tower with panoramic views over Baku and the Flame Towers, Juma Mosque (Azerbaijan's oldest), Shirvanshah Palace (1411), the Heydar Aliyev Museum of Azerbaijan's history and the Car Museum. Then Nizami Street, Baku's most famous street. Lunch, then return to the hotel."},
  {day:"Day 5",title:"Travel to Gabala — Cable Car & Mountain Coaster",loc:"Gabala",desc:"Drive to Gabala city amid the stunning nature of the Caucasus mountains. Ride the high cable car with its 4 stations, plus the mountain coaster. Restaurant lunch (optional) enjoying the nature and mountains, then check in and overnight at the Gabala hotel."},
  {day:"Day 6",title:"Optional: Nohur Lake · Shooting Range · Land Park",loc:"Gabala (optional)",desc:"Free day, or an optional trip to Nohur Lake with beautiful boat rides and lake activities, then the shooting range, then Gabala Land Park — the largest park in Gabala. Return to the Gabala hotel."},
  {day:"Day 7",title:"Return to Baku",loc:"Baku",desc:"Return to the capital Baku. Check in to the Baku hotel and overnight."},
  {day:"Day 8",title:"Departure",loc:"Baku",desc:"Prepare and check out, then transfer to the airport for the return flight home."}
];
const AZERBAIJAN_PACKAGES = [
  {id:1,title:"Amazon Hotel — Baku",arabic:"برنامج باكو — فندق أمازون",subtitle:"Amazon 3★ (Baku) · all 7 nights in Baku · every Saturday",route:"Amman ↔ Baku",accom:"All 7 nights in Baku",stars:3,meal:"BB",single:619,double:469,child:449,
   hotels:[{baku:"Amazon ★★★",gabala:"— (all nights in Baku)"}],itinerary:AZ_BAKU_ITIN},
  {id:2,title:"Piano Hotel — Baku",arabic:"برنامج باكو — فندق بيانو",subtitle:"Piano 3★ (Baku) · all 7 nights in Baku · every Saturday",route:"Amman ↔ Baku",accom:"All 7 nights in Baku",stars:3,meal:"BB",single:629,double:479,child:459,
   hotels:[{baku:"Piano ★★★",gabala:"— (all nights in Baku)"}],itinerary:AZ_BAKU_ITIN},
  {id:3,title:"Atlas Hotel — Baku",arabic:"برنامج باكو — فندق أطلس",subtitle:"Atlas 4★ (Baku) · all 7 nights in Baku · every Saturday",route:"Amman ↔ Baku",accom:"All 7 nights in Baku",stars:4,meal:"BB",single:669,double:499,child:479,
   hotels:[{baku:"Atlas ★★★★",gabala:"— (all nights in Baku)"}],itinerary:AZ_BAKU_ITIN},
  {id:4,title:"Innab Inn Hotel — Baku",arabic:"برنامج باكو — فندق إناب إن",subtitle:"Innab Inn 5★ (Baku) · all 7 nights in Baku · every Saturday",route:"Amman ↔ Baku",accom:"All 7 nights in Baku",stars:5,meal:"BB",single:749,double:549,child:529,
   hotels:[{baku:"Innab Inn ★★★★★",gabala:"— (all nights in Baku)"}],itinerary:AZ_BAKU_ITIN},
  {id:5,title:"Marriott Hotel — Baku",arabic:"برنامج باكو — فندق ماريوت",subtitle:"Marriott 5★ (Baku) · all 7 nights in Baku · every Saturday",route:"Amman ↔ Baku",accom:"All 7 nights in Baku",stars:5,meal:"BB",single:1039,double:699,child:679,
   hotels:[{baku:"Marriott ★★★★★",gabala:"— (all nights in Baku)"}],itinerary:AZ_BAKU_ITIN},
  {id:6,title:"Amazon + Bless Hotel",arabic:"باكو + قبالا — أمازون + بليس",subtitle:"Amazon 3★ (Baku) · Bless Hotel 4★ (Gabala) · every Saturday",route:"Amman ↔ Baku",accom:"4 nights Baku + 2 nights Gabala + 1 night Baku",stars:3,meal:"BB",single:669,double:519,child:499,
   hotels:[{baku:"Amazon ★★★",gabala:"Bless Hotel ★★★★"}],itinerary:AZ_COMBO_ITIN},
  {id:7,title:"Piano + Bless Hotel",arabic:"باكو + قبالا — بيانو + بليس",subtitle:"Piano 3★ (Baku) · Bless Hotel 4★ (Gabala) · every Saturday",route:"Amman ↔ Baku",accom:"4 nights Baku + 2 nights Gabala + 1 night Baku",stars:3,meal:"BB",single:679,double:529,child:509,
   hotels:[{baku:"Piano ★★★",gabala:"Bless Hotel ★★★★"}],itinerary:AZ_COMBO_ITIN},
  {id:8,title:"Atlas + Bless Hotel",arabic:"باكو + قبالا — أطلس + بليس",subtitle:"Atlas 4★ (Baku) · Bless Hotel 4★ (Gabala) · every Saturday",route:"Amman ↔ Baku",accom:"4 nights Baku + 2 nights Gabala + 1 night Baku",stars:4,meal:"BB",single:719,double:549,child:529,
   hotels:[{baku:"Atlas ★★★★",gabala:"Bless Hotel ★★★★"}],itinerary:AZ_COMBO_ITIN},
  {id:9,title:"Innab Inn + Bless Hotel",arabic:"باكو + قبالا — إناب إن + بليس",subtitle:"Innab Inn 5★ (Baku) · Bless Hotel 4★ (Gabala) · every Saturday",route:"Amman ↔ Baku",accom:"4 nights Baku + 2 nights Gabala + 1 night Baku",stars:5,meal:"BB",single:799,double:599,child:579,
   hotels:[{baku:"Innab Inn ★★★★★",gabala:"Bless Hotel ★★★★"}],itinerary:AZ_COMBO_ITIN},
  {id:10,title:"Innab Inn + Chukhur Gabala",arabic:"باكو + قبالا — إناب إن + تشوخور قبالا",subtitle:"Innab Inn 5★ (Baku) · Chukhur Gabala 4★ (Gabala) · every Saturday",route:"Amman ↔ Baku",accom:"4 nights Baku + 2 nights Gabala + 1 night Baku",stars:5,meal:"BB",single:799,double:599,child:579,
   hotels:[{baku:"Innab Inn ★★★★★",gabala:"Chukhur Gabala ★★★★"}],itinerary:AZ_COMBO_ITIN},
  {id:11,title:"Marriott + Bless Hotel",arabic:"باكو + قبالا — ماريوت + بليس",subtitle:"Marriott 5★ (Baku) · Bless Hotel 4★ (Gabala) · every Saturday",route:"Amman ↔ Baku",accom:"4 nights Baku + 2 nights Gabala + 1 night Baku",stars:5,meal:"BB",single:1129,double:729,child:709,
   hotels:[{baku:"Marriott ★★★★★",gabala:"Bless Hotel ★★★★"}],itinerary:AZ_COMBO_ITIN}
];
// ════════════════════════════════════════════════════════════════
// GEORGIA RICH PACKAGE DATA (same style as Azerbaijan)
// ════════════════════════════════════════════════════════════════
const GEORGIA_PACKAGES = [
  {id:1,title:"Batumi",arabic:"باتومي",subtitle:"Amazon River & Forests · Kutaisi · Martvili",route:"Amman ↔ Batumi",dates:"22.05 | 26.05 | 29.05",accom:"All 7 nights in Batumi",flyDays:["Tuesday","Friday"],
   hotels:[
     {name:"Caerleon",stars:3,meal:"No Breakfast",d:479,s:699,c6:459,c2:399},
     {name:"Marani",stars:3,meal:"Breakfast",d:499,s:719,c6:479,c2:399},
     {name:"Skyline Batumi",stars:4,meal:"Breakfast",d:549,s:759,c6:529,c2:399},
     {name:"Legacy",stars:4,meal:"Breakfast",d:569,s:769,c6:549,c2:399},
     {name:"Batumi View Luxury",stars:4,meal:"Breakfast",d:599,s:789,c6:579,c2:399},
     {name:"Wyn Residences",stars:4,meal:"Breakfast",d:629,s:819,c6:609,c2:399},
     {name:"Steps Batumi",stars:5,meal:"Breakfast",d:649,s:899,c6:629,c2:399},
     {name:"The Grandeur",stars:5,meal:"Breakfast",d:699,s:949,c6:679,c2:399},
     {name:"Alliance Palace & Casino",stars:5,meal:"Breakfast",d:699,s:949,c6:679,c2:399},
     {name:"JRW Welmond Hotel & Casino",stars:5,meal:"Breakfast",d:749,s:989,c6:729,c2:399}
   ],
   itinerary:[
     {day:"Day 1",title:"Arrival & Turkish Border Excursion",loc:"Batumi",desc:"Airport pickup then excursion to Turkish border (Sarpi) passing Gonio Fortress and Sarpi Waterfall (20-min stop). Restaurant dinner then hotel check-in."},
     {day:"Day 2",title:"Makhuntseti & Kida Nature",loc:"Batumi",desc:"Makhuntseti & Kida: Ajara River, Makhuntseti Waterfalls, Queen Tamar Bridge. Activities: Rafting, zipline over the river. Lunch by the Black Sea (seafood). 3 km cable car panorama of Batumi."},
     {day:"Day 3",title:"Botanical Garden & Sea Cruise",loc:"Batumi",desc:"Batumi Botanical Garden, Boulevard walk, Ali & Nino sculpture, Alphabetic Tower, Batumi Eye. Sea cruise on a large yacht with music. Optional: parasailing, sea buggy. Dolphin show & May 26 Lake."},
     {day:"Day 4",title:"Uzungol Lake (optional — extra cost)",loc:"Trabzon, Turkey",desc:"Free day OR optional trip to Uzungol Lake, Turkey — mountain lake scenery, then Trabzon Meidan Centre for shopping and leisure."},
     {day:"Day 5",title:"Amazon Forest Boat Tour",loc:"Poti / Amazon",desc:"Special Amazon Forest excursion in coastal city of Poti. 2-hour private boat tour through Georgian Amazon rivers deep into the jungle. Beautiful seating & lunch. Free time in this unique area."},
     {day:"Day 6",title:"Kutaisi & Martvili (optional — extra cost)",loc:"Kutaisi",desc:"Love & Dinosaur Caves in Kutaisi. Then Martvili — stunning springs and Georgia's most beautiful nature scenery."},
     {day:"Day 7",title:"Majakhela or Mtirala (optional — extra cost)",loc:"Majakhela / Mtirala",desc:"Free day OR BBQ in Majakhela countryside — rivers, waterfalls, mountains. OR Mtirala National Park — Shakvi Centre, hanging bridge (Batara Mtirala), National Park activities."},
     {day:"Day 8",title:"Departure",loc:"Batumi",desc:"Check out and transfer to airport for return flight."}
   ]},
  {id:2,title:"Batumi & Tbilisi",arabic:"باتومي وتبليسي",subtitle:"Batumi · Caucasus Mountains · Tbilisi",route:"Amman ↔ Batumi",dates:"22.05 | 26.05 | 29.05",accom:"3 nights Batumi + 3 nights Tbilisi + 1 night Batumi",flyDays:["Tuesday","Friday"],
   hotels:[
     {name:"Carleone★★★ (Batumi) + Shine Palace★★★ (Tbilisi)",stars:3,meal:"No Breakfast",d:499,s:599,c6:479,c2:399},
     {name:"Marani★★★ + Shine Palace★★★",stars:3,meal:"Breakfast",d:529,s:659,c6:509,c2:399},
     {name:"Skyline★★★★ + Shine Palace★★★",stars:4,meal:"Breakfast",d:569,s:709,c6:549,c2:399},
     {name:"Skyline★★★★ + Redline★★★★",stars:4,meal:"Breakfast",d:599,s:749,c6:579,c2:399},
     {name:"Legacy★★★★ + Green Tower★★★★",stars:4,meal:"Breakfast",d:599,s:749,c6:579,c2:399},
     {name:"Legacy★★★★ + Redline Marjan★★★★",stars:4,meal:"Breakfast",d:639,s:769,c6:619,c2:399},
     {name:"Wyn Residences★★★★ + Carousel★★★★",stars:4,meal:"Breakfast",d:639,s:769,c6:619,c2:399},
     {name:"Steps Batumi★★★★★ + Carousel Marjan★★★★",stars:5,meal:"Breakfast",d:669,s:819,c6:649,c2:399},
     {name:"Batumi View Luxury★★★★ + Ramada★★★★",stars:4,meal:"Breakfast",d:689,s:819,c6:669,c2:399},
     {name:"Steps Batumi★★★★★ + Lisi Panorama★★★★★",stars:5,meal:"Breakfast",d:709,s:889,c6:689,c2:399},
     {name:"Steps Batumi★★★★★ + Royal Tulip★★★★★",stars:5,meal:"Breakfast",d:769,s:949,c6:749,c2:399},
     {name:"Alliance Palace★★★★★ + Hualing Preference★★★★★",stars:5,meal:"Breakfast",d:779,s:959,c6:759,c2:399},
     {name:"The Grandeur★★★★★ + Royal Tulip★★★★★",stars:5,meal:"Breakfast",d:789,s:969,c6:769,c2:399},
     {name:"JRW Welmond★★★★★ + Royal Tulip★★★★★",stars:5,meal:"Breakfast",d:839,s:1019,c6:819,c2:399}
   ],
   itinerary:[
     {day:"Day 1",title:"Arrival & Sarpi Border",loc:"Batumi",desc:"Airport pickup and excursion to Turkish border (Sarpi), Gonio Fortress, Sarpi Waterfall. Restaurant then hotel check-in."},
     {day:"Day 2",title:"Makhuntseti & Kida Nature",loc:"Batumi",desc:"Makhuntseti & Kida: Ajara River, waterfalls, Queen Tamar Bridge. Rafting, zipline. Lunch by Black Sea. 3 km cable car panorama."},
     {day:"Day 3",title:"Botanical Garden & Sea Cruise",loc:"Batumi",desc:"Botanical Garden, Boulevard, Ali & Nino, Alphabetic Tower, Batumi Eye. Yacht cruise. Dolphin show & May 26 Lake."},
     {day:"Day 4",title:"Travel to Tbilisi",loc:"Tbilisi",desc:"Breakfast then depart with guide to Tbilisi capital. Stop at waterfalls and nature en route. Check in upon arrival and overnight."},
     {day:"Day 5",title:"Old Tbilisi City Tour",loc:"Tbilisi",desc:"European Old Town, Peace Bridge, Tbilisi Waterfall, sulfur baths, cable car to Mother of Georgia statue. Lunch. Mtskheta city, Jvari (City of Love). Tbilisi Mall."},
     {day:"Day 6",title:"Caucasus Mountains or Diamond Bridge (optional)",loc:"Tbilisi region",desc:"Free day OR Caucasus Mountains — Ananuri Lake, Gudauri, Kazbegi panorama (Gergeti Trinity Church). BBQ lunch in the open air. OR Tsalka Diamond Bridge — Georgia's newest attraction, transparent bridge between mountains."},
     {day:"Day 7",title:"Return to Batumi",loc:"Batumi",desc:"Return to Batumi for overnight and preparation for travel day."},
     {day:"Day 8",title:"Departure",loc:"Batumi",desc:"Check out and transfer to airport."}
   ]},
  {id:3,title:"Golden Program",arabic:"البرنامج الذهبي",subtitle:"Batumi · Borjomi · Bakuriani · Tbilisi",route:"Amman ↔ Batumi",dates:"22.05 | 26.05 | 29.05",accom:"2 nights Batumi + 2 nights Borjomi + 2 nights Tbilisi + 1 night Batumi",flyDays:["Tuesday","Friday"],
   hotels:[
     {name:"Carleone★★★ + Holiday Borjomi★★★★ + Shine Palace★★★",stars:3,meal:"No Breakfast",d:499,s:599,c6:479,c2:399},
     {name:"Marani★★★ + Holiday Borjomi★★★★ + Shine Palace★★★",stars:3,meal:"Breakfast",d:529,s:659,c6:509,c2:399},
     {name:"Skyline★★★★ + Holiday Borjomi★★★★ + Shine Palace★★★",stars:4,meal:"Breakfast",d:569,s:709,c6:549,c2:399},
     {name:"Skyline★★★★ + Holiday Borjomi★★★★ + Redline★★★★",stars:4,meal:"Breakfast",d:599,s:749,c6:579,c2:399},
     {name:"Legacy★★★★ + Holiday Borjomi★★★★ + Green Tower★★★★",stars:4,meal:"Breakfast",d:599,s:749,c6:579,c2:399},
     {name:"Legacy★★★★ + Holiday Borjomi★★★★ + Carousel★★★★",stars:4,meal:"Breakfast",d:639,s:769,c6:619,c2:399},
     {name:"Steps Batumi★★★★★ + Holiday Borjomi★★★★ + Carousel Marjan★★★★",stars:5,meal:"Breakfast",d:669,s:819,c6:649,c2:399},
     {name:"Steps Batumi★★★★★ + Holiday Borjomi★★★★ + Royal Tulip★★★★★",stars:5,meal:"Breakfast",d:769,s:949,c6:749,c2:399},
     {name:"JRW Welmond★★★★★ + Holiday Borjomi★★★★ + Royal Tulip★★★★★",stars:5,meal:"Breakfast",d:839,s:1019,c6:819,c2:399}
   ],
   itinerary:[
     {day:"Day 1",title:"Arrival & Batumi City Tour",loc:"Batumi",desc:"Airport pickup, city centre tour, hotel check-in."},
     {day:"Day 2",title:"Makhuntseti & Kida Nature",loc:"Batumi",desc:"Makhuntseti & Kida: Ajara River, waterfalls, Queen Tamar Bridge. Rafting, zipline. Lunch by Black Sea. Cable car panorama."},
     {day:"Day 3",title:"Travel to Borjomi",loc:"Borjomi",desc:"Breakfast then travel with guide to Borjomi. Hotel in the heart of the forests with spectacular views. Check-in and overnight."},
     {day:"Day 4",title:"Borjomi National Park & Bakuriani (optional)",loc:"Borjomi + Bakuriani",desc:"Free day OR Borjomi National Park — river walk, mineral water tasting, cable car to mountain panorama, 4×4 jeep tour (2 hrs), Bakuriani panorama, horse riding, rafting."},
     {day:"Day 5",title:"Travel to Tbilisi",loc:"Tbilisi",desc:"Breakfast then travel to Tbilisi. City centre tour. Hotel check-in."},
     {day:"Day 6",title:"Old Tbilisi & Mtskheta",loc:"Tbilisi",desc:"Old European Town, Peace Bridge, Tbilisi Waterfall, sulfur baths, Mother of Georgia cable car. Lunch. Mtskheta, Jvari (City of Love). Tbilisi Mall."},
     {day:"Day 7",title:"Return to Batumi",loc:"Batumi",desc:"Return to Batumi for overnight."},
     {day:"Day 8",title:"Departure",loc:"Batumi",desc:"Check out and transfer to airport."}
   ]},
  {id:4,title:"Batumi & Trabzon",arabic:"باتومي وطرابزون",subtitle:"Batumi · Rize · Trabzon · Uzungol",route:"Amman ↔ Batumi",dates:"22.05 | 26.05 | 29.05",accom:"3 nights Batumi + 3 nights Trabzon + 1 night Batumi",flyDays:["Tuesday","Friday"],
   hotels:[
     {name:"Carleone★★★ (Batumi) + Queen Suite Seaside★★★★ (Trabzon)",stars:4,meal:"No Breakfast",d:499,s:599,c6:479,c2:399},
     {name:"Marani★★★ + Queen Suite Seaside★★★★",stars:4,meal:"Breakfast",d:529,s:659,c6:509,c2:399},
     {name:"Skyline★★★★ + Queen Suite Seaside★★★★",stars:4,meal:"Breakfast",d:579,s:759,c6:559,c2:399},
     {name:"Skyline★★★★ + Aktash Lights★★★★",stars:4,meal:"Breakfast",d:599,s:749,c6:579,c2:399},
     {name:"Legacy★★★★ + Aktash Lights★★★★",stars:4,meal:"Breakfast",d:619,s:749,c6:599,c2:399},
     {name:"Legacy★★★★ + Kuhla★★★★",stars:4,meal:"Breakfast",d:629,s:759,c6:609,c2:399},
     {name:"Batumi View Luxury★★★★ + Kuhla★★★★",stars:4,meal:"Breakfast",d:639,s:769,c6:619,c2:399},
     {name:"Wyn Residences★★★★ + Kuhla★★★★",stars:4,meal:"Breakfast",d:649,s:779,c6:629,c2:399},
     {name:"Steps Batumi★★★★★ + Best Western★★★★★",stars:5,meal:"Breakfast",d:679,s:829,c6:659,c2:399},
     {name:"Steps Batumi★★★★★ + Residence Inn by Marriott★★★★★",stars:5,meal:"Breakfast",d:699,s:879,c6:679,c2:399},
     {name:"Steps Batumi★★★★★ + MovenPick★★★★★",stars:5,meal:"Breakfast",d:719,s:899,c6:699,c2:399},
     {name:"Steps Batumi★★★★★ + Double Tree by Hilton★★★★★",stars:5,meal:"Breakfast",d:729,s:909,c6:709,c2:399},
     {name:"Steps Batumi★★★★★ + Novotel★★★★★",stars:5,meal:"Breakfast",d:749,s:929,c6:729,c2:399},
     {name:"The Grandeur★★★★★ + Residence Inn by Marriott★★★★★",stars:5,meal:"Breakfast",d:749,s:929,c6:729,c2:399},
     {name:"JRW Welmond★★★★★ + Mercure★★★★★",stars:5,meal:"Breakfast",d:829,s:1009,c6:809,c2:399}
   ],
   itinerary:[
     {day:"Day 1",title:"Arrival & Sarpi Border",loc:"Batumi",desc:"Airport pickup, Sarpi border excursion, Gonio Fortress, Sarpi Waterfall. Restaurant then hotel check-in."},
     {day:"Day 2",title:"Batumi Boulevard & Sea Activities",loc:"Batumi",desc:"Ali & Nino sculpture, Alphabetic Tower, Batumi Eye. Sea cruise & activities (parasailing, sea buggy). Dolphin show, Aquarium, May 26 Lake. 3 km cable car."},
     {day:"Day 3",title:"Makhuntseti & Kida Nature",loc:"Batumi",desc:"Makhuntseti & Kida: Ajara River, waterfalls, Queen Tamar Bridge. Rafting, zipline. Lunch by Black Sea."},
     {day:"Day 4",title:"Rize, Turkey",loc:"Rize",desc:"Breakfast then drive to Rize, Turkey (1 hour). Panoramic Black Sea lunch. Rize square & Semal Mall shopping. Return to hotel."},
     {day:"Day 5",title:"Trabzon City Tour",loc:"Trabzon",desc:"Aya Sofya Mosque, Ataturk Palace, Botanical Garden, Sira Lake for lunch. Trabzon Meidan for shopping. Free time."},
     {day:"Day 6",title:"Uzungol (optional — extra cost)",loc:"Uzungol",desc:"Tea factory, Turkish delight factory, Uzungol waterfalls, Uzungol Lake for lunch and free time for photography."},
     {day:"Day 7",title:"Return to Batumi",loc:"Batumi",desc:"Breakfast then return to Batumi. Hotel check-in and rest."},
     {day:"Day 8",title:"Departure",loc:"Batumi",desc:"Check out and transfer to Batumi airport."}
   ]},
  {id:5,title:"Trabzon from Batumi",arabic:"طرابزون من باتومي",subtitle:"Rize · Trabzon · Uzungol · Hayder Nabi · Ayder",route:"Amman ↔ Batumi (via border to Trabzon)",dates:"22.05 | 26.05 | 29.05",accom:"All 7 nights in Trabzon",flyDays:["Tuesday","Friday"],
   hotels:[
     {name:"Queen Suite Seaside★★★★ (No Breakfast)",stars:4,meal:"No Breakfast",d:479,s:629,c6:459,c2:399},
     {name:"Queen Suite Seaside★★★★ (Breakfast)",stars:4,meal:"Breakfast",d:499,s:689,c6:479,c2:399},
     {name:"Queen Suite Seaside★★★★ (Breakfast+Dinner)",stars:4,meal:"Breakfast + Dinner",d:529,s:709,c6:509,c2:399},
     {name:"Aktash Lights★★★★",stars:4,meal:"Breakfast",d:549,s:719,c6:529,c2:399},
     {name:"Nazar Meidan★★★",stars:3,meal:"Breakfast",d:549,s:719,c6:529,c2:399},
     {name:"Marvell City★★★★",stars:4,meal:"Breakfast",d:579,s:729,c6:559,c2:399},
     {name:"Park Square Meidan★★★★",stars:4,meal:"Breakfast",d:599,s:749,c6:579,c2:399},
     {name:"Usta Park★★★★",stars:4,meal:"Breakfast",d:599,s:749,c6:579,c2:399},
     {name:"Kuhla★★★★+",stars:4,meal:"Breakfast",d:599,s:769,c6:579,c2:399},
     {name:"Best Western★★★★★",stars:5,meal:"Breakfast",d:599,s:769,c6:579,c2:399},
     {name:"MovenPick★★★★★",stars:5,meal:"Breakfast",d:629,s:829,c6:609,c2:399},
     {name:"Panagia★★★★★",stars:5,meal:"Breakfast",d:639,s:839,c6:619,c2:399},
     {name:"Residence Inn by Marriott★★★★★",stars:5,meal:"Breakfast",d:639,s:839,c6:619,c2:399},
     {name:"Novotel★★★★★",stars:5,meal:"Breakfast",d:649,s:849,c6:629,c2:399},
     {name:"Double Tree by Hilton★★★★★",stars:5,meal:"Breakfast",d:699,s:899,c6:679,c2:399},
     {name:"Mercure★★★★★",stars:5,meal:"Breakfast",d:729,s:929,c6:709,c2:399}
   ],
   itinerary:[
     {day:"Day 1",title:"Arrival Batumi → Trabzon",loc:"Batumi → Trabzon",desc:"Pickup from Batumi airport, Sarpi border excursion. Cross border to Rize — panoramic Black Sea lunch. Rize Meidan & Semal Mall shopping. Then to Trabzon, hotel check-in."},
     {day:"Day 2",title:"Trabzon City Tour",loc:"Trabzon",desc:"Aya Sofya Mosque, famous Ataturk Palace, Ataturk Square. Shopping in popular bazaars and malls."},
     {day:"Day 3",title:"Uzungol Lake",loc:"Trabzon",desc:"Tea factory, Turkish delight factory, Uzungol waterfalls, Uzungol Lake. Balcony lunch overlooking the lake. Return to hotel."},
     {day:"Day 4",title:"Hayder Nabi Plateau (optional)",loc:"Trabzon",desc:"Famous Hayder Nabi plateau at ~3,000 m above sea level. Stunning panoramic views. Sira (Sirajol) Lake and activities."},
     {day:"Day 5",title:"Ayder Highlands",loc:"Trabzon",desc:"Ayder highlands — textile factory, Valley of the Winds (rafting, zipline, swing), Ayder plateau and waterfalls, lunch, Ottoman bridges, Isket Oglu waterfalls."},
     {day:"Day 6",title:"Zigana Mountains (optional)",loc:"Trabzon",desc:"Zigana highlands — bear safari, famous Turul glass overlook, Hemsi Koy village activities."},
     {day:"Day 7",title:"Ordu City (optional)",loc:"Ordu",desc:"Ordu — hazelnut capital. Trabolu Fortress. Cable car to Boztepe summit. Sea cruise (weather permitting). City centre."},
     {day:"Day 8",title:"Departure via Batumi",loc:"Trabzon → Batumi",desc:"Check out and transfer to Batumi airport for return flight."}
   ]},
  {id:6,title:"Trabzon Direct",arabic:"طرابزون المباشرة",subtitle:"Direct Flight · Rize · Trabzon · Uzungol · Hayder Nabi · Ayder",route:"Amman ↔ Trabzon (Direct)",dates:"20.05 | 25.05 | 27.05 | 30.05",accom:"All 7 nights in Trabzon",flyDays:["Monday","Wednesday","Saturday"],
   hotels:[
     {name:"Queen Suite Seaside★★★★ (No Breakfast)",stars:4,meal:"No Breakfast",d:479,s:629,c6:459,c2:399},
     {name:"Queen Suite Seaside★★★★ (Breakfast)",stars:4,meal:"Breakfast",d:499,s:689,c6:479,c2:399},
     {name:"Queen Suite Seaside★★★★ (Breakfast+Dinner)",stars:4,meal:"Breakfast + Dinner",d:529,s:709,c6:509,c2:399},
     {name:"Aktash Lights★★★★",stars:4,meal:"Breakfast",d:549,s:719,c6:529,c2:399},
     {name:"Nazar Meidan★★★",stars:3,meal:"Breakfast",d:549,s:719,c6:529,c2:399},
     {name:"Marvell City★★★★",stars:4,meal:"Breakfast",d:579,s:729,c6:559,c2:399},
     {name:"Park Square Meidan★★★★",stars:4,meal:"Breakfast",d:599,s:749,c6:579,c2:399},
     {name:"Usta Park★★★★",stars:4,meal:"Breakfast",d:599,s:749,c6:579,c2:399},
     {name:"Kuhla★★★★+",stars:4,meal:"Breakfast",d:599,s:769,c6:579,c2:399},
     {name:"Best Western★★★★★",stars:5,meal:"Breakfast",d:599,s:769,c6:579,c2:399},
     {name:"MovenPick★★★★★",stars:5,meal:"Breakfast",d:629,s:829,c6:609,c2:399},
     {name:"Panagia★★★★★",stars:5,meal:"Breakfast",d:639,s:839,c6:619,c2:399},
     {name:"Residence Inn by Marriott★★★★★",stars:5,meal:"Breakfast",d:639,s:839,c6:619,c2:399},
     {name:"Novotel★★★★★",stars:5,meal:"Breakfast",d:649,s:849,c6:629,c2:399},
     {name:"Double Tree by Hilton★★★★★",stars:5,meal:"Breakfast",d:699,s:899,c6:679,c2:399},
     {name:"Mercure★★★★★",stars:5,meal:"Breakfast",d:729,s:929,c6:709,c2:399}
   ],
   itinerary:[
     {day:"Day 1",title:"Arrival & City Orientation",loc:"Trabzon",desc:"Airport pickup, restaurant for dinner, SIM card purchase, city orientation tour. Hotel check-in."},
     {day:"Day 2",title:"Trabzon City Tour",loc:"Trabzon",desc:"Aya Sofya Mosque, famous Ataturk Palace, Ataturk Square. Shopping in popular bazaars and malls."},
     {day:"Day 3",title:"Rize & Ayder Highlands",loc:"Rize + Ayder",desc:"Drive to Rize via tea plantations. Zipline over Fartina River. Rafting on the Storm River. Ottoman bridges. Ayder plateau — lunch and magical scenery."},
     {day:"Day 4",title:"Hayder Nabi & Shopping",loc:"Hayder Nabi",desc:"Sira Lake (optional boat ride). Hayder Nabi plateau at ~3,000 m — unique panoramic views. Free time for lunch. Forum Mall shopping."},
     {day:"Day 5",title:"Uzungol",loc:"Uzungol",desc:"Tea factory, Turkish delight factory, Uzungol waterfalls, Uzungol Lake. Balcony lunch. Return to hotel."},
     {day:"Day 6",title:"Ordu (optional)",loc:"Ordu",desc:"Ordu city — hazelnut capital. Trabolu Fortress. Cable car to Boztepe (optional). Sea cruise (weather permitting). City centre."},
     {day:"Day 7",title:"Giresun or Himse Koy (optional)",loc:"Giresun / Himse Koy",desc:"Giresun province — water terraces, Kozaly waterfall, Blue Lake. OR Sumiala trip — Lemni Lake, Himse Koy village, Zigana mountains."},
     {day:"Day 8",title:"Departure",loc:"Airport",desc:"Check out and transfer to airport."}
   ]},
   {id:7,title:"Batumi & Sochi",arabic:"باتومي وسوتشي",subtitle:"Batumi · Sochi Russia · No Visa for Jordanian Passport",route:"Amman ↔ Batumi + Internal flight Batumi ↔ Sochi (45 min)",dates:"22.05 | 26.05 | 29.05",accom:"3 nights Batumi + 3 nights Sochi + 1 night Batumi",flyDays:["Tuesday","Friday"],visaNote:"Russia is visa-free for Jordanian passport holders (national ID number required).",
    hotels:[
      {name:"Steps Batumi★★★★★ + City Park Hotel (Marins Park)★★★★",stars:5,meal:"Breakfast",d:779,s:1149,c6:779,c2:599},
      {name:"Steps Batumi★★★★★ + Mirror Family Resort★★★★",stars:5,meal:"Breakfast",d:779,s:1149,c6:779,c2:599},
      {name:"Steps Batumi★★★★★ + Denart★★★★",stars:5,meal:"Breakfast",d:779,s:1149,c6:779,c2:599},
      {name:"The Grandeur★★★★★ + City Park Hotel★★★★",stars:5,meal:"Breakfast",d:879,s:1249,c6:879,c2:599},
      {name:"The Grandeur★★★★★ + Mirror Family Resort★★★★",stars:5,meal:"Breakfast",d:879,s:1249,c6:879,c2:599},
      {name:"JRW Welmond★★★★★ + City Park Hotel★★★★",stars:5,meal:"Breakfast",d:979,s:1349,c6:979,c2:599},
      {name:"JRW Welmond★★★★★ + Mirror Family Resort★★★★",stars:5,meal:"Breakfast",d:979,s:1349,c6:979,c2:599}
    ],
    itinerary:[
      {day:"Day 1",title:"Arrival & Sarpi Border",loc:"Batumi",desc:"Airport pickup, excursion to Turkish border (Sarpi), Gonio Fortress, Sarpi Waterfall. Hotel check-in."},
      {day:"Day 2",title:"Makhuntseti & Kida Nature",loc:"Batumi",desc:"Makhuntseti & Kida — waterfalls, Queen Tamar Bridge, rafting, zipline. Lunch by Black Sea. Cable car panorama."},
      {day:"Day 3",title:"Botanical Garden & Sea Cruise",loc:"Batumi",desc:"Botanical Garden, Boulevard, Ali & Nino, Alphabetic Tower. Yacht cruise. Dolphin show & May 26 Lake."},
      {day:"Day 4",title:"Fly to Sochi, Russia",loc:"Sochi",desc:"Flight from Batumi to Adler airport (45 min, Russian airline). Currency exchange. City centre tour. Lunch at restaurant."},
      {day:"Day 5",title:"Krasnaya Polyana & Rosa Khutor (optional)",loc:"Sochi",desc:"Akhshtyr Valley, Akhtsou Gorge, Raysky Ugolok (free tea tasting), Mzymta River panorama, Rubezh Yoga complex (tasting + lunch), Esto-Sadok, Rosa Khutor resort, cable car to 2,200 m, Olympic Park, Fountain show."},
      {day:"Day 6",title:"Sochi City Tour",loc:"Sochi",desc:"Riviera Park, sea port, Winter Theater square, mineral water spring, Stalin's dacha, honey tasting, Akhun Mountain & tower panorama, Ferris wheel view of city and sea."},
      {day:"Day 7",title:"Return to Batumi",loc:"Batumi",desc:"Fly back from Sochi to Batumi (45 min). Hotel check-in and rest."},
      {day:"Day 8",title:"Departure",loc:"Batumi",desc:"Check out and transfer to Batumi airport."}
    ]}
];
// ════════════════════════════════════════════════════════════════
// KOSOVO RICH PACKAGE DATA (same style as Georgia — DMC with included ticket)
// ════════════════════════════════════════════════════════════════
const KOSOVO_SHARED_ITINERARY = [
  {day:"Day 1",title:"Arrival & Reception — Prishtina",loc:"Prishtina",
   desc:"Reception at Prishtina International Airport. Transfer to the capital. Purchase SIM cards and exchange currency, then check in to the hotel and receive room keys. Free time to rest and prepare for a journey full of beautiful memories.",
   ar:"استقبال من مطار بريشتينا الدولي والتوجه إلى العاصمة بريشتينا، شراء شرائح الإنترنت وتصريف العملات ومن ثم التوجه إلى الفندق واستلام الغرف، ووقت حر للاستراحة والاستعداد لرحلة مليئة بالذكريات الجميلة."},
  {day:"Day 2",title:"Mountains & Nature — Brezovica & Brezala",loc:"Brezovica / Brezala",
   desc:"Drive to the Brezovica area and enjoy the towering mountains, lush green nature and fresh air. Then visit Brezala area and enjoy the scenic natural vistas and panoramic views, with free time for restaurants and nature seating, before returning to the hotel.",
   ar:"الانطلاق إلى منطقة بريزوفيتسا والاستمتاع بالجبال الشاهقة والطبيعة الخضراء الساحرة والهواء النقي، ثم زيارة منطقة بريفالا والاستمتاع بالإطلالات الطبيعية والمناظر البانورامية الخلابة، مع وقت حر للاستمتاع بالمطاعم والجلسات الطبيعية، ومن ثم العودة مساءً إلى الفندق."},
  {day:"Day 3",title:"History & Nature — Prizren & Brod",loc:"Prizren / Brod",
   desc:"Visit the historic city of Prizren — the jewel of Kosovo — strolling through old alleyways, historic bridges and beautiful squares. Then visit the fortress and enjoy the breathtaking panoramic views. Afterwards head to Brod area and enjoy the mountain atmosphere and lush scenery, with free time for shopping and photography before returning to the hotel.",
   ar:"زيارة مدينة بريزرن جوهرة كوسوفو التاريخية والتجول بين الأزقة القديمة والجسور التاريخية والساحات الجميلة، ثم زيارة القلعة والاستمتاع بالإطلالات البانورامية الساحرة، وبعدها التوجه إلى منطقة برود والاستمتاع بالأجواء الجبلية والطبيعة الخضراء الخلابة، مع وقت حر للتسوق والتصوير والاستمتاع بالأجواء، ومن ثم العودة إلى الفندق مساءً."},
  {day:"Day 4",title:"Mountains & Royal Waterfalls — Istog, Peja & Rugova (optional)",loc:"Istog / Peja / Rugova",
   desc:"A day full of stunning nature, towering mountains and magnificent waterfalls. The trip begins with a visit to Istog city, then onward to Peja city to enjoy its enchanting natural atmosphere, followed by a visit to the Drini waterfall and marvelling at the water and natural scenery, then to the Rugova region to enjoy the mountains and breathtaking views, with free time for lunch and nature relaxation before returning to the hotel.",
   ar:"استعدوا ليوم مليء بالطبيعة الخلابة والجبال الشاهقة والشلالات الساحرة، حيث تبدأ الرحلة بزيارة مدينة إستوغ ثم التوجه إلى مدينة بيا والاستمتاع بأجوائها الطبيعية الساحرة، وبعدها زيارة شلال درين والاستمتاع بالمياه والمناظر الطبيعية الخلابة، ثم التوجه إلى منطقة روجوفا والاستمتاع بالجبال والإطلالات الرائعة، مع وقت حر للغداء والجلسات الطبيعية والتصوير، ومن ثم العودة مساءً."},
  {day:"Day 5",title:"Waterfalls & Lakes — Mirusha & Radoniq & Gjakova",loc:"Mirusha / Radoniq / Gjakova",
   desc:"Visit Mirusha waterfalls and enjoy the breathtaking falls and nature. Then head to Radoniq Lake and enjoy the peaceful atmosphere and beautiful natural views. Afterwards visit the city of Gjakova and stroll through its distinctive atmosphere and beautiful markets, with free time for cafés and relaxation before returning to the hotel.",
   ar:"زيارة شلالات ميروشا والاستمتاع بالشلالات والطبيعة الساحرة، ثم التوجه إلى بحيرة رادونيتش والاستمتاع بالأجواء الهادئة والإطلالات الطبيعية الجميلة، وبعدها زيارة مدينة جاكوفا والتجول في أجوائها المميزة وأسواقها الجميلة، مع وقت حر للكافيهات والجلسات، ومن ثم العودة إلى الفندق مساءً."},
  {day:"Day 6",title:"Nature & Relaxation — Bear Sanctuary, Batllava Lake & Germia (optional)",loc:"Batllava / Germia / Prishtina",
   desc:"A special trip for nature and tranquillity lovers, combining animals, nature, lakes and beautiful settings to give you a day full of relaxation and beautiful memories. Starting with a visit to the Bear Sanctuary, then heading to Batllava Lake to enjoy the greenery and lovely views, with free time for restaurants and lakeside seating. Afterwards visit the Germia area and enjoy the peaceful natural atmosphere, followed by a light evening stroll in Prishtina before returning to the hotel.",
   ar:"رحلة مميزة لعشاق الهدوء والطبيعة الخضراء تجمع بين الحيوانات والطبيعة والبحيرات والجلسات الجميلة لتمنحكم يوماً مليئاً بالاسترخاء والذكريات الجميلة، حيث تبدأ بزيارة حديقة الدببة ثم التوجه إلى بحيرة باطالفا والاستمتاع بالطبيعة الخضراء والإطلالات الجميلة، مع وقت حر للمطاعم والجلسات المطلة على البحيرة، وبعدها زيارة منطقة جرميا والاستمتاع بالأجواء الطبيعية الهادئة، ثم جولة مسائية خفيفة في بريشتينا قبل العودة مساءً."},
  {day:"Day 7",title:"Prishtina City Tour",loc:"Prishtina",
   desc:"A complete tour of the capital Prishtina including visits to the most famous landmarks, markets and cafés, with free time for shopping and visiting malls, restaurants and coffee shops. Then visit the Germia area to enjoy the beautiful evening atmosphere before returning to the hotel.",
   ar:"جولة كاملة داخل العاصمة بريشتينا تشمل زيارة أشهر المعالم والأسواق والمقاهي، مع وقت حر للتسوق وزيارة الموالت والمطاعم والكافيهات، ثم زيارة منطقة جرميا والاستمتاع بالأجواء المسائية الجميلة قبل العودة إلى الفندق."},
  {day:"Day 8",title:"Departure — Return Home",loc:"Prishtina Airport",
   desc:"Check out of the hotel and head to the airport to bid farewell to Kosovo and return home, carrying the most beautiful memories.",
   ar:"تسجيل الخروج من الفندق والتوجه إلى المطار وتوديع كوسوفو والعودة إلى أرض الوطن حاملين أجمل الذكريات."}
];
const KOSOVO_PACKAGES = [
  {id:1,title:"Sara Hotel ★★★★",arabic:"فندق سارة ★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:649,double:499,child:479,location:"Prishtina"},
  {id:2,title:"City Hotel ★★★★",arabic:"فندق سيتي ★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:699,double:549,child:529,location:"Prishtina"},
  {id:3,title:"Royal Hotel ★★★★",arabic:"فندق رويال ★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:749,double:599,child:579,location:"Prishtina"},
  {id:4,title:"Parlament Hotel ★★★★",arabic:"فندق بارلامنت ★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:769,double:619,child:599,location:"Prishtina"},
  {id:5,title:"Villa Vera ★★★★",arabic:"فيلا فيرا ★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:769,double:619,child:599,location:"Prishtina"},
  {id:6,title:"Vetus Hotel ★★★★",arabic:"فندق فيتوس ★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:779,double:629,child:609,location:"Prishtina"},
  {id:7,title:"Callisto Hotel ★★★★",arabic:"فندق كاليستو ★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:799,double:649,child:629,location:"Prishtina"},
  {id:8,title:"Best Western Galla ★★★★",arabic:"بست ويسترن جالا ★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:849,double:679,child:659,location:"Prishtina"},
  {id:9,title:"Derand Hotel ★★★★⁺",arabic:"فندق ديراند ★★★★⁺",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:869,double:699,child:679,location:"Prishtina"},
  {id:10,title:"Garden Hotel ★★★★★",arabic:"فندق جاردن ★★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:5,meal:"BB",single:899,double:699,child:679,location:"Prishtina"},
  {id:11,title:"Sirius Hotel ★★★★⁺",arabic:"فندق سيريوس ★★★★⁺",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:899,double:729,child:709,location:"Prishtina"},
  {id:12,title:"Swiss Diamond ★★★★⁺",arabic:"سويس دايموند ★★★★⁺",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:4,meal:"BB",single:909,double:739,child:719,location:"Prishtina"},
  {id:13,title:"Golden Hotel ★★★★★",arabic:"فندق جولدن ★★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:5,meal:"BB",single:949,double:749,child:729,location:"Prishtina"},
  {id:14,title:"Venus Hotel ★★★★★",arabic:"فندق فينوس ★★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:5,meal:"BB",single:949,double:749,child:729,location:"Prishtina"},
  {id:15,title:"Manami Hotel ★★★★★",arabic:"فندق ماناميا ★★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:5,meal:"BB",single:949,double:749,child:729,location:"Prishtina"},
  {id:16,title:"International Prishtina & Spa ★★★★★",arabic:"إنترناشيونال بريشتينا & سبا ★★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:5,meal:"BB",single:949,double:749,child:729,location:"Prishtina"},
  {id:17,title:"Prishtina Hotel ★★★★★",arabic:"فندق بريشتينا ★★★★★",subtitle:"Standard · Breakfast only",route:"Amman ↔ Prishtina",accom:"Prishtina (7 nights)",stars:5,meal:"BB",single:949,double:749,child:729,location:"Prishtina"}
];
// ════════════════════════════════════════════════════════════════
// FAR EAST CONFIG — ticket & profit per person (JOD)
// ════════════════════════════════════════════════════════════════
// Update these values when admin2.html ticket/profit changes
const FE_TICKET = {vietnam:349,srilanka:349,maldives:399,thailand:299,singapore:299,malaysia:299,bali:349,cairo:280,alexandria:280,'cairo-north-coast':280,'cairo-alexandria':280,'cairo-alex-northcoast':280,'alexandria-northcoast':280,'cairo-ain-sokhna':280,'cairo-aswan-luxor-cruise':280,kosovo:0};
const FE_PROFIT = {vietnam:30,srilanka:30,maldives:30,thailand:30,singapore:30,malaysia:30,bali:30,cairo:30,alexandria:30,'cairo-north-coast':30,'cairo-alexandria':30,'cairo-alex-northcoast':30,'alexandria-northcoast':30,'cairo-ain-sokhna':30,'cairo-aswan-luxor-cruise':30,kosovo:30};

async function initFEConfig() {
  try {
    const configs = await sbGet('destination_configs?destination=in.(vietnam,srilanka,maldives,thailand,singapore,malaysia,bali,cairo,alexandria,cairo-north-coast,cairo-alexandria,cairo-alex-northcoast,alexandria-northcoast,cairo-ain-sokhna,cairo-aswan-luxor-cruise,kosovo)&select=destination,ticket_jod,profit_jod');
    configs.forEach(function(c) {
      if (c.ticket_jod) FE_TICKET[c.destination] = Math.round(c.ticket_jod);
      if (c.profit_jod) FE_PROFIT[c.destination] = Math.round(c.profit_jod);
    });
  } catch(e) { console.warn('FE config fallback to defaults', e); }
  VIETNAM_PACKAGES.forEach(function(p){p.double+=FE_TICKET.vietnam+FE_PROFIT.vietnam;p.single+=FE_TICKET.vietnam+FE_PROFIT.vietnam;});
  SRI_LANKA_PACKAGES.forEach(function(p){p.double+=FE_TICKET.srilanka+FE_PROFIT.srilanka;p.single+=FE_TICKET.srilanka+FE_PROFIT.srilanka;});
  MALDIVES_PACKAGES.forEach(function(p){p.double+=FE_TICKET.maldives+FE_PROFIT.maldives;p.single+=FE_TICKET.maldives+FE_PROFIT.maldives;});
  THAILAND_PACKAGES.forEach(function(p){p.double+=FE_TICKET.thailand+FE_PROFIT.thailand;p.single+=FE_TICKET.thailand+FE_PROFIT.thailand;});
  SINGAPORE_PACKAGES.forEach(function(p){p.double+=FE_TICKET.singapore+FE_PROFIT.singapore;p.single+=FE_TICKET.singapore+FE_PROFIT.singapore;});
  MALAYSIA_PACKAGES.forEach(function(p){p.double+=FE_TICKET.malaysia+FE_PROFIT.malaysia;p.single+=FE_TICKET.malaysia+FE_PROFIT.malaysia;});
  BALI_PACKAGES.forEach(function(p){p.double+=FE_TICKET.bali+FE_PROFIT.bali;p.single+=FE_TICKET.bali+FE_PROFIT.bali;});
  CAIRO_PACKAGES.forEach(function(p){p.double+=FE_TICKET.cairo+FE_PROFIT.cairo;p.single+=FE_TICKET.cairo+FE_PROFIT.cairo;});
  ALEXANDRIA_PACKAGES.forEach(function(p){p.double+=FE_TICKET.alexandria+FE_PROFIT.alexandria;p.single+=FE_TICKET.alexandria+FE_PROFIT.alexandria;});
  CAIRO_NORTH_COAST_PACKAGES.forEach(function(p){p.double+=FE_TICKET['cairo-north-coast']+FE_PROFIT['cairo-north-coast'];p.single+=FE_TICKET['cairo-north-coast']+FE_PROFIT['cairo-north-coast'];});
  CAIRO_ALEXANDRIA_PACKAGES.forEach(function(p){p.double+=FE_TICKET['cairo-alexandria']+FE_PROFIT['cairo-alexandria'];p.single+=FE_TICKET['cairo-alexandria']+FE_PROFIT['cairo-alexandria'];});
  CAIRO_ALEX_NORTHCOAST_PACKAGES.forEach(function(p){p.double+=FE_TICKET['cairo-alex-northcoast']+FE_PROFIT['cairo-alex-northcoast'];p.single+=FE_TICKET['cairo-alex-northcoast']+FE_PROFIT['cairo-alex-northcoast'];});
  ALEXANDRIA_NORTHCOAST_PACKAGES.forEach(function(p){p.double+=FE_TICKET['alexandria-northcoast']+FE_PROFIT['alexandria-northcoast'];p.single+=FE_TICKET['alexandria-northcoast']+FE_PROFIT['alexandria-northcoast'];});
  CAIRO_AIN_SOKHNA_PACKAGES.forEach(function(p){p.double+=FE_TICKET['cairo-ain-sokhna']+FE_PROFIT['cairo-ain-sokhna'];p.single+=FE_TICKET['cairo-ain-sokhna']+FE_PROFIT['cairo-ain-sokhna'];});
  CAIRO_ASWAN_LUXOR_CRUISE_PACKAGES.forEach(function(p){p.double+=FE_TICKET['cairo-aswan-luxor-cruise']+FE_PROFIT['cairo-aswan-luxor-cruise'];p.single+=FE_TICKET['cairo-aswan-luxor-cruise']+FE_PROFIT['cairo-aswan-luxor-cruise'];});
  KOSOVO_PACKAGES.forEach(function(p){p.double+=FE_PROFIT.kosovo;p.single+=FE_PROFIT.kosovo;});
}

// ════════════════════════════════════════════════════════════════
// DB PRICE OVERLAY — unified pricing (opt-in per destination)
// When destination_configs.is_published = true for a destination, the
// published `packages` rows (admin.html → نشر) override the hardcoded
// double-price of the matching package below. Hardcoded values remain
// the fallback for unpublished destinations and unmatched titles, so
// flipping is_published back to false restores today's behavior.
// Matching key: normalized title (★ stripped, case/space-insensitive),
// preferring an exact nights match when the destination has one row
// per (hotel, nights) like the Egypt combos.
// ════════════════════════════════════════════════════════════════
function _dbNorm(s){
  return String(s||'').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')   // fold accents (Barceló→barcelo)
    .replace(/[؀-ۿ]/g,' ')                    // drop Arabic label suffixes
    .replace(/[★()\-–—&+,،.]/g,' ')
    .replace(/\b(package|cairo|north coast)\b/g,' ')  // filler tokens that differ between code titles and DB names
    .replace(/\s+/g,' ').trim();
}

async function applyDbPrices(){
  let published;
  try{
    const cfgs = await sbGet('destination_configs?select=destination,is_published');
    published = new Set(cfgs.filter(c=>c.is_published).map(c=>c.destination));
  }catch(e){ console.warn('applyDbPrices: config fetch failed — hardcoded prices kept', e); return; }
  if(!published.size) return;

  const rowsFor = dest => {
    const byKey = {};
    ALL_PACKAGES.filter(p=>p.destination===dest && p.final_price_jod>0).forEach(r=>{
      const t=_dbNorm(r.hotel_name);
      byKey[t+'|'+r.nights]=r;
      if(!byKey[t]) byKey[t]=r;
    });
    return byKey;
  };

  const FLAT_MAP = [
    ['vietnam',               ()=>VIETNAM_PACKAGES],
    ['srilanka',              ()=>SRI_LANKA_PACKAGES],
    ['maldives',              ()=>MALDIVES_PACKAGES],
    ['thailand',              ()=>THAILAND_PACKAGES],
    ['singapore',             ()=>SINGAPORE_PACKAGES],
    ['malaysia',              ()=>MALAYSIA_PACKAGES],
    ['bali',                  ()=>BALI_PACKAGES],
    ['azerbaijan',            ()=>AZERBAIJAN_PACKAGES],
    ['kosovo',                ()=>KOSOVO_PACKAGES],
    ['cairo',                 ()=>CAIRO_PACKAGES],
    ['alexandria',            ()=>ALEXANDRIA_PACKAGES],
    ['cairo-north-coast',     ()=>CAIRO_NORTH_COAST_PACKAGES],
    ['cairo-alexandria',      ()=>CAIRO_ALEXANDRIA_PACKAGES],
    ['cairo-alex-northcoast', ()=>CAIRO_ALEX_NORTHCOAST_PACKAGES],
    ['alexandria-northcoast', ()=>ALEXANDRIA_NORTHCOAST_PACKAGES],
    ['cairo-ain-sokhna',      ()=>CAIRO_AIN_SOKHNA_PACKAGES],
    ['cairo-aswan-luxor-cruise',()=>CAIRO_ASWAN_LUXOR_CRUISE_PACKAGES],
  ];

  FLAT_MAP.forEach(([dest,getArr])=>{
    if(!published.has(dest)) return;
    const rows = rowsFor(dest);
    let hits=0;
    getArr().forEach(p=>{
      const t=_dbNorm(p.title);
      const row = rows[t+'|'+p.nights] || rows[t];
      if(row){ p.double=row.final_price_jod; p._db=true; hits++; }
    });
    console.info('DB prices applied: '+dest+' ('+hits+' packages)');
  });

  if(published.has('georgia')){
    const rows = rowsFor('georgia');
    let hits=0;
    GEORGIA_PACKAGES.forEach(prog=>{
      (prog.hotels||[]).forEach(h=>{
        const row = rows[_dbNorm(h.name)];
        if(row){ h.d=row.final_price_jod; h._db=true; hits++; }
      });
    });
    console.info('DB prices applied: georgia ('+hits+' hotel rows)');
  }
}

// ════════════════════════════════════════════════════════════════
// FAR EAST PRINT/PDF HELPERS — renders PDF pages as canvases for combined output
// ════════════════════════════════════════════════════════════════
async function feRenderPDF(pdfUrl, container) {
  try {
    if (typeof pdfjsLib==='undefined') { container.innerHTML='<div style="text-align:center;padding:20px"><a href="'+pdfUrl+'" target="_blank" style="color:var(--gold);font-weight:700">📄 Open Itinerary PDF</a></div>'; return; }
    var pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    container.innerHTML = '';
    for (var i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var vp = page.getViewport({scale: 1.5});
      var canvas = document.createElement('canvas');
      canvas.width = vp.width;
      canvas.height = vp.height;
      canvas.style.cssText = 'width:100%;max-width:800px;height:auto;margin:0 auto 10px;display:block;border:1px solid #ddd;border-radius:6px';
      await page.render({canvasContext: canvas.getContext('2d'), viewport: vp}).promise;
      container.appendChild(canvas);
    }
  } catch(e) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--muted)">⚠️ Could not load itinerary. <a href="'+pdfUrl+'" target="_blank" style="color:var(--gold)">Open PDF directly</a></div>';
  }
}
function canvasesToImages(container) {
  var canvases = container.querySelectorAll('canvas');
  canvases.forEach(function(c){
    var img = document.createElement('img');
    img.src = c.toDataURL('image/png');
    img.style.cssText = c.style.cssText;
    c.parentNode.replaceChild(img, c);
  });
}
async function _fePrintAction(id, title, prefix, pkgs, isPdf) {
  var itinTab = document.getElementById(prefix+'-tab-itinerary');
  var origHTML = itinTab ? itinTab.innerHTML : '';
  var pkg = pkgs.find(function(p){return p.id===id;});
  var showFn = window[prefix+'ShowAllTabs'];
  var restoreFn = window[prefix+'RestoreTabs'];
  if (showFn) showFn();
  if (itinTab && pkg && pkg.pdf) {
    itinTab.innerHTML = '<div style="text-align:center;padding:20px;color:var(--muted)">⏳ Loading itinerary pages...</div>';
    await feRenderPDF(pkg.pdf, itinTab);
    canvasesToImages(itinTab);
  }
  setTimeout(function(){
    if (isPdf) PJ.downloadPDF(document.getElementById(prefix+'-print-area-'+id), title);
    else PJ.printElement(document.getElementById(prefix+'-print-area-'+id), title);
    setTimeout(function(){
      if (itinTab) itinTab.innerHTML = origHTML;
      if (restoreFn) restoreFn();
    }, 500);
  }, 200);
}
// ════════════════════════════════════════════════════════════════
// VIETNAM RICH PACKAGE DATA (dashboard-style with PDF itinerary)
// ════════════════════════════════════════════════════════════════
const VIETNAM_PACKAGES = [
  {id:1,title:"Fraser Suites Hanoi + Windham Golden Bay Da Nang + The Five Residences Hanoi",
   arabic:"فريزر سويتس + ويندهام جولدن باي + ذا فايف ريزيدنسز",
   subtitle:"Hanoi (3) → Da Nang (3) → Hanoi (2)",route:"Amman ↔ Hanoi",stars:5,meal:"BB",
   single:443,double:443,room:"Executive Studio / 2BR Corner Suite / 2BR Superior",
   location:"Hanoi - Da Nang",nights:8,pdf:"itineraries/vn/vn_pkg5.pdf"},
  {id:2,title:"Flora Center Hotel + Balcona Da Nang + FV Hotel An Hanoi",
   arabic:"فلورا سنتر + بالكونا دا نانغ + إف في هوتل آن هانوي",
   subtitle:"Hanoi (3) → Da Nang (3) → Hanoi (2)",route:"Amman ↔ Hanoi",stars:4,meal:"BB",
   single:408,double:408,room:"Deluxe x2 / Partial Sea View Deluxe x2 / Deluxe x2",
   location:"Hanoi - Da Nang",nights:8,pdf:"itineraries/vn/vn_pkg6.pdf"},
  {id:3,title:"FV Hotel An Hanoi + Four Points Da Nang + Fusion Villas + Movenpick Le Vinhome",
   arabic:"إف في هانوي + فور بوينتس دا نانغ + فيوجن فيلاز + موفنبيك",
   subtitle:"Luxury Hanoi (2) → Da Nang (4) → Hanoi (2)",route:"Amman ↔ Hanoi",stars:5,meal:"BB",
   single:700,double:700,room:"Studio Deluxe / Panoramic Sea View / Suite with Pool / Deluxe",
   location:"Hanoi - Da Nang",nights:8,pdf:"itineraries/vn/vn_pkg3.pdf"},
  {id:4,title:"FV Hotel An Hanoi + Balcona Da Nang + Windham Garden Hanoi",
   arabic:"إف في هانوي + بالكونا دا نانغ + ويندهام غاردن هانوي",
   subtitle:"Hanoi (3) → Da Nang (3) → Hanoi (2)",route:"Amman ↔ Hanoi",stars:4,meal:"BB",
   single:484,double:484,room:"Deluxe / Partial Sea View Deluxe / Deluxe",
   location:"Hanoi - Da Nang",nights:8,pdf:"itineraries/vn/vn_pkg2.pdf"},
  {id:5,title:"La Siesta Saigon + Wyndham Grand Phu Quoc + Movenpick Villas Phu Quoc + La Villa Saigon",
   arabic:"لا سييستا سايغون + ويندهام غاند فو كوك + موفنبيك فيلا + لا فيلا",
   subtitle:"HCM (2) → Phu Quoc (4) → HCM (2)",route:"Amman ↔ Ho Chi Minh",stars:5,meal:"BB",
   single:700,double:700,room:"Superior / Ocean View / 1BR Villa w Pool / Deluxe",
   location:"HCM - Phu Quoc",nights:8,pdf:"itineraries/vn/vn_pkg4.pdf"},
  {id:6,title:"Park Royal Saigon + Sol Bay Melia Phu Quoc + Melia Vinpearl + Eastin Grand Saigon",
   arabic:"بارك رويال سايغون + سول باي ميليا + ميليا فينبيرل + إيستن غراند",
   subtitle:"HCM (2) → Phu Quoc (4) → HCM (2)",route:"Amman ↔ Ho Chi Minh",stars:4,meal:"BB",
   single:555,double:555,room:"Superior / Ocean View / 1BR Villa / Deluxe",
   location:"HCM - Phu Quoc",nights:8,pdf:"itineraries/vn/vn_pkg1.pdf"}
];
let VN_ACTIVE_ID = null;
let VN_ACTIVE_TAB = 'pricing';
function vnShowDetail(id){
  VN_ACTIVE_ID = VN_ACTIVE_ID===id?null:id;
  VN_ACTIVE_TAB = 'pricing';
  renderDest('vietnam');
}
function vnSwitchTab(t){VN_ACTIVE_TAB=t;vnRenderDetail();}
function vnCloseDetail(){VN_ACTIVE_ID=null;renderDest('vietnam');}
function vnShowAllTabs(){
  ['vn-tab-pricing','vn-tab-itinerary','vn-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function vnRestoreTabs(){
  var t=VN_ACTIVE_TAB;
  ['vn-tab-pricing','vn-tab-itinerary','vn-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='vn-tab-pricing'?t==='pricing':id==='vn-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function vnPrintPkg(id,title){_fePrintAction(id,title,'vn',VIETNAM_PACKAGES,false);}
function vnPdfPkg(id,title){_fePrintAction(id,title,'vn',VIETNAM_PACKAGES,true);}
function vnRenderDetail(){
  var panel = document.getElementById('vn-detail');
  if(!VN_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = VIETNAM_PACKAGES.find(function(x){return x.id===VN_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '★'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel(s) · الفندق</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\'")+'\',destination:\'Vietnam\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">★ All prices in JOD per person · '+p.nights+' nights / '+(p.nights+1)+' days · Route: '+p.route+'</div>';
  var pdfPath = p.pdf;
  var itinHtml = '<div style="text-align:center;padding:10px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:10px;margin-bottom:12px;font-size:12px">📄 <strong>Detailed Itinerary</strong> — click below to view or download</div>'+
    '<iframe src="'+pdfPath+'" style="width:100%;height:600px;border:1px solid var(--border);border-radius:10px;background:#fff" title="Vietnam Itinerary PDF"></iframe>'+
    '<div style="margin-top:10px;text-align:center"><a href="'+pdfPath+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">📥 Download PDF</a></div>';
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Round-trip flights (Amman ↔ Vietnam)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Airport transfers (arrival and departure)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Hotel accommodation for the full duration</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Meals: '+p.meal+' (Breakfast)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Arabic-speaking professional tour guide</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Daily tours in modern AC vehicles</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Attraction entrance fees</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Meals outside the hotel</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional excursions</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Health insurance (recommended before travel)</li>'+
    '</ul>'+
    '<div style="background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:10px;padding:10px;display:flex;align-items:center;gap:8px;font-size:12px">✈️ <span><strong>Visa:</strong> Jordanian passport holders can obtain a visa on arrival or e-visa for Vietnam. Please check requirements before travel.</span></div>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary (PDF)',icon:'📄'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="vn-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="vnPrintPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>'+
        '<button onclick="vnPdfPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>'+
        '<button onclick="vnCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="vnSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(VN_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(VN_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="vn-tab-pricing" style="display:'+(VN_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="vn-tab-itinerary" style="display:'+(VN_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="vn-tab-info" style="display:'+(VN_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}
// ════════════════════════════════════════════════════════════════
// SRI LANKA RICH PACKAGE DATA (dashboard-style with PDF itinerary)
// ════════════════════════════════════════════════════════════════
const SRI_LANKA_PACKAGES = [
  {id:1,title:"Amagi Aria Negombo + Radisson Kandy + Eco Surf Bentota + Granbell Colombo",
   arabic:"أماجي آريا نيغومبو + راديسون كاندي + إيكو سيرف بينتوتا + غرانبيل كولومبو",
   subtitle:"Negombo (1) → Kandy (2) → Bentota (2) → Colombo (2)",route:"Amman ↔ Colombo",stars:4,meal:"BB",
   single:370,double:370,room:"Standard Pool / Deluxe / Superior Sea View / Standard Sea View",
   location:"Negombo - Kandy - Bentota - Colombo",nights:7,pdf:"itineraries/sl/sl_pkg1.pdf"},
  {id:2,title:"Sentido Heritance Negombo + Mahaweli Reach Kandy + Amari Colombo",
   arabic:"سينتيدو هيريتانس نيغومبو + ماهويلي ريتش كاندي + أماري كولومبو",
   subtitle:"Negombo (1) → Kandy (3) → Colombo (3)",route:"Amman ↔ Colombo",stars:5,meal:"BB",
   single:391,double:391,room:"Standard Pool View / Deluxe / Standard City View",
   location:"Negombo - Kandy - Colombo",nights:7,pdf:"itineraries/sl/sl_pkg2.pdf"},
  {id:3,title:"Sentido Heritance Negombo + The Golden Crown Kandy + Thala Bentota + Amari Colombo",
   arabic:"سينتيدو هيريتانس نيغومبو + ذا غولدن كراون كاندي + تالا بينتوتا + أماري كولومبو",
   subtitle:"Negombo (1) → Kandy (2) → Bentota (2) → Colombo (2)",route:"Amman ↔ Colombo",stars:5,meal:"BB",
   single:447,double:447,room:"Deluxe / Deluxe / Standard Sea View / Deluxe City View",
   location:"Negombo - Kandy - Bentota - Colombo",nights:7,pdf:"itineraries/sl/sl_pkg3.pdf"},
  {id:4,title:"Sentido Heritance Negombo + The Golden Crown Kandy + Amari Colombo",
   arabic:"سينتيدو هيريتانس نيغومبو + ذا غولدن كراون كاندي + أماري كولومبو",
   subtitle:"Negombo (1) → Kandy (3) → Colombo (3)",route:"Amman ↔ Colombo",stars:4,meal:"BB",
   single:458,double:458,room:"Standard Pool View / Deluxe / Standard City View",
   location:"Negombo - Kandy - Colombo",nights:7,pdf:"itineraries/sl/sl_pkg4.pdf"}
];
let SL_ACTIVE_ID = null;
let SL_ACTIVE_TAB = 'pricing';
function slShowDetail(id){
  SL_ACTIVE_ID = SL_ACTIVE_ID===id?null:id;
  SL_ACTIVE_TAB = 'pricing';
  renderDest('srilanka');
}
function slSwitchTab(t){SL_ACTIVE_TAB=t;slRenderDetail();}
function slCloseDetail(){SL_ACTIVE_ID=null;renderDest('srilanka');}
function slShowAllTabs(){
  ['sl-tab-pricing','sl-tab-itinerary','sl-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function slRestoreTabs(){
  var t=SL_ACTIVE_TAB;
  ['sl-tab-pricing','sl-tab-itinerary','sl-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='sl-tab-pricing'?t==='pricing':id==='sl-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function slPrintPkg(id,title){_fePrintAction(id,title,'sl',SRI_LANKA_PACKAGES,false);}
function slPdfPkg(id,title){_fePrintAction(id,title,'sl',SRI_LANKA_PACKAGES,true);}
function slRenderDetail(){
  var panel = document.getElementById('sl-detail');
  if(!SL_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = SRI_LANKA_PACKAGES.find(function(x){return x.id===SL_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '★'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel(s) · الفندق</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\'")+'\',destination:\'Sri Lanka\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">★ All prices in JOD per person · '+p.nights+' nights / '+(p.nights+1)+' days · Route: '+p.route+'</div>';
  var pdfPath = p.pdf;
  var itinHtml = '<div style="text-align:center;padding:10px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:10px;margin-bottom:12px;font-size:12px">📄 <strong>Detailed Itinerary</strong> — click below to view or download</div>'+
    '<iframe src="'+pdfPath+'" style="width:100%;height:600px;border:1px solid var(--border);border-radius:10px;background:#fff" title="Sri Lanka Itinerary PDF"></iframe>'+
    '<div style="margin-top:10px;text-align:center"><a href="'+pdfPath+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">📥 Download PDF</a></div>';
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Round-trip flights (Amman ↔ Sri Lanka)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Airport transfers (arrival and departure)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Hotel accommodation for the full duration</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Meals: '+p.meal+' (Breakfast)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Arabic-speaking professional tour guide</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Daily tours in modern AC vehicles</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Attraction entrance fees</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Meals outside the hotel</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional excursions</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Health insurance (recommended before travel)</li>'+
    '</ul>'+
    '<div style="background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:10px;padding:10px;display:flex;align-items:center;gap:8px;font-size:12px">✈️ <span><strong>Visa:</strong> Jordanian passport holders require an ETA (Electronic Travel Authorization) before travel to Sri Lanka. We can assist with the process.</span></div>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary (PDF)',icon:'📄'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="sl-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="slPrintPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>'+
        '<button onclick="slPdfPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>'+
        '<button onclick="slCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="slSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(SL_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(SL_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="sl-tab-pricing" style="display:'+(SL_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="sl-tab-itinerary" style="display:'+(SL_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="sl-tab-info" style="display:'+(SL_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}
// ════════════════════════════════════════════════════════════════
// MALDIVES RICH PACKAGE DATA (dashboard-style with PDF itinerary)
// ════════════════════════════════════════════════════════════════
const MALDIVES_PACKAGES = [
  {id:1,title:"Noi Maldives Resort (Family Overwater)",
   arabic:"نوي مالديفز ريزورت (أوفر ووتر عائلي)",
   subtitle:"Maldives — 4 nights",route:"Amman ↔ Malé",stars:4,meal:"BB",
   single:530,double:530,room:"Overwater Villa Deluxe w Pool",
   location:"Maldives",nights:4,pdf:"itineraries/mv/mv_pkg1.pdf"},
  {id:2,title:"Kandima Maldives Hotel (Family)",
   arabic:"كانديما مالديفز هوتيل (عائلي)",
   subtitle:"Maldives — 4 nights",route:"Amman ↔ Malé",stars:5,meal:"BB",
   single:618,double:618,room:"Studio Sky x2",
   location:"Maldives",nights:4,pdf:"itineraries/mv/mv_pkg2.pdf"},
  {id:3,title:"Fihalhohi Maldives Hotel (Honeymoon Economy)",
   arabic:"فيهالهوهي مالديفز هوتيل (شهر عسل اقتصادي)",
   subtitle:"Maldives — 4 nights",route:"Amman ↔ Malé",stars:4,meal:"BB",
   single:700,double:700,room:"Beach Villa w Pool",
   location:"Maldives",nights:4,pdf:"itineraries/mv/mv_pkg3.pdf"},
  {id:4,title:"Noi Maldives Resort (Honeymoon Luxury)",
   arabic:"نوي مالديفز ريزورت (شهر عسل فاخر)",
   subtitle:"Maldives — 4 nights",route:"Amman ↔ Malé",stars:5,meal:"BB",
   single:726,double:726,room:"Overwater Villa Deluxe w Pool",
   location:"Maldives",nights:4,pdf:"itineraries/mv/mv_pkg4.pdf"}
];
let MV_ACTIVE_ID = null;
let MV_ACTIVE_TAB = 'pricing';
function mvShowDetail(id){
  MV_ACTIVE_ID = MV_ACTIVE_ID===id?null:id;
  MV_ACTIVE_TAB = 'pricing';
  renderDest('maldives');
}
function mvSwitchTab(t){MV_ACTIVE_TAB=t;mvRenderDetail();}
function mvCloseDetail(){MV_ACTIVE_ID=null;renderDest('maldives');}
function mvShowAllTabs(){
  ['mv-tab-pricing','mv-tab-itinerary','mv-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function mvRestoreTabs(){
  var t=MV_ACTIVE_TAB;
  ['mv-tab-pricing','mv-tab-itinerary','mv-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='mv-tab-pricing'?t==='pricing':id==='mv-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function mvPrintPkg(id,title){_fePrintAction(id,title,'mv',MALDIVES_PACKAGES,false);}
function mvPdfPkg(id,title){_fePrintAction(id,title,'mv',MALDIVES_PACKAGES,true);}
function mvRenderDetail(){
  var panel = document.getElementById('mv-detail');
  if(!MV_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = MALDIVES_PACKAGES.find(function(x){return x.id===MV_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '★'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel(s) · الفندق</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\'")+'\',destination:\'Maldives\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">★ All prices in JOD per person · '+p.nights+' nights / '+(p.nights+1)+' days · Route: '+p.route+'</div>';
  var pdfPath = p.pdf;
  var itinHtml = '<div style="text-align:center;padding:10px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:10px;margin-bottom:12px;font-size:12px">📄 <strong>Detailed Itinerary</strong> — click below to view or download</div>'+
    '<iframe src="'+pdfPath+'" style="width:100%;height:600px;border:1px solid var(--border);border-radius:10px;background:#fff" title="Maldives Itinerary PDF"></iframe>'+
    '<div style="margin-top:10px;text-align:center"><a href="'+pdfPath+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">📥 Download PDF</a></div>';
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Round-trip flights (Amman ↔ Maldives)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Airport transfers (arrival and departure)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Hotel accommodation for the full duration</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Meals: '+p.meal+' (Breakfast)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Arabic-speaking professional tour guide</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Daily tours in modern AC vehicles</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Attraction entrance fees</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Meals outside the hotel</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional excursions</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Health insurance (recommended before travel)</li>'+
    '</ul>'+
    '<div style="background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:10px;padding:10px;display:flex;align-items:center;gap:8px;font-size:12px">✈️ <span><strong>Visa:</strong> Jordanian passport holders receive a free 30-day visa on arrival in the Maldives.</span></div>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary (PDF)',icon:'📄'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="mv-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="mvPrintPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>'+
        '<button onclick="mvPdfPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>'+
        '<button onclick="mvCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="mvSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(MV_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(MV_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="mv-tab-pricing" style="display:'+(MV_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="mv-tab-itinerary" style="display:'+(MV_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="mv-tab-info" style="display:'+(MV_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}
// ════════════════════════════════════════════════════════════════
// THAILAND RICH PACKAGE DATA (dashboard-style with PDF itinerary)
// ════════════════════════════════════════════════════════════════
const THAILAND_PACKAGES = [
  {id:1,title:"Marina Gallery Resort Kasha + Soliitaire Bangkok Sukhumvit 11",
   arabic:"مارينا غاليري ريزورت كاشا + سوليتير بانكوك سوكومفيت 11",
   subtitle:"Phuket → Bangkok",route:"Amman ↔ Bangkok",stars:4,meal:"BB",
   single:324,double:324,room:"Deluxe x2",
   location:"Phuket - Bangkok",nights:7,pdf:"itineraries/th/th_pkg1.pdf"},
  {id:2,title:"The Senses Resort + Movenpick Sukhumvit 15",
   arabic:"ذا سينسز ريزورت + موفنبيك سوكومفيت 15",
   subtitle:"Phuket → Bangkok",route:"Amman ↔ Bangkok",stars:5,meal:"BB",
   single:371,double:371,room:"Deluxe Sea View / Superior",
   location:"Phuket - Bangkok",nights:7,pdf:"itineraries/th/th_pkg2.pdf"},
  {id:3,title:"Marina Gallery Resort + Malabar Villa + Soliitaire Bangkok",
   arabic:"مارينا غاليري ريزورت + مالابار فيلا + سوليتير بانكوك",
   subtitle:"Phuket → Bangkok",route:"Amman ↔ Bangkok",stars:4,meal:"BB",
   single:407,double:407,room:"Deluxe / Villa / Superior",
   location:"Phuket - Bangkok",nights:7,pdf:"itineraries/th/th_pkg3.pdf"},
  {id:4,title:"Wyndham Grand Phuket + Laqari Sinai + Avani Bangkok",
   arabic:"ويندهام غراند فوكيت + لاكاري سيناي + أفاني بانكوك",
   subtitle:"Phuket → Bangkok",route:"Amman ↔ Bangkok",stars:5,meal:"BB",
   single:555,double:555,room:"Deluxe Sea View / Premier Plus",
   location:"Phuket - Bangkok",nights:7,pdf:"itineraries/th/th_pkg4.pdf"},
  {id:5,title:"Movenpick Sukhumvit 15 + The Senses Resort + Barceló Coconut + Avani Bangkok",
   arabic:"موفنبيك سوكومفيت 15 + ذا سينسز ريزورت + برشلونة كوكونت + أفاني بانكوك",
   subtitle:"Bangkok → Phuket → Bangkok",route:"Amman ↔ Bangkok",stars:5,meal:"BB",
   single:480,double:480,room:"Superior / Deluxe / Premier Plus",
   location:"Bangkok - Phuket",nights:8,pdf:"itineraries/th/th_pkg5.pdf"},
  {id:6,title:"Al-Meerath Hotel + Marina Gallery + Malabar Villa + Soliitaire Bangkok",
   arabic:"الميرات هوتيل + مارينا غاليري + مالابار فيلا + سوليتير بانكوك",
   subtitle:"Bangkok → Phuket → Bangkok",route:"Amman ↔ Bangkok",stars:4,meal:"BB",
   single:513,double:513,room:"Superior / Deluxe / Grand Superior",
   location:"Bangkok - Phuket",nights:8,pdf:"itineraries/th/th_pkg6.pdf"},
  {id:7,title:"Movenpick Sukhumvit 15 + Crest Resort + Laqari Sinai + Avani Bangkok",
   arabic:"موفنبيك سوكومفيت 15 + كريست ريزورت + لاكاري سيناي + أفاني بانكوك",
   subtitle:"Bangkok → Phuket → Bangkok",route:"Amman ↔ Bangkok",stars:5,meal:"BB",
   single:664,double:664,room:"Luxury Honeymoon",
   location:"Bangkok - Phuket",nights:8,pdf:"itineraries/th/th_pkg7.pdf"}
];
let TH_ACTIVE_ID = null;
let TH_ACTIVE_TAB = 'pricing';
function thShowDetail(id){
  TH_ACTIVE_ID = TH_ACTIVE_ID===id?null:id;
  TH_ACTIVE_TAB = 'pricing';
  renderDest('thailand');
}
function thSwitchTab(t){TH_ACTIVE_TAB=t;thRenderDetail();}
function thCloseDetail(){TH_ACTIVE_ID=null;renderDest('thailand');}
function thShowAllTabs(){
  ['th-tab-pricing','th-tab-itinerary','th-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function thRestoreTabs(){
  var t=TH_ACTIVE_TAB;
  ['th-tab-pricing','th-tab-itinerary','th-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='th-tab-pricing'?t==='pricing':id==='th-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function thPrintPkg(id,title){_fePrintAction(id,title,'th',THAILAND_PACKAGES,false);}
function thPdfPkg(id,title){_fePrintAction(id,title,'th',THAILAND_PACKAGES,true);}
function thRenderDetail(){
  var panel = document.getElementById('th-detail');
  if(!TH_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = THAILAND_PACKAGES.find(function(x){return x.id===TH_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '★'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel(s) · الفندق</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\'")+'\',destination:\'Thailand\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">★ All prices in JOD per person · '+p.nights+' nights / '+(p.nights+1)+' days · Route: '+p.route+'</div>';
  var pdfPath = p.pdf;
  var itinHtml = '<div style="text-align:center;padding:10px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:10px;margin-bottom:12px;font-size:12px">📄 <strong>Detailed Itinerary</strong> — click below to view or download</div>'+
    '<iframe src="'+pdfPath+'" style="width:100%;height:600px;border:1px solid var(--border);border-radius:10px;background:#fff" title="Thailand Itinerary PDF"></iframe>'+
    '<div style="margin-top:10px;text-align:center"><a href="'+pdfPath+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">📥 Download PDF</a></div>';
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Round-trip flights (Amman ↔ Thailand)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Airport transfers (arrival and departure)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Hotel accommodation for the full duration</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Meals: '+p.meal+' (Breakfast)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Arabic-speaking professional tour guide</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Daily tours in modern AC vehicles</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Attraction entrance fees</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Meals outside the hotel</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional excursions</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Health insurance (recommended before travel)</li>'+
    '</ul>'+
    '<div style="background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:10px;padding:10px;display:flex;align-items:center;gap:8px;font-size:12px">✈️ <span><strong>Visa:</strong> Jordanian passport holders can obtain a visa on arrival in Thailand (30 days). Please check requirements before travel.</span></div>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary (PDF)',icon:'📄'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="th-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="thPrintPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>'+
        '<button onclick="thPdfPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>'+
        '<button onclick="thCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="thSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(TH_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(TH_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="th-tab-pricing" style="display:'+(TH_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="th-tab-itinerary" style="display:'+(TH_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="th-tab-info" style="display:'+(TH_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}
// ════════════════════════════════════════════════════════════════
// SINGAPORE RICH PACKAGE DATA (dashboard-style with PDF itinerary)
// ════════════════════════════════════════════════════════════════
const SINGAPORE_PACKAGES = [
  {id:1,title:"Holiday Inn Express Singapore Katong (Family)",
   arabic:"هوليداي إن إكسبرس سنغافورة كاتونغ (عائلي)",
   subtitle:"Singapore — 4 nights",route:"Amman ↔ Singapore",stars:4,meal:"BB",
   single:405,double:405,room:"Standard",
   location:"Singapore",nights:4,pdf:"itineraries/sg/sg_pkg1.pdf"},
  {id:2,title:"One Farrer Hotel (Family)",
   arabic:"ون فارير هوتيل (عائلي)",
   subtitle:"Singapore — 4 nights",route:"Amman ↔ Singapore",stars:5,meal:"BB",
   single:494,double:494,room:"Mint Room x2",
   location:"Singapore",nights:4,pdf:"itineraries/sg/sg_pkg2.pdf"},
  {id:3,title:"One Farrer Hotel (Honeymoon)",
   arabic:"ون فارير هوتيل (شهر عسل)",
   subtitle:"Singapore — 4 nights",route:"Amman ↔ Singapore",stars:5,meal:"BB",
   single:494,double:494,room:"Mint Room",
   location:"Singapore",nights:4,pdf:"itineraries/sg/sg_pkg3.pdf"},
  {id:4,title:"Holiday Inn Express Singapore Katong (Honeymoon)",
   arabic:"هوليداي إن إكسبرس سنغافورة كاتونغ (شهر عسل)",
   subtitle:"Singapore — 5 nights",route:"Amman ↔ Singapore",stars:4,meal:"BB",
   single:675,double:675,room:"Standard",
   location:"Singapore",nights:5,pdf:"itineraries/sg/sg_pkg4.pdf"}
];
let SG_ACTIVE_ID = null;
let SG_ACTIVE_TAB = 'pricing';
function sgShowDetail(id){
  SG_ACTIVE_ID = SG_ACTIVE_ID===id?null:id;
  SG_ACTIVE_TAB = 'pricing';
  renderDest('singapore');
}
function sgSwitchTab(t){SG_ACTIVE_TAB=t;sgRenderDetail();}
function sgCloseDetail(){SG_ACTIVE_ID=null;renderDest('singapore');}
function sgShowAllTabs(){
  ['sg-tab-pricing','sg-tab-itinerary','sg-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function sgRestoreTabs(){
  var t=SG_ACTIVE_TAB;
  ['sg-tab-pricing','sg-tab-itinerary','sg-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='sg-tab-pricing'?t==='pricing':id==='sg-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function sgPrintPkg(id,title){_fePrintAction(id,title,'sg',SINGAPORE_PACKAGES,false);}
function sgPdfPkg(id,title){_fePrintAction(id,title,'sg',SINGAPORE_PACKAGES,true);}
function sgRenderDetail(){
  var panel = document.getElementById('sg-detail');
  if(!SG_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = SINGAPORE_PACKAGES.find(function(x){return x.id===SG_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '★'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel(s) · الفندق</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\'")+'\',destination:\'Singapore\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">★ All prices in JOD per person · '+p.nights+' nights / '+(p.nights+1)+' days · Route: '+p.route+'</div>';
  var pdfPath = p.pdf;
  var itinHtml = '<div style="text-align:center;padding:10px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:10px;margin-bottom:12px;font-size:12px">📄 <strong>Detailed Itinerary</strong> — click below to view or download</div>'+
    '<iframe src="'+pdfPath+'" style="width:100%;height:600px;border:1px solid var(--border);border-radius:10px;background:#fff" title="Singapore Itinerary PDF"></iframe>'+
    '<div style="margin-top:10px;text-align:center"><a href="'+pdfPath+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">📥 Download PDF</a></div>';
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Round-trip flights (Amman ↔ Singapore)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Airport transfers (arrival and departure)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Hotel accommodation for the full duration</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Meals: '+p.meal+' (Breakfast)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Arabic-speaking professional tour guide</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Daily tours in modern AC vehicles</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Attraction entrance fees</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Meals outside the hotel</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional excursions</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Health insurance (recommended before travel)</li>'+
    '</ul>'+
    '<div style="background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:10px;padding:10px;display:flex;align-items:center;gap:8px;font-size:12px">✈️ <span><strong>Visa:</strong> Jordanian passport holders require a visa for Singapore. We can assist with the application process.</span></div>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary (PDF)',icon:'📄'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="sg-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="sgPrintPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>'+
        '<button onclick="sgPdfPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>'+
        '<button onclick="sgCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="sgSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(SG_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(SG_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="sg-tab-pricing" style="display:'+(SG_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="sg-tab-itinerary" style="display:'+(SG_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="sg-tab-info" style="display:'+(SG_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}
// ════════════════════════════════════════════════════════════════
// MALAYSIA RICH PACKAGE DATA (dashboard-style with PDF itinerary)
// ════════════════════════════════════════════════════════════════
const MALAYSIA_PACKAGES = [
  {id:1,title:"Snow-Y Pyramid Hotel + Phyto Bay Langkawi + Royal Signature KL",
   arabic:"سنو-واي بيراميد هوتيل + فيتو باي لنكاوي + رويال سيغنيتشر كوالالمبور",
   subtitle:"Selangor → Langkawi → KL",route:"Amman ↔ Kuala Lumpur",stars:4,meal:"BB",
   single:404,double:404,room:"2 Deluxe Plus / Premier Sea-view / Deluxe",
   location:"Selangor - Langkawi - KL",nights:7,pdf:"itineraries/my/my_pkg1.pdf"},
  {id:2,title:"Snow-Y Pyramid Hotel + Ritz-Carlton Langkawi + Imperial Lex KL (Family)",
   arabic:"سنو-واي بيراميد + ريتز كارلتون لنكاوي + إمبريال لكس كوالالمبور (عائلي)",
   subtitle:"Selangor → Langkawi → KL",route:"Amman ↔ Kuala Lumpur",stars:5,meal:"BB",
   single:450,double:450,room:"2 Deluxe / Family Suite / Apartment",
   location:"Selangor - Langkawi - KL",nights:7,pdf:"itineraries/my/my_pkg2.pdf"},
  {id:3,title:"Sun Way Lagoon Hotel + Ritz-Carlton Langkawi + Imperial Lex KL",
   arabic:"صن واي لاغون هوتيل + ريتز كارلتون لنكاوي + إمبريال لكس كوالالمبور",
   subtitle:"Selangor → Langkawi → KL",route:"Amman ↔ Kuala Lumpur",stars:5,meal:"BB",
   single:636,double:636,room:"Deluxe Plus / Studio Sea-view / Executive",
   location:"Selangor - Langkawi - KL",nights:7,pdf:"itineraries/my/my_pkg3.pdf"},
  {id:4,title:"Stripes Hotel KL + Westin Spa Langkawi + Pullman KL",
   arabic:"سترايبس هوتيل كوالالمبور + ويستن سبا لنكاوي + بولمان كوالالمبور",
   subtitle:"KL → Langkawi → KL",route:"Amman ↔ Kuala Lumpur",stars:5,meal:"BB",
   single:847,double:847,room:"Deluxe Plus / Sea-view Villa / Deluxe",
   location:"KL - Langkawi - KL",nights:7,pdf:"itineraries/my/my_pkg4.pdf"},
  {id:5,title:"Snow-Y Pyramid Hotel + Aloft Langkawi + Capri Bay Frazer KL",
   arabic:"سنو-واي بيراميد + ألوفت لنكاوي + كابري باي فرايزر كوالالمبور",
   subtitle:"Selangor → Langkawi → KL",route:"Amman ↔ Kuala Lumpur",stars:4,meal:"BB",
   single:560,double:560,room:"Deluxe / Sea-view / Executive Studio",
   location:"Selangor - Langkawi - KL",nights:8,pdf:"itineraries/my/my_pkg5.pdf"},
  {id:6,title:"Sun Way Resort Selangor + Ritz-Carlton Langkawi + Pullman KL (Family)",
   arabic:"صن واي ريزورت سيلانغور + ريتز كارلتون لنكاوي + بولمان كوالالمبور (عائلي)",
   subtitle:"Selangor → Langkawi → KL",route:"Amman ↔ Kuala Lumpur",stars:5,meal:"BB",
   single:562,double:562,room:"2 Deluxe / Family Suite / 2-Suite",
   location:"Selangor - Langkawi - KL",nights:8,pdf:"itineraries/my/my_pkg6.pdf"},
  {id:7,title:"Sun Way Resort Selangor + Ritz-Carlton Langkawi + Imperial Lex KL",
   arabic:"صن واي ريزورت سيلانغور + ريتز كارلتون لنكاوي + إمبريال لكس كوالالمبور",
   subtitle:"Selangor → Langkawi → KL",route:"Amman ↔ Kuala Lumpur",stars:5,meal:"BB",
   single:758,double:758,room:"Deluxe / Studio Sea-view / Executive",
   location:"Selangor - Langkawi - KL",nights:8,pdf:"itineraries/my/my_pkg7.pdf"},
  {id:8,title:"Sun Way Resort Selangor + Westin Spa Langkawi + Pullman KL",
   arabic:"صن واي ريزورت سيلانغور + ويستن سبا لنكاوي + بولمان كوالالمبور",
   subtitle:"Selangor → Langkawi → KL",route:"Amman ↔ Kuala Lumpur",stars:5,meal:"BB",
   single:859,double:859,room:"Deluxe / Sea-view Villa / Deluxe",
   location:"Selangor - Langkawi - KL",nights:8,pdf:"itineraries/my/my_pkg8.pdf"}
];
let MY_ACTIVE_ID = null;
let MY_ACTIVE_TAB = 'pricing';
function myShowDetail(id){
  MY_ACTIVE_ID = MY_ACTIVE_ID===id?null:id;
  MY_ACTIVE_TAB = 'pricing';
  renderDest('malaysia');
}
function mySwitchTab(t){MY_ACTIVE_TAB=t;myRenderDetail();}
function myCloseDetail(){MY_ACTIVE_ID=null;renderDest('malaysia');}
function myShowAllTabs(){
  ['my-tab-pricing','my-tab-itinerary','my-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function myRestoreTabs(){
  var t=MY_ACTIVE_TAB;
  ['my-tab-pricing','my-tab-itinerary','my-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='my-tab-pricing'?t==='pricing':id==='my-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function myPrintPkg(id,title){_fePrintAction(id,title,'my',MALAYSIA_PACKAGES,false);}
function myPdfPkg(id,title){_fePrintAction(id,title,'my',MALAYSIA_PACKAGES,true);}
function myRenderDetail(){
  var panel = document.getElementById('my-detail');
  if(!MY_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = MALAYSIA_PACKAGES.find(function(x){return x.id===MY_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '★'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel(s) · الفندق</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\'")+'\',destination:\'Malaysia\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">★ All prices in JOD per person · '+p.nights+' nights / '+(p.nights+1)+' days · Route: '+p.route+'</div>';
  var pdfPath = p.pdf;
  var itinHtml = '<div style="text-align:center;padding:10px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:10px;margin-bottom:12px;font-size:12px">📄 <strong>Detailed Itinerary</strong> — click below to view or download</div>'+
    '<iframe src="'+pdfPath+'" style="width:100%;height:600px;border:1px solid var(--border);border-radius:10px;background:#fff" title="Malaysia Itinerary PDF"></iframe>'+
    '<div style="margin-top:10px;text-align:center"><a href="'+pdfPath+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">📥 Download PDF</a></div>';
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Round-trip flights (Amman ↔ Malaysia)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Airport transfers (arrival and departure)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Hotel accommodation for the full duration</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Meals: '+p.meal+' (Breakfast)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Arabic-speaking professional tour guide</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Daily tours in modern AC vehicles</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Attraction entrance fees</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Meals outside the hotel</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional excursions</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Health insurance (recommended before travel)</li>'+
    '</ul>'+
    '<div style="background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:10px;padding:10px;display:flex;align-items:center;gap:8px;font-size:12px">✈️ <span><strong>Visa:</strong> Jordanian passport holders can enter Malaysia visa-free for up to 30 days.</span></div>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary (PDF)',icon:'📄'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="my-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="myPrintPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>'+
        '<button onclick="myPdfPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>'+
        '<button onclick="myCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="mySwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(MY_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(MY_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="my-tab-pricing" style="display:'+(MY_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="my-tab-itinerary" style="display:'+(MY_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="my-tab-info" style="display:'+(MY_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}
// ════════════════════════════════════════════════════════════════
// BALI RICH PACKAGE DATA (dashboard-style with PDF itinerary)
// ════════════════════════════════════════════════════════════════
const BALI_PACKAGES = [
  {id:1,title:"Bintang Bali Resort + Komaneka at Keramas Beach",
   arabic:"بينتانج بالي ريزورت + كومانيكا في كيراماس بيتش",
   subtitle:"Bali — 7 nights",route:"Amman ↔ Bali",stars:4,meal:"BB",
   single:225,double:225,room:"Special 2BR / Deluxe",
   location:"Bali Island",nights:7,pdf:"itineraries/bi/bi_pkg1.pdf"},
  {id:2,title:"Discovery Kartika Plaza Kuta + Monteigo Seminyak Resort",
   arabic:"ديسكفري كارتيكا بلازا كوتا + مونتيغو سيمينياك ريزورت",
   subtitle:"Bali — 7 nights",route:"Amman ↔ Bali",stars:5,meal:"BB",
   single:277,double:277,room:"Deluxe",
   location:"Bali Island",nights:7,pdf:"itineraries/bi/bi_pkg2.pdf"},
  {id:3,title:"Aryaduta Bali + Monoloco Seminyak Bay",
   arabic:"أريادوتا بالي + مونولوكو سيمينياك باي",
   subtitle:"Bali — 7 nights",route:"Amman ↔ Bali",stars:4,meal:"BB",
   single:311,double:311,room:"Superior / Villa 1BR",
   location:"Bali Island",nights:7,pdf:"itineraries/bi/bi_pkg3.pdf"},
  {id:4,title:"Bali Beach Hotel Sanur + Komaneka at Keramas Beach",
   arabic:"بالي بيتش هوتيل سانور + كومانيكا في كيراماس بيتش",
   subtitle:"Bali — 7 nights",route:"Amman ↔ Bali",stars:5,meal:"BB",
   single:540,double:540,room:"Deluxe Sea View / Villa",
   location:"Bali Island",nights:7,pdf:"itineraries/bi/bi_pkg4.pdf"},
  {id:5,title:"Rama Beach Villas & Resort + Aloft Bali Seminyak",
   arabic:"راما بيتش فيلاز آند ريزورت + ألوفت بالي سيمينياك",
   subtitle:"Bali — 8 nights",route:"Amman ↔ Bali",stars:5,meal:"BB",
   single:313,double:313,room:"Deluxe / Aloft Room",
   location:"Bali Island",nights:8,pdf:"itineraries/bi/bi_pkg5.pdf"},
  {id:6,title:"Pesona Alam Bonchak + Rama Beach Villas + Novotel Jakarta Cikini",
   arabic:"بيسونا ألام بونشاك + راما بيتش فيلاز + نوفوتيل جاكرتا سيكيني",
   subtitle:"Bonchak → Bali → Jakarta",route:"Amman ↔ Jakarta",stars:4,meal:"BB",
   single:483,double:483,room:"Multi-City Family",
   location:"Bonchak - Bali - Jakarta",nights:8,pdf:"itineraries/bi/bi_pkg6.pdf"},
  {id:7,title:"Pesona Alam Bonchak + Trabi Bali Kuta + Villas Vaspa Tandia + Novotel Jakarta",
   arabic:"بيسونا ألام بونشاك + ترابي بالي كوتا + فيلاس فاسبا تانديا + نوفوتيل جاكرتا",
   subtitle:"Bonchak → Bali → Jakarta",route:"Amman ↔ Jakarta",stars:4,meal:"BB",
   single:535,double:535,room:"Multi-City",
   location:"Bonchak - Bali - Jakarta",nights:8,pdf:"itineraries/bi/bi_pkg7.pdf"},
  {id:8,title:"Le Eminence Bonchak + Discovery Kartika + Waka Gangga + Windham Casablanca Jakarta",
   arabic:"لو إيميننس بونشاك + ديسكفري كارتيكا + واكانغا + ويندهام كازابلانكا جاكرتا",
   subtitle:"Bonchak → Bali → Jakarta",route:"Amman ↔ Jakarta",stars:5,meal:"BB",
   single:641,double:641,room:"Multi-City Luxury",
   location:"Bonchak - Bali - Jakarta",nights:8,pdf:"itineraries/bi/bi_pkg8.pdf"}
];
let BI_ACTIVE_ID = null;
let BI_ACTIVE_TAB = 'pricing';
function biShowDetail(id){
  BI_ACTIVE_ID = BI_ACTIVE_ID===id?null:id;
  BI_ACTIVE_TAB = 'pricing';
  renderDest('bali');
}
function biSwitchTab(t){BI_ACTIVE_TAB=t;biRenderDetail();}
function biCloseDetail(){BI_ACTIVE_ID=null;renderDest('bali');}
function biShowAllTabs(){
  ['bi-tab-pricing','bi-tab-itinerary','bi-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function biRestoreTabs(){
  var t=BI_ACTIVE_TAB;
  ['bi-tab-pricing','bi-tab-itinerary','bi-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='bi-tab-pricing'?t==='pricing':id==='bi-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function biPrintPkg(id,title){_fePrintAction(id,title,'bi',BALI_PACKAGES,false);}
function biPdfPkg(id,title){_fePrintAction(id,title,'bi',BALI_PACKAGES,true);}
function biRenderDetail(){
  var panel = document.getElementById('bi-detail');
  if(!BI_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = BALI_PACKAGES.find(function(x){return x.id===BI_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '★'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel(s) · الفندق</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\'")+'\',destination:\'Bali\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">★ All prices in JOD per person · '+p.nights+' nights / '+(p.nights+1)+' days · Route: '+p.route+'</div>';
  var pdfPath = p.pdf;
  var itinHtml = '<div style="text-align:center;padding:10px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:10px;margin-bottom:12px;font-size:12px">📄 <strong>Detailed Itinerary</strong> — click below to view or download</div>'+
    '<iframe src="'+pdfPath+'" style="width:100%;height:600px;border:1px solid var(--border);border-radius:10px;background:#fff" title="Bali Itinerary PDF"></iframe>'+
    '<div style="margin-top:10px;text-align:center"><a href="'+pdfPath+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);color:#fff;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700">📥 Download PDF</a></div>';
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Round-trip flights (Amman ↔ Indonesia)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Airport transfers (arrival and departure)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Hotel accommodation for the full duration</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Meals: '+p.meal+' (Breakfast)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Arabic-speaking professional tour guide</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Daily tours in modern AC vehicles</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Attraction entrance fees</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Meals outside the hotel</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional excursions</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Health insurance (recommended before travel)</li>'+
    '</ul>'+
    '<div style="background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:10px;padding:10px;display:flex;align-items:center;gap:8px;font-size:12px">✈️ <span><strong>Visa:</strong> Jordanian passport holders can obtain a visa on arrival in Indonesia (30 days).</span></div>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary (PDF)',icon:'📄'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="bi-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="biPrintPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>'+
        '<button onclick="biPdfPkg('+vId+',\''+p.title.replace(/'/g,"\'")+' - '+p.arabic+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>'+
        '<button onclick="biCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="biSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(BI_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(BI_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="bi-tab-pricing" style="display:'+(BI_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="bi-tab-itinerary" style="display:'+(BI_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="bi-tab-info" style="display:'+(BI_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}
let GE_ACTIVE_ID = null;
let GE_ACTIVE_TAB = 'pricing';
function geToggleDay(btn){btn.nextElementSibling.classList.toggle('open');btn.querySelector('.ge-chevron').classList.toggle('open');}
function geShowDetail(id){
  GE_ACTIVE_ID = GE_ACTIVE_ID===id?null:id;
  GE_ACTIVE_TAB = 'pricing';
  renderDest('georgia');
}
function geSwitchTab(t){GE_ACTIVE_TAB=t;geRenderDetail();}
function geCloseDetail(){GE_ACTIVE_ID=null;renderDest('georgia');}
function geShowAllTabs(){
  var p=document.getElementById('ge-tab-pricing');if(p)p.style.display='block';
  var i=document.getElementById('ge-tab-itinerary');if(i)i.style.display='block';
  var n=document.getElementById('ge-tab-info');if(n)n.style.display='block';
}
function geRestoreTabs(){
  var t=GE_ACTIVE_TAB;
  document.getElementById('ge-tab-pricing').style.display=t==='pricing'?'block':'none';
  document.getElementById('ge-tab-itinerary').style.display=t==='itinerary'?'block':'none';
  document.getElementById('ge-tab-info').style.display=t==='info'?'block':'none';
}
function gePrintPkg(id,title){
  geShowAllTabs();
  setTimeout(function(){
    PJ.printElement(document.getElementById('ge-print-area-'+id),title);
    setTimeout(geRestoreTabs,200);
  },50);
}
function gePdfPkg(id,title){
  geShowAllTabs();
  setTimeout(function(){
    PJ.downloadPDF(document.getElementById('ge-print-area-'+id),title);
    setTimeout(geRestoreTabs,200);
  },50);
}
function geRenderDetail(){
  const panel = document.getElementById('ge-detail');
  if(!GE_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  const p = GEORGIA_PACKAGES.find(x=>x.id===GE_ACTIVE_ID);
  const fmt = v => (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';
  const starsStr = s => '★'.repeat(s);
  function mealClass(m){
    if(m==='No Breakfast')return 'ge-no-meal';
    if(m.includes('+'))return 'ge-full-meal';
    return '';
  }
  const pricingHtml = `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">
    <thead><tr>
      <th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel(s) · الفندق</th>
      <th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>
      <th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>
      <th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>
      <th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>
      <th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Child 6-11</th>
      <th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Child 2-5</th>
      <th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>
    </tr></thead>
    <tbody>
      ${p.hotels.map(h=>`<tr>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">${h.name}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">${starsStr(h.stars)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="font-size:10px;padding:2px 8px;border-radius:4px;display:inline-block;${h.meal==='No Breakfast'?'background:rgba(231,76,60,.15);color:#e74c3c':h.meal.includes('Dinner')?'background:rgba(201,168,76,.15);color:var(--gold)':'background:rgba(39,174,96,.15);color:var(--green)'}">${h.meal}</span></td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">${fmt(h.d)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">${fmt(h.s)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border)">${fmt(h.c6)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border)">${fmt(h.c2)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:'package',name:'${p.title} - ${h.name.replace(/'/g,"\'")}',destination:'Georgia',nights:7,price:'${h.d}'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>
      </tr>`).join('')}
    </tbody>
  </table></div>
  <div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">
    ★ Infant (0-1.99 yrs): ${fmt(110)} &nbsp;|&nbsp; Optional excursions paid directly to DMC on-site &nbsp;|&nbsp; All prices JOD per person
  </div>`;
  const itinHtml = p.itinerary.map(d=>`
    <div style="border:1px solid var(--border);border-radius:10px;margin-bottom:6px;overflow:hidden">
      <div onclick="geToggleDay(this)" style="display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;background:var(--card2);font-size:12px">
        <span style="background:var(--gold);color:#fff;border-radius:6px;padding:2px 6px;font-weight:700;font-size:10px">${d.day}</span>
        <span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 6px;border-radius:4px;font-size:9px">✓</span>
        <span style="flex:1;font-weight:600;font-size:12px">${d.title}</span>
        <span style="color:var(--muted);font-size:10px">📍 ${d.loc}</span>
        <span class="ge-chevron" style="transition:transform .2s;font-size:10px">▼</span>
      </div>
      <div style="padding:0 12px 12px;font-size:12px;line-height:1.6;color:var(--text);display:none">${d.desc}</div>
    </div>`).join('');
  const infoHtml = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">
    <div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">
      <div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>
      <div style="font-weight:700;font-size:13px">8 days / 7 nights</div>
    </div>
    <div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">
      <div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>
      <div style="font-weight:700;font-size:12px">${p.route}</div>
    </div>
    <div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">
      <div style="font-size:10px;color:var(--muted);margin-bottom:4px">Departure Dates</div>
      <div style="font-weight:700;font-size:12px">${p.dates}</div>
    </div>
    <div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">
      <div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>
      <div style="font-weight:700;font-size:11px;line-height:1.4">${p.accom}</div>
    </div>
  </div>
  <div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">Flying Days</div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">${p.flyDays.map(d=>`<span style="background:rgba(201,168,76,.15);color:var(--gold);padding:3px 10px;border-radius:6px;font-size:11px;border:1px solid rgba(201,168,76,.3)">${d}</span>`).join('')}</div>
  <div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What's Included</div>
  <ul style="list-style:none;padding:0;margin:0 0 14px">
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Round-trip flights (Amman ↔ destination)</li>
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Airport transfers (arrival and departure)</li>
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Hotel accommodation for the full duration</li>
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Meals as specified per hotel option</li>
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Arabic-speaking professional tour guide</li>
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Daily tours 10:00 am – 7:00 pm in modern AC buses</li>
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ 30+ tourist sites inside and outside cities</li>
    ${p.id===7?'<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Internal flight Batumi ↔ Sochi, Russia (45 min)</li>':''}
  </ul>
  <div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>
  <ul style="list-style:none;padding:0;margin:0 0 14px">
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Attraction entrance fees</li>
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Meals outside the hotel</li>
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional excursions (paid directly to DMC on-site)</li>
    <li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Health insurance (mandatory before travel)</li>
  </ul>
  ${p.visaNote?`<div style="background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:10px;padding:10px;display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:8px">🛡️ <span>${p.visaNote}</span></div>`:''}
  <div style="background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:10px;padding:10px;display:flex;align-items:center;gap:8px;font-size:12px">🚗 Private sedan car available upon request — add ${fmt(400)} to program price per group.</div>`;
  const tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary (Day by Day)',icon:'📅'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  const gId = p.id;
  panel.innerHTML = `<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="ge-print-area-${gId}">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">
      <div>
        <div style="font-size:10px;color:var(--muted)">Program ${p.id}</div>
        <div style="font-size:17px;font-weight:800">${p.title}</div>
        <div style="font-size:13px;color:var(--gold)">${p.arabic}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">${p.subtitle}</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button onclick="gePrintPkg(${gId},'${p.title} - ${p.arabic}')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>
        <button onclick="gePdfPkg(${gId},'${p.title} - ${p.arabic}')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>
        <button onclick="geCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>
      </div>
    </div>
    <div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">
      ${tabBtns.map(t=>`<button onclick="geSwitchTab('${t.id}')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:${GE_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)'};border-bottom:2px solid ${GE_ACTIVE_TAB===t.id?'var(--gold)':'transparent'};transition:all .2s">${t.icon} ${t.label}</button>`).join('')}
    </div>
    <div style="padding:18px">
      <div class="ge-tab-c" id="ge-tab-pricing" style="display:${GE_ACTIVE_TAB==='pricing'?'block':'none'}">${pricingHtml}</div>
      <div class="ge-tab-c" id="ge-tab-itinerary" style="display:${GE_ACTIVE_TAB==='itinerary'?'block':'none'}">${itinHtml}</div>
      <div class="ge-tab-c" id="ge-tab-info" style="display:${GE_ACTIVE_TAB==='info'?'block':'none'}">${infoHtml}</div>
    </div>
  </div>`;
}

// ════════════════════════════════════════════════════════════════
// KOSOVO HELPERS
// ════════════════════════════════════════════════════════════════
let KS_ACTIVE_ID = null;
let KS_ACTIVE_TAB = 'pricing';
function ksShowDetail(id){
  KS_ACTIVE_ID = KS_ACTIVE_ID===id?null:id;
  KS_ACTIVE_TAB = 'pricing';
  renderDest('kosovo');
  setTimeout(function(){
    var el=document.getElementById('ks-detail');
    if(el&&KS_ACTIVE_ID)el.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}
function ksSwitchTab(t){KS_ACTIVE_TAB=t;ksRenderDetail();}
function ksCloseDetail(){KS_ACTIVE_ID=null;renderDest('kosovo');}
function ksShowAllTabs(){
  var p=document.getElementById('ks-tab-pricing');if(p)p.style.display='block';
  var i=document.getElementById('ks-tab-itinerary');if(i)i.style.display='block';
  var n=document.getElementById('ks-tab-info');if(n)n.style.display='block';
}
function ksRestoreTabs(){
  var t=KS_ACTIVE_TAB;
  document.getElementById('ks-tab-pricing').style.display=t==='pricing'?'block':'none';
  document.getElementById('ks-tab-itinerary').style.display=t==='itinerary'?'block':'none';
  document.getElementById('ks-tab-info').style.display=t==='info'?'block':'none';
}
function ksPrintPkg(id,title){
  ksShowAllTabs();
  setTimeout(function(){
    PJ.printElement(document.getElementById('ks-print-area-'+id),title);
    setTimeout(ksRestoreTabs,200);
  },50);
}
function ksPdfPkg(id,title){
  ksShowAllTabs();
  setTimeout(function(){
    PJ.downloadPDF(document.getElementById('ks-print-area-'+id),title);
    setTimeout(ksRestoreTabs,200);
  },50);
}
function ksRenderDetail(){
  const panel = document.getElementById('ks-detail');
  if(!KS_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  const p = KOSOVO_PACKAGES.find(x=>x.id===KS_ACTIVE_ID);
  const starsStr = '★'.repeat(p.stars);
  const fmt = v => (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';
  const pricingHtml = `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">
    <thead><tr>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Room Type</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Stars</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Meal</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Double (p.p)</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Single</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Child</th>
      <th style="text-align:center;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px"></th>
    </tr></thead>
    <tbody>
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-weight:600">Standard</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--gold)" dir="ltr">${'★'.repeat(p.stars)} ${p.stars}★</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border)">${p.meal}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold);font-size:15px">${fmt(p.double)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border)">${fmt(p.single)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border)">${fmt(p.child)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);text-align:center">
          <button onclick="ksPrintPkg(${p.id},'${p.title}')" style="padding:6px 10px;background:none;border:1px solid var(--border);border-radius:6px;color:var(--muted);cursor:pointer;font-size:11px">🖨️</button>
          <button onclick="ksPdfPkg(${p.id},'${p.title}')" style="padding:6px 10px;background:none;border:1px solid var(--border);border-radius:6px;color:var(--muted);cursor:pointer;font-size:11px">📄</button>
        </td>
      </tr>
    </tbody></table></div>`;
  const itinHtml = `<div style="padding:10px 0">
    ${KOSOVO_SHARED_ITINERARY.map(d=>`
      <div style="margin-bottom:8px;background:var(--dark3);border-radius:8px;overflow:hidden">
        <div onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('.ks-chevron').classList.toggle('open')" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;cursor:pointer">
          <div><span style="font-weight:700;color:var(--gold);font-size:12px">${d.day}</span><span style="font-size:12px;margin-right:8px">${d.title}</span></div>
          <span style="font-size:11px;color:var(--muted)">${d.loc}</span>
          <span class="ks-chevron" style="font-size:10px;color:var(--muted);transition:transform .2s">▾</span>
        </div>
        <div style="padding:0 14px 10px;font-size:12px;color:var(--muted);line-height:1.6;display:none">${d.desc}<br><br><span style="color:var(--gold)">🇸🇦 ${d.ar}</span></div>
      </div>
    `).join('')}
  </div>`;
  const infoHtml = `<div style="padding:12px 0;font-size:13px;line-height:1.8">
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <div style="background:var(--dark3);padding:10px 16px;border-radius:8px;flex:1;min-width:200px">
        <div style="font-size:11px;color:var(--muted)">✈️ Route</div>
        <div style="font-weight:600">${p.route||'Amman ↔ Prishtina'}</div>
      </div>
      <div style="background:var(--dark3);padding:10px 16px;border-radius:8px;flex:1;min-width:200px">
        <div style="font-size:11px;color:var(--muted)">🏨 Accommodation</div>
        <div style="font-weight:600">${p.accom||'Prishtina (7 nights)'}</div>
      </div>
      <div style="background:var(--dark3);padding:10px 16px;border-radius:8px;flex:1;min-width:200px">
        <div style="font-size:11px;color:var(--muted)">🍽️ Meal Plan</div>
        <div style="font-weight:600">${p.meal||'BB'}</div>
      </div>
    </div>
    <div style="margin-top:12px;background:var(--dark3);padding:10px 16px;border-radius:8px">
      <div style="font-size:11px;color:var(--muted)">📍 Location</div>
      <div style="font-weight:600">${p.location||'Prishtina'}</div>
    </div>
    <div style="margin-top:10px;font-size:12px;color:var(--muted);background:rgba(201,168,76,.1);padding:10px 16px;border-radius:8px;border:1px solid rgba(201,168,76,.2)">
      ✈️ All prices include round-trip flight, hotel &amp; transport — All prices in JOD per person
    </div>
  </div>`;
  const tabBtns = [
    {id:'pricing',icon:'💰',label:'Prices'},
    {id:'itinerary',icon:'📅',label:'Itinerary'},
    {id:'info',icon:'ℹ️',label:'Info'}
  ];
  panel.innerHTML = `<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;margin-top:16px;overflow:hidden" id="ks-print-area-${p.id}">
    <div style="padding:16px;background:linear-gradient(135deg,rgba(201,168,76,.15),transparent);display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:18px;font-weight:800">${p.title}</div>
        <div style="color:var(--gold);font-size:13px">${p.arabic}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px">${p.subtitle}</div>
      </div>
      <button onclick="ksCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>
    </div>
    <div style="display:flex;border-bottom:1px solid var(--border);background:var(--dark3)">
      ${tabBtns.map(t=>`<button onclick="ksSwitchTab('${t.id}')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:${KS_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)'};border-bottom:2px solid ${KS_ACTIVE_TAB===t.id?'var(--gold)':'transparent'};transition:all .2s">${t.icon} ${t.label}</button>`).join('')}
    </div>
    <div style="padding:14px">
      <div class="ks-tab-c" id="ks-tab-pricing" style="display:${KS_ACTIVE_TAB==='pricing'?'block':'none'}">${pricingHtml}</div>
      <div class="ks-tab-c" id="ks-tab-itinerary" style="display:${KS_ACTIVE_TAB==='itinerary'?'block':'none'}">${itinHtml}</div>
      <div class="ks-tab-c" id="ks-tab-info" style="display:${KS_ACTIVE_TAB==='info'?'block':'none'}">${infoHtml}</div>
    </div>
  </div>`;
}

// ════════════════════════════════════════════════════════════════
// CAIRO RICH PACKAGE DATA (match Far East pattern — 33 packages)
// ════════════════════════════════════════════════════════════════
var _caRate = 0.71;
function _caJOD(usd){return Math.round(usd*_caRate);}
var CAIRO_ITINERARY = [
  {day:'Day 1',titleAr:'وصول القاهرة',titleEn:'Arrival Cairo',
   items:[
     {ar:'الاستقبال في مطار القاهرة الدولي من قِبل مندوبنا',en:'Airport meet & assist'},
     {ar:'التوجه إلى الفندق مع مرافق الرحلة',en:'Transfer to hotel with tour leader'},
     {ar:'استلام الغرف والتسكين',en:'Room check-in'},
     {ar:'المبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 2',titleAr:'عجائب الدنيا',titleEn:'Wonders of the World',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'زيارة الأهرامات الثلاثة',en:'Visit the Pyramids of Giza'},
     {ar:'زيارة أبو الهول',en:'Visit the Great Sphinx'},
     {ar:'متحف البردي',en:'Papyrus Museum'},
     {ar:'خان الخليلي والحسين',en:'Khan Al Khalili & Al Hussein'},
     {ar:'العودة إلى الفندق',en:'Return to hotel'}]},
  {day:'Day 3',titleAr:'الإسكندرية',titleEn:'Optional: Alexandria',
   items:[
     {ar:'التوجه إلى الإسكندرية (اختياري)',en:'Drive to Alexandria (optional)'},
     {ar:'مكتبة الإسكندرية',en:'Bibliotheca Alexandrina'},
     {ar:'قلعة قايتباي',en:'Qaitbay Citadel'},
     {ar:'غداء في مطعم جليم باي',en:'Lunch at Gleem Bay Restaurant'},
     {ar:'العودة إلى القاهرة',en:'Return to Cairo'}]},
  {day:'Day 4',titleAr:'سهرة نيلية',titleEn:'Nile Evening Cruise',
   items:[
     {ar:'يوم حر للراحة',en:'Free day'},
     {ar:'سهرة على باخرة نيلية',en:'Nile Dinner Cruise'},
     {ar:'عشاء فاخر',en:'Gourmet dinner'},
     {ar:'عروض ترفيهية',en:'Live entertainment'},
     {ar:'العودة إلى الفندق',en:'Return to hotel'}]},
  {day:'Day 5',titleAr:'المغادرة',titleEn:'Departure',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast'},
     {ar:'تسليم الغرف',en:'Check-out'},
     {ar:'التحرك إلى المطار',en:'Transfer to airport'},
     {ar:'المغادرة',en:'Departure'}]}
];
var CAIRO_PACKAGES = [
  {id:1,title:'Velvet Hotel',arabic:'فندق فيلفيت',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(175),single:_caJOD(190),room:'Standard Room',location:'Cairo, Downtown',nights:3},
  {id:2,title:'Velvet Hotel',arabic:'فندق فيلفيت',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(200),single:_caJOD(220),room:'Standard Room',location:'Cairo, Downtown',nights:4},
  {id:3,title:'Velvet Hotel',arabic:'فندق فيلفيت',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(225),single:_caJOD(250),room:'Standard Room',location:'Cairo, Downtown',nights:5},
  {id:4,title:'Indiana Hotel',arabic:'فندق إنديانا',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(175),single:_caJOD(190),room:'Standard Room',location:'Cairo, Dokki',nights:3},
  {id:5,title:'Indiana Hotel',arabic:'فندق إنديانا',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(200),single:_caJOD(220),room:'Standard Room',location:'Cairo, Dokki',nights:4},
  {id:6,title:'Indiana Hotel',arabic:'فندق إنديانا',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(225),single:_caJOD(250),room:'Standard Room',location:'Cairo, Dokki',nights:5},
  {id:7,title:'Salma Hotel',arabic:'فندق سلمى',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(205),single:_caJOD(220),room:'Standard Room',location:'Cairo, Dokki',nights:3},
  {id:8,title:'Salma Hotel',arabic:'فندق سلمى',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(240),single:_caJOD(260),room:'Standard Room',location:'Cairo, Dokki',nights:4},
  {id:9,title:'Salma Hotel',arabic:'فندق سلمى',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(275),single:_caJOD(300),room:'Standard Room',location:'Cairo, Dokki',nights:5},
  {id:10,title:'Rixos Tower',arabic:'ريكسوس تاور',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(190),single:_caJOD(250),room:'Standard Room',location:'Cairo, Pyramids',nights:3},
  {id:11,title:'Rixos Tower',arabic:'ريكسوس تاور',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(220),single:_caJOD(300),room:'Standard Room',location:'Cairo, Pyramids',nights:4},
  {id:12,title:'Rixos Tower',arabic:'ريكسوس تاور',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(250),single:_caJOD(350),room:'Standard Room',location:'Cairo, Pyramids',nights:5},
  {id:13,title:'Cosmopolitan Hotel',arabic:'فندق كوزموبوليتان',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(220),single:_caJOD(280),room:'Standard Room',location:'Cairo, Downtown',nights:3},
  {id:14,title:'Cosmopolitan Hotel',arabic:'فندق كوزموبوليتان',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(260),single:_caJOD(340),room:'Standard Room',location:'Cairo, Downtown',nights:4},
  {id:15,title:'Cosmopolitan Hotel',arabic:'فندق كوزموبوليتان',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_caJOD(300),single:_caJOD(400),room:'Standard Room',location:'Cairo, Downtown',nights:5},
  {id:16,title:'Marwa Palace Hotel',arabic:'فندق مروة بالاس',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_caJOD(220),single:_caJOD(280),room:'Standard Room',location:'Cairo, Dokki',nights:3},
  {id:17,title:'Marwa Palace Hotel',arabic:'فندق مروة بالاس',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_caJOD(260),single:_caJOD(340),room:'Standard Room',location:'Cairo, Dokki',nights:4},
  {id:18,title:'Marwa Palace Hotel',arabic:'فندق مروة بالاس',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_caJOD(300),single:_caJOD(400),room:'Standard Room',location:'Cairo, Dokki',nights:5},
  {id:19,title:'Regency Pyramids Hotel',arabic:'ريجنسي بيراميدز',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_caJOD(220),single:_caJOD(295),room:'Standard Room',location:'Cairo, Pyramids',nights:3},
  {id:20,title:'Regency Pyramids Hotel',arabic:'ريجنسي بيراميدز',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_caJOD(260),single:_caJOD(355),room:'Standard Room',location:'Cairo, Pyramids',nights:4},
  {id:21,title:'Regency Pyramids Hotel',arabic:'ريجنسي بيراميدز',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_caJOD(300),single:_caJOD(425),room:'Standard Room',location:'Cairo, Pyramids',nights:5},
  {id:22,title:'Mar Charbel Hotel',arabic:'فندق مار شربل',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_caJOD(225),single:_caJOD(320),room:'Standard Room',location:'Cairo, Downtown',nights:3},
  {id:23,title:'Mar Charbel Hotel',arabic:'فندق مار شربل',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_caJOD(270),single:_caJOD(390),room:'Standard Room',location:'Cairo, Downtown',nights:4},
  {id:24,title:'Mar Charbel Hotel',arabic:'فندق مار شربل',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_caJOD(310),single:_caJOD(460),room:'Standard Room',location:'Cairo, Downtown',nights:5},
  {id:25,title:'Pyramisa Hotel',arabic:'فندق بيراميسا',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_caJOD(260),single:_caJOD(370),room:'Standard Room',location:'Cairo, Dokki',nights:3},
  {id:26,title:'Pyramisa Hotel',arabic:'فندق بيراميسا',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_caJOD(310),single:_caJOD(460),room:'Standard Room',location:'Cairo, Dokki',nights:4},
  {id:27,title:'Pyramisa Hotel',arabic:'فندق بيراميسا',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_caJOD(365),single:_caJOD(550),room:'Standard Room',location:'Cairo, Dokki',nights:5},
  {id:28,title:'Ramses Hilton',arabic:'رمسيس هيلتون',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_caJOD(280),single:_caJOD(430),room:'Standard Room',location:'Cairo, Downtown',nights:3},
  {id:29,title:'Ramses Hilton',arabic:'رمسيس هيلتون',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_caJOD(340),single:_caJOD(540),room:'Standard Room',location:'Cairo, Downtown',nights:4},
  {id:30,title:'Ramses Hilton',arabic:'رمسيس هيلتون',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_caJOD(400),single:_caJOD(650),room:'Standard Room',location:'Cairo, Downtown',nights:5},
  {id:31,title:'Hilton Cairo Grand Nile Tower',arabic:'هيلتون القاهرة غراند نايل',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_caJOD(310),single:_caJOD(460),room:'Standard Room',location:'Cairo, Zamalek',nights:3},
  {id:32,title:'Hilton Cairo Grand Nile Tower',arabic:'هيلتون القاهرة غراند نايل',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_caJOD(380),single:_caJOD(580),room:'Standard Room',location:'Cairo, Zamalek',nights:4},
  {id:33,title:'Hilton Cairo Grand Nile Tower',arabic:'هيلتون القاهرة غراند نايل',subtitle:'Cairo',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_caJOD(450),single:_caJOD(700),room:'Standard Room',location:'Cairo, Zamalek',nights:5}
];
var CA_ACTIVE_ID = null;
var CA_ACTIVE_TAB = 'pricing';
var CA_CUR_NIGHTS = 0;
function caSetNights(n){CA_CUR_NIGHTS=n;CA_ACTIVE_ID=null;renderDest('cairo');}
function caShowDetail(id){
  CA_ACTIVE_ID = CA_ACTIVE_ID===id?null:id;
  CA_ACTIVE_TAB = 'pricing';
  renderDest('cairo');
  setTimeout(function(){
    var el=document.getElementById('ca-detail');
    if(el&&CA_ACTIVE_ID)el.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}
function caSwitchTab(t){CA_ACTIVE_TAB=t;caRenderDetail();}
function caCloseDetail(){CA_ACTIVE_ID=null;renderDest('cairo');}
function caShowAllTabs(){
  ['ca-tab-pricing','ca-tab-itinerary','ca-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function caRestoreTabs(){
  var t=CA_ACTIVE_TAB;
  ['ca-tab-pricing','ca-tab-itinerary','ca-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='ca-tab-pricing'?t==='pricing':id==='ca-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function caPrintPkg(id,title){_fePrintAction(id,title,'ca',CAIRO_PACKAGES,false);}
function caPdfPkg(id,title){_fePrintAction(id,title,'ca',CAIRO_PACKAGES,true);}
function caRenderDetail(){
  var panel = document.getElementById('ca-detail');
  if(!CA_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = CAIRO_PACKAGES.find(function(x){return x.id===CA_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '\u2605'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel \u00b7 \u0627\u0644\u0641\u0646\u062f\u0642</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'<br><span style="color:var(--gold);font-size:10px">'+p.arabic+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\\'")+'\',destination:\'Cairo\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">\uD83D\uDCF2 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">\u2605 All prices in JOD per person \u00b7 '+p.nights+' nights / '+(p.nights+1)+' days \u00b7 Route: '+p.route+'</div>';
  var itinDays = p.nights>=5 ? CAIRO_ITINERARY : CAIRO_ITINERARY.slice(0,p.nights+1);
  var itinHtml = '<div style="margin-bottom:12px;font-size:12px;font-weight:700;color:var(--gold)">\uD83D\uDCC5 Program: '+(p.nights+1)+' days / '+p.nights+' nights</div>'+
    itinDays.map(function(d){
      return '<div style="margin-bottom:14px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border)">'+
        '<div style="font-size:10px;font-weight:700;color:var(--teal);text-transform:uppercase;margin-bottom:4px">'+d.day+'</div>'+
        '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:2px">'+d.titleAr+'</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+d.titleEn+'</div>'+
        '<div style="padding-right:10px;border-right:2px solid var(--gold-light)">'+
          d.items.map(function(i){return '<div style="padding:2px 0;font-size:12px;line-height:1.5">\u2022 '+i.ar+' <span style="color:var(--muted);font-size:11px">\u00b7 '+i.en+'</span></div>';}).join('')+
        '</div></div>';
    }).join('');
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.title+' \u00b7 '+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Round-trip flight (Amman \u2194 Cairo)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Airport meet &amp; assist + transfers</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Hotel accommodation (Standard Room, BB)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Pyramids, Sphinx, Khan Al Khalili, Nile Cruise</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Egypt e-visa fee</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Optional excursions (Alexandria)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Personal expenses</li>'+
    '</ul>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'\uD83D\uDCB0'},
    {id:'itinerary',label:'Itinerary',icon:'\uD83D\uDCC4'},
    {id:'info',label:'Details & Inclusions',icon:'\u2139\uFE0F'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="ca-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="caPrintPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDDA8\uFE0F Print</button>'+
        '<button onclick="caPdfPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDCC4 PDF</button>'+
        '<button onclick="caCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">\u2715</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="caSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(CA_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(CA_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="ca-tab-pricing" style="display:'+(CA_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="ca-tab-itinerary" style="display:'+(CA_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="ca-tab-info" style="display:'+(CA_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}



// ════════════════════════════════════════════════════════════════
// ALEXANDRIA RICH PACKAGE DATA
// ════════════════════════════════════════════════════════════════
var _alRate = 0.71;
function _alJOD(usd){return Math.round(usd*_alRate);}
var ALEXANDRIA_ITINERARY = [
  {day:'Day 1',titleAr:'وصول الإسكندرية',titleEn:'Arrival Alexandria',
   items:[
     {ar:'الاستقبال في مطار برج العرب الدولي من قِبل مندوبنا',en:'Airport meet & assist at Borg El Arab'},
     {ar:'التوجه إلى الفندق مع مرافق الرحلة',en:'Transfer to hotel with tour leader'},
     {ar:'استلام الغرف والتسكين',en:'Room check-in'},
     {ar:'المبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 2',titleAr:'عروس البحر الأبيض المتوسط',titleEn:'Queen of the Mediterranean',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'زيارة قلعة قايتباي — من أهم الحصون الدفاعية',en:'Visit Qaitbay Citadel'},
     {ar:'كوبري ستانلي — إطلالة مميزة على البحر',en:'Stanley Bridge — distinctive sea views'},
     {ar:'مسجد المرسي أبو العباس — أبرز المعالم الدينية',en:'Al-Mursi Abu Al-Abbas Mosque'},
     {ar:'جولة حرة في أسواق الإسكندرية',en:'Free stroll in Alexandria markets'},
     {ar:'العودة إلى الفندق',en:'Return to hotel'}]},
  {day:'Day 3',titleAr:'ثقافة وترفيه',titleEn:'Culture & Leisure',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'مكتبة الإسكندرية الحديثة — أيقونة المدينة الثقافية',en:'Bibliotheca Alexandrina — cultural icon'},
     {ar:'جليم باي — غداء بإطلالة بحرية (اختياري)',en:'Gleem Bay — lunch with sea view (optional)'},
     {ar:'العودة إلى الفندق',en:'Return to hotel'}]},
  {day:'Day 4',titleAr:'يوم حر',titleEn:'Free Leisure Day',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'يوم حر للراحة والاستكشاف الشخصي',en:'Free day for rest & personal exploration'}]},
  {day:'Day 5',titleAr:'المغادرة',titleEn:'Departure',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast'},
     {ar:'تسليم الغرف',en:'Check-out'},
     {ar:'التحرك إلى مطار برج العرب',en:'Transfer to Borg El Arab Airport'},
     {ar:'المغادرة',en:'Departure'}]}
];
var ALEXANDRIA_PACKAGES = [
  {id:1,title:'Plaza Hotel',arabic:'فندق بلازا',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:3,meal:'BB',double:_alJOD(180),single:_alJOD(270),room:'Standard Room',location:'Alexandria, El Raml Station',nights:3},
  {id:2,title:'Plaza Hotel',arabic:'فندق بلازا',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:3,meal:'BB',double:_alJOD(230),single:_alJOD(350),room:'Standard Room',location:'Alexandria, El Raml Station',nights:4},
  {id:3,title:'Plaza Hotel',arabic:'فندق بلازا',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:3,meal:'BB',double:_alJOD(280),single:_alJOD(430),room:'Standard Room',location:'Alexandria, El Raml Station',nights:5},
  {id:4,title:'Romance Hotel',arabic:'فندق رومانس',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:3,meal:'BB',double:_alJOD(195),single:_alJOD(300),room:'Standard Room',location:'Alexandria, Corniche',nights:3},
  {id:5,title:'Romance Hotel',arabic:'فندق رومانس',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:3,meal:'BB',double:_alJOD(250),single:_alJOD(390),room:'Standard Room',location:'Alexandria, Corniche',nights:4},
  {id:6,title:'Romance Hotel',arabic:'فندق رومانس',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:3,meal:'BB',double:_alJOD(305),single:_alJOD(480),room:'Standard Room',location:'Alexandria, Corniche',nights:5},
  {id:7,title:'Hilton Green Plaza',arabic:'هيلتون جرين بلازا',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:4,meal:'BB',double:_alJOD(210),single:_alJOD(330),room:'Standard Room',location:'Alexandria, Smouha',nights:3},
  {id:8,title:'Hilton Green Plaza',arabic:'هيلتون جرين بلازا',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:4,meal:'BB',double:_alJOD(270),single:_alJOD(430),room:'Standard Room',location:'Alexandria, Smouha',nights:4},
  {id:9,title:'Hilton Green Plaza',arabic:'هيلتون جرين بلازا',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:4,meal:'BB',double:_alJOD(330),single:_alJOD(530),room:'Standard Room',location:'Alexandria, Smouha',nights:5},
  {id:10,title:'Eastern El Montazah',arabic:'إيسترن المنتزه',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:4,meal:'BB',double:_alJOD(210),single:_alJOD(330),room:'Standard Room',location:'Alexandria, El Montazah',nights:3},
  {id:11,title:'Eastern El Montazah',arabic:'إيسترن المنتزه',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:4,meal:'BB',double:_alJOD(270),single:_alJOD(430),room:'Standard Room',location:'Alexandria, El Montazah',nights:4},
  {id:12,title:'Eastern El Montazah',arabic:'إيسترن المنتزه',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:4,meal:'BB',double:_alJOD(330),single:_alJOD(530),room:'Standard Room',location:'Alexandria, El Montazah',nights:5},
  {id:13,title:'Tolip Hotel',arabic:'فندق توليب',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:4,meal:'BB',double:_alJOD(240),single:_alJOD(390),room:'Standard Room',location:'Alexandria, Corniche',nights:3},
  {id:14,title:'Tolip Hotel',arabic:'فندق توليب',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:4,meal:'BB',double:_alJOD(310),single:_alJOD(510),room:'Standard Room',location:'Alexandria, Corniche',nights:4},
  {id:15,title:'Tolip Hotel',arabic:'فندق توليب',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:4,meal:'BB',double:_alJOD(380),single:_alJOD(630),room:'Standard Room',location:'Alexandria, Corniche',nights:5},
  {id:16,title:'Paradise Inn Hotel',arabic:'فندق بارادايس إن',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:5,meal:'BB',double:_alJOD(275),single:_alJOD(485),room:'Standard Room',location:'Alexandria, Maamoura',nights:3},
  {id:17,title:'Paradise Inn Hotel',arabic:'فندق بارادايس إن',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:5,meal:'BB',double:_alJOD(355),single:_alJOD(640),room:'Standard Room',location:'Alexandria, Maamoura',nights:4},
  {id:18,title:'Paradise Inn Hotel',arabic:'فندق بارادايس إن',subtitle:'El Raml Station · محطة الرمل',route:'Amman \u2194 Alexandria',stars:5,meal:'BB',double:_alJOD(435),single:_alJOD(790),room:'Standard Room',location:'Alexandria, Maamoura',nights:5}
];
var AL_ACTIVE_ID = null;
var AL_ACTIVE_TAB = 'pricing';
var AL_CUR_NIGHTS = 0;
function alSetNights(n){AL_CUR_NIGHTS=n;AL_ACTIVE_ID=null;renderDest('alexandria');}
function alShowDetail(id){
  AL_ACTIVE_ID = AL_ACTIVE_ID===id?null:id;
  AL_ACTIVE_TAB = 'pricing';
  renderDest('alexandria');
  setTimeout(function(){
    var el=document.getElementById('al-detail');
    if(el&&AL_ACTIVE_ID)el.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}
function alSwitchTab(t){AL_ACTIVE_TAB=t;alRenderDetail();}
function alCloseDetail(){AL_ACTIVE_ID=null;renderDest('alexandria');}
function alShowAllTabs(){
  ['al-tab-pricing','al-tab-itinerary','al-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function alRestoreTabs(){
  var t=AL_ACTIVE_TAB;
  ['al-tab-pricing','al-tab-itinerary','al-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='al-tab-pricing'?t==='pricing':id==='al-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function alPrintPkg(id,title){_fePrintAction(id,title,'al',ALEXANDRIA_PACKAGES,false);}
function alPdfPkg(id,title){_fePrintAction(id,title,'al',ALEXANDRIA_PACKAGES,true);}

// ════════════════════════════════════════════════════════════════
// NORTH COAST RICH PACKAGE DATA — Cairo 3N + North Coast 2N combined program
// ════════════════════════════════════════════════════════════════
var _cncRate = 0.71;
function _cncJOD(usd){return Math.round(usd*_cncRate);}
var CAIRO_NORTH_COAST_ITINERARY = [
  {day:'Day 1',titleAr:'وصول القاهرة',titleEn:'Arrival Cairo',
   items:[
     {ar:'الاستقبال في مطار القاهرة الدولي من قِبل مندوبنا',en:'Airport meet & assist by our representative'},
     {ar:'التوجه إلى الفندق مع مرافق الرحلة المتخصص',en:'Transfer to hotel with specialist tour leader'},
     {ar:'استلام الغرف مع خدمة توصيل الحقائب',en:'Room check-in with luggage delivery'},
     {ar:'التسكين والمبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 2',titleAr:'يوم بين عجائب الدنيا',titleEn:'Wonders of the World',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'زيارة منطقة الأهرامات الثلاثة — إحدى عجائب الدنيا السبع',en:'Visit the Three Great Pyramids of Giza — one of the Seven Wonders'},
     {ar:'زيارة أبو الهول والتقاط الصور التذكارية',en:'Visit the Great Sphinx & photo stop'},
     {ar:'متحف البردي — كيفية صناعة المصريين القدماء لورق البردي',en:'Papyrus Museum — ancient Egyptian papyrus-making art'},
     {ar:'خان الخليلي والحسين — الأسواق القديمة والتحف والتوابل',en:'Khan Al Khalili & Al Hussein — ancient bazaar'},
     {ar:'المقاهي الشهيرة مثل الفيشاوي',en:'Famous cafés including El-Fishawy'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 3',titleAr:'القاهرة — الساحل الشمالي',titleEn:'Cairo to North Coast',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف ومغادرة الفندق',en:'Room check-out'},
     {ar:'التحرك إلى الساحل الشمالي مع مرافق الرحلة المتخصص',en:'Transfer to North Coast with specialist tour leader'},
     {ar:'استلام الغرف وخدمة توصيل الحقائب في فندق الساحل',en:'Check-in at North Coast hotel — luggage delivery'},
     {ar:'الاستمتاع بالشاطئ وحمامات السباحة',en:'Enjoy the beach & swimming pools'},
     {ar:'المبيت بالفندق — نصف إقامة',en:'Overnight at hotel — Half Board'}]},
  {day:'Day 4',titleAr:'الساحل الشمالي',titleEn:'North Coast Beach Day',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'الاستمتاع بالشاطئ وحمامات السباحة طوال اليوم',en:'Full day at the beach & swimming pools'},
     {ar:'أنشطة مائية اختيارية: جيت سكي، بنانا بوت، باراشوت مائي',en:'Optional water activities: Jet Ski, Banana Boat, Water Parachute'},
     {ar:'العشاء بالفندق — نصف إقامة',en:'Dinner at hotel — Half Board'},
     {ar:'المبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 5',titleAr:'الرجوع إلى القاهرة مع سهرة نيلية',titleEn:'Return to Cairo — Nile Evening',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف والرجوع إلى القاهرة مع مرافق الرحلة',en:'Check-out & return to Cairo with tour leader'},
     {ar:'التسكين وخدمة توصيل الحقائب بفندق القاهرة',en:'Check-in at Cairo hotel with luggage delivery'},
     {ar:'في المساء: سهرة مميزة على متن باخرة نيلية',en:'Evening: Special Nile Dinner Cruise'},
     {ar:'عشاء فاخر مع إطلالة ساحرة على نهر النيل',en:'Gourmet dinner with panoramic Nile views'},
     {ar:'عروض ترفيهية: رقص شرقي، تنورة، فلكلور مصري',en:'Live entertainment: Oriental dance, Tanoura, Egyptian folklore'},
     {ar:'العودة إلى الفندق للمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 6',titleAr:'العودة لأرض الوطن',titleEn:'Departure',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف ومغادرة الفندق',en:'Room check-out'},
     {ar:'التحرك إلى مطار القاهرة الدولي',en:'Transfer to Cairo International Airport'},
     {ar:'المغادرة — نتمنى لكم رحلة ممتعة وتجربة لا تُنسى',en:'Departure — safe travels & unforgettable memories!'}]}
];
var CAIRO_NORTH_COAST_PACKAGES = [
  {id:1,title:'Velvet Hotel + Retal View',arabic:'فندق فيلفيت + ريتال فيو',subtitle:'Downtown · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_cncJOD(375),single:_cncJOD(445),room:'Standard Room',location:'Cairo, Downtown + North Coast',nights:5},
  {id:2,title:'Indiana Hotel + Retal View',arabic:'فندق إنديانا + ريتال فيو',subtitle:'Dokki · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_cncJOD(375),single:_cncJOD(445),room:'Standard Room',location:'Cairo, Dokki + North Coast',nights:5},
  {id:3,title:'Salma Hotel + Retal View',arabic:'فندق سلمى + ريتال فيو',subtitle:'Dokki · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_cncJOD(400),single:_cncJOD(475),room:'Standard Room',location:'Cairo, Dokki + North Coast',nights:5},
  {id:4,title:'Rixos Tower + Retal View',arabic:'ريكسوس تاور + ريتال فيو',subtitle:'Pyramids · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_cncJOD(390),single:_cncJOD(505),room:'Standard Room',location:'Cairo, Pyramids + North Coast',nights:5},
  {id:5,title:'Cosmopolitan Hotel + Retal View',arabic:'فندق كوزموبوليتان + ريتال فيو',subtitle:'Downtown · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_cncJOD(420),single:_cncJOD(535),room:'Standard Room',location:'Cairo, Downtown + North Coast',nights:5},
  {id:6,title:'Marwa Palace Hotel + Retal View',arabic:'فندق مروة بالاس + ريتال فيو',subtitle:'Dokki · North Coast',route:'Amman \u2194 Cairo',stars:4,meal:'BB+HB',double:_cncJOD(400),single:_cncJOD(505),room:'Standard Room',location:'Cairo, Dokki + North Coast',nights:5},
  {id:7,title:'Regency Pyramids Hotel + Retal View',arabic:'ريجنسي بيراميدز + ريتال فيو',subtitle:'Pyramids · North Coast',route:'Amman \u2194 Cairo',stars:4,meal:'BB+HB',double:_cncJOD(420),single:_cncJOD(550),room:'Standard Room',location:'Cairo, Pyramids + North Coast',nights:5},
  {id:8,title:'Mar Charbel Hotel + Retal View',arabic:'فندق مار شربل + ريتال فيو',subtitle:'Downtown · North Coast',route:'Amman \u2194 Cairo',stars:4,meal:'BB+HB',double:_cncJOD(415),single:_cncJOD(545),room:'Standard Room',location:'Cairo, Downtown + North Coast',nights:5},
  {id:9,title:'Pyramisa Hotel + Retal View',arabic:'فندق بيراميسا + ريتال فيو',subtitle:'Dokki · North Coast',route:'Amman \u2194 Cairo',stars:5,meal:'BB+HB',double:_cncJOD(460),single:_cncJOD(625),room:'Standard Room',location:'Cairo, Dokki + North Coast',nights:5},
  {id:10,title:'Ramses Hilton + Retal View',arabic:'رمسيس هيلتون + ريتال فيو',subtitle:'Downtown · North Coast',route:'Amman \u2194 Cairo',stars:5,meal:'BB+HB',double:_cncJOD(480),single:_cncJOD(685),room:'Standard Room',location:'Cairo, Downtown + North Coast',nights:5},
  {id:11,title:'Hilton Grand Nile Tower + Retal View',arabic:'هيلتون القاهرة غراند نايل + ريتال فيو',subtitle:'Zamalek · North Coast',route:'Amman \u2194 Cairo',stars:5,meal:'BB+HB',double:_cncJOD(510),single:_cncJOD(715),room:'Standard Room',location:'Cairo, Zamalek + North Coast',nights:5}
];
var CNC_ACTIVE_ID = null;
var CNC_ACTIVE_TAB = 'pricing';
var CNC_CUR_NIGHTS = 0;
function cncSetNights(n){CNC_CUR_NIGHTS=n;CNC_ACTIVE_ID=null;renderDest('cairo-north-coast');}
function cncShowDetail(id){
  CNC_ACTIVE_ID = CNC_ACTIVE_ID===id?null:id;
  CNC_ACTIVE_TAB = 'pricing';
  renderDest('cairo-north-coast');
  setTimeout(function(){
    var el=document.getElementById('cnc-detail');
    if(el&&CNC_ACTIVE_ID)el.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}
function cncSwitchTab(t){CNC_ACTIVE_TAB=t;cncRenderDetail();}
function cncCloseDetail(){CNC_ACTIVE_ID=null;renderDest('cairo-north-coast');}
function cncShowAllTabs(){
  ['cnc-tab-pricing','cnc-tab-itinerary','cnc-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function cncRestoreTabs(){
  var t=CNC_ACTIVE_TAB;
  ['cnc-tab-pricing','cnc-tab-itinerary','cnc-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='cnc-tab-pricing'?t==='pricing':id==='cnc-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function cncPrintPkg(id,title){_fePrintAction(id,title,'cnc',CAIRO_NORTH_COAST_PACKAGES,false);}
function cncPdfPkg(id,title){_fePrintAction(id,title,'cnc',CAIRO_NORTH_COAST_PACKAGES,true);}
function cncRenderDetail(){
  var panel = document.getElementById('cnc-detail');
  if(!CNC_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = CAIRO_NORTH_COAST_PACKAGES.find(function(x){return x.id===CNC_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '\u2605'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel \u00b7 \u0627\u0644\u0641\u0646\u062f\u0642</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'<br><span style="color:var(--gold);font-size:10px">'+p.arabic+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\\'")+'\',destination:\'North Coast\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">\uD83D\uDCF2 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">\u2605 All prices in JOD per person \u00b7 '+p.nights+' nights / '+(p.nights+1)+' days \u00b7 Route: '+p.route+'</div>';
  var itinHtml = '<div style="margin-bottom:12px;font-size:12px;font-weight:700;color:var(--gold)">\uD83D\uDCC5 Program: '+(p.nights+1)+' days / '+p.nights+' nights</div>'+
    CAIRO_NORTH_COAST_ITINERARY.map(function(d){
      return '<div style="margin-bottom:14px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border)">'+
        '<div style="font-size:10px;font-weight:700;color:var(--teal);text-transform:uppercase;margin-bottom:4px">'+d.day+'</div>'+
        '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:2px">'+d.titleAr+'</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+d.titleEn+'</div>'+
        '<div style="padding-right:10px;border-right:2px solid var(--gold-light)">'+
          d.items.map(function(i){return '<div style="padding:2px 0;font-size:12px;line-height:1.5">\u2022 '+i.ar+' <span style="color:var(--muted);font-size:11px">\u00b7 '+i.en+'</span></div>';}).join('')+
        '</div></div>';
    }).join('');
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.title+' \u00b7 '+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Round-trip flight (Amman \u2194 Cairo)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Airport meet &amp; assist + transfers</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 3N Cairo hotel (Standard Room, BB) + 2N Porto Marina North Coast (HB)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Pyramids, Sphinx, Khan Al Khalili, Nile Dinner Cruise</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 All transfers Cairo \u2194 North Coast</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Egypt e-visa fee</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Optional excursions &amp; water sports</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Personal expenses</li>'+
    '</ul>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'\uD83D\uDCB0'},
    {id:'itinerary',label:'Itinerary',icon:'\uD83D\uDCC4'},
    {id:'info',label:'Details & Inclusions',icon:'\u2139\uFE0F'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="cnc-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="cncPrintPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDDA8\uFE0F Print</button>'+
        '<button onclick="cncPdfPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDCC4 PDF</button>'+
        '<button onclick="cncCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">\u2715</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="cncSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(CNC_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(CNC_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="cnc-tab-pricing" style="display:'+(CNC_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="cnc-tab-itinerary" style="display:'+(CNC_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="cnc-tab-info" style="display:'+(CNC_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}


function alRenderDetail(){
  var panel = document.getElementById('al-detail');
  if(!AL_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = ALEXANDRIA_PACKAGES.find(function(x){return x.id===AL_ACTIVE_ID;});
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '\u2605'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel \u00b7 \u0627\u0644\u0641\u0646\u062f\u0642</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'<br><span style="color:var(--gold);font-size:10px">'+p.arabic+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\\'")+'\',destination:\'Alexandria\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">\uD83D\uDCF2 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">\u2605 All prices in JOD per person \u00b7 '+p.nights+' nights / '+(p.nights+1)+' days \u00b7 Route: '+p.route+'</div>';
  var itinDays = p.nights>=5 ? ALEXANDRIA_ITINERARY : ALEXANDRIA_ITINERARY.slice(0,p.nights+1);
  var itinHtml = '<div style="margin-bottom:12px;font-size:12px;font-weight:700;color:var(--gold)">\uD83D\uDCC5 Program: '+(p.nights+1)+' days / '+p.nights+' nights</div>'+
    itinDays.map(function(d){
      return '<div style="margin-bottom:14px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border)">'+
        '<div style="font-size:10px;font-weight:700;color:var(--teal);text-transform:uppercase;margin-bottom:4px">'+d.day+'</div>'+
        '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:2px">'+d.titleAr+'</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+d.titleEn+'</div>'+
        '<div style="padding-right:10px;border-right:2px solid var(--gold-light)">'+
          d.items.map(function(i){return '<div style="padding:2px 0;font-size:12px;line-height:1.5">\u2022 '+i.ar+' <span style="color:var(--muted);font-size:11px">\u00b7 '+i.en+'</span></div>';}).join('')+
        '</div></div>';
    }).join('');
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.title+' \u00b7 '+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Round-trip flight (Amman \u2194 Alexandria / Borg El Arab)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Airport meet &amp; assist + transfers</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Hotel accommodation (Standard Room, BB)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Qaitbay Citadel, Stanley Bridge, Abu Al-Abbas Mosque, Bibliotheca</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Egypt e-visa fee</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Optional excursions</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Personal expenses</li>'+
    '</ul>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'\uD83D\uDCB0'},
    {id:'itinerary',label:'Itinerary',icon:'\uD83D\uDCC4'},
    {id:'info',label:'Details & Inclusions',icon:'\u2139\uFE0F'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="al-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="alPrintPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDDA8\uFE0F Print</button>'+
        '<button onclick="alPdfPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDCC4 PDF</button>'+
        '<button onclick="alCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">\u2715</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="alSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(AL_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(AL_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="al-tab-pricing" style="display:'+(AL_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="al-tab-itinerary" style="display:'+(AL_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="al-tab-info" style="display:'+(AL_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}



// ════════════════════════════════════════════════════════════════
// CAIRO & ALEXANDRIA PACKAGE DATA — Cairo + Alexandria combined program
// ════════════════════════════════════════════════════════════════
var _calRate = 0.71;
function _calJOD(usd){return Math.round(usd*_calRate);}

// 5-night itinerary (Cairo 3N + Alexandria 2N)
var CAIRO_ALEXANDRIA_ITINERARY_5 = [
  {day:'Day 1',titleAr:'وصول الإسكندرية',titleEn:'Arrival Alexandria',
   items:[
     {ar:'وصول مطار برج العرب والاستقبال من قِبل مندوبنا',en:'Arrive Borg El Arab Airport — meet & assist'},
     {ar:'إنهاء إجراءات الوصول والتوجه إلى الفندق مع مرافق الرحلة',en:'Clear arrival formalities & transfer to hotel'},
     {ar:'استلام الغرف مع خدمة توصيل الحقائب',en:'Room check-in with luggage delivery'},
     {ar:'التسكين والمبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 2',titleAr:'يوم ثقافي وترفيهي في الإسكندرية',titleEn:'Cultural & Leisure Day in Alexandria',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'زيارة مكتبة الإسكندرية — امتداد للمكتبة القديمة',en:'Visit Bibliotheca Alexandrina'},
     {ar:'التوجه إلى جليم باي والاستمتاع بالغداء والمشروبات (اختياري)',en:'Gleem Bay — optional lunch & drinks'},
     {ar:'وقت حر للاستمتاع بجمال مدينة الإسكندرية',en:'Free time to enjoy Alexandria'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 3',titleAr:'العودة إلى القاهرة مع جولة ترفيهية',titleEn:'Return to Cairo with Optional Tour',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف والتوجه إلى القاهرة مع مرافق الرحلة',en:'Check-out & transfer to Cairo'},
     {ar:'التسكين في فندق القاهرة',en:'Check-in at Cairo hotel'},
     {ar:'جولة حرة إلى مول مصر والتزحلق على الجليد (اختياري)',en:'Optional visit to Mall of Egypt & ice skating'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 4',titleAr:'يوم بين عجائب الدنيا',titleEn:'Wonders of the World',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'زيارة منطقة الأهرامات الثلاثة — إحدى عجائب الدنيا السبع',en:'Visit the Three Great Pyramids of Giza'},
     {ar:'زيارة أبو الهول والتقاط الصور التذكارية',en:'Visit the Great Sphinx & photo stop'},
     {ar:'متحف البردي',en:'Papyrus Museum'},
     {ar:'خان الخليلي والحسين — الأسواق القديمة',en:'Khan Al Khalili & Al Hussein bazaar'},
     {ar:'العودة إلى الفندق للمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 5',titleAr:'سهرة نيلية لا تُنسى',titleEn:'Nile Evening Cruise',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'يوم حر للراحة أو الاستمتاع بالوقت الحر',en:'Free day for rest or leisure'},
     {ar:'في المساء: سهرة على متن باخرة نيلية مع عشاء فاخر وعروض ترفيهية',en:'Evening: Nile Dinner Cruise with entertainment'},
     {ar:'العودة إلى الفندق للمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 6',titleAr:'العودة لأرض الوطن',titleEn:'Departure',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف ومغادرة الفندق',en:'Check-out'},
     {ar:'التحرك إلى مطار القاهرة الدولي للعودة',en:'Transfer to Cairo International Airport'}]}
];

// 7-night itinerary (Cairo 4N + Alexandria 3N)
var CAIRO_ALEXANDRIA_ITINERARY_7 = [
  {day:'Day 1',titleAr:'وصول القاهرة',titleEn:'Arrival Cairo',
   items:[
     {ar:'وصول مطار القاهرة الدولي — الاستقبال من مندوبنا',en:'Arrive Cairo International Airport — meet & assist'},
     {ar:'التوجه إلى الفندق مع مرافق الرحلة',en:'Transfer to hotel with tour leader'},
     {ar:'استلام الغرف والتسكين والمبيت',en:'Room check-in — overnight'}]},
  {day:'Day 2',titleAr:'يوم بين عجائب الدنيا',titleEn:'Wonders of the World',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'زيارة الأهرامات الثلاثة — إحدى عجائب الدنيا السبع',en:'Visit the Pyramids of Giza'},
     {ar:'زيارة أبو الهول',en:'Visit the Great Sphinx'},
     {ar:'متحف البردي — صناعة ورق البردي',en:'Papyrus Museum'},
     {ar:'خان الخليلي والحسين',en:'Khan Al Khalili & Al Hussein'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 3',titleAr:'سهرة نيلية لا تُنسى',titleEn:'Nile Evening Cruise',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'يوم حر للراحة',en:'Free day for rest'},
     {ar:'في المساء: سهرة على متن باخرة نيلية مع عشاء وعروض ترفيهية',en:'Evening: Nile Dinner Cruise with entertainment'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 4',titleAr:'رحلة الفيوم الاختيارية',titleEn:'Optional Fayoum Trip',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'التحرك إلى الفيوم — وادي الريان والشلالات',en:'Drive to Fayoum — Wadi El Rayan & waterfalls'},
     {ar:'جبل المدورة — ساندبوردينج',en:'Jabal El Mudawwara — sandboarding'},
     {ar:'قرية تونس — غداء في خيمة بدوية',en:'Tunis village — Bedouin tent lunch'},
     {ar:'العودة إلى القاهرة والمبيت',en:'Return to Cairo — overnight'}]},
  {day:'Day 5',titleAr:'الإسكندرية — البحر والمعالم',titleEn:'Alexandria — Sea & History',
   items:[
     {ar:'الإفطار بالفندق ثم التوجه إلى الإسكندرية',en:'Breakfast at hotel then depart for Alexandria'},
     {ar:'كوبري ستانلي ومسجد المرسي أبو العباس',en:'Stanley Bridge & Al-Mursi Abu Al-Abbas Mosque'},
     {ar:'التوجه إلى الفندق للتسكين',en:'Hotel check-in'},
     {ar:'(اختياري) قرية أفريكانو',en:'(Optional) Africano Village'},
     {ar:'العودة للفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 6',titleAr:'يوم ثقافي وترفيهي في الإسكندرية',titleEn:'Cultural Day in Alexandria',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'مكتبة الإسكندرية الحديثة',en:'Visit Bibliotheca Alexandrina'},
     {ar:'جليم باي — الغداء على البحر',en:'Gleem Bay — lunch on the seafront'},
     {ar:'وقت حر',en:'Free time'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 7',titleAr:'يوم حر',titleEn:'Free Day',
   items:[
     {ar:'يوم حر للراحة والهوايات',en:'Free day for relaxation'}]},
  {day:'Day 8',titleAr:'العودة لأرض الوطن',titleEn:'Departure',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف',en:'Check-out'},
     {ar:'التحرك إلى مطار برج العرب للعودة',en:'Transfer to Borg El Arab Airport'}]}
];

var CAIRO_ALEXANDRIA_PACKAGES = [
  {id:1,title:'Velvet Hotel + Plaza Alex',arabic:'فندق فيلفيت + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(280),single:_calJOD(355),room:'Standard Room',location:'Cairo, Downtown + Alexandria',nights:5},
  {id:2,title:'Indiana Hotel + Plaza Alex',arabic:'فندق إنديانا + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(280),single:_calJOD(355),room:'Standard Room',location:'Cairo, Dokki + Alexandria',nights:5},
  {id:3,title:'Salma Hotel + Plaza Alex',arabic:'فندق سلمى + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(305),single:_calJOD(385),room:'Standard Room',location:'Cairo, Dokki + Alexandria',nights:5},
  {id:4,title:'Rixos Tower + Plaza Alex',arabic:'ريكسوس تاور + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(295),single:_calJOD(415),room:'Standard Room',location:'Cairo, Pyramids + Alexandria',nights:5},
  {id:5,title:'Cosmopolitan Hotel + Plaza Alex',arabic:'فندق كوزموبوليتان + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(325),single:_calJOD(445),room:'Standard Room',location:'Cairo, Downtown + Alexandria',nights:5},
  {id:6,title:'Marwa Palace Hotel + Plaza Alex',arabic:'فندق مروة بالاس + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_calJOD(305),single:_calJOD(415),room:'Standard Room',location:'Cairo, Dokki + Alexandria',nights:5},
  {id:7,title:'Regency Pyramids Hotel + Plaza Alex',arabic:'ريجنسي بيراميدز + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_calJOD(325),single:_calJOD(460),room:'Standard Room',location:'Cairo, Pyramids + Alexandria',nights:5},
  {id:8,title:'Mar Charbel Hotel + Plaza Alex',arabic:'فندق مار شربل + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_calJOD(320),single:_calJOD(455),room:'Standard Room',location:'Cairo, Downtown + Alexandria',nights:5},
  {id:9,title:'Pyramisa Hotel + Plaza Alex',arabic:'فندق بيراميسا + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_calJOD(365),single:_calJOD(535),room:'Standard Room',location:'Cairo, Dokki + Alexandria',nights:5},
  {id:10,title:'Ramses Hilton + Plaza Alex',arabic:'رمسيس هيلتون + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_calJOD(385),single:_calJOD(595),room:'Standard Room',location:'Cairo, Downtown + Alexandria',nights:5},
  {id:11,title:'Hilton Grand Nile Tower + Plaza Alex',arabic:'هيلتون القاهرة غراند نايل + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_calJOD(415),single:_calJOD(625),room:'Standard Room',location:'Cairo, Zamalek + Alexandria',nights:5},
  {id:12,title:'Velvet Hotel + Plaza Alex',arabic:'فندق فيلفيت + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(370),single:_calJOD(480),room:'Standard Room',location:'Cairo, Downtown + Alexandria',nights:7},
  {id:13,title:'Indiana Hotel + Plaza Alex',arabic:'فندق إنديانا + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(370),single:_calJOD(480),room:'Standard Room',location:'Cairo, Dokki + Alexandria',nights:7},
  {id:14,title:'Salma Hotel + Plaza Alex',arabic:'فندق سلمى + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(400),single:_calJOD(520),room:'Standard Room',location:'Cairo, Dokki + Alexandria',nights:7},
  {id:15,title:'Rixos Tower + Plaza Alex',arabic:'ريكسوس تاور + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(390),single:_calJOD(560),room:'Standard Room',location:'Cairo, Pyramids + Alexandria',nights:7},
  {id:16,title:'Cosmopolitan Hotel + Plaza Alex',arabic:'فندق كوزموبوليتان + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:3,meal:'BB',double:_calJOD(430),single:_calJOD(600),room:'Standard Room',location:'Cairo, Downtown + Alexandria',nights:7},
  {id:17,title:'Marwa Palace Hotel + Plaza Alex',arabic:'فندق مروة بالاس + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_calJOD(400),single:_calJOD(560),room:'Standard Room',location:'Cairo, Dokki + Alexandria',nights:7},
  {id:18,title:'Regency Pyramids Hotel + Plaza Alex',arabic:'ريجنسي بيراميدز + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_calJOD(430),single:_calJOD(620),room:'Standard Room',location:'Cairo, Pyramids + Alexandria',nights:7},
  {id:19,title:'Mar Charbel Hotel + Plaza Alex',arabic:'فندق مار شربل + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:4,meal:'BB',double:_calJOD(425),single:_calJOD(615),room:'Standard Room',location:'Cairo, Downtown + Alexandria',nights:7},
  {id:20,title:'Pyramisa Hotel + Plaza Alex',arabic:'فندق بيراميسا + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_calJOD(480),single:_calJOD(720),room:'Standard Room',location:'Cairo, Dokki + Alexandria',nights:7},
  {id:21,title:'Ramses Hilton + Plaza Alex',arabic:'رمسيس هيلتون + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_calJOD(510),single:_calJOD(800),room:'Standard Room',location:'Cairo, Downtown + Alexandria',nights:7},
  {id:22,title:'Hilton Grand Nile Tower + Plaza Alex',arabic:'هيلتون القاهرة غراند نايل + بلازا أليكس',subtitle:'Alexandria',route:'Amman \u2194 Cairo',stars:5,meal:'BB',double:_calJOD(550),single:_calJOD(840),room:'Standard Room',location:'Cairo, Zamalek + Alexandria',nights:7}
];
// ════════════════════════════════════════════════════════════════
// CAIRO, ALEXANDRIA & NORTH COAST PACKAGE DATA — Cairo + Alexandria + North Coast combined program
// ════════════════════════════════════════════════════════════════
var _calnRate = 0.71;
function _calnJOD(usd){return Math.round(usd*_calnRate);}

// 7-night itinerary (Cairo 3N + Alexandria 2N + North Coast 2N)
var CAIRO_ALEX_NORTHCOAST_ITINERARY_7 = [
  {day:'Day 1',titleAr:'وصول القاهرة',titleEn:'Arrival Cairo',
   items:[
     {ar:'الاستقبال في مطار القاهرة الدولي من قِبل مندوبنا',en:'Airport meet & assist at Cairo International Airport'},
     {ar:'التوجه إلى الفندق مع مرافق الرحلة المتخصص',en:'Transfer to hotel with specialist tour leader'},
     {ar:'استلام الغرف مع خدمة توصيل الحقائب',en:'Room check-in with luggage delivery service'},
     {ar:'التسكين والمبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 2',titleAr:'الأهرامات · أبو الهول · خان الخليلي · المعز',titleEn:'Pyramids · Sphinx · Khan Al Khalili · Al Muizz',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'زيارة الأهرامات الثلاثة — إحدى عجائب الدنيا السبع',en:'Visit the Three Pyramids of Giza — one of the Seven Wonders of the World'},
     {ar:'زيارة تمثال أبو الهول الضخم — أشهر المعالم الأثرية عالمياً',en:'Visit the Great Sphinx — one of the most famous archaeological monuments worldwide'},
     {ar:'استراحة مع مشروبات مجانية · متحف البردي وصناعته الفرعونية',en:'Refreshment break · Papyrus Museum — ancient Egyptian papyrus-making art'},
     {ar:'معرض المنسوجات القطنية',en:'Egyptian Cotton Textile showroom'},
     {ar:'خان الخليلي — أكبر بازار مغطى بالمشغولات اليدوية والذهب والهدايا',en:'Khan Al Khalili — Cairo\'s largest covered bazaar with crafts, gold & gifts'},
     {ar:'جولة في شارع المعز لدين الله الفاطمي',en:'Walk through Al Muizz Street — Fatimid Cairo'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 3',titleAr:'القاهرة — الإسكندرية',titleEn:'Cairo — Alexandria',
   items:[
     {ar:'الإفطار بالفندق وتسليم الغرف',en:'Breakfast at hotel & check-out'},
     {ar:'التوجه إلى مدينة الإسكندرية',en:'Drive to Alexandria (approx. 3 hrs)'},
     {ar:'زيارة كوبري ستانلي — معلم مميز على شاطئ المتوسط',en:'Visit Stanley Bridge — iconic Alexandria landmark on the Mediterranean'},
     {ar:'زيارة مسجد المرسي أبو العباس والتمتع بأجواء المدينة الساحلية',en:'Visit Al Mursi Abu Al Abbas Mosque & enjoy the coastal atmosphere'},
     {ar:'التسكين بالفندق أو التوجه اختيارياً لقرية أفريكانو',en:'Check-in to hotel OR optional visit to Africano Village'},
     {ar:'(اختياري) قرية أفريكانو: غابات أفريقية · حيوانات نادرة · مطاعم وكافيهات',en:'(Optional) Africano Village: African forest setting, exotic animals, restaurants & cafes'},
     {ar:'العودة للفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 4',titleAr:'يوم ثقافي وترفيهي في الإسكندرية',titleEn:'Cultural & Leisure Day — Alexandria',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'زيارة مكتبة الإسكندرية — امتداد للمكتبة القديمة التي شيدها بطليموس الثاني قبل أكثر من 23 قرناً، وأُحييت عام 2002',en:'Visit Bibliotheca Alexandrina — modern revival of the ancient library built by Ptolemy II over 23 centuries ago, reopened 2002'},
     {ar:'التوجه إلى جليم باي للاستمتاع بالغداء الاختياري مباشرة على البحر',en:'Head to Gleem Bay — optional lunch with direct Mediterranean sea views'},
     {ar:'وقت حر للاستمتاع بجمال مدينة الإسكندرية',en:'Free time to explore Alexandria at leisure'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 5',titleAr:'الإسكندرية — الساحل الشمالي',titleEn:'Alexandria — North Coast',
   items:[
     {ar:'الإفطار بالفندق وتسليم الغرف',en:'Breakfast at hotel & check-out'},
     {ar:'التوجه إلى الساحل الشمالي — بورتو مارينا',en:'Drive to North Coast — Porto Marina'},
     {ar:'التسكين في الفندق مع مرافق الرحلة المتخصص',en:'Check-in to hotel with specialist tour leader'},
     {ar:'استلام الغرف وخدمة توصيل الحقائب',en:'Room check-in with luggage delivery'},
     {ar:'الاستمتاع بالفندق وحمامات السباحة',en:'Enjoy hotel facilities & swimming pools'}]},
  {day:'Day 6',titleAr:'أنشطة ترفيهية ورحلات حرية',titleEn:'Water Sports & Free Excursions',
   items:[
     {ar:'الإفطار بالفندق والاستمتاع بالشاطئ',en:'Breakfast at hotel & beach time'},
     {ar:'(اختياري) أنشطة مائية: جيسكي · بنانا بوت · باراشوت مائي · رحلات بحرية',en:'(Optional) Water activities: Jet Ski · Banana Boat · Parasailing · Boat trips'},
     {ar:'(اختياري) جولة إلى مارينا: دخول شواطئ خاصة، حفلات DJ · بلاي دانسر · عروض سحرية',en:'(Optional) Marina tour: private beach clubs with DJ · Belly Dancer · Magic shows'},
     {ar:'(اختياري) مشاهدة أبراج العالمين · مقاهي ومطاعم المارينا والسهر ليلاً',en:'(Optional) El Alamein Tower views · Marina cafes & restaurants · evening nightlife'}]},
  {day:'Day 7',titleAr:'الساحل الشمالي — القاهرة · سهرة نيلية لا تُنسى',titleEn:'North Coast — Cairo · Unforgettable Nile Evening',
   items:[
     {ar:'الإفطار بالفندق وتسليم الغرف',en:'Breakfast at hotel & check-out'},
     {ar:'التوجه إلى القاهرة مع مرافق الرحلة المتخصص',en:'Drive back to Cairo with specialist tour leader'},
     {ar:'التسكين في الفندق واستلام الغرف مع خدمة توصيل الحقائب',en:'Check-in to Cairo hotel with luggage delivery'},
     {ar:'في المساء: سهرة مميزة على متن باخرة نيلية',en:'Evening: Nile Dinner Cruise experience'},
     {ar:'عشاء فاخر مع إطلالة ساحرة على نهر النيل',en:'Gourmet dinner with panoramic Nile River views'},
     {ar:'عروض ترفيهية: رقص شرقي · تنورة · فلكلور مصري أصيل',en:'Live entertainment: Oriental dance · Tanoura · authentic Egyptian folklore'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 8',titleAr:'العودة لأرض الوطن',titleEn:'Departure',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف ومغادرة الفندق',en:'Room check-out'},
     {ar:'التحرك إلى مطار القاهرة الدولي',en:'Transfer to Cairo International Airport'},
     {ar:'المغادرة — نتمنى لكم رحلة ممتعة وتجربة لا تُنسى',en:'Departure — wishing you a pleasant journey and unforgettable experience!'}]}
];

var CAIRO_ALEX_NORTHCOAST_PACKAGES = [
  {id:1,title:'Velvet Hotel + Plaza Alex + Retal View North Coast',arabic:'فندق فيلفيت + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_calnJOD(485),single:_calnJOD(615),room:'Standard Room',location:'Cairo, Downtown + Alexandria + North Coast',nights:7},
  {id:2,title:'Indiana Hotel + Plaza Alex + Retal View North Coast',arabic:'فندق إنديانا + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_calnJOD(485),single:_calnJOD(615),room:'Standard Room',location:'Cairo, Dokki + Alexandria + North Coast',nights:7},
  {id:3,title:'Salma Hotel + Plaza Alex + Retal View North Coast',arabic:'فندق سلمى + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_calnJOD(510),single:_calnJOD(645),room:'Standard Room',location:'Cairo, Dokki + Alexandria + North Coast',nights:7},
  {id:4,title:'Rixos Tower + Plaza Alex + Retal View North Coast',arabic:'ريكسوس تاور + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_calnJOD(500),single:_calnJOD(675),room:'Standard Room',location:'Cairo, Pyramids + Alexandria + North Coast',nights:7},
  {id:5,title:'Cosmopolitan Hotel + Plaza Alex + Retal View North Coast',arabic:'فندق كوزموبوليتان + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:3,meal:'BB+HB',double:_calnJOD(530),single:_calnJOD(705),room:'Standard Room',location:'Cairo, Downtown + Alexandria + North Coast',nights:7},
  {id:6,title:'Marwa Palace Hotel + Plaza Alex + Retal View North Coast',arabic:'فندق مروة بالاس + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:4,meal:'BB+HB',double:_calnJOD(510),single:_calnJOD(675),room:'Standard Room',location:'Cairo, Dokki + Alexandria + North Coast',nights:7},
  {id:7,title:'Regency Pyramids Hotel + Plaza Alex + Retal View North Coast',arabic:'ريجنسي بيراميدز + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:4,meal:'BB+HB',double:_calnJOD(530),single:_calnJOD(720),room:'Standard Room',location:'Cairo, Pyramids + Alexandria + North Coast',nights:7},
  {id:8,title:'Mar Charbel Hotel + Plaza Alex + Retal View North Coast',arabic:'فندق مار شربل + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:4,meal:'BB+HB',double:_calnJOD(525),single:_calnJOD(715),room:'Standard Room',location:'Cairo, Downtown + Alexandria + North Coast',nights:7},
  {id:9,title:'Pyramisa Hotel + Plaza Alex + Retal View North Coast',arabic:'فندق بيراميسا + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:5,meal:'BB+HB',double:_calnJOD(570),single:_calnJOD(795),room:'Standard Room',location:'Cairo, Dokki + Alexandria + North Coast',nights:7},
  {id:10,title:'Ramses Hilton + Plaza Alex + Retal View North Coast',arabic:'رمسيس هيلتون + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:5,meal:'BB+HB',double:_calnJOD(590),single:_calnJOD(855),room:'Standard Room',location:'Cairo, Downtown + Alexandria + North Coast',nights:7},
  {id:11,title:'Hilton Grand Nile Tower + Plaza Alex + Retal View North Coast',arabic:'هيلتون القاهرة غراند نايل + بلازا أليكس + ريتال فيو',subtitle:'Alexandria · North Coast',route:'Amman \u2194 Cairo',stars:5,meal:'BB+HB',double:_calnJOD(620),single:_calnJOD(885),room:'Standard Room',location:'Cairo, Zamalek + Alexandria + North Coast',nights:7}
];

var _alncRate = 0.71;
function _alncJOD(usd){return Math.round(usd*_alncRate);}
var ALEXANDRIA_NORTHCOAST_ITINERARY_5 = [
  {day:'Day 1',titleAr:'وصول الإسكندرية',titleEn:'Arrival Alexandria',
   items:[
     {ar:'الاستقبال في مطار برج العرب من قِبل مندوبنا',en:'Meet & assist at Borg al Arab Airport by our representative'},
     {ar:'التوجه إلى الفندق مع مرافق الرحلة المتخصص',en:'Transfer to hotel with specialist tour leader'},
     {ar:'استلام الغرف مع خدمة توصيل الحقائب',en:'Room check-in with luggage delivery service'},
     {ar:'التسكين والمبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 2',titleAr:'جولة اختيارية - الإسكندرية',titleEn:'Optional: Alexandria City Tour',
   items:[
     {ar:'الإفطار بالفندق صباحاً',en:'Breakfast at hotel'},
     {ar:'زيارة قلعة قايتباي من الخارج',en:'Visit Qaitbay Citadel (exterior)'},
     {ar:'كوبري ستانلي والاستمتاع بإطلالته المميزة',en:'Stanley Bridge - scenic waterfront views'},
     {ar:'زيارة مسجد المرسي أبو العباس',en:'Visit El Mursi Abul Abbas Mosque'},
     {ar:'جولة حرة في أسواق الإسكندرية',en:'Free stroll in Alexandria markets'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel - overnight'}]},
  {day:'Day 3',titleAr:'يوم اختياري ثقافي وترفيهي',titleEn:'Optional: Culture & Leisure Day',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'زيارة مكتبة الإسكندرية الحديثة',en:'Visit Bibliotheca Alexandrina'},
     {ar:'التوجه إلى جليم باي والاستمتاع بالغداء (اختياري) على البحر مباشرة',en:'Gleem Bay - optional seaside lunch'},
     {ar:'وقت حر للاستمتاع بجمال المدينة',en:'Free time to enjoy the city'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel - overnight'}]},
  {day:'Day 4',titleAr:'الإسكندرية - الساحل الشمالي',titleEn:'Alexandria - North Coast',
   items:[
     {ar:'الإفطار بالفندق صباحاً ثم تسليم الغرف',en:'Breakfast at hotel, then room check-out'},
     {ar:'التوجه إلى الساحل الشمالي مع مرافق الرحلة',en:'Transfer to North Coast with tour leader'},
     {ar:'استلام الغرف بفندق Retal View وخدمة توصيل الحقائب',en:'Check-in at Retal View with luggage delivery service'},
     {ar:'الاستمتاع بالفندق وحمامات السباحة',en:'Enjoy hotel facilities & swimming pools'}]},
  {day:'Day 5',titleAr:'أنشطة ترفيهية ورحلات بحرية',titleEn:'Beach Activities & Boat Trips',
   items:[
     {ar:'الإفطار بالفندق والاستمتاع بالشاطئ',en:'Breakfast at hotel & beach time'},
     {ar:'أنشطة مائية اختيارية (جيت سكي، بنانا بوت، باراشوت مائي) أو رحلات بحرية',en:'Optional water activities (jet-ski, banana boat, parasailing) or boat trips'},
     {ar:'جولة اختيارية حرة إلى مارينا ومشاهدة أبراج العالمين',en:'Optional visit to Marina & Alamein towers'},
     {ar:'المبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 6',titleAr:'العودة لأرض الوطن',titleEn:'Departure',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف ومغادرة الفندق',en:'Room check-out'},
     {ar:'التحرك إلى مطار برج العرب للمغادرة',en:'Transfer to Borg al Arab Airport'},
     {ar:'المغادرة - نتمنى لكم رحلة ممتعة',en:'Departure - safe travels!'}]}
];
var ALEXANDRIA_NORTHCOAST_PACKAGES = [
  {id:1,title:'Plaza Hotel',arabic:'فندق بلازا + ريتال فيو',subtitle:'Alexandria North Coast',route:'Amman - Alexandria',stars:3,meal:'BB+HB',double:_alncJOD(345),single:_alncJOD(490),room:'Standard Room',location:'El Raml Station + North Coast',nights:5},
  {id:2,title:'Romance Hotel',arabic:'فندق رومانس + ريتال فيو',subtitle:'Alexandria North Coast',route:'Amman - Alexandria',stars:3,meal:'BB+HB',double:_alncJOD(360),single:_alncJOD(520),room:'Standard Room',location:'El Raml Station + North Coast',nights:5},
  {id:3,title:'Eastern El Montazah',arabic:'إيسترن المنتزه + ريتال فيو',subtitle:'Alexandria North Coast',route:'Amman - Alexandria',stars:4,meal:'BB+HB',double:_alncJOD(375),single:_alncJOD(550),room:'Standard Room',location:'El Montazah + North Coast',nights:5},
  {id:4,title:'Hilton Green Plaza',arabic:'هيلتون جرين بلازا + ريتال فيو',subtitle:'Alexandria North Coast',route:'Amman - Alexandria',stars:4,meal:'BB+HB',double:_alncJOD(375),single:_alncJOD(550),room:'Standard Room',location:'Smouha + North Coast',nights:5},
  {id:5,title:'Paradise Inn Hotel',arabic:'فندق بارادايس إن + ريتال فيو',subtitle:'Alexandria North Coast',route:'Amman - Alexandria',stars:5,meal:'BB+HB',double:_alncJOD(440),single:_alncJOD(705),room:'Standard Room',location:'Maamoura + North Coast',nights:5}
];

// CAIRO & AIN SOKHNA — 5-NIGHT PACKAGE DATA
// ═══════════════════════════════════════════════════
var _casRate = 0.71;
function _casJOD(usd){return Math.round(usd*_casRate);}
var CAIRO_AIN_SOKHNA_PACKAGES = [
  {id:1,title:'Velvet Hotel + Retal View',arabic:'فندق فيلفيت + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:3,meal:'BB+HB',double:_casJOD(355),single:_casJOD(490),room:'Standard Room',location:'Cairo, Downtown + Ain Sokhna',nights:5},
  {id:2,title:'Indiana Hotel + Retal View',arabic:'فندق إنديانا + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:3,meal:'BB+HB',double:_casJOD(355),single:_casJOD(490),room:'Standard Room',location:'Cairo, Dokki + Ain Sokhna',nights:5},
  {id:3,title:'Salma Hotel + Retal View',arabic:'فندق سلمى + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:3,meal:'BB+HB',double:_casJOD(380),single:_casJOD(520),room:'Standard Room',location:'Cairo, Dokki + Ain Sokhna',nights:5},
  {id:4,title:'Rixos Tower + Retal View',arabic:'ريكسوس تاور + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:3,meal:'BB+HB',double:_casJOD(370),single:_casJOD(550),room:'Standard Room',location:'Cairo, Pyramids + Ain Sokhna',nights:5},
  {id:5,title:'Cosmopolitan Hotel + Retal View',arabic:'فندق كوزموبوليتان + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:3,meal:'BB+HB',double:_casJOD(400),single:_casJOD(580),room:'Standard Room',location:'Cairo, Downtown + Ain Sokhna',nights:5},
  {id:6,title:'Marwa Palace Hotel + Retal View',arabic:'فندق مروة بالاس + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:4,meal:'BB+HB',double:_casJOD(380),single:_casJOD(550),room:'Standard Room',location:'Cairo, Dokki + Ain Sokhna',nights:5},
  {id:7,title:'Regency Pyramids Hotel + Retal View',arabic:'ريجنسي بيراميدز + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:4,meal:'BB+HB',double:_casJOD(400),single:_casJOD(595),room:'Standard Room',location:'Cairo, Pyramids + Ain Sokhna',nights:5},
  {id:8,title:'Mar Charbel Hotel + Retal View',arabic:'فندق مار شربل + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:4,meal:'BB+HB',double:_casJOD(395),single:_casJOD(590),room:'Standard Room',location:'Cairo, Downtown + Ain Sokhna',nights:5},
  {id:9,title:'Pyramisa Hotel + Retal View',arabic:'فندق بيراميسا + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:5,meal:'BB+HB',double:_casJOD(440),single:_casJOD(670),room:'Standard Room',location:'Cairo, Dokki + Ain Sokhna',nights:5},
  {id:10,title:'Ramses Hilton + Retal View',arabic:'رمسيس هيلتون + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:5,meal:'BB+HB',double:_casJOD(460),single:_casJOD(730),room:'Standard Room',location:'Cairo, Downtown + Ain Sokhna',nights:5},
  {id:11,title:'Hilton Cairo Grand Nile Tower + Retal View',arabic:'هيلتون القاهرة غراند نايل + ريتال فيو',subtitle:'Cairo · Ain Sokhna',route:'Amman ↔ Cairo',stars:5,meal:'BB+HB',double:_casJOD(490),single:_casJOD(760),room:'Standard Room',location:'Cairo, Zamalek + Ain Sokhna',nights:5}
];
// CAIRO & AIN SOKHNA ITINERARY — 5 nights / 6 days
// ══════════════════════════════════════
var CAIRO_AIN_SOKHNA_ITINERARY = [
  {day:'Day 1',titleAr:'وصول القاهرة',titleEn:'Arrival Cairo',
   items:[
     {ar:'الاستقبال في مطار القاهرة الدولي من قِبل مندوبنا',en:'Airport meet & assist at Cairo International Airport'},
     {ar:'التوجه إلى الفندق مع مرافق الرحلة المتخصص',en:'Transfer to hotel with specialist tour leader'},
     {ar:'استلام الغرف مع خدمة توصيل الحقائب',en:'Room check-in with luggage delivery service'},
     {ar:'التسكين والمبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 2',titleAr:'الأهرامات · أبو الهول · خان الخليلي',titleEn:'Pyramids · Sphinx · Khan Al Khalili',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'زيارة منطقة الأهرامات الثلاثة — إحدى عجائب الدنيا السبع',en:'Visit the Three Great Pyramids of Giza'},
     {ar:'زيارة أبو الهول والتقاط الصور التذكارية',en:'Visit the Great Sphinx & photo stop'},
     {ar:'خان الخليلي والحسين — الأسواق القديمة والتحف والتوابل',en:'Khan Al Khalili & Al Hussein — ancient bazaar'},
     {ar:'المقاهي الشهيرة مثل الفيشاوي',en:'Famous cafés including El-Fishawy'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 3',titleAr:'القاهرة — العين السخنة',titleEn:'Cairo to Ain Sokhna',
   items:[
     {ar:'الإفطار في الفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف ومغادرة الفندق',en:'Room check-out'},
     {ar:'التحرك إلى العين السخنة مع مرافق الرحلة المتخصص',en:'Transfer to Ain Sokhna with specialist tour leader'},
     {ar:'استلام الغرف وخدمة توصيل الحقائب في فندق بورتو سخنة',en:'Check-in at Porto Sokhna — luggage delivery'},
     {ar:'الاستمتاع بالشاطئ وحمامات السباحة',en:'Enjoy the beach & swimming pools'},
     {ar:'المبيت بالفندق — نصف إقامة',en:'Overnight at hotel — Half Board'}]},
  {day:'Day 4',titleAr:'العين السخنة — يوم شاطئي كامل',titleEn:'Ain Sokhna — Full Beach Day',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'الاستمتاع بالشاطئ وحمامات السباحة طوال اليوم',en:'Full day at the beach & swimming pools'},
     {ar:'أنشطة مائية اختيارية',en:'Optional water activities'},
     {ar:'العشاء بالفندق — نصف إقامة',en:'Dinner at hotel — Half Board'},
     {ar:'المبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 5',titleAr:'الرجوع إلى القاهرة مع سهرة نيلية',titleEn:'Return to Cairo — Nile Evening',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف والرجوع إلى القاهرة',en:'Check-out & return to Cairo'},
     {ar:'التسكين بفندق القاهرة',en:'Check-in at Cairo hotel'},
     {ar:'في المساء: سهرة مميزة على متن باخرة نيلية',en:'Evening: Special Nile Dinner Cruise'},
     {ar:'عشاء فاخر مع إطلالة ساحرة على نهر النيل',en:'Gourmet dinner with panoramic Nile views'},
     {ar:'عروض ترفيهية: رقص شرقي، تنورة، فلكلور مصري',en:'Live entertainment: Oriental dance, Tanoura, Egyptian folklore'},
     {ar:'العودة إلى الفندق للمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 6',titleAr:'العودة لأرض الوطن',titleEn:'Departure',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'تسليم الغرف ومغادرة الفندق',en:'Room check-out'},
     {ar:'التحرك إلى مطار القاهرة الدولي',en:'Transfer to Cairo International Airport'},
     {ar:'المغادرة — نتمنى لكم رحلة ممتعة وتجربة لا تُنسى',en:'Departure — safe travels & unforgettable memories!'}]}
];

// CAIRO, ASWAN & LUXOR CRUISE — 7-NIGHT PACKAGE DATA
// ═══════════════════════════════════════════════════════════════════
var _cacRate = 0.71;
function _cacJOD(usd){return Math.round(usd*_cacRate);}
var CAIRO_ASWAN_LUXOR_CRUISE_PACKAGES = [
  {id:1,title:'Velvet Hotel + Nile Cruise',arabic:'فندق فيلفيت + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:3,meal:'BB+FB',double:_cacJOD(525),single:_cacJOD(665),room:'Standard Room',location:'Cairo, Downtown + Nile Cruise',nights:7},
  {id:2,title:'Indiana Hotel + Nile Cruise',arabic:'فندق إنديانا + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:3,meal:'BB+FB',double:_cacJOD(525),single:_cacJOD(665),room:'Standard Room',location:'Cairo, Dokki + Nile Cruise',nights:7},
  {id:3,title:'Salma Hotel + Nile Cruise',arabic:'فندق سلمى + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:3,meal:'BB+FB',double:_cacJOD(545),single:_cacJOD(685),room:'Standard Room',location:'Cairo, Dokki + Nile Cruise',nights:7},
  {id:4,title:'Rixos Tower + Nile Cruise',arabic:'ريكسوس تاور + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:3,meal:'BB+FB',double:_cacJOD(535),single:_cacJOD(705),room:'Standard Room',location:'Cairo, Pyramids + Nile Cruise',nights:7},
  {id:5,title:'Cosmopolitan Hotel + Nile Cruise',arabic:'فندق كوزموبوليتان + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:3,meal:'BB+FB',double:_cacJOD(555),single:_cacJOD(725),room:'Standard Room',location:'Cairo, Downtown + Nile Cruise',nights:7},
  {id:6,title:'Marwa Palace Hotel + Nile Cruise',arabic:'فندق مروة بالاس + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:4,meal:'BB+FB',double:_cacJOD(555),single:_cacJOD(725),room:'Standard Room',location:'Cairo, Dokki + Nile Cruise',nights:7},
  {id:7,title:'Regency Pyramids Hotel + Nile Cruise',arabic:'ريجنسي بيراميدز + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:4,meal:'BB+FB',double:_cacJOD(555),single:_cacJOD(735),room:'Standard Room',location:'Cairo, Pyramids + Nile Cruise',nights:7},
  {id:8,title:'Mar Charbel Hotel + Nile Cruise',arabic:'فندق مار شربل + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:4,meal:'BB+FB',double:_cacJOD(560),single:_cacJOD(750),room:'Standard Room',location:'Cairo, Downtown + Nile Cruise',nights:7},
  {id:9,title:'Pyramisa Hotel + Nile Cruise',arabic:'فندق بيراميسا + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:5,meal:'BB+FB',double:_cacJOD(580),single:_cacJOD(785),room:'Standard Room',location:'Cairo, Dokki + Nile Cruise',nights:7},
  {id:10,title:'Ramses Hilton + Nile Cruise',arabic:'رمسيس هيلتون + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:5,meal:'BB+FB',double:_cacJOD(595),single:_cacJOD(825),room:'Standard Room',location:'Cairo, Downtown + Nile Cruise',nights:7},
  {id:11,title:'Hilton Cairo Grand Nile Tower + Nile Cruise',arabic:'هيلتون القاهرة غراند نايل + كروز نيل',subtitle:'Cairo · Aswan · Luxor',route:'Amman ↔ Cairo',stars:5,meal:'BB+FB',double:_cacJOD(615),single:_cacJOD(845),room:'Standard Room',location:'Cairo, Zamalek + Nile Cruise',nights:7}
];
// CAIRO, ASWAN & LUXOR CRUISE ITINERARY — 7 nights / 8 days
// ══════════════════════════════════════════════════
var CAIRO_ASWAN_LUXOR_CRUISE_ITINERARY_7 = [
  {day:'Day 1',titleAr:'وصول القاهرة',titleEn:'Arrival Cairo',
   items:[
     {ar:'الاستقبال في مطار القاهرة الدولي من قِبل مندوبنا',en:'Airport meet & assist at Cairo International Airport'},
     {ar:'التوجه إلى الفندق مع مرافق الرحلة المتخصص',en:'Transfer to hotel with specialist tour leader'},
     {ar:'استلام الغرف مع خدمة توصيل الحقائب',en:'Room check-in with luggage delivery service'},
     {ar:'التسكين والمبيت بالفندق',en:'Overnight at hotel'}]},
  {day:'Day 2',titleAr:'الأهرامات · أبو الهول · المتحف المصري · خان الخليلي',titleEn:'Pyramids · Sphinx · Egyptian Museum · Khan Al Khalili',
   items:[
     {ar:'الإفطار بالفندق',en:'Breakfast at hotel'},
     {ar:'زيارة الأهرامات الثلاثة — إحدى عجائب الدنيا السبع',en:'Visit the Three Pyramids of Giza — one of the Seven Wonders'},
     {ar:'زيارة تمثال أبو الهول — أشهر المعالم الأثرية عالمياً',en:'Visit the Great Sphinx — world-famous monument'},
     {ar:'زيارة المتحف المصري بالتحرير — كنوز توت عنخ آمون',en:'Visit the Egyptian Museum — King Tutankhamun treasures'},
     {ar:'خان الخليلي — أكبر بازار بالمشغولات اليدوية والذهب والهدايا',en:'Khan Al Khalili — Cairo\'s largest bazaar'},
     {ar:'في المساء: سهرة مميزة على متن باخرة نيلية',en:'Evening: Nile Dinner Cruise'},
     {ar:'عشاء فاخر مع إطلالة ساحرة على نهر النيل',en:'Gourmet dinner with panoramic Nile views'},
     {ar:'عروض ترفيهية: رقص شرقي · تنورة · فلكلور مصري',en:'Live entertainment: Oriental dance · Tanoura · Egyptian folklore'},
     {ar:'العودة إلى الفندق والمبيت',en:'Return to hotel — overnight'}]},
  {day:'Day 3',titleAr:'القاهرة — أسوان (قطار الليل)',titleEn:'Cairo to Aswan (Overnight Train)',
   items:[
     {ar:'الإفطار بالفندق وتسليم الغرف',en:'Breakfast at hotel & check-out'},
     {ar:'جولة حرة في القاهرة أو زيارة قلعة صلاح الدين',en:'Free time in Cairo or visit Salah El-Din Citadel'},
     {ar:'التوجه إلى محطة قطار رمسيس',en:'Transfer to Ramses Train Station'},
     {ar:'ركوب قطار الليل المتجه إلى أسوان (مقصورة خاصة)',en:'Board overnight sleeper train to Aswan (private cabin)'},
     {ar:'العشاء على متن القطار',en:'Dinner on board the train'},
     {ar:'المبيت على متن القطار',en:'Overnight on the train'}]},
  {day:'Day 4',titleAr:'وصول أسوان · السد العالي · معبد فيلة · المسلة الناقصة',titleEn:'Arrival Aswan · High Dam · Philae Temple · Unfinished Obelisk',
   items:[
     {ar:'الوصول إلى أسوان والاستقبال من قِبل مندوبنا',en:'Arrival in Aswan — meet & assist'},
     {ar:'التوجه إلى مرسى النيل والصعود إلى مركب النيل (كروز)',en:'Transfer to Nile Cruise boat — check-in'},
     {ar:'زيارة السد العالي — أعظم مشروع مائي في القرن العشرين',en:'Visit the High Dam — greatest 20th-century water project'},
     {ar:'زيارة معبد فيلة — معبد الإيزيس على جزيرة فيلة',en:'Visit Philae Temple — Temple of Isis on Philae Island'},
     {ar:'زيارة المسلة الناقصة — أكبر قطعة حجرية منحوتة',en:'Visit the Unfinished Obelisk — largest known ancient obelisk'},
     {ar:'التسكين في الكروز واستلام الكبائن',en:'Settle into Nile Cruise cabins'},
     {ar:'العشاء والمبيت على متن الكروز',en:'Dinner & overnight on Nile Cruise'}]},
  {day:'Day 5',titleAr:'الإبحار إلى الأقصر · كوم أمبو · إدفو',titleEn:'Sailing to Luxor · Kom Ombo · Edfu',
   items:[
     {ar:'الإفطار على متن الكروز',en:'Breakfast on board'},
     {ar:'الإبحار شمالاً باتجاه الأقصر',en:'Sail north towards Luxor'},
     {ar:'زيارة معبد كوم أمبو — معبد الإله سوبك وحورس',en:'Visit Kom Ombo Temple — the double temple of Sobek & Horus'},
     {ar:'مشاهدة القفل الملاحي والاستمتاع بإطلالة النيل',en:'Watch the navigation lock & enjoy Nile views'},
     {ar:'زيارة معبد إدفو — معبد الإله حورس (أفضل المعابد حفظاً)',en:'Visit Edfu Temple — best-preserved temple of Horus'},
     {ar:'استمرار الإبحار والعشاء على متن الكروز',en:'Continue sailing & dinner on board'},
     {ar:'المبيت على متن الكروز',en:'Overnight on Nile Cruise'}]},
  {day:'Day 6',titleAr:'الأقصر · وادي الملوك · معبد الكرنك · معبد حتشبسوت',titleEn:'Luxor · Valley of the Kings · Karnak · Hatshepsut Temple',
   items:[
     {ar:'الإفطار على متن الكروز',en:'Breakfast on board'},
     {ar:'زيارة وادي الملوك — مقابر الفراعنة العظام',en:'Visit the Valley of the Kings — tombs of the great Pharaohs'},
     {ar:'زيارة معبد حتشبسوت بالدير البحري',en:'Visit Hatshepsut Temple at Deir el-Bahari'},
     {ar:'زيارة تمثالي ممنون — العملاقين الجالسَيْن',en:'Visit the Colossi of Memnon — the two seated giants'},
     {ar:'الغداء على متن الكروز',en:'Lunch on board'},
     {ar:'زيارة معبد الكرنك — أعظم دور العبادة في التاريخ',en:'Visit Karnak Temple — the greatest place of worship ever built'},
     {ar:'العشاء والمبيت على متن الكروز',en:'Dinner & overnight on Nile Cruise'}]},
  {day:'Day 7',titleAr:'الأقصر — القاهرة (قطار الليل)',titleEn:'Luxor to Cairo (Overnight Train)',
   items:[
     {ar:'الإفطار وتسليم الكبائن على الكروز',en:'Breakfast & check-out from cruise'},
     {ar:'زيارة معبد الأقصر — تحفة معمارية فرعونية',en:'Visit Luxor Temple — magnificent pharaonic architecture'},
     {ar:'وقت حر للتسوق في سوق الأقصر',en:'Free time for shopping at Luxor Souq'},
     {ar:'التوجه إلى محطة قطار الأقصر',en:'Transfer to Luxor train station'},
     {ar:'ركوب قطار الليل المتجه إلى القاهرة (مقصورة خاصة)',en:'Board overnight sleeper train to Cairo (private cabin)'},
     {ar:'العشاء على متن القطار',en:'Dinner on board'},
     {ar:'المبيت على متن القطار',en:'Overnight on the train'}]},
  {day:'Day 8',titleAr:'العودة لأرض الوطن',titleEn:'Departure',
   items:[
     {ar:'الوصول إلى القاهرة صباحاً',en:'Arrival in Cairo in the morning'},
     {ar:'التوجه إلى مطار القاهرة الدولي',en:'Transfer to Cairo International Airport'},
     {ar:'المغادرة — نتمنى لكم رحلة ممتعة وتجربة لا تُنسى',en:'Departure — safe travels & unforgettable memories!'}]}
];

// CAIRO, ASWAN & LUXOR CRUISE — State & handler functions
var CAC_ACTIVE_ID = null;
var CAC_ACTIVE_TAB = 'pricing';
var CAC_CUR_NIGHTS = 0;
function cacSetNights(n){CAC_CUR_NIGHTS=n;CAC_ACTIVE_ID=null;renderDest('cairo-aswan-luxor-cruise');}
function cacShowDetail(id){
  CAC_ACTIVE_ID = CAC_ACTIVE_ID===id?null:id;
  CAC_ACTIVE_TAB = 'pricing';
  renderDest('cairo-aswan-luxor-cruise');
  setTimeout(function(){
    var el=document.getElementById('cac-detail');
    if(el&&CAC_ACTIVE_ID)el.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}
function cacSwitchTab(t){CAC_ACTIVE_TAB=t;cacRenderDetail();}
function cacCloseDetail(){CAC_ACTIVE_ID=null;renderDest('cairo-aswan-luxor-cruise');}
function cacPrintPkg(id,title){_fePrintAction(id,title,'cac',CAIRO_ASWAN_LUXOR_CRUISE_PACKAGES,false);}
function cacPdfPkg(id,title){_fePrintAction(id,title,'cac',CAIRO_ASWAN_LUXOR_CRUISE_PACKAGES,true);}
function cacShowAllTabs(){
  ['cac-tab-pricing','cac-tab-itinerary','cac-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function cacRestoreTabs(){
  var t=CAC_ACTIVE_TAB;
  ['cac-tab-pricing','cac-tab-itinerary','cac-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='cac-tab-pricing'?t==='pricing':id==='cac-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function cacRenderDetail(){
  var panel = document.getElementById('cac-detail');
  if(!CAC_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = CAIRO_ASWAN_LUXOR_CRUISE_PACKAGES.find(function(x){return x.id===CAC_ACTIVE_ID;});
  if(!p){panel.style.display='none';return;}
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '\u2605'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel · الفندق</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'<br><span style="color:var(--gold);font-size:10px">'+p.arabic+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'Cairo, Aswan & Luxor Cruise\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">★ All prices in JOD per person · '+p.nights+' nights / '+(p.nights+1)+' days · Route: '+p.route+'</div>';
  var itinVar = CAIRO_ASWAN_LUXOR_CRUISE_ITINERARY_7;
  var itinHtml = '<div style="margin-bottom:12px;font-size:12px;font-weight:700;color:var(--gold)">📅 Program: '+(p.nights+1)+' days / '+p.nights+' nights</div>'+
    itinVar.map(function(d){
      return '<div style="margin-bottom:14px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border)">'+
        '<div style="font-size:10px;font-weight:700;color:var(--teal);text-transform:uppercase;margin-bottom:4px">'+d.day+'</div>'+
        '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:2px">'+d.titleAr+'</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+d.titleEn+'</div>'+
        '<div style="padding-right:10px;border-right:2px solid var(--gold-light)">'+
          d.items.map(function(i){return '<div style="padding:2px 0;font-size:12px;line-height:1.5">• '+i.ar+' <span style="color:var(--muted);font-size:11px">· '+i.en+'</span></div>';}).join('')+
        '</div></div>';
    }).join('');
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.title+' · '+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Round-trip flight (Amman ↔ Cairo)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Airport meet &amp; assist + all transfers</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ 2N Cairo hotel (BB) + 2N overnight train + 3N Nile Cruise (FB)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Pyramids, Sphinx, Egyptian Museum, High Dam, Philae Temple, Valley of the Kings, Karnak</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Nile Dinner Cruise (evening entertainment)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ All transfers Cairo ↔ Aswan/Luxor (sleeper train)</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Egypt e-visa fee</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional excursions &amp; entry fees to tombs inside Valley of the Kings</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Personal expenses</li>'+
    '</ul>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary',icon:'📄'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="cac-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="cacPrintPkg('+vId+',\''+p.title.replace(/'/g,"\\'")+' - '+p.arabic.replace(/'/g,"\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>'+
        '<button onclick="cacPdfPkg('+vId+',\''+p.title.replace(/'/g,"\\'")+' - '+p.arabic.replace(/'/g,"\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>'+
        '<button onclick="cacCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="cacSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(CAC_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(CAC_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="cac-tab-pricing" style="display:'+(CAC_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="cac-tab-itinerary" style="display:'+(CAC_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="cac-tab-info" style="display:'+(CAC_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}

var CAS_ACTIVE_ID = null;
var CAS_ACTIVE_TAB = 'pricing';
var CAS_CUR_NIGHTS = 0;
function casSetNights(n){CAS_CUR_NIGHTS=n;CAS_ACTIVE_ID=null;renderDest('cairo-ain-sokhna');}
function casShowDetail(id){
  CAS_ACTIVE_ID = CAS_ACTIVE_ID===id?null:id;
  CAS_ACTIVE_TAB = 'pricing';
  renderDest('cairo-ain-sokhna');
  setTimeout(function(){
    var el=document.getElementById('cas-detail');
    if(el&&CAS_ACTIVE_ID)el.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}
function casSwitchTab(t){CAS_ACTIVE_TAB=t;casRenderDetail();}
function casCloseDetail(){CAS_ACTIVE_ID=null;renderDest('cairo-ain-sokhna');}
function casPrintPkg(id,title){_fePrintAction(id,title,'cas',CAIRO_AIN_SOKHNA_PACKAGES,false);}
function casPdfPkg(id,title){_fePrintAction(id,title,'cas',CAIRO_AIN_SOKHNA_PACKAGES,true);}
function casShowAllTabs(){
  ['cas-tab-pricing','cas-tab-itinerary','cas-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function casRestoreTabs(){
  var t=CAS_ACTIVE_TAB;
  ['cas-tab-pricing','cas-tab-itinerary','cas-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='cas-tab-pricing'?t==='pricing':id==='cas-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function casRenderDetail(){
  var panel = document.getElementById('cas-detail');
  if(!CAS_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = CAIRO_AIN_SOKHNA_PACKAGES.find(function(x){return x.id===CAS_ACTIVE_ID;});
  if(!p){panel.style.display='none';return;}
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '\u2605'.repeat(s);};
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel \u00b7 \u0627\u0644\u0641\u0646\u062f\u0642</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'<br><span style="color:var(--gold);font-size:10px">'+p.arabic+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\\'")+'\',destination:\'Cairo & Ain Sokhna\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">\uD83D\uDCF2 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">\u2605 All prices in JOD per person \u00b7 '+p.nights+' nights / '+(p.nights+1)+' days \u00b7 Route: '+p.route+'</div>';
  var itinVar = CAIRO_AIN_SOKHNA_ITINERARY;
  var itinHtml = '<div style="margin-bottom:12px;font-size:12px;font-weight:700;color:var(--gold)">\uD83D\uDCC5 Program: '+(p.nights+1)+' days / '+p.nights+' nights</div>'+
    itinVar.map(function(d){
      return '<div style="margin-bottom:14px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border)">'+
        '<div style="font-size:10px;font-weight:700;color:var(--teal);text-transform:uppercase;margin-bottom:4px">'+d.day+'</div>'+
        '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:2px">'+d.titleAr+'</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+d.titleEn+'</div>'+
        '<div style="padding-right:10px;border-right:2px solid var(--gold-light)">'+
          d.items.map(function(i){return '<div style="padding:2px 0;font-size:12px;line-height:1.5">\u2022 '+i.ar+' <span style="color:var(--muted);font-size:11px">\u00b7 '+i.en+'</span></div>';}).join('')+
        '</div></div>';
    }).join('');
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.title+' \u00b7 '+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Airport meet &amp; assist + all transfers</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 3N Cairo (BB) + 2N Porto Sokhna (HB)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Pyramids, Sphinx, Khan Al Khalili, Nile Dinner Cruise</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Flight ticket</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Egypt e-visa fee</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Personal expenses</li>'+
    '</ul>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'\uD83D\uDCB0'},
    {id:'itinerary',label:'Itinerary',icon:'\uD83D\uDCC4'},
    {id:'info',label:'Details & Inclusions',icon:'\u2139\uFE0F'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="cas-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="casPrintPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDDA8\uFE0F Print</button>'+
        '<button onclick="casPdfPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDCC4 PDF</button>'+
        '<button onclick="casCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">\u2715</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="casSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(CAS_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(CAS_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="cas-tab-pricing" style="display:'+(CAS_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="cas-tab-itinerary" style="display:'+(CAS_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="cas-tab-info" style="display:'+(CAS_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}

var CALN_ACTIVE_ID = null;
var CALN_ACTIVE_TAB = 'pricing';
var CALN_CUR_NIGHTS = 0;
function calnSetNights(n){CALN_CUR_NIGHTS=n;CALN_ACTIVE_ID=null;renderDest('cairo-alex-northcoast');}
function calnShowDetail(id){
  CALN_ACTIVE_ID = CALN_ACTIVE_ID===id?null:id;
  CALN_ACTIVE_TAB = 'pricing';
  renderDest('cairo-alex-northcoast');
  setTimeout(function(){
    var el=document.getElementById('caln-detail');
    if(el&&CALN_ACTIVE_ID)el.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}
function calnSwitchTab(t){CALN_ACTIVE_TAB=t;calnRenderDetail();}
function calnCloseDetail(){CALN_ACTIVE_ID=null;renderDest('cairo-alex-northcoast');}
function calnPrintPkg(id,title){_fePrintAction(id,title,'caln',CAIRO_ALEX_NORTHCOAST_PACKAGES,false);}
function calnPdfPkg(id,title){_fePrintAction(id,title,'caln',CAIRO_ALEX_NORTHCOAST_PACKAGES,true);}
function calnShowAllTabs(){
  ['caln-tab-pricing','caln-tab-itinerary','caln-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function calnRestoreTabs(){
  var t=CALN_ACTIVE_TAB;
  ['caln-tab-pricing','caln-tab-itinerary','caln-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='caln-tab-pricing'?t==='pricing':id==='caln-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function calnRenderDetail(){
  var panel = document.getElementById('caln-detail');
  if(!CALN_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = CAIRO_ALEX_NORTHCOAST_PACKAGES.find(function(x){return x.id===CALN_ACTIVE_ID;});
  if(!p){panel.style.display='none';return;}
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '\u2605'.repeat(s);};
  var itinVar = CAIRO_ALEX_NORTHCOAST_ITINERARY_7;
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel \u00b7 \u0627\u0644\u0641\u0646\u062f\u0642</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'<br><span style="color:var(--gold);font-size:10px">'+p.arabic+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'Cairo, Alexandria & North Coast\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">\uD83D\uDCF2 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">\u2605 All prices in JOD per person \u00b7 '+p.nights+' nights / '+(p.nights+1)+' days \u00b7 Route: '+p.route+'</div>';
  var itinHtml = '<div style="margin-bottom:12px;font-size:12px;font-weight:700;color:var(--gold)">\uD83D\uDCC5 Program: '+(p.nights+1)+' days / '+p.nights+' nights</div>'+
    itinVar.map(function(d){
      return '<div style="margin-bottom:14px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border)">'+
        '<div style="font-size:10px;font-weight:700;color:var(--teal);text-transform:uppercase;margin-bottom:4px">'+d.day+'</div>'+
        '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:2px">'+d.titleAr+'</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+d.titleEn+'</div>'+
        '<div style="padding-right:10px;border-right:2px solid var(--gold-light)">'+
          d.items.map(function(i){return '<div style="padding:2px 0;font-size:12px;line-height:1.5">\u2022 '+i.ar+' <span style="color:var(--muted);font-size:11px">\u00b7 '+i.en+'</span></div>';}).join('')+
        '</div></div>';
    }).join('');
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.title+' \u00b7 '+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Round-trip flight (Amman \u2194 Cairo)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Airport meet &amp; assist + transfers</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 3N Cairo (BB) + 2N Alexandria Plaza (BB) + 2N Porto Marina North Coast (HB)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Pyramids, Sphinx, Khan Al Khalili, Bibliotheca, Nile Dinner Cruise</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 All transfers Cairo \u2194 Alexandria \u2194 North Coast</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Egypt e-visa fee</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Optional excursions &amp; water sports</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Personal expenses</li>'+
    '</ul>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'\uD83D\uDCB0'},
    {id:'itinerary',label:'Itinerary',icon:'\uD83D\uDCC4'},
    {id:'info',label:'Details & Inclusions',icon:'\u2139\uFE0F'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="caln-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="calnPrintPkg('+vId+',\''+p.title.replace(/'/g,"\\'")+' - '+p.arabic.replace(/'/g,"\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDDA8\uFE0F Print</button>'+
        '<button onclick="calnPdfPkg('+vId+',\''+p.title.replace(/'/g,"\\'")+' - '+p.arabic.replace(/'/g,"\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDCC4 PDF</button>'+
        '<button onclick="calnCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">\u2715</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="calnSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(CALN_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(CALN_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="caln-tab-pricing" style="display:'+(CALN_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="caln-tab-itinerary" style="display:'+(CALN_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="caln-tab-info" style="display:'+(CALN_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}

var ALN_ACTIVE_ID = null;
var ALN_ACTIVE_TAB = 'pricing';
var ALN_CUR_NIGHTS = 0;
function alncSetNights(n){ALN_CUR_NIGHTS=n;ALN_ACTIVE_ID=null;renderDest('alexandria-northcoast');}
function alncShowDetail(id){
  ALN_ACTIVE_ID = ALN_ACTIVE_ID===id?null:id;
  ALN_ACTIVE_TAB = 'pricing';
  renderDest('alexandria-northcoast');
  setTimeout(function(){
    var el=document.getElementById('aln-detail');
    if(el&&ALN_ACTIVE_ID)el.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}
function alncSwitchTab(t){ALN_ACTIVE_TAB=t;alncRenderDetail();}
function alncCloseDetail(){ALN_ACTIVE_ID=null;renderDest('alexandria-northcoast');}
function alncPrintPkg(id,title){_fePrintAction(id,title,'aln',ALEXANDRIA_NORTHCOAST_PACKAGES,false);}
function alncPdfPkg(id,title){_fePrintAction(id,title,'aln',ALEXANDRIA_NORTHCOAST_PACKAGES,true);}
function alncShowAllTabs(){
  ['aln-tab-pricing','aln-tab-itinerary','aln-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function alncRestoreTabs(){
  var t=ALN_ACTIVE_TAB;
  ['aln-tab-pricing','aln-tab-itinerary','aln-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='aln-tab-pricing'?t==='pricing':id==='aln-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function alncRenderDetail(){
  var panel = document.getElementById('aln-detail');
  if(!ALN_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = ALEXANDRIA_NORTHCOAST_PACKAGES.find(function(x){return x.id===ALN_ACTIVE_ID;});
  if(!p){panel.style.display='none';return;}
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '★'.repeat(s);};
  var itinVar = ALEXANDRIA_NORTHCOAST_ITINERARY_5;
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel · الفندق</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'<br><span style="color:var(--gold);font-size:10px">'+p.arabic+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'Alexandria & North Coast\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">📲 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">★ All prices in JOD per person · '+p.nights+' nights / '+(p.nights+1)+' days · Route: '+p.route+'</div>';
  var itinHtml = '<div style="margin-bottom:12px;font-size:12px;font-weight:700;color:var(--gold)">📅 Program: '+(p.nights+1)+' days / '+p.nights+' nights</div>'+
    itinVar.map(function(d){
      return '<div style="margin-bottom:14px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border)">'+
        '<div style="font-size:10px;font-weight:700;color:var(--teal);text-transform:uppercase;margin-bottom:4px">'+d.day+'</div>'+
        '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:2px">'+d.titleAr+'</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+d.titleEn+'</div>'+
        '<div style="padding-right:10px;border-right:2px solid var(--gold-light)">'+
          d.items.map(function(i){return '<div style="padding:2px 0;font-size:12px;line-height:1.5">• '+i.ar+' <span style="color:var(--muted);font-size:11px">· '+i.en+'</span></div>';}).join('')+
        '</div></div>';
    }).join('');
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.title+' · '+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Meet & assist at Borg al Arab Airport (arrival & departure)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ 3N Alexandria (BB) + 2N North Coast Retal View (HB)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">✅ Transfers Alexandria ↔ North Coast</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Flight ticket</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Optional tours</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Personal expenses</li>'+
    '</ul>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary',icon:'📄'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="aln-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="alncPrintPkg('+vId+',\''+p.title.replace(/'/g,"\\'")+' - '+p.arabic.replace(/'/g,"\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">🖨️ Print</button>'+
        '<button onclick="alncPdfPkg('+vId+',\''+p.title.replace(/'/g,"\\'")+' - '+p.arabic.replace(/'/g,"\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">📄 PDF</button>'+
        '<button onclick="alncCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">✕</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="alncSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(ALN_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(ALN_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="aln-tab-pricing" style="display:'+(ALN_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="aln-tab-itinerary" style="display:'+(ALN_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="aln-tab-info" style="display:'+(ALN_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}

var CAL_ACTIVE_ID = null;
var CAL_ACTIVE_TAB = 'pricing';
var CAL_CUR_NIGHTS = 0;
function calSetNights(n){CAL_CUR_NIGHTS=n;CAL_ACTIVE_ID=null;renderDest('cairo-alexandria');}
function calShowDetail(id){
  CAL_ACTIVE_ID = CAL_ACTIVE_ID===id?null:id;
  CAL_ACTIVE_TAB = 'pricing';
  renderDest('cairo-alexandria');
  setTimeout(function(){
    var el=document.getElementById('cal-detail');
    if(el&&CAL_ACTIVE_ID)el.scrollIntoView({behavior:'smooth',block:'start'});
  },150);
}
function calSwitchTab(t){CAL_ACTIVE_TAB=t;calRenderDetail();}
function calCloseDetail(){CAL_ACTIVE_ID=null;renderDest('cairo-alexandria');}
function calShowAllTabs(){
  ['cal-tab-pricing','cal-tab-itinerary','cal-tab-info'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='block';
  });
}
function calRestoreTabs(){
  var t=CAL_ACTIVE_TAB;
  ['cal-tab-pricing','cal-tab-itinerary','cal-tab-info'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=(id==='cal-tab-pricing'?t==='pricing':id==='cal-tab-itinerary'?t==='itinerary':t==='info')?'block':'none';
  });
}
function calPrintPkg(id,title){_fePrintAction(id,title,'cal',CAIRO_ALEXANDRIA_PACKAGES,false);}
function calPdfPkg(id,title){_fePrintAction(id,title,'cal',CAIRO_ALEXANDRIA_PACKAGES,true);}
function calRenderDetail(){
  var panel = document.getElementById('cal-detail');
  if(!CAL_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  var p = CAIRO_ALEXANDRIA_PACKAGES.find(function(x){return x.id===CAL_ACTIVE_ID;});
  if(!p){panel.style.display='none';return;}
  var fmt = function(v){return (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';};
  var starsStr = function(s){return '\u2605'.repeat(s);};
  var itinVar = p.nights===5 ? CAIRO_ALEXANDRIA_ITINERARY_5 : CAIRO_ALEXANDRIA_ITINERARY_7;
  var pricingHtml = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'+
    '<thead><tr>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Hotel \u00b7 \u0627\u0644\u0641\u0646\u062f\u0642</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Stars</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Room Type</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Meal</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Double (p.p)</th>'+
      '<th style="text-align:right;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px">Single</th>'+
      '<th style="text-align:center;padding:8px 10px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:11px"></th>'+
    '</tr></thead><tbody>'+
    '<tr>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:11px;font-weight:500;line-height:1.3">'+p.title+'<br><span style="color:var(--gold);font-size:10px">'+p.arabic+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--gold);font-size:11px" dir="ltr">'+starsStr(p.stars)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:10px;color:var(--muted)">'+p.room+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border)"><span style="background:rgba(39,174,96,.15);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">'+p.meal+'</span></td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">'+fmt(p.double)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);font-weight:700">'+fmt(p.single)+'</td>'+
      '<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\\'")+'\',destination:\'Cairo & Alexandria\',nights:'+p.nights+',price:\''+p.double+'\'})" style="padding:4px 10px;background:#25D366;border:none;border-radius:5px;color:#fff;font-family:Cairo,sans-serif;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap">\uD83D\uDCF2 Book</button></td>'+
    '</tr></tbody></table></div>'+
    '<div style="margin-top:10px;font-size:11px;color:var(--muted);line-height:1.8">\u2605 All prices in JOD per person \u00b7 '+p.nights+' nights / '+(p.nights+1)+' days \u00b7 Route: '+p.route+'</div>';
  var itinHtml = '<div style="margin-bottom:12px;font-size:12px;font-weight:700;color:var(--gold)">\uD83D\uDCC5 Program: '+(p.nights+1)+' days / '+p.nights+' nights</div>'+
    itinVar.map(function(d){
      return '<div style="margin-bottom:14px;padding:10px 12px;background:var(--card2);border-radius:10px;border:1px solid var(--border)">'+
        '<div style="font-size:10px;font-weight:700;color:var(--teal);text-transform:uppercase;margin-bottom:4px">'+d.day+'</div>'+
        '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:2px">'+d.titleAr+'</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-bottom:6px">'+d.titleEn+'</div>'+
        '<div style="padding-right:10px;border-right:2px solid var(--gold-light)">'+
          d.items.map(function(i){return '<div style="padding:2px 0;font-size:12px;line-height:1.5">\u2022 '+i.ar+' <span style="color:var(--muted);font-size:11px">\u00b7 '+i.en+'</span></div>';}).join('')+
        '</div></div>';
    }).join('');
  var infoHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Duration</div>'+
      '<div style="font-weight:700;font-size:13px">'+(p.nights+1)+' days / '+p.nights+' nights</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Flight Route</div>'+
      '<div style="font-weight:700;font-size:12px">'+p.route+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Accommodation</div>'+
      '<div style="font-weight:700;font-size:11px;line-height:1.4">'+p.title+' \u00b7 '+p.location+'</div></div>'+
    '<div style="background:var(--card2);border-radius:10px;padding:12px;border:1px solid var(--border)">'+
      '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">Meal Plan</div>'+
      '<div style="font-weight:700">'+p.meal+'</div></div></div>'+
    '<div style="font-weight:700;color:var(--gold);margin-bottom:8px;font-size:12px">What\'s Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Round-trip flight (Amman \u2194 Cairo)</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Airport meet &amp; assist + transfers</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 '+(p.nights===5?'3N Cairo (BB) + 2N Alexandria Plaza (BB)':'4N Cairo (BB) + 3N Alexandria Plaza (BB)')+'</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 Pyramids, Sphinx, Khan Al Khalili, Bibliotheca, Nile Dinner Cruise</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px">\u2705 All transfers Cairo \u2194 Alexandria</li>'+
    '</ul>'+
    '<div style="font-weight:700;color:var(--muted);margin-bottom:8px;font-size:12px">Not Included</div>'+
    '<ul style="list-style:none;padding:0;margin:0 0 14px">'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Egypt e-visa fee</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Optional excursions &amp; water sports</li>'+
      '<li style="padding:4px 0;font-size:12px;display:flex;align-items:center;gap:8px;color:var(--muted)">\u274C Personal expenses</li>'+
    '</ul>';
  var vId = p.id;
  var tabBtns = [
    {id:'pricing',label:'Pricing',icon:'\uD83D\uDCB0'},
    {id:'itinerary',label:'Itinerary',icon:'\uD83D\uDCC4'},
    {id:'info',label:'Details & Inclusions',icon:'\u2139\uFE0F'}
  ];
  panel.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="cal-print-area-'+vId+'">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--card2);border-bottom:1px solid var(--border)">'+
      '<div>'+
        '<div style="font-size:10px;color:var(--muted)">Package '+p.id+'</div>'+
        '<div style="font-size:15px;font-weight:800">'+p.title+'</div>'+
        '<div style="font-size:12px;color:var(--gold)">'+p.arabic+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+p.subtitle+'</div>'+
      '</div>'+
      '<div style="display:flex;gap:6px;align-items:center">'+
        '<button onclick="calPrintPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDDA8\uFE0F Print</button>'+
        '<button onclick="calPdfPkg('+vId+',\''+p.title.replace(/'/g,"\\\'")+' - '+p.arabic.replace(/'/g,"\\\'")+'\')" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:10px">\uD83D\uDCC4 PDF</button>'+
        '<button onclick="calCloseDetail()" style="padding:5px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">\u2715</button>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:4px;padding:0 18px;background:var(--dark3);border-bottom:1px solid var(--border)">'+
      tabBtns.map(function(t){return '<button onclick="calSwitchTab(\''+t.id+'\')" style="padding:8px 14px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:12px;font-weight:600;color:'+(CAL_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)')+';border-bottom:2px solid '+(CAL_ACTIVE_TAB===t.id?'var(--gold)':'transparent')+';transition:all .2s">'+t.icon+' '+t.label+'</button>';}).join('')+
    '</div>'+
    '<div style="padding:18px">'+
      '<div id="cal-tab-pricing" style="display:'+(CAL_ACTIVE_TAB==='pricing'?'block':'none')+'">'+pricingHtml+'</div>'+
      '<div id="cal-tab-itinerary" style="display:'+(CAL_ACTIVE_TAB==='itinerary'?'block':'none')+'">'+itinHtml+'</div>'+
      '<div id="cal-tab-info" style="display:'+(CAL_ACTIVE_TAB==='info'?'block':'none')+'">'+infoHtml+'</div>'+
    '</div>'+
  '</div>';
}


// ════════════════════════════════════════════════════════════════
// AZERBAIJAN RICH PACKAGE DATA
// ════════════════════════════════════════════════════════════════
let AZ_ACTIVE_ID = null;
let AZ_ACTIVE_TAB = 'pricing';
function azToggleDay(btn){btn.nextElementSibling.classList.toggle('open');btn.querySelector('.az-chevron').classList.toggle('open');}
function azShowDetail(id){
  AZ_ACTIVE_ID = AZ_ACTIVE_ID===id?null:id;
  AZ_ACTIVE_TAB = 'pricing';
  renderDest('azerbaijan');
}
function azSwitchTab(t){AZ_ACTIVE_TAB=t;azRenderDetail();}
function azCloseDetail(){AZ_ACTIVE_ID=null;renderDest('azerbaijan');}
function azShowAllTabs(){
  var p=document.getElementById('az-tab-pricing');if(p)p.style.display='block';
  var i=document.getElementById('az-tab-itinerary');if(i)i.style.display='block';
  var n=document.getElementById('az-tab-info');if(n)n.style.display='block';
}
function azRestoreTabs(){
  var t=AZ_ACTIVE_TAB;
  document.getElementById('az-tab-pricing').style.display=t==='pricing'?'block':'none';
  document.getElementById('az-tab-itinerary').style.display=t==='itinerary'?'block':'none';
  document.getElementById('az-tab-info').style.display=t==='info'?'block':'none';
}
function azPrintPkg(id,title){
  azShowAllTabs();
  setTimeout(function(){
    PJ.printElement(document.getElementById('az-print-area-'+id),title);
    setTimeout(azRestoreTabs,200);
  },50);
}
function azPdfPkg(id,title){
  azShowAllTabs();
  setTimeout(function(){
    PJ.downloadPDF(document.getElementById('az-print-area-'+id),title);
    setTimeout(azRestoreTabs,200);
  },50);
}
function azRenderDetail(){
  const panel = document.getElementById('az-detail');
  if(!AZ_ACTIVE_ID){panel.style.display='none';return;}
  panel.style.display='block';
  const p = AZERBAIJAN_PACKAGES.find(x=>x.id===AZ_ACTIVE_ID);
  const h = p.hotels[0];
  const starsStr = '★'.repeat(p.stars);
  const fmt = v => (v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})+' JOD';
  const pricingHtml = `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">
    <thead><tr>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Baku Hotel</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Gabala Hotel</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Stars</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Meal</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Double (p.p)</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Single</th>
      <th style="text-align:right;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px">Child</th>
      <th style="text-align:center;padding:10px 12px;background:var(--dark3);border-bottom:2px solid var(--gold);color:var(--gold);font-size:12px"></th>
    </tr></thead>
    <tbody>
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-weight:600">${h.baku}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-weight:600">${h.gabala}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);color:var(--gold)" dir="ltr">${starsStr}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border)"><span style="background:rgba(201,168,76,.15);color:var(--gold);padding:2px 10px;border-radius:4px;font-size:11px">Breakfast (BB)</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-weight:700;color:var(--gold)">${fmt(p.double)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-weight:700">${fmt(p.single)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);font-weight:700">${fmt(p.child)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border);text-align:center"><button onclick="openBooking({type:'package',name:'${p.title} (${h.baku} + ${h.gabala})',destination:'Azerbaijan',nights:7,price:'${p.double}'})" style="padding:5px 12px;background:#25D366;border:none;border-radius:6px;color:#fff;font-family:Cairo,sans-serif;font-size:11px;font-weight:700;cursor:pointer">📲 Book</button></td>
      </tr>
    </tbody>
  </table></div>
  <div style="margin-top:12px;font-size:12px;color:var(--muted);line-height:1.8">
    ★ Child 2–6 yrs: ${fmt(399)} &nbsp;|&nbsp; Child column = 6–11 yrs &nbsp;|&nbsp; Private car option: +${fmt(800)}<br>
    All prices per person in JOD · FREE visa included · Departures every Saturday
  </div>`;
  const itinHtml = p.itinerary.map(d=>`
    <div style="border:1px solid var(--border);border-radius:10px;margin-bottom:8px;overflow:hidden">
      <div onclick="azToggleDay(this)" style="display:flex;align-items:center;gap:8px;padding:12px 14px;cursor:pointer;background:var(--card2);font-size:13px">
        <span style="background:var(--gold);color:#fff;border-radius:6px;padding:2px 8px;font-weight:700;font-size:11px">${d.day}</span>
        <span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px">✓ Included</span>
        <span style="flex:1;font-weight:600">${d.title}</span>
        <span style="color:var(--muted);font-size:11px">📍 ${d.loc}</span>
        <span class="az-chevron" style="transition:transform .2s;font-size:12px">▼</span>
      </div>
      <div style="padding:0 14px 14px;font-size:13px;line-height:1.7;color:var(--text);display:none">${d.desc}</div>
    </div>`).join('');
  const infoHtml = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:16px">
    <div style="background:var(--card2);border-radius:10px;padding:14px;border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Duration</div>
      <div style="font-weight:700">8 days / 7 nights</div>
    </div>
    <div style="background:var(--card2);border-radius:10px;padding:14px;border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Flight</div>
      <div style="font-weight:700;font-size:13px">${p.route}</div>
    </div>
    <div style="background:var(--card2);border-radius:10px;padding:14px;border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Accommodation</div>
      <div style="font-weight:700;font-size:12px;line-height:1.4">${p.accom}</div>
    </div>
    <div style="background:var(--card2);border-radius:10px;padding:14px;border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Meal Plan</div>
      <div style="font-weight:700">Breakfast (BB)</div>
    </div>
  </div>
  <div style="font-weight:700;color:var(--gold);margin-bottom:10px">What's Included</div>
  <ul style="list-style:none;padding:0;margin:0 0 16px">
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px">✅ Round-trip flights on Azerbaijan Airlines (Amman ↔ Baku)</li>
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px">✅ Visa for Azerbaijan — included in package price</li>
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px">✅ 4 free included excursions (Days 2, 3, 4, 6, 7)</li>
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px">✅ Airport transfers (arrival and departure)</li>
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px">✅ Hotel accommodation with breakfast for full duration</li>
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px">✅ Arabic-speaking professional tour guide</li>
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px">✅ Modern air-conditioned transport buses</li>
  </ul>
  <div style="font-weight:700;color:var(--muted);margin-bottom:10px">Not Included</div>
  <ul style="list-style:none;padding:0;margin:0 0 16px">
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Attraction entrance fees</li>
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Meals outside the hotel</li>
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Personal spending and optional activities</li>
    <li style="padding:6px 0;font-size:13px;display:flex;align-items:center;gap:8px;color:var(--muted)">❌ Health insurance (recommended before travel)</li>
  </ul>
  <div style="display:flex;flex-wrap:wrap;gap:8px">
    <div style="flex:1;min-width:200px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;font-size:13px">🛡️ <span><strong>Visa Included:</strong> Azerbaijan visa cost is already built into all package prices.</span></div>
    <div style="flex:1;min-width:200px;background:rgba(41,128,185,.1);border:1px solid var(--blue);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;font-size:13px">✈️ <span><strong>Departures:</strong> Every Saturday · Express visa (3 hrs) optional: ${fmt(50)}.</span></div>
  </div>`;
  const tabBtns = [
    {id:'pricing',label:'Pricing',icon:'💰'},
    {id:'itinerary',label:'Itinerary (Day by Day)',icon:'📅'},
    {id:'info',label:'Details & Inclusions',icon:'ℹ️'}
  ];
  const pId = p.id;
  panel.innerHTML = `<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;margin-top:16px;overflow:hidden" id="az-print-area-${pId}">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:var(--card2);border-bottom:1px solid var(--border)">
      <div>
        <div style="font-size:11px;color:var(--muted)">Package ${p.id}</div>
        <div style="font-size:18px;font-weight:800">${p.title}</div>
        <div style="font-size:14px;color:var(--gold)">${p.arabic}</div>
        <div style="font-size:13px;color:var(--muted);margin-top:2px">${p.subtitle}</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button onclick="azPrintPkg(${pId},'${p.title} - ${p.arabic}')" style="padding:6px 12px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">🖨️ Print</button>
        <button onclick="azPdfPkg(${pId},'${p.title} - ${p.arabic}')" style="padding:6px 12px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:11px">📄 PDF</button>
        <button onclick="azCloseDetail()" style="padding:6px 12px;background:var(--dark3);border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;font-family:Cairo,sans-serif;font-size:12px">✕</button>
      </div>
    </div>
    <div style="display:flex;gap:4px;padding:0 20px;background:var(--dark3);border-bottom:1px solid var(--border)">
      ${tabBtns.map(t=>`<button onclick="azSwitchTab('${t.id}')" style="padding:10px 16px;border:none;background:none;cursor:pointer;font-family:Cairo,sans-serif;font-size:13px;font-weight:600;color:${AZ_ACTIVE_TAB===t.id?'var(--gold)':'var(--muted)'};border-bottom:2px solid ${AZ_ACTIVE_TAB===t.id?'var(--gold)':'transparent'};transition:all .2s">${t.icon} ${t.label}</button>`).join('')}
    </div>
    <div style="padding:20px">
      <div class="az-tab-c" id="az-tab-pricing" style="display:${AZ_ACTIVE_TAB==='pricing'?'block':'none'}">${pricingHtml}</div>
      <div class="az-tab-c" id="az-tab-itinerary" style="display:${AZ_ACTIVE_TAB==='itinerary'?'block':'none'}">${itinHtml}</div>
      <div class="az-tab-c" id="az-tab-info" style="display:${AZ_ACTIVE_TAB==='info'?'block':'none'}">${infoHtml}</div>
    </div>
  </div>`;
}

// ── Card-level Print/PDF helpers for Egypt destinations ──
function _egCardPrint(id,prefix){
  var el=document.getElementById(prefix+'-card-print-'+id);
  el.style.display='block';
  var ttl=el.querySelector('.eg-print-title');
  var title=ttl?ttl.textContent:'Package';
  PJ.printElement(el,title);
  setTimeout(function(){el.style.display='none'},1000);
}
function _egCardPdf(id,prefix){
  var el=document.getElementById(prefix+'-card-print-'+id);
  el.style.display='block';
  var ttl=el.querySelector('.eg-print-title');
  var title=ttl?ttl.textContent:'Package';
  PJ.downloadPDF(el,title);
  setTimeout(function(){el.style.display='none'},1000);
}
// ── Override renderDest for Georgia and Azerbaijan ──
const _origRenderDest = renderDest;
renderDest = function(dest){
  if(dest === 'georgia'){
    const sec = document.getElementById('sec-georgia');
    if(!sec) return;
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person &nbsp;·&nbsp; 8 days / 7 nights
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="ge-cards">
        ${GEORGIA_PACKAGES.map(p=>{
          const active = GE_ACTIVE_ID===p.id;
          const minPrice = Math.min(...p.hotels.map(h=>h.d));
          return `<div onclick="geShowDetail(${p.id})" style="background:var(--card);border:1px solid ${active?'var(--gold)':'var(--border)'};border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:${active?'0 0 0 2px rgba(201,168,76,.3)':'none'}">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Program ${p.id}</div>
            <div style="font-weight:800;font-size:15px">${p.title}</div>
            <div style="color:var(--gold);font-size:13px;margin-bottom:4px">${p.arabic}</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:8px">${p.subtitle}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
              ${p.flyDays.map(d=>`<span style="background:rgba(201,168,76,.15);color:var(--gold);padding:2px 8px;border-radius:4px;font-size:9px;border:1px solid rgba(201,168,76,.3)">${d}</span>`).join('')}
            </div>
            <div style="font-size:20px;font-weight:800;color:var(--gold)">${minPrice.toLocaleString('en-US')} <span style="font-size:12px;font-weight:400">JOD</span></div>
            <div style="font-size:11px;color:var(--muted)">from · per person (double) · 7 nights</div>
            ${!active?'<div style="margin-top:12px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':''}
          </div>`;
        }).join('')}
      </div>
      <div id="ge-detail"></div>
    </div>`;
    geRenderDetail();
    return;
  }
  if(dest === 'azerbaijan'){
    const sec = document.getElementById('sec-azerbaijan');
    if(!sec) return;
    const azCard = p=>{
          const active = AZ_ACTIVE_ID===p.id;
          return `<div onclick="azShowDetail(${p.id})" style="background:var(--card);border:1px solid ${active?'var(--gold)':'var(--border)'};border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:${active?'0 0 0 2px rgba(201,168,76,.3)':'none'}">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package ${p.id}</div>
            <div style="font-weight:800;font-size:15px">${p.title}</div>
            <div style="color:var(--gold);font-size:13px;margin-bottom:4px">${p.arabic}</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:10px">${p.subtitle}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
              <span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Visa Included</span>
              <span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">${'★'.repeat(p.stars)} ${p.stars}★</span>
            </div>
            <div style="font-size:20px;font-weight:800;color:var(--gold)">${(p.double||0).toLocaleString('en-US')} <span style="font-size:12px;font-weight:400">JOD</span></div>
            <div style="font-size:11px;color:var(--muted)">per person (double) · 8 days / 7 nights · BB</div>
            ${!active?'<div style="margin-top:12px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':''}
          </div>`;
    };
    const azBakuOnly = AZERBAIJAN_PACKAGES.filter(p=>p.accom==='All 7 nights in Baku');
    const azCombo = AZERBAIJAN_PACKAGES.filter(p=>p.accom!=='All 7 nights in Baku');
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:14px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:20px;font-size:14px">
        🛡️ <strong>FREE Visa included in all prices</strong> &nbsp;·&nbsp; 🗓️ Departures every Saturday &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <span style="font-size:22px">🏙️</span>
        <div>
          <div style="font-weight:800;font-size:17px">Baku Only · برنامج باكو فقط</div>
          <div style="font-size:12px;color:var(--muted)">8 days / 7 nights — all nights in Baku · ${azBakuOnly.length} hotels</div>
        </div>
        <div style="flex:1;height:2px;background:linear-gradient(to left,var(--gold),transparent)"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:28px" id="az-cards">
        ${azBakuOnly.map(azCard).join('')}
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <span style="font-size:22px">⛰️</span>
        <div>
          <div style="font-weight:800;font-size:17px">Baku + Gabala · برنامج باكو وقبالا</div>
          <div style="font-size:12px;color:var(--muted)">8 days / 7 nights — 4N Baku + 2N Gabala + 1N Baku · ${azCombo.length} hotel combinations</div>
        </div>
        <div style="flex:1;height:2px;background:linear-gradient(to left,var(--gold),transparent)"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="az-cards-combo">
        ${azCombo.map(azCard).join('')}
      </div>
      <div id="az-detail"></div>
    </div>`;
    azRenderDetail();
    return;
  }
  if(dest === 'kosovo'){
    const sec = document.getElementById('sec-kosovo');
    if(!sec) return;
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:14px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:20px;font-size:14px">
        🛡️ <strong>Visa not required for Jordanians</strong> &nbsp;·&nbsp; ✈️ Flights Amman ↔ Prishtina &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="PJ.printElement(document.getElementById('ks-cards'),'Kosovo Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--dark3);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ طباعة الكل</button>
        <button onclick="PJ.downloadPDF(document.getElementById('ks-cards'),'Kosovo Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(201,168,76,.3)">📄 PDF الكل</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="ks-cards">
        ${KOSOVO_PACKAGES.map(p=>{
          const active = KS_ACTIVE_ID===p.id;
          const fmt = (p.double||0).toLocaleString('en-US');
          return `<div onclick="ksShowDetail(${p.id})" style="background:var(--card);border:1px solid ${active?'var(--gold)':'var(--border)'};border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:${active?'0 0 0 2px rgba(201,168,76,.3)':'none'}">
            <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package ${p.id}</div>
            <div style="font-weight:800;font-size:15px">${p.title}</div>
            <div style="color:var(--gold);font-size:13px;margin-bottom:4px">${p.arabic}</div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:10px">${p.subtitle}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
              <span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>
              <span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">${'★'.repeat(p.stars)} ${p.stars}★</span>
            </div>
            <div style="font-size:20px;font-weight:800;color:var(--gold)">${fmt} <span style="font-size:12px;font-weight:400">JOD</span></div>
            <div style="font-size:11px;color:var(--muted)">per person (double) · 8 days / 7 nights · BB</div>
            <button onclick="event.stopPropagation();openBooking({type:'package',hotel:'${p.title.replace(/'/g,"\\'")}',destination:'كوسوفو',price:'${fmt}',nights:7,room:'مزدوجة',includes:'فندق + تذكرة + مواصلات + برنامج (شامل)'})" style="width:100%;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:#25D366;border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(37,211,102,.3)">${WA_SVG} احجز الآن</button>
            <div style="display:flex;gap:6px;margin-top:10px">
              <button onclick="event.stopPropagation();(function(){var e=document.getElementById('ks-card-print-${p.id}');e.style.display='block';PJ.printElement(e,'${p.title.replace(/'/g,"\\'")}');setTimeout(function(){e.style.display='none'},1000)})()" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>
              <button onclick="event.stopPropagation();(function(){var e=document.getElementById('ks-card-print-${p.id}');e.style.display='block';PJ.downloadPDF(e,'${p.title.replace(/'/g,"\\'")}');setTimeout(function(){e.style.display='none'},1000)})()" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>
            </div>
            ${!active?'<div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':''}
          </div>`;
        }).join('')}
      </div>
      <div id="ks-print-areas" style="display:none">
        ${KOSOVO_PACKAGES.map(p=>{
          const fmt = (p.double||0).toLocaleString('en-US');
          return `<div id="ks-card-print-${p.id}">
            <div style="font-family: 'Cairo', sans-serif; direction: rtl; padding: 30px; max-width: 800px; margin: 0 auto; color: #222;">
              <div style="text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 15px; margin-bottom: 20px;">
                <div style="font-size: 22px; font-weight: 800; color: #1a1a2e;">${p.title}</div>
                <div style="font-size: 17px; color: #c9a84c; margin: 4px 0;">${p.arabic}</div>
                <div style="font-size: 13px; color: #666;">${p.subtitle}</div>
              </div>
              <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">
                <tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700;width:140px">🌟 Stars</td><td style="padding:6px 8px;border:1px solid #ddd">${'★'.repeat(p.stars)} ${p.stars}★</td></tr>
                <tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🍽️ Meal Plan</td><td style="padding:6px 8px;border:1px solid #ddd">${p.meal}</td></tr>
                <tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛏️ Double (per person)</td><td style="padding:6px 8px;border:1px solid #ddd;font-size:18px;font-weight:800;color:#c9a84c">${fmt} JOD</td></tr>
                <tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👤 Single</td><td style="padding:6px 8px;border:1px solid #ddd">${(p.single||0).toLocaleString('en-US')} JOD</td></tr>
                <tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👶 Child</td><td style="padding:6px 8px;border:1px solid #ddd">${(p.child||0).toLocaleString('en-US')} JOD</td></tr>
                <tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">📅 Duration</td><td style="padding:6px 8px;border:1px solid #ddd">8 days / 7 nights</td></tr>
                <tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">✈️ Flights</td><td style="padding:6px 8px;border:1px solid #ddd">Amman ↔ Prishtina (included)</td></tr>
                <tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛡️ Visa</td><td style="padding:6px 8px;border:1px solid #ddd">Not required for Jordanians</td></tr>
              </table>
              <div style="font-size:12px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:12px">
                ${p.title} · Judextravel.com · All prices in JOD
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div id="ks-detail"></div>
    </div>`;
    ksRenderDetail();
    return;
  }
  if(dest === 'vietnam'){
    const sec = document.getElementById('sec-vietnam');
    if(!sec) return;
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person &nbsp;·&nbsp; 9 days / 8 nights
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="vn-cards">
        ${VIETNAM_PACKAGES.map(function(p){
          var active = VN_ACTIVE_ID===p.id;
          return '<div onclick="vnShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+"'★'".repeat(p.stars)+' '+p.stars+'★</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+(p.double||0).toLocaleString('en-US')+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) · '+p.nights+' nights · '+p.meal+'</div>'+
            (!active?'<div style="margin-top:12px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="vn-detail"></div>
    </div>`;
    vnRenderDetail();
    return;
  }
  if(dest === 'srilanka'){
    const sec = document.getElementById('sec-srilanka');
    if(!sec) return;
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person &nbsp;·&nbsp; 8 days / 7 nights
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="sl-cards">
        ${SRI_LANKA_PACKAGES.map(function(p){
          var active = SL_ACTIVE_ID===p.id;
          return '<div onclick="slShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+"'★'".repeat(p.stars)+' '+p.stars+'★</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+(p.double||0).toLocaleString('en-US')+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) · '+p.nights+' nights · '+p.meal+'</div>'+
            (!active?'<div style="margin-top:12px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="sl-detail"></div>
    </div>`;
    slRenderDetail();
    return;
  }
  if(dest === 'maldives'){
    const sec = document.getElementById('sec-maldives');
    if(!sec) return;
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person &nbsp;·&nbsp; 5 days / 4 nights
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="mv-cards">
        ${MALDIVES_PACKAGES.map(function(p){
          var active = MV_ACTIVE_ID===p.id;
          return '<div onclick="mvShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+"'★'".repeat(p.stars)+' '+p.stars+'★</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+(p.double||0).toLocaleString('en-US')+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) · '+p.nights+' nights · '+p.meal+'</div>'+
            (!active?'<div style="margin-top:12px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="mv-detail"></div>
    </div>`;
    mvRenderDetail();
    return;
  }
  if(dest === 'thailand'){
    const sec = document.getElementById('sec-thailand');
    if(!sec) return;
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person &nbsp;·&nbsp; 7-8 nights
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="th-cards">
        ${THAILAND_PACKAGES.map(function(p){
          var active = TH_ACTIVE_ID===p.id;
          return '<div onclick="thShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+"'★'".repeat(p.stars)+' '+p.stars+'★</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+(p.double||0).toLocaleString('en-US')+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) · '+p.nights+' nights · '+p.meal+'</div>'+
            (!active?'<div style="margin-top:12px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="th-detail"></div>
    </div>`;
    thRenderDetail();
    return;
  }
  if(dest === 'singapore'){
    const sec = document.getElementById('sec-singapore');
    if(!sec) return;
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person &nbsp;·&nbsp; 4-5 nights
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="sg-cards">
        ${SINGAPORE_PACKAGES.map(function(p){
          var active = SG_ACTIVE_ID===p.id;
          return '<div onclick="sgShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+"'★'".repeat(p.stars)+' '+p.stars+'★</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+(p.double||0).toLocaleString('en-US')+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) · '+p.nights+' nights · '+p.meal+'</div>'+
            (!active?'<div style="margin-top:12px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="sg-detail"></div>
    </div>`;
    sgRenderDetail();
    return;
  }
  if(dest === 'malaysia'){
    const sec = document.getElementById('sec-malaysia');
    if(!sec) return;
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person &nbsp;·&nbsp; 7-8 nights
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="my-cards">
        ${MALAYSIA_PACKAGES.map(function(p){
          var active = MY_ACTIVE_ID===p.id;
          return '<div onclick="myShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+"'★'".repeat(p.stars)+' '+p.stars+'★</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+(p.double||0).toLocaleString('en-US')+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) · '+p.nights+' nights · '+p.meal+'</div>'+
            (!active?'<div style="margin-top:12px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="my-detail"></div>
    </div>`;
    myRenderDetail();
    return;
  }
  if(dest === 'bali'){
    const sec = document.getElementById('sec-bali');
    if(!sec) return;
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person &nbsp;·&nbsp; 7-8 nights
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="bi-cards">
        ${BALI_PACKAGES.map(function(p){
          var active = BI_ACTIVE_ID===p.id;
          return '<div onclick="biShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+"'★'".repeat(p.stars)+' '+p.stars+'★</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+(p.double||0).toLocaleString('en-US')+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) · '+p.nights+' nights · '+p.meal+'</div>'+
            (!active?'<div style="margin-top:12px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="bi-detail"></div>
    </div>`;
    biRenderDetail();
    return;
  }
  if(dest === 'cairo'){
    const sec = document.getElementById('sec-cairo');
    if(!sec) return;
    const caNights = [...new Set(CAIRO_PACKAGES.map(p=>p.nights))].sort();
    if(!CA_CUR_NIGHTS||!caNights.includes(CA_CUR_NIGHTS)) CA_CUR_NIGHTS=caNights[0];
    const caFiltered = CAIRO_PACKAGES.filter(p=>p.nights===CA_CUR_NIGHTS);
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        ${caNights.map(n=>'<button onclick="caSetNights('+n+')" style="padding:8px 18px;border:1px solid '+(CA_CUR_NIGHTS===n?'var(--gold)':'var(--border)')+';border-radius:20px;background:'+(CA_CUR_NIGHTS===n?'var(--gold)':'var(--card)')+';color:'+(CA_CUR_NIGHTS===n?'#fff':'var(--text)')+';font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">'+n+' ليالي</button>').join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="PJ.printElement(document.getElementById('ca-cards'),'Cairo Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--dark3);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ طباعة الكل</button>
        <button onclick="PJ.downloadPDF(document.getElementById('ca-cards'),'Cairo Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(201,168,76,.3)">📄 PDF الكل</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="ca-cards">
        ${caFiltered.map(function(p){
          var active = CA_ACTIVE_ID===p.id;
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div onclick="caShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+fmt+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) \u00b7 '+p.nights+' nights \u00b7 '+p.meal+'</div>'+
            '<button onclick="event.stopPropagation();openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'القاهرة\',price:\''+fmt+'\',nights:'+p.nights+',room:\'مزدوجة\',includes:\'فندق + تذكرة + مواصلات + برنامج\'})" style="width:100%;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:#25D366;border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(37,211,102,.3)">'+WA_SVG+' احجز الآن</button>'+
            '<div style="display:flex;gap:6px;margin-top:8px">'+
            '<button onclick="event.stopPropagation();_egCardPrint('+p.id+',\'ca\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>'+
            '<button onclick="event.stopPropagation();_egCardPdf('+p.id+',\'ca\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>'+
            '</div>'+
            (!active?'<div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="ca-print-areas" style="display:none">
        ${caFiltered.map(function(p){
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div id="ca-card-print-'+p.id+'">'+
            '<div style="font-family: \'Cairo\', sans-serif; direction: rtl; padding: 30px; max-width: 800px; margin: 0 auto; color: #222;">'+
              '<div style="text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 15px; margin-bottom: 20px;">'+
                '<div class="eg-print-title" style="font-size: 22px; font-weight: 800; color: #1a1a2e;">'+p.title+'</div>'+
                '<div style="font-size: 17px; color: #c9a84c; margin: 4px 0;">'+p.arabic+'</div>'+
                '<div style="font-size: 13px; color: #666;">'+p.location+'</div>'+
              '</div>'+
              '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700;width:140px">🌟 Stars</td><td style="padding:6px 8px;border:1px solid #ddd">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🍽️ Meal Plan</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.meal+'</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛏️ Double (per person)</td><td style="padding:6px 8px;border:1px solid #ddd;font-size:18px;font-weight:800;color:#c9a84c">'+fmt+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👤 Single</td><td style="padding:6px 8px;border:1px solid #ddd">'+(p.single||0).toLocaleString('en-US')+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">📅 Duration</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.nights+' nights</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">✈️ Flights</td><td style="padding:6px 8px;border:1px solid #ddd">Amman ↔ Cairo (included)</td></tr>'+
              '</table>'+
              '<div style="font-size:12px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:12px">'+p.title+' · Judextravel.com · All prices in JOD</div>'+
            '</div>'+
          '</div>';
        }).join('')}
      </div>
      <div id="ca-detail"></div>
    </div>`;
    caRenderDetail();
    return;
  }
  if(dest === 'alexandria'){
    const sec = document.getElementById('sec-alexandria');
    if(!sec) return;
    const alNights = [...new Set(ALEXANDRIA_PACKAGES.map(p=>p.nights))].sort();
    if(!AL_CUR_NIGHTS||!alNights.includes(AL_CUR_NIGHTS)) AL_CUR_NIGHTS=alNights[0];
    const alFiltered = ALEXANDRIA_PACKAGES.filter(p=>p.nights===AL_CUR_NIGHTS);
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        ${alNights.map(n=>'<button onclick="alSetNights('+n+')" style="padding:8px 18px;border:1px solid '+(AL_CUR_NIGHTS===n?'var(--gold)':'var(--border)')+';border-radius:20px;background:'+(AL_CUR_NIGHTS===n?'var(--gold)':'var(--card)')+';color:'+(AL_CUR_NIGHTS===n?'#fff':'var(--text)')+';font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">'+n+' ليالي</button>').join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="PJ.printElement(document.getElementById('al-cards'),'Alexandria Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--dark3);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ طباعة الكل</button>
        <button onclick="PJ.downloadPDF(document.getElementById('al-cards'),'Alexandria Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(201,168,76,.3)">📄 PDF الكل</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="al-cards">
        ${alFiltered.map(function(p){
          var active = AL_ACTIVE_ID===p.id;
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div onclick="alShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+fmt+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) \u00b7 '+p.nights+' nights \u00b7 '+p.meal+'</div>'+
            '<button onclick="event.stopPropagation();openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'الإسكندرية\',price:\''+fmt+'\',nights:'+p.nights+',room:\'مزدوجة\',includes:\'فندق + تذكرة + مواصلات + برنامج\'})" style="width:100%;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:#25D366;border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(37,211,102,.3)">'+WA_SVG+' احجز الآن</button>'+
            '<div style="display:flex;gap:6px;margin-top:8px">'+
            '<button onclick="event.stopPropagation();_egCardPrint('+p.id+',\'al\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>'+
            '<button onclick="event.stopPropagation();_egCardPdf('+p.id+',\'al\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>'+
            '</div>'+
            (!active?'<div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="al-print-areas" style="display:none">
        ${alFiltered.map(function(p){
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div id="al-card-print-'+p.id+'">'+
            '<div style="font-family: \'Cairo\', sans-serif; direction: rtl; padding: 30px; max-width: 800px; margin: 0 auto; color: #222;">'+
              '<div style="text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 15px; margin-bottom: 20px;">'+
                '<div class="eg-print-title" style="font-size: 22px; font-weight: 800; color: #1a1a2e;">'+p.title+'</div>'+
                '<div style="font-size: 17px; color: #c9a84c; margin: 4px 0;">'+p.arabic+'</div>'+
                '<div style="font-size: 13px; color: #666;">'+p.location+'</div>'+
              '</div>'+
              '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700;width:140px">🌟 Stars</td><td style="padding:6px 8px;border:1px solid #ddd">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🍽️ Meal Plan</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.meal+'</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛏️ Double (per person)</td><td style="padding:6px 8px;border:1px solid #ddd;font-size:18px;font-weight:800;color:#c9a84c">'+fmt+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👤 Single</td><td style="padding:6px 8px;border:1px solid #ddd">'+(p.single||0).toLocaleString('en-US')+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">📅 Duration</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.nights+' nights</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">✈️ Flights</td><td style="padding:6px 8px;border:1px solid #ddd">Amman ↔ Alexandria (included)</td></tr>'+
              '</table>'+
              '<div style="font-size:12px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:12px">'+p.title+' · Judextravel.com · All prices in JOD</div>'+
            '</div>'+
          '</div>';
        }).join('')}
      </div>
      <div id="al-detail"></div>
    </div>`;
    alRenderDetail();
    return;
  }
  if(dest === 'cairo-north-coast'){
    const sec = document.getElementById('sec-cairo-north-coast');
    if(!sec) return;
    const cncNights = [...new Set(CAIRO_NORTH_COAST_PACKAGES.map(p=>p.nights))].sort();
    if(!CNC_CUR_NIGHTS||!cncNights.includes(CNC_CUR_NIGHTS)) CNC_CUR_NIGHTS=cncNights[0];
    const cncFiltered = CAIRO_NORTH_COAST_PACKAGES.filter(p=>p.nights===CNC_CUR_NIGHTS);
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        ${cncNights.map(n=>'<button onclick="cncSetNights('+n+')" style="padding:8px 18px;border:1px solid '+(CNC_CUR_NIGHTS===n?'var(--gold)':'var(--border)')+';border-radius:20px;background:'+(CNC_CUR_NIGHTS===n?'var(--gold)':'var(--card)')+';color:'+(CNC_CUR_NIGHTS===n?'#fff':'var(--text)')+';font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">'+n+' ليالي</button>').join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="PJ.printElement(document.getElementById('cnc-cards'),'Cairo North Coast Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--dark3);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ طباعة الكل</button>
        <button onclick="PJ.downloadPDF(document.getElementById('cnc-cards'),'Cairo North Coast Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(201,168,76,.3)">📄 PDF الكل</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="cnc-cards">
        ${cncFiltered.map(function(p){
          var active = CNC_ACTIVE_ID===p.id;
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div onclick="cncShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+fmt+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) \u00b7 '+p.nights+' nights \u00b7 '+p.meal+'</div>'+
            '<button onclick="event.stopPropagation();openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'القاهرة والساحل الشمالي\',price:\''+fmt+'\',nights:'+p.nights+',room:\'مزدوجة\',includes:\'فندق + تذكرة + مواصلات + برنامج\'})" style="width:100%;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:#25D366;border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(37,211,102,.3)">'+WA_SVG+' احجز الآن</button>'+
            '<div style="display:flex;gap:6px;margin-top:8px">'+
            '<button onclick="event.stopPropagation();_egCardPrint('+p.id+',\'cnc\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>'+
            '<button onclick="event.stopPropagation();_egCardPdf('+p.id+',\'cnc\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>'+
            '</div>'+
            (!active?'<div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="cnc-print-areas" style="display:none">
        ${cncFiltered.map(function(p){
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div id="cnc-card-print-'+p.id+'">'+
            '<div style="font-family: \'Cairo\', sans-serif; direction: rtl; padding: 30px; max-width: 800px; margin: 0 auto; color: #222;">'+
              '<div style="text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 15px; margin-bottom: 20px;">'+
                '<div class="eg-print-title" style="font-size: 22px; font-weight: 800; color: #1a1a2e;">'+p.title+'</div>'+
                '<div style="font-size: 17px; color: #c9a84c; margin: 4px 0;">'+p.arabic+'</div>'+
                '<div style="font-size: 13px; color: #666;">'+p.location+'</div>'+
              '</div>'+
              '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700;width:140px">🌟 Stars</td><td style="padding:6px 8px;border:1px solid #ddd">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🍽️ Meal Plan</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.meal+'</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛏️ Double (per person)</td><td style="padding:6px 8px;border:1px solid #ddd;font-size:18px;font-weight:800;color:#c9a84c">'+fmt+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👤 Single</td><td style="padding:6px 8px;border:1px solid #ddd">'+(p.single||0).toLocaleString('en-US')+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">📅 Duration</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.nights+' nights</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">✈️ Flights</td><td style="padding:6px 8px;border:1px solid #ddd">Amman ↔ Cairo / North Coast (included)</td></tr>'+
              '</table>'+
              '<div style="font-size:12px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:12px">'+p.title+' · Judextravel.com · All prices in JOD</div>'+
            '</div>'+
          '</div>';
        }).join('')}
      </div>
      <div id="cnc-detail"></div>
    </div>`;
    cncRenderDetail();
    return;
  }
  if(dest === 'cairo-alexandria'){
    const sec = document.getElementById('sec-cairo-alexandria');
    if(!sec) return;
    const calNights = [...new Set(CAIRO_ALEXANDRIA_PACKAGES.map(p=>p.nights))].sort();
    if(!CAL_CUR_NIGHTS||!calNights.includes(CAL_CUR_NIGHTS)) CAL_CUR_NIGHTS=calNights[0];
    const calFiltered = CAIRO_ALEXANDRIA_PACKAGES.filter(p=>p.nights===CAL_CUR_NIGHTS);
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        ${calNights.map(n=>'<button onclick="calSetNights('+n+')" style="padding:8px 18px;border:1px solid '+(CAL_CUR_NIGHTS===n?'var(--gold)':'var(--border)')+';border-radius:20px;background:'+(CAL_CUR_NIGHTS===n?'var(--gold)':'var(--card)')+';color:'+(CAL_CUR_NIGHTS===n?'#fff':'var(--text)')+';font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">'+n+' ليالي</button>').join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="PJ.printElement(document.getElementById('cal-cards'),'Cairo &amp; Alexandria Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--dark3);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ طباعة الكل</button>
        <button onclick="PJ.downloadPDF(document.getElementById('cal-cards'),'Cairo &amp; Alexandria Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(201,168,76,.3)">📄 PDF الكل</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="cal-cards">
        ${calFiltered.map(function(p){
          var active = CAL_ACTIVE_ID===p.id;
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div onclick="calShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+fmt+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) \u00b7 '+p.nights+' nights \u00b7 '+p.meal+'</div>'+
            '<button onclick="event.stopPropagation();openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'القاهرة و الإسكندرية\',price:\''+fmt+'\',nights:'+p.nights+',room:\'مزدوجة\',includes:\'فندق + تذكرة + مواصلات + برنامج\'})" style="width:100%;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:#25D366;border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(37,211,102,.3)">'+WA_SVG+' احجز الآن</button>'+
            '<div style="display:flex;gap:6px;margin-top:8px">'+
            '<button onclick="event.stopPropagation();_egCardPrint('+p.id+',\'cal\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>'+
            '<button onclick="event.stopPropagation();_egCardPdf('+p.id+',\'cal\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>'+
            '</div>'+
            (!active?'<div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="cal-print-areas" style="display:none">
        ${calFiltered.map(function(p){
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div id="cal-card-print-'+p.id+'">'+
            '<div style="font-family: \'Cairo\', sans-serif; direction: rtl; padding: 30px; max-width: 800px; margin: 0 auto; color: #222;">'+
              '<div style="text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 15px; margin-bottom: 20px;">'+
                '<div class="eg-print-title" style="font-size: 22px; font-weight: 800; color: #1a1a2e;">'+p.title+'</div>'+
                '<div style="font-size: 17px; color: #c9a84c; margin: 4px 0;">'+p.arabic+'</div>'+
                '<div style="font-size: 13px; color: #666;">'+p.location+'</div>'+
              '</div>'+
              '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700;width:140px">🌟 Stars</td><td style="padding:6px 8px;border:1px solid #ddd">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🍽️ Meal Plan</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.meal+'</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛏️ Double (per person)</td><td style="padding:6px 8px;border:1px solid #ddd;font-size:18px;font-weight:800;color:#c9a84c">'+fmt+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👤 Single</td><td style="padding:6px 8px;border:1px solid #ddd">'+(p.single||0).toLocaleString('en-US')+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">📅 Duration</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.nights+' nights</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">✈️ Flights</td><td style="padding:6px 8px;border:1px solid #ddd">Amman ↔ Cairo / Alexandria (included)</td></tr>'+
              '</table>'+
              '<div style="font-size:12px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:12px">'+p.title+' · Judextravel.com · All prices in JOD</div>'+
            '</div>'+
          '</div>';
        }).join('')}
      </div>
      <div id="cal-detail"></div>
    </div>`;
    calRenderDetail();
    return;
  }
  if(dest === 'cairo-alex-northcoast'){
    const sec = document.getElementById('sec-cairo-alex-northcoast');
    if(!sec) return;
    const calnNights = [7];
    if(!CALN_CUR_NIGHTS||!calnNights.includes(CALN_CUR_NIGHTS)) CALN_CUR_NIGHTS=7;
    const calnFiltered = CAIRO_ALEX_NORTHCOAST_PACKAGES.filter(p=>p.nights===CALN_CUR_NIGHTS);
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        ${calnNights.map(n=>'<button onclick="calnSetNights('+n+')" style="padding:8px 18px;border:1px solid '+(CALN_CUR_NIGHTS===n?'var(--gold)':'var(--border)')+';border-radius:20px;background:'+(CALN_CUR_NIGHTS===n?'var(--gold)':'var(--card)')+';color:'+(CALN_CUR_NIGHTS===n?'#fff':'var(--text)')+';font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">'+n+' ليالي</button>').join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="PJ.printElement(document.getElementById('caln-cards'),'Cairo Alexandria North Coast Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--dark3);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ طباعة الكل</button>
        <button onclick="PJ.downloadPDF(document.getElementById('caln-cards'),'Cairo Alexandria North Coast Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(201,168,76,.3)">📄 PDF الكل</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="caln-cards">
        ${calnFiltered.map(function(p){
          var active = CALN_ACTIVE_ID===p.id;
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div onclick="calnShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+fmt+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) \u00b7 '+p.nights+' nights \u00b7 '+p.meal+'</div>'+
            '<button onclick="event.stopPropagation();openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'القاهرة والإسكندرية والساحل الشمالي\',price:\''+fmt+'\',nights:'+p.nights+',room:\'مزدوجة\',includes:\'فندق + تذكرة + مواصلات + برنامج\'})" style="width:100%;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:#25D366;border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(37,211,102,.3)">'+WA_SVG+' احجز الآن</button>'+
            '<div style="display:flex;gap:6px;margin-top:8px">'+
            '<button onclick="event.stopPropagation();_egCardPrint('+p.id+',\'caln\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>'+
            '<button onclick="event.stopPropagation();_egCardPdf('+p.id+',\'caln\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>'+
            '</div>'+
            (!active?'<div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="caln-print-areas" style="display:none">
        ${calnFiltered.map(function(p){
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div id="caln-card-print-'+p.id+'">'+
            '<div style="font-family: \'Cairo\', sans-serif; direction: rtl; padding: 30px; max-width: 800px; margin: 0 auto; color: #222;">'+
              '<div style="text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 15px; margin-bottom: 20px;">'+
                '<div class="eg-print-title" style="font-size: 22px; font-weight: 800; color: #1a1a2e;">'+p.title+'</div>'+
                '<div style="font-size: 17px; color: #c9a84c; margin: 4px 0;">'+p.arabic+'</div>'+
                '<div style="font-size: 13px; color: #666;">'+p.location+'</div>'+
              '</div>'+
              '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700;width:140px">🌟 Stars</td><td style="padding:6px 8px;border:1px solid #ddd">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🍽️ Meal Plan</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.meal+'</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛏️ Double (per person)</td><td style="padding:6px 8px;border:1px solid #ddd;font-size:18px;font-weight:800;color:#c9a84c">'+fmt+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👤 Single</td><td style="padding:6px 8px;border:1px solid #ddd">'+(p.single||0).toLocaleString('en-US')+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">📅 Duration</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.nights+' nights</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">✈️ Flights</td><td style="padding:6px 8px;border:1px solid #ddd">Amman ↔ Cairo / Alexandria / North Coast (included)</td></tr>'+
              '</table>'+
              '<div style="font-size:12px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:12px">'+p.title+' · Judextravel.com · All prices in JOD</div>'+
            '</div>'+
          '</div>';
        }).join('')}
      </div>
      <div id="caln-detail"></div>
    </div>`;
    calnRenderDetail();
    return;
  }
  if(dest === 'alexandria-northcoast'){
    const sec = document.getElementById('sec-alexandria-northcoast');
    if(!sec) return;
    const alnNights = [5];
    if(!ALN_CUR_NIGHTS||!alnNights.includes(ALN_CUR_NIGHTS)) ALN_CUR_NIGHTS=5;
    const alnFiltered = ALEXANDRIA_NORTHCOAST_PACKAGES.filter(p=>p.nights===ALN_CUR_NIGHTS);
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        🏖️ Fixed North Coast hotel: Retal View (H.B) &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="PJ.printElement(document.getElementById('aln-cards'),'Alexandria North Coast Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--dark3);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ طباعة الكل</button>
        <button onclick="PJ.downloadPDF(document.getElementById('aln-cards'),'Alexandria North Coast Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(201,168,76,.3)">📄 PDF الكل</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="aln-cards">
        ${alnFiltered.map(function(p){
          var active = ALN_ACTIVE_ID===p.id;
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div onclick="alncShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+'★'.repeat(p.stars)+' '+p.stars+'★</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+fmt+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) · '+p.nights+' nights · '+p.meal+'</div>'+
            '<button onclick="event.stopPropagation();openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'الإسكندرية والساحل الشمالي\',price:\''+fmt+'\',nights:'+p.nights+',room:\'مزدوجة\',includes:\'فندق + مواصلات + برنامج\'})" style="width:100%;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:#25D366;border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(37,211,102,.3)">'+WA_SVG+' احجز الآن</button>'+
            '<div style="display:flex;gap:6px;margin-top:8px">'+
            '<button onclick="event.stopPropagation();_egCardPrint('+p.id+',\'aln\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>'+
            '<button onclick="event.stopPropagation();_egCardPdf('+p.id+',\'aln\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>'+
            '</div>'+
            (!active?'<div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="aln-print-areas" style="display:none">
        ${alnFiltered.map(function(p){
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div id="aln-card-print-'+p.id+'">'+
            '<div style="font-family: \'Cairo\', sans-serif; direction: rtl; padding: 30px; max-width: 800px; margin: 0 auto; color: #222;">'+
              '<div style="text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 15px; margin-bottom: 20px;">'+
                '<div class="eg-print-title" style="font-size: 22px; font-weight: 800; color: #1a1a2e;">'+p.title+'</div>'+
                '<div style="font-size: 17px; color: #c9a84c; margin: 4px 0;">'+p.arabic+'</div>'+
                '<div style="font-size: 13px; color: #666;">'+p.location+'</div>'+
              '</div>'+
              '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700;width:140px">🌟 Stars</td><td style="padding:6px 8px;border:1px solid #ddd">'+'★'.repeat(p.stars)+' '+p.stars+'★</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🍽️ Meal Plan</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.meal+'</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛏️ Double (per person)</td><td style="padding:6px 8px;border:1px solid #ddd;font-size:18px;font-weight:800;color:#c9a84c">'+fmt+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👤 Single</td><td style="padding:6px 8px;border:1px solid #ddd">'+(p.single||0).toLocaleString('en-US')+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">📅 Duration</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.nights+' nights</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">✈️ Route</td><td style="padding:6px 8px;border:1px solid #ddd">Amman ↔ Alexandria (included)</td></tr>'+
              '</table>'+
              '<div style="font-size:12px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:12px">'+p.title+' · Judextravel.com · All prices in JOD</div>'+
            '</div>'+
          '</div>';
        }).join('')}
      </div>
      <div id="aln-detail"></div>
    </div>`;
    alncRenderDetail();
    return;
  }
  if(dest === 'cairo-ain-sokhna'){
    const sec = document.getElementById('sec-cairo-ain-sokhna');
    if(!sec) return;
    const casNights = [5];
    if(!CAS_CUR_NIGHTS||!casNights.includes(CAS_CUR_NIGHTS)) CAS_CUR_NIGHTS=5;
    const casFiltered = CAIRO_AIN_SOKHNA_PACKAGES.filter(p=>p.nights===CAS_CUR_NIGHTS);
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        ${casNights.map(n=>'<button onclick="casSetNights('+n+')" style="padding:8px 18px;border:1px solid '+(CAS_CUR_NIGHTS===n?'var(--gold)':'var(--border)')+';border-radius:20px;background:'+(CAS_CUR_NIGHTS===n?'var(--gold)':'var(--card)')+';color:'+(CAS_CUR_NIGHTS===n?'#fff':'var(--text)')+';font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">'+n+' ليالي</button>').join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="PJ.printElement(document.getElementById('cas-cards'),'Cairo Ain Sokhna Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--dark3);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ طباعة الكل</button>
        <button onclick="PJ.downloadPDF(document.getElementById('cas-cards'),'Cairo Ain Sokhna Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(201,168,76,.3)">📄 PDF الكل</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="cas-cards">
        ${casFiltered.map(function(p){
          var active = CAS_ACTIVE_ID===p.id;
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div onclick="casShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+fmt+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) \u00b7 '+p.nights+' nights \u00b7 '+p.meal+'</div>'+
            '<button onclick="event.stopPropagation();openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'القاهرة والعين السخنة\',price:\''+fmt+'\',nights:'+p.nights+',room:\'مزدوجة\',includes:\'فندق + تذكرة + مواصلات + برنامج\'})" style="width:100%;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:#25D366;border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(37,211,102,.3)">'+WA_SVG+' احجز الآن</button>'+
            '<div style="display:flex;gap:6px;margin-top:8px">'+
            '<button onclick="event.stopPropagation();_egCardPrint('+p.id+',\'cas\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>'+
            '<button onclick="event.stopPropagation();_egCardPdf('+p.id+',\'cas\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>'+
            '</div>'+
            (!active?'<div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="cas-print-areas" style="display:none">
        ${casFiltered.map(function(p){
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div id="cas-card-print-'+p.id+'">'+
            '<div style="font-family: \'Cairo\', sans-serif; direction: rtl; padding: 30px; max-width: 800px; margin: 0 auto; color: #222;">'+
              '<div style="text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 15px; margin-bottom: 20px;">'+
                '<div class="eg-print-title" style="font-size: 22px; font-weight: 800; color: #1a1a2e;">'+p.title+'</div>'+
                '<div style="font-size: 17px; color: #c9a84c; margin: 4px 0;">'+p.arabic+'</div>'+
                '<div style="font-size: 13px; color: #666;">'+p.location+'</div>'+
              '</div>'+
              '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700;width:140px">🌟 Stars</td><td style="padding:6px 8px;border:1px solid #ddd">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🍽️ Meal Plan</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.meal+'</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛏️ Double (per person)</td><td style="padding:6px 8px;border:1px solid #ddd;font-size:18px;font-weight:800;color:#c9a84c">'+fmt+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👤 Single</td><td style="padding:6px 8px;border:1px solid #ddd">'+(p.single||0).toLocaleString('en-US')+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">📅 Duration</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.nights+' nights</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">✈️ Flights</td><td style="padding:6px 8px;border:1px solid #ddd">Amman ↔ Cairo / Ain Sokhna (included)</td></tr>'+
              '</table>'+
              '<div style="font-size:12px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:12px">'+p.title+' · Judextravel.com · All prices in JOD</div>'+
            '</div>'+
          '</div>';
        }).join('')}
      </div>
      <div id="cas-detail"></div>
    </div>`;
    casRenderDetail();
    return;
  }
  if(dest === 'cairo-aswan-luxor-cruise'){
    const sec = document.getElementById('sec-cairo-aswan-luxor-cruise');
    if(!sec) return;
    const cacNights = [7];
    if(!CAC_CUR_NIGHTS||!cacNights.includes(CAC_CUR_NIGHTS)) CAC_CUR_NIGHTS=7;
    const cacFiltered = CAIRO_ASWAN_LUXOR_CRUISE_PACKAGES.filter(p=>p.nights===CAC_CUR_NIGHTS);
    sec.innerHTML = `<div style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:rgba(39,174,96,.1);border:1px solid var(--green);border-radius:12px;margin-bottom:18px;font-size:13px">
        ✈️ All prices include flights, hotel &amp; transport &nbsp;·&nbsp; 💰 All prices in <strong>JOD</strong> per person
      </div>
      <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        ${cacNights.map(n=>'<button onclick="cacSetNights('+n+')" style="padding:8px 18px;border:1px solid '+(CAC_CUR_NIGHTS===n?'var(--gold)':'var(--border)')+';border-radius:20px;background:'+(CAC_CUR_NIGHTS===n?'var(--gold)':'var(--card)')+';color:'+(CAC_CUR_NIGHTS===n?'#fff':'var(--text)')+';font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">'+n+' ليالي</button>').join('')}
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
        <button onclick="PJ.printElement(document.getElementById('cac-cards'),'Cairo Aswan Luxor Cruise Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--dark3);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s">🖨️ طباعة الكل</button>
        <button onclick="PJ.downloadPDF(document.getElementById('cac-cards'),'Cairo Aswan Luxor Cruise Packages')" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:var(--gold);border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(201,168,76,.3)">📄 PDF الكل</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px" id="cac-cards">
        ${cacFiltered.map(function(p){
          var active = CAC_ACTIVE_ID===p.id;
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div onclick="cacShowDetail('+p.id+')" style="background:var(--card);border:1px solid '+(active?'var(--gold)':'var(--border)')+';border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;box-shadow:'+(active?'0 0 0 2px rgba(201,168,76,.3)':'none')+'">'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:4px">Package '+p.id+'</div>'+
            '<div style="font-weight:800;font-size:14px;line-height:1.3">'+p.title+'</div>'+
            '<div style="color:var(--gold);font-size:12px;margin-bottom:4px">'+p.arabic+'</div>'+
            '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+p.location+'</div>'+
            '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">'+
              '<span style="background:rgba(39,174,96,.2);color:var(--green);padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--green)">✓ Ticket Included</span>'+
              '<span style="padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--gold);color:var(--gold)" dir="ltr">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</span>'+
            '</div>'+
            '<div style="font-size:20px;font-weight:800;color:var(--gold)">'+fmt+' <span style="font-size:12px;font-weight:400">JOD</span></div>'+
            '<div style="font-size:11px;color:var(--muted)">per person (double) \u00b7 '+p.nights+' nights \u00b7 '+p.meal+'</div>'+
            '<button onclick="event.stopPropagation();openBooking({type:\'package\',name:\''+p.title.replace(/'/g,"\\'")+'\',destination:\'القاهرة وأسوان والأقصر كروز\',price:\''+fmt+'\',nights:'+p.nights+',room:\'مزدوجة\',includes:\'فندق + تذكرة + مواصلات + برنامج\'})" style="width:100%;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:#25D366;border:none;border-radius:8px;color:#fff;font-family:Cairo,sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(37,211,102,.3)">'+WA_SVG+' احجز الآن</button>'+
            '<div style="display:flex;gap:6px;margin-top:8px">'+
            '<button onclick="event.stopPropagation();_egCardPrint('+p.id+',\'cac\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">🖨️ طباعة</button>'+
            '<button onclick="event.stopPropagation();_egCardPdf('+p.id+',\'cac\')" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;background:var(--dark3);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:Cairo,sans-serif;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s">📄 PDF</button>'+
            '</div>'+
            (!active?'<div style="margin-top:10px"><span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--gold);color:#fff;border-radius:8px;font-size:12px;font-weight:700;box-shadow:0 4px 15px rgba(201,168,76,.3)">📊 عرض التفاصيل والأسعار</span></div>':'')+
          '</div>';
        }).join('')}
      </div>
      <div id="cac-print-areas" style="display:none">
        ${cacFiltered.map(function(p){
          var fmt = (p.double||0).toLocaleString('en-US');
          return '<div id="cac-card-print-'+p.id+'">'+
            '<div style="font-family: \'Cairo\', sans-serif; direction: rtl; padding: 30px; max-width: 800px; margin: 0 auto; color: #222;">'+
              '<div style="text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 15px; margin-bottom: 20px;">'+
                '<div class="eg-print-title" style="font-size: 22px; font-weight: 800; color: #1a1a2e;">'+p.title+'</div>'+
                '<div style="font-size: 17px; color: #c9a84c; margin: 4px 0;">'+p.arabic+'</div>'+
                '<div style="font-size: 13px; color: #666;">'+p.location+'</div>'+
              '</div>'+
              '<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700;width:140px">🌟 Stars</td><td style="padding:6px 8px;border:1px solid #ddd">'+'\u2605'.repeat(p.stars)+' '+p.stars+'\u2605</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🍽️ Meal Plan</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.meal+'</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">🛏️ Double (per person)</td><td style="padding:6px 8px;border:1px solid #ddd;font-size:18px;font-weight:800;color:#c9a84c">'+fmt+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">👤 Single</td><td style="padding:6px 8px;border:1px solid #ddd">'+(p.single||0).toLocaleString('en-US')+' JOD</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">📅 Duration</td><td style="padding:6px 8px;border:1px solid #ddd">'+p.nights+' nights</td></tr>'+
                '<tr><td style="padding:6px 8px;border:1px solid #ddd;font-weight:700">✈️ Flights</td><td style="padding:6px 8px;border:1px solid #ddd">Amman ↔ Cairo / Aswan / Luxor (included)</td></tr>'+
              '</table>'+
              '<div style="font-size:12px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:12px">'+p.title+' · Judextravel.com · All prices in JOD</div>'+
            '</div>'+
          '</div>';
        }).join('')}
      </div>
      <div id="cac-detail"></div>
    </div>`;
    cacRenderDetail();
    return;
  }
  _origRenderDest(dest);
};

initFEConfig().then(function(){ loadPackages(); });

document.addEventListener('DOMContentLoaded',()=>{
  if(typeof LC!=='undefined'){
    const orig = LC.applyCurr.bind(LC);
    LC.applyCurr = function(curr){
      orig(curr);
      if(CURRENT_DEST) renderDest(CURRENT_DEST);
    };
  }
});

// ============================================================
// AL JUDE TRAVEL — Universal Booking Modal
// booking.js — include in all pages
// ============================================================

const BOOKING_WA = '00962777066005';

// ── Inject Modal HTML once DOM is ready ──────────────────────
(function () {
  const css = `
  #bk-overlay{display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);overflow-y:auto;padding:24px 16px}
  #bk-overlay.open{display:flex;align-items:flex-start;justify-content:center}
  #bk-modal{background:#0f1f3d;border:1px solid rgba(201,168,76,.3);border-radius:20px;width:100%;max-width:560px;padding:0;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6);margin:auto;font-family:'Cairo',sans-serif;animation:bkSlideIn .3s ease}
  @keyframes bkSlideIn{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
  #bk-header{background:linear-gradient(135deg,rgba(201,168,76,.18),rgba(201,168,76,.06));border-bottom:1px solid rgba(201,168,76,.2);padding:20px 24px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
  #bk-header-info{}
  #bk-header-title{font-size:17px;font-weight:800;color:#f0ede8;margin-bottom:4px}
  #bk-header-sub{font-size:12px;color:#8a9ab5;line-height:1.5}
  #bk-close{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#8a9ab5;font-size:18px;cursor:pointer;padding:4px 10px;flex-shrink:0;transition:all .2s}
  #bk-close:hover{background:rgba(231,76,60,.2);border-color:#e74c3c;color:#e74c3c}
  #bk-body{padding:24px}
  .bk-section{margin-bottom:20px}
  .bk-section-title{font-size:12px;font-weight:700;color:rgba(201,168,76,.8);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.06)}
  .bk-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
  .bk-row.full{grid-template-columns:1fr}
  .bk-field{display:flex;flex-direction:column;gap:5px}
  .bk-field label{font-size:12px;font-weight:600;color:#8a9ab5}
  .bk-field label .opt{font-weight:400;color:#6a7a95;font-size:11px}
  .bk-field input,.bk-field select,.bk-field textarea{background:#162340;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 14px;color:#f0ede8;font-family:'Cairo',sans-serif;font-size:13px;outline:none;transition:border-color .2s;width:100%}
  .bk-field input:focus,.bk-field select:focus,.bk-field textarea:focus{border-color:rgba(201,168,76,.5)}
  .bk-field input[readonly]{opacity:.6;cursor:default}
  .bk-field textarea{resize:vertical;min-height:70px}
  .bk-field select option{background:#0f1f3d}
  .bk-counter{display:flex;align-items:center;gap:0;border:1px solid rgba(255,255,255,.1);border-radius:10px;overflow:hidden;background:#162340}
  .bk-counter button{background:rgba(201,168,76,.12);border:none;color:#C9A84C;font-size:18px;font-weight:700;cursor:pointer;padding:8px 14px;transition:background .2s;font-family:'Cairo',sans-serif}
  .bk-counter button:hover{background:rgba(201,168,76,.25)}
  .bk-counter span{flex:1;text-align:center;font-size:15px;font-weight:700;color:#f0ede8;padding:8px 0}
  #bk-footer{padding:16px 24px 24px;display:flex;gap:10px}
  #bk-submit{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;background:#25D366;border:none;border-radius:12px;color:#fff;font-family:'Cairo',sans-serif;font-size:15px;font-weight:800;cursor:pointer;transition:opacity .2s}
  #bk-submit:hover{opacity:.9}
  #bk-cancel{padding:14px 20px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#8a9ab5;font-family:'Cairo',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
  #bk-cancel:hover{border-color:rgba(255,255,255,.2);color:#f0ede8}
  .bk-pkg-box{background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.2);border-radius:12px;padding:14px 16px;margin-bottom:20px}
  .bk-pkg-name{font-size:15px;font-weight:800;color:#f0ede8;margin-bottom:4px}
  .bk-pkg-detail{font-size:12px;color:#8a9ab5;line-height:1.8}
  .bk-pkg-price{font-size:20px;font-weight:900;color:#C9A84C;margin-top:6px}
  .bk-field .bk-error{font-size:11px;color:#e74c3c;display:none;margin-top:2px}
  .bk-field.bk-invalid input{border-color:#e74c3c!important}
  .bk-field.bk-invalid .bk-error{display:block}
  @media(max-width:480px){.bk-row{grid-template-columns:1fr}#bk-footer{flex-direction:column}}
  `;

  const html = `
  <div id="bk-overlay" onclick="if(event.target===this)closeBooking()">
    <div id="bk-modal">
      <div id="bk-header">
        <div id="bk-header-info">
          <div id="bk-header-title">📋 نموذج الحجز</div>
          <div id="bk-header-sub">يرجى تعبئة البيانات وسيتواصل معك فريقنا للتأكيد</div>
        </div>
        <button id="bk-close" onclick="closeBooking()">✕</button>
      </div>
      <div id="bk-body"></div>
      <div id="bk-footer">
        <button id="bk-cancel" onclick="closeBooking()">إلغاء</button>
        <button id="bk-submit" onclick="submitBooking()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          إرسال عبر واتساب
        </button>
      </div>
    </div>
  </div>`;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  document.body.insertAdjacentHTML('beforeend', html);
})();

// ── Current booking config ───────────────────────────────────
let _bkConfig = {};

// ── Counter helpers ──────────────────────────────────────────
function bkChange(id, delta, min, max) {
  const el = document.getElementById(id);
  let v = parseInt(el.textContent) + delta;
  if (v < min) v = min;
  if (v > max) v = max;
  el.textContent = v;
  if (id === 'bk-children') {
    document.getElementById('bk-child-ages-row').style.display = v > 0 ? 'block' : 'none';
  }
}
function bkVal(id) { return parseInt(document.getElementById(id).textContent); }

// ── Open Booking Modal ───────────────────────────────────────
function openBooking(cfg) {
  _bkConfig = cfg || {};
  const type = cfg.type || 'package';

  const titles = {
    package: '📦 حجز باقة سياحية',
    hotel: '🏨 حجز فندق ومواصلات',
    flight: '✈️ حجز تذكرة طيران / شارتر',
    umrah: '🕌 حجز باقة عمرة',
    charter: '🛩️ استفسار تأجير طائرة',
    offer: '🎁 حجز عرض خاص'
  };
  document.getElementById('bk-header-title').textContent = titles[type] || '📋 نموذج الحجز';

  document.getElementById('bk-body').innerHTML = buildForm(cfg);

  document.getElementById('bk-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('#bk-body input[type=date]').forEach(el => {
    el.min = today;
    if (!el.value) el.value = '';
  });
}

function closeBooking() {
  document.getElementById('bk-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Contact info section (phone required, email optional) ─────
function contactSection() {
  return `
    <div class="bk-section">
      <div class="bk-section-title">📞 معلومات التواصل</div>
      <div class="bk-row">
        <div class="bk-field" id="bk-phone-field">
          <label>رقم الهاتف <span style="color:#e74c3c">*</span></label>
          <input type="tel" id="bk-phone" placeholder="مثال: 07XXXXXXXX" dir="ltr" style="text-align:left" required>
          <div class="bk-error">يرجى إدخال رقم هاتف صحيح</div>
        </div>
        <div class="bk-field" id="bk-email-field">
          <label>البريد الإلكتروني <span class="opt">(اختياري)</span></label>
          <input type="email" id="bk-email" placeholder="example@email.com" dir="ltr" style="text-align:left">
          <div class="bk-error">يرجى إدخال بريد إلكتروني صحيح</div>
        </div>
      </div>
    </div>`;
}

// ── Build form based on type ─────────────────────────────────
function buildForm(cfg) {
  const type = cfg.type || 'package';
  let html = '';

  // ── Package info box ──
  if (cfg.name || cfg.hotel || cfg.destination) {
    html += `<div class="bk-pkg-box">
      <div class="bk-pkg-name">${cfg.name || cfg.hotel || ''}</div>
      <div class="bk-pkg-detail">
        ${cfg.destination ? '📍 ' + cfg.destination + '<br>' : ''}
        ${cfg.nights ? '🌙 ' + cfg.nights + ' ليالي<br>' : ''}
        ${cfg.room ? '🛏️ ' + cfg.room + '<br>' : ''}
        ${cfg.includes ? '✅ يشمل: ' + cfg.includes : ''}
      </div>
      ${cfg.price ? '<div class="bk-pkg-price">' + cfg.price + ' JOD <span style="font-size:12px;color:#8a9ab5;font-weight:400">/ شخص</span></div>' : ''}
    </div>`;
  }

  // ── PACKAGE / HOTEL form ──
  if (type === 'package' || type === 'hotel') {
    html += `
    <div class="bk-section">
      <div class="bk-section-title">📅 تواريخ السفر</div>
      <div class="bk-row">
        <div class="bk-field">
          <label>تاريخ الوصول (Check-in)</label>
          <input type="date" id="bk-checkin" required>
        </div>
        <div class="bk-field">
          <label>تاريخ المغادرة (Check-out)</label>
          <input type="date" id="bk-checkout" required>
        </div>
      </div>
    </div>
    <div class="bk-section">
      <div class="bk-section-title">👥 تفاصيل المسافرين</div>
      <div class="bk-row">
        <div class="bk-field">
          <label>عدد البالغين</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-adults',-1,1,30)">−</button>
            <span id="bk-adults">2</span>
            <button onclick="bkChange('bk-adults',1,1,30)">+</button>
          </div>
        </div>
        <div class="bk-field">
          <label>عدد الغرف</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-rooms',-1,1,10)">−</button>
            <span id="bk-rooms">1</span>
            <button onclick="bkChange('bk-rooms',1,1,10)">+</button>
          </div>
        </div>
      </div>
      <div class="bk-row">
        <div class="bk-field">
          <label>عدد الأطفال (2–11 سنة)</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-children',-1,0,10)">−</button>
            <span id="bk-children">0</span>
            <button onclick="bkChange('bk-children',1,0,10)">+</button>
          </div>
        </div>
        <div class="bk-field">
          <label>عدد الرضّع (أقل من سنتين)</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-infants',-1,0,5)">−</button>
            <span id="bk-infants">0</span>
            <button onclick="bkChange('bk-infants',1,0,5)">+</button>
          </div>
        </div>
      </div>
      <div id="bk-child-ages-row" style="display:none" class="bk-row full">
        <div class="bk-field">
          <label>أعمار الأطفال (مثال: 5, 8, 10)</label>
          <input type="text" id="bk-child-ages" placeholder="اكتب أعمار الأطفال مفصولة بفاصلة">
        </div>
      </div>
      <div class="bk-row full">
        <div class="bk-field">
          <label>نوع الغرفة المفضّل</label>
          <select id="bk-roomtype">
            <option value="مزدوجة">مزدوجة (Double)</option>
            <option value="توين">توين (Twin)</option>
            <option value="ثلاثية">ثلاثية (Triple)</option>
            <option value="عائلية">عائلية (Family)</option>
            <option value="مفردة">مفردة (Single)</option>
          </select>
        </div>
      </div>
    </div>`;
  }

  // ── FLIGHT form ──
  else if (type === 'flight') {
    html += `
    <div class="bk-section">
      <div class="bk-section-title">✈️ تفاصيل الرحلة</div>
      <div class="bk-row">
        <div class="bk-field">
          <label>وجهة المغادرة (From)</label>
          <input type="text" id="bk-from" value="عمان — مطار ماركا" placeholder="مطار المغادرة">
        </div>
        <div class="bk-field">
          <label>وجهة الوصول (To)</label>
          <input type="text" id="bk-to" value="${cfg.destination||''}" placeholder="وجهة السفر">
        </div>
      </div>
      <div class="bk-row">
        <div class="bk-field">
          <label>تاريخ الذهاب</label>
          <input type="date" id="bk-depart" required>
        </div>
        <div class="bk-field">
          <label>تاريخ العودة (اتركه فارغاً للذهاب فقط)</label>
          <input type="date" id="bk-return">
        </div>
      </div>
      <div class="bk-row full">
        <div class="bk-field">
          <label>شركة الطيران</label>
          <input type="text" id="bk-airline" value="${cfg.airline||''}" placeholder="اسم شركة الطيران">
        </div>
      </div>
      <div class="bk-row full">
        <div class="bk-field">
          <label>درجة السفر</label>
          <select id="bk-class">
            <option value="اقتصادية">اقتصادية (Economy)</option>
            <option value="بزنس">بزنس (Business)</option>
          </select>
        </div>
      </div>
    </div>
    <div class="bk-section">
      <div class="bk-section-title">👥 عدد المسافرين</div>
      <div class="bk-row">
        <div class="bk-field">
          <label>بالغون</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-adults',-1,1,50)">−</button>
            <span id="bk-adults">2</span>
            <button onclick="bkChange('bk-adults',1,1,50)">+</button>
          </div>
        </div>
        <div class="bk-field">
          <label>أطفال (2–11 سنة)</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-children',-1,0,20)">−</button>
            <span id="bk-children">0</span>
            <button onclick="bkChange('bk-children',1,0,20)">+</button>
          </div>
        </div>
      </div>
      <div class="bk-row">
        <div class="bk-field">
          <label>رضّع (أقل من سنتين)</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-infants',-1,0,10)">−</button>
            <span id="bk-infants">0</span>
            <button onclick="bkChange('bk-infants',1,0,10)">+</button>
          </div>
        </div>
        <div class="bk-field" style="opacity:0"></div>
      </div>
      <div id="bk-child-ages-row" style="display:none" class="bk-row full">
        <div class="bk-field">
          <label>أعمار الأطفال</label>
          <input type="text" id="bk-child-ages" placeholder="مثال: 5, 8">
        </div>
      </div>
    </div>`;
  }

  // ── UMRAH form ──
  else if (type === 'umrah') {
    html += `
    <div class="bk-section">
      <div class="bk-section-title">📅 تاريخ السفر</div>
      <div class="bk-row">
        <div class="bk-field">
          <label>تاريخ المغادرة المطلوب</label>
          <input type="date" id="bk-depart" required>
        </div>
        <div class="bk-field">
          <label>نوع الغرفة</label>
          <select id="bk-roomtype">
            <option value="مزدوجة">مزدوجة</option>
            <option value="ثلاثية">ثلاثية</option>
            <option value="رباعية">رباعية</option>
            <option value="مفردة">مفردة (إضافة)</option>
          </select>
        </div>
      </div>
    </div>
    <div class="bk-section">
      <div class="bk-section-title">👥 عدد المسافرين</div>
      <div class="bk-row">
        <div class="bk-field">
          <label>بالغون</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-adults',-1,1,30)">−</button>
            <span id="bk-adults">2</span>
            <button onclick="bkChange('bk-adults',1,1,30)">+</button>
          </div>
        </div>
        <div class="bk-field">
          <label>أطفال (2–11 سنة)</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-children',-1,0,10)">−</button>
            <span id="bk-children">0</span>
            <button onclick="bkChange('bk-children',1,0,10)">+</button>
          </div>
        </div>
      </div>
      <div class="bk-row">
        <div class="bk-field">
          <label>رضّع (أقل من سنتين)</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-infants',-1,0,5)">−</button>
            <span id="bk-infants">0</span>
            <button onclick="bkChange('bk-infants',1,0,5)">+</button>
          </div>
        </div>
        <div class="bk-field" style="opacity:0"></div>
      </div>
      <div id="bk-child-ages-row" style="display:none" class="bk-row full">
        <div class="bk-field">
          <label>أعمار الأطفال</label>
          <input type="text" id="bk-child-ages" placeholder="مثال: 5, 8">
        </div>
      </div>
    </div>`;
  }

  // ── CHARTER / AIRCRAFT LEASING form ──
  else if (type === 'charter') {
    html += `
    <div class="bk-section">
      <div class="bk-section-title">🛩️ تفاصيل الرحلة</div>
      <div class="bk-row">
        <div class="bk-field">
          <label>نوع الخدمة</label>
          <select id="bk-charter-type">
            <option>شارتر خاص (Charter)</option>
            <option>ACMI — تأجير بالطاقم</option>
            <option>تأجير جاف (Dry Lease)</option>
            <option>رحلة مجموعة</option>
          </select>
        </div>
        <div class="bk-field">
          <label>مطار المغادرة</label>
          <input type="text" id="bk-from" placeholder="مثال: عمان — ماركا">
        </div>
      </div>
      <div class="bk-row">
        <div class="bk-field">
          <label>وجهة الوصول</label>
          <input type="text" id="bk-to" placeholder="المدينة أو المطار">
        </div>
        <div class="bk-field">
          <label>تاريخ الرحلة</label>
          <input type="date" id="bk-depart">
        </div>
      </div>
    </div>
    <div class="bk-section">
      <div class="bk-section-title">👥 المسافرون والتفاصيل</div>
      <div class="bk-row">
        <div class="bk-field">
          <label>عدد المسافرين</label>
          <div class="bk-counter">
            <button onclick="bkChange('bk-adults',-1,1,500)">−</button>
            <span id="bk-adults">50</span>
            <button onclick="bkChange('bk-adults',1,1,500)">+</button>
          </div>
        </div>
        <div class="bk-field">
          <label>مدة الإيجار / الرحلة</label>
          <input type="text" id="bk-duration" placeholder="مثال: 3 أيام، أسبوع...">
        </div>
      </div>
    </div>`;
  }

  // ── OFFER form (same as package) ──
  else if (type === 'offer') {
    html += buildPackageFormFields();
  }

  // ── Contact info (phone required, email optional) — added to ALL forms ──
  html += contactSection();

  // ── Notes section ──
  html += `
    <div class="bk-section">
      <div class="bk-section-title">📝 ملاحظات إضافية</div>
      <div class="bk-row full">
        <div class="bk-field">
          <label>طلبات خاصة أو استفسارات</label>
          <textarea id="bk-notes" placeholder="أي طلبات خاصة — طابق محدد، سرير إضافي، مناسبة..."></textarea>
        </div>
      </div>
    </div>`;

  return html;
}

// ── Validate contact fields ──────────────────────────────────
function validateContact() {
  const phoneEl = document.getElementById('bk-phone');
  const emailEl = document.getElementById('bk-email');
  const phoneField = document.getElementById('bk-phone-field');
  const emailField = document.getElementById('bk-email-field');
  let valid = true;

  // Clear previous errors
  phoneField.classList.remove('bk-invalid');
  emailField.classList.remove('bk-invalid');

  // Phone required — must be at least 8 digits
  const phone = (phoneEl.value || '').replace(/\s/g, '');
  const digits = phone.replace(/[^0-9]/g, '');
  if (!phone || digits.length < 8) {
    phoneField.classList.add('bk-invalid');
    valid = false;
  }

  // Email optional — only validate format if entered
  const email = (emailEl.value || '').trim();
  if (email.length > 0) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      emailField.classList.add('bk-invalid');
      valid = false;
    }
  }

  return valid;
}

// ── Submit → send to WhatsApp ────────────────────────────────
function submitBooking() {
  if (!validateContact()) return;

  const cfg = _bkConfig;
  const type = cfg.type || 'package';
  let msg = '🌟 *طلب حجز جديد — الجود للسياحة والسفر*\n';
  msg += '━━━━━━━━━━━━━━━━━━━━\n\n';

  if (cfg.name || cfg.hotel) msg += `📦 *الباقة/الفندق:* ${cfg.name || cfg.hotel}\n`;
  if (cfg.destination) msg += `📍 *الوجهة:* ${cfg.destination}\n`;
  if (cfg.nights) msg += `🌙 *عدد الليالي:* ${cfg.nights}\n`;
  if (cfg.price) msg += `💰 *السعر المعروض:* ${cfg.price} JOD/شخص\n`;

  const getVal = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
  const getCnt = (id) => { const el = document.getElementById(id); return el ? el.textContent : '0'; };

  const phone = getVal('bk-phone');
  const email = getVal('bk-email');

  msg += `\n📞 *رقم الهاتف:* ${phone}\n`;
  if (email.trim()) msg += `✉️ *البريد الإلكتروني:* ${email.trim()}\n`;

  if (type === 'package' || type === 'hotel' || type === 'offer') {
    const cin = getVal('bk-checkin');
    const cout = getVal('bk-checkout');
    if (!cin) { alert('يرجى اختيار تاريخ الوصول'); return; }
    if (!cout) { alert('يرجى اختيار تاريخ المغادرة'); return; }
    const adults = getCnt('bk-adults');
    const rooms = getCnt('bk-rooms');
    const children = getCnt('bk-children');
    const infants = getCnt('bk-infants');
    const roomtype = getVal('bk-roomtype');
    const childAges = getVal('bk-child-ages');
    const notes = getVal('bk-notes');
    msg += `\n📅 *تاريخ الوصول:* ${cin}\n`;
    msg += `📅 *تاريخ المغادرة:* ${cout}\n`;
    msg += `\n👥 *تفاصيل المسافرين:*\n`;
    msg += `   • البالغون: ${adults}\n`;
    msg += `   • الأطفال (2–11): ${children}${childAges ? ' | أعمارهم: ' + childAges : ''}\n`;
    msg += `   • الرضّع (<2): ${infants}\n`;
    msg += `\n🏠 *عدد الغرف:* ${rooms}\n`;
    msg += `🛏️ *نوع الغرفة:* ${roomtype}\n`;
    if (notes) msg += `\n📝 *ملاحظات:* ${notes}\n`;
  }

  else if (type === 'flight') {
    const from = getVal('bk-from');
    const to = getVal('bk-to');
    const airline = getVal('bk-airline');
    const depart = getVal('bk-depart');
    const ret = getVal('bk-return');
    const cls = getVal('bk-class');
    if (!depart) { alert('يرجى اختيار تاريخ الذهاب'); return; }
    const adults = getCnt('bk-adults');
    const children = getCnt('bk-children');
    const infants = getCnt('bk-infants');
    const childAges = getVal('bk-child-ages');
    const notes = getVal('bk-notes');
    if (airline) msg += `\n✈️ *شركة الطيران:* ${airline}\n`;
    msg += `✈️ *من:* ${from}\n`;
    msg += `✈️ *إلى:* ${to}\n`;
    msg += `📅 *تاريخ الذهاب:* ${depart}\n`;
    if (ret) msg += `📅 *تاريخ العودة:* ${ret}\n`;
    msg += `💺 *الدرجة:* ${cls}\n`;
    msg += `\n👥 *المسافرون:*\n`;
    msg += `   • البالغون: ${adults}\n`;
    msg += `   • الأطفال: ${children}${childAges ? ' | أعمار: ' + childAges : ''}\n`;
    msg += `   • الرضّع: ${infants}\n`;
    if (notes) msg += `\n📝 *ملاحظات:* ${notes}\n`;
  }

  else if (type === 'umrah') {
    const depart = getVal('bk-depart');
    const roomtype = getVal('bk-roomtype');
    const adults = getCnt('bk-adults');
    const children = getCnt('bk-children');
    const infants = getCnt('bk-infants');
    const childAges = getVal('bk-child-ages');
    const notes = getVal('bk-notes');
    if (!depart) { alert('يرجى اختيار تاريخ المغادرة'); return; }
    msg += `\n📅 *تاريخ المغادرة:* ${depart}\n`;
    msg += `🛏️ *نوع الغرفة:* ${roomtype}\n`;
    msg += `\n👥 *المسافرون:*\n`;
    msg += `   • البالغون: ${adults}\n`;
    msg += `   • الأطفال: ${children}${childAges ? ' | أعمار: ' + childAges : ''}\n`;
    msg += `   • الرضّع: ${infants}\n`;
    if (notes) msg += `\n📝 *ملاحظات:* ${notes}\n`;
  }

  else if (type === 'charter') {
    const svcType = getVal('bk-charter-type');
    const from = getVal('bk-from');
    const to = getVal('bk-to');
    const depart = getVal('bk-depart');
    const pax = getCnt('bk-adults');
    const duration = getVal('bk-duration');
    const notes = getVal('bk-notes');
    msg += `\n🛩️ *نوع الخدمة:* ${svcType}\n`;
    msg += `🛫 *من:* ${from}\n`;
    msg += `🛬 *إلى:* ${to}\n`;
    if (depart) msg += `📅 *التاريخ:* ${depart}\n`;
    msg += `👥 *عدد المسافرين:* ${pax}\n`;
    if (duration) msg += `⏱️ *المدة:* ${duration}\n`;
    if (notes) msg += `\n📝 *تفاصيل:* ${notes}\n`;
  }

  msg += '\n━━━━━━━━━━━━━━━━━━━━\n';
  msg += '📲 أرجو التواصل للتأكيد. شكراً 🙏';

  const url = 'https://wa.me/' + BOOKING_WA + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
  closeBooking();
}

// ── ESC key to close ─────────────────────────────────────────
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBooking(); });

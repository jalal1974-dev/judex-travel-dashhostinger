// AL-JUDE Travel — Bulk Hotel Data Importer
// Run: node import_data.js
// You'll be prompted for admin email & password
// This reads *clean.json / *fareast3_clean.json files and imports to Supabase

const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SB_URL = 'https://rmpuvrmxakukgvtxethj.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcHV2cm14YWt1a2d2dHhldGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODAyMjcsImV4cCI6MjA5Mzg1NjIyN30.lO8rNtwfLXYFnyGk5dOthPEUj3XIWkfFvSOziTeDFeE';

// ---- Map clean JSON files to destinations ----
const DEST_FILE_MAP = [
  { dest: 'sharm',     file: 'sharm_clean.json' },
  { dest: 'antalya',   file: 'antalya_clean.json' },
  { dest: 'istanbul',  file: 'istanbul_clean.json' },
  { dest: 'trabzon',   file: 'trabzon_clean.json' },
  { dest: 'georgia',   file: 'georgia_clean.json' },
  { dest: 'bali',      file: 'bali_fareast3_clean.json' },
  { dest: 'thailand',  file: 'thailand_fareast3_clean.json' },
  { dest: 'singapore', file: 'singapore_fareast3_clean.json' },
  { dest: 'vietnam',   file: 'vietnam_fareast3_clean.json' },
  { dest: 'malaysia',  file: 'malaysia_fareast3_clean.json' },
  { dest: 'maldives',  file: 'maldives_fareast3_clean.json' },
  { dest: 'srilanka',  file: 'srilanka_fareast3_clean.json' },
  { dest: 'aqaba',     file: 'aqaba_hotels_clean.json' },
  { dest: 'azerbaijan', file: 'azerbaijan_clean.json' },
  { dest: 'hurghada',  file: 'hurghada_clean.json' },
];

const DATA_DIR = __dirname;

// ---- Helpers ----
function fetch(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(SB_URL + '/rest/v1/' + path);
    const opts = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + token,
        'Prefer': 'return=representation,resolution=merge-duplicates',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(data ? JSON.parse(data) : null); }
          catch (e) { resolve(data); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function authLogin(email, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password, gotrue_meta_security: {} });
    const opts = {
      hostname: 'rmpuvrmxakukgvtxethj.supabase.co',
      path: '/auth/v1/token?grant_type=password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SB_KEY,
      },
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const d = JSON.parse(body);
          if (d.access_token) resolve(d.access_token);
          else reject(new Error('Login failed: ' + (d.msg || d.error_description || body)));
        } catch (e) { reject(new Error('Login parse error: ' + body)); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function parseDate(d) {
  if (!d || d === '2026') return '2026-06-01'; // year-only → default June 1
  const parts = d.split('.');
  if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
  if (parts.length === 2) return `2026-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
  return d;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Antalya hotels that use USD instead of EUR
const ANTALYA_USD_HOTELS = new Set([
  'Selectum Family Resort Side',
  'Selectum Family Comfort Side',
]);

// ---- Import one destination ----
async function importDestination(dest, hotels, token, mealDefault) {
  let imported = 0, periodCount = 0, errors = 0;

  for (const item of hotels) {
    if (!item.name) { errors++; continue; }
    try {
      // Upsert hotel
      const hotelData = {
        destination: dest,
        name: item.name,
        stars: item.stars || 3,
        location: item.location || '',
        room_type: item.room_type || 'Standard',
        meal_plan: item.meal_plan || mealDefault || 'BB',
        child_policy: item.child_policy || '',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const res = await fetch('POST', `hotels?on_conflict=destination,name`, [hotelData], token);
      const hotel = Array.isArray(res) ? res[0] : null;
      if (!hotel || !hotel.id) { errors++; continue; }
      imported++;

      // Determine per-hotel currency (from item, or Antalya exceptions, or null = use destination base)
      let hotelCurrency = item.currency || null;
      if (!hotelCurrency && dest === 'antalya' && ANTALYA_USD_HOTELS.has(item.name)) {
        hotelCurrency = 'USD';
      }

      // Import periods
      const periods = item.periods || [];
      for (const p of periods) {
        try {
          const periodData = {
            hotel_id: hotel.id,
            date_from: parseDate(p.date_from),
            date_to: parseDate(p.date_to),
            room_type: p.room_type || item.room_type || 'Standard',
            meal_plan: p.meal_plan || item.meal_plan || mealDefault || 'BB',
            single_usd: p.single != null ? p.single : (p.single_usd || null),
            double_usd: p.double != null ? p.double : (p.double_usd || null),
            triple_usd: p.triple != null ? p.triple : (p.triple_usd || null),
            extra_bed_usd: p.extra_bed != null ? p.extra_bed : (p.extra_bed_usd || null),
            nights: p.nights != null ? p.nights : null,
            currency: p.currency || hotelCurrency,
            weekday_price: p.weekday_price != null ? p.weekday_price : null,
            weekend_price: p.weekend_price != null ? p.weekend_price : null,
            is_active: true,
          };
          await fetch('POST', 'hotel_periods', [periodData], token);
          periodCount++;
        } catch (e) { errors++; }
      }
    } catch (e) { errors++; }
  }
  return { imported, periodCount, errors };
}

// ---- Main ----
async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const email = await new Promise(r => rl.question('Supabase admin email: ', r));
  const password = await new Promise(r => rl.question('Supabase admin password: ', r));
  rl.close();

  console.log('\n🔐 Logging in...');
  let token;
  try {
    token = await authLogin(email, password);
    console.log('✅ Logged in successfully!\n');
  } catch (e) {
    console.error('❌ Login failed:', e.message);
    console.log('   Make sure you have a user in Supabase Authentication (email/password).');
    console.log('   Go to https://supabase.com/dashboard/project/rmpuvrmxakukgvtxethj/auth/users');
    process.exit(1);
  }

  let totalHotels = 0, totalPeriods = 0, totalErrors = 0;

  // ---- Import each destination ----
  for (const { dest, file } of DEST_FILE_MAP) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${dest}: ${file} not found, skipping`);
      continue;
    }
    console.log(`📥 ${dest}: reading ${file}...`);
    let raw;
    try { raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')); }
    catch (e) { console.error(`   ❌ JSON parse error: ${e.message}`); continue; }
    if (!Array.isArray(raw) || raw.length === 0) {
      console.log(`   ⚠️  Empty or invalid JSON, skipping`);
      continue;
    }
    console.log(`   ${raw.length} hotels found`);
    // Determine meal plan default
    const mealDefault = (dest === 'sharm' || dest === 'antalya') ? 'ALL' :
                        (dest === 'aqaba') ? 'BB' : 'BB';
    const result = await importDestination(dest, raw, token, mealDefault);
    totalHotels += result.imported;
    totalPeriods += result.periodCount;
    totalErrors += result.errors;
    console.log(`   ✅ ${result.imported} hotels, ${result.periodCount} periods imported` +
                (result.errors ? ` (${result.errors} errors)` : ''));
    await sleep(300); // rate limit
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 IMPORT SUMMARY:`);
  console.log(`   Total hotels: ${totalHotels}`);
  console.log(`   Total periods: ${totalPeriods}`);
  console.log(`   Total errors: ${totalErrors}`);
  console.log('='.repeat(50));
  console.log('\n✅ Done!');
  console.log('   Next: Go to admin.html → Pricing Calculator to verify & publish.');
  console.log('   For Aqaba: use weekday/weekend toggle in pricing settings.');
  console.log('   For Istanbul/Trabzon: periods have "nights" — calculator filters by it.');
}

main().catch(console.error);

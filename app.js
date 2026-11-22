import { COLUMNS, GESCHOSSE, ZUSTAND, JNK, DOKU, LIEGT_VOR, GEWERKE, CHECKLISTE, UNTERLAGEN, GEWERK_GRUPPEN } from './data.js';
import * as db from './db.js';
import { makeZip, readZip } from './zip.js';
import { buildXlsx, readXlsxSheet, STYLE, serialToIso } from './xlsx.js';

const APP_VERSION = '1.1.1';
const COL = Object.fromEntries(COLUMNS.map((c) => [c.key, c]));
const OPTIONS = { jnk: JNK, doku: DOKU, zustand: ZUSTAND };
const SECTIONS = [
  ['Ort', ['liegenschaft', 'gebaeude', 'geschoss', 'raumNr', 'raumBez']],
  ['Anlage', ['gewerk', 'anlagenart', 'bezeichnung', 'id', 'anzahl']],
  ['FOTOS', []],
  ['Typenschild', ['hersteller', 'typ', 'seriennr', 'baujahr', 'kenndaten']],
  ['Prüfung und Wartung', ['pruefpflichtig', 'wartungspflichtig', 'letztePruefung', 'pruefer', 'wartungsvertrag', 'wartungsfirma']],
  ['Dokumente', ['pruefbuch', 'anleitung', 'revisionsplan']],
  ['Zustand', ['zustand', 'maengel', 'fotoNr']],
  ['Erfassung', ['erfasstVon', 'erfasstAm']],
];
const CHUNK = 150 * 1024 * 1024; // max. Größe je ZIP-Teil

const S = {
  anlagen: [],
  settings: { liegenschaft: '', gebaeude: '', erfasser: '', fotoMax: 1920, ortUebernehmen: true },
  geschosse: [...GESCHOSSE],
  check: {},
  unterl: {},
  lastBackup: null,
  lastChange: null,
  listFilter: 'alle',
  listSearch: '',
  listSort: 'zuletzt',
  openGroup: null,
  current: null,
  showMissing: false,
  untouched: new Set(),
  returnTo: '#/liste',
  busy: false,
  focusPhotos: false,
};
let installEvt = null;

// ---------------------------------------------------------------- Hilfsfunktionen
const $ = (sel, root = document) => root.querySelector(sel);
const main = () => $('#main');
const h = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad2 = (n) => String(n).padStart(2, '0');
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2));
const isoToDe = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? `${m[3]}.${m[2]}.${m[1]}` : (iso || ''); };
const fmtBytes = (b) => (b >= 1e6 ? (b / 1e6).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' kB');
const fmtDateTime = (t) => new Date(t).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
const safeName = (s) => String(s || '').trim().replace(/[\\/:*?"<>|\s]+/g, '_') || 'ohne';
const byId = (a, b) => (a.id || '~').localeCompare(b.id || '~', 'de', { numeric: true, sensitivity: 'base' });
const baseName = (r) => (r.id && r.id.trim() ? safeName(r.id) : `OHNE-ID_${r.uid.slice(0, 8)}`);
const fotoNames = (r) => Array.from({ length: r.fotoCount || 0 }, (_, i) => `${baseName(r)}_${pad2(i + 1)}.jpg`);
const fileTag = () => `${safeName(S.settings.gebaeude || 'Export')}_${today()}`;
const ckKey = (bereich, it) => `${bereich}|${it.anlage}`;
const imgSearchUrl = (q) => 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q);
const webSearchUrl = (q) => 'https://www.google.com/search?q=' + encodeURIComponent(q);

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 120000);
}

const missing = (r) => COLUMNS.filter((c) => c.pflicht && !String(r[c.key] ?? '').trim());
const hasKlaeren = (r) => ['pruefpflichtig', 'wartungspflichtig', 'wartungsvertrag'].some((k) => r[k] === 'klären');
const isBad = (r) => r.zustand === 'schlecht' || r.zustand === 'außer Betrieb' || !!String(r.maengel || '').trim();
function dupId(r) {
  const id = (r.id || '').trim().toLowerCase();
  return !!id && S.anlagen.some((a) => a.uid !== r.uid && (a.id || '').trim().toLowerCase() === id);
}

function setTitle(t) {
  $('#title').textContent = t;
  document.title = `${t} – TGA Anlagenerfassung`;
}

let saveStateTimer;
function setSaveState(t) {
  const el = $('#savestate');
  el.textContent = t;
  clearTimeout(saveStateTimer);
  if (t === 'gespeichert') saveStateTimer = setTimeout(() => { el.textContent = ''; }, 1500);
}

let toastTimer;
function toast(msg, ms = 2600) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, ms);
}

let modalUrls = [];
function openModal(html) {
  const m = $('#modal');
  m.onclick = null;
  m.innerHTML = `<div class="sheet">${html}</div>`;
  m.hidden = false;
  return m;
}
function closeModal() {
  const m = $('#modal');
  m.hidden = true;
  m.innerHTML = '';
  m.onclick = null;
  modalUrls.forEach((u) => URL.revokeObjectURL(u));
  modalUrls = [];
}
function busyModal(text) {
  S.busy = true;
  openModal(`<h3>Bitte warten …</h3><p class="hint" id="prog">${h(text)}</p>`);
}
function endBusy() {
  S.busy = false;
  closeModal();
}
function setProgress(text) {
  const p = $('#prog');
  if (p) p.textContent = text;
}

function markChanged() {
  S.lastChange = Date.now();
  db.setMeta('lastChange', S.lastChange);
}

// ---------------------------------------------------------------- Speichern
let saveTimer = null;
let pending = null;
function scheduleSave(r) {
  pending = r;
  clearTimeout(saveTimer);
  setSaveState('…');
  saveTimer = setTimeout(flushSave, 400);
}
async function flushSave() {
  clearTimeout(saveTimer);
  if (!pending) return;
  const r = pending;
  pending = null;
  r.updated = Date.now();
  try {
    await db.put('anlagen', r);
    markChanged();
    setSaveState('gespeichert');
  } catch (e) {
    setSaveState('Fehler');
    alert('Speichern fehlgeschlagen: ' + e.message);
  }
}
function touched(r) {
  S.untouched.delete(r.uid);
}

// ---------------------------------------------------------------- Anlagen-ID
function suggestId(r) {
  const geb = (r.gebaeude || '').trim();
  const kg = (r.gewerk || '').slice(0, 3);
  if (!geb || !/^\d{3}$/.test(kg)) return '';
  const prefix = `${geb}-${kg}-`;
  let max = 0;
  for (const a of S.anlagen) {
    if (a.uid === r.uid) continue;
    const id = (a.id || '').trim();
    if (id.toLowerCase().startsWith(prefix.toLowerCase())) {
      const n = parseInt(id.slice(prefix.length), 10);
      if (n > max) max = n;
    }
  }
  return prefix + String(max + 1).padStart(3, '0');
}
function applyAutoId(r) {
  if (r.id && !r.idAuto) return;
  const s = suggestId(r);
  if (s) { r.id = s; r.idAuto = true; }
}

async function newAnlage(preset = {}, keepIfUntouched = false) {
  const last = [...S.anlagen].sort((a, b) => (b.updated || 0) - (a.updated || 0))[0];
  const r = {
    uid: uuid(), created: Date.now(), updated: Date.now(), fotoCount: 0, idAuto: true,
    liegenschaft: S.settings.liegenschaft || '', gebaeude: S.settings.gebaeude || '',
    erfasstVon: S.settings.erfasser || '', erfasstAm: today(),
  };
  if (S.settings.ortUebernehmen && last) {
    r.geschoss = last.geschoss || '';
    r.raumNr = last.raumNr || '';
    r.raumBez = last.raumBez || '';
    if (!r.liegenschaft) r.liegenschaft = last.liegenschaft || '';
    if (!r.gebaeude) r.gebaeude = last.gebaeude || '';
  }
  Object.assign(r, preset);
  if (!r.id) applyAutoId(r);
  S.anlagen.push(r);
  if (!keepIfUntouched) S.untouched.add(r.uid);
  await db.put('anlagen', r);
  return r;
}

async function leaveForm() {
  const r = S.current;
  S.current = null;
  if (S.showMissing) $('#toast').hidden = true;
  S.showMissing = false;
  if (!r) return;
  await flushSave();
  if (S.untouched.has(r.uid) && !(r.fotoCount > 0)) {
    S.untouched.delete(r.uid);
    S.anlagen = S.anlagen.filter((a) => a.uid !== r.uid);
    await db.del('anlagen', r.uid);
  }
}

// ---------------------------------------------------------------- Router
async function route() {
  const parts = (location.hash.replace(/^#\/?/, '') || 'liste').split('/');
  const view = parts[0];
  const arg = decodeURIComponent(parts[1] || '');
  if (S.current && !(view === 'anlage' && arg === S.current.uid)) await leaveForm();
  revokeThumbs();
  const m = main();
  m.onclick = m.oninput = m.onchange = null;
  document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === (view === 'anlage' ? (S.returnTo === '#/check' ? 'check' : 'liste') : view)));
  $('#back').hidden = view !== 'anlage';
  window.scrollTo(0, 0);
  if (view === 'anlage') return renderForm(arg);
  if (view === 'check') return renderCheck();
  if (view === 'unterlagen') return renderUnterlagen();
  if (view === 'export') return renderExport();
  return renderList();
}

// ---------------------------------------------------------------- Liste
function backupBanner() {
  if (!S.anlagen.length) return '';
  const lb = S.lastBackup;
  const lc = S.lastChange || 0;
  if (lb && lc <= lb) return '';
  if (lb && Date.now() - lb < 12 * 3600e3) return '';
  return `<div class="banner">${lb ? `Letzte Datensicherung: ${fmtDateTime(lb)}.` : 'Noch keine Datensicherung.'} Die Daten liegen nur auf diesem Gerät. <a href="#/export">Jetzt sichern</a></div>`;
}

function itemHtml(r) {
  const m = missing(r);
  const d = dupId(r);
  const badges = [];
  if (m.length) badges.push(`<span class="badge red">${m.length === 1 ? '1 Pflichtfeld fehlt' : `${m.length} Pflichtfelder fehlen`}</span>`);
  if (d) badges.push('<span class="badge red">ID doppelt</span>');
  if (hasKlaeren(r)) badges.push('<span class="badge yellow">klären</span>');
  if (r.zustand === 'schlecht' || r.zustand === 'außer Betrieb') badges.push(`<span class="badge red">${h(r.zustand)}</span>`);
  else if (String(r.maengel || '').trim()) badges.push('<span class="badge yellow">Mangel</span>');
  if (r.fotoCount) badges.push(`<span class="badge grey">${r.fotoCount} Foto${r.fotoCount > 1 ? 's' : ''}</span>`);
  if (+r.anzahl > 1) badges.push(`<span class="badge">${h(r.anzahl)} Stk.</span>`);
  return `<a class="item${m.length || d ? ' incomplete' : ''}" href="#/anlage/${encodeURIComponent(r.uid)}">
    <div class="item-top"><span class="item-id">${h(r.id || 'ohne ID')}</span><span class="item-meta">${h([r.geschoss, r.raumNr].filter(Boolean).join(' · '))}</span></div>
    <div class="item-title">${h(r.bezeichnung || r.anlagenart || '(ohne Bezeichnung)')}</div>
    <div class="item-meta">${h([r.anlagenart, r.raumBez].filter(Boolean).join(' · '))}</div>
    ${badges.length ? `<div class="badges">${badges.join('')}</div>` : ''}</a>`;
}

function filteredList() {
  const q = S.listSearch.trim().toLowerCase();
  const list = S.anlagen.filter((r) => {
    if (S.listFilter === 'offen' && !missing(r).length && !dupId(r)) return false;
    if (S.listFilter === 'klaeren' && !hasKlaeren(r)) return false;
    if (S.listFilter === 'maengel' && !isBad(r)) return false;
    if (q) {
      const hay = [r.id, r.bezeichnung, r.anlagenart, r.gewerk, r.raumNr, r.raumBez, r.geschoss, r.hersteller, r.typ, r.seriennr]
        .join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  list.sort(S.listSort === 'id' ? byId : (a, b) => (b.updated || 0) - (a.updated || 0));
  return list;
}

function renderItems() {
  const list = filteredList();
  const all = S.anlagen;
  const nOffen = all.filter((r) => missing(r).length || dupId(r)).length;
  const fotos = all.reduce((s, r) => s + (r.fotoCount || 0), 0);
  $('#summary').textContent = `${all.length} Anlagen · ${nOffen} unvollständig · ${fotos} Fotos${list.length !== all.length ? ` · ${list.length} angezeigt` : ''}`;
  $('#items').innerHTML = list.length
    ? list.map(itemHtml).join('')
    : `<p class="empty">${all.length ? 'Keine Treffer.' : 'Noch keine Anlagen erfasst.<br>Mit „+ Neue Anlage“ starten oder über die Checkliste vorgehen.'}</p>`;
}

function renderList() {
  setTitle('Anlagen');
  const chips = [['alle', 'Alle'], ['offen', 'Unvollständig'], ['klaeren', 'Klären'], ['maengel', 'Mängel']];
  const setupHint = !S.settings.gebaeude || !S.settings.erfasser
    ? '<div class="banner">Tipp: Unter <a href="#/export">Export → Einstellungen</a> Liegenschaft, Gebäude und dein Kürzel hinterlegen – dann sind diese Felder bei jeder neuen Anlage schon ausgefüllt.</div>'
    : '';
  main().innerHTML = `
    ${backupBanner()}${setupHint}
    <div class="toolbar">
      <input type="search" id="search" placeholder="Suchen (ID, Bezeichnung, Raum …)" value="${h(S.listSearch)}" autocomplete="off">
      <div class="chips">${chips.map(([k, l]) => `<button class="chip${S.listFilter === k ? ' on' : ''}" data-filter="${k}">${l}</button>`).join('')}
        <button class="chip" data-sort>${S.listSort === 'id' ? 'Sortierung: ID' : 'Sortierung: zuletzt'}</button></div>
    </div>
    <div class="summary" id="summary"></div>
    <div id="items"></div>
    <div class="fabs"><button class="btn ghost" id="unknown">Unbekanntes Teil</button><button class="btn" id="new">+ Neue Anlage</button></div>`;
  renderItems();
  const m = main();
  m.oninput = (e) => {
    if (e.target.id === 'search') { S.listSearch = e.target.value; renderItems(); }
  };
  m.onclick = async (e) => {
    const chip = e.target.closest('.chip');
    if (chip && chip.dataset.filter) {
      S.listFilter = chip.dataset.filter;
      document.querySelectorAll('.chip[data-filter]').forEach((c) => c.classList.toggle('on', c === chip));
      renderItems();
    } else if (chip && chip.dataset.sort !== undefined) {
      S.listSort = S.listSort === 'id' ? 'zuletzt' : 'id';
      chip.textContent = S.listSort === 'id' ? 'Sortierung: ID' : 'Sortierung: zuletzt';
      renderItems();
    } else if (e.target.id === 'new') {
      S.returnTo = '#/liste';
      const r = await newAnlage();
      location.hash = '#/anlage/' + encodeURIComponent(r.uid);
    } else if (e.target.id === 'unknown') {
      S.returnTo = '#/liste';
      const r = await newAnlage({ bezeichnung: 'Unbekanntes Teil', anlagenart: 'unbekannt', pruefpflichtig: 'klären', wartungspflichtig: 'klären' });
      S.focusPhotos = true;
      location.hash = '#/anlage/' + encodeURIComponent(r.uid);
    }
  };
}

// ---------------------------------------------------------------- Formular
function gewerkOptions(v) {
  let out = '<option value="">– wählen –</option>';
  let grp = null;
  for (const g of GEWERKE) {
    const p = g.name.slice(0, 2);
    if (p !== grp) {
      if (grp) out += '</optgroup>';
      grp = p;
      out += `<optgroup label="${h(GEWERK_GRUPPEN[p] || p + '0')}">`;
    }
    out += `<option${g.name === v ? ' selected' : ''}>${h(g.name)}</option>`;
  }
  if (grp) out += '</optgroup>';
  if (v && !GEWERKE.some((g) => g.name === v)) out += `<option selected>${h(v)}</option>`;
  return out;
}

function anlagenartHtml(r) {
  const g = GEWERKE.find((x) => x.name === r.gewerk);
  const arten = g ? g.arten : [];
  const v = r.anlagenart || '';
  const other = !!v && !arten.includes(v);
  return `<select id="f_anlagenart" data-art><option value="">${r.gewerk ? '– wählen –' : '– zuerst Gewerk wählen –'}</option>`
    + arten.map((a) => `<option${a === v ? ' selected' : ''}>${h(a)}</option>`).join('')
    + `<option value="__other"${other ? ' selected' : ''}>Andere (frei eingeben) …</option></select>`
    + `<input type="text" class="sub" id="f_anlagenart_other" data-k="anlagenart" value="${other ? h(v) : ''}" placeholder="Anlagenart eingeben" autocomplete="off"${other ? '' : ' hidden'}>`
    + `<a id="artimg" class="small-link" target="_blank" rel="noopener"${v && v !== 'unbekannt' ? ` href="${h(imgSearchUrl(v))}"` : ' hidden'}>Beispielbilder: ${h(v)}</a>`;
}

function updateArtLink() {
  const r = S.current;
  const a = $('#artimg');
  if (!r || !a) return;
  const v = (r.anlagenart || '').trim();
  a.hidden = !v || v === 'unbekannt';
  if (!a.hidden) { a.href = imgSearchUrl(v); a.textContent = `Beispielbilder: ${v}`; }
}

function webSearchHtml(r) {
  return `<div class="sub"><a id="websearch" class="btn ghost small" target="_blank" rel="noopener" href="${h(webSearchUrl(webQuery(r)))}"${webQuery(r) ? '' : ' hidden'}>Hersteller + Typ im Netz suchen</a>`
    + '<p class="hint">Sucht nach Datenblatt und Anleitung (Internet nötig).</p></div>';
}
function webQuery(r) {
  return [r.hersteller, r.typ].map((x) => (x || '').trim()).filter(Boolean).join(' ');
}
function updateWebSearch() {
  const r = S.current;
  const a = $('#websearch');
  if (!r || !a) return;
  const q = webQuery(r);
  a.hidden = !q;
  if (q) a.href = webSearchUrl(q);
}

function fieldHtml(c, r) {
  const v = r[c.key] ?? '';
  const star = c.pflicht ? ' <b class="star">*</b>' : '';
  const lbl = `<label class="lbl" for="f_${c.key}">${h(c.header)}${star}</label>`;
  const ph = c.example ? ` placeholder="z. B. ${h(c.example)}"` : '';
  let inner = '';
  switch (c.kind) {
    case 'jnk': case 'doku': case 'zustand':
      inner = `<span class="lbl">${h(c.header)}${star}</span><div class="pills" data-pills="${c.key}">`
        + OPTIONS[c.kind].map((o) => `<button type="button" class="pill${v === o ? ' on' : ''}" data-val="${h(o)}">${h(o)}</button>`).join('')
        + '</div>';
      break;
    case 'geschoss': {
      const opts = [...S.geschosse];
      if (v && !opts.includes(v)) opts.push(v);
      inner = lbl + `<select id="f_${c.key}" data-k="${c.key}"><option value="">– wählen –</option>`
        + opts.map((o) => `<option${o === v ? ' selected' : ''}>${h(o)}</option>`).join('') + '</select>';
      break;
    }
    case 'gewerk':
      inner = lbl + `<select id="f_${c.key}" data-k="${c.key}">${gewerkOptions(v)}</select>`;
      break;
    case 'anlagenart':
      inner = lbl + anlagenartHtml(r);
      break;
    case 'id':
      inner = lbl + `<div class="inline"><input type="text" id="f_id" data-k="id" value="${h(v)}" autocapitalize="characters" autocomplete="off" spellcheck="false"${ph}>`
        + '<button type="button" class="btn ghost small" id="idsug">Vorschlag</button></div><div id="idwarn" class="warn"></div>'
        + '<p class="hint">Wird aus Gebäude und Gewerk automatisch vorgeschlagen (Gebäude-KG-Nr.).</p>';
      break;
    case 'date':
      inner = lbl + `<input type="date" id="f_${c.key}" data-k="${c.key}" value="${h(v)}">`;
      break;
    case 'int':
      inner = lbl + `<input type="number" id="f_${c.key}" data-k="${c.key}" value="${h(v)}" min="1" step="1" inputmode="numeric" placeholder="leer = 1 Stück">`;
      break;
    case 'year':
      inner = lbl + `<input type="text" id="f_${c.key}" data-k="${c.key}" value="${h(v)}" inputmode="numeric" maxlength="4" autocomplete="off"${ph}>`;
      break;
    default:
      inner = lbl + (c.key === 'maengel'
        ? `<textarea id="f_${c.key}" data-k="${c.key}"${ph}>${h(v)}</textarea>`
        : `<input type="text" id="f_${c.key}" data-k="${c.key}" value="${h(v)}" autocomplete="off"${ph}>`);
  }
  if (c.key === 'fotoNr') inner += '<p class="hint">Für Fotos aus der App wird der Dateiname beim Export automatisch eingetragen. Hier nur Fotos aus einer anderen Kamera notieren.</p>';
  return `<div class="field${c.pflicht ? ' req' : ''}" data-field="${c.key}">${inner}</div>`;
}

function photoSection() {
  return `<section class="card"><h2>Fotos</h2>
    <div class="photos" id="photos"></div>
    <p id="photobusy" class="busy" hidden>Foto wird verarbeitet …</p>
    <div class="row2">
      <label class="btn">Foto aufnehmen<input type="file" accept="image/*" capture="environment" data-photo class="vh"></label>
      <label class="btn ghost">Aus Galerie<input type="file" accept="image/*" multiple data-photo class="vh"></label>
    </div>
    <p class="hint">1. Foto = Gesamtansicht, 2. Foto = Typenschild, weitere = Details/Mängel. Beim Export heißen die Dateien Anlagen-ID_01.jpg, _02.jpg …</p>
    <p class="hint">Unbekanntes Teil? Auf das Foto tippen → „Was ist das?“ sucht mit Google Lens im Netz.</p>
  </section>`;
}

function updateIdWarn() {
  const r = S.current;
  const w = $('#idwarn');
  if (r && w) w.textContent = dupId(r) ? 'Diese Anlagen-ID ist bereits vergeben.' : '';
}

function updateStatus() {
  const r = S.current;
  const el = $('#status');
  if (!r || !el) return;
  const m = missing(r);
  const d = dupId(r);
  if (!m.length && !d) {
    el.innerHTML = '<div class="status ok">Alle Pflichtfelder ausgefüllt.</div>';
  } else {
    const parts = [];
    if (m.length) parts.push(`Fehlt: ${m.map((c) => h(c.header)).join(', ')}`);
    if (d) parts.push('Anlagen-ID ist doppelt vergeben.');
    el.innerHTML = `<div class="status bad">${parts.join('<br>')}</div>`;
  }
  document.querySelectorAll('[data-field]').forEach((f) => {
    f.classList.toggle('missing', S.showMissing && m.some((c) => c.key === f.dataset.field));
  });
}

function refreshId(r) {
  const before = r.id;
  applyAutoId(r);
  const inp = $('#f_id');
  if (inp && r.id !== before) inp.value = r.id;
  setTitle(r.id || 'Neue Anlage');
  updateIdWarn();
}

async function renderForm(uid) {
  const r = S.anlagen.find((a) => a.uid === uid);
  if (!r) {
    setTitle('Anlage');
    main().innerHTML = '<p class="empty">Anlage nicht gefunden.</p>';
    return;
  }
  S.current = r;
  setTitle(r.id || 'Neue Anlage');
  main().innerHTML = `<div id="status"></div>`
    + SECTIONS.map(([title, keys]) => (title === 'FOTOS'
      ? photoSection()
      : `<section class="card"><h2>${h(title)}</h2>${keys.map((k) => fieldHtml(COL[k], r)).join('')}${title === 'Typenschild' ? webSearchHtml(r) : ''}</section>`)).join('')
    + `<div class="actions">
        <button class="btn block" id="done">Fertig</button>
        <button class="btn ghost block" id="next">Fertig + nächste Anlage im selben Raum</button>
        <button class="btn ghost block" id="dup">Duplizieren (z. B. zweite gleiche Pumpe)</button>
        <button class="btn danger block" id="delete">Anlage löschen</button>
      </div>`;
  updateStatus();
  updateIdWarn();
  renderPhotos();
  if (S.focusPhotos) {
    S.focusPhotos = false;
    const ph = $('#photos');
    if (ph) ph.closest('.card').scrollIntoView({ block: 'start' });
    toast('Foto aufnehmen, dann auf das Foto tippen → „Was ist das?“', 5000);
  }

  const m = main();
  m.oninput = (e) => {
    const el = e.target;
    const k = el.dataset.k;
    if (!k || el.tagName === 'SELECT' || el.type === 'file') return;
    if (k === 'id') r.idAuto = false;
    r[k] = el.value;
    touched(r);
    scheduleSave(r);
    if (k === 'id') { setTitle(el.value || 'Neue Anlage'); updateIdWarn(); }
    if (k === 'gebaeude') refreshId(r);
    if (k === 'hersteller' || k === 'typ') updateWebSearch();
    if (k === 'anlagenart') updateArtLink();
    updateStatus();
  };
  m.onchange = (e) => {
    const el = e.target;
    if (el.type === 'file' && el.dataset.photo !== undefined) {
      const files = [...el.files];
      el.value = '';
      handleFiles(r, files);
      return;
    }
    if (el.dataset.art !== undefined) {
      const other = $('#f_anlagenart_other');
      if (el.value === '__other') {
        other.hidden = false;
        r.anlagenart = other.value;
        other.focus();
      } else {
        other.hidden = true;
        other.value = '';
        r.anlagenart = el.value;
      }
      updateArtLink();
      touched(r);
      scheduleSave(r);
      updateStatus();
      return;
    }
    const k = el.dataset.k;
    if (!k) return;
    if (el.tagName === 'SELECT' || el.type === 'date') {
      r[k] = el.value;
      touched(r);
      if (k === 'gewerk') {
        const g = GEWERKE.find((x) => x.name === r.gewerk);
        if (!g || !g.arten.includes(r.anlagenart)) r.anlagenart = '';
        $('[data-field="anlagenart"]').outerHTML = fieldHtml(COL.anlagenart, r);
        refreshId(r);
      }
      scheduleSave(r);
      updateStatus();
    }
  };
  m.onclick = async (e) => {
    const pill = e.target.closest('.pill');
    if (pill) {
      const box = pill.parentElement;
      const k = box.dataset.pills;
      const val = pill.dataset.val;
      r[k] = r[k] === val ? '' : val;
      box.querySelectorAll('.pill').forEach((p) => p.classList.toggle('on', p.dataset.val === r[k]));
      touched(r);
      scheduleSave(r);
      updateStatus();
      return;
    }
    const photo = e.target.closest('.photo');
    if (photo) return openPhoto(photo.dataset.fid);
    const id = e.target.id;
    if (id === 'idsug') {
      const s = suggestId(r);
      if (!s) return toast('Erst Gebäude und Gewerk auswählen.');
      r.id = s;
      r.idAuto = true;
      $('#f_id').value = s;
      touched(r);
      scheduleSave(r);
      setTitle(s);
      updateIdWarn();
      updateStatus();
    } else if (id === 'done') {
      const miss = missing(r);
      if ((miss.length || dupId(r)) && !S.showMissing) {
        S.showMissing = true;
        updateStatus();
        const first = $('.field.missing');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        toast('Pflichtfelder fehlen – rot markiert. Nochmal „Fertig“ tippen, um trotzdem zu speichern.', 4000);
        return;
      }
      touched(r);
      await flushSave();
      location.hash = S.returnTo || '#/liste';
    } else if (id === 'next') {
      touched(r);
      await flushSave();
      const n = await newAnlage({ liegenschaft: r.liegenschaft || '', gebaeude: r.gebaeude || '', geschoss: r.geschoss || '', raumNr: r.raumNr || '', raumBez: r.raumBez || '' });
      location.hash = '#/anlage/' + encodeURIComponent(n.uid);
    } else if (id === 'dup') {
      touched(r);
      await flushSave();
      const copy = { ...r };
      ['uid', 'id', 'seriennr', 'fotoNr', 'maengel', 'fotoCount', 'created', 'updated', 'idAuto'].forEach((k) => delete copy[k]);
      copy.erfasstAm = today();
      const n = await newAnlage(copy, true);
      markChanged();
      toast('Kopie angelegt – Seriennummer und Fotos ergänzen.');
      location.hash = '#/anlage/' + encodeURIComponent(n.uid);
    } else if (id === 'delete') {
      if (!confirm(`Anlage ${r.id || ''} mit allen Fotos löschen?`)) return;
      clearTimeout(saveTimer);
      pending = null;
      const keys = await db.keysByIndex('fotos', 'uid', r.uid);
      for (const k of keys) await db.del('fotos', k);
      await db.del('anlagen', r.uid);
      S.anlagen = S.anlagen.filter((a) => a.uid !== r.uid);
      S.untouched.delete(r.uid);
      S.current = null;
      markChanged();
      toast('Anlage gelöscht.');
      location.hash = S.returnTo || '#/liste';
    }
  };
}

// ---------------------------------------------------------------- Fotos
let thumbUrls = [];
function revokeThumbs() {
  thumbUrls.forEach((u) => URL.revokeObjectURL(u));
  thumbUrls = [];
}
async function getFotos(uid) {
  return (await db.byIndex('fotos', 'uid', uid)).sort((a, b) => a.idx - b.idx);
}

async function renderPhotos() {
  const r = S.current;
  const box = $('#photos');
  if (!r || !box) return;
  const fotos = await getFotos(r.uid);
  if (S.current !== r) return;
  revokeThumbs();
  box.innerHTML = fotos.map((f, i) => {
    const u = URL.createObjectURL(new Blob([f.thumb], { type: 'image/jpeg' }));
    thumbUrls.push(u);
    const label = i === 0 ? 'Gesamt' : i === 1 ? 'Typenschild' : 'Detail';
    return `<button type="button" class="photo" data-fid="${h(f.fid)}"><img src="${u}" alt="Foto ${i + 1}"><span>_${pad2(i + 1)} ${label}</span></button>`;
  }).join('');
  if ((r.fotoCount || 0) !== fotos.length) {
    r.fotoCount = fotos.length;
    scheduleSave(r);
  }
}

async function loadImage(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch (e1) {
    try {
      return await createImageBitmap(file);
    } catch (e2) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Bild konnte nicht gelesen werden.')); };
        img.src = url;
      });
    }
  }
}

async function toJpeg(src, maxDim, quality) {
  const w = src.width || src.naturalWidth;
  const hgt = src.height || src.naturalHeight;
  const s = Math.min(1, maxDim / Math.max(w, hgt));
  const cw = Math.max(1, Math.round(w * s));
  const ch = Math.max(1, Math.round(hgt * s));
  const c = document.createElement('canvas');
  c.width = cw;
  c.height = ch;
  c.getContext('2d').drawImage(src, 0, 0, cw, ch);
  const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/jpeg', quality));
  if (!blob) throw new Error('Bild konnte nicht umgewandelt werden.');
  return { buf: await blob.arrayBuffer(), w: cw, h: ch };
}

async function handleFiles(r, files) {
  if (!files.length) return;
  const busy = $('#photobusy');
  if (busy) busy.hidden = false;
  try {
    const existing = await getFotos(r.uid);
    let idx = existing.length ? Math.max(...existing.map((f) => f.idx)) + 1 : 0;
    for (const file of files) {
      const src = await loadImage(file);
      const big = await toJpeg(src, +S.settings.fotoMax || 1920, 0.82);
      const th = await toJpeg(src, 320, 0.7);
      if (src.close) src.close();
      await db.put('fotos', { fid: uuid(), uid: r.uid, idx: idx++, data: big.buf, thumb: th.buf, w: big.w, h: big.h, created: Date.now() });
    }
    r.fotoCount = existing.length + files.length;
    touched(r);
    scheduleSave(r);
    markChanged();
  } catch (e) {
    alert('Foto konnte nicht gespeichert werden: ' + e.message);
  } finally {
    if (busy) busy.hidden = true;
    renderPhotos();
  }
}

async function openPhoto(fid) {
  const r = S.current;
  if (!r) return;
  const fotos = await getFotos(r.uid);
  const i = fotos.findIndex((f) => f.fid === fid);
  const f = fotos[i];
  if (!f) return;
  const u = URL.createObjectURL(new Blob([f.data], { type: 'image/jpeg' }));
  modalUrls.push(u);
  const fileName = `${baseName(r)}_${pad2(i + 1)}.jpg`;
  const photoFile = new File([f.data], fileName, { type: 'image/jpeg' });
  let canShare = false;
  try { canShare = !!(navigator.canShare && navigator.canShare({ files: [photoFile] })); } catch (e) { canShare = false; }
  const m = openModal(`<h3>${h(fileName)}</h3><img src="${u}" alt="">
    <p class="hint">${f.w} × ${f.h} px · ${fmtBytes(f.data.byteLength)}</p>
    <button class="btn block sub" data-act="lens">Was ist das? Foto im Netz suchen</button>
    <p class="hint">${canShare
      ? 'Im Teilen-Menü „Google“ bzw. „Google Lens“ wählen (Internet nötig). Erscheint es nicht: Foto sichern und in der Google-App auf das Kamera-Symbol tippen.'
      : 'Das Foto wird gespeichert. Danach in der Google-App auf das Kamera-Symbol (Lens) tippen und das Foto auswählen.'}
      Alternativ das Foto in Claude hochladen und fragen, was es ist.</p>
    <div class="actions">
      ${i > 0 ? '<button class="btn ghost" data-act="left">Eine Position nach vorne</button>' : ''}
      <button class="btn danger" data-act="del">Foto löschen</button>
      <button class="btn" data-act="close">Schließen</button>
    </div>`);
  m.onclick = async (e) => {
    const act = e.target.dataset && e.target.dataset.act;
    if (!act) return;
    if (act === 'lens') {
      if (canShare) {
        try {
          await navigator.share({ files: [photoFile], title: 'Was ist das?' });
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }
      downloadFile(photoFile);
      toast('Foto gespeichert. Jetzt in der Google-App auf das Kamera-Symbol tippen und das Foto auswählen.', 6000);
      return;
    }
    if (act === 'close') return closeModal();
    if (act === 'del') {
      if (!confirm('Foto löschen?')) return;
      await db.del('fotos', fid);
      fotos.splice(i, 1);
    }
    if (act === 'left') [fotos[i - 1], fotos[i]] = [fotos[i], fotos[i - 1]];
    fotos.forEach((x, j) => { x.idx = j; });
    await db.putMany('fotos', fotos);
    r.fotoCount = fotos.length;
    touched(r);
    scheduleSave(r);
    markChanged();
    closeModal();
    renderPhotos();
  };
}

// ---------------------------------------------------------------- Checkliste
function ckItemHtml(b, it, bi, ii) {
  const st = S.check[ckKey(b.bereich, it)] || {};
  return `<div class="ck" data-ck="${bi}:${ii}">
    <div class="ck-t">${h(it.anlage)}</div>
    <div class="ck-m">KG ${h(it.kg)} · ${h(it.erfassung)}</div>
    <details class="help"><summary>So erkennst du es</summary>
      <p><b>Aussehen:</b> ${h(it.erkennen)}</p>
      <p><b>Wo suchen:</b> ${h(it.wo)}</p>
      ${it.hinweis ? `<p><b>Prüfung/Wartung (typisch):</b> ${h(it.hinweis)}</p>` : ''}
      <a class="btn ghost small" target="_blank" rel="noopener" href="${h(imgSearchUrl(it.suche))}">Beispielbilder ansehen</a>
    </details>
    <div class="ck-row"><span class="lbl">Vorhanden:</span><div class="pills" data-ckf="vorhanden">${JNK.map((o) => `<button type="button" class="pill${st.vorhanden === o ? ' on' : ''}" data-val="${h(o)}">${h(o)}</button>`).join('')}</div></div>
    <div class="ck-row"><button type="button" class="toggle${st.erfasst === 'ja' ? ' on' : ''}" data-ckf="erfasst">${st.erfasst === 'ja' ? 'Erfasst ✓' : 'Erfasst'}</button>
      <button type="button" class="btn ghost small" data-cknew>+ Anlage erfassen</button></div>
    <div class="ck-note"><input type="text" data-ckf="bemerkung" value="${h(st.bemerkung || '')}" placeholder="Bemerkung" autocomplete="off"></div>
  </div>`;
}

function checkCounts() {
  let total = 0;
  let done = 0;
  CHECKLISTE.forEach((b, bi) => {
    const n = b.items.filter((it) => S.check[ckKey(b.bereich, it)]?.vorhanden).length;
    total += b.items.length;
    done += n;
    const cnt = document.querySelector(`details[data-group="${bi}"] .cnt`);
    if (cnt) cnt.textContent = `${n}/${b.items.length}`;
  });
  const bar = $('#ckbar');
  if (bar) bar.style.width = `${total ? Math.round((done / total) * 100) : 0}%`;
  const t = $('#cktotal');
  if (t) t.textContent = `${done} / ${total}`;
}

let ckSaveTimer;
function saveCheck() {
  clearTimeout(ckSaveTimer);
  ckSaveTimer = setTimeout(() => { db.setMeta('check', S.check); markChanged(); }, 300);
}

function renderCheck() {
  setTitle('Begehungscheckliste');
  main().innerHTML = `<div class="card"><div class="kv"><span>Geprüfte Punkte</span><b id="cktotal"></b></div>
      <div class="progress"><div id="ckbar"></div></div>
      <p class="hint">Bereich aufklappen und dem Rundgang-Tipp folgen. „So erkennst du es“ zeigt Aussehen, Ort und Beispielbilder. „+ Anlage erfassen“ öffnet das Formular mit vorgewähltem Gewerk.</p></div>`
    + CHECKLISTE.map((b, bi) => `<details class="group" data-group="${bi}"${S.openGroup === bi ? ' open' : ''}>
        <summary>${h(b.bereich)}<span class="cnt"></span></summary>
        <div class="tipp"><b>Rundgang:</b> ${h(b.rundgang)}</div>
        ${b.items.map((it, ii) => ckItemHtml(b, it, bi, ii)).join('')}</details>`).join('');
  checkCounts();
  document.querySelectorAll('details.group').forEach((d) => {
    d.ontoggle = () => {
      const g = +d.dataset.group;
      if (d.open) S.openGroup = g;
      else if (S.openGroup === g) S.openGroup = null;
    };
  });
  const locate = (el) => {
    const ck = el.closest('.ck');
    if (!ck) return null;
    const [bi, ii] = ck.dataset.ck.split(':').map(Number);
    const b = CHECKLISTE[bi];
    const it = b.items[ii];
    const key = ckKey(b.bereich, it);
    S.check[key] = S.check[key] || {};
    return { ck, b, it, st: S.check[key] };
  };
  const m = main();
  m.onclick = async (e) => {
    const loc = locate(e.target);
    if (!loc) return;
    const pill = e.target.closest('.pill');
    if (pill) {
      loc.st.vorhanden = loc.st.vorhanden === pill.dataset.val ? '' : pill.dataset.val;
      pill.parentElement.querySelectorAll('.pill').forEach((p) => p.classList.toggle('on', p.dataset.val === loc.st.vorhanden));
      saveCheck();
      checkCounts();
      return;
    }
    const tog = e.target.closest('.toggle');
    if (tog) {
      loc.st.erfasst = loc.st.erfasst === 'ja' ? '' : 'ja';
      tog.classList.toggle('on', loc.st.erfasst === 'ja');
      tog.textContent = loc.st.erfasst === 'ja' ? 'Erfasst ✓' : 'Erfasst';
      saveCheck();
      return;
    }
    if (e.target.closest('[data-cknew]')) {
      if (!loc.st.vorhanden) {
        loc.st.vorhanden = 'ja';
        saveCheck();
      }
      const preset = {};
      const kg = (loc.it.kg || '').trim();
      if (/^\d{3}$/.test(kg)) {
        const g = GEWERKE.find((x) => x.name.startsWith(kg + ' '));
        if (g) preset.gewerk = g.name;
      }
      S.returnTo = '#/check';
      const r = await newAnlage(preset);
      location.hash = '#/anlage/' + encodeURIComponent(r.uid);
    }
  };
  m.oninput = (e) => {
    if (e.target.dataset.ckf !== 'bemerkung') return;
    const loc = locate(e.target);
    if (!loc) return;
    loc.st.bemerkung = e.target.value;
    saveCheck();
  };
}

// ---------------------------------------------------------------- Unterlagen
let ulSaveTimer;
function saveUnterl() {
  clearTimeout(ulSaveTimer);
  ulSaveTimer = setTimeout(() => { db.setMeta('unterlagen', S.unterl); markChanged(); }, 300);
}

function renderUnterlagen() {
  setTitle('Unterlagen');
  const kats = [...new Set(UNTERLAGEN.map((u) => u.kat))];
  const count = () => UNTERLAGEN.filter((u) => S.unterl[u.unterlage]?.liegtVor === 'ja').length;
  main().innerHTML = `<div class="card"><div class="kv"><span>Liegt vor</span><b id="ultotal"></b></div>
      <div class="progress"><div id="ulbar"></div></div>
      <p class="hint">Vor der Begehung sammeln. „teilweise“ = z. B. nur einzelne Prüfberichte.</p></div>`
    + kats.map((k) => `<details class="group" open><summary>${h(k)}</summary>`
      + UNTERLAGEN.map((u, i) => ({ u, i })).filter(({ u }) => u.kat === k).map(({ u, i }) => {
        const st = S.unterl[u.unterlage] || {};
        return `<div class="ck" data-ul="${i}"><div class="ck-t">${h(u.unterlage)}</div>
          <div class="ck-h">Wofür: ${h(u.wofuer)}</div><div class="ck-m">Quelle: ${h(u.quelle)}</div>
          <div class="ck-row"><div class="pills">${LIEGT_VOR.map((o) => `<button type="button" class="pill${st.liegtVor === o ? ' on' : ''}" data-val="${h(o)}">${h(o)}</button>`).join('')}</div></div>
          <div class="ck-note"><input type="text" data-ulnote value="${h(st.bemerkung || '')}" placeholder="Bemerkung" autocomplete="off"></div></div>`;
      }).join('') + '</details>').join('');
  const upd = () => {
    const n = count();
    $('#ultotal').textContent = `${n} / ${UNTERLAGEN.length}`;
    $('#ulbar').style.width = `${Math.round((n / UNTERLAGEN.length) * 100)}%`;
  };
  upd();
  const loc = (el) => {
    const box = el.closest('[data-ul]');
    if (!box) return null;
    const u = UNTERLAGEN[+box.dataset.ul];
    S.unterl[u.unterlage] = S.unterl[u.unterlage] || {};
    return S.unterl[u.unterlage];
  };
  const m = main();
  m.onclick = (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    const st = loc(pill);
    st.liegtVor = st.liegtVor === pill.dataset.val ? '' : pill.dataset.val;
    pill.parentElement.querySelectorAll('.pill').forEach((p) => p.classList.toggle('on', p.dataset.val === st.liegtVor));
    saveUnterl();
    upd();
  };
  m.oninput = (e) => {
    if (e.target.dataset.ulnote === undefined) return;
    loc(e.target).bemerkung = e.target.value;
    saveUnterl();
  };
}

// ---------------------------------------------------------------- Export / Import
function cellValue(c, r) {
  if (c.key === 'fotoNr' && r.fotoCount > 0) return fotoNames(r).join(', ');
  let v = r[c.key];
  if (v === undefined || v === null) return null;
  v = String(v).trim();
  if (!v) return null;
  if (c.kind === 'date') return /^\d{4}-\d{2}-\d{2}$/.test(v) ? { date: v } : v;
  if (c.kind === 'int' || c.kind === 'year') return /^\d+$/.test(v) ? Number(v) : v;
  return v;
}

const sortedAnlagen = () => [...S.anlagen].sort(byId);

function offerFiles(files, note, onDone) {
  const canShare = (file) => {
    try { return !!(navigator.canShare && navigator.canShare({ files: [file] })); } catch (e) { return false; }
  };
  const items = files.map((f) => {
    const file = new File([f.blob], f.name, { type: f.blob.type || 'application/octet-stream' });
    return { file, share: canShare(file) };
  });
  const m = openModal(`<h3>${files.length > 1 ? `${files.length} Dateien bereit` : 'Datei bereit'}</h3>
    ${note ? `<p class="hint">${note}</p>` : ''}
    <div class="filelist">${items.map((it, i) => `<div class="fileitem"><b>${h(it.file.name)}</b><div class="hint">${fmtBytes(it.file.size)}</div>
      <div class="row2 sub">${it.share ? `<button class="btn" data-share="${i}">Teilen</button>` : ''}
      <button class="btn${it.share ? ' ghost' : ''}" data-dl="${i}"${it.share ? '' : ' style="grid-column:1/-1"'}>Herunterladen</button></div></div>`).join('')}</div>
    <button class="btn ghost block" data-close>Schließen</button>`);
  m.onclick = async (e) => {
    const t = e.target;
    if (t.dataset.close !== undefined) return closeModal();
    if (t.dataset.share !== undefined) {
      const it = items[+t.dataset.share];
      try {
        await navigator.share({ files: [it.file], title: it.file.name });
        if (onDone) onDone();
      } catch (err) {
        if (err.name !== 'AbortError') toast('Teilen nicht möglich – bitte „Herunterladen“ verwenden.');
      }
    }
    if (t.dataset.dl !== undefined) {
      downloadFile(items[+t.dataset.dl].file);
      if (onDone) onDone();
    }
  };
}

function incompleteNote() {
  const n = S.anlagen.filter((r) => missing(r).length || dupId(r)).length;
  return n ? `Achtung: ${n} Anlage${n > 1 ? 'n sind' : ' ist'} unvollständig (Pflichtfelder fehlen oder ID doppelt). Vor dem CAFM-Import ergänzen.` : '';
}

async function exportXlsx() {
  if (!S.anlagen.length) return toast('Noch keine Anlagen erfasst.');
  busyModal('Excel-Datei wird erstellt …');
  try {
    const cols = (arr) => arr.map(([header, width]) => ({ header, width }));
    const blob = await buildXlsx([
      {
        name: 'Anlagen',
        columns: COLUMNS.map((c) => ({ header: c.header, width: c.width, headStyle: c.pflicht ? STYLE.HEAD_PFLICHT : STYLE.HEAD_OPTIONAL })),
        rows: sortedAnlagen().map((r) => COLUMNS.map((c) => cellValue(c, r))),
      },
      {
        name: 'Begehungscheckliste',
        bodyStyle: STYLE.WRAP,
        columns: cols([['Bereich', 26], ['Nr.', 5], ['Anlage / Bauteil', 46], ['KG', 11], ['Erfassung', 24], ['Typische Prüf-/Wartungsgrundlage (Hinweis)', 60], ['Vorhanden', 11], ['Erfasst', 9], ['Bemerkung', 30]]),
        rows: CHECKLISTE.flatMap((b) => b.items.map((it, i) => {
          const st = S.check[ckKey(b.bereich, it)] || {};
          return [b.bereich, i + 1, it.anlage, it.kg, it.erfassung, it.hinweis || null, st.vorhanden || null, st.erfasst || null, st.bemerkung || null];
        })),
      },
      {
        name: 'Unterlagen',
        bodyStyle: STYLE.WRAP,
        columns: cols([['Nr.', 5], ['Kategorie', 22], ['Unterlage', 52], ['Wofür', 48], ['Typische Quelle', 26], ['Liegt vor', 11], ['Bemerkung', 30]]),
        rows: UNTERLAGEN.map((u, i) => {
          const st = S.unterl[u.unterlage] || {};
          return [i + 1, u.kat, u.unterlage, u.wofuer, u.quelle, st.liegtVor || null, st.bemerkung || null];
        }),
      },
    ]);
    endBusy();
    offerFiles([{ blob, name: `TGA-Anlagen_${fileTag()}.xlsx` }], incompleteNote());
  } catch (e) {
    endBusy();
    alert('Export fehlgeschlagen: ' + e.message);
  }
}

function exportCsv() {
  if (!S.anlagen.length) return toast('Noch keine Anlagen erfasst.');
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [COLUMNS.map((c) => esc(c.header)).join(';')];
  for (const r of sortedAnlagen()) {
    lines.push(COLUMNS.map((c) => {
      const v = cellValue(c, r);
      return esc(v && typeof v === 'object' ? isoToDe(v.date) : v);
    }).join(';'));
  }
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  offerFiles([{ blob, name: `TGA-Anlagen_${fileTag()}.csv` }], incompleteNote());
}

async function exportFotos() {
  const total = S.anlagen.reduce((s, r) => s + (r.fotoCount || 0), 0);
  if (!total) return toast('Keine Fotos vorhanden.');
  busyModal('Fotos werden gepackt …');
  try {
    const out = [];
    let files = [];
    let size = 0;
    let done = 0;
    const flush = async () => {
      if (!files.length) return;
      out.push(await makeZip(files));
      files = [];
      size = 0;
    };
    for (const r of sortedAnlagen()) {
      const fotos = await getFotos(r.uid);
      fotos.forEach((f, i) => {
        files.push({ name: `Fotos_${safeName(r.gebaeude || 'ohne_Gebaeude')}/${baseName(r)}_${pad2(i + 1)}.jpg`, data: f.data });
        size += f.data.byteLength;
        done++;
      });
      setProgress(`${done} von ${total} Fotos …`);
      if (size >= CHUNK) await flush();
    }
    await flush();
    endBusy();
    offerFiles(out.map((blob, i) => ({ blob, name: `TGA-Fotos_${fileTag()}${out.length > 1 ? `_Teil${i + 1}von${out.length}` : ''}.zip` })),
      out.length > 1 ? 'Wegen der Größe in mehrere Teile aufgeteilt.' : '');
  } catch (e) {
    endBusy();
    alert('Foto-Export fehlgeschlagen: ' + e.message);
  }
}

async function exportBackup() {
  busyModal('Datensicherung wird erstellt …');
  try {
    const meta = {
      app: 'tga-anlagenerfassung', format: 1, version: APP_VERSION, created: new Date().toISOString(),
      settings: S.settings, geschosse: S.geschosse, check: S.check, unterlagen: S.unterl, anlagen: S.anlagen, fotos: [],
    };
    const blobs = [];
    let files = [];
    let size = 0;
    for (const r of S.anlagen) {
      const fotos = await getFotos(r.uid);
      for (const f of fotos) {
        meta.fotos.push({ fid: f.fid, uid: f.uid, idx: f.idx, w: f.w, h: f.h, created: f.created });
        files.push({ name: `fotos/${f.fid}.jpg`, data: f.data }, { name: `thumbs/${f.fid}.jpg`, data: f.thumb });
        size += f.data.byteLength + f.thumb.byteLength;
      }
      setProgress(`${meta.fotos.length} Fotos gesichert …`);
      if (size >= CHUNK) {
        blobs.push(await makeZip(files));
        files = [];
        size = 0;
      }
    }
    files.unshift({ name: 'data.json', data: JSON.stringify(meta) });
    blobs.push(await makeZip(files));
    endBusy();
    const stamp = new Date();
    const tag = `${today()}_${pad2(stamp.getHours())}${pad2(stamp.getMinutes())}`;
    offerFiles(
      blobs.map((blob, i) => ({ blob, name: `TGA-Sicherung_${tag}${blobs.length > 1 ? `_Teil${i + 1}von${blobs.length}` : ''}.zip` })),
      `Enthält alle Anlagen, Fotos, Checkliste und Einstellungen.${blobs.length > 1 ? ' Beim Wiederherstellen alle Teile gemeinsam auswählen.' : ''}`,
      () => { S.lastBackup = Date.now(); db.setMeta('lastBackup', S.lastBackup); }
    );
  } catch (e) {
    endBusy();
    alert('Datensicherung fehlgeschlagen: ' + e.message);
  }
}

async function loadState() {
  S.anlagen = await db.getAll('anlagen');
  S.settings = { ...S.settings, ...(await db.getMeta('settings', {})) };
  S.geschosse = await db.getMeta('geschosse', [...GESCHOSSE]);
  S.check = await db.getMeta('check', {});
  S.unterl = await db.getMeta('unterlagen', {});
  S.lastBackup = await db.getMeta('lastBackup', null);
  S.lastChange = await db.getMeta('lastChange', null);
}

async function importBackup(fileList) {
  const files = [...fileList];
  if (!files.length) return;
  if (!confirm('Datensicherung wiederherstellen?\nAlle aktuellen Daten auf diesem Gerät werden dabei ersetzt.')) return;
  busyModal('Datensicherung wird gelesen …');
  try {
    const zips = [];
    let meta = null;
    for (const f of files) {
      const z = await readZip(f);
      zips.push(z);
      if (z.names.includes('data.json')) meta = JSON.parse(await z.text('data.json'));
    }
    if (!meta || meta.app !== 'tga-anlagenerfassung') {
      throw new Error('Keine Datensicherung dieser App gefunden. Bei mehreren Teilen bitte alle Teile auswählen.');
    }
    const fotoMeta = new Map((meta.fotos || []).map((f) => [f.fid, f]));
    const found = new Set();
    zips.forEach((z) => z.names.forEach((n) => { const mm = /^fotos\/(.+)\.jpg$/.exec(n); if (mm) found.add(mm[1]); }));
    const lost = [...fotoMeta.keys()].filter((k) => !found.has(k)).length;
    if (lost && !confirm(`${lost} Fotos fehlen in den gewählten Dateien (Teil vergessen?). Trotzdem fortfahren?`)) {
      endBusy();
      return;
    }
    await db.clear('anlagen');
    await db.clear('fotos');
    const counts = {};
    let n = 0;
    for (const z of zips) {
      for (const name of z.names) {
        const mm = /^fotos\/(.+)\.jpg$/.exec(name);
        if (!mm || !fotoMeta.has(mm[1])) continue;
        const fm = fotoMeta.get(mm[1]);
        const data = (await z.bytes(name)).buffer;
        const t = await z.bytes(`thumbs/${fm.fid}.jpg`);
        await db.put('fotos', { ...fm, data, thumb: t ? t.buffer : data });
        counts[fm.uid] = (counts[fm.uid] || 0) + 1;
        setProgress(`${++n} Fotos wiederhergestellt …`);
      }
    }
    const anlagen = (meta.anlagen || []).map((a) => ({ ...a, fotoCount: counts[a.uid] || 0 }));
    await db.putMany('anlagen', anlagen);
    await db.setMeta('settings', meta.settings || {});
    await db.setMeta('geschosse', meta.geschosse || [...GESCHOSSE]);
    await db.setMeta('check', meta.check || {});
    await db.setMeta('unterlagen', meta.unterlagen || {});
    await db.setMeta('lastBackup', Date.now());
    await db.setMeta('lastChange', Date.now());
    await loadState();
    endBusy();
    alert(`Wiederhergestellt: ${anlagen.length} Anlagen, ${n} Fotos.`);
    location.hash = '#/liste';
  } catch (e) {
    endBusy();
    alert('Wiederherstellen fehlgeschlagen: ' + e.message);
  }
}

function convertIn(c, v) {
  if (c.kind === 'date') {
    if (typeof v === 'number') return serialToIso(v);
    const s = String(v).trim();
    const mm = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);
    if (mm) return `${mm[3]}-${pad2(mm[2])}-${pad2(mm[1])}`;
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    return s;
  }
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v).replace('.', ',');
  if (typeof v === 'boolean') return v ? 'ja' : 'nein';
  return String(v).trim();
}

async function importXlsx(file) {
  if (!file) return;
  busyModal('Excel-Datei wird gelesen …');
  try {
    const { rows } = await readXlsxSheet(file, 'Anlagen');
    const head = (rows[0] || []).map((x) => String(x ?? '').replace(/\*/g, '').trim().toLowerCase());
    const map = COLUMNS.map((c) => head.indexOf(c.header.toLowerCase()));
    if (map.filter((i) => i >= 0).length < 3) {
      throw new Error('Spalten nicht erkannt. Erwartet wird das Blatt „Anlagen“ der Erfassungsvorlage.');
    }
    const byKey = new Map(S.anlagen.filter((a) => a.id).map((a) => [a.id.trim().toLowerCase(), a]));
    const changed = [];
    let neu = 0;
    let akt = 0;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      const rec = {};
      COLUMNS.forEach((c, ci) => {
        const idx = map[ci];
        if (idx < 0) return;
        const v = row[idx];
        if (v === null || v === undefined || v === '') return;
        const cv = convertIn(c, v);
        if (cv !== '') rec[c.key] = cv;
      });
      if (!Object.keys(rec).length) continue;
      const key = (rec.id || '').trim().toLowerCase();
      const ex = key ? byKey.get(key) : null;
      if (ex) {
        Object.assign(ex, rec, { idAuto: false, updated: Date.now() });
        if (!changed.includes(ex)) changed.push(ex);
        akt++;
      } else {
        const r = { uid: uuid(), created: Date.now(), updated: Date.now(), fotoCount: 0, idAuto: false, ...rec };
        S.anlagen.push(r);
        if (key) byKey.set(key, r);
        changed.push(r);
        neu++;
      }
    }
    await db.putMany('anlagen', changed);
    markChanged();
    endBusy();
    alert(`Import abgeschlossen: ${neu} neu, ${akt} aktualisiert.`);
    renderExport();
  } catch (e) {
    endBusy();
    alert('Import fehlgeschlagen: ' + e.message);
  }
}

async function wipeAll() {
  if (!confirm('Wirklich ALLE Anlagen, Fotos und Einstellungen auf diesem Gerät löschen?')) return;
  if (!confirm('Letzte Rückfrage: Das kann nicht rückgängig gemacht werden. Löschen?')) return;
  await db.clear('anlagen');
  await db.clear('fotos');
  await db.clear('meta');
  S.anlagen = [];
  S.settings = { liegenschaft: '', gebaeude: '', erfasser: '', fotoMax: 1920, ortUebernehmen: true };
  S.geschosse = [...GESCHOSSE];
  S.check = {};
  S.unterl = {};
  S.lastBackup = null;
  S.lastChange = null;
  toast('Alle Daten gelöscht.');
  location.hash = '#/liste';
}

async function renderExport() {
  setTitle('Export & Einstellungen');
  const all = S.anlagen;
  const nOff = all.filter((r) => missing(r).length || dupId(r)).length;
  const fotos = all.reduce((s, r) => s + (r.fotoCount || 0), 0);
  let est = '';
  let persisted = null;
  try {
    const e = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null;
    if (e && e.quota) est = `${fmtBytes(e.usage || 0)} von ca. ${fmtBytes(e.quota)}`;
    persisted = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : null;
  } catch (e) { /* nicht unterstützt */ }
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  main().innerHTML = `
  <section class="card"><h2>Stand</h2><div class="kv">
    <span>Anlagen</span><b>${all.length}</b>
    <span>davon unvollständig</span><b>${nOff}</b>
    <span>Fotos</span><b>${fotos}</b>
    <span>Letzte Datensicherung</span><b>${S.lastBackup ? fmtDateTime(S.lastBackup) : 'noch nie'}</b>
    ${est ? `<span>Speicher belegt</span><b>${est}</b>` : ''}
    <span>Speicher geschützt</span><b>${persisted === null ? 'unbekannt' : persisted ? 'ja' : 'nein'}</b>
  </div>
  ${standalone ? '' : '<p class="hint">Tipp: Die App über das Browser-Menü „Zum Startbildschirm hinzufügen“ installieren. Dann startet sie wie eine normale App und die Daten sind besser geschützt.</p>'}
  ${installEvt ? '<button class="btn block sub" id="install">App installieren</button>' : ''}
  </section>

  <section class="card"><h2>Export</h2><div class="stack">
    <button class="btn block" id="x-xlsx">Excel-Datei (.xlsx) für CAFM</button>
    <button class="btn ghost block" id="x-fotos">Fotos (.zip, Dateinamen nach Anlagen-ID)</button>
    <button class="btn ghost block" id="x-csv">CSV-Datei (Semikolon)</button>
  </div>
  <p class="hint">Die Excel-Datei enthält das importfähige Blatt „Anlagen“ mit denselben Spalten wie die Erfassungsvorlage, dazu Checkliste und Unterlagen.</p></section>

  <section class="card"><h2>Datensicherung</h2><div class="stack">
    <button class="btn block" id="x-backup">Datensicherung erstellen (.zip)</button>
    <label class="btn ghost block">Datensicherung wiederherstellen<input type="file" id="i-backup" accept=".zip,application/zip" multiple class="vh"></label>
  </div>
  <p class="hint">Die Daten liegen nur auf diesem Gerät. Nach jedem Begehungstag sichern und die Datei z. B. in OneDrive oder per Mail ablegen. Mit der Sicherung lässt sich auch auf ein anderes Gerät umziehen.</p></section>

  <section class="card"><h2>Import</h2>
    <label class="btn ghost block">Excel-Vorlage importieren (.xlsx)<input type="file" id="i-xlsx" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="vh"></label>
    <p class="hint">Liest das Blatt „Anlagen“ der Erfassungsvorlage, z. B. am PC vorab eingetragene Anlagen aus Prüfberichten. Gleiche Anlagen-ID = Datensatz wird aktualisiert, sonst neu angelegt. Fotos bleiben erhalten.</p></section>

  <section class="card"><h2>Einstellungen</h2>
    <div class="setting"><label class="lbl" for="s-lieg">Liegenschaft (Vorgabe für neue Anlagen)</label><input type="text" id="s-lieg" data-s="liegenschaft" value="${h(S.settings.liegenschaft)}" placeholder="z. B. L01" autocomplete="off"></div>
    <div class="setting"><label class="lbl" for="s-geb">Gebäude (Vorgabe für neue Anlagen)</label><input type="text" id="s-geb" data-s="gebaeude" value="${h(S.settings.gebaeude)}" placeholder="z. B. B01" autocomplete="off"></div>
    <div class="setting"><label class="lbl" for="s-erf">Erfasst von (Kürzel)</label><input type="text" id="s-erf" data-s="erfasser" value="${h(S.settings.erfasser)}" placeholder="z. B. MK" autocomplete="off"></div>
    <div class="setting"><label class="check-line"><input type="checkbox" id="s-ort"${S.settings.ortUebernehmen ? ' checked' : ''}> Geschoss und Raum von der zuletzt bearbeiteten Anlage übernehmen</label></div>
    <div class="setting"><label class="lbl" for="s-foto">Fotoauflösung (längste Seite)</label><select id="s-foto">${[1600, 1920, 2560].map((v) => `<option value="${v}"${+S.settings.fotoMax === v ? ' selected' : ''}>${v} px${v === 1920 ? ' (empfohlen)' : ''}</option>`).join('')}</select></div>
    <div class="setting"><label class="lbl" for="s-gesch">Geschosse (eins pro Zeile)</label><textarea id="s-gesch" rows="6">${h(S.geschosse.join('\n'))}</textarea></div>
  </section>

  <section class="card"><h2>Alle Daten löschen</h2>
    <button class="btn danger block" id="wipe">Alle Anlagen, Fotos und Einstellungen löschen</button>
    <p class="hint">Vorher eine Datensicherung erstellen.</p></section>
  <p class="hint" style="text-align:center">TGA Anlagenerfassung · Version ${APP_VERSION} · Alle Daten bleiben auf diesem Gerät</p>`;

  const saveSettings = () => db.setMeta('settings', S.settings);
  const m = main();
  m.oninput = (e) => {
    const k = e.target.dataset.s;
    if (k) { S.settings[k] = e.target.value.trim(); saveSettings(); }
  };
  m.onchange = (e) => {
    const t = e.target;
    if (t.id === 's-ort') { S.settings.ortUebernehmen = t.checked; saveSettings(); }
    if (t.id === 's-foto') { S.settings.fotoMax = +t.value; saveSettings(); }
    if (t.id === 's-gesch') {
      const list = [...new Set(t.value.split('\n').map((s) => s.trim()).filter(Boolean))];
      S.geschosse = list.length ? list : [...GESCHOSSE];
      db.setMeta('geschosse', S.geschosse);
      toast('Geschosse gespeichert.');
    }
    if (t.id === 'i-backup') { const f = t.files; importBackup(f).finally(() => { t.value = ''; }); }
    if (t.id === 'i-xlsx') { const f = t.files[0]; importXlsx(f).finally(() => { t.value = ''; }); }
  };
  m.onclick = async (e) => {
    const id = e.target.id;
    if (id === 'x-xlsx') exportXlsx();
    else if (id === 'x-csv') exportCsv();
    else if (id === 'x-fotos') exportFotos();
    else if (id === 'x-backup') exportBackup();
    else if (id === 'wipe') wipeAll();
    else if (id === 'install' && installEvt) {
      installEvt.prompt();
      installEvt = null;
      e.target.remove();
    }
  };
}

// ---------------------------------------------------------------- Start
async function init() {
  $('#back').addEventListener('click', () => { location.hash = S.returnTo || '#/liste'; });
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal' && !S.busy) closeModal(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSave(); });
  window.addEventListener('pagehide', () => { flushSave(); });
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; });
  try {
    await loadState();
  } catch (e) {
    main().innerHTML = `<p class="empty">Der Speicher des Browsers ist nicht verfügbar (${h(e.message)}).<br>Bitte nicht im privaten Modus öffnen.</p>`;
    return;
  }
  window.addEventListener('hashchange', route);
  route();
  if ('serviceWorker' in navigator) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController) toast('Neue App-Version geladen. Bitte die App einmal schließen und neu öffnen.', 8000);
    });
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(() => {});
  }
  try {
    if (navigator.storage && navigator.storage.persist && !(await navigator.storage.persisted())) await navigator.storage.persist();
  } catch (e) { /* nicht unterstützt */ }
}

init();

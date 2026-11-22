import { COLUMNS, GESCHOSSE, ZUSTAND, JNK, DOKU, LIEGT_VOR, GEWERKE, CHECKLISTE, UNTERLAGEN, GEWERK_GRUPPEN } from './data.js';
import * as db from './db.js';
import { makeZip, readZip } from './zip.js';
import { buildXlsx, readXlsxSheet, STYLE, serialToIso } from './xlsx.js';

const APP_VERSION = '1.4.0';

// ---------------------------------------------------------------- Begehung / Mängel: Kataloge
const M_KAT = ['Brandschutz', 'Flucht- und Rettungswege', 'Verkehrssicherung / Arbeitsschutz', 'Elektro', 'Technik / TGA', 'Gebäude / Außenanlagen', 'Ordnung / Sauberkeit', 'Sonstiges'];
const M_PRIO = ['sofort', 'kurzfristig', 'mittelfristig', 'Hinweis'];
const M_PRIO_TEXT = 'sofort = Gefahr, sofort handeln · kurzfristig = in wenigen Tagen · mittelfristig = in einigen Wochen · Hinweis = beobachten';
const M_STATUS = ['offen', 'in Arbeit', 'erledigt'];
// [Titel, Kategorie, Priorität, Maßnahme]
const M_VORLAGEN = [
  ['Brandschutztür verkeilt / offen festgestellt', 'Brandschutz', 'sofort', 'Keil entfernen, Tür muss selbstständig schließen. Nutzer informieren; wird die Tür offen gebraucht, Feststellanlage prüfen lassen.'],
  ['Brandschutztür schließt nicht selbstständig', 'Brandschutz', 'kurzfristig', 'Türschließer bzw. Schließfolgeregler durch Fachfirma instand setzen lassen.'],
  ['Brandlasten im Treppenhaus oder Flur', 'Brandschutz', 'sofort', 'Gegenstände entfernen lassen, Nutzer informieren.'],
  ['Feuerlöscher fehlt oder ist nicht zugänglich', 'Brandschutz', 'kurzfristig', 'Feuerlöscher ersetzen bzw. Zugang freiräumen.'],
  ['Prüfplakette abgelaufen (z. B. Feuerlöscher)', 'Brandschutz', 'kurzfristig', 'Prüfung durch Sachkundigen beauftragen.'],
  ['Wandhydrant zugestellt oder beschädigt', 'Brandschutz', 'kurzfristig', 'Zugang freiräumen, bei Schaden Fachfirma beauftragen.'],
  ['Rauch- oder Brandmelder abgedeckt / beschädigt', 'Brandschutz', 'sofort', 'Abdeckung entfernen; bei Schaden Errichter bzw. Wartungsfirma beauftragen.'],
  ['Wand- oder Deckendurchbruch nicht verschlossen (Abschottung)', 'Brandschutz', 'kurzfristig', 'Durchbruch durch Fachfirma mit zugelassenem System verschließen lassen.'],
  ['Rauchabzug (RWA) blockiert oder in Störung', 'Brandschutz', 'kurzfristig', 'Blockade beseitigen bzw. Wartungsfirma beauftragen.'],
  ['Fluchtweg verstellt oder eingeengt', 'Flucht- und Rettungswege', 'sofort', 'Fluchtweg sofort freiräumen, Nutzer informieren.'],
  ['Notausgang verschlossen oder blockiert', 'Flucht- und Rettungswege', 'sofort', 'Notausgang sofort freigeben; muss jederzeit ohne Hilfsmittel zu öffnen sein.'],
  ['Rettungszeichen- oder Sicherheitsleuchte defekt', 'Flucht- und Rettungswege', 'kurzfristig', 'Leuchte bzw. Akku durch Elektrofachbetrieb instand setzen lassen.'],
  ['Flucht- und Rettungsplan fehlt oder veraltet', 'Flucht- und Rettungswege', 'mittelfristig', 'Plan aktualisieren lassen und aushängen.'],
  ['Stolperstelle / beschädigter Bodenbelag', 'Verkehrssicherung / Arbeitsschutz', 'kurzfristig', 'Stelle kennzeichnen bzw. absichern und instand setzen lassen.'],
  ['Beleuchtung defekt (Flur, Treppe, Außen)', 'Verkehrssicherung / Arbeitsschutz', 'kurzfristig', 'Leuchtmittel bzw. Leuchte instand setzen lassen.'],
  ['Geländer oder Handlauf beschädigt / fehlt', 'Verkehrssicherung / Arbeitsschutz', 'kurzfristig', 'Bei Absturzgefahr sofort absperren; Instandsetzung beauftragen.'],
  ['Absturzkante ungesichert (Dach, Lichtschacht)', 'Verkehrssicherung / Arbeitsschutz', 'sofort', 'Bereich sofort absperren, Sicherung beauftragen.'],
  ['Glätte oder Wasser auf Laufwegen', 'Verkehrssicherung / Arbeitsschutz', 'sofort', 'Gefahrstelle beseitigen bzw. kennzeichnen, Ursache klären.'],
  ['Verteiler offen / Abdeckung fehlt (spannungsführende Teile)', 'Elektro', 'sofort', 'Bereich sichern, Elektrofachkraft beauftragen. Nicht selbst anfassen.'],
  ['Steckdose, Schalter oder Leitung beschädigt', 'Elektro', 'sofort', 'Außer Betrieb nehmen lassen, Elektrofachkraft beauftragen.'],
  ['Lagerung in Elektro- oder Technikraum', 'Elektro', 'kurzfristig', 'Raum räumen lassen – Technikräume sind keine Lagerräume.'],
  ['Undichtigkeit / Wasseraustritt', 'Technik / TGA', 'sofort', 'Wasser absperren falls möglich, Fachfirma bzw. Notdienst informieren.'],
  ['Anlage in Störung oder außer Betrieb', 'Technik / TGA', 'kurzfristig', 'Wartungsfirma bzw. Notdienst informieren.'],
  ['Prüffrist überschritten (Prüfplakette, Prüfbuch)', 'Technik / TGA', 'kurzfristig', 'Prüfung beauftragen, Termin im CAFM nachtragen.'],
  ['Ungewöhnliche Geräusche oder Gerüche', 'Technik / TGA', 'kurzfristig', 'Ursache durch Fachfirma prüfen lassen.'],
  ['Feuchtigkeit oder Schimmel', 'Gebäude / Außenanlagen', 'kurzfristig', 'Ursache klären lassen, betroffene Stelle beobachten.'],
  ['Dachrinne oder Ablauf verstopft', 'Gebäude / Außenanlagen', 'mittelfristig', 'Reinigung beauftragen.'],
  ['Schaden an Fassade oder Dach', 'Gebäude / Außenanlagen', 'mittelfristig', 'Begutachtung beauftragen; bei Gefahr durch herabfallende Teile sofort absperren.'],
  ['Feuerwehrzufahrt oder Aufstellfläche zugeparkt', 'Flucht- und Rettungswege', 'sofort', 'Fläche freihalten lassen, Beschilderung prüfen.'],
  ['Müll oder Sperrmüll abgestellt', 'Ordnung / Sauberkeit', 'kurzfristig', 'Entsorgung veranlassen, Verursacher informieren.'],
];
const M_PFLICHT = [['titel', 'Mangel'], ['kategorie', 'Kategorie'], ['liegenschaft', 'Liegenschaft'], ['prioritaet', 'Priorität'], ['status', 'Status'], ['datum', 'Festgestellt am'], ['erfasstVon', 'Festgestellt von']];
const missingM = (r) => M_PFLICHT.filter(([k]) => !String(r[k] ?? '').trim()).map(([, t]) => t);
const prioRank = (p) => { const i = M_PRIO.indexOf(p); return i < 0 ? 9 : i; };
const statusRank = (s) => { const i = M_STATUS.indexOf(s); return i < 0 ? 0 : i; };
const nrNum = (nr) => parseInt(String(nr || '').replace(/\D/g, ''), 10) || 0;
const byMangel = (a, b) => statusRank(a.status) - statusRank(b.status) || prioRank(a.prioritaet) - prioRank(b.prioritaet) || nrNum(b.nr) - nrNum(a.nr);
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
  objekte: [],            // [{ id, kuerzel, name, gebaeude: [{ id, kuerzel, name }] }]
  aktiv: { lid: null, gid: null },
  checkAll: {},           // Gebäude-ID (oder '_') -> Checklistenstand
  unterlAll: {},          // Liegenschafts-ID (oder '_') -> Unterlagenstand
  listScope: 'geb',
  exportScope: 'alle',
  lastView: 'liste',
  maengel: [],
  mFilter: 'offen',
  berichtNurOffen: false,
  berichtGeb: 'alle',
  exportStamp: false,
  objReturn: '#/liste',
};

// ---------------------------------------------------------------- Liegenschaften und Gebäude
const curL = () => S.objekte.find((l) => l.id === S.aktiv.lid) || null;
const curG = () => { const l = curL(); return l ? (l.gebaeude.find((g) => g.id === S.aktiv.gid) || null) : null; };
const gKey = () => (curG() ? curG().id : '_');
const lKey = () => (curL() ? curL().id : '_');
const objLabel = (o) => (o ? (o.name ? `${o.kuerzel} – ${o.name}` : o.kuerzel) : '');
const gebCount = () => S.objekte.reduce((n, l) => n + l.gebaeude.length, 0);

function bindContext() {
  const gk = gKey();
  const lk = lKey();
  S.checkAll[gk] = S.checkAll[gk] || {};
  S.unterlAll[lk] = S.unterlAll[lk] || {};
  S.check = S.checkAll[gk];
  S.unterl = S.unterlAll[lk];
}

function validateAktiv() {
  let l = curL();
  if (!l) {
    l = S.objekte.find((o) => o.kuerzel === S.settings.liegenschaft) || S.objekte[0] || null;
    S.aktiv.lid = l ? l.id : null;
    S.aktiv.gid = null;
  }
  if (l && !l.gebaeude.some((g) => g.id === S.aktiv.gid)) {
    const g = l.gebaeude.find((x) => x.kuerzel === S.settings.gebaeude) || l.gebaeude[0] || null;
    S.aktiv.gid = g ? g.id : null;
  }
  if (!l) S.aktiv.gid = null;
}

function addPair(lk, gk) {
  lk = String(lk || '').trim();
  gk = String(gk || '').trim();
  if (!lk) return false;
  let changed = false;
  let l = S.objekte.find((o) => o.kuerzel === lk);
  if (!l) { l = { id: uuid(), kuerzel: lk, name: '', gebaeude: [] }; S.objekte.push(l); changed = true; }
  if (gk && !l.gebaeude.some((g) => g.kuerzel === gk)) { l.gebaeude.push({ id: uuid(), kuerzel: gk, name: '' }); changed = true; }
  return changed;
}

function syncObjekteFromAnlagen() {
  let changed = false;
  for (const a of S.anlagen) if (addPair(a.liegenschaft, a.gebaeude)) changed = true;
  return changed;
}

function saveObjekte() {
  db.setMeta('objekte', S.objekte);
  db.setMeta('aktiv', S.aktiv);
}
function saveStates() {
  db.setMeta('check2', S.checkAll);
  db.setMeta('unterl2', S.unterlAll);
}

const hasEntries = (o) => !!o && Object.keys(o).length > 0;
// Checkliste/Unterlagen, die vor dem Anlegen von Objekten erfasst wurden, dem ersten Objekt zuordnen
function adoptOrphans() {
  const g = curG();
  const l = curL();
  if (g && hasEntries(S.checkAll._) && !Object.keys(S.checkAll).some((k) => k !== '_' && hasEntries(S.checkAll[k]))) {
    S.checkAll[g.id] = S.checkAll._;
    delete S.checkAll._;
  }
  if (l && hasEntries(S.unterlAll._) && !Object.keys(S.unterlAll).some((k) => k !== '_' && hasEntries(S.unterlAll[k]))) {
    S.unterlAll[l.id] = S.unterlAll._;
    delete S.unterlAll._;
  }
}

function nextKuerzel(prefix, list) {
  let max = 0;
  const re = new RegExp(`^${prefix}(\\d+)$`, 'i');
  list.forEach((k) => { const m = re.exec(k || ''); if (m) max = Math.max(max, +m[1]); });
  return prefix + pad2(max + 1);
}

function ctxBar(withGeb = true) {
  if (!S.objekte.length) {
    return '<div class="ctx"><span>Noch keine Liegenschaft angelegt.</span> <a href="#/objekte" class="btn small">+ Liegenschaft anlegen</a></div>';
  }
  const l = curL();
  const gOpts = l && l.gebaeude.length
    ? l.gebaeude.map((g) => `<option value="${h(g.id)}"${S.aktiv.gid === g.id ? ' selected' : ''}>${h(objLabel(g))}</option>`).join('')
    : '<option value="">– kein Gebäude –</option>';
  return `<div class="ctx"><div class="ctx-grid${withGeb ? '' : ' one'}">
      <div><label class="lbl" for="ctx-l">Liegenschaft</label><select id="ctx-l">${S.objekte.map((o) => `<option value="${h(o.id)}"${l && o.id === l.id ? ' selected' : ''}>${h(objLabel(o))}</option>`).join('')}</select></div>
      ${withGeb ? `<div><label class="lbl" for="ctx-g">Gebäude</label><select id="ctx-g">${gOpts}</select></div>` : ''}
    </div><a href="#/objekte" class="small-link">Liegenschaften und Gebäude verwalten</a></div>`;
}

// true, wenn das Ereignis die Objektauswahl geändert hat
function handleCtx(e) {
  const t = e.target;
  if (t.id === 'ctx-l') {
    S.aktiv.lid = t.value;
    S.aktiv.gid = null;
    validateAktiv();
  } else if (t.id === 'ctx-g') {
    S.aktiv.gid = t.value || null;
  } else {
    return false;
  }
  saveObjekte();
  bindContext();
  return true;
}
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
const isMangel = (r) => !!r && r.typ === 'mangel';
const storeOf = (r) => (isMangel(r) ? 'maengel' : 'anlagen');
const baseName = (r) => (isMangel(r)
  ? `${safeName(r.liegenschaft || 'ohne')}_${safeName(r.nr || 'M')}`
  : (r.id && r.id.trim() ? safeName(r.id) : `OHNE-ID_${r.uid.slice(0, 8)}`));
const fotoNames = (r) => Array.from({ length: r.fotoCount || 0 }, (_, i) => `${baseName(r)}_${pad2(i + 1)}.jpg`);
function fileTag() {
  const l = curL();
  const g = curG();
  let t = 'Alle';
  if (S.exportScope === 'lieg' && l) t = l.kuerzel;
  else if (S.exportScope === 'geb' && l && g) t = `${l.kuerzel}_${g.kuerzel}`;
  else if (!S.objekte.length) t = S.settings.gebaeude || 'Export';
  return `${safeName(t)}_${today()}`;
}
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
    await db.put(storeOf(r), r);
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
  const L = curL();
  const G = curG();
  const r = {
    uid: uuid(), created: Date.now(), updated: Date.now(), fotoCount: 0, idAuto: true,
    liegenschaft: L ? L.kuerzel : (S.settings.liegenschaft || ''),
    gebaeude: G ? G.kuerzel : (L ? '' : (S.settings.gebaeude || '')),
    erfasstVon: S.settings.erfasser || '', erfasstAm: today(),
  };
  const last = S.anlagen
    .filter((a) => a.liegenschaft === r.liegenschaft && a.gebaeude === r.gebaeude)
    .sort((a, b) => (b.updated || 0) - (a.updated || 0))[0];
  if (S.settings.ortUebernehmen && last) {
    r.geschoss = last.geschoss || '';
    r.raumNr = last.raumNr || '';
    r.raumBez = last.raumBez || '';
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
    if (isMangel(r)) S.maengel = S.maengel.filter((a) => a.uid !== r.uid);
    else S.anlagen = S.anlagen.filter((a) => a.uid !== r.uid);
    await db.del(storeOf(r), r.uid);
  }
}

// ---------------------------------------------------------------- Router
async function route() {
  const parts = (location.hash.replace(/^#\/?/, '') || 'liste').split('/');
  const view = parts[0];
  const arg = decodeURIComponent(parts[1] || '');
  if (S.current && !((view === 'anlage' || view === 'mangel') && arg === S.current.uid)) await leaveForm();
  revokeThumbs();
  if (view !== 'bericht') { reportUrls.forEach((u) => URL.revokeObjectURL(u)); reportUrls = []; }
  const m = main();
  m.onclick = m.oninput = m.onchange = null;
  bindContext();
  const navView = view === 'anlage' ? (S.returnTo === '#/check' ? 'check' : 'liste')
    : (view === 'mangel' || view === 'bericht') ? 'begehung' : view;
  document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === navView));
  $('#back').hidden = !['anlage', 'objekte', 'mangel', 'bericht'].includes(view);
  if (view === 'objekte' && S.lastView !== 'objekte') S.objReturn = `#/${S.lastView || 'liste'}`;
  if (!['anlage', 'mangel', 'bericht', 'objekte'].includes(view)) S.lastView = view;
  window.scrollTo(0, 0);
  if (view === 'objekte') return renderObjekte();
  if (view === 'begehung') return renderBegehung();
  if (view === 'mangel') return renderMangelForm(arg);
  if (view === 'bericht') return renderBericht();
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

function scopedForList() {
  const l = curL();
  const g = curG();
  if (!l || S.listScope === 'alle') return S.anlagen;
  if (S.listScope === 'geb' && g) return S.anlagen.filter((r) => r.liegenschaft === l.kuerzel && r.gebaeude === g.kuerzel);
  return S.anlagen.filter((r) => r.liegenschaft === l.kuerzel);
}

function filteredList() {
  const q = S.listSearch.trim().toLowerCase();
  const list = scopedForList().filter((r) => {
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
  const all = scopedForList();
  const nOffen = all.filter((r) => missing(r).length || dupId(r)).length;
  const fotos = all.reduce((s, r) => s + (r.fotoCount || 0), 0);
  $('#summary').textContent = `${all.length} Anlagen · ${nOffen} unvollständig · ${fotos} Fotos${list.length !== all.length ? ` · ${list.length} angezeigt` : ''}`;
  $('#items').innerHTML = list.length
    ? list.map(itemHtml).join('')
    : `<p class="empty">${all.length ? 'Keine Treffer.' : (S.anlagen.length ? 'In dieser Auswahl noch keine Anlagen.<br>Oben Liegenschaft/Gebäude wechseln oder „Alle“ anzeigen.' : 'Noch keine Anlagen erfasst.<br>Mit „+ Neue Anlage“ starten oder über die Checkliste vorgehen.')}</p>`;
}

function renderList() {
  setTitle('Anlagen');
  const chips = [['alle', 'Alle'], ['offen', 'Unvollständig'], ['klaeren', 'Klären'], ['maengel', 'Mängel']];
  const setupHint = !S.settings.erfasser
    ? '<div class="banner">Tipp: Unter <a href="#/export">Export → Einstellungen</a> dein Kürzel hinterlegen – dann ist „Erfasst von“ bei jeder neuen Anlage schon ausgefüllt.</div>'
    : '';
  const l = curL();
  const g = curG();
  const scopeSel = l
    ? `<select id="scope" aria-label="Anzeigen">${g ? `<option value="geb"${S.listScope === 'geb' ? ' selected' : ''}>Nur Gebäude ${h(g.kuerzel)}</option>` : ''}
        <option value="lieg"${S.listScope === 'lieg' || (S.listScope === 'geb' && !g) ? ' selected' : ''}>Ganze Liegenschaft ${h(l.kuerzel)}</option>
        <option value="alle"${S.listScope === 'alle' ? ' selected' : ''}>Alle Liegenschaften</option></select>`
    : '';
  main().innerHTML = `
    ${backupBanner()}${setupHint}${ctxBar(true)}
    <div class="toolbar">
      ${scopeSel}
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
  m.onchange = (e) => {
    if (handleCtx(e)) { renderList(); return; }
    if (e.target.id === 'scope') { S.listScope = e.target.value; renderItems(); }
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

function objSelectHtml(c, r, lbl) {
  const v = r[c.key] || '';
  let opts;
  if (c.key === 'liegenschaft') {
    opts = S.objekte.map((o) => ({ v: o.kuerzel, t: objLabel(o) }));
  } else {
    const L = S.objekte.find((o) => o.kuerzel === r.liegenschaft);
    opts = (L ? L.gebaeude : []).map((g) => ({ v: g.kuerzel, t: objLabel(g) }));
  }
  if (v && !opts.some((o) => o.v === v)) opts.push({ v, t: `${v} (nicht in der Liste)` });
  return lbl + `<select id="f_${c.key}" data-k="${c.key}"><option value="">– wählen –</option>`
    + opts.map((o) => `<option value="${h(o.v)}"${o.v === v ? ' selected' : ''}>${h(o.t)}</option>`).join('') + '</select>';
}

function fieldHtml(c, r) {
  const v = r[c.key] ?? '';
  const star = c.pflicht ? ' <b class="star">*</b>' : '';
  const lbl = `<label class="lbl" for="f_${c.key}">${h(c.header)}${star}</label>`;
  const ph = c.example ? ` placeholder="z. B. ${h(c.example)}"` : '';
  if ((c.key === 'liegenschaft' || c.key === 'gebaeude') && S.objekte.length) {
    return `<div class="field${c.pflicht ? ' req' : ''}" data-field="${c.key}">${objSelectHtml(c, r, lbl)}</div>`;
  }
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

function photoSection(r) {
  return `<section class="card"><h2>Fotos</h2>
    <div class="photos" id="photos"></div>
    <p id="photobusy" class="busy" hidden>Foto wird verarbeitet …</p>
    <div class="row2">
      <label class="btn">Foto aufnehmen<input type="file" accept="image/*" capture="environment" data-photo class="vh"></label>
      <label class="btn ghost">Aus Galerie<input type="file" accept="image/*" multiple data-photo class="vh"></label>
    </div>
    <p class="hint">${isMangel(r) ? 'Den Mangel aus der Nähe und mit Umgebung fotografieren, damit man ihn später wiederfindet.' : '1. Foto = Gesamtansicht, 2. Foto = Typenschild, weitere = Details/Mängel. Beim Export heißen die Dateien Anlagen-ID_01.jpg, _02.jpg …'}</p>
    <p class="hint">Auf ein Foto tippen: Beschreibung eingeben, Foto mit Text herunterladen oder mit „Was ist das?“ im Netz suchen.</p>
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
      ? photoSection(r)
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
      if (k === 'liegenschaft') {
        const L = S.objekte.find((o) => o.kuerzel === r.liegenschaft);
        r.gebaeude = L && L.gebaeude.length ? L.gebaeude[0].kuerzel : '';
        $('[data-field="gebaeude"]').outerHTML = fieldHtml(COL.gebaeude, r);
        refreshId(r);
      }
      if (k === 'gebaeude') refreshId(r);
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
    const label = isMangel(r) ? 'Foto' : i === 0 ? 'Gesamt' : i === 1 ? 'Typenschild' : 'Detail';
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

function photoContext(r) {
  const title = isMangel(r)
    ? `${[r.liegenschaft, r.nr].filter(Boolean).join(' ')} – ${r.titel || 'Mangel'}`
    : `${r.id || 'ohne ID'} – ${r.bezeichnung || r.anlagenart || ''}`;
  const raum = isMangel(r) ? r.ort : [r.raumNr, r.raumBez].filter(Boolean).join(' ');
  const ort = [[r.liegenschaft, r.gebaeude].filter(Boolean).join(' / '), r.geschoss, raum].filter(Boolean).join(' · ');
  return { title, ort };
}

// Erzeugt eine Kopie des Fotos mit Textleiste (Bezeichnung, Ort, Beschreibung, Datum)
async function stampPhoto(r, f, i) {
  const src = await loadImage(new Blob([f.data], { type: 'image/jpeg' }));
  const w = src.width || src.naturalWidth;
  const hgt = src.height || src.naturalHeight;
  const fs = Math.max(20, Math.round(w / 45));
  const pad = Math.round(fs * 0.8);
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const { title, ort } = photoContext(r);
  const datum = new Date(f.created || Date.now()).toLocaleDateString('de-DE');
  const foot = [`Foto ${pad2(i + 1)}`, datum, r.erfasstVon || ''].filter(Boolean).join(' · ');
  const wrap = (text, font) => {
    ctx.font = font;
    const lines = [];
    let line = '';
    for (const wd of String(text).split(/\s+/)) {
      const t = line ? `${line} ${wd}` : wd;
      if (line && ctx.measureText(t).width > w - 2 * pad) { lines.push(line); line = wd; } else line = t;
    }
    if (line) lines.push(line);
    return lines;
  };
  const fBold = `bold ${fs}px Arial, sans-serif`;
  const fNorm = `${fs}px Arial, sans-serif`;
  const small = Math.round(fs * 0.8);
  const fSmall = `${small}px Arial, sans-serif`;
  const blocks = [
    ...wrap(title, fBold).map((t) => [t, fBold, fs]),
    ...(ort ? wrap(ort, fNorm).map((t) => [t, fNorm, fs]) : []),
    ...(f.beschreibung ? wrap(f.beschreibung, fNorm).map((t) => [t, fNorm, fs]) : []),
    [foot, fSmall, small],
  ];
  const lh = 1.35;
  const barH = Math.round(pad * 2 + blocks.reduce((sum, b) => sum + b[2] * lh, 0));
  c.width = w;
  c.height = hgt + barH;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, c.height);
  ctx.drawImage(src, 0, 0, w, hgt);
  if (src.close) src.close();
  ctx.fillStyle = '#1C1C1C';
  ctx.textBaseline = 'top';
  let y = hgt + pad;
  for (const [t, font, size] of blocks) { ctx.font = font; ctx.fillText(t, pad, y); y += size * lh; }
  const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.88));
  return new File([blob], `${baseName(r)}_${pad2(i + 1)}_mit_Text.jpg`, { type: 'image/jpeg' });
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
    <p class="hint">${f.w} × ${f.h} px · ${fmtBytes(f.data.byteLength)} · ${new Date(f.created || Date.now()).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}</p>
    <label class="lbl sub" for="fdesc">Beschreibung zum Foto</label>
    <textarea id="fdesc" placeholder="z. B. Keil unter der Tür, Tür schließt nicht">${h(f.beschreibung || '')}</textarea>
    <div class="row2 sub">
      <button class="btn" data-act="dlstamp">Mit Text herunterladen</button>
      <button class="btn ghost" data-act="dlorig">Original herunterladen</button>
    </div>
    ${canShare ? '<button class="btn ghost block sub" data-act="sharestamp">Mit Text teilen (z. B. per Mail, WhatsApp)</button>' : ''}
    <p class="hint">„Mit Text“ schreibt Bezeichnung, Ort, Beschreibung und Datum unter das Foto.</p>
    <button class="btn ghost block sub" data-act="lens">Was ist das? Foto im Netz suchen</button>
    <p class="hint">${canShare
      ? 'Im Teilen-Menü „Google“ bzw. „Google Lens“ wählen (Internet nötig). Erscheint es nicht: Foto sichern und in der Google-App auf das Kamera-Symbol tippen.'
      : 'Das Foto wird gespeichert. Danach in der Google-App auf das Kamera-Symbol (Lens) tippen und das Foto auswählen.'}
      Alternativ das Foto in Claude hochladen und fragen, was es ist.</p>
    <div class="actions">
      ${i > 0 ? '<button class="btn ghost" data-act="left">Eine Position nach vorne</button>' : ''}
      <button class="btn danger" data-act="del">Foto löschen</button>
      <button class="btn" data-act="close">Schließen</button>
    </div>`);
  let descTimer;
  m.oninput = (e) => {
    if (e.target.id !== 'fdesc') return;
    f.beschreibung = e.target.value;
    clearTimeout(descTimer);
    descTimer = setTimeout(() => { db.put('fotos', f); markChanged(); }, 400);
  };
  m.onclick = async (e) => {
    const act = e.target.dataset && e.target.dataset.act;
    if (!act) return;
    if (act === 'dlorig') { downloadFile(photoFile); return; }
    if (act === 'dlstamp' || act === 'sharestamp') {
      clearTimeout(descTimer);
      await db.put('fotos', f);
      const stamped = await stampPhoto(r, f, i);
      if (act === 'sharestamp') {
        try { await navigator.share({ files: [stamped], title: stamped.name }); } catch (err) {
          if (err.name !== 'AbortError') { downloadFile(stamped); toast('Teilen nicht möglich – Foto wurde heruntergeladen.'); }
        }
      } else {
        downloadFile(stamped);
      }
      return;
    }
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
    if (act === 'close') {
      clearTimeout(descTimer);
      await db.put('fotos', f);
      return closeModal();
    }
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
  ckSaveTimer = setTimeout(() => { db.setMeta('check2', S.checkAll); markChanged(); }, 300);
}

function renderCheck() {
  setTitle('Begehungscheckliste');
  main().innerHTML = ctxBar(true) + `<div class="card"><div class="kv"><span>Geprüfte Punkte${curG() ? ` (${h(curG().kuerzel)})` : ''}</span><b id="cktotal"></b></div>
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
  m.onchange = (e) => { if (handleCtx(e)) renderCheck(); };
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
  ulSaveTimer = setTimeout(() => { db.setMeta('unterl2', S.unterlAll); markChanged(); }, 300);
}

function ulItemHtml(u, i) {
  const st = S.unterl[u.unterlage] || {};
  return `<div class="ck" data-ul="${i}"><div class="ck-t">${h(u.unterlage)}</div>
    <div class="ck-m">Wofür: ${h(u.wofuer)}</div>
    <details class="help"><summary>Was ist das? Wo finde ich es?</summary>
      <p><b>Was ist das / was steht drin:</b> ${h(u.was)}</p>
      <p><b>Wo finde ich es:</b> ${h(u.wo)}</p>
      <p><b>Wenn es fehlt:</b> ${h(u.fehlt)}</p>
    </details>
    <div class="ck-row"><span class="lbl">Liegt vor:</span><div class="pills">${LIEGT_VOR.map((o) => `<button type="button" class="pill${st.liegtVor === o ? ' on' : ''}" data-val="${h(o)}">${h(o)}</button>`).join('')}</div></div>
    <div class="ck-note"><input type="text" data-ulnote value="${h(st.bemerkung || '')}" placeholder="Bemerkung" autocomplete="off"></div></div>`;
}

function renderUnterlagen() {
  setTitle('Unterlagen');
  const items = UNTERLAGEN.map((u, i) => ({ u, i }));
  const kats = [...new Set(UNTERLAGEN.map((u) => u.kat))];
  const count = () => UNTERLAGEN.filter((u) => S.unterl[u.unterlage]?.liegtVor === 'ja').length;
  const vorher = items.filter(({ u }) => u.vorher);
  main().innerHTML = ctxBar(false) + `<div class="card"><div class="kv"><span>Liegt vor${curL() ? ` (${h(curL().kuerzel)})` : ''}</span><b id="ultotal"></b></div>
      <div class="progress"><div id="ulbar"></div></div>
      <p class="hint">Zuerst die ${vorher.length} Unterlagen „vor der Begehung“ beschaffen, der Rest kann später kommen. Unter „Was ist das? Wo finde ich es?“ steht, was drin ist, wo du es findest und was du tust, wenn es fehlt. Zuständige Ämter können je Gemeinde abweichen.</p></div>`
    + `<details class="group" open><summary>Vor der Begehung beschaffen<span class="cnt">${vorher.length}</span></summary>`
    + vorher.map(({ u, i }) => ulItemHtml(u, i)).join('') + '</details>'
    + kats.map((k) => {
      const rest = items.filter(({ u }) => u.kat === k && !u.vorher);
      if (!rest.length) return '';
      return `<details class="group"><summary>${h(k)}<span class="cnt">${rest.length}</span></summary>`
        + rest.map(({ u, i }) => ulItemHtml(u, i)).join('') + '</details>';
    }).join('');
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
    if (!st) return;
    st.liegtVor = st.liegtVor === pill.dataset.val ? '' : pill.dataset.val;
    pill.parentElement.querySelectorAll('.pill').forEach((p) => p.classList.toggle('on', p.dataset.val === st.liegtVor));
    saveUnterl();
    upd();
  };
  m.onchange = (e) => { if (handleCtx(e)) renderUnterlagen(); };
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

function inExportScope(r) {
  const l = curL();
  const g = curG();
  if (S.exportScope === 'lieg' && l) return r.liegenschaft === l.kuerzel;
  if (S.exportScope === 'geb' && l && g) return r.liegenschaft === l.kuerzel && r.gebaeude === g.kuerzel;
  return true;
}
const sortedAnlagen = () => S.anlagen.filter(inExportScope).sort(byId);
const sortedMaengel = () => S.maengel.filter(inExportScope)
  .sort((a, b) => (a.liegenschaft || '').localeCompare(b.liegenschaft || '', 'de') || nrNum(a.nr) - nrNum(b.nr));

// Gebäude bzw. Liegenschaften, deren Checkliste/Unterlagen exportiert werden
function exportGebaeude() {
  const l = curL();
  const g = curG();
  const out = [];
  for (const L of S.objekte) {
    if (S.exportScope !== 'alle' && l && L.id !== l.id) continue;
    for (const G of L.gebaeude) {
      if (S.exportScope === 'geb' && g && G.id !== g.id) continue;
      out.push({ L, G, key: G.id });
    }
  }
  if ((S.exportScope === 'alle' || !out.length) && hasEntries(S.checkAll._)) out.push({ L: null, G: null, key: '_' });
  if (!out.length) out.push({ L: null, G: null, key: '_' });
  return out;
}
function exportLiegenschaften() {
  const l = curL();
  const out = S.objekte.filter((L) => S.exportScope === 'alle' || !l || L.id === l.id).map((L) => ({ L, key: L.id }));
  if ((S.exportScope === 'alle' || !out.length) && hasEntries(S.unterlAll._)) out.push({ L: null, key: '_' });
  if (!out.length) out.push({ L: null, key: '_' });
  return out;
}

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
  const n = sortedAnlagen().filter((r) => missing(r).length || dupId(r)).length;
  return n ? `Achtung: ${n} Anlage${n > 1 ? 'n sind' : ' ist'} unvollständig (Pflichtfelder fehlen oder ID doppelt). Vor dem CAFM-Import ergänzen.` : '';
}

async function exportXlsx() {
  if (!sortedAnlagen().length && !sortedMaengel().length) return toast('In dieser Auswahl gibt es noch keine Anlagen oder Mängel.');
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
        name: 'Mängel',
        bodyStyle: STYLE.WRAP,
        columns: cols([['Liegenschaft', 12], ['Gebäude', 10], ['Nr.', 8], ['Mangel', 36], ['Kategorie', 20], ['Geschoss', 9], ['Raum / Bereich', 22],
          ['Beschreibung', 40], ['Priorität', 12], ['Maßnahme', 40], ['Zuständig', 18], ['Frist', 11], ['Status', 10], ['Erledigt am', 11],
          ['Betroffene Anlage', 14], ['Fotos', 30], ['Festgestellt am', 12], ['Festgestellt von', 10]]),
        rows: sortedMaengel().map((m) => [m.liegenschaft || null, m.gebaeude || null, m.nr || null, m.titel || null, m.kategorie || null,
          m.geschoss || null, m.ort || null, m.beschreibung || null, m.prioritaet || null, m.massnahme || null, m.zustaendig || null,
          m.frist ? { date: m.frist } : null, m.status || null, m.erledigtAm ? { date: m.erledigtAm } : null, m.anlageId || null,
          fotoNames(m).join(', ') || null, m.datum ? { date: m.datum } : null, m.erfasstVon || null]),
      },
      {
        name: 'Begehungscheckliste',
        bodyStyle: STYLE.WRAP,
        columns: cols([['Liegenschaft', 12], ['Gebäude', 10], ['Bereich', 26], ['Nr.', 5], ['Anlage / Bauteil', 46], ['KG', 11], ['Erfassung', 24], ['Typische Prüf-/Wartungsgrundlage (Hinweis)', 60], ['Vorhanden', 11], ['Erfasst', 9], ['Bemerkung', 30]]),
        rows: exportGebaeude().flatMap(({ L, G, key }) => CHECKLISTE.flatMap((b) => b.items.map((it, i) => {
          const st = (S.checkAll[key] || {})[ckKey(b.bereich, it)] || {};
          return [L ? L.kuerzel : null, G ? G.kuerzel : null, b.bereich, i + 1, it.anlage, it.kg, it.erfassung, it.hinweis || null, st.vorhanden || null, st.erfasst || null, st.bemerkung || null];
        }))),
      },
      {
        name: 'Unterlagen',
        bodyStyle: STYLE.WRAP,
        columns: cols([['Liegenschaft', 12], ['Nr.', 5], ['Kategorie', 22], ['Unterlage', 46], ['Wann beschaffen', 16], ['Wofür', 40], ['Wenn es fehlt', 50], ['Liegt vor', 11], ['Bemerkung', 30]]),
        rows: exportLiegenschaften().flatMap(({ L, key }) => UNTERLAGEN.map((u, i) => {
          const st = (S.unterlAll[key] || {})[u.unterlage] || {};
          return [L ? L.kuerzel : null, i + 1, u.kat, u.unterlage, u.vorher ? 'vor der Begehung' : 'später', u.wofuer, u.fehlt, st.liegtVor || null, st.bemerkung || null];
        })),
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
  if (!sortedAnlagen().length) return toast('In dieser Auswahl gibt es noch keine Anlagen.');
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
  const records = [...sortedAnlagen(), ...sortedMaengel()];
  const total = records.reduce((s, r) => s + (r.fotoCount || 0), 0);
  if (!total) return toast('Keine Fotos vorhanden.');
  busyModal('Fotos werden gepackt …');
  try {
    const out = [];
    let files = [];
    let size = 0;
    let done = 0;
    const csvEsc = (v) => { const t = v == null ? '' : String(v); return /[";\r\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
    const liste = [['Datei', 'Art', 'Nummer', 'Bezeichnung', 'Fotobeschreibung', 'Liegenschaft', 'Gebäude', 'Geschoss', 'Raum / Bereich', 'Aufgenommen'].join(';')];
    const flush = async () => {
      if (!files.length) return;
      out.push(await makeZip(files));
      files = [];
      size = 0;
    };
    for (const r of records) {
      const fotos = await getFotos(r.uid);
      for (let i = 0; i < fotos.length; i++) {
        const f = fotos[i];
        const ordner = isMangel(r) ? `Maengel_${safeName(r.liegenschaft || 'ohne')}` : `Fotos_${safeName(r.gebaeude || 'ohne_Gebaeude')}`;
        const datei = `${ordner}/${baseName(r)}_${pad2(i + 1)}.jpg`;
        const data = S.exportStamp ? await stampPhoto(r, f, i) : f.data;
        files.push({ name: datei, data });
        size += S.exportStamp ? data.size : f.data.byteLength;
        liste.push([datei, isMangel(r) ? 'Mangel' : 'Anlage', isMangel(r) ? r.nr : r.id, isMangel(r) ? r.titel : r.bezeichnung,
          f.beschreibung, r.liegenschaft, r.gebaeude, r.geschoss, isMangel(r) ? r.ort : [r.raumNr, r.raumBez].filter(Boolean).join(' '),
          new Date(f.created || Date.now()).toLocaleString('de-DE')].map(csvEsc).join(';'));
        done++;
      }
      setProgress(`${done} von ${total} Fotos …`);
      if (size >= CHUNK) await flush();
    }
    files.push({ name: 'Fotoliste.csv', data: '\ufeff' + liste.join('\r\n') });
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
      app: 'tga-anlagenerfassung', format: 2, version: APP_VERSION, created: new Date().toISOString(),
      settings: S.settings, geschosse: S.geschosse, objekte: S.objekte, aktiv: S.aktiv,
      check2: S.checkAll, unterl2: S.unterlAll, anlagen: S.anlagen, maengel: S.maengel, fotos: [],
    };
    const blobs = [];
    let files = [];
    let size = 0;
    for (const r of [...S.anlagen, ...S.maengel]) {
      const fotos = await getFotos(r.uid);
      for (const f of fotos) {
        meta.fotos.push({ fid: f.fid, uid: f.uid, idx: f.idx, w: f.w, h: f.h, created: f.created, beschreibung: f.beschreibung || '' });
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
      `Enthält alle Anlagen, Mängel, Fotos, Checklisten und Einstellungen.${blobs.length > 1 ? ' Beim Wiederherstellen alle Teile gemeinsam auswählen.' : ''}`,
      () => { S.lastBackup = Date.now(); db.setMeta('lastBackup', S.lastBackup); }
    );
  } catch (e) {
    endBusy();
    alert('Datensicherung fehlgeschlagen: ' + e.message);
  }
}

async function loadState() {
  S.anlagen = await db.getAll('anlagen');
  S.maengel = await db.getAll('maengel');
  S.settings = { ...S.settings, ...(await db.getMeta('settings', {})) };
  S.geschosse = await db.getMeta('geschosse', [...GESCHOSSE]);
  // Liegenschaften und Gebäude (ab Version 1.3); ältere Daten werden übernommen
  const obj = await db.getMeta('objekte', null);
  let changed = !Array.isArray(obj);
  S.objekte = Array.isArray(obj) ? obj : [];
  if (changed) addPair(S.settings.liegenschaft, S.settings.gebaeude);
  if (syncObjekteFromAnlagen()) changed = true;
  S.aktiv = (await db.getMeta('aktiv', null)) || { lid: null, gid: null };
  validateAktiv();
  S.checkAll = await db.getMeta('check2', null);
  if (!S.checkAll) {
    const old = await db.getMeta('check', {});
    S.checkAll = {};
    if (hasEntries(old)) S.checkAll[gKey()] = old;
    changed = true;
  }
  S.unterlAll = await db.getMeta('unterl2', null);
  if (!S.unterlAll) {
    const old = await db.getMeta('unterlagen', {});
    S.unterlAll = {};
    if (hasEntries(old)) S.unterlAll[lKey()] = old;
    changed = true;
  }
  if (changed) { saveObjekte(); saveStates(); }
  bindContext();
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
    await db.clear('maengel');
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
    await db.putMany('maengel', (meta.maengel || []).map((a) => ({ ...a, fotoCount: counts[a.uid] || 0 })));
    await db.setMeta('settings', meta.settings || {});
    await db.setMeta('geschosse', meta.geschosse || [...GESCHOSSE]);
    if (meta.format >= 2) {
      await db.setMeta('objekte', meta.objekte || []);
      await db.setMeta('aktiv', meta.aktiv || { lid: null, gid: null });
      await db.setMeta('check2', meta.check2 || {});
      await db.setMeta('unterl2', meta.unterl2 || {});
    } else {
      await db.setMeta('check', meta.check || {});
      await db.setMeta('unterlagen', meta.unterlagen || {});
      for (const k of ['objekte', 'aktiv', 'check2', 'unterl2']) await db.del('meta', k);
    }
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
    if (syncObjekteFromAnlagen()) { validateAktiv(); saveObjekte(); bindContext(); }
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
  await db.clear('maengel');
  await db.clear('fotos');
  await db.clear('meta');
  S.maengel = [];
  S.anlagen = [];
  S.settings = { liegenschaft: '', gebaeude: '', erfasser: '', fotoMax: 1920, ortUebernehmen: true };
  S.geschosse = [...GESCHOSSE];
  S.objekte = [];
  S.aktiv = { lid: null, gid: null };
  S.checkAll = {};
  S.unterlAll = {};
  bindContext();
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
    <span>Mängel (Begehung)</span><b>${S.maengel.length}</b>
    <span>Fotos</span><b>${fotos + S.maengel.reduce((n, r) => n + (r.fotoCount || 0), 0)}</b>
    <span>Letzte Datensicherung</span><b>${S.lastBackup ? fmtDateTime(S.lastBackup) : 'noch nie'}</b>
    ${est ? `<span>Speicher belegt</span><b>${est}</b>` : ''}
    <span>Speicher geschützt</span><b>${persisted === null ? 'unbekannt' : persisted ? 'ja' : 'nein'}</b>
  </div>
  ${standalone ? '' : '<p class="hint">Tipp: Die App über das Browser-Menü „Zum Startbildschirm hinzufügen“ installieren. Dann startet sie wie eine normale App und die Daten sind besser geschützt.</p>'}
  ${installEvt ? '<button class="btn block sub" id="install">App installieren</button>' : ''}
  </section>

  <section class="card"><h2>Export</h2>
  ${S.objekte.length ? `<div class="setting"><label class="lbl" for="x-scope">Umfang</label><select id="x-scope">
    <option value="alle"${S.exportScope === 'alle' ? ' selected' : ''}>Alle Liegenschaften</option>
    ${curL() ? `<option value="lieg"${S.exportScope === 'lieg' ? ' selected' : ''}>Nur Liegenschaft ${h(objLabel(curL()))}</option>` : ''}
    ${curG() ? `<option value="geb"${S.exportScope === 'geb' ? ' selected' : ''}>Nur Gebäude ${h(objLabel(curG()))}</option>` : ''}
  </select><p class="hint">Gilt für Excel, CSV und Fotos. Die Datensicherung enthält immer alles.</p></div>` : ''}
  <div class="stack">
    <button class="btn block" id="x-xlsx">Excel-Datei (.xlsx) für CAFM</button>
    <button class="btn ghost block" id="x-fotos">Fotos (.zip, Dateinamen nach Anlagen-ID bzw. Mangel-Nr.)</button>
    <label class="check-line"><input type="checkbox" id="x-stamp"${S.exportStamp ? ' checked' : ''}> Beschreibung als Text ins Foto schreiben</label>
    <button class="btn ghost block" id="x-csv">CSV-Datei (Semikolon)</button>
  </div>
  <p class="hint">Die Excel-Datei enthält das importfähige Blatt „Anlagen“ mit denselben Spalten wie die Erfassungsvorlage, dazu Mängel, Checkliste und Unterlagen. Das Foto-ZIP enthält eine Fotoliste mit allen Beschreibungen.</p></section>

  <section class="card"><h2>Datensicherung</h2><div class="stack">
    <button class="btn block" id="x-backup">Datensicherung erstellen (.zip)</button>
    <label class="btn ghost block">Datensicherung wiederherstellen<input type="file" id="i-backup" accept=".zip,application/zip" multiple class="vh"></label>
  </div>
  <p class="hint">Die Daten liegen nur auf diesem Gerät. Nach jedem Begehungstag sichern und die Datei z. B. in OneDrive oder per Mail ablegen. Mit der Sicherung lässt sich auch auf ein anderes Gerät umziehen.</p></section>

  <section class="card"><h2>Import</h2>
    <label class="btn ghost block">Excel-Vorlage importieren (.xlsx)<input type="file" id="i-xlsx" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="vh"></label>
    <p class="hint">Liest das Blatt „Anlagen“ der Erfassungsvorlage, z. B. am PC vorab eingetragene Anlagen aus Prüfberichten. Gleiche Anlagen-ID = Datensatz wird aktualisiert, sonst neu angelegt. Fotos bleiben erhalten.</p></section>

  <section class="card"><h2>Einstellungen</h2>
    <div class="setting"><span class="lbl">Liegenschaften und Gebäude</span>
      <div>${S.objekte.length} Liegenschaft${S.objekte.length === 1 ? '' : 'en'}, ${gebCount()} Gebäude${curL() ? ` · aktuell: ${h(curL().kuerzel)}${curG() ? ` / ${h(curG().kuerzel)}` : ''}` : ''}</div>
      <a href="#/objekte" class="btn ghost block sub">Liegenschaften und Gebäude verwalten</a></div>
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
    if (t.id === 'x-scope') { S.exportScope = t.value; return; }
    if (t.id === 'x-stamp') { S.exportStamp = t.checked; return; }
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

// ---------------------------------------------------------------- Begehung / Mängel
function nextMangelNr(lieg, exceptUid) {
  let max = 0;
  S.maengel.forEach((m) => { if (m.uid !== exceptUid && m.liegenschaft === lieg) max = Math.max(max, nrNum(m.nr)); });
  return `M-${String(max + 1).padStart(3, '0')}`;
}

async function newMangel(preset = {}) {
  const L = curL();
  const G = curG();
  const r = {
    uid: uuid(), typ: 'mangel', created: Date.now(), updated: Date.now(), fotoCount: 0,
    liegenschaft: L ? L.kuerzel : '', gebaeude: G ? G.kuerzel : '',
    status: 'offen', datum: today(), erfasstVon: S.settings.erfasser || '',
  };
  const last = S.maengel
    .filter((m) => m.liegenschaft === r.liegenschaft && m.gebaeude === r.gebaeude)
    .sort((a, b) => (b.updated || 0) - (a.updated || 0))[0];
  if (S.settings.ortUebernehmen && last) { r.geschoss = last.geschoss || ''; r.ort = last.ort || ''; }
  Object.assign(r, preset);
  r.nr = nextMangelNr(r.liegenschaft);
  S.maengel.push(r);
  S.untouched.add(r.uid);
  await db.put('maengel', r);
  return r;
}

function maengelScope() {
  const l = curL();
  return l ? S.maengel.filter((m) => m.liegenschaft === l.kuerzel) : S.maengel;
}

function mangelItemHtml(r) {
  const miss = missingM(r);
  const prioCls = { sofort: 'red', kurzfristig: 'yellow', mittelfristig: '', Hinweis: 'grey' }[r.prioritaet] ?? 'grey';
  const badges = [];
  if (r.prioritaet) badges.push(`<span class="badge ${prioCls}">${h(r.prioritaet)}</span>`);
  badges.push(`<span class="badge ${r.status === 'erledigt' ? 'green' : 'grey'}">${h(r.status || 'offen')}</span>`);
  if (r.frist && r.status !== 'erledigt') badges.push(`<span class="badge${r.frist < today() ? ' red' : ''}">Frist ${h(isoToDe(r.frist))}</span>`);
  if (r.fotoCount) badges.push(`<span class="badge grey">${r.fotoCount} Foto${r.fotoCount > 1 ? 's' : ''}</span>`);
  if (miss.length) badges.push(`<span class="badge red">${miss.length === 1 ? '1 Pflichtfeld fehlt' : `${miss.length} Pflichtfelder fehlen`}</span>`);
  return `<a class="item mangel${r.status === 'erledigt' ? ' done' : ''} prio-${h(r.prioritaet || 'x')}" href="#/mangel/${encodeURIComponent(r.uid)}">
    <div class="item-top"><span class="item-id">${h(r.nr || '')}</span><span class="item-meta">${h([r.gebaeude, r.geschoss, r.ort].filter(Boolean).join(' · '))}</span></div>
    <div class="item-title">${h(r.titel || '(ohne Titel)')}</div>
    <div class="item-meta">${h(r.kategorie || '')}</div>
    <div class="badges">${badges.join('')}</div></a>`;
}

function renderBegehung() {
  setTitle('Begehung');
  const all = maengelScope();
  const offen = all.filter((m) => m.status !== 'erledigt');
  const sofort = offen.filter((m) => m.prioritaet === 'sofort');
  const chips = [['offen', `Offen (${offen.length})`], ['sofort', `Sofort (${sofort.length})`], ['erledigt', 'Erledigt'], ['alle', 'Alle']];
  const list = all.filter((m) => (S.mFilter === 'offen' ? m.status !== 'erledigt'
    : S.mFilter === 'sofort' ? m.status !== 'erledigt' && m.prioritaet === 'sofort'
      : S.mFilter === 'erledigt' ? m.status === 'erledigt' : true)).sort(byMangel);
  main().innerHTML = `${ctxBar(true)}
    <div class="card"><div class="kv"><span>Mängel${curL() ? ` (${h(curL().kuerzel)})` : ''}</span><b>${all.length}</b>
      <span>davon offen</span><b>${offen.length}</b><span>davon sofort zu handeln</span><b>${sofort.length}</b></div>
      <p class="hint">Hier dokumentierst du Missstände in der Liegenschaft, z. B. eine verkeilte Brandschutztür oder einen verstellten Fluchtweg. Mängel direkt an einer Anlage kannst du auch im Anlagenformular eintragen.</p>
      <a href="#/bericht" class="btn ghost block sub">Begehungsbericht erstellen (PDF)</a></div>
    <div class="chips" style="margin-bottom:8px">${chips.map(([k, l]) => `<button class="chip${S.mFilter === k ? ' on' : ''}" data-mf="${k}">${l}</button>`).join('')}</div>
    <div id="mitems">${list.length ? list.map(mangelItemHtml).join('') : `<p class="empty">${all.length ? 'Keine Mängel in dieser Auswahl.' : 'Noch keine Mängel erfasst.<br>Mit „+ Mangel erfassen“ starten.'}</p>`}</div>
    <div class="fabs"><button class="btn" id="newm">+ Mangel erfassen</button></div>`;
  const m = main();
  m.onchange = (e) => { if (handleCtx(e)) renderBegehung(); };
  m.onclick = async (e) => {
    const chip = e.target.closest('[data-mf]');
    if (chip) { S.mFilter = chip.dataset.mf; renderBegehung(); return; }
    if (e.target.id === 'newm') {
      S.returnTo = '#/begehung';
      const r = await newMangel();
      location.hash = '#/mangel/' + encodeURIComponent(r.uid);
    }
  };
}

function mPills(key, opts, v, label, pflicht) {
  return `<div class="field${pflicht ? ' req' : ''}" data-field="${key}"><span class="lbl">${h(label)}${pflicht ? ' <b class="star">*</b>' : ''}</span>
    <div class="pills" data-pills="${key}">${opts.map((o) => `<button type="button" class="pill${v === o ? ' on' : ''}" data-val="${h(o)}">${h(o)}</button>`).join('')}</div></div>`;
}
function mText(key, label, v, opts = {}) {
  const star = opts.pflicht ? ' <b class="star">*</b>' : '';
  const input = opts.area
    ? `<textarea id="m_${key}" data-k="${key}" placeholder="${h(opts.ph || '')}">${h(v || '')}</textarea>`
    : `<input type="${opts.type || 'text'}" id="m_${key}" data-k="${key}" value="${h(v || '')}" placeholder="${h(opts.ph || '')}" autocomplete="off">`;
  return `<div class="field${opts.pflicht ? ' req' : ''}" data-field="${key}"><label class="lbl" for="m_${key}">${h(label)}${star}</label>${input}</div>`;
}
function mSelect(key, label, v, options, pflicht) {
  const opts = [...options];
  if (v && !opts.some((o) => o.v === v)) opts.push({ v, t: v });
  return `<div class="field${pflicht ? ' req' : ''}" data-field="${key}"><label class="lbl" for="m_${key}">${h(label)}${pflicht ? ' <b class="star">*</b>' : ''}</label>
    <select id="m_${key}" data-k="${key}"><option value="">– wählen –</option>${opts.map((o) => `<option value="${h(o.v)}"${o.v === v ? ' selected' : ''}>${h(o.t)}</option>`).join('')}</select></div>`;
}
function mOrtHtml(r, key) {
  if (key === 'liegenschaft' || key === 'gebaeude') {
    const c = { key, header: key === 'liegenschaft' ? 'Liegenschaft' : 'Gebäude', pflicht: key === 'liegenschaft' };
    if (S.objekte.length) {
      const star = c.pflicht ? ' <b class="star">*</b>' : '';
      return `<div class="field${c.pflicht ? ' req' : ''}" data-field="${key}">${objSelectHtml(c, r, `<label class="lbl" for="f_${key}">${c.header}${star}</label>`)}</div>`;
    }
    return mText(key, c.header, r[key], { pflicht: c.pflicht });
  }
  if (key === 'geschoss') return mSelect('geschoss', 'Geschoss', r.geschoss, S.geschosse.map((g) => ({ v: g, t: g })));
  if (key === 'anlageId') {
    const opts = S.anlagen.filter((a) => a.id && a.liegenschaft === r.liegenschaft && (!r.gebaeude || a.gebaeude === r.gebaeude))
      .sort(byId).map((a) => ({ v: a.id, t: `${a.id} – ${a.bezeichnung || a.anlagenart || ''}` }));
    return mSelect('anlageId', 'Betroffene Anlage (optional)', r.anlageId, opts);
  }
  return '';
}

function updateMStatus(r) {
  const el = $('#status');
  if (!el) return;
  const miss = missingM(r);
  el.innerHTML = miss.length ? `<div class="status bad">Fehlt: ${miss.map(h).join(', ')}</div>` : '<div class="status ok">Alle Pflichtfelder ausgefüllt.</div>';
  document.querySelectorAll('[data-field]').forEach((f) => {
    const t = M_PFLICHT.find(([k]) => k === f.dataset.field);
    f.classList.toggle('missing', S.showMissing && !!t && miss.includes(t[1]));
  });
}

function renderMangelForm(uid, keepScroll) {
  const r = S.maengel.find((m) => m.uid === uid);
  if (!r) { setTitle('Mangel'); main().innerHTML = '<p class="empty">Mangel nicht gefunden.</p>'; return; }
  S.current = r;
  setTitle(`${r.nr || 'Mangel'}${r.titel ? ` – ${r.titel}` : ''}`);
  const scroll = keepScroll ? window.scrollY : 0;
  const vorlagen = M_KAT.map((k) => {
    const items = M_VORLAGEN.map((v, i) => ({ v, i })).filter(({ v }) => v[1] === k);
    return items.length ? `<optgroup label="${h(k)}">${items.map(({ v, i }) => `<option value="${i}">${h(v[0])}</option>`).join('')}</optgroup>` : '';
  }).join('');
  main().innerHTML = `<div id="status"></div>
    <section class="card"><h2>Was wurde festgestellt?</h2>
      <div class="field"><label class="lbl" for="m_vorlage">Häufige Mängel (Vorlage)</label>
        <select id="m_vorlage"><option value="">– Vorlage wählen (optional) –</option>${vorlagen}</select>
        <p class="hint">Füllt Mangel, Kategorie, Priorität und Maßnahme vor. Alles lässt sich danach ändern.</p></div>
      ${mText('titel', 'Mangel (kurz)', r.titel, { pflicht: true, ph: 'z. B. Brandschutztür verkeilt' })}
      ${mSelect('kategorie', 'Kategorie', r.kategorie, M_KAT.map((k) => ({ v: k, t: k })), true)}
      ${mText('beschreibung', 'Beschreibung', r.beschreibung, { area: true, ph: 'Was genau ist der Missstand? Seit wann? Wer ist betroffen?' })}
    </section>
    <section class="card"><h2>Ort</h2>${['liegenschaft', 'gebaeude', 'geschoss'].map((k) => mOrtHtml(r, k)).join('')}
      ${mText('ort', 'Raum / Bereich', r.ort, { ph: 'z. B. Treppenhaus Nord, Tür zum Flur 2. OG' })}
      ${mOrtHtml(r, 'anlageId')}</section>
    ${photoSection(r)}
    <section class="card"><h2>Bewertung und Maßnahme</h2>
      ${mPills('prioritaet', M_PRIO, r.prioritaet, 'Priorität', true)}<p class="hint" style="margin:-6px 0 12px 12px">${h(M_PRIO_TEXT)}</p>
      ${mText('massnahme', 'Maßnahme', r.massnahme, { area: true, ph: 'Was ist zu tun?' })}
      ${mText('zustaendig', 'Zuständig', r.zustaendig, { ph: 'z. B. Hausmeister, Wartungsfirma, Nutzer' })}
      ${mText('frist', 'Frist', r.frist, { type: 'date' })}</section>
    <section class="card"><h2>Status</h2>${mPills('status', M_STATUS, r.status, 'Status', true)}
      ${mText('erledigtAm', 'Erledigt am', r.erledigtAm, { type: 'date' })}</section>
    <section class="card"><h2>Erfassung</h2>
      ${mText('datum', 'Festgestellt am', r.datum, { type: 'date', pflicht: true })}
      ${mText('erfasstVon', 'Festgestellt von', r.erfasstVon, { pflicht: true, ph: 'Kürzel' })}</section>
    <div class="actions">
      <button class="btn block" id="done">Fertig</button>
      <button class="btn ghost block" id="nextm">Fertig + nächster Mangel (gleicher Ort)</button>
      <button class="btn danger block" id="delete">Mangel löschen</button>
    </div>`;
  updateMStatus(r);
  renderPhotos();
  if (keepScroll) window.scrollTo(0, scroll);
  const m = main();
  m.oninput = (e) => {
    const el = e.target;
    const k = el.dataset.k;
    if (!k || el.tagName === 'SELECT' || el.type === 'file') return;
    r[k] = el.value;
    touched(r);
    scheduleSave(r);
    if (k === 'titel') setTitle(`${r.nr}${r.titel ? ` – ${r.titel}` : ''}`);
    updateMStatus(r);
  };
  m.onchange = (e) => {
    const el = e.target;
    if (el.type === 'file' && el.dataset.photo !== undefined) {
      const files = [...el.files];
      el.value = '';
      handleFiles(r, files);
      return;
    }
    if (el.id === 'm_vorlage' && el.value !== '') {
      const [titel, kat, prio, massnahme] = M_VORLAGEN[+el.value];
      if (!r.titel || confirm(`„${r.titel}“ durch „${titel}“ ersetzen?`)) r.titel = titel;
      r.kategorie = kat;
      if (!r.prioritaet) r.prioritaet = prio;
      if (!r.massnahme) r.massnahme = massnahme;
      touched(r);
      scheduleSave(r);
      renderMangelForm(r.uid, true);
      return;
    }
    const k = el.dataset.k;
    if (!k) return;
    if (el.tagName === 'SELECT' || el.type === 'date') {
      r[k] = el.value;
      touched(r);
      if (k === 'liegenschaft') {
        const L = S.objekte.find((o) => o.kuerzel === r.liegenschaft);
        r.gebaeude = L && L.gebaeude.length ? L.gebaeude[0].kuerzel : '';
        r.nr = nextMangelNr(r.liegenschaft, r.uid);
        r.anlageId = '';
        scheduleSave(r);
        renderMangelForm(r.uid, true);
        return;
      }
      if (k === 'gebaeude') {
        r.anlageId = '';
        $('[data-field="anlageId"]').outerHTML = mOrtHtml(r, 'anlageId');
      }
      scheduleSave(r);
      updateMStatus(r);
    }
  };
  m.onclick = async (e) => {
    const pill = e.target.closest('.pill');
    if (pill) {
      const box = pill.parentElement;
      const k = box.dataset.pills;
      r[k] = r[k] === pill.dataset.val ? '' : pill.dataset.val;
      box.querySelectorAll('.pill').forEach((p) => p.classList.toggle('on', p.dataset.val === r[k]));
      if (k === 'status' && r.status === 'erledigt' && !r.erledigtAm) {
        r.erledigtAm = today();
        const inp = $('#m_erledigtAm');
        if (inp) inp.value = r.erledigtAm;
      }
      touched(r);
      scheduleSave(r);
      updateMStatus(r);
      return;
    }
    const photo = e.target.closest('.photo');
    if (photo) return openPhoto(photo.dataset.fid);
    const id = e.target.id;
    if (id === 'done') {
      if (missingM(r).length && !S.showMissing) {
        S.showMissing = true;
        updateMStatus(r);
        const first = $('.field.missing');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        toast('Pflichtfelder fehlen – rot markiert. Nochmal „Fertig“ tippen, um trotzdem zu speichern.', 4000);
        return;
      }
      touched(r);
      await flushSave();
      location.hash = '#/begehung';
    } else if (id === 'nextm') {
      touched(r);
      await flushSave();
      const n = await newMangel({ liegenschaft: r.liegenschaft, gebaeude: r.gebaeude, geschoss: r.geschoss || '', ort: r.ort || '' });
      location.hash = '#/mangel/' + encodeURIComponent(n.uid);
    } else if (id === 'delete') {
      if (!confirm(`Mangel ${r.nr || ''} mit allen Fotos löschen?`)) return;
      clearTimeout(saveTimer);
      pending = null;
      const keys = await db.keysByIndex('fotos', 'uid', r.uid);
      for (const k of keys) await db.del('fotos', k);
      await db.del('maengel', r.uid);
      S.maengel = S.maengel.filter((a) => a.uid !== r.uid);
      S.untouched.delete(r.uid);
      S.current = null;
      markChanged();
      toast('Mangel gelöscht.');
      location.hash = '#/begehung';
    }
  };
}

// ---------------------------------------------------------------- Begehungsbericht (Druckansicht / PDF)
let reportUrls = [];
async function renderBericht() {
  setTitle('Begehungsbericht');
  reportUrls.forEach((u) => URL.revokeObjectURL(u));
  reportUrls = [];
  const L = curL();
  const geb = L && S.berichtGeb !== 'alle' ? L.gebaeude.find((g) => g.id === S.berichtGeb) : null;
  let list = maengelScope();
  if (geb) list = list.filter((m) => m.gebaeude === geb.kuerzel);
  if (S.berichtNurOffen) list = list.filter((m) => m.status !== 'erledigt');
  list.sort((a, b) => nrNum(a.nr) - nrNum(b.nr));
  const anl = S.anlagen.filter((a) => (!L || a.liegenschaft === L.kuerzel) && (!geb || a.gebaeude === geb.kuerzel)
    && (String(a.maengel || '').trim() || a.zustand === 'schlecht' || a.zustand === 'außer Betrieb')).sort(byId);
  const cnt = (p) => list.filter((m) => m.prioritaet === p && m.status !== 'erledigt').length;
  const ort = (m) => [m.gebaeude, m.geschoss, m.ort].filter(Boolean).join(' · ');
  main().innerHTML = `<div class="no-print card">
      ${L ? `<div class="setting"><label class="lbl" for="b-geb">Gebäude</label><select id="b-geb"><option value="alle">Alle Gebäude von ${h(L.kuerzel)}</option>${L.gebaeude.map((g) => `<option value="${h(g.id)}"${S.berichtGeb === g.id ? ' selected' : ''}>${h(objLabel(g))}</option>`).join('')}</select></div>` : ''}
      <label class="check-line"><input type="checkbox" id="b-offen"${S.berichtNurOffen ? ' checked' : ''}> Nur offene Mängel</label>
      <button class="btn block sub" id="b-print">Drucken / als PDF speichern</button>
      <p class="hint">Im Druckmenü „Als PDF speichern“ wählen. Am iPhone: Teilen → Drucken, dann im Vorschaubild mit zwei Fingern aufziehen → Teilen → „In Dateien sichern“.</p></div>
    <article class="report">
      <h1>Begehungsbericht</h1>
      <table class="rep-head"><tr><th>Liegenschaft</th><td>${h(L ? objLabel(L) : '–')}</td></tr>
        <tr><th>Gebäude</th><td>${h(geb ? objLabel(geb) : (L ? L.gebaeude.map((g) => g.kuerzel).join(', ') || '–' : '–'))}</td></tr>
        <tr><th>Stand</th><td>${h(isoToDe(today()))}</td></tr>
        <tr><th>Erstellt von</th><td>${h(S.settings.erfasser || '–')}</td></tr>
        <tr><th>Offene Mängel</th><td>${list.filter((m) => m.status !== 'erledigt').length} (sofort: ${cnt('sofort')}, kurzfristig: ${cnt('kurzfristig')}, mittelfristig: ${cnt('mittelfristig')}, Hinweis: ${cnt('Hinweis')})</td></tr></table>
      <h2>Übersicht</h2>
      ${list.length ? `<table class="rep-table"><thead><tr><th>Nr.</th><th>Mangel</th><th>Ort</th><th>Priorität</th><th>Frist</th><th>Status</th></tr></thead><tbody>
        ${list.map((m) => `<tr><td>${h(m.nr)}</td><td>${h(m.titel || '')}</td><td>${h(ort(m))}</td><td>${h(m.prioritaet || '')}</td><td>${h(isoToDe(m.frist || ''))}</td><td>${h(m.status || '')}</td></tr>`).join('')}
        </tbody></table>` : '<p>Keine Mängel in dieser Auswahl.</p>'}
      ${list.length ? '<h2>Einzelne Mängel</h2>' : ''}
      ${list.map((m) => `<section class="rep-item" data-uid="${h(m.uid)}">
        <h3>${h(m.nr)} – ${h(m.titel || '')}</h3>
        <table class="rep-head">
          <tr><th>Ort</th><td>${h(ort(m) || '–')}${m.anlageId ? ` (Anlage ${h(m.anlageId)})` : ''}</td></tr>
          <tr><th>Kategorie</th><td>${h(m.kategorie || '–')}</td></tr>
          <tr><th>Priorität</th><td>${h(m.prioritaet || '–')}</td></tr>
          <tr><th>Festgestellt</th><td>${h(isoToDe(m.datum || ''))} ${m.erfasstVon ? `durch ${h(m.erfasstVon)}` : ''}</td></tr>
          ${m.beschreibung ? `<tr><th>Beschreibung</th><td>${h(m.beschreibung)}</td></tr>` : ''}
          ${m.massnahme ? `<tr><th>Maßnahme</th><td>${h(m.massnahme)}</td></tr>` : ''}
          ${m.zustaendig ? `<tr><th>Zuständig</th><td>${h(m.zustaendig)}</td></tr>` : ''}
          ${m.frist ? `<tr><th>Frist</th><td>${h(isoToDe(m.frist))}</td></tr>` : ''}
          <tr><th>Status</th><td>${h(m.status || '')}${m.status === 'erledigt' && m.erledigtAm ? ` am ${h(isoToDe(m.erledigtAm))}` : ''}</td></tr>
        </table>
        <div class="rep-photos"></div></section>`).join('')}
      ${anl.length ? `<h2>Mängel an erfassten Anlagen</h2><table class="rep-table"><thead><tr><th>Anlagen-ID</th><th>Anlage</th><th>Ort</th><th>Zustand</th><th>Mangel</th></tr></thead><tbody>
        ${anl.map((a) => `<tr><td>${h(a.id || '')}</td><td>${h(a.bezeichnung || a.anlagenart || '')}</td><td>${h([a.gebaeude, a.geschoss, a.raumNr].filter(Boolean).join(' · '))}</td><td>${h(a.zustand || '')}</td><td>${h(a.maengel || '')}</td></tr>`).join('')}
        </tbody></table>` : ''}
    </article>`;
  const m = main();
  m.onchange = (e) => {
    if (e.target.id === 'b-offen') { S.berichtNurOffen = e.target.checked; renderBericht(); }
    if (e.target.id === 'b-geb') { S.berichtGeb = e.target.value; renderBericht(); }
  };
  m.onclick = (e) => { if (e.target.id === 'b-print') window.print(); };
  for (const sec of document.querySelectorAll('.rep-item')) {
    const fotos = await getFotos(sec.dataset.uid);
    if (!sec.isConnected) return;
    sec.querySelector('.rep-photos').innerHTML = fotos.map((f, i) => {
      const u = URL.createObjectURL(new Blob([f.data], { type: 'image/jpeg' }));
      reportUrls.push(u);
      return `<figure><img src="${u}" alt="Foto ${i + 1}"><figcaption>Foto ${i + 1}${f.beschreibung ? `: ${h(f.beschreibung)}` : ''}</figcaption></figure>`;
    }).join('');
  }
}

// ---------------------------------------------------------------- Liegenschaften verwalten
function renderObjekte() {
  setTitle('Liegenschaften & Gebäude');
  const count = (l, g) => S.anlagen.filter((a) => a.liegenschaft === l.kuerzel && (!g || a.gebaeude === g.kuerzel)).length;
  main().innerHTML = `<p class="hint" style="margin-top:0">Hier legst du deine Liegenschaften und die Gebäude darin an. Oben in Anlagen, Checkliste und Unterlagen wählst du dann aus, wo du gerade arbeitest. Die Checkliste wird je Gebäude gespeichert, die Unterlagen je Liegenschaft.</p>
    <p class="hint">Die Kürzel werden in die Anlagen eingetragen; das Gebäudekürzel steht vorn in der Anlagen-ID (z. B. B01-421-001). Gebäudekürzel deshalb im ganzen Bestand nur einmal vergeben.</p>`
    + S.objekte.map((l) => `<section class="card obj" data-l="${h(l.id)}">
      <div class="obj-grid">
        <div><label class="lbl">Kürzel</label><input type="text" data-lf="kuerzel" value="${h(l.kuerzel)}" autocomplete="off" autocapitalize="characters"></div>
        <div><label class="lbl">Liegenschaft (Name / Adresse)</label><input type="text" data-lf="name" value="${h(l.name)}" placeholder="z. B. Hauptstraße 5, Göppingen" autocomplete="off"></div>
      </div>
      <div class="lbl sub">Gebäude (${l.gebaeude.length})</div>
      ${l.gebaeude.map((g) => `<div class="geb-row" data-g="${h(g.id)}">
        <input type="text" data-gf="kuerzel" value="${h(g.kuerzel)}" aria-label="Gebäudekürzel" autocomplete="off" autocapitalize="characters">
        <input type="text" data-gf="name" value="${h(g.name)}" placeholder="Bezeichnung, z. B. Bürohaus" aria-label="Gebäudebezeichnung" autocomplete="off">
        <button type="button" class="icon-del" data-delg aria-label="Gebäude entfernen">×</button>
        <span class="hint geb-cnt">${count(l, g)} Anlagen</span></div>`).join('')}
      <div class="row2 sub"><button type="button" class="btn ghost small" data-addg>+ Gebäude</button>
        <button type="button" class="btn danger small" data-dell>Liegenschaft entfernen</button></div>
      <p class="hint">${count(l)} Anlagen in dieser Liegenschaft</p>
    </section>`).join('')
    + '<button class="btn block" id="addl">+ Liegenschaft hinzufügen</button>';

  const findL = (el) => S.objekte.find((l) => l.id === el.closest('[data-l]').dataset.l);
  const findG = (el, l) => l.gebaeude.find((g) => g.id === el.closest('[data-g]').dataset.g);
  const allG = () => S.objekte.flatMap((l) => l.gebaeude);
  let nameTimer;
  const m = main();
  m.oninput = (e) => {
    const t = e.target;
    if (t.dataset.lf === 'name') findL(t).name = t.value;
    else if (t.dataset.gf === 'name') findG(t, findL(t)).name = t.value;
    else return;
    clearTimeout(nameTimer);
    nameTimer = setTimeout(saveObjekte, 400);
  };
  m.onchange = async (e) => {
    const t = e.target;
    if (t.dataset.lf !== 'kuerzel' && t.dataset.gf !== 'kuerzel') return;
    const l = findL(t);
    const g = t.dataset.gf ? findG(t, l) : null;
    const obj = g || l;
    const alt = obj.kuerzel;
    const neu = t.value.trim();
    if (neu === alt) return;
    const doppelt = g ? allG().some((x) => x !== g && x.kuerzel.toLowerCase() === neu.toLowerCase())
      : S.objekte.some((x) => x !== l && x.kuerzel.toLowerCase() === neu.toLowerCase());
    if (!neu || doppelt) {
      t.value = alt;
      toast(!neu ? 'Das Kürzel darf nicht leer sein.' : `„${neu}“ ist schon vergeben. Bitte ein anderes Kürzel wählen.`, 4000);
      return;
    }
    const passt = (a) => (g ? a.liegenschaft === l.kuerzel && a.gebaeude === alt : a.liegenschaft === alt);
    const betroffen = S.anlagen.filter(passt);
    const betroffenM = S.maengel.filter(passt);
    const n = betroffen.length + betroffenM.length;
    if (n && confirm(`${n} Anlagen bzw. Mängel haben noch „${alt}“. Dort auch auf „${neu}“ ändern?\n(Die Anlagen-IDs bleiben unverändert.)`)) {
      [...betroffen, ...betroffenM].forEach((a) => { if (g) a.gebaeude = neu; else a.liegenschaft = neu; a.updated = Date.now(); });
      await db.putMany('anlagen', betroffen);
      await db.putMany('maengel', betroffenM);
      markChanged();
    }
    obj.kuerzel = neu;
    saveObjekte();
    renderObjekte();
  };
  m.onclick = (e) => {
    const t = e.target;
    if (t.id === 'addl') {
      const l = { id: uuid(), kuerzel: nextKuerzel('L', S.objekte.map((x) => x.kuerzel)), name: '',
        gebaeude: [{ id: uuid(), kuerzel: nextKuerzel('B', allG().map((x) => x.kuerzel)), name: '' }] };
      S.objekte.push(l);
      if (!curL()) { S.aktiv = { lid: l.id, gid: l.gebaeude[0].id }; }
      adoptOrphans();
      saveObjekte();
      saveStates();
      bindContext();
      renderObjekte();
      const inp = document.querySelector(`[data-l="${l.id}"] [data-lf="name"]`);
      if (inp) { inp.scrollIntoView({ block: 'center' }); inp.focus(); }
      return;
    }
    if (t.dataset.addg !== undefined) {
      const l = findL(t);
      const g = { id: uuid(), kuerzel: nextKuerzel('B', allG().map((x) => x.kuerzel)), name: '' };
      l.gebaeude.push(g);
      if (S.aktiv.lid === l.id && !S.aktiv.gid) S.aktiv.gid = g.id;
      adoptOrphans();
      saveObjekte();
      saveStates();
      bindContext();
      renderObjekte();
      const inp = document.querySelector(`[data-g="${g.id}"] [data-gf="name"]`);
      if (inp) inp.focus();
      return;
    }
    if (t.dataset.delg !== undefined) {
      const l = findL(t);
      const g = findG(t, l);
      if (!confirm(`Gebäude „${g.kuerzel}“ entfernen?\nErfasste Anlagen bleiben erhalten, die Checkliste dieses Gebäudes wird gelöscht.`)) return;
      l.gebaeude = l.gebaeude.filter((x) => x !== g);
      delete S.checkAll[g.id];
      validateAktiv();
      saveObjekte();
      saveStates();
      bindContext();
      renderObjekte();
      return;
    }
    if (t.dataset.dell !== undefined) {
      const l = findL(t);
      if (!confirm(`Liegenschaft „${l.kuerzel}“ mit allen Gebäuden entfernen?\nErfasste Anlagen bleiben erhalten, Checklisten und Unterlagen dieser Liegenschaft werden gelöscht.`)) return;
      l.gebaeude.forEach((g) => { delete S.checkAll[g.id]; });
      delete S.unterlAll[l.id];
      S.objekte = S.objekte.filter((x) => x !== l);
      validateAktiv();
      saveObjekte();
      saveStates();
      bindContext();
      renderObjekte();
    }
  };
}

// ---------------------------------------------------------------- Start
async function init() {
  $('#back').addEventListener('click', () => {
    const view = (location.hash.replace(/^#\/?/, '') || 'liste').split('/')[0];
    location.hash = view === 'objekte' ? (S.objReturn || '#/liste')
      : (view === 'mangel' || view === 'bericht') ? '#/begehung' : (S.returnTo || '#/liste');
  });
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

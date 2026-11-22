// Einfacher XLSX-Writer/-Reader ohne externe Bibliotheken.
import { makeZip, readZip } from './zip.js';

const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const NS_R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

// Zellformate (Index in cellXfs)
export const STYLE = { NORMAL: 0, HEAD_PFLICHT: 1, HEAD_OPTIONAL: 2, HEAD_KATALOG: 3, DATE: 4, WRAP: 5 };

const esc = (s) => String(s)
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function colName(i) {
  let s = '';
  let n = i + 1;
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function colIndex(letters) {
  let n = 0;
  for (const ch of letters.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

export function isoToSerial(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return null;
  return (Date.UTC(+m[1], +m[2] - 1, +m[3]) - Date.UTC(1899, 11, 30)) / 86400000;
}

export function serialToIso(serial) {
  const d = new Date(Date.UTC(1899, 11, 30) + Math.round(serial) * 86400000);
  return d.toISOString().slice(0, 10);
}

const STYLES_XML = XML_HEAD + `<styleSheet xmlns="${NS}">
<numFmts count="1"><numFmt numFmtId="164" formatCode="DD.MM.YYYY"/></numFmts>
<fonts count="2"><font><sz val="10"/><name val="Arial"/><family val="2"/></font><font><b/><sz val="10"/><name val="Arial"/><family val="2"/></font></fonts>
<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF4B183"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFBDD7EE"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color rgb="FFA6A6A6"/></left><right style="thin"><color rgb="FFA6A6A6"/></right><top style="thin"><color rgb="FFA6A6A6"/></top><bottom style="thin"><color rgb="FFA6A6A6"/></bottom><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="6">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Standard" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

// sheets: [{ name, columns: [{ header, width, headStyle }], rows: [[value]], bodyStyle }]
// value: null | string | number | { date: 'YYYY-MM-DD' }
export async function buildXlsx(sheets) {
  const sst = [];
  const sstIdx = new Map();
  const si = (s) => {
    if (!sstIdx.has(s)) { sstIdx.set(s, sst.length); sst.push(s); }
    return sstIdx.get(s);
  };
  let sstCount = 0;
  const defined = [];

  const sheetXmls = sheets.map((sh, sIdx) => {
    const lastCol = colName(sh.columns.length - 1);
    const lastRow = sh.rows.length + 1;
    const body = sh.bodyStyle || STYLE.NORMAL;
    let xml = XML_HEAD + `<worksheet xmlns="${NS}" xmlns:r="${NS_R}">`;
    xml += `<dimension ref="A1:${lastCol}${lastRow}"/>`;
    xml += `<sheetViews><sheetView workbookViewId="0"${sIdx === 0 ? ' tabSelected="1"' : ''}>`
      + `<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>`
      + `<selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>`;
    xml += '<sheetFormatPr defaultRowHeight="12.75"/><cols>';
    sh.columns.forEach((c, i) => {
      xml += `<col min="${i + 1}" max="${i + 1}" width="${c.width || 14}" customWidth="1"/>`;
    });
    xml += '</cols><sheetData>';
    xml += '<row r="1" ht="30" customHeight="1">';
    sh.columns.forEach((c, i) => {
      sstCount++;
      xml += `<c r="${colName(i)}1" s="${c.headStyle ?? STYLE.HEAD_KATALOG}" t="s"><v>${si(c.header)}</v></c>`;
    });
    xml += '</row>';
    sh.rows.forEach((row, rIdx) => {
      const r = rIdx + 2;
      xml += `<row r="${r}">`;
      row.forEach((v, cIdx) => {
        if (v === null || v === undefined || v === '') return;
        const ref = colName(cIdx) + r;
        if (typeof v === 'object' && v.date) {
          const serial = isoToSerial(v.date);
          if (serial !== null) { xml += `<c r="${ref}" s="${STYLE.DATE}"><v>${serial}</v></c>`; return; }
          v = v.date;
        }
        if (typeof v === 'number' && Number.isFinite(v)) {
          xml += `<c r="${ref}"${body ? ` s="${body}"` : ''}><v>${v}</v></c>`;
        } else {
          sstCount++;
          xml += `<c r="${ref}"${body ? ` s="${body}"` : ''} t="s"><v>${si(String(v))}</v></c>`;
        }
      });
      xml += '</row>';
    });
    xml += '</sheetData>';
    xml += `<autoFilter ref="A1:${lastCol}${lastRow}"/>`;
    xml += '<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>';
    xml += '<pageSetup paperSize="9" orientation="landscape"/>';
    xml += '</worksheet>';
    const quoted = `'${sh.name.replace(/'/g, "''")}'`;
    defined.push(`<definedName name="_xlnm._FilterDatabase" localSheetId="${sIdx}" hidden="1">${esc(quoted)}!$A$1:$${lastCol}$${lastRow}</definedName>`);
    return xml;
  });

  const n = sheets.length;
  const workbook = XML_HEAD + `<workbook xmlns="${NS}" xmlns:r="${NS_R}"><bookViews><workbookView activeTab="0"/></bookViews><sheets>`
    + sheets.map((s, i) => `<sheet name="${esc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')
    + `</sheets><definedNames>${defined.join('')}</definedNames></workbook>`;
  const wbRels = XML_HEAD + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')
    + `<Relationship Id="rId${n + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`
    + `<Relationship Id="rId${n + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>`
    + '</Relationships>';
  const rootRels = XML_HEAD + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
    + '</Relationships>';
  const contentTypes = XML_HEAD + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
    + sheets.map((s, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')
    + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
    + '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
    + '</Types>';
  const sharedStrings = XML_HEAD + `<sst xmlns="${NS}" count="${sstCount}" uniqueCount="${sst.length}">`
    + sst.map((s) => `<si><t xml:space="preserve">${esc(s)}</t></si>`).join('') + '</sst>';

  return makeZip([
    { name: '[Content_Types].xml', data: contentTypes },
    { name: '_rels/.rels', data: rootRels },
    { name: 'xl/workbook.xml', data: workbook },
    { name: 'xl/_rels/workbook.xml.rels', data: wbRels },
    { name: 'xl/styles.xml', data: STYLES_XML },
    { name: 'xl/sharedStrings.xml', data: sharedStrings },
    ...sheetXmls.map((x, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: x })),
  ], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

// Liest ein Tabellenblatt (bevorzugt nach Name) und gibt ein Array von Zeilen (Arrays) zurück.
export async function readXlsxSheet(file, preferredName) {
  const z = await readZip(file);
  const parse = (s) => new DOMParser().parseFromString(s, 'application/xml');
  const wbText = await z.text('xl/workbook.xml');
  if (!wbText) throw new Error('Keine Excel-Datei (.xlsx).');
  const wb = parse(wbText);
  const sheets = [...wb.getElementsByTagNameNS('*', 'sheet')].map((s) => ({
    name: s.getAttribute('name'),
    rid: s.getAttributeNS(NS_R, 'id') || s.getAttribute('r:id'),
  }));
  const rels = parse(await z.text('xl/_rels/workbook.xml.rels'));
  const relMap = {};
  for (const r of rels.getElementsByTagNameNS('*', 'Relationship')) relMap[r.getAttribute('Id')] = r.getAttribute('Target');
  const sh = sheets.find((s) => s.name === preferredName) || sheets[0];
  if (!sh) throw new Error('Kein Tabellenblatt gefunden.');
  let target = relMap[sh.rid] || '';
  target = target.startsWith('/') ? target.slice(1) : 'xl/' + target.replace(/^\.\//, '');

  let sst = [];
  const sstText = await z.text('xl/sharedStrings.xml');
  if (sstText) {
    sst = [...parse(sstText).getElementsByTagNameNS('*', 'si')].map((node) =>
      [...node.getElementsByTagNameNS('*', 't')]
        .filter((t) => t.parentNode.localName !== 'rPh')
        .map((t) => t.textContent).join(''));
  }
  const doc = parse(await z.text(target));
  const rows = [];
  for (const row of doc.getElementsByTagNameNS('*', 'row')) {
    const rIdx = parseInt(row.getAttribute('r'), 10) - 1;
    const out = [];
    for (const c of row.getElementsByTagNameNS('*', 'c')) {
      const ref = c.getAttribute('r');
      const col = ref ? colIndex(ref.replace(/\d+/g, '')) : out.length;
      const t = c.getAttribute('t');
      const vEl = c.getElementsByTagNameNS('*', 'v')[0];
      let v = null;
      if (t === 's') v = vEl ? sst[parseInt(vEl.textContent, 10)] : null;
      else if (t === 'inlineStr') v = [...c.getElementsByTagNameNS('*', 't')].map((x) => x.textContent).join('');
      else if (t === 'str' || t === 'e') v = vEl ? vEl.textContent : null;
      else if (t === 'b') v = vEl ? vEl.textContent === '1' : null;
      else v = vEl ? Number(vEl.textContent) : null;
      out[col] = v;
    }
    rows[Number.isNaN(rIdx) ? rows.length : rIdx] = out;
  }
  return { sheetName: sh.name, rows };
}

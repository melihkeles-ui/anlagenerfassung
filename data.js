// Kataloge und Spaltendefinition – identisch mit der Excel-Erfassungsvorlage.
// Erweiterungen (z. B. neue Anlagenarten) hier eintragen und in sw.js die CACHE-Version erhöhen.

export const COLUMNS = [
 {
  "key": "id",
  "header": "Anlagen-ID",
  "pflicht": true,
  "kind": "id",
  "width": 16,
  "hint": "Text nach Schema, eindeutig",
  "example": "B01-421-001"
 },
 {
  "key": "liegenschaft",
  "header": "Liegenschaft",
  "pflicht": true,
  "kind": "text",
  "width": 14,
  "hint": "Kürzel wie im CAFM",
  "example": "L01"
 },
 {
  "key": "gebaeude",
  "header": "Gebäude",
  "pflicht": true,
  "kind": "text",
  "width": 11,
  "hint": "Kürzel wie im CAFM",
  "example": "B01"
 },
 {
  "key": "geschoss",
  "header": "Geschoss",
  "pflicht": true,
  "kind": "geschoss",
  "width": 10,
  "hint": "Dropdown",
  "example": "UG1"
 },
 {
  "key": "raumNr",
  "header": "Raum-Nr.",
  "pflicht": true,
  "kind": "text",
  "width": 11,
  "hint": "Text, wie im Grundrissplan; Dach/Außen: Pseudo-Raum (z. B. DA-01, AU-01)",
  "example": "U1.03"
 },
 {
  "key": "raumBez",
  "header": "Raumbezeichnung",
  "pflicht": false,
  "kind": "text",
  "width": 20,
  "hint": "Text",
  "example": "Heizraum"
 },
 {
  "key": "gewerk",
  "header": "Gewerk (KG DIN 276)",
  "pflicht": true,
  "kind": "gewerk",
  "width": 32,
  "hint": "Dropdown",
  "example": "421 Wärmeerzeugungsanlagen"
 },
 {
  "key": "anlagenart",
  "header": "Anlagenart",
  "pflicht": true,
  "kind": "anlagenart",
  "width": 30,
  "hint": "Dropdown, gefiltert nach Gewerk",
  "example": "Gaskessel"
 },
 {
  "key": "bezeichnung",
  "header": "Bezeichnung",
  "pflicht": true,
  "kind": "text",
  "width": 28,
  "hint": "Kurzname, eindeutig im Raum",
  "example": "Gas-Brennwertkessel 1"
 },
 {
  "key": "anzahl",
  "header": "Anzahl",
  "pflicht": false,
  "kind": "int",
  "width": 8,
  "hint": "Ganze Zahl; leer = 1; bei Sammelposition Stückzahl",
  "example": "1"
 },
 {
  "key": "hersteller",
  "header": "Hersteller",
  "pflicht": false,
  "kind": "text",
  "width": 16,
  "hint": "Text lt. Typenschild",
  "example": "Muster Heiztechnik"
 },
 {
  "key": "typ",
  "header": "Typ",
  "pflicht": false,
  "kind": "text",
  "width": 16,
  "hint": "Text lt. Typenschild",
  "example": "BWK 120"
 },
 {
  "key": "seriennr",
  "header": "Seriennummer",
  "pflicht": false,
  "kind": "text",
  "width": 16,
  "hint": "Text lt. Typenschild",
  "example": "7712345601"
 },
 {
  "key": "baujahr",
  "header": "Baujahr",
  "pflicht": false,
  "kind": "year",
  "width": 9,
  "hint": "Jahreszahl",
  "example": "2012"
 },
 {
  "key": "kenndaten",
  "header": "Kenndaten",
  "pflicht": false,
  "kind": "text",
  "width": 22,
  "hint": "Wichtigste Kennzahl mit Einheit",
  "example": "120 kW"
 },
 {
  "key": "pruefpflichtig",
  "header": "Prüfpflichtig",
  "pflicht": true,
  "kind": "jnk",
  "width": 11,
  "hint": "ja / nein / klären",
  "example": "ja"
 },
 {
  "key": "wartungspflichtig",
  "header": "Wartungspflichtig",
  "pflicht": true,
  "kind": "jnk",
  "width": 12,
  "hint": "ja / nein / klären",
  "example": "ja"
 },
 {
  "key": "letztePruefung",
  "header": "Letzte Prüfung",
  "pflicht": false,
  "kind": "date",
  "width": 12,
  "hint": "Datum TT.MM.JJJJ",
  "example": "14.03.2026"
 },
 {
  "key": "pruefer",
  "header": "Prüfer / Dienstleister",
  "pflicht": false,
  "kind": "text",
  "width": 20,
  "hint": "Firma oder Stelle",
  "example": "Bezirksschornsteinfeger"
 },
 {
  "key": "wartungsvertrag",
  "header": "Wartungsvertrag",
  "pflicht": false,
  "kind": "jnk",
  "width": 12,
  "hint": "ja / nein / klären",
  "example": "ja"
 },
 {
  "key": "wartungsfirma",
  "header": "Wartungsfirma",
  "pflicht": false,
  "kind": "text",
  "width": 20,
  "hint": "Firma",
  "example": "Muster Haustechnik GmbH"
 },
 {
  "key": "pruefbuch",
  "header": "Prüfbuch vorhanden",
  "pflicht": false,
  "kind": "doku",
  "width": 11,
  "hint": "ja / nein / entfällt",
  "example": "entfällt"
 },
 {
  "key": "anleitung",
  "header": "Anleitung vorhanden",
  "pflicht": false,
  "kind": "doku",
  "width": 11,
  "hint": "ja / nein / entfällt",
  "example": "ja"
 },
 {
  "key": "revisionsplan",
  "header": "Revisionsplan vorhanden",
  "pflicht": false,
  "kind": "doku",
  "width": 12,
  "hint": "ja / nein / entfällt",
  "example": "nein"
 },
 {
  "key": "fotoNr",
  "header": "Foto-Nr.",
  "pflicht": false,
  "kind": "text",
  "width": 16,
  "hint": "Kamera-Nr. oder Dateiname",
  "example": "4711-4713"
 },
 {
  "key": "zustand",
  "header": "Zustand",
  "pflicht": true,
  "kind": "zustand",
  "width": 12,
  "hint": "Dropdown",
  "example": "mittel"
 },
 {
  "key": "maengel",
  "header": "Mängel / Bemerkung",
  "pflicht": false,
  "kind": "text",
  "width": 36,
  "hint": "Kurz und konkret",
  "example": "Korrosion am Abgasrohr (Muffe)"
 },
 {
  "key": "erfasstVon",
  "header": "Erfasst von",
  "pflicht": true,
  "kind": "text",
  "width": 10,
  "hint": "Kürzel",
  "example": "MK"
 },
 {
  "key": "erfasstAm",
  "header": "Erfasst am",
  "pflicht": true,
  "kind": "date",
  "width": 12,
  "hint": "Datum TT.MM.JJJJ",
  "example": "21.11.2026"
 }
];

export const GESCHOSSE = [
 "UG2",
 "UG1",
 "EG",
 "OG1",
 "OG2",
 "OG3",
 "OG4",
 "DG",
 "DA",
 "AU"
];

export const ZUSTAND = [
 "gut",
 "mittel",
 "schlecht",
 "außer Betrieb"
];

export const JNK = [
 "ja",
 "nein",
 "klären"
];

export const DOKU = [
 "ja",
 "nein",
 "entfällt"
];

export const LIEGT_VOR = [
 "ja",
 "nein",
 "teilweise"
];

export const GEWERKE = [
 {
  "name": "334 Außenwandöffnungen",
  "arten": [
   "Kraftbetätigtes Tor",
   "Automatische Tür (außen)",
   "Rolltor / Rollgitter",
   "Fenster motorisch / RWA-Fenster"
  ]
 },
 {
  "name": "338 Lichtschutz zur KG 330",
  "arten": [
   "Sonnenschutz motorisch"
  ]
 },
 {
  "name": "344 Innenwandöffnungen",
  "arten": [
   "Feuerschutztür mit Feststellanlage",
   "Feuerschutztür ohne Feststellanlage",
   "Rauchschutztür",
   "Feuerschutztor",
   "Automatische Innentür"
  ]
 },
 {
  "name": "362 Dachöffnungen",
  "arten": [
   "RWA-Lichtkuppel",
   "Rauchabzugsklappe",
   "Dachausstieg"
  ]
 },
 {
  "name": "369 Sonstiges zur KG 360",
  "arten": [
   "Anschlageinrichtung / Seilsicherung",
   "Steigleiter / Dachleiter"
  ]
 },
 {
  "name": "411 Abwasseranlagen",
  "arten": [
   "Abwasserhebeanlage",
   "Rückstauverschluss",
   "Tauchpumpe / Pumpensumpf",
   "Leichtflüssigkeitsabscheider",
   "Fettabscheider",
   "Dachabläufe / Notentwässerung",
   "Regenwasserzisterne"
  ]
 },
 {
  "name": "412 Wasseranlagen",
  "arten": [
   "Hauswasseranschluss",
   "Wasserzähler",
   "Trinkwasserfilter",
   "Druckminderer",
   "Systemtrenner / Sicherungsarmatur",
   "Druckerhöhungsanlage",
   "Trinkwassererwärmer / Speicher",
   "Zirkulationspumpe",
   "Enthärtungsanlage",
   "Dosieranlage",
   "Durchlauferhitzer / Kleinspeicher",
   "Sanitärobjekte"
  ]
 },
 {
  "name": "413 Gasanlagen",
  "arten": [
   "Gas-Hausanschluss / HAE",
   "Gaszähler",
   "Gasdruckregler",
   "Gasleitungsanlage"
  ]
 },
 {
  "name": "421 Wärmeerzeugungsanlagen",
  "arten": [
   "Gaskessel",
   "Ölkessel",
   "Pelletkessel",
   "Wärmepumpe",
   "Fernwärmeübergabestation",
   "BHKW",
   "Solarthermieanlage",
   "Abgasanlage / Schornstein",
   "Heizöltank"
  ]
 },
 {
  "name": "422 Wärmeverteilnetze",
  "arten": [
   "Heizungsverteiler",
   "Umwälzpumpe",
   "Ausdehnungsgefäß",
   "Druckhaltestation",
   "Nachspeiseeinrichtung",
   "Heizungswasseraufbereitung",
   "Pufferspeicher",
   "Wärmemengenzähler"
  ]
 },
 {
  "name": "423 Raumheizflächen",
  "arten": [
   "Heizkörper",
   "Heizkreisverteiler Fußbodenheizung",
   "Unterflurkonvektor"
  ]
 },
 {
  "name": "424 Verkehrsheizflächen",
  "arten": [
   "Rampenheizung / Freiflächenheizung",
   "Dachrinnenheizung"
  ]
 },
 {
  "name": "431 Lüftungsanlagen",
  "arten": [
   "Lüftungsgerät (RLT)",
   "Ventilator Zu-/Abluft",
   "Dachventilator",
   "Brandschutzklappe",
   "Entrauchungsventilator",
   "Druckbelüftungsanlage (RDA)",
   "TG-Lüftung",
   "Einzelraumlüfter",
   "Küchenabluft"
  ]
 },
 {
  "name": "432 Teilklimaanlagen",
  "arten": [
   "Teilklimagerät"
  ]
 },
 {
  "name": "433 Klimaanlagen",
  "arten": [
   "Klimagerät (RLT mit Kühlung/Befeuchtung)",
   "Befeuchter"
  ]
 },
 {
  "name": "434 Kälteanlagen",
  "arten": [
   "Kaltwassersatz / Kältemaschine",
   "Rückkühler",
   "Verdunstungskühlanlage",
   "Split-Klimagerät",
   "VRF- / Multisplit-Anlage",
   "Klimaschrank Serverraum",
   "Kühlzelle"
  ]
 },
 {
  "name": "441 Hoch- und Mittelspannungsanlagen",
  "arten": [
   "Mittelspannungsschaltanlage",
   "Transformator"
  ]
 },
 {
  "name": "442 Eigenstromversorgungsanlagen",
  "arten": [
   "Netzersatzanlage",
   "USV-Anlage",
   "Zentralbatterieanlage Sicherheitsbeleuchtung",
   "PV-Anlage",
   "Wechselrichter",
   "Batteriespeicher"
  ]
 },
 {
  "name": "443 Niederspannungsschaltanlagen",
  "arten": [
   "Hausanschlusskasten",
   "Zählerschrank",
   "Niederspannungshauptverteilung (NSHV)",
   "Unterverteilung",
   "Blindleistungskompensation"
  ]
 },
 {
  "name": "444 Niederspannungsinstallationsanlagen",
  "arten": [
   "Elektroinstallation",
   "Ladestation E-Mobilität"
  ]
 },
 {
  "name": "445 Beleuchtungsanlagen",
  "arten": [
   "Allgemeinbeleuchtung",
   "Sicherheitsleuchte (Einzelbatterie)",
   "Rettungszeichenleuchte",
   "Außenbeleuchtung",
   "Lichtsteuerung"
  ]
 },
 {
  "name": "446 Blitzschutz- und Erdungsanlagen",
  "arten": [
   "Blitzschutzanlage",
   "Erdungsanlage / Potentialausgleich",
   "Überspannungsschutz"
  ]
 },
 {
  "name": "451 Telekommunikationsanlagen",
  "arten": [
   "TK-Anlage",
   "Hausübergabepunkt (APL / Glasfaser)"
  ]
 },
 {
  "name": "452 Such- und Signalanlagen",
  "arten": [
   "Notrufanlage WC",
   "Klingel- / Sprechanlage"
  ]
 },
 {
  "name": "453 Zeitdienstanlagen",
  "arten": [
   "Uhrenanlage"
  ]
 },
 {
  "name": "454 Elektroakustische Anlagen",
  "arten": [
   "ELA-Anlage",
   "Sprachalarmanlage (SAA)"
  ]
 },
 {
  "name": "455 Audiovisuelle Medien- und Antennenanlagen",
  "arten": [
   "Antennen- / SAT-Anlage",
   "Medientechnik"
  ]
 },
 {
  "name": "456 Gefahrenmelde- und Alarmanlagen",
  "arten": [
   "Brandmelderzentrale (BMZ)",
   "Brandmelder",
   "Handfeuermelder",
   "Feuerwehrbedienfeld / FSD",
   "RWA-Zentrale",
   "CO-Warnanlage",
   "Gaswarnanlage",
   "Einbruchmeldeanlage",
   "Zutrittskontrolle",
   "Videoüberwachung"
  ]
 },
 {
  "name": "457 Datenübertragungsnetze",
  "arten": [
   "Netzwerkverteiler / Serverschrank",
   "WLAN-Access-Point"
  ]
 },
 {
  "name": "461 Aufzugsanlagen",
  "arten": [
   "Personenaufzug",
   "Lastenaufzug",
   "Kleingüteraufzug",
   "Feuerwehraufzug",
   "Plattformlift",
   "Treppenlift"
  ]
 },
 {
  "name": "462 Fahrtreppen, Fahrsteige",
  "arten": [
   "Fahrtreppe",
   "Fahrsteig"
  ]
 },
 {
  "name": "463 Befahranlagen",
  "arten": [
   "Fassadenbefahranlage"
  ]
 },
 {
  "name": "465 Krananlagen",
  "arten": [
   "Kran / Hebezeug"
  ]
 },
 {
  "name": "471 Küchentechnische Anlagen",
  "arten": [
   "Küchengeräte Teeküche",
   "Großküchengerät"
  ]
 },
 {
  "name": "474 Feuerlöschanlagen",
  "arten": [
   "Feuerlöscher",
   "Wandhydrant",
   "Steigleitung trocken",
   "Steigleitung nass",
   "Sprinklerzentrale",
   "Gaslöschanlage",
   "Löschwasser-Druckerhöhungsanlage",
   "Löschwasserbehälter"
  ]
 },
 {
  "name": "481 Automationseinrichtungen",
  "arten": [
   "Automationsstation (DDC)",
   "Einzelraumregler",
   "Zählerfernauslesung"
  ]
 },
 {
  "name": "482 Schaltschränke, Automationsschwerpunkte",
  "arten": [
   "Schaltschrank MSR / ISP"
  ]
 },
 {
  "name": "483 Automationsmanagement",
  "arten": [
   "GLT-Leitrechner / Managementsystem"
  ]
 }
];

export const CHECKLISTE = [
 {
  "bereich": "Heizraum / Hausanschluss",
  "items": [
   {
    "anlage": "Wärmeerzeuger (Gas-/Öl-/Pelletkessel)",
    "kg": "421",
    "erfassung": "einzeln",
    "hinweis": "Schornsteinfeger (KÜO, 1. BImSchV); Wartung jährl. (Herstellerangabe)"
   },
   {
    "anlage": "Wärmepumpe / Fernwärmeübergabestation / BHKW",
    "kg": "421",
    "erfassung": "einzeln",
    "hinweis": "WP: F-Gase-VO je nach Kältemittelmenge; FW: TAB des Versorgers; Wartung jährl."
   },
   {
    "anlage": "Abgasanlage / Schornstein",
    "kg": "421",
    "erfassung": "einzeln",
    "hinweis": "Schornsteinfeger (KÜO)"
   },
   {
    "anlage": "Heizöltank / Brennstofflager",
    "kg": "421",
    "erfassung": "einzeln",
    "hinweis": "AwSV: Prüfpflicht je nach Gefährdungsstufe und Lage"
   },
   {
    "anlage": "Heizungsverteiler",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "Umwälzpumpen (Heizung)",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "Ausdehnungsgefäß / Druckhaltung",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV: Prüfpflicht je nach Druck x Volumen; Vordruck jährl. prüfen"
   },
   {
    "anlage": "Heizungswasseraufbereitung / Nachspeisung",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "VDI 2035"
   },
   {
    "anlage": "Pufferspeicher",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": ""
   },
   {
    "anlage": "Wärmemengenzähler",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "Eichfrist 5 Jahre"
   },
   {
    "anlage": "Trinkwassererwärmer / Speicher",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "TrinkwV § 31: Legionellen-Untersuchung bei Großanlage mit Duschen (gewerblich alle 3 J.)"
   },
   {
    "anlage": "Zirkulationspumpe",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": ""
   },
   {
    "anlage": "Hauswasseranschluss, Wasserzähler",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "Eichfrist Unterzähler: Kaltwasser 6 J., Warmwasser 5 J."
   },
   {
    "anlage": "Trinkwasserfilter, Druckminderer",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 806-5 (Filter ½-jährl., Druckminderer jährl.)"
   },
   {
    "anlage": "Systemtrenner / Sicherungsarmaturen",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 806-5 / DIN EN 1717"
   },
   {
    "anlage": "Druckerhöhungsanlage, Enthärtung, Dosierung",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 806-5, Herstellerangabe"
   },
   {
    "anlage": "Gas-Hausanschluss / HAE / Gaszähler / Gasdruckregler",
    "kg": "413",
    "erfassung": "einzeln",
    "hinweis": "DVGW G 600 (TRGI): Gebrauchsfähigkeitsprüfung i. d. R. alle 12 J."
   },
   {
    "anlage": "Abwasserhebeanlage",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 12056-4: Wartung gewerblich ¼-jährl."
   },
   {
    "anlage": "Rückstauverschluss",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN 1986-3: Inspektion monatl. (Betreiber), Wartung ½-jährl."
   },
   {
    "anlage": "Gaswarnanlage (falls vorhanden)",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "Funktionsprüfung / Kalibrierung nach Herstellerangabe"
   },
   {
    "anlage": "Feuerlöscher",
    "kg": "474",
    "erfassung": "Sammel je Raum/Geschoss",
    "hinweis": "ASR A2.2: alle 2 Jahre"
   }
  ]
 },
 {
  "bereich": "Elektroverteilung (HAR / NSHV / UV)",
  "items": [
   {
    "anlage": "Hausanschlusskasten / Zählerschrank",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (ortsfest, Frist nach GBU, i. d. R. 4 J.)"
   },
   {
    "anlage": "Mittelspannungsanlage / Transformator (falls vorhanden)",
    "kg": "441",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3; Schaltberechtigung beachten"
   },
   {
    "anlage": "Niederspannungshauptverteilung (NSHV)",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (i. d. R. 4 J.)"
   },
   {
    "anlage": "Unterverteilungen (jede UV)",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (i. d. R. 4 J.)"
   },
   {
    "anlage": "Blindleistungskompensation",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "Haupterdungsschiene / Überspannungsschutz",
    "kg": "446",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 / DIN EN 62305"
   },
   {
    "anlage": "USV-Anlage",
    "kg": "442",
    "erfassung": "einzeln",
    "hinweis": "Wartung jährl., Batterietausch nach Herstellerangabe"
   },
   {
    "anlage": "Netzersatzanlage (Notstrom)",
    "kg": "442",
    "erfassung": "einzeln",
    "hinweis": "monatl. Probelauf, jährl. Wartung"
   },
   {
    "anlage": "Zentralbatterie Sicherheitsbeleuchtung",
    "kg": "442",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 50172 / DIN VDE V 0108-100-1: Funktionstests, jährl. Prüfung"
   },
   {
    "anlage": "PV-Wechselrichter / Batteriespeicher",
    "kg": "442",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3, DIN EN 62446"
   },
   {
    "anlage": "Hausübergabepunkt Telekom / Glasfaser",
    "kg": "451",
    "erfassung": "einzeln",
    "hinweis": ""
   },
   {
    "anlage": "Netzwerkverteiler / Serverschrank",
    "kg": "457",
    "erfassung": "einzeln",
    "hinweis": ""
   },
   {
    "anlage": "Feuerlöscher (CO2)",
    "kg": "474",
    "erfassung": "Sammel je Raum",
    "hinweis": "ASR A2.2: alle 2 Jahre"
   }
  ]
 },
 {
  "bereich": "Lüftungszentrale",
  "items": [
   {
    "anlage": "RLT-Zentralgerät (Lüftung / Klima)",
    "kg": "431 / 433",
    "erfassung": "einzeln",
    "hinweis": "VDI 6022: Hygieneinspektion alle 3 J. (mit Befeuchtung 2 J.); GEG: energet. Inspektion (Schwellenwert prüfen)"
   },
   {
    "anlage": "Ventilatoren Zu-/Abluft (separat)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "Brandschutzklappen",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 15650 / Zulassung: ½-jährl., nach 2 mängelfreien Prüfungen jährl."
   },
   {
    "anlage": "Entrauchungsanlage / Druckbelüftung (RDA)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)"
   },
   {
    "anlage": "Kältemaschine / Kaltwassersatz",
    "kg": "434",
    "erfassung": "einzeln",
    "hinweis": "F-Gase-VO (EU) 2024/573: Dichtheitskontrolle ab 5 t CO2-Äq.; BetrSichV"
   },
   {
    "anlage": "Rückkühler / Verdunstungskühlanlage",
    "kg": "434",
    "erfassung": "einzeln",
    "hinweis": "42. BImSchV bei Verdunstungskühlung (Anzeige, Laboruntersuchungen)"
   },
   {
    "anlage": "Pumpen Kalt-/Heizwasser",
    "kg": "422 / 434",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "MSR-Schaltschrank / Automationsstation",
    "kg": "482 / 481",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "Feuerlöscher",
    "kg": "474",
    "erfassung": "Sammel je Raum",
    "hinweis": "ASR A2.2: alle 2 Jahre"
   }
  ]
 },
 {
  "bereich": "Aufzug",
  "items": [
   {
    "anlage": "Personenaufzug (jeder Aufzug)",
    "kg": "461",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV: Hauptprüfung alle 2 J., Zwischenprüfung dazwischen (ZÜS)"
   },
   {
    "anlage": "Notrufsystem Aufzug",
    "kg": "461",
    "erfassung": "Teil des Aufzugs (Bemerkung)",
    "hinweis": "BetrSichV: Notruf muss ständig erreichbar sein"
   },
   {
    "anlage": "Triebwerksraum / Schachtkopf: Steuerung, Schachtentrauchung",
    "kg": "461",
    "erfassung": "Teil des Aufzugs",
    "hinweis": ""
   },
   {
    "anlage": "Lastenaufzug / Kleingüteraufzug",
    "kg": "461",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV (ZÜS)"
   },
   {
    "anlage": "Plattformlift / Treppenlift",
    "kg": "461",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV / Herstellerangabe (Einstufung prüfen)"
   },
   {
    "anlage": "Feuerwehraufzug (falls vorhanden)",
    "kg": "461",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV + Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)"
   }
  ]
 },
 {
  "bereich": "Dach",
  "items": [
   {
    "anlage": "Blitzschutzanlage (Fangeinrichtung, Ableitungen)",
    "kg": "446",
    "erfassung": "einzeln (1 je Gebäude)",
    "hinweis": "DIN EN 62305-3 Bbl. 3: z. B. LPS III/IV umfassend alle 4 J."
   },
   {
    "anlage": "Anschlageinrichtungen / Seilsicherung",
    "kg": "369",
    "erfassung": "Sammel je Dachfläche",
    "hinweis": "DIN EN 795: i. d. R. jährl. durch Sachkundigen"
   },
   {
    "anlage": "Dachausstieg / Steigleiter",
    "kg": "362 / 369",
    "erfassung": "einzeln",
    "hinweis": "Prüfung nach GBU"
   },
   {
    "anlage": "RWA-Lichtkuppeln / Rauchabzugsklappen",
    "kg": "362",
    "erfassung": "Sammel je RWA-Gruppe",
    "hinweis": "Wartung jährl. (DIN 18232-2 / Herstellerangabe); Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)"
   },
   {
    "anlage": "PV-Anlage (Module)",
    "kg": "442",
    "erfassung": "Sammel (1 je Anlage)",
    "hinweis": "DIN EN 62446, DGUV V3"
   },
   {
    "anlage": "Dachventilatoren",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "Rückkühler / Split-Außengeräte",
    "kg": "434",
    "erfassung": "einzeln",
    "hinweis": "F-Gase-VO je nach Kältemittelmenge"
   },
   {
    "anlage": "Antennen / SAT-Anlage",
    "kg": "455",
    "erfassung": "einzeln",
    "hinweis": ""
   },
   {
    "anlage": "Dachabläufe / Notentwässerung",
    "kg": "411",
    "erfassung": "Sammel je Dachfläche",
    "hinweis": "Inspektion ½-jährl. empfohlen"
   },
   {
    "anlage": "Fassadenbefahranlage (falls vorhanden)",
    "kg": "463",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV: jährl. Prüfung durch befähigte Person"
   }
  ]
 },
 {
  "bereich": "Treppenhäuser",
  "items": [
   {
    "anlage": "Feuer-/Rauchschutztüren mit Feststellanlage",
    "kg": "344",
    "erfassung": "einzeln",
    "hinweis": "DIN 14677: monatl. Betreiber, jährl. Fachkraft"
   },
   {
    "anlage": "Feuer-/Rauchschutztüren ohne Feststellanlage",
    "kg": "344",
    "erfassung": "Sammel je Treppenhaus",
    "hinweis": "Funktionskontrolle, Wartung nach Herstellerangabe"
   },
   {
    "anlage": "RWA-Öffnung + Lüftungs-/RWA-Taster",
    "kg": "362 / 334",
    "erfassung": "einzeln (je Treppenhaus)",
    "hinweis": "Wartung jährl.; Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)"
   },
   {
    "anlage": "RWA-Zentrale",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "Wartung jährl. nach Herstellerangabe"
   },
   {
    "anlage": "Druckbelüftungsanlage (RDA, falls vorhanden)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)"
   },
   {
    "anlage": "Sicherheits- / Rettungszeichenleuchten",
    "kg": "445",
    "erfassung": "Sammel je Treppenhaus",
    "hinweis": "DIN EN 50172: Funktionstests, jährl. Prüfung"
   },
   {
    "anlage": "Handfeuermelder / Rauchmelder (BMA)",
    "kg": "456",
    "erfassung": "Sammel je Meldergruppe",
    "hinweis": "DIN VDE 0833-2: Inspektion ¼-jährl., Wartung jährl."
   },
   {
    "anlage": "Feuerlöscher",
    "kg": "474",
    "erfassung": "Sammel je Treppenhaus",
    "hinweis": "ASR A2.2: alle 2 Jahre"
   },
   {
    "anlage": "Wandhydranten",
    "kg": "474",
    "erfassung": "Sammel je Treppenhaus",
    "hinweis": "DIN EN 671-3 / DIN 14462: jährl. Instandhaltung"
   },
   {
    "anlage": "Steigleitung trocken / nass",
    "kg": "474",
    "erfassung": "einzeln (je Steigleitung)",
    "hinweis": "DIN 14462: wiederkehrende Prüfung"
   }
  ]
 },
 {
  "bereich": "Geschosse (Büros, Flure, WC, Teeküchen)",
  "items": [
   {
    "anlage": "Unterverteilung Etage",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (i. d. R. 4 J.)"
   },
   {
    "anlage": "Heizkörper / Heizkreisverteiler",
    "kg": "423",
    "erfassung": "Sammel je Geschoss",
    "hinweis": ""
   },
   {
    "anlage": "Allgemeinbeleuchtung",
    "kg": "445",
    "erfassung": "Sammel je Geschoss",
    "hinweis": ""
   },
   {
    "anlage": "Sicherheits- / Rettungszeichenleuchten",
    "kg": "445",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "DIN EN 50172: Funktionstests, jährl. Prüfung"
   },
   {
    "anlage": "Brandmelderzentrale / Feuerwehrbedienfeld (meist EG)",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "DIN VDE 0833-1/-2, DIN 14675: Inspektion ¼-jährl., Wartung jährl."
   },
   {
    "anlage": "Brandmelder / Handfeuermelder",
    "kg": "456",
    "erfassung": "Sammel je Meldergruppe",
    "hinweis": "DIN VDE 0833-2"
   },
   {
    "anlage": "Feuerlöscher",
    "kg": "474",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "ASR A2.2: alle 2 Jahre"
   },
   {
    "anlage": "Wandhydranten",
    "kg": "474",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "DIN EN 671-3 / DIN 14462: jährl."
   },
   {
    "anlage": "Brandschutztüren mit Feststellanlage (Flur)",
    "kg": "344",
    "erfassung": "einzeln",
    "hinweis": "DIN 14677: monatl. Betreiber, jährl. Fachkraft"
   },
   {
    "anlage": "Brandschutztüren ohne Feststellanlage",
    "kg": "344",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "Funktionskontrolle"
   },
   {
    "anlage": "Brandschutzklappen (Schächte, Decken)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "½-jährl., nach 2 mängelfreien Prüfungen jährl."
   },
   {
    "anlage": "Automatische Türen",
    "kg": "344 / 334",
    "erfassung": "einzeln",
    "hinweis": "ASR A1.7: jährl. Sachkundiger"
   },
   {
    "anlage": "Teeküche: Geräte, Durchlauferhitzer, Kleinspeicher",
    "kg": "471 / 412",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "DGUV V3 ortsveränderlich (Frist nach GBU)"
   },
   {
    "anlage": "Notrufanlage barrierefreies WC",
    "kg": "452",
    "erfassung": "einzeln",
    "hinweis": "DIN VDE 0834: wiederkehrende Prüfung"
   },
   {
    "anlage": "Split-Innengeräte / Raumklimageräte",
    "kg": "434",
    "erfassung": "Sammel je Anlage",
    "hinweis": "F-Gase über Außengerät"
   },
   {
    "anlage": "Einzelraumregler / Raumautomation",
    "kg": "481",
    "erfassung": "Sammel je Geschoss",
    "hinweis": ""
   },
   {
    "anlage": "Einzelraumlüfter WC",
    "kg": "431",
    "erfassung": "Sammel je Geschoss",
    "hinweis": ""
   },
   {
    "anlage": "Etagenverteiler Netzwerk / WLAN-Access-Points",
    "kg": "457",
    "erfassung": "Verteiler einzeln, APs Sammel",
    "hinweis": ""
   },
   {
    "anlage": "Einbruchmeldeanlage / Zutrittskontrolle (Zentrale)",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "DIN VDE 0833-3 (EMA)"
   },
   {
    "anlage": "Serverraum: Klimagerät, USV, Löschanlage",
    "kg": "434 / 442 / 474",
    "erfassung": "einzeln",
    "hinweis": "Gaslöschanlage: Prüfung lt. Genehmigung / Versicherer"
   }
  ]
 },
 {
  "bereich": "Tiefgarage",
  "items": [
   {
    "anlage": "Einfahrtstor / Rolltor (kraftbetätigt)",
    "kg": "334",
    "erfassung": "einzeln",
    "hinweis": "ASR A1.7: jährl. Sachkundiger"
   },
   {
    "anlage": "Schranke / Ampel / Zufahrtskontrolle",
    "kg": "–",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "TG-Lüftung (Ventilatoren)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Prüfung lt. Baugenehmigung / GaVO BW"
   },
   {
    "anlage": "CO-Warnanlage",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "Prüfung lt. Baugenehmigung / GaVO BW; Sensoren nach Herstellerangabe"
   },
   {
    "anlage": "Sicherheitsbeleuchtung TG",
    "kg": "445",
    "erfassung": "Sammel",
    "hinweis": "DIN EN 50172"
   },
   {
    "anlage": "Leichtflüssigkeitsabscheider",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN 1999-100: Wartung ½-jährl., Generalinspektion alle 5 J."
   },
   {
    "anlage": "Pumpensumpf / Tauchpumpe",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "Rampenheizung",
    "kg": "424",
    "erfassung": "einzeln",
    "hinweis": ""
   },
   {
    "anlage": "Sprinklerzentrale (falls vorhanden)",
    "kg": "474",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 12845 / VdS CEA 4001: wöchentl. Betreiberkontrolle; Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)"
   },
   {
    "anlage": "Brandschutztüren / -tore TG",
    "kg": "344",
    "erfassung": "mit FSA einzeln, sonst Sammel",
    "hinweis": "DIN 14677 (bei Feststellanlage)"
   },
   {
    "anlage": "Feuerlöscher / Wandhydranten",
    "kg": "474",
    "erfassung": "Sammel",
    "hinweis": "ASR A2.2 / DIN 14462"
   },
   {
    "anlage": "Ladestationen E-Mobilität",
    "kg": "444",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (Frist nach GBU)"
   },
   {
    "anlage": "Brandmelder TG (falls vorhanden)",
    "kg": "456",
    "erfassung": "Sammel je Meldergruppe",
    "hinweis": "DIN VDE 0833-2"
   }
  ]
 },
 {
  "bereich": "Außenanlagen",
  "items": [
   {
    "anlage": "Außenbeleuchtung",
    "kg": "445",
    "erfassung": "Sammel",
    "hinweis": ""
   },
   {
    "anlage": "Hebeanlage / Pumpwerk außen",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 12056-4"
   },
   {
    "anlage": "Fettabscheider (falls Küche)",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN 4040-100: Generalinspektion alle 5 J."
   },
   {
    "anlage": "Regenwasserzisterne / Versickerung",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe"
   },
   {
    "anlage": "Hausanschlussschächte / Gasdruckregler außen",
    "kg": "413",
    "erfassung": "einzeln",
    "hinweis": "DVGW G 600"
   },
   {
    "anlage": "Tore / Schranken (kraftbetätigt)",
    "kg": "334 / –",
    "erfassung": "einzeln",
    "hinweis": "ASR A1.7: jährl. Sachkundiger"
   },
   {
    "anlage": "Ladesäulen außen",
    "kg": "444",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3"
   },
   {
    "anlage": "Feuerwehrschlüsseldepot / Freischaltelement / Blitzleuchte",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "Teil der BMA (DIN 14675)"
   },
   {
    "anlage": "Löschwasserbehälter / Hydranten auf dem Grundstück",
    "kg": "474",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Vorgabe Feuerwehr / Versorger"
   },
   {
    "anlage": "Videoüberwachung",
    "kg": "456",
    "erfassung": "Rekorder einzeln, Kameras Sammel",
    "hinweis": ""
   }
  ]
 }
];

export const UNTERLAGEN = [
 {
  "kat": "Baurecht & Brandschutz",
  "unterlage": "Baugenehmigung inkl. Nebenbestimmungen / Auflagen",
  "wofuer": "Prüfpflichten sicherheitstechnischer Anlagen (in BW v. a. aus Genehmigung, Brandschutzkonzept, Sonderbauvorschriften)",
  "quelle": "Eigentümer / Baurechtsamt"
 },
 {
  "kat": "Baurecht & Brandschutz",
  "unterlage": "Brandschutzkonzept / Brandschutznachweis",
  "wofuer": "Welche Brandschutzanlagen gefordert sind",
  "quelle": "Eigentümer / Planer"
 },
 {
  "kat": "Baurecht & Brandschutz",
  "unterlage": "Prüfberichte Sachverständige (Erstprüfung + letzte Wiederholungsprüfung)",
  "wofuer": "Anlagenbestand, Fristen, offene Mängel",
  "quelle": "Vorbetreiber / Verwaltung"
 },
 {
  "kat": "Baurecht & Brandschutz",
  "unterlage": "Feuerwehrpläne (DIN 14095), Flucht- und Rettungspläne",
  "wofuer": "Lage von Brandschutzeinrichtungen",
  "quelle": "Verwaltung / Brandschutzbeauftragter"
 },
 {
  "kat": "Baurecht & Brandschutz",
  "unterlage": "Offene Mängellisten / behördliche Auflagen",
  "wofuer": "Nacharbeit, Priorisierung",
  "quelle": "Verwaltung"
 },
 {
  "kat": "Pläne",
  "unterlage": "Grundrisspläne mit Raumnummern (aktueller Stand)",
  "wofuer": "Raum-Nr. für die Erfassung; Raumnummern vorab festlegen",
  "quelle": "Eigentümer / CAFM"
 },
 {
  "kat": "Pläne",
  "unterlage": "Revisions-/Bestandspläne TGA (Strangschemata)",
  "wofuer": "Anlagen finden, Zuordnung",
  "quelle": "Planer / Errichter"
 },
 {
  "kat": "Pläne",
  "unterlage": "Anlagenschemata Heizung / Lüftung / Kälte",
  "wofuer": "Komponenten vollständig erfassen",
  "quelle": "Errichter / Wartungsfirma"
 },
 {
  "kat": "Pläne",
  "unterlage": "Elektro: Übersichtsschaltplan NSHV / UV",
  "wofuer": "Alle Verteilungen erfassen",
  "quelle": "Errichter"
 },
 {
  "kat": "Pläne",
  "unterlage": "BMA: Meldergruppenverzeichnis / Laufkarten",
  "wofuer": "Sammelpositionen je Meldergruppe",
  "quelle": "Errichter BMA"
 },
 {
  "kat": "Pläne",
  "unterlage": "GLT: Datenpunkt- / Anlagenliste",
  "wofuer": "Abgleich Anlagenbestand",
  "quelle": "GLT-Errichter"
 },
 {
  "kat": "Prüfungen & Nachweise",
  "unterlage": "Prüfbücher (Aufzug, BMA, RWA, Sicherheitsbeleuchtung, Feststellanlagen)",
  "wofuer": "Spalte 'Prüfbuch vorhanden', letzte Prüfung",
  "quelle": "vor Ort / Dienstleister"
 },
 {
  "kat": "Prüfungen & Nachweise",
  "unterlage": "Wartungsprotokolle der letzten 2 Jahre (alle Gewerke)",
  "wofuer": "Letzte Prüfung, Dienstleister, Mängel",
  "quelle": "Dienstleister"
 },
 {
  "kat": "Prüfungen & Nachweise",
  "unterlage": "DGUV V3-Prüfprotokolle ortsfeste Anlagen",
  "wofuer": "Verteilungen, Fristen",
  "quelle": "Elektrofachbetrieb"
 },
 {
  "kat": "Prüfungen & Nachweise",
  "unterlage": "Blitzschutz-Prüfbericht",
  "wofuer": "Schutzklasse, Frist",
  "quelle": "Elektrofachbetrieb"
 },
 {
  "kat": "Prüfungen & Nachweise",
  "unterlage": "Schornsteinfeger: Feuerstättenbescheid, Messprotokolle",
  "wofuer": "Feuerstätten vollständig",
  "quelle": "Bezirksschornsteinfeger"
 },
 {
  "kat": "Prüfungen & Nachweise",
  "unterlage": "Trinkwasser: Legionellenbefunde, Gefährdungsanalyse",
  "wofuer": "Großanlage ja/nein, Probenahmestellen",
  "quelle": "Labor / Verwaltung"
 },
 {
  "kat": "Prüfungen & Nachweise",
  "unterlage": "RLT: Hygieneinspektionen VDI 6022",
  "wofuer": "Anlagenliste RLT",
  "quelle": "Wartungsfirma"
 },
 {
  "kat": "Prüfungen & Nachweise",
  "unterlage": "Kälteanlagen: Logbuch / Dichtheitskontrollen F-Gase",
  "wofuer": "Kältemittel, Füllmenge",
  "quelle": "Kältefachbetrieb"
 },
 {
  "kat": "Prüfungen & Nachweise",
  "unterlage": "Abscheider: Wartung / Generalinspektion",
  "wofuer": "Abscheider vollständig",
  "quelle": "Entsorger / Fachbetrieb"
 },
 {
  "kat": "Verträge & Organisation",
  "unterlage": "Wartungs- und Prüfverträge inkl. Anlagenlisten",
  "wofuer": "Vorbefüllung der Anlagenliste, Spalte 'Wartungsvertrag'",
  "quelle": "Verwaltung / Einkauf"
 },
 {
  "kat": "Verträge & Organisation",
  "unterlage": "Dienstleister- und Notdienstliste",
  "wofuer": "Spalten 'Prüfer' / 'Wartungsfirma'",
  "quelle": "Verwaltung"
 },
 {
  "kat": "Verträge & Organisation",
  "unterlage": "Pflichtenübertragung / Betreiberorganisation",
  "wofuer": "Wer ist wofür verantwortlich",
  "quelle": "Eigentümer / Betreiber"
 },
 {
  "kat": "Verträge & Organisation",
  "unterlage": "Schlüssel / Zutritt Technikräume und Dach, Begleitung Haustechnik",
  "wofuer": "Begehung ohne Wartezeiten",
  "quelle": "Haustechnik"
 },
 {
  "kat": "Anlagendokumentation",
  "unterlage": "Bedienungs-, Wartungs- und Betriebsanleitungen",
  "wofuer": "Spalte 'Anleitung vorhanden'",
  "quelle": "vor Ort / Errichter"
 },
 {
  "kat": "Anlagendokumentation",
  "unterlage": "Abnahme- und Inbetriebnahmeprotokolle",
  "wofuer": "Baujahr, Kenndaten",
  "quelle": "Errichter / Planer"
 },
 {
  "kat": "Anlagendokumentation",
  "unterlage": "Vorhandene Anlagen-/Inventarlisten (Altdaten, Excel, altes CAFM)",
  "wofuer": "Vorbefüllung, Abgleich",
  "quelle": "Verwaltung"
 },
 {
  "kat": "Anlagendokumentation",
  "unterlage": "Zählerliste Strom / Gas / Wasser / Wärme",
  "wofuer": "Zähler vollständig, Eichfristen",
  "quelle": "Verwaltung / Versorger"
 },
 {
  "kat": "Arbeitsschutz",
  "unterlage": "Gefährdungsbeurteilungen (Anlagenbetrieb, Arbeiten auf dem Dach)",
  "wofuer": "Prüffristen nach GBU, sichere Begehung",
  "quelle": "Betreiber / Fachkraft für Arbeitssicherheit"
 },
 {
  "kat": "Arbeitsschutz",
  "unterlage": "Explosionsschutzdokument (falls zutreffend)",
  "wofuer": "Ex-Bereiche kennen",
  "quelle": "Betreiber"
 },
 {
  "kat": "CAFM",
  "unterlage": "CAFM-Importvorlage und Stammdatenkataloge (Liegenschaft, Gebäude, Geschoss, Raum, Anlagenklassen)",
  "wofuer": "Spalten und Kataloge der Vorlage angleichen",
  "quelle": "CAFM-Administrator"
 }
];

export const GEWERK_GRUPPEN = {
  '33': '330 Außenwände', '34': '340 Innenwände', '36': '360 Dächer',
  '41': '410 Abwasser-, Wasser-, Gasanlagen', '42': '420 Wärmeversorgungsanlagen',
  '43': '430 Raumlufttechnische Anlagen', '44': '440 Elektrische Anlagen',
  '45': '450 Kommunikations-, sicherheits- und informationstechnische Anlagen',
  '46': '460 Förderanlagen', '47': '470 Nutzungsspezifische und verfahrenstechnische Anlagen',
  '48': '480 Gebäude- und Anlagenautomation'
};

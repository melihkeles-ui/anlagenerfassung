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
  "rundgang": "An der Wand anfangen, an der die Leitungen von außen ins Haus kommen (Wasser, Gas, Strom, Telekom). Erst dem Trinkwasser folgen: Zähler → Filter → Druckminderer → Verteiler → Warmwasser. Dann der Heizung: Kessel → Verteiler → Pumpen → Ausdehnungsgefäß → Nachfüllung mit Systemtrenner. Zum Schluss auf den Boden schauen: Hebeanlage, Rückstauverschlüsse.",
  "items": [
   {
    "anlage": "Wärmeerzeuger (Gas-/Öl-/Pelletkessel)",
    "kg": "421",
    "erfassung": "einzeln",
    "hinweis": "Schornsteinfeger (KÜO, 1. BImSchV); Wartung jährl. (Herstellerangabe)",
    "erkennen": "Großes Gerät mit Verkleidung (weiß, grau oder rot), vorn Bedienfeld/Display, oben oder hinten dicke Heizungsrohre und ein Abgasrohr zum Schornstein.",
    "wo": "Heizraum, meist direkt am Schornstein bzw. Abgasschacht.",
    "suche": "Gas Brennwertkessel Heizraum"
   },
   {
    "anlage": "Wärmepumpe / Fernwärmeübergabestation / BHKW",
    "kg": "421",
    "erfassung": "einzeln",
    "hinweis": "WP: F-Gase-VO je nach Kältemittelmenge; FW: TAB des Versorgers; Wartung jährl.",
    "erkennen": "Wärmepumpe: Gerät mit Verdichter, oft mit Außengerät (Ventilator). Fernwärme: Station mit Wärmetauscher, Regelventilen und Zähler des Versorgers (oft verplombt). BHKW: schallgedämmter Schrank mit Motor.",
    "wo": "Heizraum; Fernwärme dort, wo die Fernwärmeleitung ins Haus kommt; Wärmepumpen-Außengerät im Freien oder auf dem Dach.",
    "suche": "Fernwärmeübergabestation"
   },
   {
    "anlage": "Abgasanlage / Schornstein",
    "kg": "421",
    "erfassung": "einzeln",
    "hinweis": "Schornsteinfeger (KÜO)",
    "erkennen": "Rohr oder Schacht vom Kessel nach oben. Unten meist eine Reinigungsöffnung (Klappe/Tür), oft mit Aufkleber des Schornsteinfegers.",
    "wo": "Hinter bzw. über dem Kessel; Schornsteinfuß im Heizraum.",
    "suche": "Abgasanlage Brennwertkessel Reinigungsöffnung"
   },
   {
    "anlage": "Heizöltank / Brennstofflager",
    "kg": "421",
    "erfassung": "einzeln",
    "hinweis": "AwSV: Prüfpflicht je nach Gefährdungsstufe und Lage",
    "erkennen": "Kunststoff- oder Stahltanks mit Füllstandsanzeige, Füll- und Entlüftungsleitung, oft in einer Auffangwanne. Erdtank: Domschacht-Deckel im Gelände.",
    "wo": "Eigener Tankraum neben dem Heizraum oder im Außenbereich (Erdtank).",
    "suche": "Heizöltank Batterietank Auffangwanne"
   },
   {
    "anlage": "Heizungsverteiler",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Waagerechtes, meist gedämmtes Sammelrohr mit mehreren Abgängen; je Abgang Pumpe, Mischer mit Stellmotor und Thermometer.",
    "wo": "Heizraum, an der Wand neben dem Kessel.",
    "suche": "Heizungsverteiler Pumpengruppen"
   },
   {
    "anlage": "Umwälzpumpen (Heizung)",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Pumpe in der Rohrleitung mit Elektro-Kopf (Motor), oft mit Display oder LED. Typenschild am Motor.",
    "wo": "In der Technikzentrale an Verteilern und Geräten.",
    "suche": "Umwälzpumpe Heizung Hocheffizienzpumpe"
   },
   {
    "anlage": "Ausdehnungsgefäß / Druckhaltung",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV: Prüfpflicht je nach Druck x Volumen; Vordruck jährl. prüfen",
    "erkennen": "Runder Behälter, meist rot oder weiß, mit Typenschild (Volumen, Vordruck). Bei großen Anlagen eine Druckhaltestation mit Pumpen oder Kompressor und Behälter.",
    "wo": "Heizraum, am Kessel bzw. Rücklauf, stehend am Boden oder an der Wand.",
    "suche": "Membran Ausdehnungsgefäß Heizung"
   },
   {
    "anlage": "Heizungswasseraufbereitung / Nachspeisung",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "VDI 2035",
    "erkennen": "Kleine Armatur oder Gerät mit Patrone (Enthärtung/Entsalzung) in der Leitung vom Trinkwasser zur Heizung, oft mit eigenem Wasserzähler.",
    "wo": "Heizraum, an der Leitung, über die Trinkwasser in die Heizung nachgefüllt wird. Dort sitzt meist auch der Systemtrenner.",
    "suche": "Heizungswasser Nachfüllstation Enthärtung"
   },
   {
    "anlage": "Pufferspeicher",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "",
    "erkennen": "Großer stehender, gedämmter Zylinder mit mehreren Rohranschlüssen und Temperaturfühlern.",
    "wo": "Heizraum, häufig bei Wärmepumpe, Pelletkessel oder BHKW.",
    "suche": "Pufferspeicher Heizung"
   },
   {
    "anlage": "Wärmemengenzähler",
    "kg": "422",
    "erfassung": "einzeln",
    "hinweis": "Eichfrist 5 Jahre",
    "erkennen": "Zähler mit kleinem Rechenwerk (Display) und Messteil in der Rohrleitung, dazu zwei Temperaturfühler an Vor- und Rücklauf.",
    "wo": "Am Heizungsverteiler, an der Fernwärmestation oder in einzelnen Heizkreisen.",
    "suche": "Wärmemengenzähler Heizung"
   },
   {
    "anlage": "Trinkwassererwärmer / Speicher",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "TrinkwV § 31: Legionellen-Untersuchung bei Großanlage mit Duschen (gewerblich alle 3 J.)",
    "erkennen": "Stehender, gedämmter Behälter für Warmwasser oder eine Frischwasserstation (Plattenwärmetauscher). Anschlüsse für Kaltwasser, Warmwasser und Zirkulation, Thermometer.",
    "wo": "Heizraum, neben dem Kessel.",
    "suche": "Trinkwasserspeicher Heizraum"
   },
   {
    "anlage": "Zirkulationspumpe",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "",
    "erkennen": "Kleine Pumpe in der dünnen Warmwasser-Rückleitung zum Speicher, manchmal mit Zeitschaltuhr.",
    "wo": "Am Trinkwassererwärmer bzw. Speicher.",
    "suche": "Zirkulationspumpe Trinkwasser"
   },
   {
    "anlage": "Hauswasseranschluss, Wasserzähler",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "Eichfrist Unterzähler: Kaltwasser 6 J., Warmwasser 5 J.",
    "erkennen": "Wasserleitung kommt durch Wand oder Boden ins Haus, dahinter Absperrventil und Wasserzähler des Versorgers (Zahlwerk, Plombe).",
    "wo": "Hausanschlussraum im Keller, an der Außenwand zur Straße.",
    "suche": "Hauswasseranschluss Wasserzähler"
   },
   {
    "anlage": "Trinkwasserfilter, Druckminderer",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 806-5 (Filter ½-jährl., Druckminderer jährl.)",
    "erkennen": "Filter: durchsichtige Tasse mit Siebeinsatz, oft mit Drehgriff zum Rückspülen. Druckminderer: Armatur mit Stellschraube und Manometer. Oft beides zusammen als „Hauswasserstation“.",
    "wo": "Direkt hinter dem Wasserzähler.",
    "suche": "Hauswasserstation Filter Druckminderer"
   },
   {
    "anlage": "Systemtrenner / Sicherungsarmaturen",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 806-5 / DIN EN 1717",
    "erkennen": "Messingarmatur mit kleinen Prüfventilen oben und einem Ablauf bzw. Trichter unten, der in einen Abfluss führt; oft Manometer daneben. Weitere Sicherungsarmaturen: Rückflussverhinderer, Rohrtrenner.",
    "wo": "An der Leitung, über die Trinkwasser in die Heizung nachgefüllt wird; außerdem vor Enthärtungsanlagen, Feuerlösch- und Gartenanschlüssen.",
    "suche": "Systemtrenner BA"
   },
   {
    "anlage": "Druckerhöhungsanlage, Enthärtung, Dosierung",
    "kg": "412",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 806-5, Herstellerangabe",
    "erkennen": "Druckerhöhung: eine oder mehrere Pumpen auf einem Grundrahmen mit Schaltschrank. Enthärtung: eine oder zwei Säulen mit Salzbehälter. Dosierung: kleines Gerät mit Kanister oder Mineralstoff-Beutel.",
    "wo": "Hausanschlussraum, hinter Wasserzähler und Filter.",
    "suche": "Enthärtungsanlage Salzbehälter"
   },
   {
    "anlage": "Gas-Hausanschluss / HAE / Gaszähler / Gasdruckregler",
    "kg": "413",
    "erfassung": "einzeln",
    "hinweis": "DVGW G 600 (TRGI): Gebrauchsfähigkeitsprüfung i. d. R. alle 12 J.",
    "erkennen": "Gasleitung, oft gelb gekennzeichnet. Hauptabsperreinrichtung (HAE) als Hahn mit Griff, oft mit Schild. Gaszähler mit Zahlwerk und Plombe. Gasdruckregler: Armatur mit großer runder Membranhaube.",
    "wo": "Hausanschlussraum an der Außenwand; Druckregler teils außen in einem Kasten.",
    "suche": "Gas Hausanschluss Hauptabsperreinrichtung Gaszähler"
   },
   {
    "anlage": "Abwasserhebeanlage",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 12056-4: Wartung gewerblich ¼-jährl.",
    "erkennen": "Kunststoffbehälter im oder auf dem Boden mit Pumpe, nach oben führende Druckleitung und Steuer- bzw. Alarmgerät an der Wand.",
    "wo": "Tiefster Punkt im Keller: Technikraum, Waschküche, Tiefgarage. Das Alarmgerät an der Wand verrät den Standort.",
    "suche": "Abwasserhebeanlage Keller"
   },
   {
    "anlage": "Rückstauverschluss",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN 1986-3: Inspektion monatl. (Betreiber), Wartung ½-jährl.",
    "erkennen": "Deckel im Boden oder Armatur in der Abwasserleitung mit Klappe bzw. Handhebel; manche elektrisch mit Steuergerät.",
    "wo": "Kellerräume mit Bodenabläufen und Abwasserleitungen unterhalb der Straßenhöhe.",
    "suche": "Rückstauverschluss Keller"
   },
   {
    "anlage": "Gaswarnanlage (falls vorhanden)",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "Funktionsprüfung / Kalibrierung nach Herstellerangabe",
    "erkennen": "Kleine Sensoren an der Decke oder in Bodennähe, eine Zentrale mit LED-Anzeige sowie Warnleuchte bzw. Hupe.",
    "wo": "Heizraum, Gasanschlussraum, Kältezentrale.",
    "suche": "Gaswarnanlage Sensor Heizraum"
   },
   {
    "anlage": "Feuerlöscher",
    "kg": "474",
    "erfassung": "Sammel je Raum/Geschoss",
    "hinweis": "ASR A2.2: alle 2 Jahre",
    "erkennen": "Roter Behälter mit Schlauch und Griff. Am Behälter klebt eine Prüfplakette mit Jahr bzw. Monat der letzten Prüfung.",
    "wo": "An Wänden neben Türen, an Fluchtwegen und in Technikräumen; darüber hängt meist ein rotes Hinweisschild.",
    "suche": "Feuerlöscher Prüfplakette Wand"
   }
  ]
 },
 {
  "bereich": "Elektroverteilung (HAR / NSHV / UV)",
  "rundgang": "Vom Hausanschlusskasten über die Zähler zur NSHV. In der NSHV die Beschriftung der Abgänge lesen: Dort stehen die Namen aller Unterverteilungen. USV, Notstrom und Sicherheitsbeleuchtung stehen oft im Nebenraum. Schaltschränke nicht öffnen, wenn du keine Elektrofachkraft bist – Typenschilder sind meist außen.",
  "items": [
   {
    "anlage": "Hausanschlusskasten / Zählerschrank",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (ortsfest, Frist nach GBU, i. d. R. 4 J.)",
    "erkennen": "Hausanschlusskasten: grauer, verplombter Kasten an der Wand, in den das Stromkabel von der Straße führt. Zählerschrank: Schrank mit Stromzählern und Sicherungen.",
    "wo": "Hausanschlussraum im Keller.",
    "suche": "Hausanschlusskasten Zählerschrank"
   },
   {
    "anlage": "Mittelspannungsanlage / Transformator (falls vorhanden)",
    "kg": "441",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3; Schaltberechtigung beachten",
    "erkennen": "Eigener, abgeschlossener Raum mit Warnschild „Hochspannung – Lebensgefahr“, darin Schaltfelder und Transformator. Nur mit Befugnis betreten!",
    "wo": "Trafo- bzw. Mittelspannungsraum im UG oder als separates Gebäude.",
    "suche": "Mittelspannungsschaltanlage Trafostation"
   },
   {
    "anlage": "Niederspannungshauptverteilung (NSHV)",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (i. d. R. 4 J.)",
    "erkennen": "Große Reihe von Schaltschränken mit Leistungsschaltern, Messgeräten und Beschriftung, oft „NSHV“.",
    "wo": "Elektroraum im UG, nahe am Hausanschluss.",
    "suche": "Niederspannungshauptverteilung"
   },
   {
    "anlage": "Unterverteilungen (jede UV)",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (i. d. R. 4 J.)",
    "erkennen": "Wandverteiler oder Schrank, innen Sicherungsautomaten und FI-Schalter. Außen meist beschriftet, z. B. „UV 1.1“ oder „UV EG“.",
    "wo": "In jedem Geschoss: Flur, Elektroschacht, Abstellraum, Technikraum. Die Liste der UVs steht in der NSHV oder in den Elektroplänen.",
    "suche": "Unterverteilung Elektro Gebäude"
   },
   {
    "anlage": "Blindleistungskompensation",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Schrank mit Kondensatoren, Lüftern und einem Regler mit Anzeige (cos φ).",
    "wo": "Neben der NSHV.",
    "suche": "Blindleistungskompensationsanlage"
   },
   {
    "anlage": "Haupterdungsschiene / Überspannungsschutz",
    "kg": "446",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 / DIN EN 62305",
    "erkennen": "Kupferschiene, an der viele grün-gelbe Leitungen angeschlossen sind. Überspannungsschutz: Module mit Statusfenster im Verteiler.",
    "wo": "Hausanschlussraum, an bzw. in der NSHV.",
    "suche": "Haupterdungsschiene Potentialausgleich"
   },
   {
    "anlage": "USV-Anlage",
    "kg": "442",
    "erfassung": "einzeln",
    "hinweis": "Wartung jährl., Batterietausch nach Herstellerangabe",
    "erkennen": "Schrank mit Display, daneben oft ein Batterieschrank; Lüftergeräusch.",
    "wo": "Elektro- oder Serverraum.",
    "suche": "USV Anlage Batterieschrank"
   },
   {
    "anlage": "Netzersatzanlage (Notstrom)",
    "kg": "442",
    "erfassung": "einzeln",
    "hinweis": "monatl. Probelauf, jährl. Wartung",
    "erkennen": "Dieselaggregat im Schallschutzgehäuse oder eigenem Raum, mit Tank, Abgasrohr und Schaltschrank.",
    "wo": "Eigener Raum im UG/EG oder Container im Außenbereich.",
    "suche": "Netzersatzanlage Notstromaggregat"
   },
   {
    "anlage": "Zentralbatterie Sicherheitsbeleuchtung",
    "kg": "442",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 50172 / DIN VDE V 0108-100-1: Funktionstests, jährl. Prüfung",
    "erkennen": "Schrank mit Batterien und Steuerteil, beschriftet „Sicherheitsbeleuchtung“ oder mit Herstellername; das Prüfbuch liegt oft dabei.",
    "wo": "Eigener Batterieraum oder Elektroraum.",
    "suche": "Zentralbatterieanlage Sicherheitsbeleuchtung"
   },
   {
    "anlage": "PV-Wechselrichter / Batteriespeicher",
    "kg": "442",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3, DIN EN 62446",
    "erkennen": "Wandgeräte mit Kühlrippen und Display, Leitungen kommen vom Dach; Batteriespeicher als Schrank.",
    "wo": "Technikraum, Elektroraum, Dachgeschoss oder Garage.",
    "suche": "PV Wechselrichter Batteriespeicher"
   },
   {
    "anlage": "Hausübergabepunkt Telekom / Glasfaser",
    "kg": "451",
    "erfassung": "einzeln",
    "hinweis": "",
    "erkennen": "Kleiner Kunststoffkasten (APL) oder Glasfaser-Abschlusspunkt mit Beschriftung des Netzbetreibers.",
    "wo": "Hausanschlussraum.",
    "suche": "APL Telekom Hausanschluss Glasfaser"
   },
   {
    "anlage": "Netzwerkverteiler / Serverschrank",
    "kg": "457",
    "erfassung": "einzeln",
    "hinweis": "",
    "erkennen": "19-Zoll-Schrank, oft mit Glastür; innen Patchfelder mit vielen Kabeln und Switches mit blinkenden LEDs.",
    "wo": "Serverraum und Etagenverteiler-Räume.",
    "suche": "Netzwerkschrank 19 Zoll Patchfeld"
   },
   {
    "anlage": "Feuerlöscher (CO2)",
    "kg": "474",
    "erfassung": "Sammel je Raum",
    "hinweis": "ASR A2.2: alle 2 Jahre",
    "erkennen": "Feuerlöscher mit großem schwarzem Trichter am Ende des Schlauchs (Kohlendioxid).",
    "wo": "In Elektro- und Serverräumen, meist an der Tür.",
    "suche": "CO2 Feuerlöscher"
   }
  ]
 },
 {
  "bereich": "Lüftungszentrale",
  "rundgang": "Den Luftkanälen folgen: Außenluft-Ansaugung → RLT-Gerät → Kanäle zu den Geschossen. An jeder Stelle, wo ein Kanal durch Wand oder Decke geht, nach einer Brandschutzklappe schauen. Die Beschriftung im Schaltschrank zeigt, welche Anlagen dort gesteuert werden.",
  "items": [
   {
    "anlage": "RLT-Zentralgerät (Lüftung / Klima)",
    "kg": "431 / 433",
    "erfassung": "einzeln",
    "hinweis": "VDI 6022: Hygieneinspektion alle 3 J. (mit Befeuchtung 2 J.); GEG: energet. Inspektion (Schwellenwert prüfen)",
    "erkennen": "Großes kastenförmiges Gerät aus Blechmodulen mit Revisionstüren; dicke Luftkanäle für Zu- und Abluft gehen ab. Typenschild meist an der Ventilatortür.",
    "wo": "Lüftungszentrale im UG oder auf dem Dach.",
    "suche": "RLT Gerät Lüftungszentrale"
   },
   {
    "anlage": "Ventilatoren Zu-/Abluft (separat)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Ventilator im Luftkanal oder in einem eigenen Gehäuse, mit Motor und Typenschild.",
    "wo": "Lüftungszentrale, Schächte, Dach.",
    "suche": "Kanalventilator Lüftung"
   },
   {
    "anlage": "Brandschutzklappen",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 15650 / Zulassung: ½-jährl., nach 2 mängelfreien Prüfungen jährl.",
    "erkennen": "Viereckiges oder rundes Gehäuse im Lüftungskanal genau dort, wo der Kanal durch eine Wand oder Decke geht. Außen ein Auslösemechanismus mit Hebel oder ein Stellmotor und ein Schild mit Zulassungsnummer.",
    "wo": "Lüftungszentrale, Schächte, über abgehängten Decken (Revisionsklappen öffnen). Der Lüftungsplan zeigt alle Klappen.",
    "suche": "Brandschutzklappe Lüftungskanal"
   },
   {
    "anlage": "Entrauchungsanlage / Druckbelüftung (RDA)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)",
    "erkennen": "Ventilatoren mit Beschriftung „Entrauchung“ oder „RDA“, eigener Schaltschrank, feuerfest verlegte Kabel.",
    "wo": "Dach, oberstes Geschoss am Treppenhaus oder Technikraum.",
    "suche": "Rauchschutz Druckanlage Treppenhaus"
   },
   {
    "anlage": "Kältemaschine / Kaltwassersatz",
    "kg": "434",
    "erfassung": "einzeln",
    "hinweis": "F-Gase-VO (EU) 2024/573: Dichtheitskontrolle ab 5 t CO2-Äq.; BetrSichV",
    "erkennen": "Großes Aggregat mit Verdichtern, Rohrleitungen für Kaltwasser und Display; Typenschild mit Kältemittel und Füllmenge.",
    "wo": "Kältezentrale im UG oder auf dem Dach.",
    "suche": "Kaltwassersatz Kältemaschine"
   },
   {
    "anlage": "Rückkühler / Verdunstungskühlanlage",
    "kg": "434",
    "erfassung": "einzeln",
    "hinweis": "42. BImSchV bei Verdunstungskühlung (Anzeige, Laboruntersuchungen)",
    "erkennen": "Gerät mit großen Ventilatoren oben und Lamellen-Wärmetauschern. Verdunstungskühler bzw. Kühlturm: mit Wasser im Inneren.",
    "wo": "Dach oder Außenbereich.",
    "suche": "Rückkühler Dach"
   },
   {
    "anlage": "Pumpen Kalt-/Heizwasser",
    "kg": "422 / 434",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Pumpe in der Rohrleitung mit Elektro-Kopf (Motor), oft mit Display oder LED. Typenschild am Motor.",
    "wo": "In der Technikzentrale an Verteilern und Geräten.",
    "suche": "Umwälzpumpe Heizung Hocheffizienzpumpe"
   },
   {
    "anlage": "MSR-Schaltschrank / Automationsstation",
    "kg": "482 / 481",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Schaltschrank mit Steuerungsbaugruppen, oft Bedienpanel in der Tür und Beschriftung mit Anlagenname oder „ISP“.",
    "wo": "In jeder Technikzentrale neben den Anlagen, die er steuert.",
    "suche": "MSR Schaltschrank DDC Gebäudeautomation"
   },
   {
    "anlage": "Feuerlöscher",
    "kg": "474",
    "erfassung": "Sammel je Raum",
    "hinweis": "ASR A2.2: alle 2 Jahre",
    "erkennen": "Roter Behälter mit Schlauch und Griff. Am Behälter klebt eine Prüfplakette mit Jahr bzw. Monat der letzten Prüfung.",
    "wo": "An Wänden neben Türen, an Fluchtwegen und in Technikräumen; darüber hängt meist ein rotes Hinweisschild.",
    "suche": "Feuerlöscher Prüfplakette Wand"
   }
  ]
 },
 {
  "bereich": "Aufzug",
  "rundgang": "Erst in der Kabine: Prüfplakette, Typenschild, Notruftaste. Dann den Triebwerksraum oder den Steuerschrank im obersten Geschoss suchen (meist neben der Schachttür).",
  "items": [
   {
    "anlage": "Personenaufzug (jeder Aufzug)",
    "kg": "461",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV: Hauptprüfung alle 2 J., Zwischenprüfung dazwischen (ZÜS)",
    "erkennen": "Aufzugskabine; in der Kabine Prüfplakette und Schild mit Hersteller, Fabriknummer und Tragfähigkeit.",
    "wo": "Kabine; Steuerung im Triebwerksraum oder in einem Schrank neben der Schachttür im obersten Geschoss.",
    "suche": "Aufzug Prüfplakette Kabine"
   },
   {
    "anlage": "Notrufsystem Aufzug",
    "kg": "461",
    "erfassung": "Teil des Aufzugs (Bemerkung)",
    "hinweis": "BetrSichV: Notruf muss ständig erreichbar sein",
    "erkennen": "Notruftaste (Glockensymbol) und Lautsprecher im Bedientableau der Kabine.",
    "wo": "In der Kabine.",
    "suche": "Aufzug Notruf Taste Kabine"
   },
   {
    "anlage": "Triebwerksraum / Schachtkopf: Steuerung, Schachtentrauchung",
    "kg": "461",
    "erfassung": "Teil des Aufzugs",
    "hinweis": "",
    "erkennen": "Raum mit Antrieb und Steuerschrank. Schachtentrauchung: Öffnung oder Klappe oben im Schacht.",
    "wo": "Über dem Schacht bzw. auf dem Dach oder unten neben dem Schacht. Bei Aufzügen ohne Maschinenraum: Steuerschrank im obersten Geschoss.",
    "suche": "Aufzug Triebwerksraum"
   },
   {
    "anlage": "Lastenaufzug / Kleingüteraufzug",
    "kg": "461",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV (ZÜS)",
    "erkennen": "Lastenaufzug: große, robuste Kabine. Kleingüteraufzug (Speiseaufzug): kleine Öffnung mit Klappe in Tischhöhe.",
    "wo": "Anlieferung, Lager, Küche.",
    "suche": "Kleingüteraufzug Speiseaufzug"
   },
   {
    "anlage": "Plattformlift / Treppenlift",
    "kg": "461",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV / Herstellerangabe (Einstufung prüfen)",
    "erkennen": "Plattform an einer Treppe oder kleiner Hubtisch für Rollstühle.",
    "wo": "Eingänge und Treppen mit wenigen Stufen.",
    "suche": "Plattformlift Rollstuhl"
   },
   {
    "anlage": "Feuerwehraufzug (falls vorhanden)",
    "kg": "461",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV + Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)",
    "erkennen": "Aufzug mit Feuerwehr-Schlüsselschalter und Schild „Feuerwehraufzug“.",
    "wo": "Meist nur in Hochhäusern.",
    "suche": "Feuerwehraufzug Schlüsselschalter"
   }
  ]
 },
 {
  "bereich": "Dach",
  "rundgang": "Nur mit Absturzsicherung oder hinter einer Brüstung! Einmal den Dachrand entlang (Blitzschutz, Anschlagpunkte, Notüberläufe), dann die Aufbauten in der Fläche (Ventilatoren, Außengeräte, Lichtkuppeln, PV).",
  "items": [
   {
    "anlage": "Blitzschutzanlage (Fangeinrichtung, Ableitungen)",
    "kg": "446",
    "erfassung": "einzeln (1 je Gebäude)",
    "hinweis": "DIN EN 62305-3 Bbl. 3: z. B. LPS III/IV umfassend alle 4 J.",
    "erkennen": "Blanke Drähte und Stangen auf dem Dach (Fangleitungen, Fangstangen), die an der Fassade nach unten laufen; unten Trenn- bzw. Messstellen.",
    "wo": "Dachfläche, Dachrand und Fassade.",
    "suche": "Blitzschutz Fangleitung Flachdach"
   },
   {
    "anlage": "Anschlageinrichtungen / Seilsicherung",
    "kg": "369",
    "erfassung": "Sammel je Dachfläche",
    "hinweis": "DIN EN 795: i. d. R. jährl. durch Sachkundigen",
    "erkennen": "Metallpfosten oder Ösen mit Kennzeichnungsschild, oft ein Stahlseil entlang des Dachrands.",
    "wo": "Flachdach, meist nahe am Dachrand und am Dachausstieg.",
    "suche": "Anschlageinrichtung Flachdach Seilsicherung"
   },
   {
    "anlage": "Dachausstieg / Steigleiter",
    "kg": "362 / 369",
    "erfassung": "einzeln",
    "hinweis": "Prüfung nach GBU",
    "erkennen": "Dachluke oder Ausstiegshaube, ortsfeste Leiter, teils mit Rückenschutz.",
    "wo": "Oberstes Treppenhaus oder Technikraum unter dem Dach.",
    "suche": "Dachausstieg Steigleiter"
   },
   {
    "anlage": "RWA-Lichtkuppeln / Rauchabzugsklappen",
    "kg": "362",
    "erfassung": "Sammel je RWA-Gruppe",
    "hinweis": "Wartung jährl. (DIN 18232-2 / Herstellerangabe); Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)",
    "erkennen": "Lichtkuppel oder Klappe mit Motor bzw. Kettenantrieb oder Gasdruckfeder an der Seite.",
    "wo": "Dach über Treppenhäusern und Hallen.",
    "suche": "RWA Lichtkuppel Antrieb"
   },
   {
    "anlage": "PV-Anlage (Module)",
    "kg": "442",
    "erfassung": "Sammel (1 je Anlage)",
    "hinweis": "DIN EN 62446, DGUV V3",
    "erkennen": "Solarmodule auf Gestellen.",
    "wo": "Dachfläche, teils Fassade oder Carport.",
    "suche": "Photovoltaik Flachdach"
   },
   {
    "anlage": "Dachventilatoren",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Runde oder eckige Hauben mit Motor auf dem Dach (Abluft).",
    "wo": "Dach, über WC- und Küchenschächten.",
    "suche": "Dachventilator Abluft"
   },
   {
    "anlage": "Rückkühler / Split-Außengeräte",
    "kg": "434",
    "erfassung": "einzeln",
    "hinweis": "F-Gase-VO je nach Kältemittelmenge",
    "erkennen": "Kasten mit Ventilator und Lamellen; gedämmte Kältemittelleitungen führen ins Gebäude.",
    "wo": "Dach, Fassade, Hof.",
    "suche": "Klimaanlage Außengerät Dach"
   },
   {
    "anlage": "Antennen / SAT-Anlage",
    "kg": "455",
    "erfassung": "einzeln",
    "hinweis": "",
    "erkennen": "Antennenmast oder Satellitenschüssel.",
    "wo": "Dach.",
    "suche": "SAT Anlage Flachdach"
   },
   {
    "anlage": "Dachabläufe / Notentwässerung",
    "kg": "411",
    "erfassung": "Sammel je Dachfläche",
    "hinweis": "Inspektion ½-jährl. empfohlen",
    "erkennen": "Abläufe mit Kiesfang-Korb in der Dachfläche; Notüberläufe als Öffnung oder Rohr (Speier) am Dachrand.",
    "wo": "Dachfläche und Dachrand.",
    "suche": "Flachdach Notüberlauf Dachablauf"
   },
   {
    "anlage": "Fassadenbefahranlage (falls vorhanden)",
    "kg": "463",
    "erfassung": "einzeln",
    "hinweis": "BetrSichV: jährl. Prüfung durch befähigte Person",
    "erkennen": "Schienen und Dachwagen mit Ausleger und Arbeitskorb.",
    "wo": "Dachrand von hohen Gebäuden.",
    "suche": "Fassadenbefahranlage"
   }
  ]
 },
 {
  "bereich": "Treppenhäuser",
  "rundgang": "Von unten nach oben gehen. Unten: RWA-Taster und Einspeisung der Steigleitung. In jedem Geschoss: Türen, Feuerlöscher, Wandhydrant, Melder, Rettungszeichen. Ganz oben: RWA-Öffnung und RWA-Zentrale.",
  "items": [
   {
    "anlage": "Feuer-/Rauchschutztüren mit Feststellanlage",
    "kg": "344",
    "erfassung": "einzeln",
    "hinweis": "DIN 14677: monatl. Betreiber, jährl. Fachkraft",
    "erkennen": "Tür steht offen und wird von einem Haftmagneten (an der Wand oder im Türschließer) gehalten. Über der Tür sitzt ein Rauchmelder, daneben ein Taster „Tür schließen“. Schild im Türfalz (z. B. T30, RS).",
    "wo": "Zugänge zu Treppenhäusern, Flurabschnitte, Übergänge zu Technik- und Lagerräumen.",
    "suche": "Feststellanlage Brandschutztür Haftmagnet"
   },
   {
    "anlage": "Feuer-/Rauchschutztüren ohne Feststellanlage",
    "kg": "344",
    "erfassung": "Sammel je Treppenhaus",
    "hinweis": "Funktionskontrolle, Wartung nach Herstellerangabe",
    "erkennen": "Schwere Tür mit Türschließer oben. Im Falz (Türkante) oder am Rahmen sitzt ein Schild mit Klasse (T30, T90, EI30, RS = Rauchschutz).",
    "wo": "Treppenhäuser, Flurabschnitte, Technikräume, Keller- und TG-Zugänge.",
    "suche": "Brandschutztür Kennzeichnungsschild T30"
   },
   {
    "anlage": "RWA-Öffnung + Lüftungs-/RWA-Taster",
    "kg": "362 / 334",
    "erfassung": "einzeln (je Treppenhaus)",
    "hinweis": "Wartung jährl.; Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)",
    "erkennen": "Fenster oder Klappe ganz oben im Treppenhaus mit Motor. Auslösetaster „Rauchabzug“ (meist orange) im EG und oben, dazu ein Lüftungstaster.",
    "wo": "Oberstes Geschoss im Treppenhaus; Taster am Eingang im EG.",
    "suche": "RWA Taster Treppenhaus"
   },
   {
    "anlage": "RWA-Zentrale",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "Wartung jährl. nach Herstellerangabe",
    "erkennen": "Grauer Wandkasten mit LED-Anzeigen und Akkus, beschriftet „RWA“ oder mit Herstellername.",
    "wo": "Oben im Treppenhaus oder im Technikraum.",
    "suche": "RWA Zentrale"
   },
   {
    "anlage": "Druckbelüftungsanlage (RDA, falls vorhanden)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)",
    "erkennen": "Ventilator, der im Brandfall Luft ins Treppenhaus drückt; eigener Schaltschrank, beschriftet „RDA“.",
    "wo": "Oberstes Geschoss am Treppenhaus oder UG.",
    "suche": "Rauchschutzdruckanlage Ventilator"
   },
   {
    "anlage": "Sicherheits- / Rettungszeichenleuchten",
    "kg": "445",
    "erfassung": "Sammel je Treppenhaus",
    "hinweis": "DIN EN 50172: Funktionstests, jährl. Prüfung",
    "erkennen": "Grüne, von innen beleuchtete Schilder mit laufendem Männchen und Pfeil (Rettungszeichenleuchten); dazu Notleuchten an der Decke, oft mit kleiner grüner Kontroll-LED.",
    "wo": "Über Ausgängen und Türen in Fluchtwegen, in Treppenhäusern und Fluren.",
    "suche": "Rettungszeichenleuchte Notausgang"
   },
   {
    "anlage": "Handfeuermelder / Rauchmelder (BMA)",
    "kg": "456",
    "erfassung": "Sammel je Meldergruppe",
    "hinweis": "DIN VDE 0833-2: Inspektion ¼-jährl., Wartung jährl.",
    "erkennen": "Runde, flache Melder an der Decke mit Kennzeichnung (Gruppe/Nummer). Handfeuermelder: roter Kasten „Feuerwehr – Scheibe einschlagen“.",
    "wo": "Decken von Fluren, Treppenhäusern und Räumen; Handfeuermelder an Ausgängen und in Treppenhäusern.",
    "suche": "Brandmelder Decke Handfeuermelder"
   },
   {
    "anlage": "Feuerlöscher",
    "kg": "474",
    "erfassung": "Sammel je Treppenhaus",
    "hinweis": "ASR A2.2: alle 2 Jahre",
    "erkennen": "Roter Behälter mit Schlauch und Griff. Am Behälter klebt eine Prüfplakette mit Jahr bzw. Monat der letzten Prüfung.",
    "wo": "An Wänden neben Türen, an Fluchtwegen und in Technikräumen; darüber hängt meist ein rotes Hinweisschild.",
    "suche": "Feuerlöscher Prüfplakette Wand"
   },
   {
    "anlage": "Wandhydranten",
    "kg": "474",
    "erfassung": "Sammel je Treppenhaus",
    "hinweis": "DIN EN 671-3 / DIN 14462: jährl. Instandhaltung",
    "erkennen": "Roter Wandschrank mit Schild „Löschschlauch“ bzw. „Wandhydrant“; innen ein aufgerollter Schlauch (Haspel) mit Ventil.",
    "wo": "In Treppenhäusern und Fluren, meist in jedem Geschoss an derselben Stelle.",
    "suche": "Wandhydrant Schrank Schlauchhaspel"
   },
   {
    "anlage": "Steigleitung trocken / nass",
    "kg": "474",
    "erfassung": "einzeln (je Steigleitung)",
    "hinweis": "DIN 14462: wiederkehrende Prüfung",
    "erkennen": "Senkrechtes Rohr im Treppenhaus mit Entnahmestellen (Kupplungen) in den Geschossen und Schild „Steigleitung“. Trocken: Einspeisung für die Feuerwehr außen am Gebäude.",
    "wo": "Treppenhäuser; Einspeisung außen nahe dem Feuerwehrzugang.",
    "suche": "Steigleitung trocken Einspeisung"
   }
  ]
 },
 {
  "bereich": "Geschosse (Büros, Flure, WC, Teeküchen)",
  "rundgang": "Jedes Geschoss im Uhrzeigersinn. Erst den Flur (Türen, Melder, Feuerlöscher, Hydranten, Unterverteilung), dann die Sonderräume (WC, Teeküche, Serverraum), Büros nur stichprobenartig (Heizkörper, Klima, Raumregler). Revisionsklappen in Decken zeigen oft Brandschutzklappen.",
  "items": [
   {
    "anlage": "Unterverteilung Etage",
    "kg": "443",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (i. d. R. 4 J.)",
    "erkennen": "Wandverteiler oder Schrank, innen Sicherungsautomaten und FI-Schalter. Außen meist beschriftet, z. B. „UV 1.1“ oder „UV EG“.",
    "wo": "In jedem Geschoss: Flur, Elektroschacht, Abstellraum, Technikraum. Die Liste der UVs steht in der NSHV oder in den Elektroplänen.",
    "suche": "Unterverteilung Elektro Gebäude"
   },
   {
    "anlage": "Heizkörper / Heizkreisverteiler",
    "kg": "423",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "",
    "erkennen": "Heizkörper unter Fenstern. Fußbodenheizung: Verteilerkasten in der Wand mit Stellantrieben.",
    "wo": "Büros und Flure; Verteilerkasten meist im Flur.",
    "suche": "Heizkreisverteiler Fußbodenheizung Kasten"
   },
   {
    "anlage": "Allgemeinbeleuchtung",
    "kg": "445",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "",
    "erkennen": "Decken- und Wandleuchten.",
    "wo": "Alle Räume und Flure.",
    "suche": "Büro Deckenleuchte"
   },
   {
    "anlage": "Sicherheits- / Rettungszeichenleuchten",
    "kg": "445",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "DIN EN 50172: Funktionstests, jährl. Prüfung",
    "erkennen": "Grüne, von innen beleuchtete Schilder mit laufendem Männchen und Pfeil (Rettungszeichenleuchten); dazu Notleuchten an der Decke, oft mit kleiner grüner Kontroll-LED.",
    "wo": "Über Ausgängen und Türen in Fluchtwegen, in Treppenhäusern und Fluren.",
    "suche": "Rettungszeichenleuchte Notausgang"
   },
   {
    "anlage": "Brandmelderzentrale / Feuerwehrbedienfeld (meist EG)",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "DIN VDE 0833-1/-2, DIN 14675: Inspektion ¼-jährl., Wartung jährl.",
    "erkennen": "Schrank mit Display und Bedientasten (BMZ); daneben das Feuerwehrbedienfeld und ein Fach mit Laufkarten.",
    "wo": "Am Feuerwehrzugang im EG; außen zeigt eine Blitzleuchte den Zugang.",
    "suche": "Brandmelderzentrale Feuerwehrbedienfeld"
   },
   {
    "anlage": "Brandmelder / Handfeuermelder",
    "kg": "456",
    "erfassung": "Sammel je Meldergruppe",
    "hinweis": "DIN VDE 0833-2",
    "erkennen": "Runde, flache Melder an der Decke mit Kennzeichnung (Gruppe/Nummer). Handfeuermelder: roter Kasten „Feuerwehr – Scheibe einschlagen“.",
    "wo": "Decken von Fluren, Treppenhäusern und Räumen; Handfeuermelder an Ausgängen und in Treppenhäusern.",
    "suche": "Brandmelder Decke Handfeuermelder"
   },
   {
    "anlage": "Feuerlöscher",
    "kg": "474",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "ASR A2.2: alle 2 Jahre",
    "erkennen": "Roter Behälter mit Schlauch und Griff. Am Behälter klebt eine Prüfplakette mit Jahr bzw. Monat der letzten Prüfung.",
    "wo": "An Wänden neben Türen, an Fluchtwegen und in Technikräumen; darüber hängt meist ein rotes Hinweisschild.",
    "suche": "Feuerlöscher Prüfplakette Wand"
   },
   {
    "anlage": "Wandhydranten",
    "kg": "474",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "DIN EN 671-3 / DIN 14462: jährl.",
    "erkennen": "Roter Wandschrank mit Schild „Löschschlauch“ bzw. „Wandhydrant“; innen ein aufgerollter Schlauch (Haspel) mit Ventil.",
    "wo": "In Treppenhäusern und Fluren, meist in jedem Geschoss an derselben Stelle.",
    "suche": "Wandhydrant Schrank Schlauchhaspel"
   },
   {
    "anlage": "Brandschutztüren mit Feststellanlage (Flur)",
    "kg": "344",
    "erfassung": "einzeln",
    "hinweis": "DIN 14677: monatl. Betreiber, jährl. Fachkraft",
    "erkennen": "Tür steht offen und wird von einem Haftmagneten (an der Wand oder im Türschließer) gehalten. Über der Tür sitzt ein Rauchmelder, daneben ein Taster „Tür schließen“. Schild im Türfalz (z. B. T30, RS).",
    "wo": "Zugänge zu Treppenhäusern, Flurabschnitte, Übergänge zu Technik- und Lagerräumen.",
    "suche": "Feststellanlage Brandschutztür Haftmagnet"
   },
   {
    "anlage": "Brandschutztüren ohne Feststellanlage",
    "kg": "344",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "Funktionskontrolle",
    "erkennen": "Schwere Tür mit Türschließer oben. Im Falz (Türkante) oder am Rahmen sitzt ein Schild mit Klasse (T30, T90, EI30, RS = Rauchschutz).",
    "wo": "Treppenhäuser, Flurabschnitte, Technikräume, Keller- und TG-Zugänge.",
    "suche": "Brandschutztür Kennzeichnungsschild T30"
   },
   {
    "anlage": "Brandschutzklappen (Schächte, Decken)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "½-jährl., nach 2 mängelfreien Prüfungen jährl.",
    "erkennen": "Viereckiges oder rundes Gehäuse im Lüftungskanal genau dort, wo der Kanal durch eine Wand oder Decke geht. Außen ein Auslösemechanismus mit Hebel oder ein Stellmotor und ein Schild mit Zulassungsnummer.",
    "wo": "Lüftungszentrale, Schächte, über abgehängten Decken (Revisionsklappen öffnen). Der Lüftungsplan zeigt alle Klappen.",
    "suche": "Brandschutzklappe Lüftungskanal"
   },
   {
    "anlage": "Automatische Türen",
    "kg": "344 / 334",
    "erfassung": "einzeln",
    "hinweis": "ASR A1.7: jährl. Sachkundiger",
    "erkennen": "Schiebe- oder Drehtür mit Antrieb in einem Kasten über der Tür, Bewegungsmelder oder Taster.",
    "wo": "Eingänge, barrierefreie Türen, Flurtüren.",
    "suche": "automatische Schiebetür Antrieb"
   },
   {
    "anlage": "Teeküche: Geräte, Durchlauferhitzer, Kleinspeicher",
    "kg": "471 / 412",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "DGUV V3 ortsveränderlich (Frist nach GBU)",
    "erkennen": "Kleinspeicher unter der Spüle oder Durchlauferhitzer daneben; Geräte wie Kühlschrank, Spülmaschine, Kaffeemaschine.",
    "wo": "Teeküchen in den Geschossen.",
    "suche": "Untertischspeicher Spüle"
   },
   {
    "anlage": "Notrufanlage barrierefreies WC",
    "kg": "452",
    "erfassung": "einzeln",
    "hinweis": "DIN VDE 0834: wiederkehrende Prüfung",
    "erkennen": "Rote Zugschnur neben dem WC, Abstelltaster im Raum und eine Leuchte über der Tür außen.",
    "wo": "Barrierefreie WCs.",
    "suche": "Notruf behindertengerechtes WC Zugschnur"
   },
   {
    "anlage": "Split-Innengeräte / Raumklimageräte",
    "kg": "434",
    "erfassung": "Sammel je Anlage",
    "hinweis": "F-Gase über Außengerät",
    "erkennen": "Weißes, längliches Gerät oben an der Wand oder als Deckenkassette mit Lamellen.",
    "wo": "Büros, Besprechungs- und Serverräume.",
    "suche": "Split Klimagerät Innengerät"
   },
   {
    "anlage": "Einzelraumregler / Raumautomation",
    "kg": "481",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "",
    "erkennen": "Bedienteil an der Wand mit Temperaturanzeige oder Drehknopf.",
    "wo": "Büros und Besprechungsräume, meist neben der Tür.",
    "suche": "Raumbediengerät Temperatur Büro"
   },
   {
    "anlage": "Einzelraumlüfter WC",
    "kg": "431",
    "erfassung": "Sammel je Geschoss",
    "hinweis": "",
    "erkennen": "Runde oder eckige Abdeckung an Wand oder Decke, läuft oft mit dem Licht an.",
    "wo": "WCs und innenliegende Räume.",
    "suche": "Einzelraumlüfter Bad"
   },
   {
    "anlage": "Etagenverteiler Netzwerk / WLAN-Access-Points",
    "kg": "457",
    "erfassung": "Verteiler einzeln, APs Sammel",
    "hinweis": "",
    "erkennen": "Netzwerkschrank; Access Points sind weiße, flache Geräte an Decke oder Wand mit kleiner LED.",
    "wo": "Technikraum je Geschoss; Access Points in Fluren und Räumen.",
    "suche": "WLAN Access Point Decke"
   },
   {
    "anlage": "Einbruchmeldeanlage / Zutrittskontrolle (Zentrale)",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "DIN VDE 0833-3 (EMA)",
    "erkennen": "Bedienteil mit Tastatur am Eingang, Kartenleser an Türen; die Zentrale ist ein grauer Kasten.",
    "wo": "Eingänge; Zentrale im Technik- oder Serverraum.",
    "suche": "Einbruchmeldeanlage Bedienteil"
   },
   {
    "anlage": "Serverraum: Klimagerät, USV, Löschanlage",
    "kg": "434 / 442 / 474",
    "erfassung": "einzeln",
    "hinweis": "Gaslöschanlage: Prüfung lt. Genehmigung / Versicherer",
    "erkennen": "Klimaschrank oder Split-Gerät, USV-Schrank. Gaslöschanlage: Flaschen in einer Reihe mit Rohrleitungen zu Düsen an der Decke und Warnschild.",
    "wo": "Serverraum; Löschgasflaschen teils im Nebenraum.",
    "suche": "Gaslöschanlage Serverraum"
   }
  ]
 },
 {
  "bereich": "Tiefgarage",
  "rundgang": "An der Einfahrt beginnen (Tor, Schranke, Rampe). Dann an den Wänden entlang: CO-Sensoren, Lüftung, Feuerlöscher, Hydranten, Ladestationen. Den Bodenrinnen folgen – sie führen zu Abscheider und Pumpensumpf.",
  "items": [
   {
    "anlage": "Einfahrtstor / Rolltor (kraftbetätigt)",
    "kg": "334",
    "erfassung": "einzeln",
    "hinweis": "ASR A1.7: jährl. Sachkundiger",
    "erkennen": "Roll- oder Sektionaltor mit Motor oben oder seitlich, Lichtschranke und Ampel; Prüfplakette oft am Antrieb.",
    "wo": "Ein- und Ausfahrt der Tiefgarage.",
    "suche": "Tiefgarage Rolltor Antrieb"
   },
   {
    "anlage": "Schranke / Ampel / Zufahrtskontrolle",
    "kg": "–",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Schrankenbaum mit Antriebssäule, Kartenleser oder Ticketsäule, Ampel.",
    "wo": "Ein- und Ausfahrt.",
    "suche": "Schrankenanlage Tiefgarage"
   },
   {
    "anlage": "TG-Lüftung (Ventilatoren)",
    "kg": "431",
    "erfassung": "einzeln",
    "hinweis": "Prüfung lt. Baugenehmigung / GaVO BW",
    "erkennen": "Große Ventilatoren in Wand oder Decke oder Strahlventilatoren unter der Decke; Schaltschrank „TG-Lüftung“.",
    "wo": "Decke und Wände der Tiefgarage, Lüftungsschächte.",
    "suche": "Tiefgarage Strahlventilator"
   },
   {
    "anlage": "CO-Warnanlage",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "Prüfung lt. Baugenehmigung / GaVO BW; Sensoren nach Herstellerangabe",
    "erkennen": "Kleine Sensoren an Säulen oder Wänden, meist in ca. 1,5 m Höhe; Warnleuchten bzw. Leuchtschilder „CO-Alarm“, Zentrale mit Display.",
    "wo": "Verteilt in der ganzen Tiefgarage; Zentrale oft am Treppenhaus oder im Technikraum.",
    "suche": "CO Warnanlage Tiefgarage Sensor"
   },
   {
    "anlage": "Sicherheitsbeleuchtung TG",
    "kg": "445",
    "erfassung": "Sammel",
    "hinweis": "DIN EN 50172",
    "erkennen": "Grüne, von innen beleuchtete Schilder mit laufendem Männchen und Pfeil (Rettungszeichenleuchten); dazu Notleuchten an der Decke, oft mit kleiner grüner Kontroll-LED.",
    "wo": "Über Ausgängen und Türen in Fluchtwegen, in Treppenhäusern und Fluren.",
    "suche": "Rettungszeichenleuchte Notausgang"
   },
   {
    "anlage": "Leichtflüssigkeitsabscheider",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN 1999-100: Wartung ½-jährl., Generalinspektion alle 5 J.",
    "erkennen": "Schachtdeckel im Boden, oft mehrere hintereinander; Entwässerungsrinnen führen dorthin; teils Schild „Abscheider“.",
    "wo": "Tiefgarage oder Außenbereich an der Rampe.",
    "suche": "Leichtflüssigkeitsabscheider Schachtdeckel"
   },
   {
    "anlage": "Pumpensumpf / Tauchpumpe",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Schacht mit Gitter oder Deckel im Boden, darin Pumpe mit Schwimmerschalter; Alarmgerät an der Wand.",
    "wo": "Tiefster Punkt der Tiefgarage, unten an der Rampe.",
    "suche": "Pumpensumpf Tauchpumpe"
   },
   {
    "anlage": "Rampenheizung",
    "kg": "424",
    "erfassung": "einzeln",
    "hinweis": "",
    "erkennen": "Im Boden verlegt und unsichtbar; erkennbar am Regler bzw. Schaltschrank „Rampenheizung“ und einem Fühler im Boden.",
    "wo": "Einfahrtsrampe; Regler im Technik- oder Elektroraum.",
    "suche": "Rampenheizung Eismelder"
   },
   {
    "anlage": "Sprinklerzentrale (falls vorhanden)",
    "kg": "474",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 12845 / VdS CEA 4001: wöchentl. Betreiberkontrolle; Prüfung lt. Baugenehmigung / Brandschutzkonzept (Sachverständige nach BauSVO)",
    "erkennen": "Raum mit roten Rohren und großen Ventilstationen mit Manometern; Sprinklerköpfe an der Decke der Garage.",
    "wo": "Eigener Raum im UG, Zugang oft von außen.",
    "suche": "Sprinklerzentrale Alarmventil"
   },
   {
    "anlage": "Brandschutztüren / -tore TG",
    "kg": "344",
    "erfassung": "mit FSA einzeln, sonst Sammel",
    "hinweis": "DIN 14677 (bei Feststellanlage)",
    "erkennen": "Schwere Stahltüren oder -tore zu Treppenhaus und Keller, teils mit Feststellanlage (Magnet und Melder).",
    "wo": "Zugänge zur Tiefgarage.",
    "suche": "Brandschutztor Tiefgarage"
   },
   {
    "anlage": "Feuerlöscher / Wandhydranten",
    "kg": "474",
    "erfassung": "Sammel",
    "hinweis": "ASR A2.2 / DIN 14462",
    "erkennen": "Feuerlöscher: roter Behälter mit Schlauch und Prüfplakette. Wandhydrant: roter Wandschrank mit Schild „Löschschlauch“ und aufgerolltem Schlauch.",
    "wo": "An Wänden und Säulen, besonders an den Zugängen zu Treppenhäusern.",
    "suche": "Tiefgarage Feuerlöscher Wandhydrant"
   },
   {
    "anlage": "Ladestationen E-Mobilität",
    "kg": "444",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3 (Frist nach GBU)",
    "erkennen": "Wallboxen an Wand oder Säule mit Ladekabel oder Steckdose.",
    "wo": "Stellplätze in der Tiefgarage.",
    "suche": "Wallbox Tiefgarage"
   },
   {
    "anlage": "Brandmelder TG (falls vorhanden)",
    "kg": "456",
    "erfassung": "Sammel je Meldergruppe",
    "hinweis": "DIN VDE 0833-2",
    "erkennen": "Runde, flache Melder an der Decke mit Kennzeichnung (Gruppe/Nummer). Handfeuermelder: roter Kasten „Feuerwehr – Scheibe einschlagen“.",
    "wo": "Decken von Fluren, Treppenhäusern und Räumen; Handfeuermelder an Ausgängen und in Treppenhäusern.",
    "suche": "Brandmelder Decke Handfeuermelder"
   }
  ]
 },
 {
  "bereich": "Außenanlagen",
  "rundgang": "Einmal ums Gebäude gehen. Am Feuerwehrzugang: Schlüsseldepot und Blitzleuchte. Unterwegs auf Schachtdeckel (Abscheider, Pumpen, Zisterne), Hydranten-Schilder, Beleuchtung und Tore achten.",
  "items": [
   {
    "anlage": "Außenbeleuchtung",
    "kg": "445",
    "erfassung": "Sammel",
    "hinweis": "",
    "erkennen": "Mastleuchten, Pollerleuchten, Wandleuchten.",
    "wo": "Wege, Parkplätze, Eingänge.",
    "suche": "Pollerleuchte Außenbeleuchtung"
   },
   {
    "anlage": "Hebeanlage / Pumpwerk außen",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN EN 12056-4",
    "erkennen": "Schachtdeckel im Gelände, daneben ein Schaltschrank.",
    "wo": "Tiefpunkte des Grundstücks, Hof, Rampen.",
    "suche": "Pumpwerk Schacht Schaltschrank"
   },
   {
    "anlage": "Fettabscheider (falls Küche)",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "DIN 4040-100: Generalinspektion alle 5 J.",
    "erkennen": "Schachtdeckel im Hof oder Keller nahe der Küche; teils Schild „Fettabscheider“.",
    "wo": "Nahe Großküche oder Kantine.",
    "suche": "Fettabscheider Schachtdeckel"
   },
   {
    "anlage": "Regenwasserzisterne / Versickerung",
    "kg": "411",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Herstellerangabe",
    "erkennen": "Schachtdeckel im Gelände, teils mit Pumpe im Schacht.",
    "wo": "Garten- und Hofflächen.",
    "suche": "Regenwasserzisterne Schachtdeckel"
   },
   {
    "anlage": "Hausanschlussschächte / Gasdruckregler außen",
    "kg": "413",
    "erfassung": "einzeln",
    "hinweis": "DVGW G 600",
    "erkennen": "Kasten an der Fassade oder im Boden; bei Gas oft gelbe Kennzeichnung.",
    "wo": "Fassade an der Straßenseite.",
    "suche": "Gasdruckregler Fassade Kasten"
   },
   {
    "anlage": "Tore / Schranken (kraftbetätigt)",
    "kg": "334 / –",
    "erfassung": "einzeln",
    "hinweis": "ASR A1.7: jährl. Sachkundiger",
    "erkennen": "Schiebetor oder Drehtor mit Antrieb, Schranke mit Antriebssäule, Lichtschranken.",
    "wo": "Grundstückszufahrt.",
    "suche": "Schiebetor Antrieb Einfahrt"
   },
   {
    "anlage": "Ladesäulen außen",
    "kg": "444",
    "erfassung": "einzeln",
    "hinweis": "DGUV V3",
    "erkennen": "Ladesäulen oder Wallboxen auf Stellplätzen.",
    "wo": "Parkplatz.",
    "suche": "Ladesäule Parkplatz"
   },
   {
    "anlage": "Feuerwehrschlüsseldepot / Freischaltelement / Blitzleuchte",
    "kg": "456",
    "erfassung": "einzeln",
    "hinweis": "Teil der BMA (DIN 14675)",
    "erkennen": "Kleiner Tresor in der Wand (Schlüsseldepot), daneben ein Freischaltelement mit Schließzylinder, darüber eine Blitzleuchte.",
    "wo": "Am Feuerwehrzugang des Gebäudes.",
    "suche": "Feuerwehrschlüsseldepot Blitzleuchte"
   },
   {
    "anlage": "Löschwasserbehälter / Hydranten auf dem Grundstück",
    "kg": "474",
    "erfassung": "einzeln",
    "hinweis": "Wartung nach Vorgabe Feuerwehr / Versorger",
    "erkennen": "Unterflurhydrant: Deckel im Boden, dazu ein Hinweisschild mit „H“ an Wand oder Pfahl. Überflurhydrant: rote Säule.",
    "wo": "Zufahrten und Wege auf dem Grundstück.",
    "suche": "Hydrant Hinweisschild Unterflurhydrant"
   },
   {
    "anlage": "Videoüberwachung",
    "kg": "456",
    "erfassung": "Rekorder einzeln, Kameras Sammel",
    "hinweis": "",
    "erkennen": "Kameras an der Fassade; Rekorder im Technik- oder Serverraum.",
    "wo": "Eingänge, Parkplätze, Zufahrten.",
    "suche": "Videoüberwachung Kamera Fassade"
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

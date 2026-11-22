# TGA Anlagenerfassung

Web-App zum Erfassen technischer Anlagen bei der Begehung, auf dem Handy oder Tablet.
Sie läuft offline, speichert alle Daten nur auf dem Gerät und exportiert eine Excel-Datei
mit denselben Spalten wie die Erfassungsvorlage (Blatt „Anlagen“, importfähig für das CAFM).

## Funktionen

- Anlagen erfassen: 29 Felder wie in der Excel-Vorlage, 13 Pflichtfelder, Dropdowns nach DIN 276
- Anlagenart-Liste passend zum gewählten Gewerk
- Anlagen-ID wird automatisch vorgeschlagen (Gebäude-KG-Nr., z. B. B01-421-001), doppelte IDs werden markiert
- Fotos direkt mit der Kamera; beim Export heißen sie automatisch `Anlagen-ID_01.jpg`, `_02.jpg` …
- „Fertig + nächste Anlage im selben Raum“ und „Duplizieren“ für schnelle Erfassung
- Begehungscheckliste (112 Punkte, 9 Bereiche) und Unterlagen-Checkliste (31 Punkte)
- Export: Excel (.xlsx), CSV, Fotos als ZIP
- Datensicherung und Wiederherstellung (auch für den Umzug auf ein anderes Gerät)
- Import der Excel-Erfassungsvorlage (z. B. am PC vorab eingetragene Anlagen)
- Keine externen Bibliotheken, kein Server, kein Tracking

## Auf GitHub veröffentlichen (einmalig, ca. 10 Minuten)

1. Bei [github.com](https://github.com) anmelden bzw. kostenloses Konto anlegen.
2. Oben rechts **+** → **New repository**.
   - Name z. B. `anlagenerfassung`
   - **Public** wählen (GitHub Pages ist im kostenlosen Konto nur für öffentliche Repositories verfügbar.
     Öffentlich ist nur der Programmcode – deine Erfassungsdaten landen nie auf GitHub.)
   - **Create repository**
3. Im neuen Repository auf **uploading an existing file** (bzw. **Add file → Upload files**) klicken.
4. Die ZIP-Datei am PC entpacken, den Ordner öffnen und **den Inhalt** (alle Dateien und den Ordner `icons`)
   in das Upload-Feld ziehen. Nicht den übergeordneten Ordner selbst hochladen.
5. Unten **Commit changes** klicken.
6. **Settings → Pages**: unter „Build and deployment“ bei *Source* **Deploy from a branch**,
   bei *Branch* **main** und **/ (root)** wählen → **Save**.
7. Nach 1–2 Minuten ist die App erreichbar unter
   `https://DEIN-BENUTZERNAME.github.io/anlagenerfassung/`
   (die Adresse steht dann auch oben unter Settings → Pages).

## Auf dem Handy installieren

Adresse im Browser öffnen und die App auf den Startbildschirm legen:

- **Android (Chrome):** Menü ⋮ → **App installieren** bzw. **Zum Startbildschirm hinzufügen**
- **iPhone/iPad (Safari):** Teilen-Symbol → **Zum Home-Bildschirm**

Danach startet die App wie eine normale App und funktioniert auch ohne Netz (Keller, Tiefgarage).
Einmal online öffnen genügt, damit sie offline verfügbar ist.

## Bedienung in Kürze

1. **Export → Einstellungen:** Liegenschaft, Gebäude und eigenes Kürzel eintragen.
   Diese Werte werden bei jeder neuen Anlage vorausgefüllt.
2. **Anlagen → + Neue Anlage** oder in der **Checkliste** bei einem Punkt **+ Anlage erfassen**.
3. Pflichtfelder (orange markiert) ausfüllen, Gesamtansicht und Typenschild fotografieren.
   Alles wird sofort automatisch gespeichert.
4. Nach jedem Begehungstag: **Export → Datensicherung erstellen** und die Datei ablegen
   (OneDrive, Mail an dich selbst o. Ä.).
5. Zum Schluss: **Export → Excel-Datei** und **Fotos (.zip)** für den CAFM-Import.

## Wichtig: Datensicherung

Die Daten liegen ausschließlich im Speicher des Browsers auf diesem Gerät.
Sie gehen verloren, wenn die App bzw. die Website-Daten gelöscht werden oder das Gerät verloren geht.
Deshalb regelmäßig eine Datensicherung erstellen. Die App erinnert daran, wenn seit der letzten
Sicherung Änderungen gemacht wurden.

## Kataloge anpassen

Alle Listen (Spalten, Gewerke, Anlagenarten, Checkliste, Unterlagen) stehen in `data.js`.
Geschosse lassen sich direkt in der App unter Export → Einstellungen ändern.

Nach jeder Änderung an den Dateien in `sw.js` die Versionsnummer in `CACHE` erhöhen
(z. B. `tga-anlagen-v1.0.1`), damit die Handys die neue Version laden.
Die neue Version ist nach dem zweiten Start der App aktiv.

## Voraussetzungen

- Android mit aktuellem Chrome oder iPhone/iPad mit iOS 16.4 oder neuer
- Für den Import von Excel-Dateien wird ein aktueller Browser benötigt; Erfassen und Export
  funktionieren auch mit älteren Versionen.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Seitengerüst |
| `app.js` | Programmlogik (Erfassung, Checkliste, Export, Import) |
| `data.js` | Spalten und Kataloge (identisch mit der Excel-Vorlage) |
| `db.js` | Speicherung im Browser (IndexedDB) |
| `xlsx.js`, `zip.js` | Excel- und ZIP-Erzeugung ohne externe Bibliotheken |
| `sw.js` | Offline-Funktion (Service Worker) |
| `manifest.webmanifest`, `icons/` | App-Name und Symbole für den Startbildschirm |
| `style.css` | Gestaltung |

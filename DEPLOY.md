# Deployment Guide til nonoise.space

## Hurtig Upload via Hostinger File Manager

### Step 1: Log ind på Hostinger
1. Gå til [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Log ind med dine credentials
3. Vælg dit website **nonoise.space**

### Step 2: Åbn File Manager
1. Find "File Manager" i menuen
2. Klik "Open File Manager"
3. Du skulle nu se `public_html` mappen

### Step 3: Upload Filerne
1. Gå ind i `public_html` mappen
2. Slet evt. eksisterende `index.html` hvis der er en
3. Klik "Upload Files" knappen
4. Upload alle filerne fra `landing-page/` mappen:
   - `index.html`
   - `styles.css`
   - `script.js`

### Step 4: Test Din Side
1. Åbn en browser
2. Gå til https://nonoise.space
3. Din landing page skulle nu være live! 🎉

---

## Metode 2: FTP Upload (til hurtige updates)

### Setup FTP Account
1. I Hostinger hPanel, find "FTP Accounts"
2. Opret en ny FTP account eller brug hovedkontoen
3. Noter:
   - FTP hostname (f.eks. ftp.nonoise.space)
   - Username
   - Password
   - Port (normalt 21)

### Download FTP Client
- **FileZilla** (anbefalet): https://filezilla-project.org/
- **Cyberduck** (macOS friendly): https://cyberduck.io/

### Upload via FTP
1. Åbn din FTP client
2. Indtast connection details
3. Connect til serveren
4. Find `public_html` mappen
5. Drag & drop dine filer fra `landing-page/` til `public_html`

### Hurtig Update Script
Når du har FTP sat op, kan du bruge denne kommando til hurtige updates:

```bash
cd landing-page
# Brug lftp (installer med: brew install lftp)
lftp ftp://USERNAME:PASSWORD@ftp.nonoise.space -e "mirror -R . public_html; bye"
```

---

## Metode 3: Git Deployment (Bedste løsning for fremtiden)

### Check om Git er tilgængeligt
1. I Hostinger hPanel, søg efter "Git"
2. Hvis tilgængelig, klik "Setup Git"

### Setup Git Deployment
1. Gå til dit GitHub repository
2. Find "Settings" → "Webhooks"
3. I Hostinger Git setup:
   - Connect til GitHub
   - Vælg din Timeline repository
   - Sæt branch til `main`
   - Sæt path til `landing-page/`
   - Enable auto-deploy

### Deploy Updates
Nu kan du bare:
```bash
cd landing-page
git add .
git commit -m "Update landing page"
git push
```

Og Hostinger deployer automatisk! 🚀

---

## Fremtidige Opdateringer

### Quick Update Workflow
1. Edit dine filer i `landing-page/`
2. Test lokalt ved at åbne `index.html` i din browser
3. Upload til Hostinger via:
   - File Manager (drag & drop)
   - FTP (FileZilla)
   - Git (hvis setup)

### Tips
- Lav en backup før store ændringer
- Test altid lokalt først
- Brug browser cache clear (Cmd+Shift+R) hvis ændringer ikke vises
- Check console for JavaScript errors (Cmd+Option+I)

---

## Troubleshooting

### Side viser ikke korrekt
- Clear browser cache (Cmd+Shift+R)
- Check file permissions i Hostinger (skulle være 644 for filer)
- Verificer at alle filer er uploaded

### CSS/JavaScript loader ikke
- Check at filnavne er korrekte (case-sensitive!)
- Verificer at alle filer er i samme mappe som `index.html`

### 404 Error
- Sikr dig at `index.html` er i `public_html` mappen
- Check at filnavnet er `index.html` (ikke Index.html)

---

## Support
Hvis du løber ind i problemer:
1. Check Hostinger's support chat (24/7)
2. Læs Hostinger's dokumentation
3. Check denne fil igen 😊


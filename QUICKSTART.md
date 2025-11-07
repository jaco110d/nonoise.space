# 🚀 Quick Start Guide - nonoise.space

Landing page'n er nu klar! Det hele er sat op som et separat git repository.

## ✅ Hvad er allerede gjort:

1. ✅ Landing page oprettet med HTML/CSS/JS
2. ✅ Git repo oprettet og pushed til `jaco110d/nonoise.space`
3. ✅ Deployment script sat op
4. ✅ Adskilt fra Timeline app'ens hovedrepo

## 📁 Struktur

```
Timeline/                          (timeline app repo)
  └── landing-page/                (separat nonoise.space repo)
      ├── index.html
      ├── styles.css
      ├── script.js
      ├── deploy.sh               (hurtig deploy script)
      ├── README.md               (fuld dokumentation)
      ├── DEPLOY.md               (deployment detaljer)
      └── QUICKSTART.md           (denne fil)
```

## 🌐 Næste Skridt: Connect til Hostinger

### Option 1: GitHub Auto-Deploy (Anbefalet!)

1. **Log ind på Hostinger:**
   - Gå til [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Vælg dit website: **nonoise.space**

2. **Find GitHub Integration:**
   - Søg efter "Git" eller "GitHub" i control panel
   - Eller kig under "Advanced" → "Git"

3. **Connect Repository:**
   - Klik "Connect to GitHub"
   - Autorisér Hostinger
   - Vælg repository: **jaco110d/nonoise.space**
   - Branch: **main**
   - Deploy path: `/public_html` (eller root)
   - Enable **Auto-Deploy**

4. **Deploy:**
   - Klik "Deploy Now"
   - Vent på deployment
   - Gå til https://nonoise.space ✨

### Option 2: Manual File Upload (Hurtig start)

Hvis du vil have siden op hurtigst muligt mens du sætter Git op:

1. I Hostinger File Manager
2. Gå til `public_html`
3. Upload disse filer:
   - `index.html`
   - `styles.css`
   - `script.js`
4. Besøg https://nonoise.space

Senere kan du så sætte GitHub auto-deploy op.

## 🔄 Update Landing Page (når GitHub er connected)

Det er super nemt! Bare kør:

```bash
cd /Users/jacobhartmann/Documents/Timeline/landing-page
./deploy.sh
```

Scriptet vil:
1. Vise dine ændringer
2. Spørge om commit message
3. Commit og push til GitHub
4. Hostinger deployer automatisk! 🎉

Eller manuelt:

```bash
cd /Users/jacobhartmann/Documents/Timeline/landing-page
git add .
git commit -m "Din commit message"
git push origin main
```

## 📝 Rediger Landing Page

1. **Åbn filer i Cursor/VS Code:**
   - `index.html` - for content/struktur
   - `styles.css` - for styling
   - `script.js` - for funktionalitet

2. **Test lokalt:**
   ```bash
   cd landing-page
   open index.html
   ```

3. **Deploy ændringer:**
   ```bash
   ./deploy.sh
   ```

## 🎨 Common Changes

### Ændre Farver
Edit `styles.css` linje 1-8:
```css
:root {
    --primary: #667eea;      /* Din hovedfarve */
    --secondary: #764ba2;    /* Sekundær farve */
}
```

### Ændre Tekst
Edit `index.html` - find sektionen du vil ændre

### Tilføj Billeder
1. Opret `assets/images/` mappe
2. Tilføj dine billeder
3. Reference i HTML: `<img src="assets/images/dit-billede.png">`

## ⚠️ Vigtigt at Huske

- **Landing page** er i sit eget repo: `jaco110d/nonoise.space`
- **Timeline app** er i sit eget repo: `jaco110d/timeline`
- De ligger bare begge i samme folder lokalt for convenience
- Når du pusher fra `landing-page/`, går det til nonoise.space repo
- Når du pusher fra root Timeline mappe, går det til timeline repo

## 🆘 Troubleshooting

**"Not a git repository" fejl:**
```bash
cd /Users/jacobhartmann/Documents/Timeline/landing-page
git status  # Should show nonoise.space repo
```

**Siden opdaterer ikke efter push:**
- Check Hostinger deployment log
- Verify auto-deploy er ON
- Clear browser cache (Cmd+Shift+R)

**Deploy script virker ikke:**
```bash
chmod +x deploy.sh
```

## 📚 Mere Info

- `README.md` - Fuld dokumentation
- `DEPLOY.md` - Detaljeret deployment guide
- [Hostinger Support](https://support.hostinger.com) - 24/7 chat

---

**Klar til at gå live!** Følg "Connect til Hostinger" sektionen ovenfor. 🚀


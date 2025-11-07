# Timeline Landing Page

Landing page for Timeline app hosted at [nonoise.space](https://nonoise.space)

## 🚀 Quick Deploy to Hostinger

Landing page'en er nu på GitHub og kan deployes automatisk til Hostinger.

## Setup Git Deployment på Hostinger

### Step 1: Check om Git er tilgængeligt
1. Log ind på [Hostinger hPanel](https://hpanel.hostinger.com)
2. Vælg dit website: **nonoise.space**
3. Søg efter "Git" i search bar eller kig under "Advanced" sektionen

### Step 2A: Hvis Hostinger har GitHub Integration
Nogle Hostinger planer har direkte GitHub integration:

1. Find **"Git"** eller **"GitHub Deployment"** i menuen
2. Klik **"Connect to GitHub"**
3. Autorisér Hostinger til at få adgang til din GitHub
4. Vælg repository: **jaco110d/timeline**
5. Sæt disse indstillinger:
   - **Branch**: `main`
   - **Deploy path**: `/public_html`
   - **Source folder i repo**: `landing-page/`
   - **Auto-deploy**: ON

6. Klik **"Deploy"**

### Step 2B: Hvis ingen GitHub Integration (Manuel Git)
Hvis din Hostinger plan ikke har GitHub integration, brug denne metode:

1. Åbn **SSH Access** i Hostinger
2. Enable SSH hvis det ikke allerede er aktiveret
3. Connect via terminal:

```bash
ssh username@nonoise.space
cd public_html
git init
git remote add origin https://github.com/jaco110d/timeline.git
git pull origin main
git checkout main
# Copy kun landing-page filerne
cp -r landing-page/* .
rm -rf landing-page/  # Clean up
```

4. Lav et deployment script på serveren (`~/deploy.sh`):

```bash
#!/bin/bash
cd ~/public_html
git pull origin main
cp -r landing-page/* .
echo "Deployed successfully!"
```

5. Gør den executable: `chmod +x ~/deploy.sh`

### Step 3: Test Deployment
1. Gå til https://nonoise.space
2. Din landing page skulle nu være live! 🎉

## 🔄 Update Workflow

Når Git deployment er sat op, er opdateringer super nemme:

```bash
# Edit dine filer i landing-page/
cd landing-page

# Test lokalt
open index.html

# Commit og push
git add .
git commit -m "Update landing page"
git push origin main
```

Hvis du har auto-deploy aktiveret, deployer Hostinger automatisk!

Hvis ikke, log ind på Hostinger og klik "Deploy" eller kør deploy scriptet via SSH.

## 📁 Struktur

```
landing-page/
├── index.html      # Hoved HTML fil
├── styles.css      # Styling
├── script.js       # JavaScript funktionalitet
├── assets/         # Billeder og andre assets
├── DEPLOY.md       # Detaljeret deployment guide
└── README.md       # Denne fil
```

## 🛠 Lokal Udvikling

Test ændringer lokalt før push:

```bash
cd landing-page
open index.html
```

Eller brug en lokal server:

```bash
# Python 3
python3 -m http.server 8000

# Eller brug VS Code Live Server extension
```

Åbn så http://localhost:8000 i din browser.

## 📝 Opdater Content

- **Tekst**: Edit `index.html`
- **Styling**: Edit `styles.css`
- **Funktionalitet**: Edit `script.js`
- **Billeder**: Tilføj til `assets/images/`

## 🎨 Tilpasning

Landing page'n bruger CSS variabler for nem tilpasning:

```css
:root {
    --primary: #667eea;      /* Hoved farve */
    --secondary: #764ba2;    /* Sekundær farve */
    --text-dark: #1a202c;    /* Mørk tekst */
    --text-light: #718096;   /* Lys tekst */
}
```

Edit disse i `styles.css` for at ændre farver.

## 📧 Email Signup

Email signup formen er sat op med en placeholder. For at få det til at virke:

1. **Mailchimp**: Tilføj Mailchimp form action
2. **ConvertKit**: Brug ConvertKit API
3. **Custom Backend**: Opret din egen endpoint
4. **Google Forms**: Integrer Google Forms

Se `script.js` linje 29 for at tilføje din logik.

## 🔍 SEO

Landing page'n inkluderer basic SEO meta tags. Tilføj flere i `<head>`:

```html
<meta property="og:title" content="Timeline - Visualiser Din Tid">
<meta property="og:description" content="...">
<meta property="og:image" content="url-til-preview-billede">
<meta name="twitter:card" content="summary_large_image">
```

## 📊 Analytics (Valgfrit)

Tilføj Google Analytics eller Plausible før `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🐛 Troubleshooting

**Side opdaterer ikke efter push:**
- Clear browser cache (Cmd+Shift+R)
- Check Hostinger deployment log
- Verify auto-deploy er aktiveret

**CSS/JS loader ikke:**
- Check file paths er relative
- Verify alle filer er i samme directory på serveren

**404 Error:**
- Check at filer er i `public_html` mappen
- Verify file permissions (644 for filer, 755 for mapper)

## 🆘 Support

Problemer? Check:
1. [Hostinger Knowledge Base](https://support.hostinger.com)
2. Hostinger Live Chat (24/7)
3. `DEPLOY.md` for flere deployment options


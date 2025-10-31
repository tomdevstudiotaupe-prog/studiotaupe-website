# Notion API Setup Instructies

Om de changelog automatisch van Notion te laden, volg deze stappen:

## Stap 1: Maak een Notion Integratie aan

1. Ga naar [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Klik op **"New integration"**
3. Geef je integratie een naam (bijv. "Website Changelog")
4. Selecteer de juiste workspace
5. Klik op **"Submit"**
6. **BELANGRIJK**: Kopieer het **"Internal Integration Token"** (dit is je API key)

## Stap 2: Deel je Notion pagina met de integratie

1. Open je Notion changelog pagina: [https://www.notion.so/280fbc1018e3800bbb0bfa0bfacc6d6a](https://www.notion.so/280fbc1018e3800bbb0bfa0bfacc6d6a)
2. Klik op **"Share"** (rechtsboven)
3. Typ de naam van je integratie (de naam die je in stap 1 gaf)
4. Voeg de integratie toe met **"Can read"** toegang
5. Klik op **"Invite"**

## Stap 3: Voeg je API token toe aan de website

1. Open het bestand `notion-config.js`
2. Vervang `YOUR_NOTION_API_TOKEN_HERE` met je echte API token (van stap 1)
3. Sla het bestand op

**Voorbeeld:**
```javascript
const NOTION_CONFIG = {
    API_TOKEN: 'secret_abc123xyz...', // Jouw echte token hier
    PAGE_ID: '280fbc1018e3800bbb0bfacc6d6a'
};
```

## Stap 4: Test de integratie

1. Open `beannthere.html` in je browser
2. De changelog zou automatisch moeten laden vanuit Notion
3. Controleer de browser console (F12) voor eventuele foutmeldingen

## Belangrijk: Veiligheid

⚠️ **WAARSCHUWING**: 
- Je API token is gevoelige informatie
- **Zet `notion-config.js` NOOIT in een publieke Git repository**
- Voeg `notion-config.js` toe aan je `.gitignore`
- Voor productie: gebruik een backend server om de Notion API aan te roepen

## Problemen oplossen

### "Notion API not configured"
- Controleer of je API token correct is ingevuld in `notion-config.js`

### "Notion API error: 401"
- Je API token is onjuist of de integratie heeft geen toegang tot de pagina
- Controleer of je de integratie hebt toegevoegd aan de pagina (stap 2)

### "Notion API error: 404"
- De pagina ID is onjuist
- Controleer of de pagina bestaat en toegankelijk is

### CORS errors
- De Notion API kan CORS blokkeren vanuit de browser
- Voor productie: gebruik een backend proxy of server-side rendering

## Alternatief: Backend Proxy

Voor productie websites, maak een eenvoudige backend endpoint die:
1. De Notion API aanroept (server-side, geen CORS issues)
2. De changelog data teruggeeft aan je frontend

Voorbeeld met Node.js:
```javascript
// server.js
const express = require('express');
const app = express();

app.get('/api/changelog', async (req, res) => {
    // Roep Notion API aan
    // Return changelog data
});

app.listen(3000);
```

Dan kun je in `notion-changelog.js` in plaats van direct de Notion API aanroepen, je eigen endpoint gebruiken.


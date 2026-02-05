require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Google Sheets Bağlantısı
let auth;
try {
    // Render'da ENV'den, localde dosyadan okur
    const credentials = process.env.GOOGLE_CREDENTIALS 
        ? JSON.parse(process.env.GOOGLE_CREDENTIALS) 
        : require('./google-credentials.json');

    auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
} catch (error) {
    console.error("Auth Hatası:", error.message);
}

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID; 

// API Endpoint
app.post('/api/save-wallet', async (req, res) => {
    const { username, wallet } = req.body;
    if (!username || !wallet) return res.status(400).json({ success: false, message: 'Eksik bilgi.' });

    try {
        const date = new Date().toLocaleString("tr-TR");
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sayfa1!A:C', // Dikkat: Tablonuzda sayfa adı Sheet1 ise burayı Sheet1 yapın
            valueInputOption: 'USER_ENTERED',
            resource: { values: [[date, username, wallet]] },
        });
        res.json({ success: true, message: 'Kaydedildi!' });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

// Frontend Sunma
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
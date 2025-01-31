const express = require('express');
const i18n = require('i18n');
const app = express();

// Configure i18n
i18n.configure({
    locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    queryParameter: 'lang',
    autoReload: true,
    updateFiles: false
});

// Initialize i18n middleware
app.use(i18n.init);

// Middleware to set locale from query or headers
app.use((req, res, next) => {
    const lang = req.query.lang || req.headers['accept-language']?.split(',')[0] || 'en';
    req.setLocale(lang);
    next();
});

app.get('/api/welcome', (req, res) => {
    res.json({ message: res.__('welcome') });
});

app.listen(3000, () => console.log('Server running on port 3000'));

const express = require('express');
const i18n = require('i18n');
const cors = require('cors');

const app = express();

// Configure i18n
i18n.configure({
    locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    queryParameter: 'lang',
    autoReload: true,
    updateFiles: false,
});

// Middleware
app.use(i18n.init);
app.use(cors());
app.use(express.json());

// Example Route
app.get('/api/welcome', (req, res) => {
    res.json({ message: res.__('welcome') });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ));

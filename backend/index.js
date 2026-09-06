require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const i18n = require('i18n');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');

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

app.use(cors());
app.use(express.json());
app.use(i18n.init);

// Middleware to set locale from query or headers
app.use((req, res, next) => {
    const lang = req.query.lang || req.headers['accept-language']?.split(',')[0] || 'en';
    req.setLocale(lang);
    next();
});

const swaggerSpec = swaggerJsdoc({
    definition: { openapi: '3.0.0' },
    apis: [path.join(__dirname, '../docs/swagger.yaml')],
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/welcome', (req, res) => {
    res.json({ message: res.__('welcome') });
});

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

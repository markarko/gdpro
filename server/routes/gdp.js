const express = require('express')
const router = express.Router()
const { sendData, sendError, containsOnlyLetters } = require('./utils/gdp.js')

router.param('country', (req, res, next, country) => {
    if (!containsOnlyLetters(country)) {
        sendError(res, 400, 'The country name cannot contain numbers or special characters');
        return;
    }

    req.params.country = country.toLowerCase();
    next();
});

router.get('/countries/:country', (req, res) => {
    const country = req.params.country;
    sendData(res, 200, country);
})

module.exports = router;
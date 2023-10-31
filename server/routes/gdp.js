const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const data = [
        {
            'id' : 1,
            'country' : 'USA',
            'gdp' : 20412
        },
        {
            'id' : 2,
            'country' : 'China',
            'gdp' : 14092
        },
        {
            'id' : 3,
            'country' : 'Canada',
            'gdp' : 11212
        }
    ]
    res.send(data);
})

module.exports = router;
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const data = [
        {
            'id' : 1,
            'country' : 'USA',
            'protein' : 74
        },
        {
            'id' : 2,
            'country' : 'China',
            'protein' : 37
        },
        {
            'id' : 3,
            'country' : 'Canada',
            'protein' : 65
        }
    ]
    res.send(data);
})

module.exports = router;
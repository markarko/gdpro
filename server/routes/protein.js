const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the protein route!');
});

module.exports = router;
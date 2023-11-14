/**
 * Express router for managing protein data by country.
 * @module proteinRouter
 */

const express = require('express');
const router = express.Router();
const apiUtils = require('./utils/apiUtils.js');

/**
 * GET handler for getting the protein intake of a specific country
 * TO BE UPDATED
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/random-questions/:number', async (req, res) => {
  
  const questions = req.params.number;
  if (!questions) {
    apiUtils.sendError(res, 400, 'No questions specified');
    return;
  }

  const responseBody = ({
    data: {
      questions: [
        {'Question': 'What is the GDP of the United States?',
          'Answers': ['To have fun', '7', 'something else'],
          'Correct': 'To have fun'},
      ]
    }
  });
  
  apiUtils.sendData(res, 200, responseBody);
});




module.exports = router;
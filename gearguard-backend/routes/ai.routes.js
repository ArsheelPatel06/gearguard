const express = require('express');
const router = express.Router();
const controller = require('../controllers/ai.controller');

router.post('/suggest', controller.getSuggestion);
router.post('/chat', controller.chat);

module.exports = router;

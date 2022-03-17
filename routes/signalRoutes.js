const express = require('express');
const signalsController = require('../controllers/signalsController');

const router = express.Router();

router.get('/get_signals', signalsController.get_signals);
router.post('/subscribe_signal', signalsController.subscribe_signal);
router.post('/unsubscribe_signal', signalsController.unsubscribe_signal);

module.exports = router;
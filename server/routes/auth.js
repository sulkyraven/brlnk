const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
  res.json({code:200, msg:'ok'});
});
router.post('/register', (req, res) => {
  res.json({code:200, msg:'ok'});
});
router.post('/forgot', (req, res) => {
  res.json({code:200, msg:'ok'});
});
router.post('/signout', (req, res) => {
  res.json({code:200, msg:'ok'});
});

module.exports = router;
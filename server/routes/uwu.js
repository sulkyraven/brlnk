const express = require('express');
const { isUser } = require('../js/middlewares');
const huwu = require('../js/handler/huwu');
const router = express.Router();

router.post('/work/item', express.json({limit:"100kb"}), isUser, (req, res) => {
  return res.json(huwu.workItem(req.body, req.session.user.id));
});

router.get('/initial', (req, res) => {
  return res.json(huwu.initial());
});

router.get('/isUser', isUser, (req, res) => {
  return res.json(huwu.getUser(req.session.user.id));
});

module.exports = router;
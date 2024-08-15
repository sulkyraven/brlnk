const express = require('express');
const { isUser } = require('../js/middlewares');
const huwu = require('../js/handler/huwu');
const router = express.Router();

router.post('/work/barang', express.json({limit:"100kb"}), (req, res) => {
  return res.json(huwu.workBarang(req.body));
});

router.get('/isUser', isUser, (req, res) => {
  return res.json(huwu.getUser(req.session.user.id));
});

router.get('/barang', (req, res) => {
  return res.json(huwu.getBarang());
});

router.get('/privs', isUser, (req, res) => {
  return res.json(huwu.getPrivs());
});

module.exports = router;
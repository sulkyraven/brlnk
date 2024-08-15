const express = require('express');
const hauth = require('../js/handler/hauth');

const router = express.Router();

router.use(express.json({limit:"100kb"}));

router.post('/login', (req, res) => {
  return res.json(hauth.login(req.body));
});
router.post('/verify', (req, res) => {
  const getUser = hauth.verify(req.body);
  if(getUser && getUser.code === 200) req.session.user = getUser.data.user;
  return res.json(getUser);
});
router.post('/signout', (req, res) => {
  req.session.destroy();
  res.json({code:200,msg:'ok',data:{step:3}});
});
module.exports = router;
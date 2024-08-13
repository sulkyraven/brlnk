process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(express.static('client'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: ((24 * 60 * 60 * 1000) * 7) },
  store: new FileStore({ path: "./server/sessions", logFn() {} })
}));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.use('/', (req, res) => {
  res.json({status:200,message:'ok'});
});

app.listen(process.env.APP_PORT, () => {
  console.log('>> http://localhost:'+process.env.APP_PORT);
});
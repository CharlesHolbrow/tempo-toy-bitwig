const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const bw = require('./');

const io = new bw.BitwigIO();


app.use('/', express.static(path.join(__dirname, '/static')));
app.use(bodyParser());


app.post('/integrate', (req, res) => {
  console.log(res.body);
  res.setHeader('Content-Type', 'text/plain');
  res.end('ok');
});
app.listen(3001, '127.0.0.1');

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const api = express();
api.use(bodyParser.json());
const sql = require('../lib/sql');
const JWT = require('../lib/jwt');

const Auth = require('./routes/auth');
const User = require('./routes/user');
const Profile = require('./routes/profile');
const Order = require('./routes/order');
const Point = require('./routes/point');


api.get('/', (req, res) => {
  res.json({ status: true })
});

Auth(api);
User(api);
Profile(api);
Order(api);
Point(api);

api.listen(3000, () => {
  console.log('Rest Api  server start at 3000 port')
});


module.exports = api;
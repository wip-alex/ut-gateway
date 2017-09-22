const path = require('path');
const express = require('express');
const api = express.Router();

api.get('/1', (req, res) => {
  res.send('1111');
});

module.exports = api;

const express = require('express');
const router = express.Router();

/* Página principal. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Api de prueba para PSchool.' });
});

module.exports = router;

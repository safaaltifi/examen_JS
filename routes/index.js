var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Gestion des Réservations de Villas',
    description: 'Application de gestion des réservations avec Node.js, Express et MongoDB'
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { validateReservation } = require('../middleware/validation');
const {
  addReservation,
  getAllReservations,
  deleteReservation,
  updateReservation,
  searchByNom,
  searchByCin,
  getStats
} = require('../controllers/reservationController');

// Routes pour les réservations

// GET /reservations/stats - doit être avant les autres routes avec paramètres
router.get('/stats', getStats);

// GET /reservations/search/:nom - recherche par nom
router.get('/search/:nom', searchByNom);

// GET /reservations/cin/:cin - recherche par CIN
router.get('/cin/:cin', searchByCin);

// POST /reservations - ajouter une réservation
router.post('/', validateReservation, addReservation);

// GET /reservations - afficher toutes les réservations
router.get('/', getAllReservations);

// DELETE /reservations/:id - supprimer une réservation
router.delete('/:id', deleteReservation);

// PUT /reservations/:id - modifier une réservation
router.put('/:id', validateReservation, updateReservation);

module.exports = router;

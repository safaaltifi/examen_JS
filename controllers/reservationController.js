const Reservation = require('../models/Reservation');

// Ajouter une réservation
const addReservation = async (req, res) => {
  try {
    // Définir le statut par défaut
    if (!req.body.statut) {
      req.body.statut = 'en attente';
    }
    
    const reservation = new Reservation(req.body);
    const savedReservation = await reservation.save();
    
    // Émettre notification Socket.IO si disponible
    if (req.io) {
      req.io.emit('reservationAdded', savedReservation);
    }
    
    res.status(201).json({
      message: 'Réservation créée avec succès',
      reservation: savedReservation
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: ['Ce CIN existe déjà dans le système']
      });
    }
    res.status(500).json({
      error: ['Erreur serveur lors de la création de la réservation']
    });
  }
};

// Afficher toutes les réservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      error: ['Erreur lors de la récupération des réservations']
    });
  }
};

// Supprimer une réservation
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await Reservation.findByIdAndDelete(id);
    
    if (!deletedReservation) {
      return res.status(404).json({
        error: ['Réservation non trouvée']
      });
    }
    
    // Émettre notification Socket.IO si disponible
    if (req.io) {
      req.io.emit('reservationDeleted', { id });
    }
    
    res.json({
      message: 'Réservation supprimée avec succès',
      reservation: deletedReservation
    });
  } catch (error) {
    res.status(500).json({
      error: ['Erreur lors de la suppression de la réservation']
    });
  }
};

// Modifier une réservation
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedReservation) {
      return res.status(404).json({
        error: ['Réservation non trouvée']
      });
    }
    
    // Émettre notification Socket.IO si disponible
    if (req.io) {
      req.io.emit('reservationUpdated', updatedReservation);
    }
    
    res.json({
      message: 'Réservation modifiée avec succès',
      reservation: updatedReservation
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: ['Ce CIN existe déjà dans le système']
      });
    }
    res.status(500).json({
      error: ['Erreur lors de la modification de la réservation']
    });
  }
};

// Rechercher par nom de client
const searchByNom = async (req, res) => {
  try {
    const { nom } = req.params;
    const reservations = await Reservation.find({
      nom_client: { $regex: nom, $options: 'i' }
    }).sort({ createdAt: -1 });
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      error: ['Erreur lors de la recherche par nom']
    });
  }
};

// Rechercher par CIN
const searchByCin = async (req, res) => {
  try {
    const { cin } = req.params;
    const reservations = await Reservation.find({ cin }).sort({ createdAt: -1 });
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      error: ['Erreur lors de la recherche par CIN']
    });
  }
};

// Statistiques générales
const getStats = async (req, res) => {
  try {
    // Nombre total de réservations
    const reservation_total = await Reservation.countDocuments();
    
    // Toutes les réservations pour calculer les statistiques
    const reservations = await Reservation.find();
    
    let montant_total = 0;
    let meilleure_reservation = null;
    let meilleur_montant = 0;
    
    reservations.forEach(reservation => {
      const montant = reservation.getMontantTotal();
      montant_total += montant;
      
      if (montant > meilleur_montant) {
        meilleur_montant = montant;
        meilleure_reservation = reservation;
      }
    });
    
    res.json({
      reservation_total,
      meilleur_reservation_villa_ref: meilleure_reservation ? meilleure_reservation.reference_villa : null,
      montant_total: `${montant_total} DT`
    });
  } catch (error) {
    res.status(500).json({
      error: ['Erreur lors du calcul des statistiques']
    });
  }
};

module.exports = {
  addReservation,
  getAllReservations,
  deleteReservation,
  updateReservation,
  searchByNom,
  searchByCin,
  getStats
};

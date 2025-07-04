const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  nom_client: {
    type: String,
    required: true,
    trim: true
  },
  cin: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  nombre_personnes: {
    type: Number,
    required: true,
    min: 1
  },
  prix_par_nuit: {
    type: Number,
    required: true,
    min: 1
  },
  date_arrivee: {
    type: Date,
    required: true
  },
  date_depart: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > this.date_arrivee;
      },
      message: 'La date de départ doit être après la date d\'arrivée'
    }
  },
  statut: {
    type: String,
    required: true,
    enum: ['confirmée', 'annulée', 'en attente'],
    default: 'en attente'
  },
  reference_villa: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Méthode pour calculer le nombre de nuits
reservationSchema.methods.getNombreNuits = function() {
  const diffTime = Math.abs(this.date_depart - this.date_arrivee);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Méthode pour calculer le montant total
reservationSchema.methods.getMontantTotal = function() {
  return this.prix_par_nuit * this.getNombreNuits();
};

module.exports = mongoose.model('Reservation', reservationSchema);

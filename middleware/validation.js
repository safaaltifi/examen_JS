const yup = require('yup');

const reservationSchema = yup.object().shape({
  nom_client: yup
    .string()
    .required('nom_client is a required field')
    .trim(),
  
  cin: yup
    .string()
    .required('cin is a required field')
    .trim(),
    
  email: yup
    .string()
    .email('email must be a valid email')
    .required('email is a required field'),
    
  nombre_personnes: yup
    .number()
    .positive('nombre_personnes must be greater than 0')
    .integer('nombre_personnes must be an integer')
    .required('nombre_personnes is a required field'),
    
  prix_par_nuit: yup
    .number()
    .positive('prix_par_nuit must be greater than 0')
    .required('prix_par_nuit is a required field'),
    
  date_arrivee: yup
    .date()
    .required('date_arrivee is a required field'),
    
  date_depart: yup
    .date()
    .required('date_depart is a required field')
    .min(yup.ref('date_arrivee'), 'date_depart must be after date_arrivee'),
    
  statut: yup
    .string()
    .oneOf(['confirmée', 'annulée', 'en attente'], 'statut must be one of: confirmée, annulée, en attente')
    .default('en attente'),
    
  reference_villa: yup
    .string()
    .required('reference_villa is a required field')
    .trim()
});

const validateReservation = async (req, res, next) => {
  try {
    // Valider les données
    const validatedData = await reservationSchema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    // Remplacer req.body par les données validées
    req.body = validatedData;
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: error.errors
      });
    }
    next(error);
  }
};

module.exports = {
  validateReservation
};

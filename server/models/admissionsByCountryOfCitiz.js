const mongoose = require("mongoose");

const admissionsByCountryOfCitizSchema = new mongoose.Schema({
  EN_YEAR: Number,
  EN_QUARTER: String,
  EN_MONTH: String,
  FR_ANNEÉ: Number,
  FR_TRIMESTRE: String,
  FR_MOIS: String,
  EN_COUNTRY_OF_CITIZENSHIP: String,
  FR_PAYS_DE_CITOYENNETÉ: String,
  TOTAL: Number
});

const admissionsByCountryOfCitiz = mongoose.model("admissionsByCountryOfCitiz", admissionsByCountryOfCitizSchema, "admissionsByCountryOfCitiz");

module.exports = admissionsByCountryOfCitiz;

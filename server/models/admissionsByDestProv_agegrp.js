const mongoose = require("mongoose");

const admissionsByDestProv_agegrpSchema = new mongoose.Schema({
  EN_YEAR: Number,
  EN_QUARTER: String,
  EN_MONTH: String,
  FR_ANNEÉ: Number,
  FR_TRIMESTRE: String,
  FR_MOIS: String,
  EN_PROVINCE_TERRITORY:String,
  FR_PROVINCE_TERRITOIRE:String,
  EN_AGE:String,
  FR_ÂGE:String,
  TOTAL: Number
});

const admissionsByDestProv_agegrp = mongoose.model("admissionsByDestProv_agegrp", admissionsByDestProv_agegrpSchema, "admissionsByDestProv_agegrp");

module.exports = admissionsByDestProv_agegrp;

const mongoose = require("mongoose");

const admissionsByDestProv_genderSchema = new mongoose.Schema({
  EN_YEAR: Number,
  EN_QUARTER: String,
  EN_MONTH: String,
  FR_ANNEÉ: Number,
  FR_TRIMESTRE: String,
  FR_MOIS: String,
  EN_PROVINCE_TERRITORY:String,
  FR_PROVINCE_TERRITOIRE:String,
  EN_GENDER:String,
  FR_SEXE:String,
  TOTAL: Number
});

const admissionsByDestProv_gender = mongoose.model("admissionsByDestProv_gender", admissionsByDestProv_genderSchema, "admissionsByDestProv_gender");

module.exports = admissionsByDestProv_gender;

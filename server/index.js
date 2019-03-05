const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const SERVER_PORT = 2222;

const DB_URI = "mongodb+srv://maplepr_admin:maplepr_admin@cluster0-3p7g3.mongodb.net/maplepr?retryWrites=true";
const MONGOOSE_OPTIONS = {
  useNewUrlParser: true
}

mongoose.Promise = Promise;
mongoose.connect(DB_URI, MONGOOSE_OPTIONS)
.then(() => console.log("Database Connected"));

const admissionsByCountryOfCitiz = require('./models/admissionsByCountryOfCitiz');

app.use(bodyParser.json());

app.get('/api/admissionsByCountryOfCitiz', async(req, res) => {
  data = await admissionsByCountryOfCitiz.find();
  res.send(data);
  console.log('/api/products' + ' response sent');
});

app.listen(SERVER_PORT, () => console.log("Server listening at port: " + SERVER_PORT));

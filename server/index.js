const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const SERVER_PORT = 2222;

const byCountryRoute = require("./routes/byCountry.routes");
const byGenderRoute = require("./routes/byGender.routes");
const byAgeGroupRoute = require("./routes/byAgeGroup.routes");

const DB_URI = "mongodb+srv://maplepr_admin:maplepr_admin@cluster0-3p7g3.mongodb.net/maplepr?retryWrites=true";
const MONGOOSE_OPTIONS = {
  useNewUrlParser: true
}

mongoose.Promise = Promise;
mongoose.connect(DB_URI, MONGOOSE_OPTIONS)
.catch((error) => console.error(error))
.then(() => console.log("Database Connected"));


app.use(morgan("combined")); // middleware for logging http requests in terminal
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

app.use('/api/byCountry', byCountryRoute);
app.use('/api/byGender', byGenderRoute);
app.use('/api/byAgeGroup', byAgeGroupRoute);

app.listen(SERVER_PORT, () => console.log("Server listening at port: " + SERVER_PORT));

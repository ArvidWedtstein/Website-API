const mongoose = require('mongoose')
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')
var helmet = require('helmet')

require('dotenv').config();


// routes
const authRouter = require("./routes/authRouter");
const projectRouter = require("./routes/projectRouter");
const newsRouter = require("./routes/newsRouter");

const app = express();
app.use(helmet())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'));

var allowlist = ["http://localhost:3000", "https://nuxtarvidw.netlify.app"]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", 'https://nuxtarvidw.netlify.app')
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  next();
});
//app.use(authenticateMiddleware);


// Router //
app.use("/api/auth", authRouter);
app.use("/api/project", projectRouter);
app.use("/api/news", newsRouter);


app.use((error, req, res, next) => {
    console.log(error.message);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });
// Connect to MongoDB
var MONGOOSE_URI = process.env.MONGODB_URL;
if (MONGOOSE_URI) {
    mongoose.connect(MONGOOSE_URI).then(function (result) {
        app.listen(process.env.PORT || 8080);
    }).catch((err) => { return console.log(err); });
    mongoose.Promise = global.Promise;
}
console.log(`API is now (barely) running on localhost:${process.env.PORT || 8080}`);
/* Email */
// https://dashboard.emailjs.com/admin

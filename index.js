const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoClient } = require('mongodb')
var cors = require('cors')
const path = require('path');
const jwt = require("jsonwebtoken");
var helmet = require('helmet')
const fs = require('fs')

require('dotenv').config();
// routes
const authRouter = require("./routes/authRouter");
const projectRouter = require("./routes/projectRouter");
const newsRouter = require("./routes/newsRouter");

const app = express();
//app.use(cors({origin: "*"}))
app.use(helmet())
//app.disable('x-powered-by')
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'));

var allowlist = ['https://nuxt.arvidw.space', 'https://arvidw.space', 'https://nuxt.arvidw.space/auth/register', "http://localhost:3000"]
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
  // res.setHeader("Access-Control-Allow-Origin", 'https://nuxt.arvidw.space')
  res.setHeader("Access-Control-Allow-Origin", 'https://nuxtarvidw.netlify.app')
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  // res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
const MONGOOSE_URI = process.env.MONGODB_URL;
mongoose.connect(MONGOOSE_URI).then((result) => {
    app.listen(process.env.PORT || 8080);
}).catch((err) => console.log(err));
mongoose.Promise = global.Promise;


/* Email */
// https://dashboard.emailjs.com/admin



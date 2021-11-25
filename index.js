const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const path = require('path');


const fs = require('fs')

require('dotenv').config();
// routes
const authRouter = require("./routes/authRouter");
const projectRouter = require("./routes/projectRouter");
const newsRouter = require("./routes/newsRouter");

const app = express();
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
/* https://github.com/mohammadali0120/nuxt-express-mongodb-authentication/blob/main/frontend/components/User/index.vue*/
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


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


/* Email */
// https://dashboard.emailjs.com/admin



"use strict";
exports.__esModule = true;
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var mongoose_1 = require("mongoose");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
require('dotenv').config();
// routes
var authRouter = require("./routes/authRouter");
var projectRouter = require("./routes/projectRouter");
var newsRouter = require("./routes/newsRouter");
var app = (0, express_1["default"])();
app.use((0, helmet_1["default"])()); // Don't forget to wear a helmet
app.use(body_parser_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.use('/uploads', express_1["default"].static('uploads'));
var allowlist = ["http://localhost:3000", "https://nuxtarvidw.netlify.app"];
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    }
    else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use((0, cors_1["default"])(corsOptionsDelegate));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", 'https://nuxtarvidw.netlify.app');
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    next();
});
/* Routes */
app.use("/api/auth", authRouter);
app.use("/api/project", projectRouter);
app.use("/api/news", newsRouter);
app.use(function (error, req, res, next) {
    console.log(error.message);
    var status = error.statusCode || 500;
    var message = error.message;
    var data = error.data;
    res.status(status).json({ message: message, data: data });
});
// Connect to MongoDB
var MONGOOSE_URI = process.env.MONGODB_URL;
if (MONGOOSE_URI) {
    mongoose_1["default"].connect(MONGOOSE_URI).then(function (result) {
        app.listen(process.env.PORT || 8080);
    })["catch"](function (err) { return console.log(err); });
    mongoose_1["default"].Promise = global.Promise;
}
console.log('API is now (barely) running');
/* Email */
// https://dashboard.emailjs.com/admin

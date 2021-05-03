var express = require("express");
var recepieRouter = require("./recepie");

var app = express();

app.use("/recepie/", recepieRouter);

module.exports = app;
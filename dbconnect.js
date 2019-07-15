const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const url = "mongodb+srv://admin:1029384756@cluster0-zlmum.mongodb.net/test?retryWrites=true&w=majority";

const connect = mongoose.connect(url, { useNewUrlParser: true });

module.exports = connect;

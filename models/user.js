var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');


var schema= new mongoose.Schema({
    username: String,
    password: String,
})

schema.plugin(passportLocalMongoose)

module.exports = mongoose.model('user',schema);
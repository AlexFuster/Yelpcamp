var mongoose = require('mongoose');

module.exports = mongoose.model('comment', {
    text: String,
    author: String,
});
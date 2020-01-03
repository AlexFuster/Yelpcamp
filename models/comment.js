var mongoose = require('mongoose');

module.exports = mongoose.model('comment', {
    text: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
});
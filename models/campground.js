var mongoose = require('mongoose');

module.exports = mongoose.model('campground', {
    name: String,
    image: String,
    description: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }]
});
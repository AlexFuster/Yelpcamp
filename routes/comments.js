var express = require("express"),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    isLoggedIn = require('./utils');

var router = express.Router({mergeParams:true});



router.get('/new',isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id)
        .then((campground)=>{res.render('comments/new',{campground:campground})})
        .catch(()=>{console.log('could not get the comment creation form')});
});

router.post('/',isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id)
        .then((campground)=>{
            Comment.create(req.body.comment)
                .then((comment)=>{
                    console.log('comment created');
                    comment.author={
                        id: req.user._id,
                        username: req.user.username
                    };
                    comment.save()
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+campground._id);
                });
        });
});

module.exports = router
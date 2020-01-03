var express = require("express"),
    Campground = require('../models/campground'),
    isLoggedIn = require('./utils');

var router = express.Router();

router.get('/',(req,res)=>{
    Campground.find({})
        .then((campgrounds)=>{res.render('campgrounds/campgrounds',{campgrounds:campgrounds})})
        .catch(()=>{console.log('could not retrieve campgrounds from database')});
});

router.post('/',isLoggedIn,(req,res)=>{
    Campground.create({name:req.body.name,image:req.body.img,description:req.body.description,author:{id:req.user._id,username:req.user.username}})
        .then(()=>{console.log('Campground created')})
        .catch(()=>{console.log('Error at Campground creation')});
    res.redirect('/campgrounds');
});

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new');
});

router.get('/:id',(req,res)=>{
    Campground.findById(req.params.id).populate('comments')
        .then((campground)=>{res.render('campgrounds/show',{campground:campground})})
        .catch(()=>{console.log('could not retrieve campgrounds from database')});
});

module.exports = router

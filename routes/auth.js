var express = require("express")
    passport = require('passport'),
    User = require('../models/user');

var router = express.Router();

router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',(req,res)=>{
    User.register(new User({username:req.body.username}),req.body.password)
        .then((user)=>{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/campgrounds');
            })
        })
        .catch(()=>{
            res.render('/register');
        })
})

router.get('/login',(req,res)=>{
    res.render('login')
});

router.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}), (req,res)=>{});

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/campgrounds');
});

module.exports = router
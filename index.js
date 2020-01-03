var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    seedDB = require('./seeds'),
    passport = require('passport'),
    LocalStrategy =  require('passport-local'),
    User = require('./models/user'),
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    authRoutes = require('./routes/auth');

app.use(require('body-parser').urlencoded({extended:true}));
app.use(require('express-session')({
    secret: 'my secret string',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

mongoose.connect('mongodb://localhost/yelp_camp', {useUnifiedTopology: true,useNewUrlParser: true});
seedDB();

app.use((req,res,next)=>{
    res.locals.currUser=req.user;
    next();
})

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use(authRoutes);

app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));

app.get('/',(req,res)=>{
    res.render('home');
});

app.listen(3000,'localhost',()=>{
    console.log('Yelpcamp listening in port 3000');
});

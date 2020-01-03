var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds'),
    passport = require('passport'),
    LocalStrategy =  require('passport-local'),
    User = require('./models/user');

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

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.use((req,res,next)=>{
    res.locals.currUser=req.user;
    next();
})

app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/campgrounds',(req,res)=>{
    Campground.find({})
        .then((campgrounds)=>{res.render('campgrounds/campgrounds',{campgrounds:campgrounds})})
        .catch(()=>{console.log('could not retrieve campgrounds from database')});
});

app.post('/campgrounds',(req,res)=>{
    Campground.create({name:req.body.name,image:req.body.img,description:req.body.description})
        .then(()=>{console.log('Campground created')})
        .catch(()=>{console.log('Error at Campground creation')});
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id',(req,res)=>{
    Campground.findById(req.params.id).populate('comments')
        .then((campground)=>{res.render('campgrounds/show',{campground:campground})})
        .catch(()=>{console.log('could not retrieve campgrounds from database')});
});

app.get('/campgrounds/:id/comments/new',isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id)
        .then((campground)=>{res.render('comments/new',{campground:campground})})
        .catch(()=>{console.log('could not get the comment creation form')});
});

app.post('/campgrounds/:id/comments',isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id)
        .then((campground)=>{
            Comment.create(req.body.comment)
                .then((comment)=>{
                    console.log('comment created');
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+campground._id);
                });
        });
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',(req,res)=>{
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

app.get('/login',(req,res)=>{
    res.render('login')
});

app.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}), (req,res)=>{});

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/campgrounds');
});

app.listen(3000,'localhost',()=>{
    console.log('Yelpcamp listening in port 3000');
});

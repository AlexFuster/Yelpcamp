var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds');

app.use(require('body-parser').urlencoded({extended:true}));
mongoose.connect('mongodb://localhost/yelp_camp', {useUnifiedTopology: true,useNewUrlParser: true});
seedDB()

app.set('view engine','ejs')
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

app.get('/campgrounds/:id/comments/new',(req,res)=>{
    Campground.findById(req.params.id)
        .then((campground)=>{res.render('comments/new',{campground:campground})})
        .catch(()=>{console.log('could not get the comment creation form')});
});


app.post('/campgrounds/:id/comments',(req,res)=>{
    Campground.findById(req.params.id)
        .then((campground)=>{
            Comment.create({author:req.body.author,text:req.body.text})
                .then((comment)=>{
                    console.log('comment created');
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+campground._id);
                });
        });
});


app.listen(3000,'localhost',()=>{
    console.log('Yelpcamp listening in port 3000');
});

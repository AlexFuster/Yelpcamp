var app=require('express')();
const mongoose = require('mongoose');
app.use(require('body-parser').urlencoded({extended:true}));
mongoose.connect('mongodb://localhost/yelp_camp', {useUnifiedTopology: true,useNewUrlParser: true});

const Campground = mongoose.model('campground', { name: String, image: String, description: String});



app.set('view engine','ejs')
app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/campgrounds',(req,res)=>{
    Campground.find({})
        .then((campgrounds)=>{res.render('campgrounds',{campgrounds:campgrounds})})
        .catch(()=>{console.log('could not retrieve campgrounds from database')});
});



app.post('/campgrounds',(req,res)=>{
    Campground.create({name:req.body.name,image:req.body.img,description:req.body.description})
        .then(()=>{console.log('Campground created')})
        .catch(()=>{console.log('Error at Campground creation')});
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new',(req,res)=>{
    res.render('new');
});

app.get('/campgrounds/:id',(req,res)=>{
    Campground.findById(req.params.id)
        .then((campground)=>{res.render('show',{campground:campground})})
        .catch(()=>{console.log('could not retrieve campgrounds from database')});
});

app.listen(3000,'localhost',()=>{
    console.log('Yelpcamp listening in port 3000');
});





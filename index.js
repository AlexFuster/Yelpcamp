var app=require('express')();
app.use(require('body-parser').urlencoded({extended:true}));
var campgrounds=[
    {name:'AAA',image:'https://via.placeholder.com/150/A00'},
    {name:'BBB',image:'https://via.placeholder.com/150/00A'},
    {name:'CCC',image:'https://via.placeholder.com/150/0A0'},
    {name:'DDD',image:'https://via.placeholder.com/150/AA0'},
    {name:'AAA',image:'https://via.placeholder.com/150/A00'},
    {name:'BBB',image:'https://via.placeholder.com/150/00A'},
    {name:'CCC',image:'https://via.placeholder.com/150/0A0'},
    {name:'DDD',image:'https://via.placeholder.com/150/AA0'},
    {name:'AAA',image:'https://via.placeholder.com/150/A00'}
];

app.set('view engine','ejs')
app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/campgrounds',(req,res)=>{
    res.render('campgrounds',{campgrounds:campgrounds});
});

app.post('/campgrounds',(req,res)=>{
    campgrounds.push({
        name:req.body.name,
        image:req.body.img
    });
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new',(req,res)=>{
    res.render('new');
});

app.listen(3000,'localhost',()=>{
    console.log('Yelpcamp listening in port 3000');
});





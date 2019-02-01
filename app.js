var express = require('express');
var mysql = require('mysql');
var faker = require('faker');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 8080;

var connection  = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'join_us'
});

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

//Homepage Route 
app.get('/',function(req,res){
    var q  = 'SELECT COUNT(*) AS count FROM users';
    connection.query(q,function(err,results){
        if(err) throw err;
        var count = results[0].count;
        // res.send('You have '+ count + ' users in your database!');
        res.render('home',{count:count});
    });
});


//Post Route to /register
app.post('/register',function(req,res){
var person = {
    email: req.body.email
    };
    connection.query('INSERT INTO users SET ?',person,function(err,results){
        if(err) throw err;
        res.redirect('/');
    });
});



//Add fake users to database
app.get('/addUser',function(req,res){
    var data = [];
    data.push([
        faker.internet.email(),
        faker.date.past()
    ]);
    var qF = 'INSERT INTO users(email,created_at) VALUES ?';
    connection.query(qF,[data],function(err,results){
        res.send('You have added a new user!');
    });
});

// Add 500 fake users to database 
app.get('/add500',function(req,res){
    var data = [];
    for(var i = 0; i<500; i++){
        data.push([
            faker.internet.email(),
            faker.date.past()
        ]);
    }
    var qF = 'INSERT INTO users(email,created_at) VALUES ?';
    connection.query(qF,[data],function(err,results){
        res.send('Congratulations! You have added 500 new users!');
    });
});

//Display all users 
app.get('/list500',function(req,res){
var list500 = 'SELECT email FROM users;';
connection.query(list500,function(err,results){
        if(err) throw err;
        for(var i = 0; i<507;i++){
            console.log(results[i].email);
        }
        res.send('It worked!');
    });
});

//  A casual route to get a joke 
app.get('/joke',function(req,res){
var joke = 'This is a very basic joke';
res.send(joke);
});

// Generate a random number between 1 to 10
app.get('/random_num',function(req,res){
var num = Math.floor(Math.random() * 10 + 1);
res.send('Your luck number is: '+ num);
});

//Gets the number of the users from the database! 
// app.get('/users',function(req,res){
// var q = 'SELECT COUNT(*) AS count FROM users;';
// connection.query(q,function(err,results){
//     if(err) throw err;
//     var count = results[0].count;
//     res.send('You have '+ count + ' users in your database!');
//     });
// });


//Express server listening on port number 8080
app.listen(port,function(){
    console.log('App listening on port:8080');
});


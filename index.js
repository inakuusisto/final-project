const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const functions = require('./models/models.js');

if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
}

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(cookieSession({
    secret: 'funny string',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public/'));


app.post('/register', function(req, res) {
    console.log('tämä on request', req.body);
    //
    // functions.hashPassword(req.body.password).then(function(hash) {
    //     functions.addUserData(req.body.first, req.body.last, req.body.email, hash).then(function(results) {
    //         // console.log(results);
    //         // console.log(req.body);
    //         req.session.user = {
    //             userId: results.rows[0].id,
    //             firstName: req.body.first,
    //             lastName: req.body.last,
    //             email: req.body.email
    //         };
    //         res.json({
    //             success: true
    //         });
    //     }).catch(function(err){
    //         res.status(500).json({ err: 'Failure'});
    //     });
    // }).catch(function(err){
    //     res.status(500).json({ err: 'Failure'});
    // });
});





app.listen(8080, function() {
    console.log("I'm listening.")
});

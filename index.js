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
    // res.redirect('/home');
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public/'));


app.get('/profile', function(req,res) {
    if (!req.session.user) {
        res.redirect('/home');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});


app.post('/register', function(req, res) {
    // console.log('tämä on request', req.body);

    functions.hashPassword(req.body.password).then(function(hash) {
        functions.addOrganisationData(req.body.name, req.body.contactFirst, req.body.contactLast, req.body.email, hash).then(function(results) {
            // console.log(results);
            // console.log(req.body);
            req.session.user = {
                organisationId: results.rows[0].id,
                name: req.body.name,
                contactFirst: req.body.contactFirst,
                contactLast: req.body.contactLast,
                email: req.body.email
            };
            res.json({
                success: true
            });
        }).catch(function(err){
            res.status(500).json({ err: 'Failure'});
        });
    }).catch(function(err){
        res.status(500).json({ err: 'Failure'});
    });
});


app.post('/login', function(req, res) {
    // console.log('tämä on request', req.body);

    functions.getOrganisationData(req.body.email).then(function(results) {
        functions.checkPassword(req.body.password, results.rows[0].password).then(function(doesMatch) {
            if (doesMatch) {
                console.log('#######match')
                req.session.user = {
                    organisationId: results.rows[0].id,
                    name: results.rows[0].name,
                    contactFirst: results.rows[0].contact_first,
                    contactLast: results.rows[0].contact_last,
                    email: results.rows[0].email
                };
                res.json({
                    success: true
                });
            } else {
                res.status(500).json({ err: 'Failure'});
            }
        }).catch(function(err){
            res.status(500).json({ err: 'Failure'});
        });

    }).catch(function(err){
        res.status(500).json({ err: 'Failure'});
    });
});


app.get('/organisation', function(req, res) {
    functions.getOrganisationData(req.session.user.email).then(function(results) {
        console.log('These are the results', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(function(err) {
        console.log(err);
    });
});


// app.get('*', function(req, res) {
//     res.redirect('/home');
//     res.sendFile(__dirname + '/index.html');
// });


app.listen(8080, function() {
    console.log("I'm listening.")
});

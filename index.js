const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const functions = require('./models/models.js');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const awsS3Url = "https://s3.amazonaws.com/inafinal";
const csurf = require('csurf');

//      SETUP

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


app.use(csurf());
app.use(function(req, res, next){
    res.cookie('t', req.csrfToken());
    next();
});


app.use(express.static(__dirname + '/public/'));


var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});



//      Routes


app.get('/home', function(req, res){
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.get('/', function(req,res) {
    if (!req.session.user) {
        res.redirect('/home');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});


app.get('/posts', function(req, res) {
    functions.getPostsAndInfo().then(function(data) {
        for (var i=0; i<data.rows.length; i++) {
            if (data.rows[i].image) {
                data.rows[i].image = awsS3Url + '/' + data.rows[i].image;
            }
        }
        res.json(data.rows);
    }).catch(function(err) {
        console.log(err);
    });
});


app.post('/message', function (req, res) {
    console.log('#####', req.body);
    functions.addMessage(req.body.organisationId, req.body.senderName, req.body.senderEmail, req.body.subject, req.body.privateMessage, 1).then(function() {
        res.json({
            success: true
        });
    }).catch(function(err) {
        console.log(err);
    });
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
        res.json(results.rows[0]);
    }).catch(function(err) {
        console.log(err);
    });
});


app.get('/ownposts', function(req, res) {
    functions.getOwnPosts(req.session.user.organisationId).then(function(data) {
        for (var i=0; i<data.rows.length; i++) {
            if (data.rows[i].image) {
                data.rows[i].image = awsS3Url + '/' + data.rows[i].image;
            }
        }
        res.json(data.rows);
    }).catch(function(err) {
        console.log(err);
    });
});


app.post('/address', function(req, res) {
    functions.updateAddress(req.body.address, req.session.user.organisationId).then(function(results) {
        res.json({
            success: true,
            address: results.rows[0].address
        });
    }).catch(function(err) {
        console.log(err);
    });
});


app.post('/url', function(req, res) {
    functions.updateUrl(req.body.url, req.session.user.organisationId).then(function(results) {
        res.json({
            success: true,
            url: results.rows[0].url
        });
    }).catch(function(err) {
        console.log(err);
    });
});


app.post('/about', function(req, res) {
    functions.updateAbout(req.body.about, req.session.user.organisationId).then(function(results) {
        res.json({
            success: true,
            about: results.rows[0].about
        });
    }).catch(function(err) {
        console.log(err);
    });
});


app.post('/upload', uploader.single('file'), function(req, res) {

    if (req.file) {
        functions.sendFile(req.file).then(function() {
            res.json({
                success: true,
                fileName: req.file.filename
            });
            functions.addImgToDb(req.file.filename, req.body.organisationId);
        }).catch(function(err){
            res.status(500).json({ err: 'Failure'});
        });
    } else {
        res.status(500).json({ err: 'Failure'});
    }
});


app.post('/post', function (req, res) {
    // console.log(req.body);
    functions.addPost(req.body.organisationId, req.body.description, req.body.message).then(function(results) {
        functions.getOwnPosts(req.body.organisationId).then(function(data) {
            for (var i=0; i<data.rows.length; i++) {
                if (data.rows[i].image) {
                    data.rows[i].image = awsS3Url + '/' + data.rows[i].image;
                }
            }
            res.json({
                success: true,
                description: req.body.description,
                message: req.body.message,
                data: data.rows
            });
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err) {
        console.log(err);
    });
});


app.post('/delete', function(req, res) {
    functions.deletePost(req.body.postId).then(function(results) {
        functions.getOwnPosts(results.rows[0].organisation_id).then(function(data) {
            for (var i=0; i<data.rows.length; i++) {
                if (data.rows[i].image) {
                    data.rows[i].image = awsS3Url + '/' + data.rows[i].image;
                }
            }
            res.json(data.rows);
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err) {
        console.log(err);
    });
});


app.get('/privatemessages', function(req, res) {
    functions.getPrivateMessages(req.session.user.organisationId).then(function(data) {
        console.log(data);
        res.json(data.rows);
    }).catch(function(err) {
        console.log(err);
    });
});


app.post('/messageread', function (req, res) {
    functions.updateMessageStatus(req.body.status, req.body.messageId).then(function(data) {
        functions.getPrivateMessages(req.session.user.organisationId).then(function(data) {
            res.json({
                success: true,
                messages: data.rows
            });
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err) {
        console.log(err);
    });
});


app.post('/deletemessage', function(req, res) {
    functions.deleteMessage(req.body.messageId).then(function(results) {
        functions.getPrivateMessages(results.rows[0].organisation_id).then(function(data) {
            res.json(data.rows);
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err) {
        console.log(err);
    });
});


app.get('/logout', function(req, res) {
    req.session = null;
    res.redirect('/home');
});


app.get('*', function(req, res) {
    if(!req.session.user) {
        res.redirect('/home');
    }
    res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 8080, function() {console.log('listening');});

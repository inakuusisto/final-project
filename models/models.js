const spicedPg = require('spiced-pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const knox = require('knox');
let secrets;

var db = spicedPg(process.env.DATABASE_URL || `postgres:${require('../secrets.json').name}:${require('../secrets.json').pass}@localhost:5432/final`);

if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('../secrets.json');
}
const client = knox.createClient({
    key: secrets.AWS_KEY || process.env.AWS_KEY,
    secret: secrets.AWS_SECRET || process.env.AWS_SECRET,
    bucket: 'inafinal'
});


function hashPassword(password) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}


function addOrganisationData (name, contactFirst, contactLast, email, password) {
    return db.query('INSERT INTO organisations(name, contact_first, contact_last, email, password) values($1, $2, $3, $4, $5) returning id',
        [name, contactFirst, contactLast, email, password]);
}

function getOrganisationData (email) {
    return db.query('SELECT * FROM organisations WHERE email=$1', [email]);
}


function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}


function updateAddress(address, id) {
    return db.query ('UPDATE organisations SET address=$1 WHERE id=$2 returning address',[address, id]);
}

function updateUrl(url, id) {
    return db.query ('UPDATE organisations SET url=$1 WHERE id=$2 returning url',[url, id]);
}

function updateAbout(about, id) {
    return db.query ('UPDATE organisations SET about=$1 WHERE id=$2 returning about',[about, id]);
}


function sendFile(file) {
    return new Promise (function(resolve, reject) {

        const s3Request = client.put(file.filename, {
            'Content-Type': file.mimetype,
            'Content-Length': file.size,
            'x-amz-acl': 'public-read'
        });

        const readStream = fs.createReadStream(file.path);
        readStream.pipe(s3Request);

        s3Request.on('response', (s3Response) => {

            if (s3Response.statusCode == 200) {
                // console.log('jee');
                resolve();
            } else {
                // console.log('noouuu!');
                reject();
            }
        });
    });
}

function addImgToDb(image, id) {
    return new Promise (function(resolve, reject) {
        db.query ('UPDATE organisations SET image=$1 WHERE id=$2',[image, id]);

    }).catch(function(err) {
        console.log(err);
    });
}

function addPost(organisationId, description, message) {
    return db.query ('INSERT INTO posts(organisation_id, description, message) values($1, $2, $3)', [organisationId, description, message]);
}


function getPostsAndInfo() {
    return db.query ('SELECT organisations.id, organisations.name, organisations.contact_first, organisations.contact_last, organisations.email, organisations.image, organisations.address, organisations.url, organisations.about, posts.description, posts.message, posts.timestamp FROM organisations JOIN posts ON organisations.id = posts.organisation_id ORDER BY posts.timestamp DESC LIMIT 30');
}


function getOwnPosts(organisationId) {
    return db.query ('SELECT * FROM posts WHERE organisation_id=$1 ORDER BY timestamp DESC', [organisationId]);
}

function deletePost(postId) {
    return db.query ('DELETE FROM posts WHERE id=$1 returning organisation_id', [postId]);
}


function addMessage(organisationId, senderName, senderEmail, subject, message, status) {
    return db.query ('INSERT INTO messages(organisation_id, sender_name, sender_email, subject, private_message, status) values($1, $2, $3, $4, $5, $6)', [organisationId, senderName, senderEmail, subject, message, status]);
}

function getPrivateMessages(organisationId) {
    return db.query ('SELECT * FROM messages WHERE organisation_id=$1 ORDER BY timestamp DESC', [organisationId]);
}

function updateMessageStatus(status, messageId) {
    return db.query ('UPDATE messages SET status=$1 WHERE id=$2',[status, messageId]);
}

function deleteMessage(messageId) {
    return db.query ('DELETE FROM messages WHERE id=$1 returning organisation_id', [messageId]);
}


module.exports.hashPassword = hashPassword;
module.exports.addOrganisationData = addOrganisationData;
module.exports.getOrganisationData = getOrganisationData;
module.exports.checkPassword = checkPassword;
module.exports.updateAddress = updateAddress;
module.exports.updateUrl = updateUrl;
module.exports.updateAbout = updateAbout;
module.exports.sendFile = sendFile;
module.exports.addImgToDb = addImgToDb;
module.exports.addPost = addPost;
module.exports.getPostsAndInfo = getPostsAndInfo;
module.exports.getOwnPosts = getOwnPosts;
module.exports.deletePost = deletePost;
module.exports.addMessage = addMessage;
module.exports.getPrivateMessages = getPrivateMessages;
module.exports.updateMessageStatus = updateMessageStatus;
module.exports.deleteMessage = deleteMessage;

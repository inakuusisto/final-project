const spicedPg = require('spiced-pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const knox = require('knox');
let secrets;

var db = spicedPg(process.env.DATABASE_URL || `postgres:${require('../secrets.json').name}:${require('../secrets.json').pass}@localhost:5432/final`);

if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('../secrets.json'); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
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
        db.query ('UPDATE organisations SET image=$1 WHERE id=$2',[image, id])

    }).catch(function(err) {
        console.log(err);
    });
}

function addPost(organisationId, description, message) {
    return db.query ('INSERT INTO posts(organisation_id, description, message) values($1, $2, $3)', [organisationId, description, message]);
}


module.exports.hashPassword = hashPassword;
module.exports.addOrganisationData = addOrganisationData;
module.exports.getOrganisationData = getOrganisationData;
module.exports.checkPassword = checkPassword;
module.exports.sendFile = sendFile;
module.exports.addImgToDb = addImgToDb;
module.exports.addPost = addPost;

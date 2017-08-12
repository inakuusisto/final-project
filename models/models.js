const spicedPg = require('spiced-pg');
const bcrypt = require('bcryptjs');

var db = spicedPg(process.env.DATABASE_URL || `postgres:${require('../secrets.json').name}:${require('../secrets.json').pass}@localhost:5432/final`);



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



module.exports.hashPassword = hashPassword;
module.exports.addOrganisationData = addOrganisationData;
module.exports.getOrganisationData = getOrganisationData;
module.exports.checkPassword = checkPassword;

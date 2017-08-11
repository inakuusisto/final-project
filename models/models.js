const spicedPg = require('spiced-pg');

var db = spicedPg(process.env.DATABASE_URL || `postgres:${require('../secrets.json').name}:${require('../secrets.json').pass}@localhost:5432/final`);

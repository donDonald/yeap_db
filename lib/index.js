'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('./' + module); }

const db = {};
module.exports = db;

// This one is meant to requre sql files like this:
// require('./users.sql');
require.extensions['.sql'] = function(module, filename) {
    module.exports = require('fs').readFileSync(filename, 'utf8');
};

db.Db = re('Db');
db.mysql = {};
db.mysql.helpers = re('mysql/helpers');
db.mysql.Connection = re('mysql/Connection');
db.mysql.Driver = re('mysql/Driver');
db.mysql.Pool = re('mysql/Pool');

db.postgres = {};
db.postgres.helpers = re('postgres/helpers');
db.postgres.Connection = re('postgres/Connection');
db.postgres.Driver = re('postgres/Driver');
db.postgres.Pool = re('postgres/Pool');

db.model = re('model/index');

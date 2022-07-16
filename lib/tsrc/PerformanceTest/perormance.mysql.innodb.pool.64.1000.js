'use strict';

const api = {};
api.fs = require('fs');
api.db = require('../../index');

const dbHelpers = api.db.mysql.helpers;
const cridentials = JSON.parse(JSON.stringify(dbHelpers.DB_CRIDENTIALS));
cridentials.pool_size = 64;
cridentials.slow_time = 1*1000;
const DB_TABLE = './mysql.innodb.template';

require('./perormance')('mysql_innodb_64_1000', api, dbHelpers, api.db.mysql.Pool, cridentials, DB_TABLE);


'use strict';

const api = {};
api.fs = require('fs');
api.db = require('../../index');

const dbHelpers = api.db.postgres.helpers;
const cridentials = JSON.parse(JSON.stringify(dbHelpers.DB_CRIDENTIALS));
cridentials.pool_size = 1;
cridentials.slow_time = 1*1000;
const DB_TABLE = './postgres.template';

require('./perormance')('perormance_postgres_pool_1_1000', api, dbHelpers, api.db.postgres.Pool, cridentials, DB_TABLE);


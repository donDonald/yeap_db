'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('./' + module); }


const api = {};
module.exports = api;

api.fs = require('fs');

api.logger = require('yeap_logger');
api.log = api.logger.Logger;

api.db = {};
api.db.Db = re('Db')(api);
api.db.mysql = {};
api.db.mysql.Driver = re('mysql/Driver')(api);
api.db.mysql.Connection = re('mysql/Connection')(api);
api.db.mysql.Pool = re('mysql/Pool')(api);
api.db.mysql.helpers = re('mysql/helpers')(api);

api.db.postgres = {};
api.db.postgres.Driver = re('postgres/Driver')(api);


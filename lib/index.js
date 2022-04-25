'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('./' + module); }

const api = {};
module.exports = api;

api.lib = {};
const yeap_logger = require('yeap_logger');

api.lib.Logger = yeap_logger.Logger;
api.lib.LoggerFs = yeap_logger.LoggerFs;
api.lib.log = yeap_logger.Logger;
api.lib.Db = re('Db')(api);

api.lib.Db.mysql = {};
api.lib.Db.mysql.Driver = re('db.mysql/Driver')(api);
api.lib.Db.mysql.Connection = re('db.mysql/Connection')(api);
api.lib.Db.mysql.Pool = re('db.mysql/Pool')(api);
api.lib.Db.mysql.helpers = re('db.mysql/helpers')(api);

api.lib.Db.postgres = {};
api.lib.Db.postgres.Driver = re('db.mysql/Driver')(api);


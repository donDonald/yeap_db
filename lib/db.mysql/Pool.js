'use strict';

(function() {

const assert = require('assert');
const mysql = require('mysql2');
const mysqlUtilities = require('mysql-utilities');

mysql.upgrade = mysqlUtilities.upgrade;
mysql.introspection = mysqlUtilities.introspection;

module.exports = function(api) {
    assert(api);
    const sql = api.lib.Db.mysql;

    const Pool = function(cridentials, dbName) {
//      api.lib.log.debug('lib.db.Pool()');
        assert(cridentials);
        assert(cridentials.host);
        assert(cridentials.user);
        assert.equal('string', typeof cridentials.password);
        assert(dbName);

        this.requests = [];
        this.pendingRequests = [];

        this.pool  = mysql.createPool({
            host               : cridentials.host,
            user               : cridentials.user,
            password           : cridentials.password,
            database           : dbName,
            connectionLimit    : 10, // Let it bee 10 for now, let see...
            queueLimit         : 0   // unlimited
        });

// Fuck seems slow is reported incorrectly, mysql itself doent report slows but this thing does
////////////self.dbc.slowTime = 1*1000;
////////////api.lib.log.info('DbProxy.create, self.dbc.slowTime:' + self.dbc.slowTime);
////////////self.dbc.on('slow', function(err, res, fields, query, executionTime) {
////////////    api.lib.log.warning('!!!!!!!!!!!!!, on slow')
////////////});
    }

    Pool.prototype.close = function(cb) {
//      api.lib.log.info('lib.db.Pool.close()');
        if (!this.pool._closed) {
            this.pool.end(()=>{
                cb();
            });
        } else {
            setImmediate(cb);
        }
    }

    Pool.prototype.query = function(query, params, cb) {
//      api.lib.log.debug('lib.db.Pool.query(), query:' + query);
        assert(query);
        assert(params);
        assert(cb);

        const self = this;
        this.pendingRequests.push(query);
        this.pool.query(query, params, (err, result)=>{
            assert(!err, err);
            const q = self.pendingRequests.shift();
            self.requests.push(q);
            assert(!err, err);
            cb(err, result);
        });
    }

    const factory = {};
    factory.create = function(cridentials, dbName, cb) {
//      api.lib.log.debug('lib.db.Pool.create()');
        assert(cridentials);
        assert(cridentials.host);
        assert(cridentials.user);
        assert.equal('string', typeof cridentials.password);
        assert(dbName);
        assert(cb);
//      api.lib.log.debug('lib.db.Pool.create, host:' + cridentials.host + ', user:' + cridentials.user + ', password:' + cridentials.password);

        sql.helpers.exists(dbName, (err, res)=>{
            if (err) {
                cb(err);
            } else {
                if (res) {
                    const dbc = new Pool(cridentials, dbName);
                    dbc.name = dbName;
                    cb(undefined, dbc);
                } else {
                    cb('Database ' + dbName + ' does not exist');
                }
            }
        });
    }

    return factory;
}

})();


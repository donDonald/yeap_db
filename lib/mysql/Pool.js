'use strict';

(function() {

const assert = require('assert');
const mysql = require('mysql2');
const mysqlUtilities = require('mysql-utilities');

mysql.upgrade = mysqlUtilities.upgrade;
mysql.introspection = mysqlUtilities.introspection;

module.exports = function(api) {
    assert(api);
    const sql = api.db.mysql;

    const Pool = function(cridentials, dbName) {
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
////////////self.dbc.on('slow', function(err, res, fields, query, executionTime) {
////////////    console.log('!!!!!!!!!!!!!, on slow')
////////////});
    }

    Pool.prototype.close = function(cb) {
        if (!this.pool._closed) {
            this.pool.end(()=>{
                cb();
            });
        } else {
            setImmediate(cb);
        }
    }

    Pool.prototype.query = function(query, params, cb) {
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
        assert(cridentials);
        assert(cridentials.host);
        assert(cridentials.user);
        assert.equal('string', typeof cridentials.password);
        assert(dbName);
        assert(cb);

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


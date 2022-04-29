'use strict';

const assert = require('assert');
const mysql = require('mysql2');
const mysqlUtilities = require('mysql-utilities');
mysql.upgrade = mysqlUtilities.upgrade;
mysql.introspection = mysqlUtilities.introspection;
const helpers = require('./helpers');

class Pool {
    static create (cridentials, dbName, cb) {
        assert(cridentials);
        assert(cridentials.host);
        assert(cridentials.user);
        assert.equal('string', typeof cridentials.password);
        assert(dbName);
        assert(cb);

        helpers.exists(dbName, (err, res)=>{
            if (err) {
                cb(err);
            } else {
                if (res) {
                    const dbc = new Pool(cridentials, dbName);
                    cb(undefined, dbc);
                } else {
                    cb('Database ' + dbName + ' does not exist');
                }
            }
        });
    }

    constructor(cridentials, dbName) {
        assert(cridentials);
        assert(cridentials.host);
        assert(cridentials.user);
        assert.equal('string', typeof cridentials.password);
        assert(dbName);
      
        this._dbName = dbName;
        this._requests = [];
        this._pendingRequests = [];

        this._pool  = mysql.createPool({
            host               : cridentials.host,
            user               : cridentials.user,
            password           : cridentials.password,
            database           : dbName,
            connectionLimit    : 10, // Let it bee 10 for now, let see...
            queueLimit         : 0   // unlimited
        });

        // Fuck seems slow is reported incorrectly, mysql itself doent report slows but this thing does
        //self.dbc.slowTime = 1*1000;
        //self.dbc.on('slow', function(err, res, fields, query, executionTime) {
        //    console.log('!!!!!!!!!!!!!, on slow')
        //});
    }

    close (cb) {
        if (!this._pool._closed) {
            this._pool.end(()=>{
                cb();
            });
        } else {
            setImmediate(cb);
        }
    }

    query(query, params, cb) {
        assert(query);
        assert(params);
        assert(cb);
        this._pendingRequests.push(query);
        this._pool.query(query, params, (err, result)=>{
            assert(!err, err);
            const q = this._pendingRequests.shift();
            this._requests.push(q);
            cb(err, result);
        });
    }
}

module.exports = Pool;


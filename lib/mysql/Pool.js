'use strict';

const assert = require('assert');
const mysql = require('mysql2');
const mysqlUtilities = require('mysql-utilities');
mysql.upgrade = mysqlUtilities.upgrade;
mysql.introspection = mysqlUtilities.introspection;
const helpers = require('./helpers');
const handlers = require('./handlers');

// IMPORTANT
// This is the default pool size
// Affect client side performance dramatically
const POOL_SIZE = 10;
const SLOW_TIME = 1*1000;

class Pool {
    static create (cridentials, dbName, cb) {
        assert(cridentials);
        assert(cridentials.host);
        assert(cridentials.user);
        assert.equal('string', typeof cridentials.password);
        assert(dbName);
        assert(cb);

        helpers.exists(cridentials, dbName, (err, res)=>{
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
        this._pendingRequests = [];

        this.pendingRequestsCount = 0;
        this.completeRequestsCount = 0;
        this.errRequestsCount = 0;

        this._dbc = mysql.createPool({
            host               : cridentials.host,
            user               : cridentials.user,
            password           : cridentials.password,
            database           : dbName,
            connectionLimit    : cridentials.pool_size || POOL_SIZE,
            queueLimit         : 0   // unlimited
        });

        mysqlUtilities.upgrade(this._dbc); // Mix-in for Data Access Methods and SQL Autogenerating Methods
        mysqlUtilities.introspection(this._dbc); // Mix-in for Introspection Methods

        // Mixinf slow and error handlers
        handlers.mixin(this);
        assert(this.setSlowHandler);
        assert(this.setErrorHandler);

        this._dbc.slowTime = cridentials.slow_time || SLOW_TIME;
    }

    close (cb) {
        if (!this._dbc._closed) {
            this._dbc.end(()=>{
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
        ++this.pendingRequestsCount;
        this._dbc.query(query, params, (err, result)=>{
            --this.pendingRequestsCount;
            ++this.completeRequestsCount;
            const q = this._pendingRequests.shift();
//          this._requests.push(q);
            cb(err, result);
        });
    }
}

module.exports = Pool;


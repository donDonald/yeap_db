'use strict';

const assert = require('assert');
const mysql = require('mysql2');
const mysqlUtilities = require('mysql-utilities');
const helpers = require('./helpers');
const handlers = require('./handlers');

// IMPORTANT
// This is the default pool size
// Affects client side performance dramatically
const POOL_SIZE = 8;
const SLOW_TIME = 2*1000;

class Pool {
    static create (props, dbName, cb) {
        assert(props);
        assert(props.host);
        assert(props.user);
        assert.equal('string', typeof props.password);
//      assert(dbName);
        assert(cb);

        const connect = ()=>{
            const dbc = new Pool(props, dbName);
            dbc.open((err)=>{
                if(err) {
                    dbc.close(()=>{
                        cb(err);
                    });
                } else {
                    assert(dbc._dbc);
                    cb(undefined, dbc);
                }
            });
        }

        if(dbName) {
            helpers.exists(props, dbName, (err, exists)=>{
                if (err) {
                    cb(err);
                } else {
                    if (exists) {
                        connect();
                    } else {
                        cb('Database ' + dbName + ' does not exist');
                    }
                }
            });
        } else {
            connect();
        }
    }

    constructor(props, dbName) {
        assert(props);
        assert(props.host);
        assert(props.user);
        assert.equal('string', typeof props.password);
//      assert(dbName);
      
        this._props = props;
        this._dbName = dbName;
        this._pendingRequests = [];

        this.pendingRequestsCount = 0;
        this.completeRequestsCount = 0;
        this.errRequestsCount = 0;
    }

    open(cb) {
        assert(cb);
        assert(!this._dbc);

        this._dbc = mysql.createPool({
            host               : this._props.host,
            user               : this._props.user,
            password           : this._props.password,
            database           : this._dbName,
            connectionLimit    : this._props.pool_size || POOL_SIZE,
            queueLimit         : 0   // unlimited
        });

        mysqlUtilities.upgrade(this._dbc); // Mix-in for Data Access Methods and SQL Autogenerating Methods
        mysqlUtilities.introspection(this._dbc); // Mix-in for Introspection Methods

        // Mixinf slow and error handlers
        handlers.mixin(this);
        assert(this.setSlowHandler);
        assert(this.setErrorHandler);

        this._dbc.slowTime = this._props.slow_time || SLOW_TIME;

        setImmediate(cb);
    }

    close (cb) {
        if(this._dbc) {
            if (!this._dbc._closed) {
                this._dbc.end(()=>{
                    this._dbc = undefined;
                    cb();
                });
            } else {
                setImmediate(cb);
            }
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
            cb(err, result);
        });
    }
}

module.exports = Pool;


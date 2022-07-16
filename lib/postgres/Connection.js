'use strict';

const assert = require('assert');
const pg = require('pg');
const pgUtilities = require('./utilities');
const handlers = require('./handlers');

const SLOW_TIME = 2*1000;

class Transaction {
    constructor(c) {
        assert(c);
        this._c = c;
    }

    begin(cb) {
        this._c.query('BEGIN', [], (err)=>{
            if(this.shouldAbort(err, cb)) return;
            cb();
        });
    }

    shouldAbort(err, cb) {
        if (err) {
            //console.error('Error in transaction:', err.stack)
            console.error('Error in transaction:', err)
            this._c.query('ROLLBACK', [], (err2)=>{
                if (err2) {
                    console.error('Error rolling back client:', err2.stack);
                }
                cb(err2 || err);
            });
        }
        return !!err;
    }

    commit(cb, param1) {
        this._c.query('COMMIT', [], (err)=>{
            cb(err, param1);
        });
    }
}

class Connection {
    static create(props, dbName, cb) {
        assert(props);
        //assert(dbName);
        assert(cb);
        const c = new Connection(props, dbName);
        c.open((err)=>{
            if(err) {
                c.close(()=>{
                    cb(err);
                });
            } else {
                assert(c._dbc);
                cb(undefined, c);
            }
        });
    }

    constructor(props, dbName) {
        this._props = props;
        //assert(dbName);
        this._props = props;
        this._dbName = dbName;

        this._props = JSON.parse(JSON.stringify(props));
        this._dbName = dbName;
        if(this._dbName) {
            this._props.database = this._dbName;
        }

        // Update props with pool size and slow time
        this._props.slow_time = this._props.slow_time || SLOW_TIME;

        this._pendingRequests = [];
        this.errRequestsCount = 0;
        this.pendingRequestsCount = 0;
        this.completeRequestsCount = 0;

        this._transaction = new Transaction(this);
    }

    open(cb) {
        assert(!this._dbc);
        const dbc = new pg.Client(this._props);

        dbc.connect((err)=>{
            if (err) {
                dbc.end();
                cb(err);
            } else {
                this._dbc = dbc;

                pgUtilities.upgrade(dbc);
                handlers.mixin(this);
                assert(this.setSlowHandler);
                assert(this.setErrorHandler);

                this._dbc.kz_slow_time = this._props.slow_time;
                cb();
            }
        });
    }

    close(cb) {
        if(this._dbc) {
            this._dbc.end();
            this._dbc = undefined;;
        }
        setImmediate(cb);
    }

    query(query, params, cb) {
        assert(this._dbc);
        this._pendingRequests.push(query);
        ++this.pendingRequestsCount;
        this._dbc.query(query, (err, result)=>{
            if(err) {
                ++this.errRequestsCount;
            }
            --this.pendingRequestsCount;
            ++this.completeRequestsCount;
            const q = this._pendingRequests.shift();
            cb(err, result);
        });
    }

    get transaction() {
        return this._transaction;
    }
}

module.exports = Connection;


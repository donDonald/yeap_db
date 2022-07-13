'use strict';

const assert = require('assert');
const pg = require('pg');
const helpers = require('./helpers');
//const handlers = require('./handlers');

class Pool {
    static create (props, dbName, cb) {
        assert(props);
        assert(props.host);
        assert(props.user);
        assert.equal('string', typeof props.password);
//      assert(dbName);
        assert(cb);

        const connect = ()=>{
          //console.log('Pool.create.connect()');
          //console.log('Pool.create.connect, props:'); console.dir(props);
          //console.log('Pool.create.connect, dbName:' + dbName);
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
//      if(this._dbName) {
//          this._props.database = this._dbName;
//      }



        this._pendingRequests = [];

        this.pendingRequestsCount = 0;
        this.completeRequestsCount = 0;
        this.errRequestsCount = 0;
    }

    open(cb) {
      //console.log('Pool.open()');
      //console.log('Pool.open, _props:'); console.dir(this._props);
      //console.log('Pool.open, _dbName:' + this._dbName);
        assert(cb);
        assert(!this._dbc);

        this._dbc = new pg.Pool({
            host               : this._props.host,
            user               : this._props.user,
            password           : this._props.password,
            database           : this._dbName || this._props.database,
            port               : this._props.port
        });


      //mysqlUtilities.upgrade(this._dbc); // Mix-in for Data Access Methods and SQL Autogenerating Methods
      //mysqlUtilities.introspection(this._dbc); // Mix-in for Introspection Methods

      //// Mixinf slow and error handlers
      //handlers.mixin(this);
      //assert(this.setSlowHandler);
      //assert(this.setErrorHandler);

      //this._dbc.slowTime = this._props.slow_time || SLOW_TIME;

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
            if(result) {
                result = result.rows;
            }
            cb(err, result);
        });
    }
}

module.exports = Pool;


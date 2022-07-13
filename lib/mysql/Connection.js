'use strict';

const assert = require('assert');
const mysql = require('mysql2');
const mysqlUtilities = require('mysql-utilities');
mysql.upgrade = mysqlUtilities.upgrade;
mysql.introspection = mysqlUtilities.introspection;
const handlers = require('./handlers');

const SLOW_TIME = 2*1000;

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
        assert(props);
        assert(props.host);
        assert(props.user);
        assert.equal('string', typeof props.password);
        //assert(dbName);
        this._props = props;
        this._dbName = dbName;
    }

    open(cb) {
        assert(cb);
        assert(!this._dbc);

        const cridentialsEx = {host:this._props.host, user:this._props.user, password:this._props.password};
        if (this._dbName) {
            cridentialsEx.database = this._dbName;
        }
        const dbc = mysql.createConnection(cridentialsEx);

        mysqlUtilities.upgrade(dbc); // Mix-in for Data Access Methods and SQL Autogenerating Methods
        mysqlUtilities.introspection(dbc); // Mix-in for Introspection Methods

        dbc.connect((err)=>{
            if(err) {
                cb(err);
            } else {
                this._dbc = dbc;

                // Mixinf slow and error handlers
                handlers.mixin(this);
                assert(this.setSlowHandler);
                assert(this.setErrorHandler);
                this._dbc.slowTime = this._props.slow_time || SLOW_TIME;

                cb();
            }
        });
    }

    close(cb) {
        if(this._dbc) {
            this._dbc.end((err)=>{
                this._dbc.destroy();
                this._dbc = undefined;
                cb(err);
            });
        } else {
            setImmediate(cb);
        }
    }

    query(query, params, cb) {
        assert(this._dbc);
        assert(cb);
        this._dbc.query(query, params, (err, result)=>{
            cb(err, result);
        });
    }
}

module.exports = Connection;


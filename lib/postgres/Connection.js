'use strict';

const assert = require('assert');
const pg = require('pg');

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
        if(this._dbName) {
            const props = JSON.parse(JSON.stringify(this._props));
            props.database = dbName; // Override database name
            this._props = props;
        }
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
        this._dbc.query(query, (err, result)=>{
            cb(err, result);
        });
    }
}

module.exports = Connection;


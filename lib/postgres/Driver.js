'use strict';

module.exports = (api)=>{
    const assert = require('assert');
    assert(api);
    const pg = require('pg');

    class Connection {
        constructor(props) {
            this._props = props;
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

        query(query, cb) {
            assert(this._dbc);
            this._dbc.query(query, (err, result)=>{
                cb(err, result);
            });
        }
    }

    class Driver {
        constructor() {
        }

        static get schema() {
            return 'postgres';
        }

        open(props, cb) {
            assert(props);
            assert(cb);
            let c = new Connection(props);
            c.open((err)=>{
                if(err) {
                    cb(err);
                } else {
                    cb(undefined, c);
                }
            });
        }

        close(cb) {
            assert(cb);
            setImmediate(cb);
        }
    }

    return Driver;
}

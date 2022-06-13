'use strict';

const assert = require('assert');
const Connection = require('./Connection');

class Driver {
    constructor() {
    }

    static get schema() {
        return 'mysql';
    }

    open(props, cb) {
        assert(props);
        //assert(props.database); // Absence of props.database means that connection has no bound database
        assert(cb);
        Connection.create(props, props.database, (err, dbc)=>{
            if(err) {
                cb(err);
            } else {
                cb(undefined, dbc);
            }
        });
    }

    close(cb) {
        assert(cb);
        setImmediate(cb);
    }
}

module.exports = Driver;


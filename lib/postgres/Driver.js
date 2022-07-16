'use strict';

const assert = require('assert');
const Pool = require('./Pool');

class Driver {
    constructor() {
    }

    static get schema() {
        return 'postgres';
    }

    open(props, cb) {
        assert(props);
        //assert(props.database); // Absence of props.database means that connection has no bound database
        assert(cb);
        Pool.create(props, props.database, (err, dbc)=>{
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


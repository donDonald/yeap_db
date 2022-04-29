'use strict';

const assert = require('assert');
const pg = require('pg');

const Pool = pg.Pool;

Pool.close = (index, items, cb)=>{
    const keys = Object.keys(items);
    if (index < keys.length) {
        const v = items[keys[index]];
        v.dbc.end(()=>{
            Pool.close(index+1, items, cb);
        });
    } else {
        cb();
    }
}

module.exports = Pool;


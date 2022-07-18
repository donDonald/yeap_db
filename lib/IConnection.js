'use strict';

const assert = require('assert');

class IConnection {

    // IMPORTANT
    // This is the default pool size
    // Affects client side performance dramatically
    static SLOW_TIME = 2*1000;
    static POOL_SIZE = 8;

    open(cb) {
    }

    close(cb) {
    }

    query(query, params, cb) {
    }

    queryList(queries, cb, index) {
        assert(queries);
        assert(cb);
        if(index == undefined) {
            index = 0;
        }
        if(index < queries.length) {
            const query = queries[index][0];
            const params = queries[index][1] || [];
            this.query(query, params, (err)=>{
                if(err) {
                    cb(err);
                } else {
                    this.queryList(queries, cb, ++index);
                }
            });
        } else {
            cb();
        }
    }

    get transaction() {
        assert(false);
    }
}

module.exports = IConnection;


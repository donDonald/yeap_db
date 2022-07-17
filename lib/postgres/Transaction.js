'use strict';

const assert = require('assert');

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

module.exports = Transaction;


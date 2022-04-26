'use strict';

const assert = require('assert');

module.exports = (api)=>{
    assert(api);

    class Connection {
        close(cb){
            setImmediate(cb);
        }
    }

    class Db {
        constructor() {
        }

        static get name() {
            return 'postgres';
        }

        open(cb) {
            assert(cb);
            setImmediate(()=>{
                let c = new Connection;
                cb(undefined, c);
            });
        }

        close(cb) {
            assert(cb);
            setImmediate(cb);
        }
    }

    return Db;
}

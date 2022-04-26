'use strict';

const assert = require('assert');

module.exports = (api)=>{
    assert(api);

    class Db {
        constructor(databases) {
            this.constructor.validateConfig(databases);
            this._databases = databases;
            this._drivers = {};
        }

        log () {
            return api.log.ctx('Db');
        }

        open(cb) {
            assert(cb);
            assert(!this._connections);
            this._connections = {};
            this.openDbs(0, this._databases, (err)=>{
                cb(err, this._connections);
            });
        }

        close(cb) {
            assert(cb);
            if(this._connections) {
                this.closeDbs(0, this._connections, ()=>{
                    this._connections = undefined;
                    cb();
                });
            } else {
                setImmediate(cb);
            }
        }

        openDbs(index, databases, cb)
        {
            const keys = Object.keys(databases);
            if(index < keys.length) {
                const alias = keys[index];
                const db = this._databases[alias];
                const Driver = this.constructor.loadDriver(this._drivers, db.schema);
                const driver = new Driver();
                driver.open(db, (err, dbc)=>{
                    if(err) {
                        this.log().ctx('setup').error(`Opening database ${alias} has failed: ${err}`);
                    } else {
                        assert(dbc);
                        this._connections[alias] = dbc;
                        this.log().ctx('setup').info(`Opening database ${alias} is complete`);
                    }
                    this.openDbs(index+1, databases, cb);
                });
            } else {
                cb();
            }
        }

        closeDbs(index, connections, cb) {
            const keys = Object.keys(connections);
            if(index < keys.length) {
                const alias = keys[index];
                const connection = connections[alias];
                connection.close((err)=>{
                    if(err) {
                        this.log().ctx('teardown').error(`Closing database ${alias} has failed: ${err}`);
                    } else {
                        this.log().ctx('teardown').info(`Closing database ${alias} is complete`);
                    }
                    this.closeDbs(index+1, connections, cb);
                });
            } else {
                cb();
            }
        }

        // Load driver
        //   driverName - driver name, e.g. mongodb, mysql, pgsql, mamcached
        //   returns - driver object
        //
        static loadDriver(drivers, schema) {
            assert(drivers);
            assert(schema);
            let driver = drivers[schema];
            if(!driver) {
                driver = require('./' + schema + '/Driver')(api);
                drivers[schema] = driver;
            }
            return driver;
        }

        static validateConfig(databases) {
            //console.log('validateConfig()');
            assert.equal('object', typeof databases);
            for (const [dbAlias, dbRecord] of Object.entries(databases)) {
                //console.log(`dbAlias, dbRecord: ${dbAlias}, ${dbRecord}`);
                assert.equal('object', typeof dbRecord);
                assert.equal(6, Object.keys(dbRecord).length);
                assert.equal('string', typeof dbRecord.schema);
                assert.equal('string', typeof dbRecord.user);
                assert.equal('string', typeof dbRecord.host);
                assert.equal('string', typeof dbRecord.database);
                assert.equal('string', typeof dbRecord.password);
                assert.equal('string', typeof dbRecord.port);
            }
        }

        static createDbName(name) {
            return 'ut_' + name.toLowerCase();
        }
    }

    return Db;
}

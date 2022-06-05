'use strict';

const assert = require('assert')
    , exec = require('child_process').exec;


class Db {
    constructor(databases, logger) {
        this.constructor.validateConfig(databases);
        this._databases = databases;
        this._drivers = {};
        this._connections = undefined;
        if(logger) {
            this._logger = logger.ctx('Db');
        } else {
            this._logger = {};
            this._logger.ctx = ()=>{ return{error:()=>{}, info:()=>{} };  }
        }
    }

    log () {
        return this._logger;
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

    get connections() {
        return this._connections;
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
                    cb(err);
                } else {
                    assert(dbc);
                    this._connections[alias] = dbc;
                    this.log().ctx('setup').info(`Opening database ${alias} is complete`);
                    this.openDbs(index+1, databases, cb);
                }
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
            driver = require('./' + schema + '/Driver');
            drivers[schema] = driver;
        }
        return driver;
    }

    static validateConfig(databases) {
        //console.log('validateConfig()');
        assert.equal('object', typeof databases);
        for (const [dbAlias, dbRecord] of Object.entries(databases)) {
            //console.log(`dbAlias: ${dbAlias}`);
            //console.log(`dbRecord:`); console.dir(dbRecord);
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

    static deployDbConfig(dst, databases, cb) {
        assert(dst);
        assert(databases);
        assert(cb);
      //console.log('Db.deployDbConfig(), dst:', dst);
      //console.log('Db.deployDbConfig(), databases:', databases);

        const lines = [];
        lines.push('"use strict";');
        lines.push('module.exports = {');
        for (const dbName in databases) {
            const db = databases[dbName];
            const line = [
                    `    ${dbName} : {`,
                    '        schema: "postgres",',
                    `        host: "${db.host}",`,
                    `        port: "${db.port}",`,
                    `        database: "${db.database}",`,
                    `        user: "${db.user}",`,
                    `        password: "${db.password}",`,
                    '    },',
            ].join("\n");
            lines.push(line);
        }
        lines.push('};');
        const lines2 = lines.join('\n');
      //console.log('Db.deployDbConfig, lines:', lines);
        const cmd = 'echo \'' + lines2 + '\' >' + dst;
      //console.log('Db.deployDbConfig, cmd:', cmd);
        exec(cmd, (error, stdout, stderr)=>{
          //console.log('tools.deployDbConfig, exec.error:' + error);
          //console.log('tools.deployDbConfig, exec.stdout:' + stdout);
          //console.log('tools.deployDbConfig, exec.stderr:' + stderr);
            cb(error);
        });
    }

}

module.exports = Db;

'use strict';

(function() {

const assert = require('assert');
const mysql = require('mysql2');

module.exports = function(api) {
    assert(api);
    assert(api.lib.Db.mysql.Connection);
    const sql = api.lib.Db.mysql;

    const helpers = {};
    helpers.DB_CRIDENTIALS = {host:'localhost', user:'root', password:''};
    helpers.cridentials =  helpers.DB_CRIDENTIALS;

    //
    // List databases.
    //
    helpers.list = function (cb) {
//      api.lib.log.debug('lib.db.helpers.list()');
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(cb);
//      api.lib.log.debug('lib.db.helpers.list , host:' + helpers.cridentials.host + ', user:' + helpers.cridentials.user + ', password:' + helpers.cridentials.password);

        sql.Connection.create(helpers.cridentials, undefined, (err, dbc)=>{
            if (err) {
                cb(err);
            } else {
                assert(dbc);
                dbc.dbc.databases(function (err, res) {
                    dbc.close((err)=>{
                        cb(err, res);
                    });
                });
            }
        });
    };

    //
    // Check a database exists.
    //
    helpers.exists = function(dbName, cb) {
//      api.lib.log.debug('lib.db.helpers.exists()');
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(cb);
//      api.lib.log.debug('lib.db.helpers.exists, host:' + helpers.cridentials.host + ', user:' + helpers.cridentials.user + ', password:' + helpers.cridentials.password + ', dbName:' + dbName);

        helpers.list((err, res)=>{
            if (err) {
                cb(err);
            } else {
                const exists = !(-1 === res.indexOf(dbName)); 
                cb(err, exists);
            }
        });
    };

    // \brief Create database.
    helpers.create = function (dbName, cb) {
//      api.lib.log.debug('lib.db.helpers.create()');
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(cb);
//      api.lib.log.debug('lib.db.helpers.create, host:' + helpers.cridentials.host + ', user:' + helpers.cridentials.user + ', password:' + helpers.cridentials.password + ', dbName:' + dbName);

        const queries = [
            'drop database if exists ' + dbName + ';',
            'create database ' + dbName + ';'
        ];

        sql.Connection.create(helpers.cridentials, undefined, (err, dbc)=>{
            if (err) {
                cb(err);
            } else {
                assert(dbc);
                helpers.querySqls(dbc, queries, (err)=>{
                    dbc.close((err)=>{ cb(err); });
                });
            }
        });
    }

    // \brief Establish a single connection.
    helpers.connect = function (dbName, cb) {
//      api.lib.log.debug('lib.db.helpers.connect()');
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(cb);
//      api.lib.log.debug('lib.db.helpers.connect, host:' + helpers.cridentials.host + ', user:' + helpers.cridentials.user + ', password:' + helpers.cridentials.password + ', dbName:' + dbName);

        sql.Connection.create(helpers.cridentials, dbName, (err, dbc)=>{
            cb(err, dbc);
        });
    }

    // \brief Create database and establish a single connection.
    helpers.createAndConnect = function (dbName, cb) {
//      api.lib.log.debug('lib.db.helpers.createAndConnect()');
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(cb);
//      api.lib.log.debug('lib.db.helpers.createAndConnect, host:' + helpers.cridentials.host + ', user:' + helpers.cridentials.user + ', password:' + helpers.cridentials.password + ', dbName:' + dbName);

        helpers.create(dbName, (err)=>{
            if (err) {
                cb(err);
            } else {
                sql.Connection.create(helpers.cridentials, dbName, (err, dbc)=>{
                    cb(err, dbc);
                });
            }
        });
    }

    // \brief Create database, establish connection and make some queries.
    helpers.createAndQuery = function (dbName, queries, cb) {
//      api.lib.log.debug('lib.db.helpers.createAndQuery(), dbName:' + dbName);
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(queries);
        assert(cb);
//      api.lib.log.debug('lib.db.helpers.createAndQuery, host:' + helpers.cridentials.host + ', user:' + helpers.cridentials.user + ', password:' + helpers.cridentials.password + ', dbName:' + dbName);

        helpers.create(dbName, (err)=>{
            if (err) {
                cb(err);
            } else {
                sql.Connection.create(helpers.cridentials, dbName, (err, dbc)=>{
                    helpers.querySqls(dbc, queries, (err)=>{
                        cb(err, dbc);
                    });
                });
            }
        });
    }

    //
    // Delete/drop a database.
    //
    helpers.delete = function (dbName, cb) {
//      api.lib.log.debug('lib.db.helpers.delete()');
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(cb);
//      api.lib.log.debug('lib.db.helpers.delete, host:' + helpers.cridentials.host + ', user:' + helpers.cridentials.user + ', password:' + helpers.cridentials.password);

        const queries = [
            'drop database if exists ' + dbName + ';',
        ];

        sql.Connection.create(helpers.cridentials, undefined, (err, dbc)=>{
            if (err) {
                cb(err);
            } else {
                assert(dbc);
                const run = function(index, queries, cb) {
                    if (index < queries.length) {
                        dbc.query(queries[index], [], function(err, res) {
                            //api.lib.log.debug('err:' + err);
                            assert(!err, err);
                            run(index + 1, queries, cb)
                        });
                    } else {
                        cb();
                    }
                }

                run(0, queries, ()=>{
                    dbc.close((err)=>{
                        cb(err);
                    });
                });
            }
        });
    }

    helpers.tableSize = function(dbc, table, cb) {
        dbc.query('select count(*) as tableSize from ' + table + ';' , [], function(err, res) {
            if(err) {
                cb(err);
            } else {
                cb(err, res[0].tableSize);
            }
        });
    }

    //
    // Perform a set of queries on a database.
    //
    helpers.querySqls = function(dbc, queries, cb) {
        assert(dbc);
        assert(queries);
        assert(cb);

        const run = function(index, queries, cb) {
            if (index < queries.length) {
                dbc.query(queries[index], [], function(err, res) {
                    //api.lib.log.debug('err:' + err);
                    assert(!err, err + ', q:' + queries[index]);
                    run(index + 1, queries, cb)
                });
            } else {
                cb();
            }
        }

        run(0, queries, ()=>{
            cb();
        });
    }

    helpers.countTablesByName = function(dbc, tableName, cb) {
        dbc.query(
            'SHOW TABLES LIKE \'' + tableName + '\';',
            [],
            (err, res)=>{
                cb(err, res)
            }
        );
    }

    return helpers;
}

})();


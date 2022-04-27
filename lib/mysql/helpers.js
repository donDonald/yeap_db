'use strict';

(function() {

const assert = require('assert');
const mysql = require('mysql2');

module.exports = function(api) {
    assert(api);
    assert(api.db.mysql.Connection);
    const sql = api.db.mysql;

    const helpers = {};
    helpers.DB_CRIDENTIALS = {host:'localhost', port:'3306', user:'root', password:'test1234'};
    helpers.cridentials =  helpers.DB_CRIDENTIALS;

    //
    // List databases.
    //
    helpers.list = function (cb) {
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(cb);

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
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(cb);

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
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(cb);

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
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(cb);

        sql.Connection.create(helpers.cridentials, dbName, (err, dbc)=>{
            cb(err, dbc);
        });
    }

    // \brief Create database and establish a single connection.
    helpers.createAndConnect = function (dbName, cb) {
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(cb);

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
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(queries);
        assert(cb);

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
        assert(helpers.cridentials);
        assert(helpers.cridentials.host);
        assert(helpers.cridentials.user);
        assert.equal('string', typeof helpers.cridentials.password);
        assert(dbName);
        assert(cb);

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


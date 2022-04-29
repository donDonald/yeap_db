'use strict';

//
// \brief Set of tools meant mostly for tests - to create test db, to make some queries and so on.
//

const assert = require('assert');
const mysql = require('mysql2');
const Connection = require('./Connection');

const helpers = {};
module.exports = helpers;

helpers.DB_CRIDENTIALS = {
    host:'localhost',
    port:'3306',
    user:'root',
    password:'test1234'
};
helpers.cridentials =  helpers.DB_CRIDENTIALS;

//
// \brief List databases.
//
helpers.list = (cb)=> {
    assert(helpers.cridentials);
    assert(helpers.cridentials.host);
    assert(helpers.cridentials.user);
    assert.equal('string', typeof helpers.cridentials.password);
    assert(cb);

    Connection.create(helpers.cridentials, undefined, (err, dbc)=>{
        if (err) {
            cb(err);
        } else {
            assert(dbc);
            dbc._dbc.databases(function (err, res) {
                dbc.close((err)=>{
                    cb(err, res);
                });
            });
        }
    });
}

//
// \brief Check a database exists.
//
helpers.exists = (dbName, cb)=> {
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
}

//
// \brief Establish a single connection.
//
helpers.connect = function (dbName, cb) {
    assert(dbName);
    assert(cb);

    Connection.create(helpers.cridentials, dbName, (err, dbc)=>{
        cb(err, dbc);
    });
}

//
// \brief Create database.
//
helpers.create = function (dbName, cb) {
    assert(dbName);
    assert(cb);

    const queries = [
        'drop database if exists ' + dbName + ';',
        'create database ' + dbName + ';'
    ];

    Connection.create(helpers.cridentials, undefined, (err, dbc)=>{
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

//
// \brief Create database and establish a single connection.
//
helpers.createAndConnect = function (dbName, cb) {
    assert(dbName);
    assert(cb);

    helpers.create(dbName, (err)=>{
        if (err) {
            cb(err);
        } else {
            helpers.connect(dbName, (err, dbc)=>{
                cb(err, dbc);
            });
        }
    });
}

//
// \brief Create database, establish connection, make some queries and close db connection.
//
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
            helpers.connect(dbName, (err, dbc)=>{
                helpers.querySqls(dbc, queries, (err)=>{
                    dbc.close((err)=>{
                        cb(err);
                    });
                });
            });
        }
    });
}

//
// \brief Connect to database, make a query and close db connection.
//
helpers.connectAndQuery = (dbName, query, cb)=>{
    assert(dbName);
    assert(query);
    assert(cb);
    helpers.connect(dbName, (err, dbc)=>{
        if(err) {
            cb(err);
        } else {
            helpers.query(dbc, query, (err, result)=>{
                dbc.close((err)=>{
                    cb(err, result);
                });
            });
        }
    });
}

//
// \brief Perform a set of queries on a database.
//
helpers.querySqls = function(dbc, queries, cb) {
    assert(dbc);
    assert(queries);
    assert(cb);

    const run = function(index, queries, cb) {
        if (index < queries.length) {
            dbc.query(queries[index], [], function(err, res) {
                if (err) {
                    console.log('mysql.helpers.querySqls, err:' + err);
                    console.log('mysql.helpers.querySqls, query:' + queries[index]);
                }
                assert(!err, err + ', q:' + queries[index]);
                run(index + 1, queries, cb);
            });
        } else {
            cb();
        }
    }

    run(0, queries, ()=>{
        cb();
    });
}

//
// \brief Perform a query on a database.
//
helpers.query = (dbc, query, cb)=>{
    assert(dbc);
    assert(query);
    assert(cb);
    dbc.query(query, [], function(err, res) {
        if (err) {
            console.log('mysql.helpers.query, err:' + err);
            console.log('mysql.helpers.query, query:' + query);
        }
        cb(err, res);
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

    Connection.create(helpers.cridentials, undefined, (err, dbc)=>{
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

helpers.countTablesByName = function(dbc, tableName, cb) {
    dbc.query(
        'SHOW TABLES LIKE \'' + tableName + '\';',
        [],
        (err, res)=>{
            cb(err, res)
        }
    );
}


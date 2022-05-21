'use strict';

//
// \brief Set of tools meant mostly for tests - to create test db, to make some queries and so on.
//

const assert = require('assert');
const pg = require('pg');
const Connection = require('./Connection');

const helpers = {};
module.exports = helpers;

helpers.DB_CRIDENTIALS = {
    host: 'localhost',
    port: '5432',
    user: 'test1234',
    password: 'test1234',
    database: 'postgres',
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

    const q = 'SELECT datname FROM pg_database WHERE datistemplate = false';
    helpers.connectAndQuery(helpers.DB_CRIDENTIALS.database, q, (err, result)=>{
        cb(err, result);
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
            let indexFound = -1;
            res.rows.forEach((r, index)=>{
                if(r.datname == dbName) {
                    indexFound = index;
                }
            });
            const exists = !(-1 === indexFound);
            cb(err, exists);
        }
    });
}

//
// \brief Establish a single connection.
//
helpers.connect = (dbName, cb)=>{
    assert(dbName);
    assert(cb);

    Connection.create(helpers.cridentials, dbName, (err, dbc)=>{
        cb(err, dbc);
    });
}

//
// \brief Create database.
// https://stackoverflow.com/questions/20813154/node-postgres-create-database
// https://github.com/olalonde/pgtools/blob/master/index.js
helpers.create = (dbName, cb)=>{
    assert(dbName); // db to create
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
            helpers.query(dbc, queries, (err)=>{
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
// \brief Create database, establish connection and make some queries.
//
helpers.createAndQuery = (dbName, queries, cb)=>{
    assert(dbName); // db to create
    assert(queries);
    assert(cb);

    helpers.create(dbName, (err)=>{
        if (err) {
            cb(err);
        } else {
            helpers.connect(dbName, (err, dbc)=>{
                if (err) {
                    cb(err);
                } else {
                    helpers.query(dbc, queries, (err)=>{
                        dbc.close((err)=>{
                            cb(err);
                        });
                    });
                }
            });
        }
    });
}

//
// \brief Connect to database, make a query and close db connection.
// https://stackoverflow.com/questions/20813154/node-postgres-create-database
// https://github.com/olalonde/pgtools/blob/master/index.js
helpers.connectAndQuery = (dbName, queries, cb)=>{
    assert(dbName);
    assert(queries);
    assert(cb);

    helpers.connect(dbName, (err, dbc)=>{
        if(err) {
            cb(err);
        } else {
            helpers.query(dbc, queries, (err, result)=>{
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
helpers.query= (dbc, queries, cb)=>{
    assert(dbc);
    assert(queries);
    assert(cb);

    const run = function(index, queries, cb, err, res) {
        if (index < queries.length) {
            dbc.query(queries[index], [], function(err, res) {
                if (err) {
                    console.log('postgres.helpers.query, err:' + err);
                    console.log('postgres.helpers.query, query:' + queries[index]);
                    cb(err);
                } else {
                    run(index + 1, queries, cb, err, res);
                }
            });
        } else {
            cb(err, res);
        }
    }

    if(typeof queries == 'string') {
        queries = [queries];
    }

    run(0, queries, (err, res)=>{
        cb(err, res);
    });
}

//
// Delete/drop a database.
//
helpers.delete = (dbName, cb)=>{
    assert(dbName); // db to delete
    assert(cb);

    const queries = [
        'drop database if exists ' + dbName + ';',
    ];

    helpers.connectAndQuery(helpers.DB_CRIDENTIALS.database, queries[0], (err, result)=>{
        cb(err, result);
    });
}
    

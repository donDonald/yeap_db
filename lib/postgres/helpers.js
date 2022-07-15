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
    schema: 'postgres',
    host: 'localhost',
    port: '5432',
    user: 'test1234',
    password: 'test1234',
    database: 'postgres',
};

//
// \brief List databases.
//
helpers.list = (cridentials, cb)=> {
    assert(cridentials);
    assert(cridentials.host);
    assert(cridentials.user);
    assert.equal('string', typeof cridentials.password);
    assert(cb);

    const q = 'SELECT datname FROM pg_database WHERE datistemplate = false';

    helpers.connectAndQuery(cridentials, helpers.DB_CRIDENTIALS.database, q, (err, dbc, result)=>{
        if(dbc) {
            dbc.close(()=>{
                cb(err, result);
            });
        } else {
            cb(err);
        }
    });
}

//
// \brief Check a database exists.
//
helpers.exists = (cridentials, dbName, cb)=> {
    assert(cridentials);
    assert(cridentials.host);
    assert(cridentials.user);
    assert.equal('string', typeof cridentials.password);
    assert(cb);

    helpers.list(cridentials, (err, res)=>{
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
helpers.connect = (cridentials, dbName, cb)=>{
    assert(cridentials);
    assert(dbName);
    assert(cb);

    Connection.create(cridentials, dbName, (err, dbc)=>{
        cb(err, dbc);
    });
}

//
// \brief Create database.
// https://stackoverflow.com/questions/20813154/node-postgres-create-database
// https://github.com/olalonde/pgtools/blob/master/index.js
helpers.create = (cridentials, dbName, cb)=>{
    assert(cridentials);
    assert(dbName); // db to create
    assert(cb);

    const queries = [
        'drop database if exists ' + dbName + ';',
        'create database ' + dbName + ';'
    ];

    Connection.create(cridentials, undefined, (err, dbc)=>{
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
helpers.createAndConnect = (cridentials, dbName, cb)=>{
    assert(cridentials);
    assert(dbName);
    assert(cb);

    helpers.create(cridentials, dbName, (err)=>{
        if (err) {
            cb(err);
        } else {
            helpers.connect(cridentials, dbName, (err, dbc)=>{
                cb(err, dbc);
            });
        }
    });
}

//
// \brief Create database, establish connection and make some queries.
//
helpers.createAndQuery = (cridentials, dbName, queries, cb)=>{
    assert(cridentials);
    assert(dbName); // db to create
    assert(queries);
    assert(cb);

    helpers.create(cridentials, dbName, (err)=>{
        if (err) {
            cb(err);
        } else {
            helpers.connect(cridentials, dbName, (err, dbc)=>{
                if (err) {
                    cb(err);
                } else {
                    helpers.query(dbc, queries, (err, result)=>{
                        cb(err, dbc, result)
                      //dbc.close((err)=>{
                      //    cb(err);
                      //});
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
helpers.connectAndQuery = (cridentials, dbName, queries, cb)=>{
    assert(cridentials);
    assert(dbName);
    assert(queries);
    assert(cb);

    helpers.connect(cridentials, dbName, (err, dbc)=>{
        if(err) {
            cb(err);
        } else {
            helpers.query(dbc, queries, (err, result)=>{
                cb(err, dbc, result);
              //dbc.close((err)=>{
              //    cb(err, result);
              //});
            });
        }
    });
}

//
// \brief Perform a set of queries on a database.
//
helpers.query = (dbc, queries, cb)=>{
    assert(dbc);
    assert(queries);
    assert(cb);

    const run = (index, queries, cb, err, res)=>{
        if (index < queries.length) {
            dbc.query(queries[index], [], (err, res)=>{
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
helpers.delete = (cridentials, dbName, cb)=>{
    assert(cridentials);
    assert(dbName); // db to delete
    assert(cb);

    const queries = [
        'drop database if exists ' + dbName + ';',
    ];

    helpers.connectAndQuery(cridentials, helpers.DB_CRIDENTIALS.database, queries[0], (err, dbc, result)=>{
        if(dbc) {
            dbc.close(()=>{
                cb(err, result);
            });
        } else {
            cb(err);
        }
    });
}

helpers.tableSize = (dbc, table, cb)=>{
    dbc.query('select count(*) as tableSize from ' + table + ';' , [], (err, res)=>{
        if(err) {
            cb(err);
        } else {
            cb(err, res[0].tablesize);
        }
    });
}

helpers.countTablesByName = (dbc, tableName, cb)=>{
    dbc.query(
        'SHOW TABLES LIKE \'' + tableName + '\';',
        [],
        (err, res)=>{
            cb(err, res)
        }
    );
}


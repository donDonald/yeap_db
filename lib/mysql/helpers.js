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
    schema: 'mysql',
    host:'localhost',
    port:'3306',
    user:'root',
    password:'test1234'
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

    Connection.create(cridentials, undefined, (err, dbc)=>{
        if (err) {
            cb(err);
        } else {
            assert(dbc);
            dbc._dbc.databases((err, res)=>{
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
            const exists = !(-1 === res.indexOf(dbName)); 
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
//
helpers.create = (cridentials, dbName, cb)=>{
    assert(cridentials);
    assert(dbName);
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
// \brief Create database, establish connection, make some queries and close db connection.
//
helpers.createAndQuery = (cridentials, dbName, queries, cb)=>{
    assert(cridentials);
    assert(cridentials.host);
    assert(cridentials.user);
    assert.equal('string', typeof cridentials.password);
    assert(dbName);
    assert(queries);
    assert(cb);

    helpers.create(cridentials, dbName, (err)=>{
        if (err) {
            cb(err);
        } else {
            helpers.connect(cridentials, dbName, (err, dbc)=>{
                helpers.query(dbc, queries, (err, result)=>{
                  cb(err, dbc, result);
                  //dbc.close((err)=>{
                  //    cb(err);
                  //});
                });
            });
        }
    });
}

//
// \brief Connect to database, make a query and close db connection.
//
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
                    console.log('mysql.helpers.query, err:' + err);
                    console.log('mysql.helpers.query, query:' + queries[index]);
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
    assert(cridentials.host);
    assert(cridentials.user);
    assert.equal('string', typeof cridentials.password);
    assert(dbName);
    assert(cb);

    const queries = [
        'drop database if exists ' + dbName + ';',
    ];

    Connection.create(cridentials, undefined, (err, dbc)=>{
        if (err) {
            cb(err);
        } else {
            assert(dbc);
            const run = (index, queries, cb)=>{
                if (index < queries.length) {
                    dbc.query(queries[index], [], (err, res)=>{
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

helpers.tableSize = (dbc, table, cb)=>{
    dbc.query('select count(*) as tableSize from ' + table + ';' , [], (err, res)=>{
        if(err) {
            cb(err);
        } else {
            cb(err, res[0].tableSize);
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


'use strict';

//
// \brief Set of tools meant mostly for tests - to create test db, to make some queries and so on.
//

(function() {

module.exports = function(api) {
    const assert = require('assert');
    assert(api);
    const pg = require('pg');

    const helpers = {};
    helpers.DB_CRIDENTIALS = {
        host: 'localhost',
        port: 5432,
        user: 'test1234',
        password: 'test1234',
        database: 'postgres',
    };
    helpers.cridentials =  helpers.DB_CRIDENTIALS;

    helpers.masterDbProps = {
        host: 'localhost',
        port: '5432',
        database: 'postgres',
        user: 'test1234',
        password: 'test1234',
    };

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

        const props = JSON.parse(JSON.stringify(helpers.cridentials));
        props.database = dbName; // Override database name
        const dbc = new pg.Client(props);
        dbc.connect((err)=>{
            if (err) {
                dbc.end();
                cb(err);
            } else {
                cb(err, dbc);
            }
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

        const dbc = new pg.Client(helpers.cridentials);
        dbc.connect((err)=>{
            if (err) {
                dbc.end();
                cb(err);
            } else {
                helpers.querySqls(dbc, queries, (err)=>{
                    dbc.end();
                    cb(err);
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
                        helpers.querySqls(dbc, queries, (err)=>{
                            dbc.end();
                            cb(err);
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
    helpers.connectAndQuery = (dbName, query, cb)=>{
        assert(dbName);
        assert(cb);

        helpers.connect(dbName, (err, dbc)=>{
            if(err) {
                cb(err);
            } else {
                helpers.query(dbc, query, (err, result)=>{
                    dbc.end();
                    cb(err, result);
                });
            }
        });
    }

    //
    // \brief Perform a set of queries on a database.
    //
    helpers.querySqls = (dbc, queries, cb)=>{
        assert(dbc);
        assert(queries);
        assert(cb);

        const run = function(index, queries, cb) {
            if (index < queries.length) {
                dbc.query(queries[index], [], function(err, res) {
                    if (err) {
                        console.log('postgres.helpers.querySqls, err:' + err);
                        console.log('postgres.helpers.querySqls, query:' + queries[index]);
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
                console.log('postgres.helpers.query, err:' + err);
                console.log('postgres.helpers.query, query:' + query);
            }
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
    
    return helpers;
}

})();


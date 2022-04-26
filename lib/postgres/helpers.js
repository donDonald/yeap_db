'use strict';

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




    // \brief Connect to database.
    helpers.connect = (props, cb)=>{
        assert(props);
        assert(props.database);
        assert(cb);
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




    // \brief Create database.
    // https://stackoverflow.com/questions/20813154/node-postgres-create-database
    // https://github.com/olalonde/pgtools/blob/master/index.js
    helpers.create = (props, dbName, cb)=>{
        assert(props);
        assert(props.database); // master database
        assert(dbName); // db to create
        assert(cb);

        const queries = [
            'drop database if exists ' + dbName + ';',
            'create database ' + dbName + ';'
        ];

        const dbc = new pg.Client(props);
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




    // \brief Create database, establish connection and make some queries.
    helpers.createAndQuery = (props, dbName, queries, cb)=>{
        assert(props);
        assert(props.database); // master database
        assert(dbName); // db to create
        assert(queries);
        assert(cb);

        helpers.create(props, dbName, (err)=>{
            if (err) {
                cb(err);
            } else {
                const dbProps = JSON.parse(JSON.stringify(props));
                dbProps.database = dbName; // Override database name
                const dbc = new pg.Client(dbProps);
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
        });
    }




    // \brief Connect to database, make a query and close db connection.
    // https://stackoverflow.com/questions/20813154/node-postgres-create-database
    // https://github.com/olalonde/pgtools/blob/master/index.js
    helpers.connectAndQuery = (props, query, cb)=>{
        assert(props);
        assert(props.database);
        assert(cb);

        const dbc = new pg.Client(props);
        dbc.connect((err)=>{
            if (err) {
                dbc.end();
                cb(err);
            } else {
                dbc.query(query, (err, result)=>{
                    dbc.end();
    //              console.log('err:' + err);
                    assert(!err, err + ', q:' + query);
                    cb(err, result);
                });
            }
        });
    }




    // \brief Perform a set of queries on a database.
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




    // \brief Perform a query on a database.
    helpers.query = (dbc, query, cb)=>{
        assert(dbc);
        assert(query);
        assert(cb);
        dbc.query(query, [], function(err, res) {
            if (err) {
                console.log('postgres.helpers.query, err:' + err);
                console.log('postgres.helpers.query, query:' + query);
            }
            assert(!err);
            cb(err, res);
        });
    }
    
    return helpers;
}

})();


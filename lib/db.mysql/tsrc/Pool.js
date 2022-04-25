'use strict';

//---------------------------------------------------------------------------

const assert         = require('assert');

const re = function(module) { return require('../' + module); }

const api                              = {};
api.lib                                = {};
api.lib.Db                             = {};
api.lib.Db.mysql                       = {};
api.lib.Db.mysql.Connection            = re('Connection.js')(api);
api.lib.Db.mysql.helpers               = re('helpers.js')(api);
api.lib.Db.mysql.Pool                  = re('Pool.js')(api); 
const sql = api.lib.Db.mysql;

const forSureIxistingDb    = 'forSureIxistingDb';
const forSureIxistingTable = 'forSureIxistingTable';


//---------------------------------------------------------------------------

describe('lib.db.Pool', function() {

    it('Pool.create, Connect to existing db.', function(done) {
        let dbc;
        after(function(){
            dbc.close(function() {
                dbc = undefined;
            });
        });

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, function (err, db) {
            //api.lib.log.dir(err);
            //api.lib.log.dir(db);
            assert(!err);
            assert(db);
            dbc = db;
            assert.equal(forSureIxistingDb, db.name);
            done();
        });
    });

    it('Pool.create, Connect to existing db, close db manually.', function(done) {
        let dbc;
        after(function(){
            dbc.close(function() {
                dbc=undefined;
            });
        });

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, function (err, db) {
            //api.lib.log.dir(err);
            //api.lib.log.dir(db);
            assert(!err);
            assert(db);
            dbc=db;
            assert.equal(forSureIxistingDb, dbc.name);
            dbc.close(function() {
                assert(!err);
                done();
            });
        });
    });

    it('Pool.create, Connect to existing db, close db manually for many times.', function(done) {
        let dbc;
        after(function(){
            dbc.close(function() {
                dbc = undefined;
            });
        });

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, function (err, db) {
            //api.lib.log.dir(err);
            //api.lib.log.dir(db);
            assert(!err);
            assert(db);
            dbc = db;
            assert.equal(forSureIxistingDb, dbc.name);
            dbc.close(function() {
                assert(!err);
                dbc.close(function() {
                    assert(!err);
                    done();
                });
            });
        });
    });

    it('Pool.create, Connect to existing db, close db in after.', function(done) {
        let dbc;
        after(function(){
            dbc.close(function() {
                dbc = undefined;
            });
        });

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, function (err, db) {
            //api.lib.log.dir(err);
            //api.lib.log.dir(db);
            assert(!err);
            assert(db);
            dbc = db;
            assert.equal(forSureIxistingDb, dbc.name);
            done();
        });
    });

    it('Pool.create, Connect to existing db, close db in Ut, close db in after.', function(done) {
        let dbc;
        after(function(){
            dbc.close(function() {
                dbc = undefined;
            });
        });

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, function (err, db) {
            //api.lib.log.dir(err);
            //api.lib.log.dir(db);
            assert(!err);
            assert(db);
            dbc = db;
            assert.equal(forSureIxistingDb, dbc.name);
            dbc.close(function() {
                assert(!err);
                done();
            });
        });
    });

    it('Pool.create, Connect to not existing db.', function(done) {
        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, 'thisDbDoesntExistForSure', function (err, db) {
            //api.lib.log.dir(err);
            //api.lib.log.dir(res);
            assert(err);
            assert(!db);
            done();
        });
    });

    it('Pool.query, query data.', function(done) {
        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, function (err, dbc) {
            assert(!err);
            assert(dbc);
            dbc.query('select * from ' + forSureIxistingTable, [], function(err, res) {
                assert(!err);
                assert(res);
                //api.lib.log.dir(err);
                //api.lib.log.dir(res);
                assert.notEqual(null, res[0].forSureIxistingText);
                assert.equal('forSureIxistingTextValue', res[0].forSureIxistingText);
                dbc.close(()=>{
                    done();
                });
            });
        });
    });

    it('Make some queries, create table, select, ...', function(done) {
        let dbc;
        after(function(){
            dbc.close(function() {
                dbc = undefined;
            });
        });

        sql.helpers.create('justToBeDeletedDb2', function(err, db) {
            assert(!err);

            sql.Pool.create(sql.helpers.DB_CRIDENTIALS, 'justToBeDeletedDb2', function (err, db) {
                assert(!err);
                assert(db);
                dbc = db;

                dbc.query(
                    'CREATE TABLE test ( \id INT UNSIGNED NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, PRIMARY KEY (id) );',
                    [],
                    (err, res)=>{
                        assert(!err);
                        dbc.query(
                            'INSERT INTO test (name) VALUES( \'Ivan\' );',
                            [],
                            function(err, res) {
                                assert(!err);
                                dbc.query(
                                    'SELECT * from test;',
                                    [],
                                    function(err, res) {
                                        assert(!err);
                                        assert(res);
                                        assert.equal(1, res.length );
                                        assert.equal('Ivan', res[0].name );
                                        sql.helpers.tableSize(dbc, 'test', function(err, size) {
                                            assert(!err);
                                            assert.equal(1, size);
                                            dbc.query(
                                                'INSERT INTO test (name) VALUES( \'Petr\' );',
                                                [],
                                                function(err, res) {
                                                    assert(!err);
                                                    dbc.query(
                                                        'SELECT * from test;',
                                                        [],
                                                        function(err, res) {
                                                            assert(!err);
                                                            assert(res);
                                                            assert.equal(2, res.length );
                                                            assert.equal('Ivan', res[0].name );
                                                            assert.equal('Petr', res[1].name );
                                                            sql.helpers.tableSize(dbc, 'test', function(err, size) {
                                                                assert(!err);
                                                                assert.equal(2, size);
                                                                done();
                                                            });
                                                    });
                                            });
                                        });
                                });
                         });
                 });
            });
        });
    });
});


'use strict';

describe('postgres.helpers', function() {

    const assert         = require('assert');
    const re = function(module) { return require('../../' + module); }

    const forSureIxistingDb = 'postgres';
    let api, db, helpers, log, createDbName;
    before(()=>{
        api = re('index');
        db = api.db;
        helpers = db.postgres.helpers;
        createDbName = (name)=>{ return db.Db.createDbName('Db_postgres_helpers_'+name); }
    });

    it('#helpers.list, List dbs, incorrect cridentials.', function(done) {
        helpers.cridentials = { host:'localhost', port:'5432', database:'postgres', user:'test1234', password:'test1234_wrong!'};
        helpers.list((err, res)=>{
            assert(err);
            assert(!res);
            assert.equal('28P01', err.code); // 28P01 == invalid_password; https://postgrespro.ru/docs/postgresql/9.4/errcodes-appendix
            done();
        });
    });

    it('#helpers.list, List dbs, correct cridentials.', function(done) {
        helpers.cridentials = helpers.DB_CRIDENTIALS;
        helpers.list((err, res)=>{
            assert(!err);
            assert(res);
            assert(res.rowCount>0);
            let indexFound = -1;
            res.rows.forEach((r, index)=>{
                if(r.datname == forSureIxistingDb) {
                    indexFound = index;
                }
            });
            assert.notEqual(-1, indexFound);
            done();
        });
    });

    it('#helpers.exists, Check db exists, not existing db.', function(done) {
        helpers.exists('thisDbDoesntExistForSure', function (err, res) {
            assert(!err);
            assert.equal(false, res);
            done();
        });
    });

    it('#helpers.exists, Check db exists, existing db.', function(done) {
        helpers.exists(forSureIxistingDb, function (err, res) {
            assert(!err);
            assert.equal(true, res);
            done();
        });
    });

    it('#helpers.createAndConnect', (done)=>{
        const dbName = createDbName('createAndConnect');
        helpers.createAndConnect(dbName, (err, dbc)=>{
            assert(!err);
            assert(dbc);
            dbc.end();
            done();
        });
    });

    it('#helpers.createAndQuery', (done)=>{
        const dbName = createDbName('createAndQuery');
        const queries = [
            'SELECT * FROM information_schema.tables'
        ]
        helpers.createAndQuery(dbName, queries, (err)=>{
            assert(!err);
            done();
        });
    });

    it('#helpers.connectAndQuery', (done)=>{
        const dbName = createDbName('createAndConnect');
        const q = 'SELECT * FROM information_schema.tables';
        helpers.connectAndQuery(helpers.DB_CRIDENTIALS.database, q, (err, result)=>{
            assert(!err);
            assert(result);
            done();
        });
    });

    it('helpers.create, helpers.delete, Create and delete database.', function(done) {
        helpers.exists('justtobedeleteddb', function (err, res) {
            assert(!err);
            assert.equal(false, res);

            helpers.create('justtobedeleteddb', function(err) {
                assert(!err);

                helpers.exists('justtobedeleteddb', function(err, res) {
                    assert(!err);
                    assert.equal(true, res);

                    helpers.delete('justtobedeleteddb', function(err) {
                        assert(!err);

                        helpers.exists('justtobedeleteddb', function(err, res) {
                            assert(!err);
                            assert.equal(false, res);
                            done();
                        });
                    });
                });
            });
        });
    });

    it('helpers.delete, Delete not existing db.', function(done) {
        helpers.exists('thisDbDoesntExistForSure', function (err, res) {
            assert(!err);
            assert.equal(false, res);
            helpers.delete('thisDbDoesntExistForSure', function(err) {
                assert(!err, err);
                done();
            });
        });
    });
});


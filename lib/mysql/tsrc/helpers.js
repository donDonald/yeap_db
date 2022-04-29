'use strict';

describe('mysql.helpers', function() {

    const assert         = require('assert');
    const re = function(module) { return require('../../' + module); }

    const forSureIxistingDb = 'information_schema';
    let api, helpers, createDbName;
    before(()=>{
        api = re('index');
        helpers = api.mysql.helpers;
        createDbName = (name)=>{ return api.Db.createDbName('yeap_db_mysql_helpers_'+name); }
    });

    it('helpers.list, List dbs, incorrect cridentials.', function(done) {
        helpers.cridentials = {host:'localhost', user:'someuser', password: 'somepwd'};
        helpers.list((err, res)=>{
            assert(err);
            assert(!res);
            assert.equal('ER_ACCESS_DENIED_ERROR', err.code);
            done();
        });
    });

    it('helpers.list, List dbs, correct cridentials.', function(done) {
        helpers.cridentials = helpers.DB_CRIDENTIALS;
        helpers.list((err, res)=>{
            assert(!err);
            assert(res);
            assert.notEqual(-1, res.indexOf(forSureIxistingDb));
            done();
        });
    });

    it('helpers.exists, Check db exists, not existing db.', function(done) {
        helpers.exists('thisDbDoesntExistForSure', function (err, res) {
            assert(!err);
            assert.equal(false, res);
            done();
        });
    });

    it('helpers.exists, Check db exists, existing db.', function(done) {
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
            dbc.close(done);
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
        const q = 'show tables';
        helpers.connectAndQuery(forSureIxistingDb, q, (err, result)=>{
            assert(!err);
            assert(result);
            done();
        });
    });

    it('helpers.create, helpers.delete, Create and delete database.', function(done) {
        helpers.exists('justToBeDeletedDb', function (err, res) {
            assert(!err);
            assert.equal(false, res);

            helpers.create('justToBeDeletedDb', function(err) {
                assert(!err);

                helpers.exists('justToBeDeletedDb', function(err, res) {
                    assert(!err);
                    assert.equal(true, res);

                    helpers.delete('justToBeDeletedDb', function(err) {
                        assert(!err);

                        helpers.exists('justToBeDeletedDb', function(err, res) {
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


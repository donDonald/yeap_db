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
const helpers = api.lib.Db.mysql.helpers;

const forSureIxistingDb    = 'forSureIxistingDb';

//---------------------------------------------------------------------------

describe('lib.db.helpers', function() {

    it('helpers.list, List dbs, incorrect cridentials.', function(done) {
        helpers.cridentials = {host:'localhost', user:'someuser', password: 'somepwd'};
        helpers.list((err, res)=>{
            //api.lib.log.dir(err);
            //api.lib.log.dir(res);
            assert(err);
            assert(!res);
            assert.equal('ER_ACCESS_DENIED_ERROR', err.code);
            done();
        });
    });

    it('helpers.list, List dbs, correct cridentials.', function(done) {
        helpers.cridentials = helpers.DB_CRIDENTIALS;
        helpers.list((err, res)=>{
            //api.lib.log.dir(err);
            //api.lib.log.dir(res);
            assert(!err);
            assert(res);
            assert.notEqual(-1, res.indexOf(forSureIxistingDb));
            done();
        });
    });

    it('helpers.exists, Check db exists, not existing db.', function(done) {
        helpers.exists('thisDbDoesntExistForSure', function (err, res) {
            //api.lib.log.dir(err);
            //api.lib.log.dir(res);
            assert(!err);
            assert.equal(false, res);
            done();
        });
    });

    it('helpers.exists, Check db exists, existing db.', function(done) {
        helpers.exists(forSureIxistingDb, function (err, res) {
            //api.lib.log.dir(err);
            //api.lib.log.dir(res);
            assert(!err);
            assert.equal(true, res);
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
            helpers.delete('justToBeDeletedDb', function(err) {
                assert(!err);
                done();
            });
        });
    });

////it('Connection.helpers.tableSize.', function(done) {
////    api.lib.Db.helpers.tableSize(dbc, forSureIxistingTable, function(err, size) {
////        assert(!err);
////        assert.equal(1, size);
////        done();
////    });
////});

////it('Connection.helpers.tableSize, not existsing table.', function(done) {
////    api.lib.Db.helpers.tableSize(dbc, 'notExistingTable', function(err, size) {
////        assert(err);
////        done();
////    });
////});

});


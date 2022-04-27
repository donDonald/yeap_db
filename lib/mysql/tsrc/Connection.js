'use strict';

describe('mysql.Connection', function() {

    const assert         = require('assert');
    const re = function(module) { return require('../../' + module); }

    const forSureIxistingDb    = 'information_schema';
    const forSureIxistingTable = 'TABLES';
    let api, db, sql;
    before(()=>{
        api = re('index');
        db = api.db;
        sql = db.mysql;

    });

    it('Connection.create, incorrect cridentials.', function(done) {
        sql.Connection.create({host:'localhost', user:'someuser', password: 'somepwd'}, forSureIxistingDb, (err, dbc)=>{
            assert(err);
            assert(!dbc);
            done();
        });
    });

    let dbc;
    it('Connection.create, connect.', function(done) {
        sql.Connection.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
            assert(!err);
            assert(db);
            dbc = db;
            done();
        });
    });

    it('Connection.query.', function(done) {
        dbc.query('select * from ' + forSureIxistingTable, [], function(err, res) {
            assert(!err);
            assert(res);
            assert.notEqual(0, res.length);
            done();
        });
    });

    it('Connection.Connection.close.', function(done) {
        dbc.close((err)=>{
            assert(!err);
            done();
        });
    });

    it('Connection.Connection.close, close again.', function(done) {
        dbc.close((err)=>{
            assert(!err);
            done();
        });
    });

});


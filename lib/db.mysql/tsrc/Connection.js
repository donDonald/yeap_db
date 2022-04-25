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
const sql = api.lib.Db.mysql;

const forSureIxistingDb    = 'forSureIxistingDb';
const forSureIxistingTable = 'forSureIxistingTable';

//---------------------------------------------------------------------------

describe('lib.db.Connection', function() {

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
            //api.lib.log.dir(err);
            //api.lib.log.dir(res);
            assert.notEqual(null, res[0].forSureIxistingText);
            assert.equal('forSureIxistingTextValue', res[0].forSureIxistingText);
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


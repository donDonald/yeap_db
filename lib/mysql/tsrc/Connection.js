'use strict';

describe('yeap_db.mysql.Connection', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }

    const forSureIxistingDb = 'information_schema';
    const forSureIxistingTable = 'TABLES';
    let api, dbHelpers, Connection;
    before(()=>{
        api = {};
        api.mysql = {};
        api.mysql.helpers = re('mysql/helpers');
        api.mysql.Connection = re('mysql/Connection');
        dbHelpers = api.mysql.helpers;
        Connection = api.mysql.Connection;
    });

    it('Connection.create, incorrect cridentials.', (done)=>{
        Connection.create({host:'localhost', user:'someuser', password: 'somepwd'}, forSureIxistingDb, (err, dbc)=>{
            assert(err);
            assert(!dbc);
            done();
        });
    });

    it('Connection.create, no database name is given, simply connecting to the db server, list databases.', (done)=>{
        Connection.create(dbHelpers.DB_CRIDENTIALS, undefined, (err, dbc)=>{
            assert(!err, err);
            assert(dbc);
            dbc.query('show databases', [], (err, res)=>{
                assert(!err, err);
                assert(res);
                assert(typeof res, 'array');
                dbc.close((err)=>{
                    assert(!err);
                    done();
                });
            });
        });
    });

    let dbc;
    it('Connection.create, connect.', (done)=>{
        Connection.create(dbHelpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
            assert(!err);
            assert(db);
            dbc = db;
            done();
        });
    });

    it('Connection.query.', (done)=>{
        dbc.query('select * from ' + forSureIxistingTable, [], (err, res)=>{
            assert(!err);
            assert(res);
            assert.notEqual(0, res.length);
            done();
        });
    });

    it('Connection.Connection.close.', (done)=>{
        dbc.close((err)=>{
            assert(!err);
            done();
        });
    });

    it('Connection.Connection.close, close again.', (done)=>{
        dbc.close((err)=>{
            assert(!err);
            done();
        });
    });

});


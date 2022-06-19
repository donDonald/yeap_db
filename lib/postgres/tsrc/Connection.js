'use strict';

describe('postgres.Connection', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }

    const forSureIxistingDb = 'postgres';
    const forSureIxistingTable = 'pg_type'; //'TABLES';
    let api, sql;
    before(()=>{
        api = re('index');
        sql = api.postgres;
    });

    it('Connection.create, incorrect cridentials.', (done)=>{
        const props = JSON.parse(JSON.stringify(sql.helpers.DB_CRIDENTIALS));
        props.password = 'wrong password';
        sql.Connection.create(props, forSureIxistingDb, (err, dbc)=>{
            assert(err);
            assert(!dbc);
            done();
        });
    });

    let dbc;
    it('Connection.create, connect.', (done)=>{
        sql.Connection.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
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


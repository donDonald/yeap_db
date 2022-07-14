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

    it('Connection.create, Connect to existing db, use custom slow time.', (done)=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc = undefined;
            });
        });

        const props = JSON.parse(JSON.stringify(dbHelpers.DB_CRIDENTIALS));
        props.slow_time = 10*1000;
        Connection.create(props, forSureIxistingDb, (err, db)=>{
            assert(!err);
            assert(db);
            dbc = db;
            assert.equal(forSureIxistingDb, db._dbName);

            // Check here counters, slow_time and pool size
            assert.equal(0, dbc._pendingRequests.length);
            assert.equal(0, dbc.errRequestsCount);
            assert.equal(0, dbc.pendingRequestsCount);
            assert.equal(0, dbc.completeRequestsCount);
            assert.equal('function', typeof dbc.setErrorHandler);
            assert.equal('function', typeof dbc.setSlowHandler);
            assert.equal(10*1000, dbc._dbc.slowTime);
            assert.equal(10*1000, dbc._dbc.kz_slow_time);
            assert.equal(undefined, dbc._dbc.kz_pool_size);
            done();
        });
    });

    let dbc;
    it('Connection.create, connect.', (done)=>{
        Connection.create(dbHelpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
            assert(!err);
            assert(db);
            dbc = db;

            // Check here counters and slow_time 
            assert.equal(0, dbc._pendingRequests.length);
            assert.equal(0, dbc.errRequestsCount);
            assert.equal(0, dbc.pendingRequestsCount);
            assert.equal(0, dbc.completeRequestsCount);
            assert.equal('function', typeof dbc.setErrorHandler);
            assert.equal('function', typeof dbc.setSlowHandler);
            assert.equal(2000, dbc._dbc.slowTime);
            assert.equal(2*1000, dbc._dbc.kz_slow_time);
            assert.equal(undefined, dbc._dbc.kz_pool_size);
            done();
        });
    });

    it('Connection.query.', (done)=>{
        dbc.query('select * from ' + forSureIxistingTable, [], (err, res)=>{
            assert.equal(1, dbc.completeRequestsCount);
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


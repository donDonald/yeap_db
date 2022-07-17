'use strict';

describe('yeap_db.postgres.Connection', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }

    const forSureIxistingDb = 'postgres';
    const forSureIxistingTable = 'pg_type';
    let api, dbHelpers, Connection;
    before(()=>{
        api = {};
        api.postgres = {};
        api.postgres.helpers = re('postgres/helpers');
        api.postgres.Connection = re('postgres/Connection');
        dbHelpers = api.postgres.helpers;
        Connection = api.postgres.Connection;
    });

    describe('Creation', ()=>{
        it('Connection.create, incorrect cridentials.', (done)=>{
            const props = JSON.parse(JSON.stringify(dbHelpers.DB_CRIDENTIALS));
            props.password = 'wrong password';
            Connection.create(props, forSureIxistingDb, (err, dbc)=>{
                assert(err);
                assert(!dbc);
                done();
            });
        });

        it('Connection.create, no database name is given, simply connecting to the db server, list databases.', (done)=>{
            Connection.create(dbHelpers.DB_CRIDENTIALS, undefined, (err, dbc)=>{
                assert(!err, err);
                assert(dbc);
                dbc.query("SELECT datname FROM pg_database WHERE datistemplate = false;", [], (err, res)=>{
                    assert(!err, err);
                    assert(res);
                    assert.equal('object', typeof res);
                    assert(res.length > 0);
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

                // Check dbc config
                assert.equal(7, Object.keys(dbc._props).length);
                assert.equal(dbc._props.schema, dbc._props.schema);
                assert.equal(dbc._props.user, dbc._props.user);
                assert.equal(dbc._props.host, dbc._props.host);
                assert.equal(dbc._props.database, dbc._props.database);
                assert.equal(dbc._props.password, dbc._props.password);
                assert.equal(dbc._props.port, dbc._props.port);
                assert.equal(10*1000, dbc._props.slow_time);

                // Check here counters, slow_time and pool size
                //assert.equal(0, dbc._pendingRequests.length);
                assert.equal(0, dbc.errRequestsCount);
                assert.equal(0, dbc.pendingRequestsCount);
                assert.equal(0, dbc.completeRequestsCount);
                assert.equal('function', typeof dbc.setErrorHandler);
                assert.equal('function', typeof dbc.setSlowHandler);
                assert.equal(10*1000, dbc._dbc.kz_slow_time);
                assert.equal(undefined, dbc._dbc.kz_pool_size);
                done();
            });
        });
    });

    describe('Handling slows', ()=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc = undefined;
            });
        });

        const slowRequets = [];
        const handleDbSlow = (err, res, fields, query, executionTime)=>{
            slowRequets.push({err:err, res:res, fields:fields, query:query, executionTime:executionTime});
        }

        it('Connection.create, Connect to existing db, use slow time assigned to 1 to make slow happen.', (done)=>{
            const props = JSON.parse(JSON.stringify(dbHelpers.DB_CRIDENTIALS));
            props.slow_time = 1;
            Connection.create(props, forSureIxistingDb, (err, db)=>{
                assert(!err);
                assert(db);
                dbc = db;
                assert.equal(forSureIxistingDb, db._dbName);
                dbc.setSlowHandler(handleDbSlow);
                assert.equal(1, dbc._dbc.kz_slow_time);
                assert.equal(0, slowRequets.length)
                done();
            });
        });

        it('Make 1st slow query.', (done)=>{
            dbc.query('select * from ' + forSureIxistingTable, [], (err, res)=>{
                assert.equal(1, dbc.completeRequestsCount);
                assert(!err);
                assert(res);
                assert.notEqual(0, res.length);
                assert.equal(1, slowRequets.length)
                done();
            });
        });

        it('Make 2nd slow query.', (done)=>{
            dbc.query('select * from ' + forSureIxistingTable, [], (err, res)=>{
                assert.equal(2, dbc.completeRequestsCount);
                assert(!err);
                assert(res);
                assert.notEqual(0, res.length);
                assert.equal(2, slowRequets.length)
                done();
            });
        });

        it('Make 3rd slow query.', (done)=>{
            dbc.query('select * from ' + forSureIxistingTable, [], (err, res)=>{
                assert.equal(3, dbc.completeRequestsCount);
                assert(!err);
                assert(res);
                assert.notEqual(0, res.length);
                assert.equal(3, slowRequets.length)
                done();
            });
        });
    });

    describe('Ordinary workflow', ()=>{
        let dbc;
        it('Connection.create, connect.', (done)=>{
            Connection.create(dbHelpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
                assert(!err);
                assert(db);
                dbc = db;

                // Check dbc config
                assert.equal(7, Object.keys(dbc._props).length);
                assert.equal(dbc._props.schema, dbc._props.schema);
                assert.equal(dbc._props.user, dbc._props.user);
                assert.equal(dbc._props.host, dbc._props.host);
                assert.equal(dbc._props.database, dbc._props.database);
                assert.equal(dbc._props.password, dbc._props.password);
                assert.equal(dbc._props.port, dbc._props.port);
                assert.equal(2*1000, dbc._props.slow_time);

                // Check here counters and slow_time 
                //assert.equal(0, dbc._pendingRequests.length);
                assert.equal(0, dbc.errRequestsCount);
                assert.equal(0, dbc.pendingRequestsCount);
                assert.equal(0, dbc.completeRequestsCount);
                assert.equal('function', typeof dbc.setErrorHandler);
                assert.equal('function', typeof dbc.setSlowHandler);
                assert.equal(2000, dbc._dbc.kz_slow_time);
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

});


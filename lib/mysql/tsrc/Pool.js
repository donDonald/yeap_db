'use strict';

describe('yeap_db.mysql.Pool', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }

    const forSureIxistingDb    = 'information_schema';
    const forSureIxistingTable = 'TABLES';
    let api, dbHelpers, Pool;
    before(()=>{
        api = re('index');
        dbHelpers = api.mysql.helpers;
        Pool = api.mysql.Pool;
    });

    it('Pool.create, incorrect cridentials.', (done)=>{
        Pool.create({host:'localhost', user:'someuser', password: 'somepwd'}, forSureIxistingDb, (err, dbc)=>{
            assert(err);
            assert(!dbc);
            done();
        });
    });

    it('Pool.create, no database name is given, simply connecting to the db server, list databases.', (done)=>{
        Pool.create(dbHelpers.DB_CRIDENTIALS, undefined, (err, dbc)=>{
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

    it('Pool.create, Connect to not existing db.', (done)=>{
        Pool.create(dbHelpers.DB_CRIDENTIALS, 'thisDbDoesntExistForSure', (err, db)=>{
            assert(err);
            assert(!db);
            done();
        });
    });

    it('Pool.create, Connect to existing db, use custom pool size and slow time.', (done)=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc = undefined;
            });
        });

        const cridentials = JSON.parse(JSON.stringify(dbHelpers.DB_CRIDENTIALS));
        cridentials.pool_size = 64;
        cridentials.slow_time = 10*1000;
        Pool.create(cridentials, forSureIxistingDb, (err, db)=>{
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
            assert.equal(64, dbc._dbc.config.connectionLimit);
            assert.equal(10*1000, dbc._dbc.kz_slow_time);
            assert.equal(64, dbc._dbc.kz_pool_size);
            done();
        });
    });

    it('Pool.create, Connect to existing db.', (done)=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc = undefined;
            });
        });

        Pool.create(dbHelpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
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
            assert.equal(2000, dbc._dbc.slowTime);
            assert.equal(8, dbc._dbc.config.connectionLimit);
            assert.equal(2*1000, dbc._dbc.kz_slow_time);
            assert.equal(8, dbc._dbc.kz_pool_size);
            done();
        });
    });

    it('Pool.create, Connect to existing db, close db manually.', (done)=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc=undefined;
            });
        });

        Pool.create(dbHelpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
            assert(!err);
            assert(db);
            dbc=db;
            assert.equal(forSureIxistingDb, dbc._dbName);
            dbc.close((err)=>{
                assert(!err);
                done();
            });
        });
    });

    it('Pool.create, Connect to existing db, close db manually for many times.', (done)=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc = undefined;
            });
        });

        Pool.create(dbHelpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
            assert(!err);
            assert(db);
            dbc = db;
            assert.equal(forSureIxistingDb, dbc._dbName);
            dbc.close(()=>{
                assert(!err);
                dbc.close(()=>{
                    assert(!err);
                    done();
                });
            });
        });
    });

    it('Pool.create, Connect to existing db, close db in after.', (done)=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc = undefined;
            });
        });

        Pool.create(dbHelpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
            assert(!err);
            assert(db);
            dbc = db;
            assert.equal(forSureIxistingDb, dbc._dbName);
            done();
        });
    });

    it('Pool.create, Connect to existing db, close db in Ut, close db in after.', (done)=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc = undefined;
            });
        });

        Pool.create(dbHelpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
            assert(!err);
            assert(db);
            dbc = db;
            assert.equal(forSureIxistingDb, dbc._dbName);
            dbc.close(()=>{
                assert(!err);
                done();
            });
        });
    });

    it('Pool.query, query data.', (done)=>{
        Pool.create(dbHelpers.DB_CRIDENTIALS, forSureIxistingDb, (err, dbc)=>{
            assert(!err);
            assert(dbc);
            dbc.query('select * from ' + forSureIxistingTable, [], (err, res)=>{
                assert(!err);
                assert(res);
                assert.notEqual(0, res[0].length);
                assert.equal(1, dbc.completeRequestsCount);
                dbc.close(()=>{
                    done();
                });
            });
        });
    });

    it('Make some queries, create table, select, ...', (done)=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc = undefined;
            });
        });

        dbHelpers.create(dbHelpers.DB_CRIDENTIALS, 'justtobedeleteddb2', (err, db)=>{
            assert(!err);

            Pool.create(dbHelpers.DB_CRIDENTIALS, 'justtobedeleteddb2', (err, db)=>{
                assert(!err);
                assert(db);
                dbc = db;

                dbc.query(
                    'CREATE TABLE test ( \id INT UNSIGNED NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, PRIMARY KEY (id) );',
                    [],
                    (err, res)=>{
                        assert.equal(1, dbc.completeRequestsCount);
                        assert(!err);
                        dbc.query(
                            'INSERT INTO test (name) VALUES( \'Ivan\' );',
                            [],
                            (err, res)=>{
                                assert.equal(2, dbc.completeRequestsCount);
                                assert(!err);
                                dbc.query(
                                    'SELECT * from test;',
                                    [],
                                    (err, res)=>{
                                        assert.equal(3, dbc.completeRequestsCount);
                                        assert(!err);
                                        assert(res);
                                        assert.equal(1, res.length );
                                        assert.equal('Ivan', res[0].name );
                                        dbHelpers.tableSize(dbc, 'test', (err, size)=>{
                                            assert.equal(4, dbc.completeRequestsCount);
                                            assert(!err);
                                            assert.equal(1, size);
                                            dbc.query(
                                                'INSERT INTO test (name) VALUES( \'Petr\' );',
                                                [],
                                                (err, res)=>{
                                                    assert.equal(5, dbc.completeRequestsCount);
                                                    assert(!err);
                                                    dbc.query(
                                                        'SELECT * from test;',
                                                        [],
                                                        (err, res)=>{
                                                            assert.equal(6, dbc.completeRequestsCount);
                                                            assert(!err);
                                                            assert(res);
                                                            assert.equal(2, res.length );
                                                            assert.equal('Ivan', res[0].name );
                                                            assert.equal('Petr', res[1].name );
                                                            dbHelpers.tableSize(dbc, 'test', (err, size)=>{
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

        it('Pool.create, Connect to existing db, use slow time assigned to 1 to make slow happen.', (done)=>{
            const props = JSON.parse(JSON.stringify(dbHelpers.DB_CRIDENTIALS));
            props.slow_time = 1;
            Pool.create(props, forSureIxistingDb, (err, db)=>{
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

});


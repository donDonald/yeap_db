'use strict';

describe('yeap_db.postgres.Pool', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }

    const forSureIxistingDb    = 'postgres';
    let api, dbHelpers, Pool;
    before(()=>{
        api = re('index');
        dbHelpers = api.postgres.helpers;
        Pool = api.postgres.Pool;
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
            dbc.query("SELECT datname FROM pg_database WHERE datistemplate = false;", [], (err, res)=>{
                assert(!err, err);
                assert(res);
                assert.equal('object', typeof res);
                dbc.close((err)=>{
                    assert(!err);
                    done();
                });
            })
        });
    });

    it('Pool.create, Connect to not existing db.', (done)=>{
        Pool.create(dbHelpers.DB_CRIDENTIALS, 'thisDbDoesntExistForSure', (err, db)=>{
            assert(err);
            assert(!db);
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
            dbc.query('SELECT * FROM pg_catalog.pg_tables;', [], (err, res)=>{
                assert(!err);
                assert(res);
                assert.notEqual(0, res[0].length);
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
                    'CREATE TABLE test ( id SERIAL, name TEXT NOT NULL, PRIMARY KEY (id) );',
                    [],
                    (err, res)=>{
                        assert(!err, err);
                        dbc.query(
                            'INSERT INTO test (name) VALUES( \'Ivan\' );',
                            [],
                            (err, res)=>{
                                assert(!err);
                                dbc.query(
                                    'SELECT * from test;',
                                    [],
                                    (err, res)=>{
                                        assert(!err);
                                        assert(res);
                                        assert.equal(1, res.length );
                                        assert.equal('Ivan', res[0].name );
                                        dbHelpers.tableSize(dbc, 'test', (err, size)=>{
                                            assert(!err);
                                            assert.equal(1, size);
                                            dbc.query(
                                                'INSERT INTO test (name) VALUES( \'Petr\' );',
                                                [],
                                                (err, res)=>{
                                                    assert(!err);
                                                    dbc.query(
                                                        'SELECT * from test;',
                                                        [],
                                                        (err, res)=>{
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
});


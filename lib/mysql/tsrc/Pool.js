'use strict';

describe('mysql.Pool', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }

    const forSureIxistingDb    = 'information_schema';
    const forSureIxistingTable = 'TABLES';
    let api, sql;
    before(()=>{
        api = re('index');
        sql = api.mysql;
    });

    it('Pool.create, Connect to existing db.', (done)=>{
        let dbc;
        after(()=>{
            dbc.close(()=>{
                dbc = undefined;
            });
        });

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
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

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
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

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
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

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
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

        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, (err, db)=>{
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

    it('Pool.create, Connect to not existing db.', (done)=>{
        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, 'thisDbDoesntExistForSure', (err, db)=>{
            assert(err);
            assert(!db);
            done();
        });
    });

    it('Pool.query, query data.', (done)=>{
        sql.Pool.create(sql.helpers.DB_CRIDENTIALS, forSureIxistingDb, (err, dbc)=>{
            assert(!err);
            assert(dbc);
            dbc.query('select * from ' + forSureIxistingTable, [], (err, res)=>{
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

        sql.helpers.create(sql.helpers.DB_CRIDENTIALS, 'justToBeDeletedDb2', (err, db)=>{
            assert(!err);

            sql.Pool.create(sql.helpers.DB_CRIDENTIALS, 'justToBeDeletedDb2', (err, db)=>{
                assert(!err);
                assert(db);
                dbc = db;

                dbc.query(
                    'CREATE TABLE test ( \id INT UNSIGNED NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, PRIMARY KEY (id) );',
                    [],
                    (err, res)=>{
                        assert(!err);
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
                                        sql.helpers.tableSize(dbc, 'test', (err, size)=>{
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
                                                            sql.helpers.tableSize(dbc, 'test', (err, size)=>{
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


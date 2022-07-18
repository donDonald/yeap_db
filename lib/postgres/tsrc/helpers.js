'use strict';

describe('yeap_db.postgres.helpers', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }

    const forSureIxistingDb = 'postgres';
    let api, helpers, createDbName;
    before(()=>{
        api = re('index');
        helpers = api.postgres.helpers;
        createDbName = (name)=>{ return api.Db.createDbName('yeap_db_postgres_helpers_'+name); }
    });

    it('#helpers.list, List dbs, incorrect cridentials.', (done)=>{
        const cridentials = { host:'localhost', port:'5432', database:'postgres', user:'test1234', password:'test1234_wrong!'};
        helpers.list(cridentials, (err, res)=>{
            assert(err);
            assert(!res);
            assert.equal('28P01', err.code); // 28P01 == invalid_password; https://postgrespro.ru/docs/postgresql/9.4/errcodes-appendix
            done();
        });
    });

    it('#helpers.list, List dbs, correct cridentials.', (done)=>{
        helpers.list(helpers.DB_CRIDENTIALS, (err, res)=>{
            assert(!err);
            assert(res);
            assert(res.length>0);
            let indexFound = -1;
            res.forEach((r, index)=>{
                if(r.datname == forSureIxistingDb) {
                    indexFound = index;
                }
            });
            assert.notEqual(-1, indexFound);
            done();
        });
    });

    it('#helpers.exists, Check db exists, not existing db.', (done)=>{
        helpers.exists(helpers.DB_CRIDENTIALS, 'thisDbDoesntExistForSure', (err, res)=>{
            assert(!err);
            assert.equal(false, res);
            done();
        });
    });

    it('#helpers.exists, Check db exists, existing db.', (done)=>{
        helpers.exists(helpers.DB_CRIDENTIALS, forSureIxistingDb, (err, res)=>{
            assert(!err);
            assert.equal(true, res);
            done();
        });
    });

    it('#helpers.createAndConnect', (done)=>{
        const dbName = createDbName('createAndConnect');
        helpers.createAndConnect(helpers.DB_CRIDENTIALS, dbName, (err, dbc)=>{
            assert(!err);
            assert(dbc);
            dbc.close(done);
        });
    });

    it('#helpers.createAndQuery', (done)=>{
        const dbName = createDbName('createAndQuery');
        const queries = [
            'SELECT * FROM information_schema.tables'
        ]
        helpers.createAndQuery(helpers.DB_CRIDENTIALS, dbName, queries, (err, dbc, result)=>{
            assert(!err);
            assert(dbc);
            assert(result);
            dbc.close(done);
        });
    });

    it('#helpers.connectAndQuery', (done)=>{
        const dbName = createDbName('createAndConnect');
        const q = 'SELECT * FROM information_schema.tables';
        helpers.connectAndQuery(helpers.DB_CRIDENTIALS, helpers.DB_CRIDENTIALS.database, q, (err, dbc, result)=>{
            assert(!err);
            assert(dbc);
            assert(result);
            dbc.close(done);
        });
    });

    it('helpers.create, helpers.delete, Create and delete database.', (done)=>{
        helpers.exists(helpers.DB_CRIDENTIALS, 'justtobedeleteddb', (err, res)=>{
            assert(!err);
            assert.equal(false, res);

            helpers.create(helpers.DB_CRIDENTIALS, 'justtobedeleteddb', (err)=>{
                assert(!err);

                helpers.exists(helpers.DB_CRIDENTIALS, 'justtobedeleteddb', (err, res)=>{
                    assert(!err);
                    assert.equal(true, res);

                    helpers.delete(helpers.DB_CRIDENTIALS, 'justtobedeleteddb', (err)=>{
                        assert(!err);

                        helpers.exists(helpers.DB_CRIDENTIALS, 'justtobedeleteddb', (err, res)=>{
                            assert(!err);
                            assert.equal(false, res);
                            done();
                        });
                    });
                });
            });
        });
    });

    it('helpers.delete, Delete not existing db.', (done)=>{
        helpers.exists(helpers.DB_CRIDENTIALS, 'thisDbDoesntExistForSure', (err, res)=>{
            assert(!err);
            assert.equal(false, res);
            helpers.delete(helpers.DB_CRIDENTIALS, 'thisDbDoesntExistForSure', (err)=>{
                assert(!err, err);
                done();
            });
        });
    });
});


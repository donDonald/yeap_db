'use strict';

describe('yeap_db.mysql.helpers', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }

    const forSureIxistingDb = 'information_schema';
    let api, helpers, createDbName;
    before(()=>{
        api = re('index');
        helpers = api.mysql.helpers;
        createDbName = (name)=>{ return api.Db.createDbName('yeap_db_mysql_helpers_'+name); }
    });

    it('helpers.list, List dbs, incorrect cridentials.', (done)=>{
        const cridentials = {host:'localhost', user:'someuser', password: 'somepwd'};
        helpers.list(cridentials, (err, res)=>{
            assert(err);
            assert(!res);
            assert.equal('ER_ACCESS_DENIED_ERROR', err.code);
            done();
        });
    });

    it('helpers.list, List dbs, correct cridentials.', (done)=>{
        helpers.list(helpers.DB_CRIDENTIALS, (err, res)=>{
            assert(!err);
            assert(res);
            assert.notEqual(-1, res.indexOf(forSureIxistingDb));
            done();
        });
    });

    it('helpers.exists, Check db exists, not existing db.', (done)=>{
        helpers.exists(helpers.DB_CRIDENTIALS, 'thisDbDoesntExistForSure', (err, res)=>{
            assert(!err);
            assert.equal(false, res);
            done();
        });
    });

    it('helpers.exists, Check db exists, existing db.', (done)=>{
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
        const q = 'show tables';
        helpers.connectAndQuery(helpers.DB_CRIDENTIALS, forSureIxistingDb, q, (err, dbc, result)=>{
            assert(!err);
            assert(dbc);
            assert(result);
            dbc.close(done);
        });
    });

    it('helpers.create, helpers.delete, Create and delete database.', (done)=>{
        helpers.exists(helpers.DB_CRIDENTIALS, 'justToBeDeletedDb', (err, res)=>{
            assert(!err);
            assert.equal(false, res);

            helpers.create(helpers.DB_CRIDENTIALS, 'justToBeDeletedDb', (err)=>{
                assert(!err);

                helpers.exists(helpers.DB_CRIDENTIALS, 'justToBeDeletedDb', (err, res)=>{
                    assert(!err);
                    assert.equal(true, res);

                    helpers.delete(helpers.DB_CRIDENTIALS, 'justToBeDeletedDb', (err)=>{
                        assert(!err);

                        helpers.exists(helpers.DB_CRIDENTIALS, 'justToBeDeletedDb', (err, res)=>{
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


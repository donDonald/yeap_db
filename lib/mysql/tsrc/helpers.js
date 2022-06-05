'use strict';

describe('mysql.helpers', ()=>{

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
        helpers.cridentials = {host:'localhost', user:'someuser', password: 'somepwd'};
        helpers.list((err, res)=>{
            assert(err);
            assert(!res);
            assert.equal('ER_ACCESS_DENIED_ERROR', err.code);
            done();
        });
    });

    it('helpers.list, List dbs, correct cridentials.', (done)=>{
        helpers.cridentials = helpers.DB_CRIDENTIALS;
        helpers.list((err, res)=>{
            assert(!err);
            assert(res);
            assert.notEqual(-1, res.indexOf(forSureIxistingDb));
            done();
        });
    });

    it('helpers.exists, Check db exists, not existing db.', (done)=>{
        helpers.exists('thisDbDoesntExistForSure', (err, res)=>{
            assert(!err);
            assert.equal(false, res);
            done();
        });
    });

    it('helpers.exists, Check db exists, existing db.', (done)=>{
        helpers.exists(forSureIxistingDb, (err, res)=>{
            assert(!err);
            assert.equal(true, res);
            done();
        });
    });

    it('#helpers.createAndConnect', (done)=>{
        const dbName = createDbName('createAndConnect');
        helpers.createAndConnect(dbName, (err, dbc)=>{
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
        helpers.createAndQuery(dbName, queries, (err, dbc, result)=>{
            assert(!err);
            assert(dbc);
            assert(result);
            dbc.close(done);
        });
    });

    it('#helpers.connectAndQuery', (done)=>{
        const q = 'show tables';
        helpers.connectAndQuery(forSureIxistingDb, q, (err, dbc, result)=>{
            assert(!err);
            assert(dbc);
            assert(result);
            dbc.close(done);
        });
    });

    it('helpers.create, helpers.delete, Create and delete database.', (done)=>{
        helpers.exists('justToBeDeletedDb', (err, res)=>{
            assert(!err);
            assert.equal(false, res);

            helpers.create('justToBeDeletedDb', (err)=>{
                assert(!err);

                helpers.exists('justToBeDeletedDb', (err, res)=>{
                    assert(!err);
                    assert.equal(true, res);

                    helpers.delete('justToBeDeletedDb', (err)=>{
                        assert(!err);

                        helpers.exists('justToBeDeletedDb', (err, res)=>{
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
        helpers.exists('thisDbDoesntExistForSure', (err, res)=>{
            assert(!err);
            assert.equal(false, res);
            helpers.delete('thisDbDoesntExistForSure', (err)=>{
                assert(!err, err);
                done();
            });
        });
    });

});


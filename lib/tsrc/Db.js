'use strict';

describe('yeap_db.Db', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../' + module); }

    let api, Db;
    before(()=>{
        api = re('index');
        Db = api.lib.Db;
    });

    describe('#Db.validateConfig', ()=>{
        it('no databases', ()=>{
            Db.validateConfig({});
        });

        it('1 database', ()=>{
            const databases = {
                db1 : {
                    schema: 'postgres',
                    user: 'admin',
                    host: '127.0.0.1',
                    database: 'stuff',
                    password: 'somepwd',
                    port: '5432'
                }
            };
            Db.validateConfig(databases);
        });

        it('2 databases', ()=>{
            const databases = {
                db1 : {
                    schema: 'mysql',
                    user: 'ptaranov',
                    host: 'loclahost',
                    database: 'superDb',
                    password: 'qwerty',
                    port: '5432'
                }
            };
            Db.validateConfig(databases);
        });
    });

    describe('#Db.loadDriver', ()=>{
        const drivers = {};
        it('mysql', ()=>{
            const driver = Db.loadDriver(drivers, 'mysql');
            assert.equal('function', typeof driver);
            assert.equal('mysql', driver.name);
            assert.equal(1, Object.keys(drivers).length);
            assert(drivers.mysql);
        });

        it('postgres', ()=>{
            const driver = Db.loadDriver(drivers, 'postgres');
            assert.equal('function', typeof driver);
            assert.equal('postgres', driver.name);
            assert.equal(2, Object.keys(drivers).length);
            assert(drivers.mysql);
            assert(drivers.postgres);
        });
    });

    describe('#Db.open, #Db.close', ()=>{
        let db;
        it('Setup', ()=>{
            const databases = {
                db1 : {
                    schema: 'mysql',
                    user: 'ptaranov',
                    host: 'loclahost',
                    database: 'superDb',
                    password: 'qwerty',
                    port: '5432'
                },
                db2 : {
                    schema: 'postgres',
                    user: 'ptaranov',
                    host: 'loclahost',
                    database: 'superDb',
                    password: 'qwerty',
                    port: '5432'
                }
            };

            db = new Db(databases);
            assert(!db._connections);
        });

        it('Close, no databases are open', (done)=>{
            db.close((err)=>{
                assert(!err);
                done();
            });
        });

        it('Open databases', (done)=>{
            db.open((err, connections)=>{
                assert(!err);
                assert(connections);
                assert.equal(2, Object.keys(connections).length);
                assert(connections.db1);
                assert(connections.db2);
                assert(db._connections.db1);
                assert(db._connections.db2);
                done();
            });
        });

        it('Close databases', (done)=>{
            db.close((err)=>{
                assert(!err);
                assert(!db._connections);
                done();
            });
        });

        it('Close databases again', (done)=>{
            db.close((err)=>{
                assert(!err);
                assert(!db._connections);
                done();
            });
        });
    });
});


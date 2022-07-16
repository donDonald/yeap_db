'use strict';

describe('yeap_db.Db', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../' + module); }

    let api, createDbName;
    before(()=>{
        api = re('index');
        createDbName = (name)=>{  return api.Db.createDbName('yeap_db_Db_'+name); }
    });

    describe('#Db.validateConfig', ()=>{
        it('no databases', ()=>{
            api.Db.validateConfig({});
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
            api.Db.validateConfig(databases);
        });

        it('2 databases', ()=>{
            const databases = {
                db1 : {
                    schema: 'mysql',
                    user: 'ptaranov',
                    host: 'localhost',
                    database: 'superDb',
                    password: 'qwerty',
                    port: '5432'
                }
            };
            api.Db.validateConfig(databases);
        });
    });

    describe('#Db.loadDriver', ()=>{
        const drivers = {};
        it('mysql', ()=>{
            const driver = api.Db.loadDriver(drivers, 'mysql');
            assert.equal('function', typeof driver);
            assert.equal('mysql', driver.schema);
            assert.equal(1, Object.keys(drivers).length);
            assert(drivers.mysql);
        });

        it('postgres', ()=>{
            const driver = api.Db.loadDriver(drivers, 'postgres');
            assert.equal('function', typeof driver);
            assert.equal('postgres', driver.schema);
            assert.equal(2, Object.keys(drivers).length);
            assert(drivers.mysql);
            assert(drivers.postgres);
        });
    });

    describe('#Db.open, #Db.close', ()=>{

        let databases;
        it('Create databases', (done)=>{
            let foreach = (index, container, foo, cb)=>{
                if(index < container.length) {
                    foo(container[index], ()=>{
                        foreach(index+1, container, foo, cb);
                    });
                } else {
                    cb();
                }
            }

            databases = {};
            databases.db1 = JSON.parse(JSON.stringify(api.mysql.helpers.DB_CRIDENTIALS));
            databases.db1.schema = 'mysql';
            databases.db2 = JSON.parse(JSON.stringify(api.postgres.helpers.DB_CRIDENTIALS));
            databases.db2.schema = 'postgres';

            const entries = Object.entries(databases);
            foreach(0, entries, (d, complete)=>{
                const dbAlias = d[0];
                const dbProps = d[1];
                assert(dbProps.schema);
                const dbName = createDbName(dbProps.schema);
                api[dbProps.schema].helpers.create(dbProps, dbName, (err)=>{
                    dbProps.database = dbName; // Update dbprops.database
                    assert(!err, err);
                    complete();
                });
            }, done);
        });

        let db;
        it('Setup', ()=>{
            db = new api.Db(databases);
            assert(!db.connections);
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
                assert(db.connections.db1);
                assert(db.connections.db2);
                done();
            });
        });

        it('Close databases', (done)=>{
            db.close((err)=>{
                assert(!err);
                assert(!db.connections);
                done();
            });
        });

        it('Close databases again', (done)=>{
            db.close((err)=>{
                assert(!err);
                assert(!db.connections);
                done();
            });
        });
    });
});


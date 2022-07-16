'use strict';

describe('yeap_db.mysql.Driver', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../' + module); }

    let Driver, helpers;
    before(()=>{
        Driver = re('Driver');
        helpers = re('helpers');
    });

    describe('One driver', ()=>{
        let driver, dbc;

        it('Create driver', ()=>{
            driver = new Driver;
            assert.equal(driver.constructor.schema, 'mysql');
        });

        it('Close driver', (done)=>{
            driver.close((err)=>{
                assert(!err);
                done();
            });
        });

        it('Open driver', (done)=>{
            driver.open(helpers.DB_CRIDENTIALS, (err, connection)=>{
                assert(!err, err);
                assert(connection);
                assert(connection._dbc);
                dbc = connection;
                done();
            });
        });

        it('Make a query', (done)=>{
            dbc.query('show databases', [], (err, result)=>{
                assert(!err, err);
                assert(result);
                assert(result.length > 0);
              //console.dir(result);
                done();
            });
        });

        it('Close connection', (done)=>{
            dbc.close((err)=>{
                assert(!err, err);
                assert(!dbc._dbc);
                done();
            });
        });

        it('Close driver', (done)=>{
            driver.close((err)=>{
                assert(!err);
                done();
            });
        });
    });

    describe('Many drivers', ()=>{
        let drivers=[], dbcs=[];
        let foreach = (index, container, foo, cb)=>{
            if(index < container.length) {
                foo(container[index], ()=>{
                    foreach(index+1, container, foo, cb);
                });
            } else {
                cb();
            }
        }

        it('Create 10 drivers', ()=>{
            for(let i=0; i<10; ++i) {
                const driver = new Driver;
                assert.equal(driver.constructor.schema, 'mysql');
                drivers.push(driver);
            }
        });

        it('Close drivers', (done)=>{
            foreach(0, drivers, (driver, complete)=>{
                driver.close((err)=>{
                    assert(!err);
                    complete();
                });
            }, done);
        });

        it('Open drivers', (done)=>{
            assert.equal(dbcs.length, 0);
            foreach(0, drivers, (driver, complete)=>{
                driver.open(helpers.DB_CRIDENTIALS, (err, connection)=>{
                    assert(!err, err);
                    assert(connection);
                    assert(connection._dbc);
                    dbcs.push(connection);
                    complete();
                });
            }, ()=>{
                assert.equal(dbcs.length, 10);
                done();
            });
        });

        it('Make 1 query per connection', (done)=>{
            foreach(0, dbcs, (dbc, complete)=>{
                dbc.query('show databases', [], (err, result)=>{
                    assert(!err, err);
                    assert(result);
                    assert(result.length > 0);
                    //console.dir(result);
                    complete();
                });
            }, done);
        });

        it('Close connections', (done)=>{
            foreach(0, dbcs, (dbc, complete)=>{
                dbc.close((err)=>{
                    assert(!err, err);
                    assert(!dbc._dbc);
                    complete();
                });
            }, done);
        });

        it('Close driver', (done)=>{
            foreach(0, drivers, (driver, complete)=>{
                driver.close((err)=>{
                    assert(!err);
                    complete();
                });
            }, done);
        });
    });

});


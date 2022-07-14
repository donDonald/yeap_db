'use strict';

const assert = require('assert');

module.exports = (testName, api, dbHelpers, Dbc, cridentials, dbTable)=>{
    assert(testName);
    assert(api);
    assert(dbHelpers);
    assert(Dbc);
    assert(cridentials);
    assert(dbTable);
    const createDbName = (name)=>{ return api.db.Db.createDbName('yeap_db_' + name + '_' +  testName); }
//  const RUN_TIME_SEC = 600;
    const getRandomInt = (min, max)=>{ return Math.floor(Math.random() * (max - min) + min); }

    //---------------------------------------------------------------------------

    const Worker = function(id, dbc) {
    //  api.lib.log.debug('Worker(), id:' + id);
        assert(id);
        assert(dbc);
        assert(dbc.query);
        this.id  = id;
        this.dbc = dbc;

        const queries = [
            'INSERT INTO sessions (value, length) VALUES(\'%user%\', 123456);',
            'SELECT * from sessions WHERE id=%id%;',
    //      'SELECT SLEEP(1);'
        ];

        const self = this;
        this.start = function() {
    //      api.lib.log.debug('Worker.start()');
            assert(!this.timerId);
            this.timerId = setInterval(
                ()=>{
                    const i = getRandomInt(0, queries.length);
                    let q = queries[i];
                    if (i==0) {
                        q = q.replace('%user%', self.id);
                    } else if (i==1) {
                        const id = getRandomInt(0, self.dbc.completeRequestsCount);
                        q = q.replace('%id%', id);
                    } else {
                        assert(false);
                    }
                    //console.log('Worker.start, q:' + q);
                    self.dbc.query(q, [], (err)=>{
                        if(err) {
                            console.log('Worker.start, err:' + err);
                        }
                        assert(!err, err);
                    });
                },
                1000);
        }

        this.stop = function() {
    //      api.lib.log.debug('Worker.stop()');
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = undefined;
            }
        }
    }

    //---------------------------------------------------------------------------

    const Master = function(dbc) {
        assert(dbc);
        assert(dbc.query);
        this.dbc = dbc;
        this.workerId = 0;
        this.workers = [];

        this.handleDbSlow = function(err, res, fields, query, executionTime) {
            console.log('!!!!!! DB is slow(' + this.dbc.slowsRequestsCount + '), ' + executionTime + 'ms\t' + query.sql );
            if(this.dbc.slowsRequestsCount > 500) {
                if(this.waitCb) {
                    const cb = this.waitCb;
                    this.waitCb = undefined;
                    setImmediate(cb); // Perform wait callback
                }
            }
        }

        this.handleDbError = function(err, res, fields, query) {
            console.log('!!!!!! DB query error, ' + error + '\t' + query.sql);
        }

        this.wait = function(cb) {
            this.waitCb = cb;
        }

        this.start = function() {
            console.log('Master.start()');
            assert(!this.timerId);
            const self = this;

            dbc.setSlowHandler(this.handleDbSlow.bind(this));
            dbc.setErrorHandler(this.handleDbError.bind(this));

            this.timerId = setInterval(
                ()=>{
                    const id = this.workerId.toString();
                    this.workerId++;
                    const worker = new Worker(id, this.dbc);
                    worker.start();
                    self.workers.push(worker);
                    console.log('Master.start, workers.length:' + self.workers.length + ', requests:' + self.dbc.completeRequestsCount + ', pending requests:' + self.dbc.pendingRequestsCount);
                },
                1000);
        }

        this.stop = function(cb) {
            console.log('Master.stop()');
            assert(cb);

            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = undefined;
                this.workers.forEach((w)=>{
                    w.stop();
                });
            }

            const self = this;
            this.timerId = setInterval(
                ()=>{
                    console.log('Master.start, workers.length:' + self.workers.length + ', requests:' + self.dbc.completeRequestsCount + ', pending requests:' + self.dbc.pendingRequestsCount);
                    if (self.dbc.pendingRequestsCount == 0) {
                        clearInterval(self.timerId);
                        self.timerId = undefined;
                        cb();
                    }
                },
                1000);
        }
    }

    //---------------------------------------------------------------------------

    describe('yeap_db.performance.' + testName, ()=>{
        let dbName;
        it('Create db.', (done)=>{
            dbName = createDbName('PerformanceTest');
            dbHelpers.createAndConnect(cridentials, dbName, (err, dbc)=>{
                assert(!err);
                assert(dbc);

                const files = [
                    {file:dbTable, value:'sessions'}
                ];

                const run = function(index, items, dbc, cb) {
                    if (index < items.length) {
                        let query = api.fs.readFileSync(items[index].file, 'utf8');
                        query = query.replace(/%tableName%/g, items[index].value);
                        //console.log('DbProxy.create, query:' + query);

                        dbc.query(query, [], function(err, res) {
                            if(err) {
                                cb(err);
                            } else {
                                run(index + 1, items, dbc, cb);
                            }
                        });
                    } else {
                        cb();
                    }
                }

                run(0, files, dbc, (err)=>{
                    assert(!err, err);
                    dbc.close(done);
                });
            });
        });

        let master, dbc;
        it('Create db connection.', (done)=>{
            Dbc.create(cridentials, dbName, (err, db)=>{
                assert(!err, err);
                assert(db);
                dbc = db;
                console.log('connection pool size:' + dbc._dbc.kz_pool_size);
                console.log('connection slow time:' + dbc._dbc.kz_slow_time);
                done();
            });
        });

        it('Start.', ()=>{
            master = new Master(dbc);
            master.start();
        });

        it('Wait.', (done)=>{
            master.wait(done);
          //setTimeout(
          //    ()=>{
          //        done();
          //    },
          //    RUN_TIME_SEC*1000);
        });

        it('Stop.', (done)=>{
            master.stop(()=>{ done(); });
        });

        it('Close db.', function(done) {
            console.log('requests complete:' + dbc.completeRequestsCount);
            dbc.close((err)=>{
                assert(!err);
                done();
            });
        });

    });
}


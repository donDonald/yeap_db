'use strict';

module.exports = (SQL_DRIVER, schema)=>{

describe('model.query.' + SQL_DRIVER, ()=>{

    const MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){let I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){let Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

    const makeId = ()=>{
        return MD5(Math.random().toString(16));
    }

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }
    let createDbName;
    let dbProps;
    let api, query;

    // Database record
    let Record = function (props) {
        if (props.uid) this.uid = props.uid;
        if (props.name) this.name = props.name;
        if (props.address) this.address = props.address;
        if (props.email) this.email = props.email;
        if (props.stts) this.stts = props.stts;
    }

    // \brief These keys are mant for mapping JS fileds to DB fields.
    //        Postgresql doesn't support camel-case notation.
    Record.dbKeys = {};
    Record.dbKeys.uid = 'uid';
    Record.dbKeys.name = 'name';
    Record.dbKeys.address = 'address';
    Record.dbKeys.email = 'email';
    Record.dbKeys.stts = 'stts';
    Record.dbKeysArray = Object.values(Record.dbKeys);

    before(()=>{
        api = re('index');
        assert(api.Db);
        createDbName=(name)=>{ return api.Db.createDbName('yeap_db_model_') + name };
        api.model = re('model/index');
        assert(api.model.count);
        assert(api.model.add);
        assert(api.model.delete);
        assert(api.model.query);
        query = api.model.query;

        const cridentials = api[SQL_DRIVER].helpers.DB_CRIDENTIALS;
        dbProps = JSON.parse(JSON.stringify(cridentials));

        // Database record
        Record.makeId = makeId;
    });

    describe('query.makeColumns', ()=>{
        it('undefined', ()=>{
            const result = query.makeColumns();
            assert.equal('*', result);
        });

        it('key1, key2', ()=>{
            const result = query.makeColumns('key1, key2');
            assert.equal('key1, key2', result);
        });

        it('["name:]', ()=>{
            const keys = ['name'];
            const result = query.makeColumns(keys);
            assert.equal('name', result);
        });

        it('["name", "age"]', ()=>{
            const keys = ['name', 'age'];
            const result = query.makeColumns(keys);
            assert.equal('name,age', result);
        });
    });

    describe('query.makeWhere', ()=>{
        it('undefined', ()=>{
            const result = query.makeWhere();
            assert.equal('', result);
        });

        it('name = "Pablo"', ()=>{
            const result = query.makeWhere('name = "Pablo"');
            assert.equal(' WHERE name = "Pablo"', result);
        });

        it('{}', ()=>{
            const result = query.makeWhere({});
            assert.equal('', result);
        });

        it('{name: \'Pablo\'}', ()=>{
            const result = query.makeWhere({name:'Pablo'});
            assert.equal(' WHERE name=\'Pablo\'', result);
        });

        it('{name: \'Pabl*\'"}', ()=>{
            const result = query.makeWhere({name:'Pabl*'});
            assert.equal(' WHERE name LIKE \'Pabl_\'', result);
        });

        it('{name: \'*ablo\'}', ()=>{
            const result = query.makeWhere({name:'*ablo'});
            assert.equal(' WHERE name LIKE \'_ablo\'', result);
        });

        it('{name: \'**blo\'}', ()=>{
            const result = query.makeWhere({name:'**blo'});
            assert.equal(' WHERE name LIKE \'%blo\'', result);
        });

        it('{name: \'*abl*\'}', ()=>{
            const result = query.makeWhere({name:'*abl*'});
            assert.equal(' WHERE name LIKE \'_abl_\'', result);
        });

        it('{name: \'**b**\'}', ()=>{
            const result = query.makeWhere({name:'**b**'});
            assert.equal(' WHERE name LIKE \'%b%\'', result);
        });

        it('{name: \'P**l**\'}', ()=>{
            const result = query.makeWhere({name:'P**l**'});
            assert.equal(' WHERE name LIKE \'P%l%\'', result);
        });

        it('{name: \'Pablo\', surname:\'Ivanov\'}', ()=>{
            const result = query.makeWhere({name: 'Pablo', surname:'Ivanov'});
            assert.equal(' WHERE name=\'Pablo\' AND surname=\'Ivanov\'', result);
        });

        it('{name: \'Pablo\', surname:\'Ivano*\'', ()=>{
            const result = query.makeWhere({name: 'Pablo', surname:'Ivano*'});
            assert.equal(' WHERE name=\'Pablo\' AND surname LIKE \'Ivano_\'', result);
        });

        it('{name: \'Pablo\', surname:\'Ivan**\'}', ()=>{
            const result = query.makeWhere({name: 'Pablo', surname:'Ivan**'});
            assert.equal(' WHERE name=\'Pablo\' AND surname LIKE \'Ivan%\'', result);
        });

        it('{name: \'Pablo\', surname:\'**\'}', ()=>{
            const result = query.makeWhere({name: 'Pablo', surname:'**'});
            assert.equal(' WHERE name=\'Pablo\' AND surname LIKE \'%\'', result);
        });
    });

    describe('query.makePositionStatement', ()=>{
        it('undefined', ()=>{
            const result = query.makePositionStatement();
            assert.equal('', result);
        });

        it(' LIMIT 100', ()=>{
            const result = query.makePositionStatement({count:100});
            assert.equal(' LIMIT 100', result);
        });

        it(' OFFSET 0', ()=>{
            const result = query.makePositionStatement({offset:0});
            assert.equal(' OFFSET 0', result);
        });

        it(' LIMIT 100 OFFSET 1000', ()=>{
            const result = query.makePositionStatement({count:100, offset:1000});
            assert.equal(' LIMIT 100 OFFSET 1000', result);
        });
    });

    describe('query.makePositionStatement', ()=>{
        it('undefined', ()=>{
            const result = query.makeOrderStatement();
            assert.equal('', result);
        });

        it(' ORDER BY name', ()=>{
            const result = query.makeOrderStatement({by:'name'});
            assert.equal(' ORDER BY name', result);
        });

        it(' ORDER BY name ASC', ()=>{
            const result = query.makeOrderStatement({by:'name', direction:'ASC'});
            assert.equal(' ORDER BY name ASC', result);
        });

        it(' ORDER BY name DESC', ()=>{
            const result = query.makeOrderStatement({by:'name', direction:'DESC'});
            assert.equal(' ORDER BY name DESC', result);
        });
    });

    describe('query.makeQuery', ()=>{
        it('SELECT * from users', ()=>{
            const opts = {
            };
            const q = query.makeQuery('users', opts);
            assert.equal('SELECT * FROM users', q);
        });

        it('SELECT name,surname from users', ()=>{
            const opts = {
                keys:['name', 'surname'],
            };
            const q = query.makeQuery('users', opts);
            assert.equal('SELECT name,surname FROM users', q);
        });

        it('SELECT name,surname from users WHERE name=\'Natalia\'', ()=>{
            const opts = {
                keys:['name', 'surname'],
                where:{name: 'Natalia'},
            };
            const q = query.makeQuery('users', opts);
            assert.equal('SELECT name,surname FROM users WHERE name=\'Natalia\'', q);
        });

        it('SELECT name,surname from users WHERE name=\'Natalia\' AND surname LIKE \'Za%\'', ()=>{
            const opts = {
                keys:['name', 'surname'],
                where:{name: 'Natalia', surname: 'Za**'},
            };
            const q = query.makeQuery('users', opts);
            assert.equal('SELECT name,surname FROM users WHERE name=\'Natalia\' AND surname LIKE \'Za%\'', q);
        });

        it('SELECT name,surname from users WHERE name=\'Natalia\' AND surname LIKE \'Za%\' LIMIT 100 OFFSET 0', ()=>{
            const opts = {
                keys: ['name', 'surname'],
                where: {name: 'Natalia', surname: 'Za**'},
                position: {count:100, offset:0}
            };
            const q = query.makeQuery('users', opts);
            assert.equal('SELECT name,surname FROM users WHERE name=\'Natalia\' AND surname LIKE \'Za%\' LIMIT 100 OFFSET 0', q);
        });

        it('SELECT name,surname from users WHERE name=\'Natalia\' AND surname LIKE \'Za%\' LIMIT 100 OFFSET 0 ORDER BY name', ()=>{
            const opts = {
                keys: ['name', 'surname'],
                where: {name: 'Natalia', surname: 'Za**'},
                position: {count:100, offset:0},
                order: {by:'name'}
            };
            const q = query.makeQuery('users', opts);
            assert.equal('SELECT name,surname FROM users WHERE name=\'Natalia\' AND surname LIKE \'Za%\' ORDER BY name LIMIT 100 OFFSET 0', q);
        });
    });

    describe('query.run', ()=>{
        let dbc, dbCount, dbAdd;

        const addSome = (index, count, add, cb)=>{
            if (index<count) {
                add(
                    {
                        uid:                   makeId(),
                        name:                  'Name-'+ index,
                        address:               'address-'+ index,
                        email:                 'email-'+ index
                    },
                    (err, record)=>{
    //                  console.log('err:', err);
    //                  console.log('record:', record);
                        assert(!err, err);
                        assert(record);
                        addSome(index+1, count, add, cb);
                    }
                );
            } else {
                cb();
            }
        }

        before((done)=>{
            dbProps.database = createDbName('run');
            api[SQL_DRIVER].helpers.create(
                dbProps,
                dbProps.database,
                (err)=>{
                    assert(!err, err);
                    api[SQL_DRIVER].helpers.connect(dbProps, dbProps.database, (err, result)=>{
                        assert(!err, err);
                        dbc = result;
                        dbCount = api.model.count.bind(undefined, dbc, 'records');
                        dbAdd = api.model.add.bind(undefined, dbc, 'records', Record);
                        api[SQL_DRIVER].helpers.query(dbc, [schema], (err)=>{
                            assert(!err, err);
                            done();
                        });
                    });
                }
            );
        });

        after((done)=>{
            dbc.close(done);
        });

        const inserter = (values, value)=>{
            if (!values) {
                return [];
            }
            values.push(value);
            return values;
        }

        it('SELECT * FROM records', (done)=>{
            const opts = {
            };
            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
                assert.equal(0, elements.length);
                done();
            });
        });

        it('model.count', (done)=>{
            dbCount((err, count)=>{
                assert(!err, err);
                assert.equal(0, count);
                done();
            });
        });

        it('insert 30 records', (done)=>{
            addSome(0, 30, dbAdd, ()=>{
                done();
            });
        });

        it('model.count', (done)=>{
            dbCount((err, count)=>{
                assert(!err, err);
                assert.equal(30, count);
                done();
            });
        });

        it('SELECT * FROM records', (done)=>{
            const opts = {
            };
            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
//              console.log('res:', elements);
                assert.equal(30, elements.length);
                const keys = Object.keys(Record.dbKeys);
                elements.forEach((e, index)=>{
                    keys.forEach((k)=>{
                        assert(typeof e[k] !== 'undefined', 'missing key:' + k);
                    });
                });
                done();
            });
        });

        it('SELECT email FROM records', (done)=>{
            const opts = {
                keys: [Record.dbKeys.email],
            };
            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
//              console.log('res:', elements);
                assert.equal(query.q, 'SELECT email FROM records');
                assert.equal(30, elements.length);
                elements.forEach((e, index)=>{
                    assert.equal(1, Object.keys(e).length);
                    assert(e.email);
                });
                done();
            });
        });

        it('SELECT name FROM records WHERE name=\'Name-10\'', (done)=>{
            const opts = {
                keys: [Record.dbKeys.name],
                where: {},
            };
            opts.where[Record.dbKeys.name] = 'Name-10';

            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
//              console.log('res:', elements);
                assert.equal(query.q, 'SELECT name FROM records WHERE name=\'Name-10\'');
                assert.equal(1, elements.length);
                const e = elements[0];
                assert.equal(1, Object.keys(e).length);
                assert.equal(e.name, 'Name-10');
                done();
            });
        });

        it('SELECT name FROM records WHERE name LIKE \'Name-1_\'', (done)=>{
            const opts = {
                keys: [Record.dbKeys.name],
                where: {},
            };
            opts.where[Record.dbKeys.name] = 'Name-1*';

            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
//              console.log('res:', elements);
                assert.equal(query.q, 'SELECT name FROM records WHERE name LIKE \'Name-1_\'');
                assert.equal(10, elements.length);
                elements.forEach((e, index)=>{
                    assert.equal(1, Object.keys(e).length);
                    assert.equal(e.name, 'Name-1'+index);
                });
                done();
            });
        });

        it('SELECT name FROM records WHERE name LIKE \'Name-%\'', (done)=>{
            const opts = {
                keys: [Record.dbKeys.name],
                where: {},
            };
            opts.where[Record.dbKeys.name] = 'Name-**';

            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
//              console.log('res:', elements);
                assert.equal(query.q, 'SELECT name FROM records WHERE name LIKE \'Name-%\'');
                assert.equal(30, elements.length);
                elements.forEach((e, index)=>{
                    assert.equal(1, Object.keys(e).length);
                    assert.equal(e.name, 'Name-'+index);
                });
                done();
            });
        });

        it('SELECT name FROM records WHERE name LIKE \'Name-%\' LIMIT 3 OFFSET 0', (done)=>{
            const opts = {
                keys: [Record.dbKeys.name],
                where: {},
                position: {count:3, offset:0},
            };
            opts.where[Record.dbKeys.name] = 'Name-**';

            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
//              console.log('res:', elements);
                assert.equal(query.q, 'SELECT name FROM records WHERE name LIKE \'Name-%\' LIMIT 3 OFFSET 0');
                assert.equal(3, elements.length);
                elements.forEach((e, index)=>{
                    assert.equal(1, Object.keys(e).length);
                    assert.equal(e.name, 'Name-'+index);
                });
                done();
            });
        });

        it('SELECT name FROM records WHERE name LIKE \'Name-%\' LIMIT 10 OFFSET 25', (done)=>{
            const opts = {
                keys: [Record.dbKeys.name],
                where: {},
                position: {count:10, offset:25}
            };
            opts.where[Record.dbKeys.name] = 'Name-**';

            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
//              console.log('res:', elements);
                assert.equal(query.q, 'SELECT name FROM records WHERE name LIKE \'Name-%\' LIMIT 10 OFFSET 25');
                assert.equal(5, elements.length);
                elements.forEach((e, index)=>{
                    assert.equal(1, Object.keys(e).length);
                    assert.equal(e.name, 'Name-'+(index+25));
                });
                done();
            });
        });

        it('SELECT * FROM records ORDER BY stts ASC LIMIT 100 OFFSET 0', (done)=>{
            const opts = {
                position: {count:100, offset:0},
                order: {by:'stts', direction:'ASC'}
            };

            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
//              console.log('res:', elements);
                assert.equal(query.q, 'SELECT * FROM records ORDER BY stts ASC LIMIT 100 OFFSET 0');
                assert.equal(30, elements.length);
                elements.forEach((e, index)=>{
                    assert.equal(e.name, 'Name-'+index);
                });
                done();
            });
        });

        it('SELECT * FROM records ORDER BY stts DESC LIMIT 100 OFFSET 0', (done)=>{
            const opts = {
                position: {count:100, offset:0},
                order: {by:'stts', direction:'DESC'}
            };

            query.run(dbc, 'records', Record, inserter, opts, (err, elements)=>{
                assert(!err, err);
                assert(elements);
//              console.log('res:', elements);
                assert.equal(query.q, 'SELECT * FROM records ORDER BY stts DESC LIMIT 100 OFFSET 0');
                assert.equal(30, elements.length);
                elements.forEach((e, index)=>{
                    assert.equal(e.name, 'Name-'+(29-index));
                });
                done();
            });
        });
    });
});

}


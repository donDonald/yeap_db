'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('./' + module); }

const api = {};
module.exports = api;


// This one is meant to requre sql files like this:
// require('./users.sql');
require.extensions['.sql'] = (module, filename)=>{
    module.exports = require('fs').readFileSync(filename, 'utf8');
};

//Issue {
//    when quering like 'SELECT COUNT(A) FROM ..' pg returns coubt as string and O have to perform manual conversion
//}
//Soluton {
//    https://stackoverflow.com/questions/66389300/postgres-cast-count-as-integer

//    As of now - you already know that count returns type bigint in Postgresql.
//    Regarding your Sequelize question. Sequelize uses Node Postgres under the hood. Node Postgres comes with support for types.
//    When your are explicitly querying for person.age - Node Postgres has a supported type parser for that type of field.
//    For count(*) - Node Postgres will return a string. In order to cast it to (big)int - so that Javascript recognizes it - you will have to create your own Type Parser

//        Let's say that you know you don't and wont ever have numbers greater than int4 in your database, but you're tired of recieving results from the COUNT(*) function as strings (because that function returns int8). You would do this:
//        var types = require('pg').types
//        types.setTypeParser(20, function(val) {
//          return parseInt(val, 10)
//        })

//    Or cast it like this:
//        SELECT count(*)::int

//    If you are going down the custom type parser road - since Javascript now supports Bigint and you are confident that your Node version supports it - you may aswell try:
//        types.setTypeParser(20, BigInt);
//}
const types = require('pg').types
types.setTypeParser(20, (val)=>{
    return parseInt(val, 10)
});

api.Db = re('Db');
api.mysql = {};
api.mysql.helpers = re('mysql/helpers');
//api.mysql.Connection = re('mysql/Connection');
api.mysql.Driver = re('mysql/Driver');
api.mysql.Pool = re('mysql/Pool');

api.postgres = {};
api.postgres.helpers = re('postgres/helpers');
//api.postgres.Connection = re('postgres/Connection');
api.postgres.Driver = re('postgres/Driver');
api.postgres.Pool = re('postgres/Pool');

api.model = re('model/index');


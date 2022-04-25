'use strict';

(function() {

const assert = require('assert');
const mysql = require('mysql2');
const mysqlUtilities = require('mysql-utilities');

mysql.upgrade = mysqlUtilities.upgrade;
mysql.introspection = mysqlUtilities.introspection;

module.exports = function(api) {
    assert(api);

    const Connection = function(dbc, dbName) {
        assert(dbc);
        this.dbc  = dbc;
        this.name = dbName;
    }

    Connection.prototype.close = function(cb) {
        const self = this;
        if (self.dbc) {
            self.dbc.end(function(err){
                self.dbc.destroy();
                self.dbc = undefined;
                cb(err);
            });
        } else {
            setImmediate(cb);
        }
    }

    Connection.prototype.query = function(query, params, cb) {
        assert(this.dbc);
//      api.lib.log.debug('lib.db.Connection.query, query:' + query);
        this.dbc.query(query, params, (err, result)=>{
            cb(err, result);
        });
    }

    const factory = {};
    factory.create = function(cridentials, dbName, cb) {
//      api.lib.log.debug('lib.db.Connection.create()');
        assert(cridentials);
        assert(cridentials.host);
        assert(cridentials.user);
        assert.equal('string', typeof cridentials.password);
        assert(cb);
//      api.lib.log.debug('lib.db.Connection.create, host:' + cridentials.host + ', user:' + cridentials.user + ', password:' + cridentials.password + ', dbName:' + dbName);

        const cridentialsEx = {host:cridentials.host, user:cridentials.user, password:cridentials.password};
        if (dbName) {
            cridentialsEx.database = dbName;
        }

        const dbc = mysql.createConnection(cridentialsEx);
        const connection = new Connection(dbc, dbName);
        mysql.upgrade(dbc);
        if (mysql.introspection) {
            mysql.introspection(dbc);
        }
        connection.dbc.connect(function (err) {
            if (err) {
                connection.close(()=>{ cb(err) });
            } else {
                cb(undefined, connection);
            }
        });
    }

    return factory;
}

})();


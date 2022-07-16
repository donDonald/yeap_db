'use strict';

if (typeof Function.prototype.override !== 'function') {
    Function.prototype.override = function (fn) {
        const superFunction = this;
        return function (...args) {
            this.inherited = superFunction;
            return fn.apply(this, args);
        };
    };
}

const upgrade = (connection)=> {
    if (!connection._mixedUpgrade) {
        connection._mixedUpgrade = true;

//      if(connection.connectionParameters) {
//          connection.kz_slow_time = connection.connectionParameters.slow_time;
//      }

        // Specify pool size only for PgPool
        // Only PgPool has this options field, Connection has nothing like this
        if(connection.options) {
            connection.kz_pool_size = connection.options.max;
//          connection.kz_slow_time = connection.options.slow_time;
        }

        connection.query = connection.query.override(function (
            sql,
            values,
            callback
        ) {
            const startTime = new Date().getTime();
            if (typeof values === 'function') {
                callback = values;
                values = [];
            }
            const query = this.inherited(sql, values, (err, res, fields) => {
                const endTime = new Date().getTime();
                const executionTime = endTime - startTime;
                connection.emit('query', err, res, fields, query);
                if (connection.kz_slow_time && executionTime >= connection.kz_slow_time) {
                    connection.emit('slow', err, res, fields, query, executionTime);
                }
                if (callback) callback(err, res, fields);
            });
            return query;
        });
    }
}

const utilities = {};
utilities.upgrade = upgrade;

module.exports = utilities;


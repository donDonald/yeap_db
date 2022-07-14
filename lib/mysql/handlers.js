'use strict';

const mixin = (dbc)=>{

    // -----------------------------------------------------------------------

    if(typeof dbc.slowsRequestsCount == 'undefined') {
        dbc.slowsRequestsCount = 0;
    }

    dbc._dbc.on('slow', (err, res, fields, query, executionTime)=>{
        ++dbc.slowsRequestsCount;
        //console.log('DB is slow, ' + executionTime + 'ms\t' + query);
        if(dbc._handleSlowEventHandler) {
            dbc._handleSlowEventHandler(err, res, fields, query, executionTime);
        }
    });

    dbc.setSlowHandler = (handler)=>{
        if(handler) {
            dbc._handleSlowEventHandler = handler;
        } else {
            dbc._handleSlowEventHandler = undefined;
        }
    }

    // -----------------------------------------------------------------------

    if(typeof dbc.errRequestsCount == 'undefined') {
        dbc.errRequestsCount = 0;
    }

    dbc._dbc.on('error', (err, res, fields, query)=>{
        ++dbc.errRequestsCount;
        //console.log('DB query error, ' + err + '\t query:' + query);
        if(dbc._handleErrorEventHandler) {
            dbc._handleErrorEventHandler(err, res, fields, query);
        }
    });

    dbc.setErrorHandler = (handler)=>{
        if(handler) {
            dbc._handleErrorEventHandler = handler;
        } else {
            dbc._handleErrorEventHandler = undefined;
        }
    }

//  dbc.setSlowHandler = (handler) =>{
//      if(handler) {
//          if(typeof dbc.slowsRequestsCount == 'undefined') {
//              dbc.slowsRequestsCount = 0;
//          }
//          dbc._handleSlowEvent = (err, res, fields, query, executionTime)=>{
//              ++dbc.slowsRequestsCount;
//              console.log('DB is slow, ' + executionTime + 'ms\t' + query.sql);
//              handler(err, res, fields, query, executionTime);
//          }
//          dbc.on('slow', dbc._handleSlowEvent);
//      } else {
//          removeListener('slow', dbc._handleSlowEvent);
//      }
//  }

//  dbc.setErrorHandler = (handler) =>{
//      if(handler) {
//          if(typeof dbc.errRequestsCount == 'undefined') {
//              dbc.errRequestsCount = 0;
//          }
//          dbc._handleErrorEvent = (err, res, fields, query)=>{
//              ++dbc.errRequestsCount;
//              console.log('DB query error, ' + error+ '\t' + query.sql);
//              handler(err, res, fields, query);
//          }
//          dbc.on('error', dbc._handleErrorEvent);
//      } else {
//          removeListener('error', dbc._handleErrorEvent);
//      }
//  }

//  this._dbc.on('query', function(err, res, fields, query) {
//      //if (err) application.log.error('MySQL Error[' + err.errno + ']: ' + err.code + '\t' + query.sql);
//      //application.log.debug(query.sql);
//      console.log('pool on query: query:' + query.sql);
//  });

//  this._dbc.on('slow', (err, res, fields, query, executionTime)=>{
//      ++this.slowsRequestsCount;
//      console.log('pool on slow: DB is slow, ' + executionTime + 'ms\t' + query.sql);
//  });

}

const handlers = {};
handlers.mixin = mixin;

module.exports = handlers;

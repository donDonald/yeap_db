'use strict';

const mixin = (dbc)=>{

    // -----------------------------------------------------------------------

    if(typeof dbc.slowsRequestsCount == 'undefined') {
        dbc.slowsRequestsCount = 0;
    }

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

    dbc.setErrorHandler = (handler)=>{
        if(handler) {
            dbc._handleErrorEventHandler = handler;
        } else {
            dbc._handleErrorEventHandler = undefined;
        }
    }

}

const handlers = {};
handlers.mixin = mixin;

module.exports = handlers;

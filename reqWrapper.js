(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.request = factory(root);
    }
})(this, function (root) {

    'use strict';

    var exports = {},
        utils = {},
        xhr;

    var contentType = {
        FORM_ENCODED : 0,
        JSON : 1,
        MULTI_PART : 2
    };

    utils.parse = function(req){
        var result;
        try {
            result = JSON.parse(req.responseText);
        } catch (e) {
            result = req.responseText;
        }
        return [result, req];
    };

    utils.toQuery = function(q){
        var key,
            params = [];
        for(key in q){
            params.push(key+'='+q[key]);
        }
        return params.join('&');
    };

    utils.verifyQuery = function(url,query){
        var result = {},
            parameter = null;
        for(parameter in query){
            if(!(new RegExp('[?|&]'+parameter+'=')).test(url)){
                result[parameter] = query[parameter];
            }
        }
        return result;
    };

    xhr = function(method, url, data, query){
        var methods = {
                success: function(){},
                error: function(){},
                always: function(){}
            },
            request = null,
            reqContentType = null,
            callbacks = {},
            protocol = (window.location.protocol === 'file:') ? 'https:' : window.location.protocol;

        if(method === 'GET'){
            query = utils.verifyQuery(url,query);
        }

        if(window.XDomainRequest){
            request = new XDomainRequest();
            request.onprogress = function(){ };
            request.ontimeout = function(){ };
        }else if(window.ActiveXObject){
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }else if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
        }

        if(request){
            if(query) url += ((url.indexOf('?') > -1) ? '&' : '?') + utils.toQuery(query);
            request.open(method, (url.indexOf('http') > -1) ? url : protocol+url, true);
            request.onload = function(){
                if((request.statusText === 'OK' && request.status === 200) || typeof request.statusText === 'undefined'){
                    methods.success.apply(methods, utils.parse(request));
                    methods.always.apply();
                } else {
                    methods.error.apply(methods, utils.parse(request));
                    methods.always.apply();
                }
            };
            request.onerror = function(){
                methods.error.apply(methods, utils.parse(request));
                methods.always.apply();
            };
        }

        callbacks = {
            success: function(callback){
                methods.success = callback;
                return callbacks;
            },
            error: function(callback){
                methods.error = callback;
                return callbacks;
            },
            always: function(callback){
                methods.always = callback;
                return callbacks;
            },
            isFormType: function()
            {
                reqContentType = contentType.FORM_ENCODED;
                request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                data = utils.toQuery(data);
                return callbacks;
            },
            isJsonType: function()
            {
                reqContentType = contentType.JSON;
                request.setRequestHeader('Content-type', 'application/json');
                data = JSON.stringify(data);
                return callbacks;
            },
            isMultipartType: function()
            {
                reqContentType = contentType.MULTI_PART;
                var formData = new FormData();
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                       formData.append(key, data[key]);
                    }
                }
                data = formData;
                return callbacks;
            },
            setHeaders: function (headers) {
                for (var key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        request.setRequestHeader(key, headers[key]);
                    }
                }
                return callbacks;
            },
            execute: function()
            {
                if(method === 'POST' && reqContentType==null){
                    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    data = utils.toQuery(data);
                }
                if(method === 'GET'){
                    data = null;
                }

                setTimeout(function(){
                    request.send(data);
                },0);
            }
        };

        return callbacks;
    };

    exports['get'] = function (url, query) {
        return xhr('GET', url, {}, query);
    };

    exports['post'] = function (url, data, query) {
        return xhr('POST', url, data, query);
    };

    return exports;
});
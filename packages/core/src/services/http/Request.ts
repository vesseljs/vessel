import { each, toInitialUpperCase, RegExp } from '@vessel/core';


export class Request {

    private url = '';

    private method = '';

    private headers = {};

    private body = null;

    private parameters = '';

    get fullUrl() {
        return this.url + this.parameters;
    }

    public constructor(opts=null) {
        if (opts) {
            this.setDefaults(opts);
        }
    }

    public setUrl(url) {
        this.url = url;

        return this;
    }

    public getUrl() {
        return this.url;
    }

    public setBody(body) {
        this.body = body;

        return this;
    }

    public getBody() {
        return this.body;
    }

    public setHeaders(headers) {
        this.headers = headers;

        return this;
    }

    public getHeaders() {
        return this.headers;
    }

    public setParameters(parameters) {
        let result = '?';
        each(parameters, function(param, value) {
            result += param + '=' + value + '&';
        }, this);
        this.parameters = result.replace(RegExp.LAST_AMPERSAND, '');

        return this;
    }

    public getParameters() {
        return this.parameters;
    }

    public setMethod(method) {
        this.method = method;

        return this
    }

    public getMethod() {
        return this.method;
    }

    private setDefaults(opts) {
        let setter;
        each(opts, function(opt, value) {
            if (!this.hasOwnProperty(opt)) {
                throw new TypeError("Request: parameter error, option " + opt + " does " +
                    "not exist.");
            }
            setter = this["set" + toInitialUpperCase(opt)];
            setter.call(this, value);

        }, this);

        return this;
    }

}
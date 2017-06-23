import { Bridge } from '../Bridge';
import { merge, isModel, isCollection, BaseTypes, Types, isEmpty , isArray } from '@vessel/core';
import { Request } from './Request';

export abstract class HttpBridge extends Bridge {

    protected abstract endPoint: string;

    protected _type = BaseTypes.HTTP_BRIDGE;

    protected abstract getResponse(response);

    public abstract create(response, model);

    public abstract read(response, obj);

    public abstract update(response, model);

    public abstract destroy(response);

    public createRequest(obj, requestCustomOptions=null) {
        let requestOptions = this.buildJSONRequest(obj, requestCustomOptions);
        // If it's POST (create) we don't
        // want the {id} to be added to
        // the url.
        //
        // E.g.:    /todos/{id} -> /todos
        if ( !requestOptions.hasOwnProperty('url') ) {
            requestOptions.url = this.getPartialUrl();
        }
        return this.bridgeRequest(obj, this.postRequest, this.create, requestOptions);
    }

    public readRequest(obj, requestCustomOptions=null) {
        return this.bridgeRequest(obj, this.getRequest, this.read, requestCustomOptions);
    }

    public updateRequest(obj, requestCustomOptions=null) {
        let requestOptions = this.buildJSONRequest(obj, requestCustomOptions);
        return this.bridgeRequest(obj, this.putRequest, this.update, requestOptions);
    }

    public destroyRequest(obj, requestCustomOptions=null) {
        let requestOptions = this.buildJSONRequest(obj, requestCustomOptions);
        return this.bridgeRequest(obj, this.removeRequest, this.destroy, requestOptions);
    }


    protected getPartialUrl() {
        return this.getRemoteUrl() + this.endPoint;
    }

    // isModel Alias
    protected isModel(obj) {
        return isModel(obj);
    }

    // isCollection Alias
    protected isCollection(obj) {
        return isCollection(obj);
    }

    private buildJSONRequest(obj, requestCustomOptions) {
        let requestOptions = {
            body: obj.getAttrs(),
            headers: {
                'Content-type': 'application/json'
            }
        };
        return merge(requestOptions, requestCustomOptions);
    }

    private extractIdentifier(obj) {
        let id = obj.getIdentifier();

        if ( !this.isValidIdentifier(id) ) {
            throw new TypeError("Bridge: Invalid identifier '" +
                id + "' (" + typeof id + ").");
        }

        return id;
    }

    private isValidIdentifier(exp) {
        return typeof exp === Types.STRING && exp !== "" ||
            typeof exp ===  Types.NUMBER;
    }


    private modifyRequest(requestOpts, obj) {
        let $requestOpts: any = {};

        if ( isModel(obj) ) {
            $requestOpts.url = this.getPartialUrl() + '/' + this.extractIdentifier(obj);
        } else if ( isCollection(obj) ) {
            $requestOpts.url = this.getPartialUrl();
            $requestOpts.injectResults = true;
        }

        if ( isEmpty($requestOpts)) {
            return requestOpts;
        }

        return merge($requestOpts, requestOpts);
    }

    private bridgeRequest(obj, requestCb, processCb, requestOptions) {
        let self = this,
            request,
            requestDefaults,
            processedData,
            requestPromise,
            data;

        request = new Request();
        requestDefaults = this.modifyRequest(requestOptions, obj);
        request.setDefaults(requestDefaults);

        return new Promise((resolve, reject) => {

            requestPromise = requestCb.call(self, request);

            requestPromise.then(
                function onSuccess(response) {
                    data = self.getResponse(response);
                    processedData = processCb.call(self, data, obj);
                    if (requestDefaults.injectResults
                        && processCb === self.read
                        && isArray(processedData)) {
                        obj.setCollection(processedData);
                    }
                    resolve(processedData);
                },

                function onError(response) {
                    reject(response);
                }
            );
        });
    }

}
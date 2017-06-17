import { Bridge } from '../Bridge';
import { BaseTypes, Types } from '@vessel/core';
import {Request} from "./Request";

export abstract class HttpBridge extends Bridge {

    protected abstract endPoint: string;

    protected _type = BaseTypes.HTTP_BRIDGE;


    protected abstract getResponse(response);

    public abstract create(response, model);

    public abstract read(response, obj);

    public abstract update(response, model);

    public abstract destroy(response);


    public createRequest(obj, requestOptions=null) {
        return this.bridgeRequest(obj, this.postRequest, this.create, requestOptions);
    }

    public readRequest(obj, requestOptions=null) {
        return this.bridgeRequest(obj, this.getRequest, this.read, requestOptions);
    }

    public updateRequest(obj, requestOptions=null) {
        return this.bridgeRequest(obj, this.putRequest, this.update, requestOptions);
    }

    public destroyRequest(obj, requestOptions=null) {
        return this.bridgeRequest(obj, this.removeRequest, this.destroy, requestOptions);
    }


    protected getPartialUrl() {
        return this.getBaseUrl() + this.endPoint;
    }

    protected getObjUrl(obj) {
        if ( obj.getType() === BaseTypes.MODEL ) {
            return this.getPartialUrl() + '/' + this.extractIdentifier(obj);
        } else if ( obj.getType() === BaseTypes.COLLECTION ) {
            return this.getPartialUrl();
        } else {
            throw new TypeError('Bridges can only be used with Model and ' +
                'Collection classes');
        }
    }

    private extractIdentifier(obj) {
        let id = obj.getIdentifier();

        if ( !this.isValidIdentifier(id) ) {
            throw new TypeError('Bridge: Invalid identifier ' +
                id + ' (' + typeof id + ').');
        }

        return id;
    }

    private isValidIdentifier(exp) {
        return typeof exp === Types.STRING ||
               typeof exp ===  Types.NUMBER;
    }

    private bridgeRequest(obj, requestCb, processCb, requestOptions) {
        let self = this,
            url = this.getObjUrl(obj),
            request,
            processedData,
            requestPromise,
            data;

        request = new Request();
        request.setDefaults(requestOptions);

        if ( !requestOptions.hasOwnProperty('url') ) {
            request.setUrl(url);
        }

        return new Promise((resolve, reject) => {

            requestPromise = requestCb.call(self, request);

            requestPromise.then(
                function onSuccess(response) {
                    data = self.getResponse(response);
                    processedData = processCb.call(self, data, obj);
                    resolve(processedData);
                },

                function onError(response) {
                    reject(response);
                }
            );
        });
    }

}
import { Bridge } from '../Bridge';
import { BaseTypes, Types } from '@vessel/core';

export abstract class HttpBridge extends Bridge {

    protected abstract endPoint: string;

    protected _type = BaseTypes.HTTP_BRIDGE;


    protected abstract getResponse(response);

    public abstract create(response, model);

    public abstract read(response, obj);

    public abstract update(response, model);

    public abstract destroy(response);


    public createRequest(obj) {
        return this.bridgeRequest(obj, this.postRequest, this.create);
    }

    public readRequest(obj) {
        return this.bridgeRequest(obj, this.getRequest, this.read);
    }

    public updateRequest(obj) {
        return this.bridgeRequest(obj, this.putRequest, this.update);
    }

    public destroyRequest(obj) {
        return this.bridgeRequest(obj, this.removeRequest, this.destroy);
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

    protected getUrl(): void | string {
        return void 0;
    }


    private getFullUrl(obj): string {
        let customUrl = this.getUrl();
        return customUrl ? customUrl : this.getObjUrl(obj);
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

    private bridgeRequest(obj, requestCb, processCb) {
        let self = this,
            url = this.getFullUrl(obj),
            processedData,
            request,
            data;

        return new Promise((resolve, reject) => {

            request = requestCb.call(self, url);

            request.then(
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
import { Service } from './Service';
import { BaseTypes } from '@vessel/core';
import { HttpMethods } from  './http/HttpMethods';

export class RemoteService extends Service {

    protected _type = BaseTypes.REMOTE_SERVICE;

    protected getBaseUrl(): string {
        let appConfig = this.get('@metadata_manager')
            .getRawData('app_config');
        return appConfig.baseUrl;
    }

    protected getHeaders() {

    }

    protected getParameters() {

    }

    protected newAjaxRequest(url, method) {
        return new Promise( (resolve, reject) => {
            let request = new XMLHttpRequest();

            request.onload = function() {
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject(request.statusText);
                }
            };

            request.onerror = function() {
                reject("Network error.")
            };

            request.open(method, url);
            request.send();

        });
    }

    protected getRequest(url: string) {
        return this.newAjaxRequest(url, HttpMethods.GET);
    }

    protected postRequest(url: string) {

    }

    protected putRequest(url: string) {

    }

    protected removeRequest(url: string) {

    }
}
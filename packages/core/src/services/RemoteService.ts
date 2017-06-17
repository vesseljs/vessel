import { Service } from './Service';
import { each, BaseTypes } from '@vessel/core';
import { HttpMethods } from  './http/HttpMethods';
import { Request } from "./http/Request";

export class RemoteService extends Service {

    protected _type = BaseTypes.REMOTE_SERVICE;

    protected getBaseUrl(): string {
        let appConfig = this.get('@metadata_manager')
            .getRawData('app_config');
        return appConfig.baseUrl;
    }

    protected newAjaxRequest(request: Request) {
        let url = request.fullUrl,
            method = request.getMethod(),
            headers = request.getHeaders();

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

            each(headers, function(header,value){
               request.setRequestHeader(header, value);
            });

            request.send();

        });
    }

    protected getRequest(request: Request) {
        return this.newAjaxRequest( request.setMethod(HttpMethods.GET) );
    }

    protected postRequest(url: string) {

    }

    protected putRequest(url: string) {

    }

    protected removeRequest(url: string) {

    }
}
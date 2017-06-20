import { Service } from './Service';
import { isEmpty, isGet, each, BaseTypes } from '@vessel/core';
import { HttpMethods } from  './http/HttpMethods';
import { Request } from "./http/Request";

export class RemoteService extends Service {

    protected _type = BaseTypes.REMOTE_SERVICE;

    protected getRemoteUrl(): string {
        return this.get('@metadata_manager')
                   .getConfig('remoteUrl');
    }

    protected newAjaxRequest(request: Request) {
        let url = request.fullUrl,
            method = request.getMethod(),
            headers = request.getHeaders(),
            params = request.getParameters(),
            body = request.getBody();

        return new Promise( (resolve, reject) => {
            let xhttp = new XMLHttpRequest();

            xhttp.onload = function() {
                if (xhttp.status === 200) {
                    resolve(xhttp.response);
                } else {
                    reject(xhttp.statusText);
                }
            };

            xhttp.onerror = function() {
                reject("Network error.")
            };

            xhttp.open(method, url);

            each(headers, function(header, value){
               xhttp.setRequestHeader(header, value);
            });

            if ( isGet(method) ) {
                xhttp.send();
            } else {
                let payload = isEmpty(body) ? params : JSON.stringify(body);

                if (!payload) {
                    throw new TypeError("newAjaxRequest: Attempt to send a post request " +
                        "with no parameters nor body within the request");
                }

                xhttp.send(payload);
            }
        });
    }


    protected getRequest(request: Request) {
        return this.newAjaxRequest( this.setMethod(request, HttpMethods.GET) );
    }

    protected postRequest(request: Request) {
        return this.newAjaxRequest( this.setMethod(request, HttpMethods.POST) );
    }

    protected putRequest(request: Request) {
        return this.newAjaxRequest( this.setMethod(request, HttpMethods.PUT) );
    }

    protected removeRequest(request: Request) {
        return this.newAjaxRequest( this.setMethod(request, HttpMethods.DELETE) );
    }

    private setMethod(request: Request, method: string) {
        if ( !request.getMethod() ) {
            request.setMethod(method);
        }
        return request;
    }
}
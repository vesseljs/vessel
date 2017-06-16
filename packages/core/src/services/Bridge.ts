import { RemoteService } from './RemoteService';
import { BaseTypes, Types } from '@vessel/core';


export abstract class Bridge extends RemoteService {

    protected abstract endPoint: string;

    protected abstract getResponse(response);

    protected _type = BaseTypes.BRIDGE;

    protected getBridgeRequest(obj) {
        let url;

        if ( obj.getType() === BaseTypes.MODEL ) {
            url = this.endPoint + '/' +  this.extractIdentifier(obj);

        } else if ( obj.getType() === BaseTypes.COLLECTION) {
            url = this.endPoint;

        } else {
            throw new TypeError('Bridges can only be used with Model and ' +
                'Collection classes');

        }

        return this.getRequest(url);
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
        return exp === Types.STRING || exp ===  Types.NUMBER;
    }

}
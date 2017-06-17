import { RemoteService } from './RemoteService';
import { BaseTypes, Types } from '@vessel/core';


export abstract class Bridge extends RemoteService {

    protected _type = BaseTypes.BRIDGE;

}
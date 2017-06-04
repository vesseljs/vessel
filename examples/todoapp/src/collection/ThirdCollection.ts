import { Collection as BaseCollection } from '@vessel/core';
import { get, collection } from '@vessel/decorators';


export class ThirdCollection extends BaseCollection {

    @get('collection.fourth')
    public fourthCollection;
}
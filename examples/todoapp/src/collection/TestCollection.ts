import { Collection as BaseCollection } from '@vessel/core';
import { get } from '@vessel/decorators';

export class TestCollection extends BaseCollection {

    @get('collection.third')
    public thirdCollection;

}
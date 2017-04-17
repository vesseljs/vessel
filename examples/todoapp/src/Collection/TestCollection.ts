import { Collection as BaseCollection } from '@vessel/core';
import { collection } from '@vessel/decorators';

export class TestCollection extends BaseCollection {

    @collection
    public data = [];

    getModel() {

    }
}
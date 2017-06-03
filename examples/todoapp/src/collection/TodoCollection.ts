import { Collection as BaseCollection } from '@vessel/core';
import { collection } from '@vessel/decorators';

import { get } from '@vessel/injector';

export class TodoCollection extends BaseCollection {

    @collection
    public todos = [];

    @get('model.todo')
    public model;

}
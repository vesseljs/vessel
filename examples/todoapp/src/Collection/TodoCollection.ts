import { Collection as BaseCollection } from '@vessel/core';
import { collection } from '@vessel/common/decorators';

import { TodoModel } from '../Model/TodoModel';

export class TodoCollection extends BaseCollection {

    @collection
    public todos = [];


    constructor() {
        super();
    }

    public getModel() {
        return TodoModel;
    }
}
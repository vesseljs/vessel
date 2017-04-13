import { Collection as BaseCollection } from '@vessel/core';
import { collection } from '@vessel/common/decorators';

import { TodoModel } from '../Model/TodoModel';
import {ModelInterface} from "../../../../packages/core/src/base/interfaces";

//inject()
export class TodoCollection extends BaseCollection {

    @collection
    public todos;


    constructor() {
        super();
    }

    public getModel(): ModelInterface {
        return TodoModel;
    }
}
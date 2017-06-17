import { Collection as BaseCollection } from '@vessel/core';
import { get, collection } from '@vessel/decorators';

import { TodoModel } from '../model/TodoModel';


export class TodoCollection extends BaseCollection {

    protected bridge = 'service.todo';

    @collection
    public todos = [];

    public model = TodoModel;

    @get('collection.test')
    public testCollection;

    @get('collection.fifth')
    public fifthCollection;


}
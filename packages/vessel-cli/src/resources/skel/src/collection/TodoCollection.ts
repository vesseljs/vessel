import { Collection as BaseCollection } from '@vessel/core';
import { TodoModel } from '../model/TodoModel';


export class TodoCollection extends BaseCollection {

    protected bridge = 'service.todo';

    protected model = TodoModel;


}
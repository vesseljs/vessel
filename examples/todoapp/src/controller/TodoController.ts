import { Controller as BaseController } from '@vessel/core';

import { route } from '@vessel/router';
import { get } from '@vessel/decorators';

export class TodoController extends BaseController {

    @get('collection.todos')
    public collection;

    @route('todo_index', '/')
    public indexTodo() {

    }

    @route('todo_edit', '/edit/{id}')
    public editTodo() {

    }

    @route('todo_create')
    public createTodo() {

    }

}
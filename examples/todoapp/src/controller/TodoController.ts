import { Controller as BaseController } from '@vessel/core';

import { route } from '@vessel/router';
import { get } from '@vessel/decorators';

export class TodoController extends BaseController {

    @get('collection.todo')
    public collection;

    @route('todo_index', '/')
    public indexTodo() {

    }

    @route('todo_edit', '/edit/{id}')
    public editTodo(id) {
        this.render('view.todo', { id: id });
    }

    @route('todo_create')
    public createTodo() {
    }

}
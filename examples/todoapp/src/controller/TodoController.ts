import { Controller as BaseController } from '@vessel/core';

import { route } from '@vessel/router';
import { get } from '@vessel/decorators';

import { TodoModel } from '../model/TodoModel';

export class TodoController extends BaseController {

    @get('collection.todo')
    public collection;

    @route('todo_index', '/')
    public indexTodo() {
        this.unrender('view.todo');
    }

    @route('todo_edit', '/edit/:id')
    public async editTodo(id) {

        this.render('view.todo', { id: id });
    }

    @route('todo_create')
    public createTodo() {
    }

}
import { Controller as BaseController } from '@vessel/core';

import { route } from '@vessel/router';
import { get } from '@vessel/decorators';

import { TodoModel } from '../model/TodoModel';

export class TodoController extends BaseController {

    @get('collection.todo')
    public collection;

    @route('todo_index', '/')
    public indexTodo() {

    }

    @route('todo_edit', '/edit/{id}')
    public async editTodo(id) {
        let todo = new TodoModel();
        /*todo.setId(id)
            .setAuthor('Peter')
            .setBody('This is a todo body!')*/

        let response = await this.collection.fetch();

        this.render('view.todo', { id: response.description });
    }

    @route('todo_create')
    public createTodo() {
    }

}
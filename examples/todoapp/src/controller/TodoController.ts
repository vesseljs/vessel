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
        let responseTodo,
            todo = new TodoModel();
        todo.setAuthor('Peter')
            .setBody('This is a todo body!');

        responseTodo = await todo.save({
            headers: {
                'Authorization':'Basic YWRtaW5pc3RyYWRvcjphbGJhbW9sYW11Y2hv'
            }
        });

        // this.render('view.todo', { id: response.coord.lat });
    }

    @route('todo_create')
    public createTodo() {
    }

}
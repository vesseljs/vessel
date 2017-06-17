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

        let response = await this.collection.fetch({
            parameters: {
                'q' : 'London',
                'appid' : 'b1b15e88fa797225412429c1c50c122a1'
            },
            headers: {
                'Allow-Control-Allow-Origin': '*'
            }
        });

        this.render('view.todo', { id: response.coord.lat });
    }

    @route('todo_create')
    public createTodo() {
    }

}
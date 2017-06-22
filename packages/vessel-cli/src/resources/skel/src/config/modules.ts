import { TodoController } from '../controller/TodoController';
import { TodoModel } from '../model/TodoModel';
import { TodoCollection } from '../collection/TodoCollection';
import { TodoView } from '../view/TodoView';
import { TodoService } from '../service/TodoService';

export const modules = {

    models: {
        'model.todo': TodoModel,
    },

    controllers: {
        'controller.todo': TodoController
    },

    collections: {
        'collection.todo': TodoCollection,
    },

    views: {
        'view.todo': TodoView
    },

    services: {
        'service.todo': TodoService
    }

};
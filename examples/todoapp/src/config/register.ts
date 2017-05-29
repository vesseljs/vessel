import { TodoModel } from '../model/TodoModel';
import { TodoCollection } from '../collection/TodoCollection';

export const registrations = {

    models: {
        'model.todo': TodoModel,
    },

    collections: {
        'collection.todos': TodoCollection
    },

    views: {

    }

};
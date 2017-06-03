import { TodoModel } from '../model/TodoModel';
import { TodoCollection } from '../collection/TodoCollection';
import {ThirdCollection} from "../collection/ThirdCollection";
import {TestCollection} from "../collection/TestCollection";
import {FourthCollection} from "../collection/FourthCollection";

export const modules = {

    models: {
        'model.todo': TodoModel,
    },

    collections: {
        'collection.todos': TodoCollection,
        'collection.test': TestCollection,
        'collection.third': ThirdCollection,
        'collection.fourth': FourthCollection
    },

    views: {

    }

};
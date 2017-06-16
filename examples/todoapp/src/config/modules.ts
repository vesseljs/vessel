import { TodoModel } from '../model/TodoModel';
import { TodoCollection } from '../collection/TodoCollection';
import {ThirdCollection} from "../collection/ThirdCollection";
import {TestCollection} from "../collection/TestCollection";
import {FourthCollection} from "../collection/FourthCollection";
import {TodoController} from "../controller/TodoController";
import {FifthCollection} from "../collection/FifthCollection";
import {TodoView} from "../view/TodoView";

export const modules = {

    models: {
        'model.todo': TodoModel,
    },

    controllers: {
        'controller.todo': TodoController
    },

    collections: {
        'collection.todo': TodoCollection,
        'collection.test': TestCollection,
        'collection.third': ThirdCollection,
        'collection.fourth': FourthCollection,
        'collection.fifth': FifthCollection
    },


    views: {
        'view.todo': TodoView
    }

};
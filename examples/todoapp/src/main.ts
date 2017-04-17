import { Collection, View, App } from '@vessel/core';

import { TodoModel } from './Model/TodoModel';
import { TodoCollection } from './Collection/TodoCollection';

import {TestCollection} from "./Collection/TestCollection";
import {TestModel} from "./Model/TestModel";

declare var $App;

$App = new App().browserBoot();

/*
$App.register({
    models: {
        'model.todo': TodoModel,
    },
    collections: {
        'collection.todos': TodoCollection
    },
    views: {
    }
});
*/



//app.x = new TodoModel('pe', 'body 1');
//app.y = new TodoModel('alex', 'body 2');

$App["collection"] = new TodoCollection();
$App["collection"].add('pedro!', 'body 1');

$App["collection2"] = new TestCollection();

$App["model"] = new TodoModel('pedro', 'jejejej');
$App["model2"] = new TestModel('nombree');

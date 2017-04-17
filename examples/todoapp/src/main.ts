import { Collection, View, App } from '@vessel/core';

import { TodoModel } from './Model/TodoModel';
import { TodoCollection } from './Collection/TodoCollection';

declare var $App;

$App = new App().browserBoot();


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



//app.x = new TodoModel('pe', 'body 1');
//app.y = new TodoModel('alex', 'body 2');

$App["collection"] = new TodoCollection();
$App["collection"].add('pedro!', 'body 1');
$App["collection"].add('javi!', 'body 2');
$App["collection"].add('fran!', 'body 3');
$App["collection"].add('jose!', 'body 4');
$App["collection"].add('javier!', 'body 4');

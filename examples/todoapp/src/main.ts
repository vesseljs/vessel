import { App } from '@vessel/boot';
import { TodoModel } from './Model/TodoModel';
import { TodoCollection } from './Collections/TodoCollection';

const app: any = new App().browserBoot();
app.x = new TodoModel('pe', 'body 1');
app.y = new TodoModel('alex', 'body 2');

app.collection = new TodoCollection();
app.collection.add('pedro!', 'body 1');
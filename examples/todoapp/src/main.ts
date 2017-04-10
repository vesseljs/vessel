import { App } from '@vessel/boot';
import { TodoModel } from './Model/TodoModel';

const app: any = new App().browserBoot();
app.x = new TodoModel('pedro', 'body 1');
app.y = new TodoModel('alex', 'body 2');
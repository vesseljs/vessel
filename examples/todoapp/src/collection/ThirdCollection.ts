import { Collection as BaseCollection } from '@vessel/core';
import { collection } from '@vessel/decorators';

import { get } from '@vessel/injector';

import { TodoModel } from '../model/TodoModel';


export class ThirdCollection extends BaseCollection {

    @get('collection.fourth')
    public fourthCollection;
}
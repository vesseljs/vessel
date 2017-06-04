
import { attr, validate } from '@vessel/decorators';
import {TodoModel} from "./TodoModel";

export class TestModel extends TodoModel {

    @attr
    public name;

}
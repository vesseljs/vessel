import { BaseApp } from '../app/App';
import { Container }  from '@vessel/core';

export abstract class AbstractPackageBoot {
    protected abstract VERSION: string;
    abstract setup(namespace: BaseApp, container: Container);
    abstract register(container: Container);
}
import { Vessel, BaseTypes } from '@vessel/core';

export class Controller extends Vessel {

    protected _type = BaseTypes.CONTROLLER;

    protected render(viewName, renderData) {
      return this.get('@vdom').render(viewName, renderData);
    }

    protected renderRoute(routeName, ...args) {
        return this.get('@router').renderRoute(routeName, ...args);
    }


}
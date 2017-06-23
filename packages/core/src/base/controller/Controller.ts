import { Vessel, BaseTypes } from '@vessel/core';

export class Controller extends Vessel {

    protected _type = BaseTypes.CONTROLLER;

    protected render(viewName, renderData=undefined) {
        let self = this;
        if (document.readyState === "complete") {
            self.get('@vdom').render(viewName, renderData);
        } else {
            window.onload = function() {
                self.get('@vdom').render(viewName, renderData);
            }
        }
    }

    protected unrender(viewName) {
        return this.get('@vdom').unrender(viewName);
    }

    protected route(routeName, routeParams) {
        return this.get('@router').route(routeName, routeParams);
    }

    protected routeExec(routeName, ...args) {
        return this.get('@router').route(routeName, args);
    }


}
import {Vessel, removeLastSlash, each, isEmpty } from '@vessel/core';
import { Strategy } from './Strategy';
import { Fragment} from './Fragment';
import { Route } from './Route';

export class Router {

    private strategy: Strategy = new Strategy(Strategy.HistoryStrategy);

    public boot() {
        this.listen();
    }

    public setStrategy(strategy: Strategy) {
        this.strategy = strategy;

        return this;
    }

    public getStrategy(): Strategy {
        return this.strategy;
    }

    public routeExec(routeName, args) {
        let route = this.getRouteByName(routeName);
        Router.onRouteFound(route, args);
    }

    private route(routeName, routeParamsObj=null) {
        let generatedPath,
            route = this.getRouteByName(routeName);

        if ( isEmpty(route) ) {
            throw new TypeError('Router: route '+ routeName +
            ' does not exist.');
        }

        each(routeParamsObj, function(param, value) {
            route.setParameter(param, value);
        });

        generatedPath = route.getResult();

        this.push(generatedPath);
        return new Fragment(generatedPath).resolve();
    }


    private push(path: string) {
        let url = path ? this.getBaseUrl() + path : this.getBaseUrl();
        window.history.pushState({}, '', url);
    }

    private listen() {
        if (this.getStrategy().isHistory() && Vessel.can.pushState) {
            window.addEventListener('popstate', Router.onRouteChange);
        } else if (this.getStrategy().isHash() && Vessel.can.onhashchange) {
            window.addEventListener('hashchange', Router.onRouteChange);

        // fallback
        } else {

        }
    }

    public getRouteByName(name) {
        return this.getAllRoutes()[name];
    }

    public getAllRoutes() {
        return Vessel.$container
            .get('@metadata_manager')
            .getRawData('cached_routes');
    }

    public getBaseUrl() {
        return removeLastSlash(Vessel.$container
            .get('@metadata_manager')
            .getConfig('baseUrl'));
    }

    public static onRouteChange() {
        return new Fragment().resolve();
    }

    public static onRouteFound(route: Route, fragmentArgs) {
        let controller = Vessel.$container.loadModule(route.getContext().constructor);
        return route.getBound().apply(controller, fragmentArgs);
    }


}
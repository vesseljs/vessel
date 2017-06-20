import {Vessel, removeLastSlash, each } from '@vessel/core';
import { Strategy } from './Strategy';
import { Fragment} from './Fragment';
import { Route } from './Route';

export class Router {

    private strategy: Strategy = new Strategy(Strategy.HistoryStrategy);

    public static generatedFragment;


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


    public renderRoute(routeName, routeParamsObj, ...renderArgs) {
        return this.go(routeName, routeParamsObj, ...renderArgs);
    }

    private go(routeName, routeParamsObj, ...renderArgs) {
        let generatedPath,
            route = this.getRouteByName(routeName);

        each(routeParamsObj, function(param, value) {
            route.setParameter(param, value);
        });

        generatedPath = route.getResult();

        let fragment = this.generateFragment(generatedPath);
        this.push(generatedPath);
        fragment.resolve();
    }

    private generateFragment(generatedPath) {
        return Router.generatedFragment = new Fragment(generatedPath);
    }

    private push(path: string) {
        window.history.pushState({}, '', Router.getBaseUrl() + path);
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
        return Router.getAllRoutes()[name];
    }

    public static getAllRoutes() {
        return Vessel.$container
            .get('@metadata_manager')
            .getRawData('cached_routes');
    }

    public static getBaseUrl() {
        return removeLastSlash(Vessel.$container
            .get('@metadata_manager')
            .getConfig('baseUrl'));
    }

    public static onRouteChange() {
        let fragment = Router.generatedFragment
            ? Router.generatedFragment
            : new Fragment();
        Router.generatedFragment = void 0;
        return fragment.resolve();
    }

    public static onRouteFound(route: Route, fragmentArgs) {
        let controller = Vessel.$container.loadModule(route.getContext().constructor);
        return route.getBound().apply(controller, fragmentArgs);
    }


}
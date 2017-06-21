import { Vessel, removeLastSlash, getKeys, getCurrentUrl} from '@vessel/core';
import { Router } from './Router';

export class Fragment {

    private url: string;

    private router: Router;

    public constructor(url=undefined) {
        this.router = this.container.get('@router');

        if (url) {
            this.setUrl(url);
        } else {
            this.findOutUrl();
        }
    }

    private findOutUrl() {
        return this.setUrl(
            getCurrentUrl().replace(this.router.getBaseUrl(), '')
        );
    }

    get container() {
        return Vessel.$container;
    }

    public getUrl(): string {
        return this.url;
    }

    public setUrl(url) {
        this.url = removeLastSlash(url);

        return this;
    }

    public resolve() {
        let route = this.matchRoute();

        // 404. Not Route Found
        if (!route) return false;

        Router.onRouteFound(route, this.getParams(route));
    }

    private matchRoute() {
        let routes = this.router.getAllRoutes(),
            routeNames = getKeys(routes);
        for (let i = 0, len = routeNames.length; i < len; i++) {
            let routeName = routeNames[i],
                routeObj = routes[routeName];
            if (routeObj.getRegExpPath().test(this.getUrl())) return routeObj;
        }
        return false;
    }

    private getParams(route) {
        return route.getRegExpPath().exec(this.getUrl()).slice(1);
    }

}
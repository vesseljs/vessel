import { isSupported } from '@vessel/common/utils';
import { GlobalContainer } from '@vessel/common/container';
var App = (function () {
    function App() {
    }
    App.prototype.browserBoot = function () {
        this.detectBrowserFeatures();
        this.loadContainer();
        return this;
    };
    App.prototype.register = function (opts) {
        if (!this.container) {
            throw new TypeError("You can't register modules before calling" +
                " AppInterface:browserBoot().");
        }
        this.container.register(opts);
    };
    App.prototype.detectBrowserFeatures = function () {
        this.can = {
            WeakMap: isSupported(window.WeakMap)
        };
        return this;
    };
    // TODO - WeakMap fallback
    App.prototype.loadContainer = function () {
        this.container = new GlobalContainer();
        return this;
    };
    return App;
}());
export { App };
//# sourceMappingURL=app.js.map
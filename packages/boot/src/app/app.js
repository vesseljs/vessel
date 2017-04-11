import { isSupported } from '../../../common/utils/src/utilities';
export var App = (function () {
    function App() {
    }
    App.prototype.browserBoot = function () {
        window.$Vessel = this;
        this.detectBrowserFeatures()
            .loadContainer();
        return this;
    };
    App.prototype.detectBrowserFeatures = function () {
        window.$Vessel.can = {
            WeakMap: isSupported(window.WeakMap)
        };
        return this;
    };
    // TODO - WeakMap fallback
    App.prototype.loadContainer = function () {
        this.container =
            window.$Vessel.can.WeakMap ?
                new WeakMap() :
                "Dev: WeakMap fallback - work in progress";
        return this;
    };
    return App;
}());
//# sourceMappingURL=app.js.map
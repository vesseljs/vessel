import { defineProp } from '@vessel/common/utils/src/utilities';
export var AttribProxy = (function () {
    function AttribProxy() {
        this.data = {};
    }
    AttribProxy.prototype.addAttribute = function (name) {
        this.data[name] = "";
        defineProp(this, name, function getter() {
            return this.data[name];
        }, function setter(value) {
            this.data[name] = value;
        });
    };
    return AttribProxy;
}());
//# sourceMappingURL=proxy.js.map
function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function isSupported(feature) {
    return typeof feature == 'function';
}
function defineProp(obj, prop, getter, setter) {
    var descriptor = {
        enumerable: false,
        configurable: true,
        set: setter,
        get: getter
    };
    Object.defineProperty(obj, prop, descriptor);
}

var App = (function () {
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

var AttribProxy = (function () {
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

var Model = (function () {
    function Model() {
        this.__metadata__ = [];
        this._createProxy();
    }
    Model.prototype.set = function (attribs) {
        for (var attrib in attribs) {
            this.attr[attrib] = attribs[attrib];
        }
    };
    Model.prototype._createProxy = function () {
        this.attr = new AttribProxy();
        for (var _i = 0, _a = this.__metadata__; _i < _a.length; _i++) {
            var attrName = _a[_i];
            this.attr.addAttribute(attrName);
        }
    };
    return Model;
}());

function attr(modelPrototype, attribName) {
    modelPrototype.__metadata__.push(attribName);
}

var TodoModel = (function (_super) {
    __extends(TodoModel, _super);
    function TodoModel(author, body) {
        var _this = _super.call(this) || this;
        _this.set({
            author: author,
            body: body
        });
        return _this;
    }
    TodoModel.prototype.getAuthor = function () {
        return this.attr.author;
    };
    TodoModel.prototype.setAuthor = function (value) {
        this.attr.author = value;
    };
    TodoModel.prototype.getBody = function () {
        return this.attr.body;
    };
    TodoModel.prototype.setBody = function (value) {
        this.attr.body = value;
    };
    return TodoModel;
}(Model));
__decorate([
    attr
], TodoModel.prototype, "author", void 0);
__decorate([
    attr
], TodoModel.prototype, "body", void 0);
__decorate([
    attr
], TodoModel.prototype, "date", void 0);

var app = new App().browserBoot();
app.x = new TodoModel('pedro', 'body 1');
app.y = new TodoModel('alex', 'body 2');
//# sourceMappingURL=bundle.js.map

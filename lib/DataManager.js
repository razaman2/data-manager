"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var object_manager_1 = __importDefault(require("@razaman2/object-manager"));
var DataManager = (function () {
    function DataManager(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.config = config;
        this.data = {};
        this.ignored = { keys: [] };
        var defaultData = this.maybeFunction(((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.defaultData) !== null && _b !== void 0 ? _b : (_c = this.config) === null || _c === void 0 ? void 0 : _c.getDefaultData));
        var defaultType = (Array.isArray((_f = (_e = (_d = this.config) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : defaultData) ? [] : {});
        this.data = ((_h = (_g = this.config) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.value) ? this.config.data : { value: (_j = this.config) === null || _j === void 0 ? void 0 : _j.data };
        this.data.value = Object.assign(defaultType, defaultData, this.data.value);
    }
    DataManager.prototype.getIgnoredKeys = function () {
        var _a, _b, _c;
        var handler = ((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.ignoredKeys) !== null && _b !== void 0 ? _b : (_c = this.config) === null || _c === void 0 ? void 0 : _c.getIgnoredKeys);
        if (typeof handler === "function") {
            return handler(this.ignored.keys);
        }
        else {
            return this.ignored.keys;
        }
    };
    DataManager.prototype.getData = function (param1, param2) {
        var _a = ((typeof param1 === "string") || (typeof param1 === "number")) ?
            { path: param1, alternative: param2 } : (param1 !== null && param1 !== void 0 ? param1 : {}), path = _a.path, alternative = _a.alternative;
        return object_manager_1.default.on(this.data.value).get(path, alternative);
    };
    DataManager.prototype.setData = function (param1, param2) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        var input = object_manager_1.default.on(((typeof param1 === "object") && (param1 !== null)) ? param1 : {}, {
            paths: {
                full: true,
                test: function (path) {
                    return !_this.getIgnoredKeys().find(function (item) { return RegExp(item).test(path); });
                }
            }
        });
        if ((typeof param1 === "string") || (typeof param1 === "number")) {
            if (arguments.length === 1) {
                input.set(param1);
            }
            else {
                input.set(param1, param2);
            }
        }
        var paths = input.paths();
        var output = object_manager_1.default.on(this.data.value);
        var before = object_manager_1.default.on(output.clone());
        var notifications = ((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.notifications) !== null && _b !== void 0 ? _b : (_c = this.config) === null || _c === void 0 ? void 0 : _c.getNotifications);
        if (paths.length === 0) {
            this.data.value = input.get();
        }
        else {
            paths.forEach(function (path) {
                if (!paths.find(function (item) { return RegExp("^".concat(path, ".")).test(item); })) {
                    path ? output.set(path, input.get(path)) : output.set(input.get());
                }
                notifications === null || notifications === void 0 ? void 0 : notifications().emit("localWrite.".concat(path), input.get(path), before.get(path));
            });
        }
        notifications === null || notifications === void 0 ? void 0 : notifications().emit("localWrite", input.get(), before.get());
        if ((_d = this.config) === null || _d === void 0 ? void 0 : _d.logging) {
            console.log("%cSet ".concat((_e = this.config.name) !== null && _e !== void 0 ? _e : this.constructor.name, " Data:"), "color: ".concat((_f = this.config.color) !== null && _f !== void 0 ? _f : "orange", ";"), {
                storage: this,
                input: input.get(),
                final: this.getData(),
            });
        }
        return this;
    };
    DataManager.prototype.replaceData = function (data) {
        var _a, _b, _c, _d, _e, _f;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var defaultData = this.maybeFunction(((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.defaultData) !== null && _b !== void 0 ? _b : (_c = this.config) === null || _c === void 0 ? void 0 : _c.getDefaultData));
        var defaultType = (Array.isArray((_f = (_e = (_d = this.config) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : defaultData) ? [] : {});
        if (arguments.length > 0) {
            var replaceData = ((typeof data === "object") ? data : { '': data });
            this.setData(Object.assign(defaultType, defaultData, replaceData));
        }
        else {
            this.setData(Object.assign(defaultType, defaultData));
        }
        return this;
    };
    DataManager.prototype.maybeFunction = function (param) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return ((typeof param === "function") ? param.apply(void 0, params) : param);
    };
    return DataManager;
}());
exports.default = DataManager;
//# sourceMappingURL=DataManager.js.map
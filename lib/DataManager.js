"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_manager_1 = __importDefault(require("@razaman2/object-manager"));
class DataManager {
    constructor(config) {
        var _a;
        this.config = config;
        this.data = {};
        this.ignoredKeys = DataManager.getIgnoredKeys(["createdAt", "updatedAt"]);
        this.initialize(this.config);
        if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.getIgnoredKeys) {
            this.ignoredKeys = this.config.getIgnoredKeys(this.ignoredKeys);
        }
    }
    static getIgnoredKeys(param1) {
        return (Array.isArray(param1) ? param1 : [param1]).map((key) => `^(?:(?:\\w+.)*(?:\\d+).)*${key}`);
    }
    localWrite(data) {
        var _a, _b, _c, _d, _e, _f, _g;
        const memo = [];
        const input = object_manager_1.default.on(data);
        const output = object_manager_1.default.on(this.getData());
        const paths = input.paths();
        while (paths.length) {
            const path = paths.shift();
            const pathOverride = this.ignoredKeys.find((item) => RegExp(item).exec(path));
            const resolvedPath = ((_b = (_a = RegExp(`${pathOverride}`).exec(path)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : path);
            if (!memo.includes(`*.${resolvedPath}`)) {
                output.set(resolvedPath, input.get(resolvedPath));
                memo.push(`*.${resolvedPath}`);
            }
            path.split(".").reduce((path, item) => {
                var _a, _b, _c, _d;
                const eventPath = (path ? [path, item] : [item]).join(".");
                if (!memo.includes(eventPath)) {
                    (_d = (_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.getNotifications) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.emit) === null || _d === void 0 ? void 0 : _d.call(_c, `localWrite.${eventPath}`, input.get(eventPath));
                    memo.push(eventPath);
                }
                return eventPath;
            }, "");
        }
        (_d = (_c = this.config) === null || _c === void 0 ? void 0 : _c.getNotifications) === null || _d === void 0 ? void 0 : _d.call(_c).emit("localWrite", data);
        if ((_e = this.config) === null || _e === void 0 ? void 0 : _e.logging) {
            console.log(`%cSet ${(_f = this.config.name) !== null && _f !== void 0 ? _f : this.constructor.name} Data:`, `color: ${(_g = this.config.color) !== null && _g !== void 0 ? _g : "orange"};`, {
                storage: this,
                input: data,
                final: this.getData(),
            });
        }
    }
    getData(param1, param2) {
        const { path, alternative } = (typeof param1 === "string") ? { path: param1, alternative: param2 } : param1 !== null && param1 !== void 0 ? param1 : {};
        return object_manager_1.default.on(this.data).get(path, alternative);
    }
    setData(param1, param2, ...params) {
        if (typeof param1 === "string") {
            this.localWrite(object_manager_1.default.on(this.data).set({ path: param1, value: param2 }));
        }
        else {
            this.localWrite(param1);
        }
        return this;
    }
    replaceData(data, ...params) {
        this.reset(this.data);
        this.initialize(this.config);
        if (data) {
            this.setData(data, ...params);
        }
        return this;
    }
    reset(data) {
        Array.isArray(data) ? (data.length = 0) : Object.keys(data).forEach((key) => {
            delete data[key];
        });
    }
    maybeFunction(param, ...params) {
        return (typeof param === "function") ? param(...params) : param;
    }
    initialize(config) {
        var _a, _b;
        const data = (_a = this.maybeFunction(config === null || config === void 0 ? void 0 : config.data)) !== null && _a !== void 0 ? _a : this.data;
        const defaultData = (_b = this.maybeFunction(config === null || config === void 0 ? void 0 : config.getDefaultData)) !== null && _b !== void 0 ? _b : this.data;
        this.data = Object.assign(data, defaultData, object_manager_1.default.on(data).clone());
    }
}
exports.default = DataManager;
//# sourceMappingURL=DataManager.js.map
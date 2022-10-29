"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_manager_1 = __importDefault(require("@razaman2/object-manager"));
class DataManager {
    constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.config = config;
        this.data = {};
        this.ignoredKeys = DataManager.getIgnoredKeys(["createdAt", "updatedAt"]);
        const data1 = this.initialize((_b = this.maybeFunction((_a = this.config) === null || _a === void 0 ? void 0 : _a.data)) !== null && _b !== void 0 ? _b : this.data);
        this.data = (_e = (_d = (_c = this.config) === null || _c === void 0 ? void 0 : _c.beforeWrite) === null || _d === void 0 ? void 0 : _d.call(_c, data1)) !== null && _e !== void 0 ? _e : data1;
        if ((_f = this.config) === null || _f === void 0 ? void 0 : _f.getIgnoredKeys) {
            this.ignoredKeys = this.config.getIgnoredKeys(this.ignoredKeys);
        }
        if ((_g = this.config) === null || _g === void 0 ? void 0 : _g.ignoredKeys) {
            this.ignoredKeys = this.config.ignoredKeys(this.ignoredKeys);
        }
    }
    localWrite(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
                var _a, _b, _c, _d, _e, _f;
                const eventPath = (path ? [path, item] : [item]).join(".");
                if (!memo.includes(eventPath)) {
                    (_f = (_e = (_d = ((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.notifications) !== null && _b !== void 0 ? _b : (_c = this.config) === null || _c === void 0 ? void 0 : _c.getNotifications)) === null || _d === void 0 ? void 0 : _d()) === null || _e === void 0 ? void 0 : _e.emit) === null || _f === void 0 ? void 0 : _f.call(_e, `localWrite.${eventPath}`, input.get(eventPath));
                    memo.push(eventPath);
                }
                return eventPath;
            }, "");
        }
        (_f = ((_d = (_c = this.config) === null || _c === void 0 ? void 0 : _c.notifications) !== null && _d !== void 0 ? _d : (_e = this.config) === null || _e === void 0 ? void 0 : _e.getNotifications)) === null || _f === void 0 ? void 0 : _f().emit("localWrite", data);
        if ((_g = this.config) === null || _g === void 0 ? void 0 : _g.logging) {
            console.log(`%cSet ${(_h = this.config.name) !== null && _h !== void 0 ? _h : this.constructor.name} Data:`, `color: ${(_j = this.config.color) !== null && _j !== void 0 ? _j : "orange"};`, {
                storage: this,
                input: data,
                final: this.getData(),
            });
        }
    }
    static getIgnoredKeys(param1) {
        return (Array.isArray(param1) ? param1 : [param1]).map((key) => `^(?:(?:\\w+.)*(?:\\d+).)*${key}`);
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
        var _a, _b;
        const data1 = this.initialize(data !== null && data !== void 0 ? data : (Array.isArray(this.data) ? [] : {}));
        const data2 = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.beforeReset) === null || _b === void 0 ? void 0 : _b.call(_a, data1);
        if (data2) {
            this.data = data2;
        }
        else {
            if (Array.isArray(this.data)) {
                this.data.length = 0;
            }
            else {
                for (const key in this.data) {
                    delete this.data[key];
                }
            }
        }
        this.setData(data2 !== null && data2 !== void 0 ? data2 : data1, ...params);
        return this;
    }
    initialize(data) {
        var _a, _b, _c, _d;
        const defaultData1 = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.defaultData) !== null && _b !== void 0 ? _b : (_c = this.config) === null || _c === void 0 ? void 0 : _c.getDefaultData;
        const defaultData = (_d = this.maybeFunction(defaultData1)) !== null && _d !== void 0 ? _d : {};
        return Object.assign((Array.isArray(data) ? [] : {}), defaultData, data);
    }
    maybeFunction(param, ...params) {
        return (typeof param === "function") ? param(...params) : param;
    }
}
exports.default = DataManager;
//# sourceMappingURL=DataManager.js.map
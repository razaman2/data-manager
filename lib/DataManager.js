"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_manager_1 = __importDefault(require("@razaman2/object-manager"));
class DataManager {
    constructor(config) {
        var _a, _b, _c, _d, _e;
        this.config = config;
        this.data = {};
        this.ignored = { keys: [] };
        const data1 = this.initialize((_b = this.maybeFunction((_a = this.config) === null || _a === void 0 ? void 0 : _a.data)) !== null && _b !== void 0 ? _b : this.data);
        this.data = (_e = (_d = (_c = this.config) === null || _c === void 0 ? void 0 : _c.beforeWrite) === null || _d === void 0 ? void 0 : _d.call(_c, data1)) !== null && _e !== void 0 ? _e : data1;
    }
    getIgnoredKeys() {
        var _a, _b, _c;
        const handler = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.ignoredKeys) !== null && _b !== void 0 ? _b : (_c = this.config) === null || _c === void 0 ? void 0 : _c.getIgnoredKeys;
        if (typeof handler === "function") {
            return handler(this.ignored.keys);
        }
        else {
            return this.ignored.keys;
        }
    }
    localWrite(param1, param2) {
        var _a, _b, _c, _d, _e, _f, _g;
        const input = (typeof param1 === "string") ?
            (() => {
                const manager = object_manager_1.default.on({});
                manager.set({ path: param1, value: param2 });
                return manager;
            })() :
            object_manager_1.default.on(param1);
        const output = object_manager_1.default.on(this.getData());
        const cache = [];
        const ignored = {
            paths: input.paths(),
            keys: this.getIgnoredKeys()
        };
        const notifications = ((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.notifications) !== null && _b !== void 0 ? _b : (_c = this.config) === null || _c === void 0 ? void 0 : _c.getNotifications);
        while (ignored.paths.length) {
            const path = (_d = ignored.paths.shift()) === null || _d === void 0 ? void 0 : _d.replace(RegExp(`^(${ignored.keys.join("|")}).+`), ($0, $1) => $1.length ? $1 : $0);
            // ignored.paths = ignored.paths.filter((path1) => !RegExp(`${path}.*$`).test(path1));
            if (!cache.includes(`*.${path}`)) {
                output.set(path, input.get(path));
                cache.push(`*.${path}`);
            }
            path.split(".").reduce((s1, s2) => {
                const eventPath = (s1 ? [s1, s2] : [s2]).join(".");
                if (!cache.includes(eventPath)) {
                    notifications === null || notifications === void 0 ? void 0 : notifications().emit(`localWrite.${eventPath}`, input.get(eventPath));
                    cache.push(eventPath);
                }
                return eventPath;
            }, "");
        }
        notifications === null || notifications === void 0 ? void 0 : notifications().emit("localWrite", input.get());
        if ((_e = this.config) === null || _e === void 0 ? void 0 : _e.logging) {
            console.log(`%cSet ${(_f = this.config.name) !== null && _f !== void 0 ? _f : this.constructor.name} Data:`, `color: ${(_g = this.config.color) !== null && _g !== void 0 ? _g : "orange"};`, {
                storage: this,
                input: input.get(),
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
            this.localWrite(param1, param2);
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
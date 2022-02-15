"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_manager_1 = __importDefault(require("@razaman2/object-manager"));
class DataManager {
    constructor(config) {
        this.data = {};
        this.IGNORED_KEYS = this.setIgnoredKeys(["createdAt", "updatedAt"]);
        this.initialize(config);
    }
    initialize(config) {
        this.initializeDefaultData(config);
        this.initializeData(config);
        if (config === null || config === void 0 ? void 0 : config.getIgnoredKeys) {
            this.IGNORED_KEYS = config.getIgnoredKeys(this.IGNORED_KEYS);
        }
        this.config = config;
        // added for backwards compatibility
        this.object = this.config;
    }
    setIgnoredKeys(keys) {
        return (Array.isArray(keys) ? keys : [keys]).map((key) => `^(?:(?:\\w+.)*(?:\\d+).)*${key}`);
    }
    localWrite(data) {
        var _a, _b, _c, _d, _e, _f, _g;
        const memo = [];
        const input = object_manager_1.default.on(data);
        const output = object_manager_1.default.on(this.getData());
        const paths = input.paths();
        while (paths.length) {
            const path = paths.shift();
            const pathOverride = this.IGNORED_KEYS.find((item) => RegExp(item).exec(path));
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
        (_f = (_e = (_d = (_c = this.config) === null || _c === void 0 ? void 0 : _c.getNotifications) === null || _d === void 0 ? void 0 : _d.call(_c)) === null || _e === void 0 ? void 0 : _e.emit) === null || _f === void 0 ? void 0 : _f.call(_e, "localWrite", data);
        if ((_g = this.config) === null || _g === void 0 ? void 0 : _g.logging) {
            console.log(`%cSet ${this.config.name} Data:`, "color: orange;", {
                component: this,
                input: data,
                final: this.getData(),
            });
        }
    }
    getData(path = "", alternative) {
        const params = (typeof path === "string") ? {
            path,
            alternative,
        } : path;
        return object_manager_1.default.on(this.data).get(params);
    }
    setData(data, ...params) {
        this.localWrite(data);
        return this;
    }
    initializeDefaultData(config) {
        if (config === null || config === void 0 ? void 0 : config.getDefaultData) {
            this.data = (typeof config.getDefaultData === "function") ?
                config.getDefaultData() :
                config.getDefaultData;
        }
        else {
            this.data = {};
        }
    }
    initializeData(config) {
        if (config === null || config === void 0 ? void 0 : config.data) {
            this.data = Object.assign(this.data, (typeof config.data === "function") ?
                config.data() :
                config.data);
        }
    }
    replaceData(data) {
        this.initializeDefaultData(this.config);
        if (data) {
            this.setData(data);
        }
        return this;
    }
}
exports.default = DataManager;
//# sourceMappingURL=DataManager.js.map
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/DataManager.ts
var import_object_manager = __toESM(require("@razaman2/object-manager"));
var DataManager = class _DataManager {
  constructor(config) {
    this.config = config;
    this.ignored = { keys: [] };
    this.transformed = (input) => {
      try {
        return input.hasOwnProperty("") ? input[""] : input;
      } catch (e) {
        return input;
      }
    };
    var _a;
    const defaultData = _DataManager.transform((_a = this.config) == null ? void 0 : _a.defaultData);
    const defaultState = Array.isArray(this.transformed(this.data)) ? [] : {};
    this.setData(Object.assign(defaultState, defaultData, this.data));
  }
  get data() {
    var _a, _b, _c;
    return _DataManager.transform((_c = (_a = this.config) == null ? void 0 : _a.data) != null ? _c : (_b = this.config) == null ? void 0 : _b.defaultData);
  }
  static transform(input) {
    try {
      return /Array|Object/.test(input.constructor.name) ? input : { "": input };
    } catch (e) {
      return input;
    }
  }
  getIgnoredKeys() {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.config) == null ? void 0 : _a.ignoredKeys) == null ? void 0 : _b.call(_a, this.ignored.keys)) != null ? _c : this.ignored.keys;
  }
  getData(param1, param2) {
    const manager = import_object_manager.default.on(this.data);
    if (typeof param1 === "object") {
      return manager.get({ path: param1.path, alternative: param1.alternative });
    } else {
      return manager.get(param1, param2);
    }
  }
  setData(...params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const data = arguments.length === 1 ? _DataManager.transform((_a = params[0].__data) != null ? _a : params[0]) : void 0;
    const input = import_object_manager.default.on(data, {
      paths: {
        full: true,
        test: (path) => {
          return !this.getIgnoredKeys().find((item) => {
            return RegExp(item).test(path);
          });
        }
      }
    });
    if (data === void 0) {
      input.set((_b = params[0].__data) != null ? _b : params[0], params[1]);
    }
    const paths = input.paths();
    const output = import_object_manager.default.on(this.data);
    const before = import_object_manager.default.on((_c = params[0].__clone) != null ? _c : output.clone());
    paths.forEach((path) => {
      var _a2, _b2;
      if (!paths.find((item) => RegExp(`^${path}\\.`).test(item))) {
        output.set(path, input.get(path));
      }
      (_b2 = (_a2 = this.config) == null ? void 0 : _a2.notifications) == null ? void 0 : _b2.emit(`localWrite.${path}`, input.get(path), before.get(path));
    });
    (_e = (_d = this.config) == null ? void 0 : _d.notifications) == null ? void 0 : _e.emit("localWrite", input.get(), before.get());
    if ((_f = this.config) == null ? void 0 : _f.logging) {
      console.log(`%cSet ${(_g = this.config.name) != null ? _g : this.constructor.name} Data:`, `color: ${(_i = (_h = params[0].__config) == null ? void 0 : _h.color) != null ? _i : "orange"}`, {
        storage: this,
        input: input.get(),
        final: this.getData()
      });
    }
    return this;
  }
  replaceData(data) {
    const clone = import_object_manager.default.on(this.data).clone();
    for (const key in this.data) {
      delete this.data[key];
    }
    this.setData({
      __clone: clone,
      __data: Object.assign(this.data, _DataManager.transform(data)),
      __config: {
        color: "yellow"
      }
    });
    return this;
  }
};

// src/index.ts
var src_default = DataManager;

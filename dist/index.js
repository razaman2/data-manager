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
    this.state = {};
    this.ignored = { keys: [] };
    var _a, _b;
    const defaultData = _DataManager.transform((_a = this.config) == null ? void 0 : _a.defaultData);
    const defaultState = Array.isArray((_b = this.data) != null ? _b : defaultData) ? [] : {};
    this.setData(Object.assign(defaultState, defaultData, this.data));
  }
  get data() {
    var _a, _b;
    return _DataManager.transform((_b = (_a = this.config) == null ? void 0 : _a.data) != null ? _b : this.state);
  }
  static transform(data) {
    try {
      return /Array|Object/.test(data.constructor.name) ? data : { "": data };
    } catch (e) {
      return data;
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
  setData(param1, param2) {
    var _a, _b, _c, _d;
    const object = /Array|Object/.test(param1.constructor.name);
    const data = _DataManager.transform(arguments.length === 1 ? param1 : object ? param2 : { [param1]: param2 });
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
    const paths = input.paths();
    const output = import_object_manager.default.on(this.data);
    const before = import_object_manager.default.on(output.clone());
    paths.forEach((path) => {
      var _a2, _b2;
      if (!paths.find((item) => RegExp(`^${path}\\.`).test(item))) {
        output.set(path, input.get(path));
      }
      (_b2 = (_a2 = this.config) == null ? void 0 : _a2.notifications) == null ? void 0 : _b2.emit(`localWrite.${path}`, input.get(path), before.get(path));
    });
    (_b = (_a = this.config) == null ? void 0 : _a.notifications) == null ? void 0 : _b.emit("localWrite", input.get(), before.get());
    if ((_c = this.config) == null ? void 0 : _c.logging) {
      console.log(`%cSet ${(_d = this.config.name) != null ? _d : this.constructor.name} Data:`, `color: orange`, {
        storage: this,
        input: input.get(),
        final: this.getData()
      });
    }
    return this;
  }
  replaceData(data) {
    var _a, _b;
    for (const key in this.data) {
      delete this.data[key];
    }
    this.setData(Object.assign(_DataManager.transform((_b = (_a = this.config) == null ? void 0 : _a.defaultData) != null ? _b : this.data), _DataManager.transform(data)));
    return this;
  }
};

// src/index.ts
var src_default = DataManager;

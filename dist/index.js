"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default2
});
module.exports = __toCommonJS(src_exports);

// ../object-manager/dist/index.mjs
var ObjectManager = class {
  constructor(object = {}, options = {}) {
    this.object = object;
    this.options = options;
    this.skipped = [Date];
    var _a;
    this.skipped = options.skip === false ? [] : this.skipped.concat((_a = options.skip) != null ? _a : []);
  }
  paths(object = this.object, path) {
    return Object.entries(object).reduce((paths, [key, val]) => {
      var _a, _b, _c, _d;
      const previous = { path: `${path ? `${path}.` : ""}${key}` };
      if ((_c = (_b = (_a = this.options.paths) == null ? void 0 : _a.test) == null ? void 0 : _b.call(_a, previous.path)) != null ? _c : true) {
        if (typeof val === "object") {
          try {
            if ((typeof this.options.functions === "boolean" ? this.options.functions : true) && Object.values(val).some((item) => typeof item === "function")) {
              paths.push(key);
            } else {
              const nested = { paths: this.paths(val, previous.path) };
              if (nested.paths.length === 0 || ((_d = this.options.paths) == null ? void 0 : _d.full)) {
                paths.push(key);
              }
              nested.paths.forEach((segment) => {
                paths.push(`${key}.${segment}`);
              });
            }
          } catch (e) {
            paths.push(key);
          }
        } else {
          paths.push(key);
        }
      }
      return paths;
    }, []);
  }
  get(param1, param2) {
    var _a;
    const { path, alternative, object = this.object } = typeof param1 === "string" || typeof param1 === "number" ? { path: param1, alternative: param2 } : param1 != null ? param1 : {};
    if (typeof path === "number") {
      return this.get(path.toString(), param2);
    } else if (typeof path === "string") {
      try {
        return (_a = path.split(".").reduce((object2, segment) => {
          return object2[segment];
        }, object)) != null ? _a : alternative;
      } catch (e) {
        return alternative;
      }
    } else {
      return object.hasOwnProperty("") ? object[""] : (param1 == null ? void 0 : param1.hasOwnProperty("alternative")) ? alternative : object;
    }
  }
  set(param1, param2) {
    if (arguments.length === 1) {
      if (typeof param1 === "object") {
        if (param1.hasOwnProperty("value")) {
          if (param1.hasOwnProperty("path")) {
            this.set(param1.path, param1.value);
          } else {
            this.set(param1.value);
          }
        } else if (param1.hasOwnProperty("object")) {
          this.copy(param1.object);
        } else {
          this.copy(param1);
        }
      } else {
        this.set("", param1);
      }
    } else {
      if (typeof param1 === "number") {
        this.set(param1.toString(), param2);
      } else if (typeof param1 === "string") {
        param1.split(".").reduce((object, segment, index, segments) => {
          if (index === segments.length - 1) {
            object[segment] = param2;
          } else if (object.hasOwnProperty(segment)) {
            return object[segment];
          } else {
            object[segment] = RegExp(`${segment}.\\d+(?:\\.|$)`).test(param1) ? [] : typeof param2 === "object" ? Object.setPrototypeOf({}, Object.getPrototypeOf(param2)) : {};
          }
          return object[segment];
        }, this.object);
      } else {
        throw new Error(JSON.stringify({
          code: "invalid_path",
          message: "path must be typeof string or number."
        }));
      }
    }
    return this.object;
  }
  copy(object) {
    this.object = ObjectManager.on(object).clone();
    return this;
  }
  clone(object = this.object) {
    if (this.skip(object)) {
      return object;
    } else {
      return Object.setPrototypeOf(
        Object.entries(object).reduce((object2, [key, val]) => {
          try {
            if (Array.isArray(val)) {
              object2[key] = val.map((item) => {
                if (typeof item === "object") {
                  return Object.setPrototypeOf(this.clone(item), Object.getPrototypeOf(item));
                } else {
                  return item;
                }
              });
            } else if (typeof val === "object") {
              object2[key] = Object.setPrototypeOf(this.clone(val), Object.getPrototypeOf(val));
            } else {
              object2[key] = val;
            }
          } catch (e) {
            object2[key] = val;
          }
          return object2;
        }, Array.isArray(object) ? [] : {}),
        Object.getPrototypeOf(object)
      );
    }
  }
  static on(object = {}, options = {}) {
    return new ObjectManager(object, options);
  }
  skip(object) {
    for (const item of this.skipped) {
      if (object instanceof item) {
        return true;
      }
    }
    return false;
  }
};
var src_default = ObjectManager;

// src/DataManager.ts
var DataManager = class {
  constructor(config) {
    this.config = config;
    this.ignored = { keys: [] };
    var _a, _b;
    const data = this.transform((_a = this.config) == null ? void 0 : _a.data);
    const defaultData = this.transform((_b = this.config) == null ? void 0 : _b.defaultData);
    const defaultState = Array.isArray(data != null ? data : defaultData) ? [] : {};
    this.setData(Object.assign(defaultState, defaultData, data));
  }
  get data() {
    var _a;
    return (_a = this.config) == null ? void 0 : _a.data;
  }
  transform(data) {
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
    var _a;
    const { path, alternative } = typeof param1 === "string" || typeof param1 === "number" ? { path: param1, alternative: param2 } : param1 != null ? param1 : {};
    return src_default.on(this.transform((_a = this.config) == null ? void 0 : _a.data)).get({ path, alternative });
  }
  setData(param1, param2) {
    var _a, _b, _c, _d, _e;
    const object = /Array|Object/.test(param1.constructor.name);
    const data = this.transform(arguments.length === 1 ? param1 : object ? param2 : { [param1]: param2 });
    const input = src_default.on(data, {
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
    const output = src_default.on(this.transform((_a = this.config) == null ? void 0 : _a.data));
    const before = src_default.on(output.clone());
    paths.forEach((path) => {
      var _a2, _b2;
      if (!paths.find((item) => RegExp(`^${path}\\.`).test(item))) {
        output.set(path, input.get(path));
      }
      (_b2 = (_a2 = this.config) == null ? void 0 : _a2.notifications) == null ? void 0 : _b2.emit(`localWrite.${path}`, input.get(path), before.get(path));
    });
    (_c = (_b = this.config) == null ? void 0 : _b.notifications) == null ? void 0 : _c.emit("localWrite", input.get(), before.get());
    if ((_d = this.config) == null ? void 0 : _d.logging) {
      console.log(`%cSet ${(_e = this.config.name) != null ? _e : this.constructor.name} Data:`, `color: orange`, {
        storage: this,
        input: input.get(),
        final: this.getData()
      });
    }
    return this;
  }
  replaceData(data) {
    var _a, _b, _c, _d;
    for (const key in (_a = this.config) == null ? void 0 : _a.data) {
      (_c = (_b = this.config) == null ? void 0 : _b.data) == null ? true : delete _c[key];
    }
    this.setData(Object.assign(this.transform((_d = this.config) == null ? void 0 : _d.defaultData), this.transform(data)));
    return this;
  }
};

// src/index.ts
var src_default2 = DataManager;

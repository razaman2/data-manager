// src/DataManager.ts
import ObjectManager from "@razaman2/object-manager";
var DataManager = class _DataManager {
  constructor(config) {
    this.config = config;
    this.state = {};
    this.ignored = { keys: [] };
    var _a;
    const defaultData = _DataManager.transform((_a = this.config) == null ? void 0 : _a.defaultData);
    const defaultState = Array.isArray(defaultData != null ? defaultData : this.data) ? [] : {};
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
    const manager = ObjectManager.on(this.data);
    if (typeof param1 === "object") {
      return manager.get({ path: param1.path, alternative: param1.alternative });
    } else {
      return manager.get(param1, param2);
    }
  }
  setData(...params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const data = arguments.length === 1 ? _DataManager.transform((_a = params[0].__data) != null ? _a : params[0]) : void 0;
    const input = ObjectManager.on(data, {
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
    const output = ObjectManager.on(this.data);
    const before = ObjectManager.on((_c = params[0].__clone) != null ? _c : output.clone());
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
    const clone = ObjectManager.on(this.data).clone();
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
export {
  src_default as default
};

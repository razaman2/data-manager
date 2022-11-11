"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIgnoredKeys = void 0;
const DataManager_1 = __importDefault(require("./DataManager"));
exports.default = DataManager_1.default;
function getIgnoredKeys(param1) {
    return (Array.isArray(param1) ? param1 : [param1]).map((key) => `^(?:(?:\\w+.)*(?:\\d+).)*${key}`);
}
exports.getIgnoredKeys = getIgnoredKeys;
//# sourceMappingURL=index.js.map
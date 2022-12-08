import DataManager from "./DataManager";
import * as DataClient from "./DataClient";

export default DataManager;

function getIgnoredKeys(key: string): Array<string>
function getIgnoredKeys(keys: Array<string>): Array<string>
function getIgnoredKeys(param1: string | Array<string>) {
    return (Array.isArray(param1) ? param1 : [param1]).map((key) => `^(?:(?:\\w+.)*(?:\\d+).)*${key}`);
}

export {DataClient, getIgnoredKeys};

import DataClient from "./DataClient";
export default class DataManager {
    protected data: Record<string, any>;
    protected IGNORED_KEYS: Array<string>;
    protected object?: DataClient;
    protected config?: DataClient;
    constructor(config?: DataClient);
    initialize(config?: DataClient): void;
    setIgnoredKeys(keys: Array<string>): string[];
    localWrite(data: Record<string, any>): void;
    getData(path?: string | {
        path?: string;
        alternative?: any;
    }, alternative?: any): any;
    setData(data: Record<string, any>, ...params: Array<any>): this;
    private initializeDefaultData;
    private initializeData;
    replaceData(data?: Record<string, any>, ...params: Array<any>): this;
}
//# sourceMappingURL=DataManager.d.ts.map
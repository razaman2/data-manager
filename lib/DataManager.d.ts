import DataClient from "./DataClient";
export default class DataManager {
    protected config?: DataClient | undefined;
    protected data: Record<string, any>;
    protected ignoredKeys: Array<string>;
    constructor(config?: DataClient | undefined);
    localWrite(data: Record<string, any>): void;
    static getIgnoredKeys(key: string): Array<string>;
    static getIgnoredKeys(keys: Array<string>): Array<string>;
    getData(): any;
    getData(path: string, alternative?: any): any;
    getData(options: {
        path: string;
        alternative?: any;
    }): any;
    setData(data: Record<string, any>, ...params: Array<any>): DataManager;
    setData(path: string, value: any, ...params: Array<any>): DataManager;
    replaceData(data?: Record<string, any> | Array<any>, ...params: Array<any>): this;
    private initialize;
    private maybeFunction;
}
//# sourceMappingURL=DataManager.d.ts.map
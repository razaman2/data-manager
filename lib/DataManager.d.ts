import DataClient from "./DataClient";
export default class DataManager {
    protected config?: DataClient | undefined;
    protected data: Record<string, any>;
    protected ignoredKeys: Array<string>;
    constructor(config?: DataClient | undefined);
    static getIgnoredKeys(key: string): Array<string>;
    static getIgnoredKeys(keys: Array<string>): Array<string>;
    localWrite(data: Record<string, any>): void;
    getData(): any;
    getData(path: string, alternative?: any): any;
    getData(options: {
        path: string;
        alternative?: any;
    }): any;
    setData(data: Record<string, any>, ...params: Array<any>): DataManager;
    setData(path: string, value: any, ...params: Array<any>): DataManager;
    replaceData(data?: Record<string, any>, ...params: Array<any>): this;
    private reset;
    private maybeFunction;
    private initialize;
}
//# sourceMappingURL=DataManager.d.ts.map
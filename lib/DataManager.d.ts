import DataClient from "./DataClient";
export default class DataManager {
    protected config?: DataClient;
    protected data: Record<string, any>;
    protected IGNORED_KEYS: Array<string>;
    constructor(config?: DataClient);
    setIgnoredKeys(keys: string | Array<string>): string[];
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
    private initializeData;
}
//# sourceMappingURL=DataManager.d.ts.map
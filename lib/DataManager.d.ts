import type DataClient from "./DataClient";
export default class DataManager {
    protected config?: DataClient | undefined;
    protected data: Record<string, any>;
    protected ignored: {
        keys: Array<string>;
    };
    constructor(config?: DataClient | undefined);
    getIgnoredKeys(): string[];
    localWrite(path: string, value: any): void;
    localWrite(data: Record<string, any>): void;
    getData(): any;
    getData(path: string, alternative?: any): any;
    getData(options: {
        path: string;
        alternative?: any;
    }): any;
    setData(path: string, value: any, ...params: Array<any>): DataManager;
    setData(data: Record<string, any>, ...params: Array<any>): DataManager;
    replaceData(data?: Record<string, any> | Array<any>, ...params: Array<any>): this;
    private initialize;
    private maybeFunction;
}
//# sourceMappingURL=DataManager.d.ts.map
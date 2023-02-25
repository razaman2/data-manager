import type DataClient from "./DataClient";
export default class DataManager {
    protected config?: DataClient | undefined;
    protected data: Record<string, any>;
    protected ignored: {
        keys: Array<string>;
    };
    constructor(config?: DataClient | undefined);
    getIgnoredKeys(): string[];
    getData(): any;
    getData(path: string | number, alternative?: any): any;
    getData(options: {
        path: string | number;
        alternative?: any;
    }): any;
    setData(value: any): DataManager;
    setData(data: Record<string, any>, ...params: Array<any>): DataManager;
    setData(path: string | number, value: any, ...params: Array<any>): DataManager;
    replaceData(data?: Record<string, any> | Array<any>, ...params: Array<any>): this;
    private maybeFunction;
}

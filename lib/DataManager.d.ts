import DataClient from './DataClient';
export default class DataManager {
    protected config?: DataClient | undefined;
    protected data: Record<string, any>;
    protected IGNORED_KEYS: Array<string>;
    protected object?: DataClient;
    constructor(config?: DataClient | undefined);
    localWrite(data: Record<string, any>): void;
    getData(path?: string | {
        path?: string;
        alternative?: any;
    }, alternative?: any): any;
    setData(data: Record<string, any>, ...params: Array<any>): this;
    replaceData(data?: Record<string, any>): this;
}
//# sourceMappingURL=DataManager.d.ts.map
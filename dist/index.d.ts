import EventEmitter from '@razaman2/event-emitter';

type Datatype = any;
interface DataClient extends Record<string, any> {
    data?: Datatype;
    defaultData?: Datatype;
    logging?: boolean;
    model?: DataClient;
    ignoredKeys?: (keys: Array<string>) => typeof keys;
    notifications?: EventEmitter;
}

type GetOptions = {
    path?: string | number;
    alternative?: any;
};
declare class DataManager {
    protected config?: DataClient | undefined;
    protected state: any;
    protected ignored: {
        keys: Array<string>;
    };
    get data(): any;
    static transform(data: any): any;
    constructor(config?: DataClient | undefined);
    getIgnoredKeys(): Array<string>;
    getData(): any;
    getData(path: string | number): any;
    getData(path: string | number, alternative?: any): any;
    getData(options: GetOptions): any;
    setData(value: any): this;
    setData(path: string | number | boolean, value: any): this;
    replaceData(data?: any): this;
}

export { DataClient, DataManager as default };

import EventEmitter from '@razaman2/event-emitter';

type Datatype = any;
interface DataClient extends Record<string, any> {
    data?: Datatype;
    defaultData?: Datatype;
    logging?: boolean;
    model?: DataClient;
    ignoredKeys?: (keys: Array<string>) => typeof keys;
    notifications?: EventEmitter;
    onWrite?: (data: Datatype) => {};
}

type GetOptions = {
    path?: string | number;
    alternative?: any;
};
declare class DataManager {
    protected config?: DataClient | undefined;
    protected ignored: {
        keys: Array<string>;
    };
    get data(): any;
    private transform;
    constructor(config?: DataClient | undefined);
    getIgnoredKeys(): Array<string>;
    getData(): any;
    getData(path: string | number): any;
    getData(path: string | number, alternative?: any): any;
    getData(options: GetOptions): any;
    setData(value: any): this;
    setData(data: Record<string, any>): this;
    setData(path: string | number, value: any): this;
    replaceData(data?: any): this;
}

export { DataClient, DataManager as default };

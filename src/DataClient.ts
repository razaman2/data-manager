import EventEmitter from "@razaman2/event-emitter";

type Datatype = any;

export default interface DataClient extends Record<string, any> {
    data?: Datatype;
    defaultData?: Datatype;
    logging?: boolean;
    model?: DataClient;
    ignoredKeys?: (keys: Array<string>) => typeof keys;
    ignoredPaths?: (path: string, paths: Record<string, any>) => boolean;
    notifications?: EventEmitter;
}

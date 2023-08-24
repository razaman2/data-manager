import EventEmitter from "@razaman2/event-emitter";

export default interface DataClient extends Record<string, any> {
    data?: any;
    defaultData?: any;
    logging?: boolean;
    model?: DataClient;
    ignoredKeys?: (keys: Array<string>) => typeof keys;
    ignoredPaths?: (path: string, paths: Record<string, any>) => boolean;
    notifications?: EventEmitter;
}

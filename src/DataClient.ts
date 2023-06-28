import EventEmitter from "@razaman2/event-emitter";

type Datatype = any;

export default interface DataClient extends Record<string, any> {
    data?: Datatype;
    defaultData?: Datatype;
    logging?: boolean;
    model?: DataClient;
    ignoredKeys?: (keys: Array<string>) => typeof keys;
    notifications?: EventEmitter;
}

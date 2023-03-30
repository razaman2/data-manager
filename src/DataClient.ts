import EventEmitter from "@razaman2/event-emitter";

type Datatype = Record<string, any> | Array<any>;

export default interface DataClient extends Record<string, any> {
    logging?: boolean;
    model?: DataClient;
    data?: {
        value?: (() => Datatype) | Datatype
    };
    defaultData?: (() => Datatype) | Datatype;
    ignoredKeys?: (keys: Array<string>) => typeof keys;
    notifications?: EventEmitter;
}

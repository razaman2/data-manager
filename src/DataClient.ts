import EventEmitter from "@razaman2/event-emitter";

export default interface DataClient extends Record<string, any> {
    data?: any;
    defaultData?: any;
    logging?: boolean;
    model?: DataClient;
    notifications?: EventEmitter;
}

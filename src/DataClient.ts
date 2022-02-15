import EventEmitter from "@razaman2/event-emitter";

export default interface DataClient extends Record<string, any> {
    logging?: boolean;
    model?: DataClient;
    data?: (() => Record<string, any>) | Record<string, any>;
    getDefaultData?: (() => Record<string, any>) | Record<string, any>;
    getIgnoredKeys?: (keys: Array<string>) => Array<string>;
    getNotifications?: () => EventEmitter;
}

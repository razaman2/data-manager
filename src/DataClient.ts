import EventEmitter
    from "@razaman2/event-emitter";

export default interface DataClient extends Record<string, any> {
    logging?: boolean;
    model?: DataClient;
    data?: (() => Record<string, any>) | Record<string, any>;
    getDefaultData?: () => Record<string, any>;
    getNotifications?: () => EventEmitter;
    getIgnoredKeys?: (keys: Array<string>) => Array<string>;
}

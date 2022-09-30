import EventEmitter from "@razaman2/event-emitter";
export default interface DataClient extends Record<string, any> {
    model?: DataClient;
    logging?: boolean;
    data?: (() => Record<string, any>) | Record<string, any>;
    getDefaultData?: (() => Record<string, any>) | Record<string, any>;
    getIgnoredKeys?: (keys: Array<string>) => Array<string>;
    getNotifications?: () => EventEmitter;
}
//# sourceMappingURL=DataClient.d.ts.map
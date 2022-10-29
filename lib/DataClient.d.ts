import EventEmitter from "@razaman2/event-emitter";
export default interface DataClient extends Record<string, any> {
    logging?: boolean;
    model?: DataClient;
    data?: (() => Record<string, any>) | Record<string, any>;
    defaultData?: (() => Record<string, any>) | Record<string, any>;
    ignoredKeys?: (keys: Array<string>) => Array<string>;
    notifications?: () => EventEmitter;
    beforeReset?: <T extends Array<any> | object>(data: T) => T;
    beforeWrite?: <T extends Array<any> | object>(data: T) => T;
    /**
     * @deprecated
     */
    getDefaultData?: (() => Record<string, any>) | Record<string, any>;
    getIgnoredKeys?: (keys: Array<string>) => Array<string>;
    getNotifications?: () => EventEmitter;
}
//# sourceMappingURL=DataClient.d.ts.map
import EventEmitter from "@razaman2/event-emitter";
type Datatype = Record<string, any> | Array<any>;
export default interface DataClient extends Record<string, any> {
    logging?: boolean;
    model?: DataClient;
    data?: (() => Datatype) | Datatype;
    defaultData?: (() => Datatype) | Datatype;
    ignoredKeys?: (keys: Array<string>) => typeof keys;
    notifications?: () => EventEmitter;
    beforeReset?: <T extends Datatype>(data: T) => T;
    beforeWrite?: <T extends Datatype>(data: T) => T;
    /**
     * @deprecated
     */
    getDefaultData?: (() => Record<string, any>) | Record<string, any>;
    /**
     * @deprecated
     */
    getIgnoredKeys?: (keys: Array<string>) => Array<string>;
    /**
     * @deprecated
     */
    getNotifications?: () => EventEmitter;
}
export {};
//# sourceMappingURL=DataClient.d.ts.map
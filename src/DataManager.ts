import ObjectManager from "@razaman2/object-manager";
import DataClient from "./DataClient";

export default class DataManager {
    protected data: Record<string, any> = {};
    protected ignoredKeys: Array<string> = DataManager.getIgnoredKeys(["createdAt", "updatedAt"]);

    public constructor(protected config?: DataClient) {
        const data1 = this.initialize(this.maybeFunction(this.config?.data) ?? this.data);

        this.data = this.config?.beforeWrite?.(data1) ?? data1;

        if (this.config?.getIgnoredKeys) {
            this.ignoredKeys = this.config.getIgnoredKeys(this.ignoredKeys);
        }

        if (this.config?.ignoredKeys) {
            this.ignoredKeys = this.config.ignoredKeys(this.ignoredKeys);
        }
    }

    public localWrite(data: Record<string, any>) {
        const memo: Array<string> = [];
        const input = ObjectManager.on(data);
        const output = ObjectManager.on(this.getData());
        const paths = input.paths();

        while (paths.length) {
            const path = paths.shift() as string;
            const pathOverride = this.ignoredKeys.find((item) => RegExp(item).exec(path));
            const resolvedPath = (RegExp(`${pathOverride}`).exec(path)?.[0] ?? path);

            if (!memo.includes(`*.${resolvedPath}`)) {
                output.set(resolvedPath, input.get(resolvedPath));
                memo.push(`*.${resolvedPath}`);
            }

            path.split(".").reduce((path, item) => {
                const eventPath = (path ? [path, item] : [item]).join(".");

                if (!memo.includes(eventPath)) {
                    (this.config?.notifications ?? this.config?.getNotifications)?.()?.emit?.(`localWrite.${eventPath}`, input.get(eventPath));
                    memo.push(eventPath);
                }

                return eventPath;
            }, "");
        }

        (this.config?.notifications ?? this.config?.getNotifications)?.().emit("localWrite", data);

        if (this.config?.logging) {
            console.log(`%cSet ${this.config.name ?? this.constructor.name} Data:`, `color: ${this.config.color ?? "orange"};`, {
                storage: this,
                input: data,
                final: this.getData(),
            });
        }
    }

    public static getIgnoredKeys(key: string): Array<string>
    public static getIgnoredKeys(keys: Array<string>): Array<string>
    public static getIgnoredKeys(param1: string | Array<string>) {
        return (Array.isArray(param1) ? param1 : [param1]).map((key) => `^(?:(?:\\w+.)*(?:\\d+).)*${key}`);
    }

    public getData(): any
    public getData(path: string, alternative?: any): any
    public getData(options: { path: string; alternative?: any; }): any
    public getData(param1?: any, param2?: any) {
        const {path, alternative} = (typeof param1 === "string") ? {path: param1, alternative: param2} : param1 ?? {};

        return ObjectManager.on(this.data).get(path, alternative);
    }

    public setData(data: Record<string, any>, ...params: Array<any>): DataManager
    public setData(path: string, value: any, ...params: Array<any>): DataManager
    public setData(param1: unknown, param2: any, ...params: Array<any>) {
        if (typeof param1 === "string") {
            this.localWrite(ObjectManager.on(this.data).set({path: param1, value: param2}));
        } else {
            this.localWrite(param1 as Record<string, any>);
        }

        return this;
    }

    public replaceData(data?: Record<string, any> | Array<any>, ...params: Array<any>) {
        const data1 = this.initialize(data ?? (Array.isArray(this.data) ? [] : {}));
        const data2 = this.config?.beforeReset?.(data1) ?? data1;

        if (Array.isArray(this.data)) {
            this.data.length = 0;
        } else {
            for (const key in this.data) {
                delete this.data[key];
            }
        }

        this.setData(data2, ...params);

        return this;
    }

    private initialize<T extends Record<string, any> | Array<any>>(data: T): T {
        const defaultData1 = this.config?.defaultData ?? this.config?.getDefaultData;
        const defaultData = this.maybeFunction(defaultData1) ?? {};

        return Object.assign((Array.isArray(data) ? [] : {}), defaultData, data);
    }

    private maybeFunction(param: any, ...params: Array<any>) {
        return (typeof param === "function") ? param(...params) : param;
    }
}

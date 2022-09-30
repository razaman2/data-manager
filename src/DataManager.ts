import ObjectManager from "@razaman2/object-manager";
import DataClient from "./DataClient";

export default class DataManager {
    protected data: Record<string, any> = {};
    protected ignoredKeys: Array<string> = DataManager.getIgnoredKeys(["createdAt", "updatedAt"]);

    public constructor(protected config?: DataClient) {
        this.initialize(this.config);

        if (this.config?.getIgnoredKeys) {
            this.ignoredKeys = this.config.getIgnoredKeys(this.ignoredKeys);
        }
    }

    public static getIgnoredKeys(key: string): Array<string>
    public static getIgnoredKeys(keys: Array<string>): Array<string>
    public static getIgnoredKeys(param1: string | Array<string>) {
        return (Array.isArray(param1) ? param1 : [param1]).map((key) => `^(?:(?:\\w+.)*(?:\\d+).)*${key}`);
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
                    this.config?.getNotifications?.()?.emit?.(`localWrite.${eventPath}`, input.get(eventPath));
                    memo.push(eventPath);
                }

                return eventPath;
            }, "");
        }

        this.config?.getNotifications?.().emit("localWrite", data);

        if (this.config?.logging) {
            console.log(`%cSet ${this.config.name ?? this.constructor.name} Data:`, `color: ${this.config.color ?? "orange"};`, {
                storage: this,
                input: data,
                final: this.getData(),
            });
        }
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

    public replaceData(data?: Record<string, any>, ...params: Array<any>) {
        this.reset(this.data);

        this.initialize(this.config);

        if (data) {
            this.setData(data, ...params);
        }

        return this;
    }

    private reset(data: Record<string, any> | Array<any>) {
        Array.isArray(data) ? (data.length = 0) : Object.keys(data).forEach((key) => {
            delete data[key];
        });
    }

    private maybeFunction(param: any, ...params: Array<any>) {
        return (typeof param === "function") ? param(...params) : param;
    }

    private initialize(config?: DataClient) {
        const data = this.maybeFunction(config?.data) ?? this.data;
        const defaultData = this.maybeFunction(config?.getDefaultData) ?? this.data;

        this.data = Object.assign(data, defaultData, ObjectManager.on(data).clone());
    }
}

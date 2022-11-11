import ObjectManager from "@razaman2/object-manager";
import DataClient from "./DataClient";

export default class DataManager {
    protected data: Record<string, any> = {};
    protected ignoredKeys: Array<string> = ["createdAt", "updatedAt"];

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

    public localWrite(path: string, value: any): void
    public localWrite(data: Record<string, any>): void
    public localWrite<T, U>(param1: T, param2?: U) {
        const input = (typeof param1 === "string") ?
            (() => {
                const manager = ObjectManager.on({});
                manager.set({path: param1 as string, value: param2});

                return manager;
            })() : ObjectManager.on(param1 as Record<string, any>);

        const output = ObjectManager.on(this.getData());
        const cache: Array<string> = [];
        const paths = input.paths();

        const notifications = (this.config?.notifications ?? this.config?.getNotifications);

        while (paths.length) {
            const path = paths.shift()?.replace(RegExp(`^(${this.ignoredKeys.join("|")}).+`), ($0, $1) => $1) as string;

            if (!cache.includes(`*.${path}`)) {
                output.set(path, input.get(path));
                cache.push(`*.${path}`);
            }

            path.split(".").reduce((s1: string, s2: string) => {
                const eventPath = (s1 ? [s1, s2] : [s2]).join(".");

                if (!cache.includes(eventPath)) {
                    notifications?.().emit(`localWrite.${eventPath}`, input.get(eventPath));
                    cache.push(eventPath);
                }

                return eventPath;
            }, "");
        }

        notifications?.().emit("localWrite", input.get());

        if (this.config?.logging) {
            console.log(`%cSet ${this.config.name ?? this.constructor.name} Data:`, `color: ${this.config.color ?? "orange"};`, {
                storage: this,
                input: input.get(),
                final: this.getData(),
            });
        }
    }

    public getData(): any
    public getData(path: string, alternative?: any): any
    public getData(options: { path: string; alternative?: any; }): any
    public getData<T, U>(param1?: T, param2?: U) {
        const {path, alternative} = (typeof param1 === "string") ? {path: param1, alternative: param2} : param1 ?? {};

        return ObjectManager.on(this.data).get(path as string, alternative);
    }

    public setData(path: string, value: any, ...params: Array<any>): DataManager
    public setData(data: Record<string, any>, ...params: Array<any>): DataManager
    public setData<T, U, V>(param1: T, param2: U, ...params: Array<V>) {
        if (typeof param1 === "string") {
            this.localWrite(param1, param2);
        } else {
            this.localWrite(param1 as Record<string, any>);
        }

        return this;
    }

    public replaceData(data?: Record<string, any> | Array<any>, ...params: Array<any>) {
        const data1 = this.initialize(data ?? (Array.isArray(this.data) ? [] : {}));
        const data2 = this.config?.beforeReset?.(data1);

        if (data2) {
            this.data = data2;
        } else {
            if (Array.isArray(this.data)) {
                this.data.length = 0;
            } else {
                for (const key in this.data) {
                    delete this.data[key];
                }
            }
        }

        this.setData(data2 ?? data1, ...params);

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

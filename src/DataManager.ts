import ObjectManager from "@razaman2/object-manager";
import type DataClient from "./DataClient";

export default class DataManager {
    protected data: Record<string, any> = {};
    protected ignored: { keys: Array<string> } = {keys: []};

    public constructor(protected config?: DataClient) {
        const defaultData = this.maybeFunction((this.config?.defaultData ?? this.config?.getDefaultData));
        const defaultType = (Array.isArray(this.config?.data?.value ?? defaultData) ? [] : {});
        this.data = this.config?.data?.value ? this.config.data : {value: this.config?.data};

        this.data.value = Object.assign(defaultType, defaultData, this.data.value);
    }

    public getIgnoredKeys() {
        const handler = (this.config?.ignoredKeys ?? this.config?.getIgnoredKeys);

        if (typeof handler === "function") {
            return handler(this.ignored.keys);
        } else {
            return this.ignored.keys;
        }
    }

    public getData(): any
    public getData(path: string | number, alternative?: any): any
    public getData(options: { path: string | number; alternative?: any; }): any
    public getData(param1?: string | number | { path: string | number; alternative?: any; }, param2?: any) {
        const {path, alternative} = ((typeof param1 === "string") || (typeof param1 === "number")) ?
            {path: param1, alternative: param2} : (param1 ?? {});

        return ObjectManager.on(this.data.value).get(path!, alternative);
    }

    public setData(value: any): DataManager
    public setData(data: Record<string, any>, ...params: Array<any>): DataManager
    public setData(path: string | number, value: any, ...params: Array<any>): DataManager
    public setData(param1: any, param2?: any, ...params: Array<any>) {
        const input = ObjectManager.on(((typeof param1 === "object") && (param1 !== null)) ? param1 : {}, {
            paths: {
                full: true,
                test: (path) => {
                    return !this.getIgnoredKeys().find((item) => RegExp(item).test(path));
                }
            }
        });

        if ((typeof param1 === "string") || (typeof param1 === "number")) {
            if (arguments.length === 1) {
                input.set(param1);
            } else {
                input.set(param1, param2);
            }
        }

        const paths = input.paths();
        const output = ObjectManager.on(this.data.value);
        const before = ObjectManager.on(output.clone());
        const notifications = (this.config?.notifications ?? this.config?.getNotifications);

        if (paths.length === 0) {
            this.data.value = input.get();
        } else {
            paths.forEach((path) => {
                // only set the current path if it doesn't match a upcoming similar path.
                // eg. don't set user if the paths contain user.something.
                if (!paths.find((item) => RegExp(`^${path}.`).test(item))) {
                    path ? output.set(path, input.get(path)) : output.set(input.get());
                }

                notifications?.().emit(`localWrite.${path}`, input.get(path), before.get(path));
            });
        }

        notifications?.().emit("localWrite", input.get(), before.get());

        if (this.config?.logging) {
            console.log(`%cSet ${this.config.name ?? this.constructor.name} Data:`, `color: ${this.config.color ?? "orange"};`, {
                storage: this,
                input: input.get(),
                final: this.getData(),
            });
        }

        return this;
    }

    public replaceData(data?: Record<string, any> | Array<any>, ...params: Array<any>) {
        const defaultData = this.maybeFunction((this.config?.defaultData ?? this.config?.getDefaultData));
        const defaultType = (Array.isArray(this.config?.data?.value ?? defaultData) ? [] : {});

        if (arguments.length > 0) {
            const replaceData = ((typeof data === "object") ? data : {'': data});

            this.setData(Object.assign(defaultType, defaultData, replaceData));
        } else {
            this.setData(Object.assign(defaultType, defaultData));
        }

        return this;
    }

    private maybeFunction(param: any, ...params: Array<any>) {
        return ((typeof param === "function") ? param(...params) : param);
    }
}

import ObjectManager from "@razaman2/object-manager";
import type DataClient from "./DataClient";

export default class DataManager {
    protected state: Record<string, any> = {};
    protected ignored: { keys: Array<string> } = {keys: []};

    get data() {
        return this.state;
    }

    // public constructor(protected config?: DataClient) {
    //     const defaultData = this.maybeFunction(this.config?.getDefaultData ?? this.config?.defaultData);
    //     const data = this.maybeFunction(this.config?.data) ?? defaultData;
    //     const defaultType = (Array.isArray((data.value ? data.value : data) ?? defaultData) ? [] : {});
    //
    //     this.state = data.value ? data : {value: data};
    //     this.state.value = Object.assign(defaultType, defaultData, this.state.value);
    // }

    public constructor(protected config?: DataClient) {
        const data = this.maybeFunction(this.config?.data);
        const defaultData = this.maybeFunction((this.config?.defaultData));
        const defaultType = (Array.isArray(data?.value ?? data ?? defaultData) ? [] : {});

        this.state = data?.value ? data : {value: data};
        this.state.value = Object.assign(defaultType, defaultData, this.state.value);
    }

    public getIgnoredKeys(): Array<string> {
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

        return ObjectManager.on(this.state.value).get(path!, alternative);
    }

    // protected parse(param1: any, param2: any) {
    //     const input = ObjectManager.on(((typeof param1 === "object") && (param1 !== null)) ? param1 : {}, {
    //         paths: {
    //             full: true,
    //             test: (path) => {
    //                 return !this.getIgnoredKeys().find((item) => RegExp(item).test(path));
    //             }
    //         }
    //     });
    //
    //     if ((typeof param1 === "string") || (typeof param1 === "number")) {
    //         if (arguments.length === 1) {
    //             input.set(param1);
    //         } else {
    //             input.set(param1, param2);
    //         }
    //     }
    //
    //     return input;
    // }

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
        const output = ObjectManager.on(this.state.value);
        const before = ObjectManager.on(output.clone());

        if (paths.length === 0) {
            this.state.value = input.get();
        } else {
            paths.forEach((path) => {
                // only set the current path if it doesn't match a upcoming similar path.
                // eg. don't set user if the paths contain user.something.
                if (!paths.find((item) => RegExp(`^${path}\\.`).test(item))) {
                    path ? output.set(path, input.get(path)) : output.set(input.get());
                }

                this.config?.notifications?.emit(`localWrite.${path}`, input.get(path), before.get(path));
            });
        }

        this.config?.notifications?.emit("localWrite", input.get(), before.get());

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

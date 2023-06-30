import ObjectManager from "../../object-manager";
import type DataClient from "./DataClient";

type GetOptions = {
    path?: string | number;
    alternative?: any;
}

export default class DataManager {
    protected ignored: {
        keys: Array<string>
    } = {keys: []};

    get data() {
        return this.config?.data;
    }

    private transform(data: any) {
        try {
            return /Array|Object/.test(data.constructor.name)
                ? data
                : {"": data};
        } catch (e) {
            return data;
        }
    };

    public constructor(protected config?: DataClient) {
        const data = this.transform(this.config?.data);
        const defaultData = this.transform(this.config?.defaultData);
        const defaultState = (Array.isArray(data ?? defaultData) ? [] : {});

        this.setData(Object.assign(defaultState, defaultData, data));
    }

    public getIgnoredKeys(): Array<string> {
        return this.config?.ignoredKeys?.(this.ignored.keys) ?? this.ignored.keys;
    }

    public getData(): any
    public getData(path: string | number): any
    public getData(path: string | number, alternative?: any): any
    public getData(options: GetOptions): any
    public getData(param1?: string | number | GetOptions, param2?: any) {
        const {path, alternative} = ((typeof param1 === "string") || (typeof param1 === "number"))
            ? {path: param1, alternative: param2}
            : (param1 ?? {});

        return ObjectManager.on(this.transform(this.config?.data)).get({path, alternative});
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

    public setData(value: any): this
    public setData(data: Record<string, any>): this
    public setData(path: string | number, value: any): this
    public setData(param1: any, param2?: any) {
        const object = /Array|Object/.test(param1.constructor.name);
        const data = this.transform((arguments.length === 1) ? param1 : (object ? param2 : {[param1]: param2}));

        const input = ObjectManager.on(data, {
            paths: {
                full: true,
                test: (path) => {
                    return !this.getIgnoredKeys().find((item) => {
                        return RegExp(item).test(path);
                    });
                },
            },
        });

        const paths = input.paths();
        const output = ObjectManager.on(this.transform(this.config?.data));
        const before = ObjectManager.on(output.clone());

        paths.forEach((path) => {
            // only set the current path if it doesn't match a upcoming similar path.
            // eg. don't set user if the paths contain user.something.
            if (!paths.find((item) => RegExp(`^${path}\\.`).test(item))) {
                output.set(path, input.get(path));
            }

            this.config?.notifications?.emit(`localWrite.${path}`, input.get(path), before.get(path));
        });

        this.config?.notifications?.emit("localWrite", input.get(), before.get());

        if (this.config?.logging) {
            console.log(`%cSet ${this.config.name ?? this.constructor.name} Data:`, `color: orange`, {
                storage: this,
                input: input.get(),
                final: this.getData(),
            });
        }

        return this;
    }

    public replaceData(data?: any) {
        for (const key in this.config?.data) {
            delete this.config?.data?.[key];
        }

        this.setData(Object.assign(this.transform(this.config?.defaultData), this.transform(data)));

        return this;
    }
}

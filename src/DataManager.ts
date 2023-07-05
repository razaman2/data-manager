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
        return DataManager.transform(this.config?.data ?? this.config?.defaultData);
    }

    public static transform(input: any) {
        try {
            return /Array|Object/.test(input.constructor.name)
                ? input
                : {"": input};
        } catch (e) {
            return input;
        }
    };

    protected transformed = (input: any) => {
        try {
            return input.hasOwnProperty("") ? input[""] : input;
        } catch (e) {
            return input;
        }
    };

    public constructor(protected config?: DataClient) {
        const defaultData = DataManager.transform(this.config?.defaultData);
        const defaultState = (Array.isArray(this.transformed(this.data)) ? [] : {});

        this.setData(Object.assign(defaultState, defaultData, this.data));
    }

    public getIgnoredKeys(): Array<string> {
        return this.config?.ignoredKeys?.(this.ignored.keys) ?? this.ignored.keys;
    }

    public getData(): any
    public getData(path: string | number): any
    public getData(path: string | number, alternative?: any): any
    public getData(options: GetOptions): any
    public getData(param1?: string | number | GetOptions, param2?: any) {
        const manager = ObjectManager.on(this.data);

        if (typeof param1 === "object") {
            return manager.get({path: param1.path, alternative: param1.alternative});
        } else {
            return manager.get(param1 as string | number, param2);
        }
    }

    public setData(value: any): this
    public setData(path: string | number | boolean, value: any): this
    public setData(...params: Array<any>) {
        const data = (arguments.length === 1)
            ? DataManager.transform(params[0].__data ?? params[0])
            : undefined;

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

        if (data === undefined) {
            input.set(params[0].__data ?? params[0], params[1]);
        }

        const paths = input.paths();
        const output = ObjectManager.on(this.data);
        const before = ObjectManager.on(params[0].__clone ?? output.clone());

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
            console.log(`%cSet ${this.config.name ?? this.constructor.name} Data:`, `color: ${params[0].__config?.color ?? "orange"}`, {
                storage: this,
                input: input.get(),
                final: this.getData(),
            });
        }

        return this;
    }

    public replaceData(data?: any) {
        const clone = ObjectManager.on(this.data).clone();

        for (const key in this.data) {
            delete this.data[key];
        }

        this.setData({
            __clone: clone,
            __data: Object.assign(this.data, DataManager.transform(data)),
            __config: {
                color: "yellow",
            },
        });

        return this;
    }
}

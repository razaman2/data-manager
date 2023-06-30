import ObjectManager from "@razaman2/object-manager";
import type DataClient from "./DataClient";

type GetOptions = {
    path?: string | number;
    alternative?: any;
}

export default class DataManager {
    protected state = {};

    protected ignored: {
        keys: Array<string>
    } = {keys: []};

    get data() {
        return DataManager.transform(this.config?.data ?? this.state);
    }

    public static transform(data: any) {
        try {
            return /Array|Object/.test(data.constructor.name)
                ? data
                : {"": data};
        } catch (e) {
            return data;
        }
    };

    public constructor(protected config?: DataClient) {
        const defaultData = DataManager.transform(this.config?.defaultData);
        const defaultState = (Array.isArray(this.data ?? defaultData) ? [] : {});

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
    public setData(value: Record<string, any>): this
    public setData(path: string | number, value: any): this
    public setData(param1: any, param2?: any) {
        const object = /Array|Object/.test(param1.constructor.name);
        const data = DataManager.transform((arguments.length === 1) ? param1 : (object ? param2 : {[param1]: param2}));

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
        const output = ObjectManager.on(this.data);
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
        for (const key in this.data) {
            delete this.data[key];
        }

        this.setData(Object.assign(DataManager.transform(this.config?.defaultData ?? this.data), DataManager.transform(data)));

        return this;
    }
}

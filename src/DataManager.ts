import ObjectManager from "@razaman2/object-manager";
import type DataClient from "./DataClient";
import {name, version} from "../package.json";

type GetOptions = {
    path?: string | number;
    alternative?: any;
}

export default class DataManager {
    protected paths: Record<string, any> = {};
    protected ignored: {keys: Array<string>} = {keys: []};
    protected build: {[key: string]: string} = {[name]: version};

    get data() {
        return DataManager.transform(this.config?.data ?? {});
        // return DataManager.transform(this.config?.data ?? this.config?.defaultData);
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
        const defaultType = (Array.isArray(this.transformed(this.data)) ? [] : {});

        console.log("default data:", defaultData);

        this.setData(Object.assign(defaultType, defaultData, this.data));
    }

    public getIgnoredKeys(): Array<string> {
        return (
            this.config?.ignoredKeys?.(this.ignored.keys)
            ?? this.ignored.keys
        );
    }

    public getIgnoredPaths() {

    }

    public getData(): any
    public getData(path: string | number): any
    public getData(path: string | number, alternative?: any): any
    public getData(options: GetOptions): any
    public getData(param1?: string | number | GetOptions, param2?: any) {
        const manager = ObjectManager.on(this.data);

        if (arguments.length === 0) {
            return manager.get();
        } else if (typeof param1 === "object") {
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
                    const ignored = this.config?.ignoredPaths?.(path, this.paths);

                    if (typeof ignored === "boolean") {
                        this.paths[path] = ignored;
                    }

                    return !(
                        this.paths[path]
                        || this.getIgnoredKeys().find((ignored) => RegExp(ignored).test(path))
                    );
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
                const data = input.get(path);

                output.set(path, data);
            }

            this.config?.notifications?.emit(`localWrite.${path}`, input.get(path), before.get(path), this);
        });

        this.config?.notifications?.emit("localWrite", input.get(), before.get(), this);

        if (this.config?.logging) {
            console.log(`%cSet ${this.config.name ?? this.constructor.name} Data:`, `color: ${params[0].__config?.color ?? "orange"}`, {
                storage: this,
                input: input.get(),
                final: this.getData(),
            });
        }

        return this;
    }

    public replaceData(add?: any, remove?: Array<string>) {
        const data = ObjectManager.on(this.data, {paths: {full: true}});
        const paths = remove ?? data.paths();
        const clone = data.clone();

        if (Array.isArray(this.data)) {
            this.data.length = 0;
        } else {
            while (paths.length) {
                const path = paths.shift();

                if (path || (path === "")) {
                    while (RegExp(`^${path}\\.`).test(`${paths[0]}`)) {
                        paths.shift();
                    }

                    data.set(path, undefined);
                }
            }
        }

        this.setData({
            __clone: clone,
            __data: Object.assign(
                (Array.isArray(this.data) ? [] : {}),
                DataManager.transform(this.config?.defaultData),
                DataManager.transform(add)),
            __config: {color: "yellow"},
        });

        return this;
    }
}

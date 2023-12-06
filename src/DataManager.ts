import ObjectManager from "@razaman2/object-manager";
import type {ReadOptions} from "@razaman2/object-manager";
import type DataClient from "./DataClient";
import {name, version} from "../package.json";

export default class DataManager {
    private readonly data;
    private readonly defaultData;
    protected ignored: Array<RegExp | string | ((path: string) => boolean)> = [];
    protected build = {[name]: version};

    get defaultType() {
        return Array.isArray(this.data) ? [] : {};
    }

    public static transform(input: any) {
        try {
            return /Array|Object/.test(input.constructor.name)
                ? input
                : {"": input};
        } catch (e) {
            return {"": input};
        }
    };

    public constructor(protected config: DataClient = {}) {
        this.data = this.config.hasOwnProperty("data")
            ? DataManager.transform(this.config.data)
            : Array.isArray(this.config.defaultData) ? [] : {};

        this.defaultData = this.config.hasOwnProperty("defaultData")
            ? DataManager.transform(this.config.defaultData)
            : this.config.hasOwnProperty("data")
                ? Array.isArray(this.data) ? [] : {}
                : {};

        this.setData(Object.assign(this.defaultType, this.defaultData, this.data));
    }

    protected getObjectManager(data: any) {
        return ObjectManager.on(data, {
            paths: {
                full: true,
                test: (path: string) => {
                    return !this.ignored.find((item) => {
                        return (typeof item === "function")
                            ? item(path)
                            : RegExp(item).test(path);
                    });
                },
            },
        });
    }

    public setIgnoredPath(match: string | RegExp | ((path: string) => boolean)): this
    public setIgnoredPath(matches: Array<string | RegExp | ((path: string) => boolean)>): this
    public setIgnoredPath(param1: string | RegExp | ((path: string) => boolean) | Array<string | RegExp | ((path: string) => boolean)>) {
        this.ignored = this.ignored.concat(Array.isArray(param1) ? param1 : [param1]);

        return this;
    }

    public getData(): any
    public getData(path: string | number): any
    public getData(path: string | number, alternative?: any): any
    public getData(options: ReadOptions): any
    public getData(...params: [(string | number | ReadOptions)?, any?]) {
        return this.getObjectManager(this.data).get(...params as []);
    }

    public setData(value: any): this
    public setData(path: string | number, value: any): this
    public setData(...params: [(string | number | any)?, any?]) {
        const data = (arguments.length === 1)
            ? DataManager.transform(params[0].__data ?? params[0])
            : undefined;

        const input = this.getObjectManager({}).copy((arguments.length === 1) ? data : {});

        if (data === undefined) {
            input.set((params[0].__data ?? params[0]), params[1]);
        }

        const paths = input.paths();
        const output = this.getObjectManager(this.data);
        const before = this.getObjectManager(params[0].__clone ?? output.clone());

        paths.forEach((path) => {
            // only set the current path if it doesn't match a upcoming similar path.
            // eg. don't set user if the paths contain user.something.
            if (!paths.find((item) => RegExp(`^${path}\\.`).test(item))) {
                const data = input.get(path);

                output.set(path, data);
            }

            this.config.notifications?.emit(`localWrite.${path}`, input.get(path), before.get(path), this);
        });

        this.config.notifications?.emit("localWrite", input.get(), before.get(), this);

        if (this.config.logging) {
            console.log(`%cSet ${this.config.name ?? this.constructor.name} Data:`, `color: ${params[0].__config?.color ?? "orange"}`, {
                storage: this,
                input: input.get(),
                final: this.getData(),
            });
        }

        return this;
    }

    public replaceData(add?: any, remove?: Array<string>) {
        const data = this.getObjectManager(this.data);
        const clone = data.clone();

        if (Array.isArray(this.data)) {
            data.unset(["${all}"]);
        } else {
            data.unset(remove ?? data.paths());
        }

        this.setData({
            __clone: clone,
            __data: Object.assign(
                this.defaultType,
                this.defaultData,
                arguments.length ? DataManager.transform(add) : {}),
            __config: {color: "yellow"},
        });

        return this;
    }
}

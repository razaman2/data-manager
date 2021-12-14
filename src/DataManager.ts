import ObjectManager
    from '@razaman2/object-manager';
import DataClient
    from './DataClient';

export default class DataManager {
    protected data: Record<string, any> = {};
    protected IGNORED_KEYS: Array<string> = ['^(?:(?:\\w+.)*(?:\\d+).)*createdAt', '^(?:(?:\\w+.)*(?:\\d+).)*updatedAt'];

    // added for backwards compatibility.
    protected object: DataClient;

    public constructor(protected config?: DataClient) {
        if (this.config?.getDefaultData) {
            this.data = (typeof this.config.getDefaultData === "function") ?
                this.config.getDefaultData() :
                this.config.getDefaultData;
        }

        if (this.config?.data) {
            this.data = Object.assign(this.data, (typeof this.config.data === "function") ?
                this.config.data() :
                this.config.data
            )
        }

        if (this.config?.getIgnoredKeys) {
            this.IGNORED_KEYS = this.config.getIgnoredKeys(this.IGNORED_KEYS);
        }

        // added for backwards compatibility
        this.object = this.config as DataClient;
    }

    public localWrite(data: Record<string, any>) {
        const memo: Array<string> = [];
        const input = ObjectManager.on(data);
        const output = ObjectManager.on(this.getData());
        const paths = input.paths();

        while (paths.length) {
            const path = paths.shift() as string;
            const pathOverride = this.IGNORED_KEYS.find((item) => RegExp(item).exec(path));
            const resolvedPath = (RegExp(`${pathOverride}`).exec(path)?.[0] ?? path);

            if (!memo.includes(`*.${resolvedPath}`)) {
                output.set(resolvedPath, input.get(resolvedPath));
                memo.push(`*.${resolvedPath}`);
            }

            path.split('.').reduce((path, item) => {
                const eventPath = (path ? [path, item] : [item]).join('.');

                if (!memo.includes(eventPath)) {
                    this.config?.getNotifications?.().emit?.(`localWrite.${eventPath}`, input.get(eventPath));
                    memo.push(eventPath);
                }

                return eventPath;
            }, '');
        }

        this.config?.getNotifications?.().emit?.('localWrite', data);

        if (this.config?.logging) {
            console.log(`%cSet ${this.config.name} Data:`, 'color: orange;', {
                component: this,
                input: data,
                final: this.getData()
            });
        }
    }

    public getData(path: string | { path?: string; alternative?: any; } = '', alternative?: any): any {
        const params = (typeof path === 'string') ? {
            path,
            alternative
        } : path;

        return ObjectManager.on(this.data).get(params);
    }

    public setData(data: Record<string, any>, ...params: Array<any>) {
        this.localWrite(data);

        return this;
    }

    public replaceData(data?: Record<string, any>) {
        if (this.config?.getDefaultData) {
            this.data = (typeof this.config.getDefaultData === 'function') ?
                this.config.getDefaultData() :
                this.config.getDefaultData;
        } else {
            this.data = {};
        }

        if (data) {
            this.setData(data);
        }

        return this;
    }
}

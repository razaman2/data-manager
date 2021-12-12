import ObjectManager
    from '@razaman2/object-manager';
import DataClient
    from './DataClient';

export default class DataManager {
    protected data: Record<string, any> = {};
    protected IGNORED_KEYS: Array<string> = ['(?:items.(\\d+).)*createdAt'];

    public constructor(protected object?: DataClient) {
        if (this.object?.getDefaultData) {
            this.data = (typeof this.object.getDefaultData === "function") ?
                this.object.getDefaultData() :
                this.object.getDefaultData;
        }

        if (this.object?.data) {
            this.data = Object.assign(this.data, (typeof this.object.data === "function") ?
                this.object.data() :
                this.object.data
            )
        }

        if (this.object?.getIgnoredKeys) {
            this.IGNORED_KEYS = this.object.getIgnoredKeys(this.IGNORED_KEYS);
        }
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
                    this.object?.getNotifications?.().emit?.(`localWrite.${eventPath}`, input.get(eventPath));
                    memo.push(eventPath);
                }

                return eventPath;
            }, '');
        }

        this.object?.getNotifications?.().emit?.('localWrite', data);

        if (this.object?.logging) {
            console.log(`%cSet ${this.object.name} Data:`, 'color: orange;', {
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
        if (this.object?.getDefaultData) {
            this.data = (typeof this.object.getDefaultData === 'function') ?
                this.object.getDefaultData() :
                this.object.getDefaultData;
        } else {
            this.data = {};
        }

        if (data) {
            this.setData(data);
        }

        return this;
    }
}

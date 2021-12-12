import ObjectManager from '@razaman2/object-manager';
export default class DataManager {
    config;
    data = {};
    IGNORED_KEYS = ['^(?:\\w+.(?:\\d+).)*createdAt', '^(?:\\w+.(?:\\d+).)*updatedAt'];
    constructor(config) {
        this.config = config;
        if (this.config?.getDefaultData) {
            this.data = (typeof this.config.getDefaultData === "function") ?
                this.config.getDefaultData() :
                this.config.getDefaultData;
        }
        if (this.config?.data) {
            this.data = Object.assign(this.data, (typeof this.config.data === "function") ?
                this.config.data() :
                this.config.data);
        }
        if (this.config?.getIgnoredKeys) {
            this.IGNORED_KEYS = this.config.getIgnoredKeys(this.IGNORED_KEYS);
        }
    }
    localWrite(data) {
        const memo = [];
        const input = ObjectManager.on(data);
        const output = ObjectManager.on(this.getData());
        const paths = input.paths();
        while (paths.length) {
            const path = paths.shift();
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
    getData(path = '', alternative) {
        const params = (typeof path === 'string') ? {
            path,
            alternative
        } : path;
        return ObjectManager.on(this.data).get(params);
    }
    setData(data, ...params) {
        this.localWrite(data);
        return this;
    }
    replaceData(data) {
        if (this.config?.getDefaultData) {
            this.data = (typeof this.config.getDefaultData === 'function') ?
                this.config.getDefaultData() :
                this.config.getDefaultData;
        }
        else {
            this.data = {};
        }
        if (data) {
            this.setData(data);
        }
        return this;
    }
}
//# sourceMappingURL=DataManager.js.map
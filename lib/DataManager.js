import ObjectManager from '@razaman2/object-manager';
export default class DataManager {
    object;
    data = {};
    IGNORED_KEYS = ['(?:items.(\\d+).)*createdAt'];
    constructor(object) {
        this.object = object;
        if (this.object?.getDefaultData) {
            this.data = (typeof this.object.getDefaultData === "function") ?
                this.object.getDefaultData() :
                this.object.getDefaultData;
        }
        if (this.object?.data) {
            this.data = Object.assign(this.data, (typeof this.object.data === "function") ?
                this.object.data() :
                this.object.data);
        }
        if (this.object?.getIgnoredKeys) {
            this.IGNORED_KEYS = this.object.getIgnoredKeys(this.IGNORED_KEYS);
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
        if (this.object?.getDefaultData) {
            this.data = (typeof this.object.getDefaultData === 'function') ?
                this.object.getDefaultData() :
                this.object.getDefaultData;
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
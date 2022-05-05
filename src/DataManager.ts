import ObjectManager from "@razaman2/object-manager";
import DataClient from "./DataClient";

export default class DataManager {
    protected data: Record<string, any> = {};
    protected IGNORED_KEYS: Array<string> = this.setIgnoredKeys(["createdAt", "updatedAt"]);
    
    // object added for backwards compatibility.
    protected object?: DataClient;
    protected config?: DataClient;
    
    public constructor(config?: DataClient) {
        this.initialize(config);
    }
    
    public initialize(config?: DataClient) {
        this.initializeDefaultData(config);
        this.initializeData(config);
        
        if (config?.getIgnoredKeys) {
            this.IGNORED_KEYS = config.getIgnoredKeys(this.IGNORED_KEYS);
        }
        
        this.config = config;
        
        // added for backwards compatibility
        this.object = this.config;
    }
    
    public setIgnoredKeys(keys: Array<string>) {
        return (Array.isArray(keys) ? keys : [keys]).map((key) => `^(?:(?:\\w+.)*(?:\\d+).)*${key}`);
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
            
            path.split(".").reduce((path, item) => {
                const eventPath = (path ? [path, item] : [item]).join(".");
                
                if (!memo.includes(eventPath)) {
                    this.config?.getNotifications?.()?.emit?.(`localWrite.${eventPath}`, input.get(eventPath));
                    memo.push(eventPath);
                }
                
                return eventPath;
            }, "");
        }
        
        this.config?.getNotifications?.()?.emit?.("localWrite", data);
        
        if (this.config?.logging) {
            console.log(`%cSet ${this.config.name} Data:`, "color: orange;", {
                component: this,
                input: data,
                final: this.getData(),
            });
        }
    }
    
    public getData(path: string | { path?: string; alternative?: any; } = "", alternative?: any): any {
        const params = (typeof path === "string") ? {
            path,
            alternative,
        } : path;
        
        return ObjectManager.on(this.data).get(params);
    }
    
    public setData(data: Record<string, any>, ...params: Array<any>) {
        this.localWrite(data);
        
        return this;
    }
    
    private initializeDefaultData(config?: DataClient) {
        console.log('OBJECT INITIALIZATION:', );
        if (config?.getDefaultData) {
            console.log('DEFAULT OBJECT:', );
            this.data = (typeof config.getDefaultData === "function") ?
                config.getDefaultData() :
                config.getDefaultData;
        } else {
            console.log('NEW OBJECT:', );
            this.data = {};
        }
    }
    
    private initializeData(config?: DataClient) {
        if (config?.data) {
            this.data = Object.assign(this.data, (typeof config.data === "function") ?
                config.data() :
                config.data,
            );
        }
    }
    
    public replaceData(data?: Record<string, any>, ...params: Array<any>) {
        this.initializeDefaultData(this.config);
        
        if (data) {
            this.setData(data, ...params);
        }
        
        return this;
    }
}

import ObjectManager from "@razaman2/object-manager";
import DataManager from "../../src/DataManager";

describe("Data Manager", () => {
    it("should replace array prop data with new value", () => {
        const data = new DataManager({
            logging: false,
            getIgnoredKeys(keys: Array<string>) {
                return keys.concat(["roles"]);
            },
        });

        data.setData({roles: ["super", "supervisor"]});

        expect(data.getData()).toEqual({roles: ["super", "supervisor"]});

        data.setData({roles: ["admin"]});

        expect(data.getData("roles")).toEqual(["admin"]);
    });

    it("should manage items", () => {
        const data = new DataManager({
            logging: false,
            // getIgnoredKeys(keys: Array<string>) {
            //     return keys.concat(['roles']);
            // }
        });

        // data.setData({
        //     createdAt: {
        //         minutes: 1,
        //         seconds: 2,
        //         toDate() {
        //
        //         }
        //     }
        // });

        data.setData({
            items: [
                {
                    createdAt: {
                        minutes: 1,
                        seconds: 2,
                        toDate: () => {
                        },
                    },
                },
                {
                    createdAt: {
                        minutes: 1,
                        seconds: 2,
                        toDate: () => {
                        },
                    },
                },
            ],
        });
    });

    it("should initialize object with data from the data prop", () => {
        const data1 = new DataManager({
            logging: false,
            data: () => ({name: "John Doe"}),
        });

        expect(data1.getData()).toEqual({name: "John Doe"});

        const data2 = new DataManager({
            logging: false,
            data: {name: "John Doe"},
        });

        expect(data2.getData()).toEqual({name: "John Doe"});
    });

    it("should initialize object with data from the getDefaultData prop", () => {
        const data1 = new DataManager({
            logging: false,
            getDefaultData: () => ({name: "Jane Doe"}),
        });

        expect(data1.getData()).toEqual({name: "Jane Doe"});

        const data2 = new DataManager({
            logging: false,
            getDefaultData: () => ({name: "Jane Doe"}),
        });

        expect(data2.getData()).toEqual({name: "Jane Doe"});
    });

    it("should merge data with getDefaultData when both are available and data should overwrite getDefaultData", () => {
        const data = {
            name: "data overwrite",
            weight: 240,
        };

        const defaultData = {
            name: "default data",
            age: 29,
        };

        const data1 = new DataManager({
            logging: false,
            data: () => data,
            getDefaultData: () => defaultData,
        });

        expect(data1.getData()).toEqual({
            name: "data overwrite",
            weight: 240,
            age: 29,
        });
    });

    it("should reset object data with default data", () => {
        const data = new DataManager({
            logging: false,
            getDefaultData: () => ({
                firstName: "John",
                lastName: "Doe",
                age: 29,
                weight: 240,
            }),
        });

        data.setData({
            address: {
                address1: "123 Main Street",
                zipcode: "12345",
            },
        });

        expect(data.getData()).toEqual({
            firstName: "John",
            lastName: "Doe",
            age: 29,
            weight: 240,
            address: {
                address1: "123 Main Street",
                zipcode: "12345",
            },
        });

        data.replaceData();

        expect(data.getData()).toEqual({
            firstName: "John",
            lastName: "Doe",
            age: 29,
            weight: 240,
        });
    });

    it("should maintain object reference after setting data", () => {
        const data = new DataManager({
            logging: false,
            getDefaultData: {name: "John Doe"},
        });

        expect(data.getData("name")).toBe("John Doe");

        const ref1 = data.getData();

        data.setData({name: "Jane Doe"});

        expect(ref1).toBe(data.getData());
        expect(data.getData("name")).toBe("Jane Doe");
    });

    it("should maintain object reference after replacing data", () => {
        const data = new DataManager({
            logging: false,
            getDefaultData: {name: "John Doe"},
        });

        expect(data.getData("name")).toBe("John Doe");

        const ref1 = data.getData();

        data.replaceData({name: "Jane Doe"});

        expect(data.getData("name")).toBe("Jane Doe");

        expect(ref1).toBe(data.getData());
    });

    it("data passed to replaceData should override default data", () => {
        const data = new DataManager({
            logging: false,
            defaultData: {name: "jane doe"},
            data: {age: 38, weight: 190},
        });

        expect(data.getData()).toEqual({
            age: 38,
            weight: 190,
            name: "jane doe",
        });

        data.replaceData({age: 18});

        expect(data.getData()).toEqual({
            name: "jane doe",
            age: 18,
        });
    });
});

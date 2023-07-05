import {describe, it, expect} from "vitest";
import DataManager from "../../src";
import ObjectManager from "@razaman2/object-manager";

describe("test", () => {
    it("one", () => {
        const data = {firstName: "j"};
        const defaultData = {firstName: "a", lastName: "b"};

        const manager = new DataManager({
            data,
            defaultData,
        });

        expect(manager.getData()).toEqual({firstName: "j", lastName: "b"});

        manager.replaceData();

        expect(manager.getData()).toEqual({firstName: "a", lastName: "b"});

        manager.replaceData({middleName: "c"});

        expect(manager.getData()).toEqual({firstName: "a", lastName: "b", middleName: "c"});
    });

    it("two", () => {
        const data = {"": 1};
        const defaultData = {"": 2};

        const manager1 = new DataManager({
            data,
            defaultData,
        });

        expect(manager1.getData()).toBe(1);

        manager1.replaceData();

        expect(manager1.getData()).toBe(2);
    });

    it("three", () => {
        const data = {"": 1};
        const defaultData = {"": 2};

        const manager1 = new DataManager({
            data,
            defaultData,
        });

        expect(manager1.getData()).toBe(1);

        manager1.replaceData();

        expect(manager1.getData()).toBe(2);

        manager1.replaceData(3);

        expect(manager1.getData()).toBe(3);
    });
});

describe("object-manager", () => {
    describe("get data", () => {
        it("can get primitive data", () => {
            const data = new DataManager({
                data: 0,
            });

            expect(data.getData()).toBe(0);
            expect(new DataManager().getData({})).toBeUndefined();
            expect(data.getData({path: ""})).toBe(0);
            expect(new DataManager().getData({alternative: 1})).toBe(1);
            expect(data.getData("")).toBe(0);
            expect(new DataManager().getData("", 1)).toBe(1);

            expect.assertions(6);
        });

        it("can get object data", () => {
            const data = new DataManager({
                data: {firstName: "jane", lastName: "doe"},
            });

            expect(data.getData()).toStrictEqual({firstName: "jane", lastName: "doe"});
            expect(data.getData({})).toBeUndefined();
            expect(data.getData({path: "firstName"})).toBe("jane");
            expect(data.getData({alternative: 1})).toBe(1);
            expect(data.getData("firstName")).toBe("jane");
            expect(data.getData("", 1)).toBe(1);

            expect.assertions(6);
        });
    });

    describe("initialize", () => {
        it("should initialize data as object", () => {
            expect(new DataManager().getData()).toStrictEqual({});

            expect(new DataManager({
                data: {},
            }).getData()).toStrictEqual({});

            expect(new DataManager({
                defaultData: {},
            }).getData()).toStrictEqual({});

            expect.assertions(3);
        });

        it("should initialize data as array", () => {
            expect(new DataManager({
                data: [],
            }).getData()).toStrictEqual([]);

            expect(new DataManager({
                defaultData: [],
            }).getData()).toStrictEqual([]);

            expect.assertions(2);
        });

        it("should initialize data as primitive", () => {
            expect(new DataManager({
                data: 0,
            }).getData()).toBe(0);

            expect(new DataManager({
                data: false,
            }).getData()).toBe(false);

            expect(new DataManager({
                data: "",
            }).getData()).toBe("");

            expect.assertions(3);
        });

        it("should initialize with primitive default data", () => {
            expect(new DataManager({
                defaultData: 0,
            }).getData()).toBe(0);

            expect(new DataManager({
                defaultData: false,
            }).getData()).toBe(false);

            expect(new DataManager({
                defaultData: "",
            }).getData()).toBe("");

            expect.assertions(3);
        });

        it("should initialize with default data", () => {
            expect(new DataManager({
                defaultData: {test1: true},
            }).getData()).toStrictEqual({test1: true});

            expect(new DataManager({
                data: {},
                defaultData: {test2: true},
            }).getData()).toStrictEqual({test2: true});

            expect(new DataManager({
                data: [],
                defaultData: ["test2"],
            }).getData()).toStrictEqual(["test2"]);

            expect.assertions(3);
        });

        it("should merge data with default data", () => {
            expect(new DataManager({
                data: {test1: true},
                defaultData: {test1Default: true},
            }).getData()).toStrictEqual({test1: true, test1Default: true});

            expect(new DataManager({
                data: ["test1"],
                defaultData: [, "test1Default"],
            }).getData()).toStrictEqual(["test1", "test1Default"]);

            expect.assertions(2);
        });

        it("should overwrite primitive default data", () => {
            expect(new DataManager({
                data: 1,
                defaultData: 0,
            }).getData()).toBe(1);

            expect(new DataManager({
                data: true,
                defaultData: false,
            }).getData()).toBe(true);

            expect(new DataManager({
                data: "test1",
                defaultData: "",
            }).getData()).toBe("test1");

            expect.assertions(3);
        });

        it("should overwrite default data with data", () => {
            expect(new DataManager({
                data: {test1: true, test1Default: false},
                defaultData: {test1Default: true},
            }).getData()).toStrictEqual({test1: true, test1Default: false});

            expect(new DataManager({
                data: ["test1Overwrite", "test1"],
                defaultData: ["test1Default"],
            }).getData()).toStrictEqual(["test1Overwrite", "test1"]);

            expect.assertions(2);
        });

        // it.only("should reset primitive", () => {
        //     const data = new DataManager({
        //         data: 0,
        //     });
        //
        //     data.replaceData()
        //
        //     expect(data.getData()).toBeUndefined();
        // });
    });

    describe("set data", () => {
        it("can set data", () => {
            const data = new DataManager({
                data: {},
            });

            data.setData({firstName: "jane"});
            data.setData({
                address: {
                    address1: "123 main street",
                },
            });

            console.log(data.getData());
        });
    });
});

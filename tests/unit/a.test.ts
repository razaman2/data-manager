import {describe, it, expect} from "vitest";
import DataManager from "../../src";

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

describe("real test", () => {
    it("should initialize data as object", () => {
        expect(new DataManager().getData()).toEqual({});

        expect(new DataManager({
            data: {},
        }).getData()).toEqual({});

        expect(new DataManager({
            data: {
                value: {},
            },
        }).getData()).toEqual({});

        expect.assertions(3);
    });

    it("should initialize data as array", () => {
        expect(new DataManager({
            data: [],
        }).getData()).toEqual([]);

        expect(new DataManager({
            data: {
                value: [],
            },
        }).getData()).toEqual([]);

        expect.assertions(2);
    });

    it("should initialize data as primitive", () => {
        expect(new DataManager({
            data: 0,
        }).getData()).toEqual(0);

        expect(new DataManager({
            data: false,
        }).getData()).toEqual(false);

        expect(new DataManager({
            data: "",
        }).getData()).toEqual("");

        expect(new DataManager({
            data: {
                value: 0,
            },
        }).getData()).toEqual(0);

        expect(new DataManager({
            data: {
                value: false,
            },
        }).getData()).toEqual(false);

        expect(new DataManager({
            data: {
                value: "",
            },
        }).getData()).toEqual("");

        expect(new DataManager({
            data: {
                value: 1,
            },
        }).getData()).toEqual(1);

        expect.assertions(7);
    });

    it("should initialize with primitive default data", () => {
        expect(new DataManager({
            defaultData: 0,
        }).getData()).toEqual(0);

        expect(new DataManager({
            defaultData: false,
        }).getData()).toEqual(false);

        expect(new DataManager({
            defaultData: "",
        }).getData()).toEqual("");

        expect.assertions(3);
    });

    it("should initialize with default data", () => {
        expect(new DataManager({
            defaultData: {test1: true},
        }).getData()).toEqual({test1: true});

        expect(new DataManager({
            data: {},
            defaultData: {test2: true},
        }).getData()).toEqual({test2: true});

        expect(new DataManager({
            data: [],
            defaultData: ["test2"],
        }).getData()).toEqual(["test2"]);

        expect(new DataManager({
            data: {
                value: {test3: true},
            },
        }).getData()).toEqual({test3: true});

        expect(new DataManager({
            data: {
                value: ["test3"],
            },
        }).getData()).toEqual(["test3"]);

        expect.assertions(5);
    });

    it("should merge data with default data", () => {
        expect(new DataManager({
            data: {test1: true},
            defaultData: {test1Default: true},
        }).getData()).toMatchObject({test1: true, test1Default: true});

        expect(new DataManager({
            data: {
                value: {test2: true},
            },
            defaultData: {test2Default: true},
        }).getData()).toMatchObject({test2: true, test2Default: true});

        expect.assertions(2);
    });

    it("should overwrite primitive default data", () => {
        expect(new DataManager({
            data: 1,
            defaultData: 0,
        }).getData()).toEqual(1);

        expect.assertions(1);
    });

    it("should overwrite default data with data", () => {
        expect(new DataManager({
            data: {test1: true, test1Default: false},
            defaultData: {test1Default: true},
        }).getData()).toMatchObject({test1: true, test1Default: false});

        expect(new DataManager({
            data: ["test1Overwrite", "test1"],
            defaultData: ["test1Default"],
        }).getData()).toMatchObject(["test1Overwrite", "test1"]);

        expect(new DataManager({
            data: {
                value: {test2: true, test2Default: false},
            },
            defaultData: {test2Default: true},
        }).getData()).toMatchObject({test2: true, test2Default: false});

        expect(new DataManager({
            data: {
                value: ["test3Overwrite", "test3"],
            },
            defaultData: ["test3Default"],
        }).getData()).toMatchObject(["test3Overwrite", "test3"]);

        expect.assertions(4);
    });
});

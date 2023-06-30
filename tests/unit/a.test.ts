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

it("data-manager test", () => {
    const data = new DataManager({
        data: {firstName: "Jane", lastName: "Doe"},
    });

    console.log(data.getData({alternative: 10}));
    console.log(data.getData({path: "firstName"}));
    console.log(data.getData("firstName"));
});

describe("real test", () => {
    it("should initialize data as object", () => {
        expect(new DataManager().getData()).toEqual({});

        expect(new DataManager({
            data: {},
        }).getData()).toEqual({});

        expect.assertions(2);
    });

    it("should initialize data as array", () => {
        expect(new DataManager({
            data: [],
        }).getData()).toEqual([]);

        expect.assertions(1);
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

        expect.assertions(3);
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

        expect.assertions(3);
    });

    it("should merge data with default data", () => {
        expect(new DataManager({
            data: {test1: true},
            defaultData: {test1Default: true},
        }).getData()).toMatchObject({test1: true, test1Default: true});

        expect.assertions(1);
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

        expect.assertions(2);
    });

    it.only("should reset primitive", () => {
        const data = new DataManager({
            data: 0,
        });

        data.replaceData()

        expect(data.getData()).toBeUndefined();
    });
});

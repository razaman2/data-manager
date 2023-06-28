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

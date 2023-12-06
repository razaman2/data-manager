import {describe, it, expect} from "vitest";
import DataManager from "../../src";

describe("set data on data manager", () => {
    it("should initialize with empty object", () => {
        const data1 = new DataManager();

        const data2 = new DataManager({
            data: {},
        });

        expect(data1.getData()).toEqual({});
        expect(data2.getData()).toEqual({});

        expect.assertions(2);
    });

    it("should initialize with empty array", () => {
        const data = new DataManager({
            data: [],
        });

        expect(data.getData()).toEqual([]);

        expect.assertions(1);
    });

    it("should initialize with primitives", () => {
        const primitives = [0, 1, true, false, "", " ", null, undefined];

        primitives.forEach((primitive) => {
            const data1 = new DataManager({
                data: primitive,
            });

            const data2 = new DataManager({
                defaultData: primitive,
            });

            console.log("my data:", {data1, data2});

            expect(data1.getData()).toBe(primitive);
            expect(data2.getData()).toBe(primitive);
        });

        expect.assertions(primitives.length * 2);
    });
});

import {describe, it, expect} from "vitest";
import DataManager from "../../src/index";
import ObjectManager from "../../../object-manager/src/index";

describe("set data on data manager", () => {
    it("should initialize with empty object", () => {
        const manager1 = new DataManager();

        const manager2 = new DataManager({
            data: {},
        });

        expect(manager1.getData()).toEqual({});
        expect(manager2.getData()).toEqual({});

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
            const data = new DataManager({
                data: primitive,
            });

            expect(data.getData()).toBe(primitive);
        });

        expect.assertions(primitives.length);
    });
});

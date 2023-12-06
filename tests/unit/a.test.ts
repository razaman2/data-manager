import {describe, it, expect} from "vitest";
import DataManager from "../../src";

describe("test", () => {
    it("one", () => {
        const test1 = {firstName: "j"};
        const test2 = {firstName: "a", lastName: "b"};

        const object = new DataManager({
            data: test1,
            defaultData: test2,
        });

        expect(object.getData()).toEqual({firstName: "j", lastName: "b"});

        object.replaceData();

        expect(object.getData()).toEqual({firstName: "a", lastName: "b"});

        object.replaceData({middleName: "c"});

        expect(object.getData()).toEqual({firstName: "a", lastName: "b", middleName: "c"});
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

    it("array", () => {
        const data = new DataManager({
            logging: true,
            data: [{name: "one"}, {name: "two"}, {name: "three"}],
        });

        data.replaceData([{name: "ten"}]);

        console.log(data.getData(), data.getData().length);
    });

    it("object", () => {
        const data = new DataManager({
            logging: true,
            data: {0: 2},
        });

        data.setData(5);

        data.replaceData();

        console.log(data.getData());
    });

    it("set as string", () => {
        expect(new DataManager().setData("one", 1).getData()).toEqual({one: 1});

        expect(new DataManager({
            data: {},
        }).setData("one", 1).getData()).toEqual({one: 1});

        expect(new DataManager({
            defaultData: {},
        }).setData("one", 1).getData()).toEqual({one: 1});

        expect(new DataManager().setData("one.two", 3).getData()).toEqual({one: {two: 3}});

        expect(new DataManager({
            data: {},
        }).setData("one.two", 3).getData()).toEqual({one: {two: 3}});

        expect(new DataManager({
            defaultData: {},
        }).setData("one.two", 3).getData()).toEqual({one: {two: 3}});

        expect.assertions(6);
    });

    it("should set object", () => {
        expect(new DataManager().setData({one: 1, two: 2}).getData()).toEqual({one: 1, two: 2});

        expect(new DataManager({
            data: {},
        }).setData({one: 1, two: 2}).getData()).toEqual({one: 1, two: 2});

        expect(new DataManager({
            defaultData: {},
        }).setData({one: 1, two: 2}).getData()).toEqual({one: 1, two: 2});

        expect.assertions(3);
    });

    it("should set array", () => {
        expect(new DataManager({
            data: [],
        }).setData(["one", "two"]).getData()).toEqual(["one", "two"]);

        expect(new DataManager({
            defaultData: [],
        }).setData(["one", "two"]).getData()).toEqual(["one", "two"]);

        expect.assertions(2);
    });
});

describe("object-manager", () => {
    describe("get data", () => {
        it("can get primitive data", () => {
            const data = new DataManager({
                data: 0,
            });

            expect(new DataManager().getData({})).toBeUndefined();
            expect(data.getData()).toBe(0);
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

            expect(data.getData({})).toBeUndefined();
            expect(data.getData()).toEqual({firstName: "jane", lastName: "doe"});
            expect(data.getData({path: "firstName"})).toBe("jane");
            expect(data.getData({alternative: 1})).toBe(1);
            expect(data.getData("firstName")).toBe("jane");
            expect(data.getData("", 1)).toBe(1);

            expect.assertions(6);
        });

        it("test", () => {
            const data = new DataManager();

            // data.setData({attached: []})
            data.setData({})

            console.log('output', data.getData())
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
            }).getData()).toEqual([]);

            expect(new DataManager({
                defaultData: [],
            }).getData()).toEqual([]);

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

        it("should reset primitive", () => {
            const tests = [0, 1, true, false, "", "string", null, undefined];

            tests.forEach((test) => {
                const data = new DataManager({
                    data: {"": test},
                });

                expect(data.getData()).toBe(test);

                data.replaceData();

                expect(data.getData()).toEqual({});
            });
        });
    });

    describe("set data", () => {
        it("can set data", () => {
            const data = new DataManager({
                data: {},
                ignoredPaths: () => {
                    return true;
                },
            });

            // data.setData({firstName: "jane"});
            // data.setData({
            //     address: {
            //         address1: "123 main street",
            //     },
            // });

            console.log(data.getData());
        });

        it("should ignore path", () => {
            const manager = new DataManager().setIgnoredPath("coords.lat");

            manager.setData({
                user: {
                    firstName: "john",
                    lastName: "doe",
                    roles: ["admin", "user"],
                    address: {
                        address1: "123 main street",
                        address2: "apt 1",
                        city: "new york",
                        state: "ny",
                        zip: "12345",
                        county: "middlesex",
                        country: "usa",
                        coords: {
                            lat: 123,
                            lng: 456,
                        },
                    },
                },
            });

            console.log(manager.getData());
        });

        // it.only("test", () => {
        //     const data = new DataManager().setData({name: "john doe"});
        //
        //     data.setData(undefined)
        //
        //     console.log(data)
        // });
    });
});

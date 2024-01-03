import {describe, it, expect} from "vitest";
import EventEmitter from "@razaman2/event-emitter";
import DataManager from "../../src";

describe("Data Manager", () => {
    it("should replace array prop data with new value", () => {
        const data = new DataManager().setIgnoredPath(/^roles\./);

        data.setData({roles: ["super", "supervisor"]});
        expect(data.getData()).toEqual({roles: ["super", "supervisor"]});

        data.setData({roles: ["admin"]});
        expect(data.getData("roles")).toEqual(["admin"]);

        expect.assertions(2);
    });

    it("should replace array prop data at root", () => {
        const data = new DataManager({
            data: [],
        });

        data.replaceData(["super", "supervisor"]);
        expect(data.getData()).toEqual(["super", "supervisor"]);

        data.replaceData(["admin"]);
        expect(data.getData()).toEqual(["admin"]);

        data.replaceData(["a", "b", "c"]);
        expect(data.getData()).toEqual(["a", "b", "c"]);
    });

    it("should append and replace array items", () => {
        const data = new DataManager({data: []});

        data.setData(["super", "supervisor"]);
        expect(data.getData()).toEqual(["super", "supervisor"]);

        data.setData(["admin"]);
        expect(data.getData()).toEqual(["admin", "supervisor"]);

        data.setData(["admin", , "tech"]);
        expect(data.getData()).toEqual(["admin", "supervisor", "tech"]);
    });

    it("should manage items", () => {
        const data = new DataManager().setIgnoredPath("roles");

        // data.setData({
        //     createdAt: {
        //         minutes: 1,
        //         seconds: 2,
        //         toDate() {}
        //     }
        // });

        data.setData({
            items: [
                {
                    createdAt: {
                        minutes: 1,
                        seconds: 2,
                        toDate: () => {},
                    },
                },
                {
                    createdAt: {
                        minutes: 1,
                        seconds: 2,
                        toDate: () => {},
                    },
                },
            ],
        });
    });

    it("should initialize object with data from the data prop", () => {
        const data1 = new DataManager({
            data: {name: "John Doe"},
        });

        expect(data1.getData()).toEqual({name: "John Doe"});

        const data2 = new DataManager({
            data: {name: "John Doe"},
        });

        expect(data2.getData()).toEqual({name: "John Doe"});
    });

    it("should initialize object with data from the getDefaultData prop", () => {
        const data1 = new DataManager({
            defaultData: {name: "Jane Doe"},
        });

        expect(data1.getData()).toEqual({name: "Jane Doe"});

        const data2 = new DataManager({
            defaultData: {name: "Jane Doe"},
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
            data,
            defaultData,
        });

        expect(data1.getData()).toEqual({
            name: "data overwrite",
            weight: 240,
            age: 29,
        });
    });

    it("should reset object data with default data", () => {
        const data = new DataManager({
            defaultData: {
                firstName: "John",
                lastName: "Doe",
                age: 29,
                weight: 240,
            },
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
            defaultData: {name: "John Doe"},
        });

        expect(data.getData("name")).toEqual("John Doe");

        const ref1 = data.getData();

        data.setData({name: "Jane Doe"});

        expect(ref1).toBe(data.getData());

        expect(data.getData("name")).toEqual("Jane Doe");
    });

    it("data passed to replaceData should override default data", () => {
        const data = new DataManager({
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

    it("should set data from path", () => {
        const data = new DataManager();

        data.setData("user.firstName", "John");
        data.setData("user.lastName", "Doe");
        data.setData("user.weight", 240);
        data.setData("user.age", 29);
        data.setData("user.role.0", "super");
        data.setData("user.role.1", "supervisor");
        data.setData("address.address1", "123 Main Street");
        data.setData("address.address2", "Apt 1");
        data.setData("address.coords.lat", 123);
        data.setData("address.coords.lng", 456);

        console.log("log me:", data.getData());

        expect(data.getData()).toEqual({
            user: {
                firstName: "John",
                lastName: "Doe",
                weight: 240,
                age: 29,
                role: ["super", "supervisor"],
            },
            address: {
                address1: "123 Main Street",
                address2: "Apt 1",
                coords: {
                    lat: 123,
                    lng: 456,
                },
            },
        });
    });

    it("should set data from object", () => {
        const data = new DataManager();

        data.setData({
            user: {
                firstName: "John",
                lastName: "Doe",
                weight: 240,
                age: 29,
                role: ["super", "supervisor"],
            },
            address: {
                address1: "123 Main Street",
                address2: "Apt 1",
                coords: {
                    lat: 123,
                    lng: 456,
                },
            },
        });

        expect(data.getData()).toEqual({
            user: {
                firstName: "John",
                lastName: "Doe",
                weight: 240,
                age: 29,
                role: ["super", "supervisor"],
            },
            address: {
                address1: "123 Main Street",
                address2: "Apt 1",
                coords: {
                    lat: 123,
                    lng: 456,
                },
            },
        });
    });

    it("test setting data", () => {
        const notifications = new EventEmitter();

        const data = new DataManager({
            notifications,
        }).setIgnoredPath([/^video\./, /.+?\.roles/, /^belongsTo\./]);

        notifications.on("localWrite", (data: object) => {
            console.log("localWrite:", data);
        });

        notifications.on("localWrite.price", (price: number) => {
            console.log("localWrite.price:", price);
        });

        notifications.on("localWrite.video", (video: object) => {
            console.log("localWrite.video:", video);
        });

        data.setData({
            "belongsTo": [
                "kwI5G2sj3dDRlOtmBLKs purchases",
                "h9be5UnwdeH9iAmRHydW tickets",
                "kQqJLJLAycjJTnln6NDd companies",
                "06vM0NLPjy2BZpzkpS3r transactions",
                "taKK7WF46QbWiIabHC6hwUfJVtH3 users",
            ],
            "payment": {
                "status": "paid",
            },
            "type": "on_demand",
            "price": 299,
            "createdAt": {
                "seconds": 1665516439,
                "nanoseconds": 547000000,
            },
            "createdBy": "taKK7WF46QbWiIabHC6hwUfJVtH3",
            "id": "kwI5G2sj3dDRlOtmBLKs",
            "video": {
                "started": {
                    "seconds": 1667317870,
                    "nanoseconds": 116000000,
                },
                "itslGQn0SYj5ay1teXsD": {
                    "elapsed": 558.32053,
                    "watched": 558.32053,
                    "closed": [
                        {
                            "datetime": {
                                "seconds": 1668173801,
                                "nanoseconds": 356000000,
                            },
                            "timestamp": 558.083655,
                        },
                    ],
                    "started": {
                        "seconds": 1668173783,
                        "nanoseconds": 995000000,
                    },
                    "paused": [
                        {
                            "datetime": {
                                "seconds": 1668173783,
                                "nanoseconds": 930000000,
                            },
                            "elapsed": 548.473837,
                            "timestamp": 548.473837,
                        },
                    ],
                },
                "6q3go2BLrrE4NijYes2J": {
                    "closed": [
                        {
                            "timestamp": 224.585764,
                            "datetime": {
                                "seconds": 1667317804,
                                "nanoseconds": 935000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1667317869,
                                "nanoseconds": 246000000,
                            },
                            "timestamp": 279.751272,
                        },
                        {
                            "timestamp": 234.410034,
                            "datetime": {
                                "seconds": 1667317884,
                                "nanoseconds": 319000000,
                            },
                        },
                        {
                            "timestamp": 243.164571,
                            "datetime": {
                                "seconds": 1668144934,
                                "nanoseconds": 671000000,
                            },
                        },
                    ],
                    "started": {
                        "seconds": 1667317579,
                        "nanoseconds": 172000000,
                    },
                    "elapsed": 241.273636,
                    "watched": 241.273636,
                },
                "lMrjEhgbDE77aHaVrM1A": {
                    "started": {
                        "seconds": 1668144937,
                        "nanoseconds": 650000000,
                    },
                    "watched": 19.869542,
                    "closed": [
                        {
                            "timestamp": 23.953153,
                            "datetime": {
                                "seconds": 1668144961,
                                "nanoseconds": 643000000,
                            },
                        },
                    ],
                    "elapsed": 19.869542,
                },
                "7BY87VMOn71kXj9sgP2m": {
                    "paused": [
                        {
                            "timestamp": 277.817715,
                            "datetime": {
                                "seconds": 1668108786,
                                "nanoseconds": 829000000,
                            },
                        },
                        {
                            "elapsed": 991.907583,
                            "datetime": {
                                "seconds": 1668118599,
                                "nanoseconds": 4000000,
                            },
                            "timestamp": 991.907583,
                        },
                        {
                            "elapsed": 991.907583,
                            "timestamp": 991.907583,
                            "datetime": {
                                "seconds": 1668119057,
                                "nanoseconds": 819000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1668135621,
                                "nanoseconds": 306000000,
                            },
                            "elapsed": 991.907583,
                            "timestamp": 991.907583,
                        },
                        {
                            "elapsed": 991.907583,
                            "timestamp": 991.907583,
                            "datetime": {
                                "seconds": 1668136693,
                                "nanoseconds": 377000000,
                            },
                        },
                        {
                            "timestamp": 991.907583,
                            "elapsed": 991.907583,
                            "datetime": {
                                "seconds": 1668137526,
                                "nanoseconds": 891000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1668139009,
                                "nanoseconds": 463000000,
                            },
                            "elapsed": 991.907583,
                            "timestamp": 991.907583,
                        },
                        {
                            "elapsed": 991.907583,
                            "timestamp": 991.907583,
                            "datetime": {
                                "seconds": 1668139185,
                                "nanoseconds": 263000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1668140965,
                                "nanoseconds": 323000000,
                            },
                            "timestamp": 991.907583,
                            "elapsed": 991.907583,
                        },
                        {
                            "timestamp": 991.907583,
                            "datetime": {
                                "seconds": 1668141925,
                                "nanoseconds": 326000000,
                            },
                            "elapsed": 991.907583,
                        },
                        {
                            "datetime": {
                                "seconds": 1668144781,
                                "nanoseconds": 523000000,
                            },
                            "elapsed": 991.907583,
                            "timestamp": 991.907583,
                        },
                        {
                            "elapsed": 43.795442,
                            "datetime": {
                                "seconds": 1668144848,
                                "nanoseconds": 816000000,
                            },
                            "timestamp": 43.795442,
                        },
                        {
                            "datetime": {
                                "seconds": 1668144856,
                                "nanoseconds": 735000000,
                            },
                            "elapsed": 791.868941,
                            "timestamp": 791.868941,
                        },
                        {
                            "datetime": {
                                "seconds": 1668144864,
                                "nanoseconds": 876000000,
                            },
                            "timestamp": 799.398115,
                            "elapsed": 799.398115,
                        },
                        {
                            "timestamp": 324.323004,
                            "elapsed": 324.323004,
                            "datetime": {
                                "seconds": 1668144877,
                                "nanoseconds": 967000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1668174886,
                                "nanoseconds": 917000000,
                            },
                            "elapsed": 290.006878,
                            "timestamp": 290.006878,
                        },
                    ],
                    "elapsed": 248.728238,
                    "ended": [
                        {
                            "timestamp": 991.907583,
                            "elapsed": 991.907583,
                            "watched": 991.907583,
                            "datetime": {
                                "seconds": 1668118599,
                                "nanoseconds": 11000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1668119057,
                                "nanoseconds": 823000000,
                            },
                            "timestamp": 991.907583,
                            "elapsed": 991.907583,
                            "watched": 991.907583,
                        },
                        {
                            "datetime": {
                                "seconds": 1668135621,
                                "nanoseconds": 314000000,
                            },
                            "watched": 991.907583,
                            "elapsed": 991.907583,
                            "timestamp": 991.907583,
                        },
                        {
                            "datetime": {
                                "seconds": 1668136693,
                                "nanoseconds": 384000000,
                            },
                            "timestamp": 991.907583,
                            "watched": 991.907583,
                            "elapsed": 991.907583,
                        },
                        {
                            "timestamp": 991.907583,
                            "elapsed": 991.907583,
                            "datetime": {
                                "seconds": 1668137526,
                                "nanoseconds": 910000000,
                            },
                            "watched": 991.907583,
                        },
                        {
                            "watched": 991.907583,
                            "datetime": {
                                "seconds": 1668139009,
                                "nanoseconds": 501000000,
                            },
                            "timestamp": 991.907583,
                            "elapsed": 991.907583,
                        },
                        {
                            "timestamp": 991.907583,
                            "datetime": {
                                "seconds": 1668139185,
                                "nanoseconds": 280000000,
                            },
                            "watched": 991.907583,
                            "elapsed": 991.907583,
                        },
                        {
                            "datetime": {
                                "seconds": 1668140965,
                                "nanoseconds": 348000000,
                            },
                            "elapsed": 991.907583,
                            "watched": 991.907583,
                            "timestamp": 991.907583,
                        },
                        {
                            "elapsed": 991.907583,
                            "datetime": {
                                "seconds": 1668141925,
                                "nanoseconds": 343000000,
                            },
                            "timestamp": 991.907583,
                            "watched": 991.907583,
                        },
                        {
                            "elapsed": 991.907583,
                            "watched": 991.907583,
                            "timestamp": 991.907583,
                            "datetime": {
                                "seconds": 1668144781,
                                "nanoseconds": 537000000,
                            },
                        },
                    ],
                    "started": {
                        "seconds": 1667314853,
                        "nanoseconds": 568000000,
                    },
                    "closed": [
                        {
                            "timestamp": 90.022458,
                            "datetime": {
                                "seconds": 1667314943,
                                "nanoseconds": 750000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1668108796,
                                "nanoseconds": 735000000,
                            },
                            "timestamp": 287.636461,
                        },
                        {
                            "timestamp": 277.817715,
                            "datetime": {
                                "seconds": 1668117508,
                                "nanoseconds": 712000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1668119086,
                                "nanoseconds": 336000000,
                            },
                            "timestamp": 7.936,
                        },
                        {
                            "timestamp": 991.907583,
                            "datetime": {
                                "seconds": 1668142646,
                                "nanoseconds": 778000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1668144888,
                                "nanoseconds": 178000000,
                            },
                            "timestamp": 334.119375,
                        },
                        {
                            "timestamp": 87.46717,
                            "datetime": {
                                "seconds": 1668144916,
                                "nanoseconds": 31000000,
                            },
                        },
                        {
                            "datetime": {
                                "seconds": 1668173750,
                                "nanoseconds": 302000000,
                            },
                            "timestamp": 97.267287,
                        },
                    ],
                    "watched": 991.907583,
                },
            },
            "user": [
                {
                    roles: ["super", "admin"],
                },
                {
                    roles: ["user", () => true],
                },
            ],
            "car": {
                roles: ["driver", () => true],
            },
        });
    });

    it("set string", () => {
        const data = new DataManager().setData("test", "test1");

        expect(data.getData("test")).toBe("test1");
    });

    it("set number", () => {
        const data = new DataManager().setData(0, "test1");

        expect(data.getData(0)).toBe("test1");
    });

    it("should broadcast events", () => {
        const notifications = new EventEmitter();

        const data = new DataManager({
            notifications,
        });

        const object: any = {
            user: {
                firstName: "John",
                lastName: "Doe",
                roles: ["super", "admin", "user"],
                children: [
                    {
                        firstName: "Foo",
                        lastName: "Bar",
                        roles: ["user"],
                    },
                ],
            },
        };

        notifications.on("localWrite.user", (after: any) => {
            expect(after).toEqual(object.user);
        });

        notifications.on("localWrite.user.firstName", (after: any) => {
            expect(after).toEqual(object.user.firstName);
        });

        notifications.on("localWrite.user.lastName", (after: any) => {
            expect(after).toEqual(object.user.lastName);
        });

        notifications.on("localWrite.user.roles", (after: any) => {
            expect(after).toEqual(object.user.roles);
        });

        notifications.on("localWrite.user.roles.0", (after: any) => {
            expect(after).toEqual(object.user.roles[0]);
        });

        notifications.on("localWrite.user.roles.1", (after: any) => {
            expect(after).toEqual(object.user.roles[1]);
        });

        notifications.on("localWrite.user.roles.2", (after: any) => {
            expect(after).toEqual(object.user.roles[2]);
        });

        notifications.on("localWrite.user.children", (after: any) => {
            expect(after).toEqual(object.user.children);
        });

        notifications.on("localWrite.user.children.0", (after: any) => {
            expect(after).toEqual(object.user.children[0]);
        });

        notifications.on("localWrite.user.children.0.firstName", (after: any) => {
            expect(after).toEqual(object.user.children[0].firstName);
        });

        notifications.on("localWrite.user.children.0.lastName", (after: any) => {
            expect(after).toEqual(object.user.children[0].lastName);
        });

        notifications.on("localWrite.user.children.0.roles", (after: any) => {
            expect(after).toEqual(object.user.children[0].roles);
        });

        notifications.on("localWrite.user.children.0.roles.0", (after: any) => {
            expect(after).toEqual(object.user.children[0].roles[0]);
        });

        notifications.on("localWrite", (after: any) => {
            expect(after).toEqual(object);
        });

        data.setData(object);

        expect.assertions(14);
    });

    it("should broadcast with data before and after", () => {
        const notifications = new EventEmitter();

        const before: any = {
            user: {
                firstName: "fn1",
                lastName: "ln1",
            },
        };

        const after: any = {
            user: {
                firstName: "fn2",
                lastName: "ln2",
                age: 1,
            },
        };

        const manager = new DataManager({
            data: before,
            notifications,
        });

        expect.assertions(8);

        notifications.on("localWrite.user.firstName", (a: any, b: any) => {
            expect(a).toEqual("fn2");
            expect(b).toEqual("fn1");
        });

        notifications.on("localWrite.user.lastName", (a: any, b: any) => {
            expect(a).toEqual("ln2");
            expect(b).toEqual("ln1");
        });

        notifications.on("localWrite.user.age", (a: any, b: any) => {
            expect(a).toEqual(1);
            expect(b).toBeUndefined();
        });

        notifications.on("localWrite", (a: any, b: any) => {
            expect(a).toEqual({
                user: {
                    firstName: "fn2",
                    lastName: "ln2",
                    age: 1,
                },
            });

            expect(b).toEqual({
                user: {
                    firstName: "fn1",
                    lastName: "ln1",
                },
            });
        });

        manager.setData(after);
    });

    it("should be able to set only value without path", () => {
        const data = new DataManager();

        data.setData("test1");
        expect(data.getData()).toBe("test1");

        data.setData("test2");
        expect(data.getData()).toBe("test2");
    });

    it("should set an array of objects", () => {
        // const data = new DataManager({
        //     data: {
        //         value: [{name: 'zero'}]
        //     }
        // });
        //
        // data.setData([{name: 'one'}, {name: 'two'}])
        //
        // expect(data.getData()).toEqual([
        //     {name: 'one'},
        //     {name: 'two'},
        // ]);

        console.log("as array:", new DataManager({
            data: {
                value: [{name: "one"}],
            },
        }).getData());
        // console.log('as object:', new DataManager({
        //     data: {
        //         value: {}
        //     }
        // }).getData())
    });

    it("should return alternative", () => {
        const data = new DataManager();

        expect(data.getData({alternative: 100})).toBe(100);
    });

    it("should handle circular dependency", () => {
        const address = {
            street1: "123 main st",
            street2: "apt 1",
            city: "old bridge",
            state: "nj",
            user: {},
        };

        const user = {
            firstName: "jane",
            lastName: "doe",
            address,
        };

        address.user = user;

        new DataManager({data: user});
        new DataManager({defaultData: user});
        new DataManager().setData(user);
        new DataManager().replaceData(user);
    });
});

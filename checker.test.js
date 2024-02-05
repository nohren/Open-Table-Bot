const { isSlotAvailable } = require("./checker.js");

const falseResponse = {"data":{"availability":[{"restaurantId":1779,"restaurantAvailabilityToken":"eyJ2IjoyLCJtIjowLCJwIjowLCJzIjowLCJuIjowfQ","availabilityDays":[{"noTimesReasons":["NoTimesExist"],"earlyCutoff":null,"sameDayCutoff":null,"dayOffset":0,"allowNextAvailable":true,"topExperience":null,"slots":[],"__typename":"AvailabilityDay"}],"__typename":"RestaurantAvailability"}]},"loading":false,"networkStatus":7}

const trueResponse = {
    "data": {
        "availability": [
            {
                "restaurantId": 1779,
                "restaurantAvailabilityToken": "eyJ2IjoyLCJtIjowLCJwIjowLCJzIjowLCJuIjowfQ",
                "availabilityDays": [
                    {
                        "noTimesReasons": [],
                        "earlyCutoff": null,
                        "sameDayCutoff": null,
                        "dayOffset": 0,
                        "allowNextAvailable": true,
                        "topExperience": null,
                        "slots": [
                            {
                                "isAvailable": false,
                                "__typename": "UnavailableSlot"
                            },
                            {
                                "isAvailable": false,
                                "__typename": "UnavailableSlot"
                            },
                            {
                                "isAvailable": false,
                                "__typename": "UnavailableSlot"
                            },
                            {
                                "isAvailable": true,
                                "timeOffsetMinutes": 60,
                                "slotHash": "451763209",
                                "pointsType": "Standard",
                                "pointsValue": 100,
                                "experienceIds": [],
                                "slotAvailabilityToken": "eyJ2IjoyLCJtIjowLCJwIjowLCJjIjo2LCJzIjowLCJuIjowfQ",
                                "attributes": [
                                    "default"
                                ],
                                "isMandatory": false,
                                "isMandatoryBySeating": [
                                    {
                                        "tableCategory": "default",
                                        "isMandatory": false,
                                        "__typename": "IsMandatoryBySeating"
                                    }
                                ],
                                "experiencesBySeating": [],
                                "redemptionTier": "DineAnywhere",
                                "type": "Standard",
                                "__typename": "AvailableSlot"
                            },
                            {
                                "isAvailable": true,
                                "timeOffsetMinutes": 150,
                                "slotHash": "1119796717",
                                "pointsType": "Standard",
                                "pointsValue": 100,
                                "experienceIds": [],
                                "slotAvailabilityToken": "eyJ2IjoyLCJtIjowLCJwIjowLCJjIjo2LCJzIjowLCJuIjowfQ",
                                "attributes": [
                                    "default"
                                ],
                                "isMandatory": false,
                                "isMandatoryBySeating": [
                                    {
                                        "tableCategory": "default",
                                        "isMandatory": false,
                                        "__typename": "IsMandatoryBySeating"
                                    }
                                ],
                                "experiencesBySeating": [],
                                "redemptionTier": "DineAnywhere",
                                "type": "Standard",
                                "__typename": "AvailableSlot"
                            }
                        ],
                        "__typename": "AvailabilityDay"
                    }
                ],
                "__typename": "RestaurantAvailability"
            }
        ]
    },
    "loading": false,
    "networkStatus": 7
}

describe('isSlotAvailable', () => {
    it('correctly says when its available', () => {
       expect(isSlotAvailable(trueResponse)).toBe(true);
    });

    it('correctly says when its not available', () => {
        expect(isSlotAvailable(falseResponse)).toBe(false);
     });
  });
/**
 * Script checks for availability then sends an email to logon and book.
 * 
 * TODO
 * command line customization on this script FOR DATE AND TIME
 * 
 * ADD DATE AVAILABLE TO EMAIL 
 *
 * scheduling this script
 * 
 * SCHEMA 
 * 
 * {
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
 */

/**
 * import packages
 */
require('dotenv').config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { timeEnd } = require('console');
const OAuth2 = google.auth.OAuth2;

const DATE = "2024-02-07"
const TIME = "18:30"

/**
 * define functions
 */

const isSlotAvailable = (data) => data?.data?.availability?.[0]?.availabilityDays?.[0]?.slots?.some(bucket => bucket?.isAvailable === true);

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });
  
  return transporter;
};

const sendEmail = async (emailOptions) => {
    const emailTransporter = await createTransporter();
    return emailTransporter.sendMail(emailOptions);
};


const checkOpenTable = (date, time) => {
  const cookie = "otuvid=08312C86-C4E2-4593-BD38-49A5C5149EC0; _slvddv=true; _slvlcl=en-US; _gcl_au=1.1.1983155013.1707099972; _gid=GA1.2.605806666.1707099972; _fbp=fb.1.1707099972265.1874364357903050; ha_userSession=lastModified=2024-02-01T18%3A07%3A49.000Z&origin=prod-rs; ftc=x=2024-02-05T06%3A02%3A51&px=1&c=1&pt1=1&pt2=1&er=0; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Feb+04+2024+21%3A02%3A52+GMT-0800+(Pacific+Standard+Time)&version=202311.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=98d369c8-0c87-4911-ba0b-7aab4132a5e0&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false; _ga=GA1.2.733815427.1707099972; _uetsid=eea47eb0c3cd11eeba411bd302f46100; _uetvid=eea4c5a0c3cd11ee903663af2d6b990e; _gat_UA-52354388-1=1; _ga_Y77FR7F6XF=GS1.1.1707116934.3.0.1707116934.0.0.0; ak_bmsc=C40013E8D10EDDF6B85C14EE9F727F93~000000000000000000000000000000~YAAQGi0+F7Txrl+NAQAA/jkZeBZm0Hcs3OU/XDW+zroLM17LPtWUchI/bCRdoVDOsG8WmuUR4nUM4InbPHrbTTFb1aABfpBZTatXcFkoCvSvuP+V+qW1dYqH+/tuV3fOrn96Pl2zdvXZv6w+gT9XoH8HK8uJSHafE/bEIgK5jLt/IZp2k5rBfE2ATzqw8tYkkiP9DUhtQiwJYCWqiiKWxovbQh+YJRO3u1y7g4f1rIoV9/osUmO5h3lfQt4ORqPqoA24mZXhm7I2E27XiBvA4i1sQVLpSYouEV84g05powJhPiTFKs3gPWdvehIQG8ORJ2F6amNNf9UYcwPwxap7QrmJsKIpnYhxjsHZvj4vK01uAINPgFNZT7zsWt+0kwtq7miYCg92AAaTWe7qwMg=; bm_sv=88C8756B7BFA520B6F05409FCD97F417~YAAQGi0+F3/yrl+NAQAA7z4ZeBaBrVR6HZW8SD10TvmRKc5j8hF3GuixieBnEsbsreWn9rJx4dxI4cNjnSExK4FBZpLr5AbOemZQIbXZMmY7CG5P3sHxgBG2O/igseppkSg2ELN+2ORY3yE6DyQfWB4l022sRv3Pkkm8BMa6T5uOvV2cZOVhoql8807PcJcvADcfdcDNTdsD+iZyoEoaEB0f9KOIaAfxIinV1sPOFl5Y87Gcxi1OxKg6iks0+KnKI29y~1; OT_dtp_values=covers=3&datetime=2024-02-07 18:30"
  const body = {
    "operationName": "RestaurantsAvailability",
    "variables": {
        "onlyPop": false,
        "forwardDays": 0,
        "requireTimes": false,
        "requireTypes": [
            "Standard",
            "Experience"
        ],
        "restaurantIds": [
            1779
        ],
        "date": date,
        "time": time,
        "partySize": 3,
        "databaseRegion": "EU",
        "restaurantAvailabilityTokens": [],
        "loyaltyRedemptionTiers": [],
        "attributionToken": "x=2024-02-05T06%3A02%3A51&px=1&c=1&pt1=1&pt2=1&er=0",
        "correlationId": "8eecbef2-08ff-4c96-bd05-068895d803d1"
    },
    "extensions": {
        "persistedQuery": {
            "version": 1,
            "sha256Hash": "2aee2372b4496d091f057a6004c6d79fbf01ffdc8faf13d3887703a1ba45a3b8"
        }
    }
  }
  fetch("https://www.opentable.com/dapi/fe/gql?optype=query&opname=RestaurantsAvailability", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "ot-page-group": "rest-profile",
      "ot-page-type": "restprofilepage",
      "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token": "defccee6-18aa-45de-b436-e602546d0a7e",
      "x-query-timeout": "5500",
      "cookie": cookie,
      "Referer": "https://www.opentable.com/house-of-prime-rib?corrid=8eecbef2-08ff-4c96-bd05-068895d803d1&p=3&sd=2024-02-07T18%3A30%3A00",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": JSON.stringify(body),
    "method": "POST"
   })
  .then(res => res.json())
  .then(res => {
    /**
     * check for slots
     */
    console.log("Checking availability")
    if (isSlotAvailable(res)) {
      //send email via google mail address
      sendEmail({
        subject: "Your reservation has availability.  Book at open table now!",
        text: "I am sending an email from nodemailer!",
        to: process.env.RECIEVER_EMAIL,
        from: process.env.SENDER_EMAIL
      })
      .then(res => console.log(res))
      .catch(e => console.log(e))
    } else {
      console.log("nothing available at this time slot")
    }
  })
}

checkOpenTable(DATE, TIME)
setInterval(() => checkOpenTable(DATE, TIME), 1000 * 60 * 3);

module.exports = {
  isSlotAvailable
}


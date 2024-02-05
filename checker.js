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
      "cookie": "otuvid=08312C86-C4E2-4593-BD38-49A5C5149EC0; _slvddv=true; _slvlcl=en-US; _gcl_au=1.1.1983155013.1707099972; _gid=GA1.2.605806666.1707099972; _fbp=fb.1.1707099972265.1874364357903050; OT-SessionId=d3f5ffe3-2075-4260-a42c-b3f8876c1deb; ha_userSession=lastModified=2024-02-01T18%3A07%3A49.000Z&origin=prod-rs; _slvs=2a411dd4-56db-452f-bf90-44dcc76e0866; bm_mi=795C2C1016ABAF6745C1A1AF11E8FB0D~YAAQGi0+F2cXlV+NAQAArsWldxbHg61IBikti1E4Ese2FakLrlOk6HqKCDP/gquk7muVj6W5ENa0K61SCiO2dCHJlLfMY7nCwVEo/Tp0aYRJIkwclZTXJ/ZYEVBObHrmjM5bDLrHiDQM23wXwatUHnzEMYdzuKCSIPoF00+KjuXGy39arysn+ZkeNC6hPSElXFU4zhn+b3xbORpQQWuIwcBlQko9RROUZUgc7KOtBg0t37XZ/o6d5TTSplJIYMyjNNySRGwKDf+kkDoD60SaI0VEPmY0oNWsoYI08WjivJrG6RTf79tcuiDU8Sr9LxpR+Zg=~1; ak_bmsc=2230D66B5AEBA08DEDED47923D4485FF~000000000000000000000000000000~YAAQGi0+F6UYlV+NAQAAB8uldxZvEd4doGZkkMLaFSuftn2h+uRdxMMs+ySo/mf5vRN/O90LBX2y57wIfswNCUeEwb83ScY6fOrZR0MuJrmXsfcigqZJEOi0V8WZK7cc7j5VrF4K7a7LdAtyzO6leabc/jvALpPpUb/F04WWt3G03DPT6j7bvqOSiPL/rn79hoYKSUJ24qRZY8NMR40aZPmWB/VFCM7E6yn1i3mQfzM0dMiW2wQXQVQLVmuDIHn/oQqV60/Ta6VrITNSS5OyElrSfkXY6Cdj23nsWqw2SzUZcth8TQ8Wwwi9TWMnjEpkIyJfivN2WcLXFqxS5Ny+Z09wI/H6DrcID2EzIEYFo+oAbCyjAJ8E22OO/nm5x6dtNEj6p8pDqdIyYkLbIdseO/HFMcrtzGJ3xcAKQVbjKCfn575kPkYl8omQYqlBS262wc9e9AIZJr5ZNJKjM7V+Ey6Mkcq8nTR+D++I2LO7/PiZv8bSTpDhIkK9VmLZFDQrh84n+cVGVgXF+OeHHBK+T1bgrkWXKiMb; ftc=x=2024-02-05T06%3A02%3A51&px=1&c=1&pt1=1&pt2=1&er=0; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Feb+04+2024+21%3A02%3A52+GMT-0800+(Pacific+Standard+Time)&version=202311.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=98d369c8-0c87-4911-ba0b-7aab4132a5e0&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false; _ga=GA1.2.733815427.1707099972; _uetsid=eea47eb0c3cd11eeba411bd302f46100; _uetvid=eea4c5a0c3cd11ee903663af2d6b990e; _gat_UA-52354388-1=1; OT-Session-Update-Date=1707109423; bm_sv=38E17EE1D5CA39E675EB433FC56AD47A~YAAQGi0+F3M9lV+NAQAAwpimdxaJxxSao2VB0+AuXWtMUrJ2ZJS3Y3U5NhgVN3s70i96CIhvGvT3P/nigx4VOyUsJ4XEXbrG9z4lhA+gqB/0YYsQFikAB1ltnsG13aO3yL+oNHchg2RXZfDoVbe1l75fFSJ9zHp1ffyWi9pz7991oHMkAOWUV/HKZOrhlxxNYGJDroxhhocsjsL++NHyw0uhpPB6JKTCVO5YU3mOG34WSKRp0YCoZN11MTidt2cqAHy1Mg==~1; _ga_Y77FR7F6XF=GS1.1.1707108721.2.1.1707109431.0.0.0; OT_dtp_values=covers=3&datetime=2024-02-07 18:30",
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


# Open-Table-Bot

A bot that enables last minute OpenTable reservations for hard to get restaurants. Last minute cancellations are a statistical inevitability. This bot increases the chances those resources will re-allocate to you.

|               🚀               |                🌟                |
| :----------------------------: | :------------------------------: |
| ![email](images/IMG_4209.jpeg) | ![success](images/IMG_4210.jpeg) |

|      ⛔ because nope ⛔      |
| :--------------------------: |
| ![nope](images/img_nope.png) |

## Overview

\*\* Note - OpenTable has their own notification system "Notify me". You need to log in and register with them. In my experience, I have pulled reservations using this agent without ever being notifyed via their system. I'm not sure their checking frequency, but I know mine.

This bot runs in a tab and checks for availability. Once it finds availability it will attempt to book. It will also send an email for you to book, in case auto booking fails.

Checking frequency can be fine tuned. Beware of checking < 30 seconds. That seems to get you blocked.

## Install

- clone the repo
- npm install
- create a .env file in the project root. Add the following.

```
SENDER_EMAIL=<sender email>
RECIEVER_EMAIL=<reciever email>
APP_PASSWORD=<google app password>
```

## Set up gmail permissions for sending via server

#### Create a google account app password

- [Create and manage your app passwords](https://myaccount.google.com/apppasswords)
- name it whatever you want. Make sure to copy the pass phrase and add it to your .env file APP_PASSWORD field.
- Make sure to add gmails to SENDER_EMAIL and RECIEVER_EMAIL. I just used my gmail for both. I send email to myself.

#### Lower security app (skip this step if above works)

- You can configure your Gmail account to allow less secure apps [here](https://www.google.com/settings/security/lesssecureapps).
  - reference - https://nodemailer.com/usage/using-gmail/
  - change auth to just use username and password. I have not tried this and cannot guarantee it works.

## Running the program

- At the project root, `npm run server`
- In the browser install tampermonkey extension. You can find it in chrome as an extension.
- Copy the openTableBot.js script code and paste it into a new tampermonkey script located in the browser extension.
- Navigate to https://www.opentable.com/ and select a date, time and restaurant.
- You should see tampermonkey running and a green Agent running on the top of the page
- You can see it run in the console. Make sure to plug in your laptop and use your laptop as a server agent while you are out doing other things.

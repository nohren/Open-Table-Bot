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

## Set up a local server to send you email notifications via your gmail account

### Install

- clone the repo
- npm install
- create a .env file in the project root. Add the following.

```
SENDER_EMAIL=<sender email>
RECIEVER_EMAIL=<reciever email>
APP_PASSWORD=<google app password>
```

#### Create a google account app password

- [Create and manage your app passwords](https://myaccount.google.com/apppasswords)
- name it whatever you want. Make sure to copy the pass phrase and add it to your .env file APP_PASSWORD field.
- Make sure to add gmails to SENDER_EMAIL and RECIEVER_EMAIL. I just used my gmail for both. I send email to myself.

#### Lower security app (skip this step if above works)

- You can configure your Gmail account to allow less secure apps [here](https://www.google.com/settings/security/lesssecureapps).
  - reference - https://nodemailer.com/usage/using-gmail/
  - change auth to just use username and password. I have not tried this and cannot guarantee it works.

## Running the program

- To the run the mail server, at the project root, `npm run server`
- In the browser install tampermonkey extension. You can find it in chrome extensions.
- Copy the openTableBot.js script code and paste it into a new tampermonkey script in the extension.
- Navigate to https://www.opentable.com/
- Log into your account
- Select a date, time and restaurant. Click search.
- You should be directed to the restaurants open table page for the desired time / date and see the "Agent running" in green at the top of the page. This is the page that it works on!
- You can right click on the page and click inspect. In the console, you can see it running.
- Make sure to plug in your laptop and not let it go to sleep so you can go out and do other things.

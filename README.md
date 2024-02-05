# Open-Table-Bot
A bot that notifies you of dinner reservation availability

## Install
- clone the repo
- npm install
- create a .env file in the project root. Add the following.

```
SENDER_EMAIL=<sender email>
RECIEVER_EMAIL=<reciever email>
REFRESH_TOKEN=<refresh token>
CLIENT_SECRET=<client secret>
CLIENT_ID=<client id>
  ```

- Setting up gmail forwarding
  - login to your google cloud console
  - create a project
  - in credentials select create credentials and select a web client. Make sure `https://developers.google.com/oauthplayground` is set as the authorized redirect uri.
  -  Add client id and secret to .env
  -  navigate in browser to https://developers.google.com/oauthplayground/
  -  In select and authorized scroll down to Gmail API v1, click it and then click the https://mail.google.com/.  You should see a check mark appear beside it.
  -  click the settings top right button on the page and click use own OAuth credentials.
  -  Fill in client and secret and click authorize api's button.
  -  in exchange authorization for refresh token, copy the refresh token and paste it into the .env
  -  sender email is your email, reciever is wherever you want notification to go.
-  

## Running the program
- add date and time and checking frequency
- node checker.js
- watch it run, get notified via email for availabilities when people cancel

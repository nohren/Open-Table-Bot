// ==UserScript==
// @name         OpenTableBot
// @match        https://www.opentable.com/*
// @match        https://cdn.otstatic.com/maintenance/busy/index.html
// @version      0.1
// @description  get your reservation when others cancel
// @author       Nohren
// @grant        window.close
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(function () {
  "use strict";

  const minCheckTime = 30000;
  const maxCheckTime = 60000 * 1.6;

  async function sendEmail(message, href) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, href }),
    };
    try {
      const response = await fetch(
        "http://localhost:8080/reservation",
        options
      );
      !response.ok
        ? console.log("Email send failed")
        : console.log("Email send success!");
      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log("Failed to send data to server", e);
    }
  }

  function startCheckingAgain() {
    const randomInterval = randomIntervalFunc();
    console.log(
      `checking again in ${(randomInterval / 1000 / 60).toFixed(2)} minutes`
    );
    setTimeout(() => window.location.reload(), randomInterval);
  }

  function randomIntervalFunc() {
    return Math.floor(Math.max(minCheckTime, Math.random() * maxCheckTime));
  }

  //results are within 2.5 hrs of reservation
  async function checkForTimeSlots() {
    console.log("checking for time slots");
    let result;
    //wait for XHR to load
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const slots = document.querySelector("[data-test='time-slots']");
    for (const child of slots?.children ?? []) {
      if (child.firstChild.ariaLabel) {
        result = `Reservation found! - ${new Date()}`;
        const message = `Reservation available at ${child.firstChild.innerText}: ${child.firstChild.ariaLabel}`;
        sendEmail(message, child.firstChild.href);

        //attempt to reserve via bot
        child.firstChild.click();
      }
    }

    console.log(result ?? `no reservation found - ${new Date()}`);

    // check again in next interval if no result
    if (!result) {
       try {
        startCheckingAgain();
       } catch (error) {
        console.error("Error while restarting the check:", error);
       }
    }
  }

  async function completeReservation() {
    console.log("booking page");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const completeReservationButton = document.querySelector(
      "[data-test='complete-reservation-button']"
    );
    if (completeReservationButton) {
      completeReservationButton.click();
    }
  }

 async function kickedOut() {
    const url = await GM.getValue("url", null);
    console.log('got kicked out. Will try again in 5 min')
    console.log(url)
    setTimeout(() => {
      window.location.assign(url)
    }, 1000 * 60 * 5)
 }

 function execute(func) {
     //somtimes user script is injected after the page is loaded, and sometimes before.
     if (document.readyState === "complete") {
          func();
     } else {
          window.onload = func;
     }
 }

  const el = document.createElement("div");
  el.style.position = "relative";
  el.style.textAlign = "center";
  el.style.fontWeight = "bold";
  el.style.fontSize = "xx-large";
  el.innerText = "🤖 Agent Running";
  el.style.backgroundColor = "lime";

  if (document.querySelector("[data-test='restaurant-profile-photo']") || document.querySelector("[data-test='icBell']")) {
    const url = window.location.href
    GM.setValue("url", url);
    console.log(`set url as ${url}`)
    execute(checkForTimeSlots)
    document.body.prepend(el);
    return
  }

  switch (window.location.pathname) {
    case "/maintenance/busy/index.html":
          console.log('kicked out');
          execute(kickedOut)
          break
    case "/booking/details":
          execute(completeReservation)
          break
    default:
      console.log('default case');
      el.innerText = "🤖 Armed";
      el.style.backgroundColor = "yellow";
  }

  document.body.prepend(el);
})();

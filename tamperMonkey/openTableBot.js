// ==UserScript==
// @name         OpenTableBot
// @match        https://www.opentable.com/*
// @version      0.1
// @description  get your reservation when others cancel
// @author       Nohren
// @grant        window.close
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// ==/UserScript==

(function () {
  "use strict";

  //check anytime between 30 seconds and 1.5 minutes
  const minCheckSeconds = 30000;
  const maxCheckSeconds = 60000 * 1.5;

  function sendEmail(message, href) {
    fetch("http://localhost:8080/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, href }),
    });
  }

  function startCheckingAgain() {
    const randomInterval = randomIntervalFunc();
    console.log(`checking again in ${(randomInterval/1000/60).toFixed(2)} minutes`)
    setTimeout(() => window.location.reload(), randomInterval);
  }

  //random check interval to avoid bot detection.
  function randomIntervalFunc() {
    return Math.floor(
      Math.max(minCheckSeconds, Math.random() * maxCheckSeconds)
    );
  }

  //results are within 2.5 hrs of reservation
  async function checkForTimeSlots() {
    //wait 5 seconds api data to return, taking 84ms on average
    await new Promise((res) => setTimeout(res, 5000));
    //check results for reservation
    let result;
    const slots = document.querySelector("[data-test='time-slots']");
    for (const child of slots.children) {
      if (child.firstChild.ariaLabel) {
        result = `Reservation found! - ${new Date()}`
        const message = `Reservation available at ${child.firstChild.innerText}: ${child.firstChild.ariaLabel}`;
        sendEmail(message, child.firstChild.href);
      }
    }

    // check again in next interval
    console.log(result ?? `no reservation found - ${new Date()}`)
    startCheckingAgain();
  }

  const el = document.createElement("div");
  el.innerText = "Bot running";
  el.style.position = "relative";
  el.style.width = "15%";
  el.style.backgroundColor = "lime";
  el.style.fontWeight = "bold";
  //bot goes to work automatically on the domain
  //and on page refresh
  checkForTimeSlots();

  document.body.prepend(el);
})();
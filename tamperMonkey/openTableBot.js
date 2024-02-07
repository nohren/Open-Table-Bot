// ==UserScript==
// @name         OpenTableBot
// @match        https://www.opentable.com/*
// @version      0.1
// @description  get your reservation when others cancel
// @author       Nohren
// ==/UserScript==

(function () {
  "use strict";

  //check anytime between 1 and 10 minutes
  const minCheckSeconds = 60000;
  const maxCheckSeconds = 600000;

  let botRunning = false;

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
    setTimeout(checkForTimeSlots, randomInterval());
  }

  //random check interval to avoid bot detection.
  function randomInterval() {
    return Math.floor(
      Math.max(minCheckSeconds, Math.random() * maxCheckSeconds)
    );
  }

  //results are within 2.5 hrs of reservation
  async function checkForTimeSlots() {
    //click button available?
    const clickButton = document.querySelector("[aria-label='Find a time']");
    if (clickButton) {
      clickButton.click();
      //wait for api to return, taking 84ms on average
      await new Promise((res) => setTimeout(res, 2900));
      //check results for reservation
      const slots = document.querySelector("[data-test='time-slots']");
      for (const child of slots.children) {
        if (child.firstChild.ariaLabel) {
          console.log("Reservation found!");
          const message = `Reservation available: ${child.firstChild.ariaLabel}`;
          sendEmail(message, child.firstChild.href);
          botRunning = false;
          return;
        }
      }
    } else {
      console.log(
        "no click button, open in a different browser or clear cookies / cache"
      );
      botRunning = false;
      return;
    }

    console.log("no reservation found, trying again...");
    startCheckingAgain();
  }

  //html to start bot on the page you want, once click button, bot goes to work
  const el = document.createElement("button");
  el.innerText = "Start Bot";
  el.id = "bot-start";
  el.style.position = "relative";
  el.style.width = "15%";
  el.style.backgroundColor = "lime";
  el.style.fontWeight = "bold";
  el.addEventListener("click", function () {
    if (!botRunning) {
      console.log("start bot");
      checkForTimeSlots();
      botRunning = true;
    }
  });

  document.body.prepend(el);
})();

// ==UserScript==
// @name         OpenTableBot
// @match        https://www.opentable.com/*
// @version      0.1
// @description  get your reservation when others cancel
// @author       Nohren
// @grant        window.close
// ==/UserScript==

(function () {
  "use strict";

  const minCheckTime = 20000;
  const maxCheckTime = 60000 * 1.2;

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
    for (const child of slots.children) {
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
      startCheckingAgain();
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

  const el = document.createElement("div");
  el.innerText = "🤖 Agent Running";
  el.style.position = "relative";
  el.style.textAlign = "center";
  el.style.backgroundColor = "lime";
  el.style.fontWeight = "bold";
  el.style.fontSize = "xx-large";
  document.body.prepend(el);

  if (window.location.pathname === "/booking/details") {
    //somtimes user script is injected after the page is loaded, and sometimes before.
    if (document.readyState === "complete") {
      completeReservation();
    } else {
      window.onload = completeReservation;
    }
  } else {
    //somtimes user script is injected after the page is loaded, and sometimes before.
    if (document.readyState === "complete") {
      checkForTimeSlots();
    } else {
      window.onload = checkForTimeSlots;
    }
  }
})();

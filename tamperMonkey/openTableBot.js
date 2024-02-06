// ==UserScript==
// @name         OpenTableBot
// @match        https://www.opentable.com/*
// @version      0.1
// @description  get your reservation when others cancel
// @author       Nohren
// @grant        window.close
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

(function () {
  "use strict";

  //check anytime between 1 and 10 minutes
  const minCheckSeconds = 60000;
  const maxCheckSeconds = 600000;
  let timeoutId;
  let isBotStarted = false;
  let isReservation = false;

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
    timeoutId = setTimeout(checkForTimeSlots, randomInterval());
  }

  //random check interval between min and max to avoid bot detection.
  function randomInterval() {
    return Math.floor(
      Math.max(minCheckSeconds, Math.random() * maxCheckSeconds)
    );
  }

  async function checkForTimeSlots() {
    //click button available?
    const clickButton = document.querySelector("[aria-label='Find a time']")
    if (clickButton) {
        clickButton.click();
        //wait for api to return, taking 84ms on average
        await new Promise((res) => setTimeout(res, 2500));
        //check for reservation
        const slots = $("[data-test='time-slots']")[0];
    
        for (const child of slots.children) {
          if (child.firstChild.ariaLabel) {
            console.log("reservation found!");
            const message = `Reservation available: ${child.firstChild.ariaLabel}`;
            sendEmail(message, child.firstChild.href);
            isReservation = true;
            isBotStarted = false;
            break;
          }
        }
    } else {
        const nextAvailable = document.querySelector("[data-test='multi-day-availability-button']");
        if (nextAvailable) {
            nextAvailable.click();
            await new Promise((res) => setTimeout(res, 2500));
            const container = document.querySelectorAll("[data-test='multi-day-timeslot-container']");
            //loop through container to match range within desired date and time
            for (const bucket of container) {
                console.log(bucket)
            }
            //close modal
            document.querySelector("[data-test='modal-close']").click();

        } else {
            console.log("page broken")
            return;
        }
    }
    
    if (!isReservation) {
      console.log("no reservation found, try again");
      startCheckingAgain();
    }
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
    if (!isBotStarted) {
      console.log("start bot");
      checkForTimeSlots();
      isBotStarted = true;
    }
  });

  document.body.prepend(el);
})();
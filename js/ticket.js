"use strict";

// CIT2011 IA #2: Restore validated form information from this browser tab.
const STORAGE_KEY = "codingConfRegistrationV1";
let registration = null;
try {
  const savedRecord = sessionStorage.getItem(STORAGE_KEY);
  if (savedRecord) registration = JSON.parse(savedRecord);
} catch (error) {
  registration = null;
}

// Do not render a ticket when a visitor opens ticket.html without a record.
const validRecord = registration &&
  typeof registration.fullName === "string" && registration.fullName.trim() !== "" &&
  typeof registration.email === "string" &&
  /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(registration.email) &&
  typeof registration.github === "string" &&
  /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(registration.github) &&
  !registration.github.includes("--") &&
  typeof registration.avatarDataUrl === "string" &&
  /^data:image\/(?:jpeg|png);base64,/.test(registration.avatarDataUrl) &&
  typeof registration.ticketNumber === "string" &&
  /^#[0-9]{5}$/.test(registration.ticketNumber);

if (!validRecord) {
  window.location.replace("index.html");
} else {
  // textContent is used rather than innerHTML to show text safely.
  document.getElementById("confirmation-name").textContent = registration.fullName;
  document.getElementById("confirmation-email").textContent = registration.email;
  document.getElementById("ticket-name").textContent = registration.fullName;
  document.getElementById("ticket-avatar").src = registration.avatarDataUrl;
  document.getElementById("ticket-number").textContent = registration.ticketNumber;
  const githubLink = document.getElementById("ticket-github");
  githubLink.textContent = registration.github;
  githubLink.href = "https://github.com/" + registration.github.substring(1);
  document.body.classList.remove("is-loading");
}

"use strict";

// CIT2011 IA #2: Form validation and browser-side storage.
// This is a learning demo: browser-side checks are not server-side security.
const form = document.getElementById("registration-form");
const fields = {
  name: document.getElementById("full-name"),
  email: document.getElementById("email"),
  github: document.getElementById("github"),
  avatar: document.getElementById("avatar")
};
const submitButton = document.getElementById("submit-button");
const formStatus = document.getElementById("form-status");
const avatarPreview = document.getElementById("avatar-preview");
const uploadIcon = document.getElementById("upload-icon");
const uploadPrompt = document.getElementById("upload-prompt");
const uploadFilename = document.getElementById("upload-filename");
const STORAGE_KEY = "codingConfRegistrationV1";
const MAX_AVATAR_SIZE = 500 * 1024; // Strictly smaller than 500 KiB.

// Set an error beside the input and expose it to assistive technologies.
function setError(field, errorElementId, message) {
  document.getElementById(errorElementId).textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return message === "";
}

function checkName() {
  const name = fields.name.value.trim();
  return setError(fields.name, "name-error",
    name ? "" : "Enter your full name (spaces alone are not valid)."
  );
}

function checkEmail() {
  // Simple structural pattern matching user@domain.com; not mailbox verification.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return setError(fields.email, "email-error",
    emailPattern.test(fields.email.value.trim()) ? "" : "Enter a valid email, such as user@domain.com."
  );
}

function checkGitHub() {
  // GitHub allows letters, digits and interior hyphens in usernames.
  const handle = fields.github.value.trim();
  const handlePattern = /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
  const valid = handlePattern.test(handle) && !handle.includes("--");
  return setError(fields.github, "github-error",
    valid ? "" : "Begin with @ and use 1–39 letters, digits or interior hyphens."
  );
}

function checkAvatar() {
  const image = fields.avatar.files[0];
  let message = "";
  if (!image) {
    message = "Please select a profile image.";
  } else if (!["image/jpeg", "image/png"].includes(image.type)) {
    message = "Only JPEG or PNG files are allowed.";
  } else if (image.size === 0 || image.size >= MAX_AVATAR_SIZE) {
    message = "The image must be nonempty and smaller than 500 KB.";
  }
  return setError(fields.avatar, "avatar-error", message);
}

// Offer quick feedback on edited fields, not just after submission.
fields.name.addEventListener("blur", checkName);
fields.email.addEventListener("blur", checkEmail);
fields.github.addEventListener("blur", checkGitHub);
fields.name.addEventListener("input", () => {
  if (fields.name.getAttribute("aria-invalid") === "true") checkName();
});
fields.email.addEventListener("input", () => {
  if (fields.email.getAttribute("aria-invalid") === "true") checkEmail();
});
fields.github.addEventListener("input", () => {
  if (fields.github.getAttribute("aria-invalid") === "true") checkGitHub();
});

fields.avatar.addEventListener("change", () => {
  avatarPreview.hidden = true;
  avatarPreview.removeAttribute("src");
  uploadIcon.hidden = false;
  uploadPrompt.hidden = false;
  uploadFilename.textContent = "";
  if (!checkAvatar()) return;

  // Display the selected file without uploading it anywhere.
  const file = fields.avatar.files[0];
  const previewReader = new FileReader();
  previewReader.addEventListener("load", () => {
    avatarPreview.src = String(previewReader.result);
    avatarPreview.hidden = false;
    uploadIcon.hidden = true;
    uploadPrompt.hidden = true;
    uploadFilename.textContent = file.name;
  });
  previewReader.addEventListener("error", () => {
    setError(fields.avatar, "avatar-error", "This image could not be read. Try another file.");
  });
  previewReader.readAsDataURL(file);
});

// Prevent the browser's default form action and check each input.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  const checks = [
    [checkAvatar(), fields.avatar],
    [checkName(), fields.name],
    [checkEmail(), fields.email],
    [checkGitHub(), fields.github]
  ];
  const firstInvalid = checks.find((entry) => !entry[0]);
  if (firstInvalid) {
    formStatus.textContent = "Please correct the highlighted fields before continuing.";
    firstInvalid[1].focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Creating your ticket...";
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    // Store text and the JPEG/PNG data URL to populate the next HTML page.
    const record = {
      fullName: fields.name.value.trim().replace(/\s+/g, " "),
      email: fields.email.value.trim(),
      github: fields.github.value.trim(),
      avatarDataUrl: String(reader.result),
      ticketNumber: "#" + String(Math.floor(Math.random() * 100000)).padStart(5, "0")
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
      window.location.href = "ticket.html";
    } catch (error) {
      formStatus.textContent = "Browser storage is unavailable or full. Enable session storage or try a smaller image.";
      submitButton.disabled = false;
      submitButton.textContent = "Generate My Ticket";
    }
  });
  reader.addEventListener("error", () => {
    setError(fields.avatar, "avatar-error", "This image could not be read. Try another file.");
    formStatus.textContent = "Could not generate the ticket. Please try another image.";
    submitButton.disabled = false;
    submitButton.textContent = "Generate My Ticket";
  });
  reader.readAsDataURL(fields.avatar.files[0]);
});

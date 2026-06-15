import { t } from "./language.js?v=20260615-admin-observations";

const DISCLAIMER_SESSION_KEY = "seaweedTidePlannerMarineDisclaimerAccepted";

document.addEventListener("DOMContentLoaded", () => {
  ensureDisclaimerModal();
  bindFooterDisclaimerLinks();
  document.addEventListener("seaweed-language-change", refreshDisclaimerText);

  if (!hasAcceptedThisSession()) {
    openDisclaimer({ requireAcknowledgement: true });
  }
});

function ensureDisclaimerModal() {
  if (document.getElementById("marineDisclaimerModal")) return;

  const modal = document.createElement("section");
  modal.id = "marineDisclaimerModal";
  modal.className = "marine-disclaimer-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "marineDisclaimerTitle");
  modal.setAttribute("hidden", "");
  modal.innerHTML = `
    <div class="marine-disclaimer-panel" role="document">
      <p class="eyebrow" data-disclaimer-eyebrow>${t("disclaimer.eyebrow")}</p>
      <h2 id="marineDisclaimerTitle">${t("disclaimer.title")}</h2>
      <div class="marine-disclaimer-copy">
        ${t("disclaimer.body")}
      </div>
      <div class="marine-disclaimer-actions">
        <button type="button" id="marineDisclaimerAccept">${t("disclaimer.accept")}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector("#marineDisclaimerAccept").addEventListener("click", acknowledgeDisclaimer);
}

function refreshDisclaimerText() {
  const modal = document.getElementById("marineDisclaimerModal");
  if (!modal) return;

  const eyebrow = modal.querySelector("[data-disclaimer-eyebrow]");
  const title = modal.querySelector("#marineDisclaimerTitle");
  const copy = modal.querySelector(".marine-disclaimer-copy");
  const accept = modal.querySelector("#marineDisclaimerAccept");

  if (eyebrow) eyebrow.textContent = t("disclaimer.eyebrow");
  if (title) title.textContent = t("disclaimer.title");
  if (copy) copy.innerHTML = t("disclaimer.body");
  if (accept) accept.textContent = t("disclaimer.accept");
}

function bindFooterDisclaimerLinks() {
  document.querySelectorAll("[data-disclaimer-open]").forEach((button) => {
    button.addEventListener("click", () => openDisclaimer({ requireAcknowledgement: false }));
  });
}

function openDisclaimer() {
  const modal = document.getElementById("marineDisclaimerModal");
  const button = document.getElementById("marineDisclaimerAccept");
  if (!modal || !button) return;

  modal.hidden = false;
  document.body.classList.add("disclaimer-open");
  window.setTimeout(() => button.focus(), 0);
}

function acknowledgeDisclaimer() {
  try {
    window.sessionStorage.setItem(DISCLAIMER_SESSION_KEY, "true");
  } catch (error) {
    // If storage is unavailable, continue after the user has explicitly acknowledged this view.
  }

  const modal = document.getElementById("marineDisclaimerModal");
  if (modal) modal.hidden = true;
  document.body.classList.remove("disclaimer-open");
}

function hasAcceptedThisSession() {
  try {
    return window.sessionStorage.getItem(DISCLAIMER_SESSION_KEY) === "true";
  } catch (error) {
    return false;
  }
}

//JavaScript for form validation + lightbox gallery 
function onOnce(target, type, fn) {
  const wrapped = function (e) {
    fn(e);
    target.removeEventListener(type, wrapped);
  };
  target.addEventListener(type, wrapped);
}

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------
     Form validation enquiry and contact form
     ------------------------- */
  const forms = document.querySelectorAll("form");
  forms.forEach(form => {
    // only attach once
    if (form.dataset.validationAttached === "true") return;
    form.dataset.validationAttached = "true";

    form.addEventListener("submit", event => {
      // gather inputs (exclude buttons)
      const inputs = Array.from(form.querySelectorAll("input, textarea, select"))
        .filter(i => i.type !== "submit" && i.type !== "button" && i.type !== "hidden");

      let valid = true;
      // remove previous inline errors
      inputs.forEach(i => {
        i.classList.remove("error");
        const msg = i.parentElement && i.parentElement.querySelector(".input-error-message");
        if (msg) msg.remove();
      });

      inputs.forEach(input => {
        const val = (input.value || "").trim();
        const isRequired = input.hasAttribute("required") || input.classList.contains("required");
        if (isRequired && !val) {
          valid = false;
          input.classList.add("error");
          const err = document.createElement("div");
          err.className = "input-error-message";
          err.textContent = "This field is required.";
          if (input.parentElement) input.parentElement.appendChild(err);
        } else if (input.type === "email" && val) {
          // email check for inputted email
          const emailRx = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
          if (!emailRx.test(val)) {
            valid = false;
            input.classList.add("error");
            const err = document.createElement("div");
            err.className = "input-error-message";
            err.textContent = "Please enter a valid email address.";
            if (input.parentElement) input.parentElement.appendChild(err);
          }
        }
      });

      if (!valid) {
        event.preventDefault();
        // Focus first invalid field
        const first = form.querySelector(".error");
        if (first) first.focus();
      }
      
    });
  });


  /* -------------------------
     Lightbox gallery 
     ------------------------- */
  document.addEventListener("click", function (e) {
    const target = e.target;
    // match <img class="lightbox-img"> OR elements with data-lightbox attribute
    if (target && (target.matches && (target.matches("img.lightbox-img") || target.closest("[data-lightbox]")))) {
      // Find the image element that was clicked
      const imgEl = target.matches("img.lightbox-img") ? target : target.closest("[data-lightbox]");

      // source for full-size image: prefer data-full / data-src / href (if <a>) / src
      let src = imgEl.dataset.full || imgEl.dataset.src || imgEl.getAttribute("href") || imgEl.src || imgEl.getAttribute("data-lightbox-src");
      if (!src) return;

      // If an overlay already exists, remove it first
      const existing = document.querySelector(".lightbox-overlay");
      if (existing) existing.remove();

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "lightbox-overlay";
      overlay.tabIndex = -1; // allow focus for escape handling

      // Create centered container for image (so clicking outside closes)
      const container = document.createElement("div");
      container.className = "lightbox-container";

      const img = document.createElement("img");
      img.className = "lightbox-popup";
      img.src = src;
      img.alt = imgEl.alt || "";

      // Append
      container.appendChild(img);
      overlay.appendChild(container);
      document.body.appendChild(overlay);

      // Prevent scrolling of body while open
      document.documentElement.classList.add("lightbox-open");
      document.body.classList.add("lightbox-open");

      // Close handlers
      overlay.addEventListener("click", (ev) => {
        // close only when clicking overlay (not the image)
        if (ev.target === overlay) {
          overlay.remove();
          document.documentElement.classList.remove("lightbox-open");
          document.body.classList.remove("lightbox-open");
        }
      });

      // ESC to close (added once)
      onOnce(document, "keydown", (ev) => {
        if (ev.key === "Escape") {
          const o = document.querySelector(".lightbox-overlay");
          if (o) o.remove();
          document.documentElement.classList.remove("lightbox-open");
          document.body.classList.remove("lightbox-open");
        }
      });

      // stop propagation to avoid other handlers
      e.preventDefault();
      e.stopPropagation();
    }
  });

}); // DOMContentLoaded end

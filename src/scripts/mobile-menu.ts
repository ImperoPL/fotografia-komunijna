const btn = document.getElementById("mobile-menu-btn");
const menu = document.getElementById("mobile-menu");

btn?.addEventListener("click", () => {
  const isOpen = menu?.classList.contains("flex");
  menu?.classList.toggle("hidden", isOpen ?? false);
  menu?.classList.toggle("flex", !isOpen);
});

// Close mobile menu on link click
menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu?.classList.add("hidden");
    menu?.classList.remove("flex");
  });
});

// Set copyright year dynamically
const yearEl = document.getElementById("copyright-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

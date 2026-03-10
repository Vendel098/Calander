const html = document.documentElement;
const themeSelect = document.getElementById("theme-select");

function applyTheme(theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    html.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    html.setAttribute("data-theme", theme);
  }
}

const savedTheme = localStorage.getItem("theme") || "system";
themeSelect.value = savedTheme;
applyTheme(savedTheme);

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (themeSelect.value === "system") {
      applyTheme("system");
    }
  });

function saveSettings() {
  const theme = themeSelect.value;
  localStorage.setItem("theme", theme);
  applyTheme(theme);

  alert("Beállítások mentve!");
}

function resetSettings() {
  themeSelect.value = "light";
  document.getElementById("default-view").value = "month";
  document.getElementById("week-start").value = "1";
  document.getElementById("email-notif").checked = true;
  document.getElementById("desktop-notif").checked = true;
  document.getElementById("default-reminder").value = "15";
  document.getElementById("show-weekends").checked = true;
  document.getElementById("work-start").value = "09:00";
  document.getElementById("work-end").value = "17:00";

  localStorage.setItem("theme", "light");
  applyTheme("light");

  alert("Beállítások visszaállítva!");
}

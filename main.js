let date = new Date();

function renderCalendar() {
const monthYear = document.getElementById("monthYear");
const daysContainer = document.getElementById("days");

const year = date.getFullYear();
const month = date.getMonth();

const monthNames = [
"Január","Február","Március","Április","Május","Június",
"Július","Augusztus","Szeptember","Október","November","December"
];

monthYear.innerText = `${monthNames[month]} ${year}`;
daysContainer.innerHTML = "";

let firstDay = new Date(year, month, 1).getDay();
firstDay = firstDay === 0 ? 6 : firstDay - 1;

const daysInMonth = new Date(year, month + 1, 0).getDate();
const today = new Date();

for (let i = 0; i < firstDay; i++) {
daysContainer.innerHTML += "<div></div>";
}

for (let day = 1; day <= daysInMonth; day++) {
let dayDiv = document.createElement("div");
dayDiv.innerText = day;

if (
day === today.getDate() &&
month === today.getMonth() &&
year === today.getFullYear()
) {
dayDiv.classList.add("today");
}

daysContainer.appendChild(dayDiv);
}
}

function prevMonth() {
date.setMonth(date.getMonth() - 1);
renderCalendar();
}

function nextMonth() {
date.setMonth(date.getMonth() + 1);
renderCalendar();
}

renderCalendar();

function openSettings() {
    document.getElementById('settingsModal').classList.add('show');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('show');
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        closeSettings();
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelectorAll('.theme-btn').forEach(btn => {
        if (btn.classList.contains('dark-btn')) {
            btn.classList.add('active');
        }
    });
} else {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        if (btn.classList.contains('light-btn')) {
            btn.classList.add('active');
        }
    });
}

function esemenyLetrehozas() {
  document.getElementById("settingsEsemeny").classList.add("show");
}

function closeEsemeny() {
  document.getElementById("settingsEsemeny").classList.remove("show");
}

window.onclick = function (event) {
  const esemeny = document.getElementById("settingsEsemeny");
  if (event.target === esemeny) {
    closeSettings();
  }
};
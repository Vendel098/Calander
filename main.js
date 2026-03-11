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
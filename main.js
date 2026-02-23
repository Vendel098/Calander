document.querySelectorAll('.input-box i').forEach(icon => {
  const input = icon.parentElement.querySelector('input[type="password"]');
  
  if (input) {
    icon.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-sharp fa-solid fa-eye-slash');
        icon.classList.add('fa-sharp fa-solid fa-eye');
      } 
      else {
        input.type = 'password';
        icon.classList.remove('fa-sharp fa-solid fa-eye');
        icon.classList.add('fa-sharp fa-solid fa-eye-slash');
      }
    });
    
    icon.style.cursor = 'pointer';
  }
});

const monthNames = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];

let currentMonth = new Date().getMonth();
let currentYear  = new Date().getFullYear();

function renderCalendar() {
  const container = document.getElementById("days");
  const title = document.getElementById("month-year");
  title.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  container.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevDays = new Date(currentYear, currentMonth, 0).getDate();


  for (let i = firstDay - 1; i >= 1; i--) {
    createDay(prevDays - i + 1, true);
  }

 
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    createDay(d, false, isToday);
  }


  const totalCells = firstDay - 1 + daysInMonth;
  const remaining = 42 - totalCells;
  for (let i = 1; i <= remaining; i++) {
    createDay(i, true);
  }
}

function createDay(num, isOther = false, isToday = false) {
  const day = document.createElement("div");
  day.className = "day" + (isOther ? " other" : "");
  if (isToday) day.classList.add("today");

  day.innerHTML = `<div class="day-number">${num}</div>`;

  day.addEventListener("dragover", e => { e.preventDefault(); day.classList.add("drag-over"); });
  day.addEventListener("dragleave",   () => day.classList.remove("drag-over"));
  day.addEventListener("drop", e => {
    e.preventDefault();
    day.classList.remove("drag-over");
    const text = e.dataTransfer.getData("text");
    const color = e.dataTransfer.getData("color") || "#1e88e5";

    if (!text) return;

    const ev = document.createElement("div");
    ev.className = "event";
    ev.textContent = text;
    ev.draggable = true;
    ev.style.setProperty("--span", 1);
    ev.style.background = `${color}22`;
    ev.style.borderLeftColor = color;

    ev.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text", text);
      e.dataTransfer.setData("color", color);
      ev.classList.add("dragging");
    });

    ev.addEventListener("dragend", () => ev.classList.remove("dragging"));

    
    ev.addEventListener("dblclick", () => {
      if (confirm(`Törlöd: "${text}" ?`)) ev.remove();
    });

    day.appendChild(ev);
  });

  document.getElementById("days").appendChild(day);
}


document.querySelectorAll(".template-event").forEach(el => {
  el.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text", el.textContent.trim());
    e.dataTransfer.setData("color", el.dataset.color);
  });
});

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
}

renderCalendar();

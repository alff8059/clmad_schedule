const daysContainer = document.getElementById("days");
const monthNumber = document.getElementById("month-number");
const monthName = document.getElementById("month-name");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const tooltip = document.getElementById("tooltip");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let date = new Date();
let events = [];

async function loadEvents() {
  const res = await fetch("events.json");
  events = await res.json();
  renderCalendar();
}

function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();

  monthNumber.textContent = month + 1;
  monthName.textContent = monthNames[month];

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  daysContainer.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    daysContainer.appendChild(document.createElement("div"));
  }
  for (let i = 1; i <= lastDate; i++) {
    const div = document.createElement("div");

    const span = document.createElement("span");
    span.textContent = i;
    span.classList.add("day-number");

    // 오늘 날짜 표시
    if (
      i === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      div.classList.add("today");
    }

    // 요일 계산 (0=일요일, 6=토요일)
    const dayOfWeek = new Date(year, month, i).getDay();
    if (dayOfWeek === 0) {
      div.classList.add("sunday");
    } else if (dayOfWeek === 6) {
      div.classList.add("saturday");
    }

    div.appendChild(span);

    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`;
    const dayEvents = events.filter((e) => e.date === dayStr);

    dayEvents.forEach((e) => {
      const ev = document.createElement("div");
      ev.textContent = e.title;
      ev.classList.add("event", e.category);
      attachEvent(ev, e);
      div.appendChild(ev);
    });

    daysContainer.appendChild(div);
  }
  // 뒤에 빈칸 채우기
  const totalCells = firstDay + lastDate;
  const remaining = 7 - (totalCells % 7);
  if (remaining < 7) {
    for (let i = 0; i < remaining; i++) {
      daysContainer.appendChild(document.createElement("div"));
    }
  }
}

prevBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});
// ================== 툴팁 관련 함수 ==================
function showTooltip(evElement, e) {
  if (e.category != "jungmo") {
    tooltip.innerHTML = `
        <b>${e.title}</b><br>
        ${e.start} ~ ${e.end}<br> 
        벙주: ${e.author}<br> 
        장소: ${e.place}
    `;
  } else {
    tooltip.innerHTML = `
        <b>${e.title}</b><br>
        ${e.start} ~ ${e.end} <br> 
        장소: ${e.place}
    `;
  }

  const rect = evElement.getBoundingClientRect();
  const tooltipHeight = 60; // 대략 높이
  const margin = 40;

  let top = rect.top - tooltipHeight - margin + window.scrollY;
  let arrowDirection = "down"; // 기본 위로 뜨는 경우

  // 화면 위로 잘릴 경우 → 아래로 띄움
  if (top < window.scrollY) {
    top = rect.bottom + margin + window.scrollY;
    arrowDirection = "up";
  }

  tooltip.style.left = rect.left + rect.width / 2 + "px";
  tooltip.style.top = top + "px";
  tooltip.setAttribute("data-arrow", arrowDirection);
  tooltip.style.opacity = 1;
}

function hideTooltip() {
  tooltip.style.opacity = 0;
}

function attachEvent(ev, e) {
  ev.addEventListener("mouseenter", () => showTooltip(ev, e));
  ev.addEventListener("mouseleave", hideTooltip);
}

loadEvents();

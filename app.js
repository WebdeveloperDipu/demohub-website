// DemoHub: browser-only learning project. No real authentication or money movement.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const initialTasks = [
  { id: "html", title: "HTML অনুশীলন", description: "একটি heading ও paragraph তৈরি করার ধারণা অনুশীলন করো।", reward: 50 },
  { id: "css", title: "CSS অনুশীলন", description: "একটি card-এর রং, spacing ও border সম্পর্কে শেখো।", reward: 75 },
  { id: "js", title: "JavaScript অনুশীলন", description: "button click করলে কীভাবে UI বদলায় তা দেখো।", reward: 100 }
];

let state = {
  username: "",
  role: "user",
  balance: 1000,
  completed: [],
  history: [{ label: "প্রাথমিক ডেমো ব্যালেন্স", amount: 1000 }]
};

function money(value) {
  return "৳ " + Number(value).toLocaleString("en-US");
}
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 2400);
}
function showLogin() {
  $("#loginView").classList.remove("hidden");
  $("#dashboardView").classList.add("hidden");
}
function showDashboard() {
  $("#loginView").classList.add("hidden");
  $("#dashboardView").classList.remove("hidden");
  $("#helloTitle").textContent = `হ্যালো, ${state.username}!`;
  $("#rolePill").textContent = state.role === "admin" ? "ADMIN DEMO" : "USER DEMO";
  $$(".admin-only").forEach(el => el.classList.toggle("hidden", state.role !== "admin"));
  render();
  goTo("overview");
}
function goTo(page) {
  if (page === "admin" && state.role !== "admin") {
    toast("Admin demo দেখতে login screen থেকে Admin Demo Panel বেছে নাও।");
    return;
  }
  $$(".page").forEach(el => el.classList.add("hidden"));
  $$(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.page === page));
  $(`#${page}Page`)?.classList.remove("hidden");
}
function renderTasks() {
  $("#taskList").innerHTML = initialTasks.map(task => {
    const done = state.completed.includes(task.id);
    return `<article class="task-card">
      <div><h2>${task.title}</h2><p>${task.description}</p></div>
      <div><span class="task-reward">+${task.reward} demo points</span>
      <button class="${done ? "secondary" : "primary"}" data-task="${task.id}" ${done ? "disabled" : ""}>${done ? "সম্পন্ন ✓" : "সম্পন্ন করো"}</button></div>
    </article>`;
  }).join("");
}
function renderHistory() {
  $("#historyList").innerHTML = state.history.slice().reverse().map(item =>
    `<div class="history-row"><span>${item.label}</span><span>+${money(item.amount)}</span></div>`
  ).join("");
}
function render() {
  $("#completedCount").textContent = state.completed.length;
  $("#availableCount").textContent = initialTasks.length - state.completed.length;
  $("#balanceValue").textContent = money(state.balance);
  $("#walletBalance").textContent = money(state.balance);
  $("#adminUserName").textContent = state.username || "—";
  $("#adminCompleted").textContent = state.completed.length;
  $("#adminBalance").textContent = money(state.balance);
  renderTasks();
  renderHistory();
}
$("#loginForm").addEventListener("submit", event => {
  event.preventDefault();
  state.username = $("#username").value.trim();
  state.role = $("#role").value;
  if (!state.username) return;
  showDashboard();
});
$("#logoutBtn").addEventListener("click", () => {
  state.username = "";
  showLogin();
});
$$(".nav-item").forEach(button => button.addEventListener("click", () => goTo(button.dataset.page)));
$$("[data-goto]").forEach(button => button.addEventListener("click", () => goTo(button.dataset.goto)));
$("#taskList").addEventListener("click", event => {
  const button = event.target.closest("[data-task]");
  if (!button) return;
  const task = initialTasks.find(item => item.id === button.dataset.task);
  if (!task || state.completed.includes(task.id)) return;
  state.completed.push(task.id);
  state.balance += task.reward;
  state.history.push({ label: `${task.title} — demo points`, amount: task.reward });
  render();
  toast(`${task.reward} demo points যোগ হয়েছে।`);
});
$("#adjustBtn").addEventListener("click", () => {
  if (state.role !== "admin") return;
  const amount = Number($("#adjustAmount").value);
  if (!Number.isInteger(amount) || amount < 1 || amount > 10000) {
    $("#adminMessage").textContent = "১ থেকে ১০,০০০-এর মধ্যে পূর্ণসংখ্যা লিখো।";
    return;
  }
  state.balance += amount;
  state.history.push({ label: "Admin demo adjustment", amount });
  $("#adjustAmount").value = "";
  $("#adminMessage").textContent = "ডেমো ব্যালেন্স আপডেট হয়েছে। এটি শুধু এই পেজের state-এ থাকে।";
  render();
});
$("#resetDemoBtn").addEventListener("click", () => {
  state.balance = 1000;
  state.completed = [];
  state.history = [{ label: "প্রাথমিক ডেমো ব্যালেন্স", amount: 1000 }];
  render();
  toast("ডেমো ডেটা রিসেট হয়েছে।");
});

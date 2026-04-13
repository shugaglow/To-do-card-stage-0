document.addEventListener("DOMContentLoaded", function() {
const card = document.querySelector('[data-testid="test-todo-card"]');
const toggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const status = document.querySelector('[data-testid="test-todo-status"]');
const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

// toggle 
toggle.addEventListener("change", function () {
  if (toggle.checked) {
    // Task completed
    card.classList.add("is-complete");
    status.textContent = "✅ Done";
    status.className = "badge status-done";
  } else {
    // Task uncompleted
    card.classList.remove("is-complete");
    status.textContent = "🔄 In Progress";
    status.className = "badge status-pending";
  }
});


// time

const DUE_DATE = new Date("2026-04-19T18:00:00");

function getTimeRemaining() {
  const now = new Date();
  const diff = DUE_DATE - now; 

//  converting mins 
  const minutes = Math.floor(diff / (1000 * 60));
  const hours   = Math.floor(diff / (1000 * 60 * 60));
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    // Past due
    const overdueDays  = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
    const overdueHours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));

    timeRemaining.classList.add("overdue");

    if (overdueDays >= 1) {
      return `Overdue by ${overdueDays} day${overdueDays > 1 ? "s" : ""}`;
    } else {
      return `Overdue by ${overdueHours} hour${overdueHours > 1 ? "s" : ""}`;
    }

  } else if (minutes < 60) {
    return "Due now!";

  } else if (hours < 24) {
    return "Due today!";

  } else if (days === 1) {
    return "Due tomorrow";

  } else {
    return `Due in ${days} days`;
  }
}

function updateTimeRemaining() {
  timeRemaining.textContent = getTimeRemaining();
}

// update time
updateTimeRemaining();

// refresh
setInterval(updateTimeRemaining, 60000);


// edit/delete
editBtn.addEventListener("click", function () {
  console.log("Edit clicked");
  alert("Edit feature coming soon!");
});

deleteBtn.addEventListener("click", function () {
  console.log("Delete clicked");
  alert("Are you sure you want to delete this task?");
});
});
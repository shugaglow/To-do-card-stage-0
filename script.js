document.addEventListener("DOMContentLoaded", function () {

  // ===== GET ALL ELEMENTS =====
  const card           = document.querySelector('[data-testid="test-todo-card"]');
  const toggle         = document.querySelector('[data-testid="test-todo-complete-toggle"]');
  const statusBadge    = document.querySelector('[data-testid="test-todo-status"]');
  const statusControl  = document.querySelector('[data-testid="test-todo-status-control"]');
  const timeRemaining  = document.querySelector('[data-testid="test-todo-time-remaining"]');
  const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
  const priorityBadge  = document.querySelector('[data-testid="test-todo-priority"]');
  const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
  const titleEl        = document.querySelector('[data-testid="test-todo-title"]');
  const descriptionEl  = document.querySelector('[data-testid="test-todo-description"]');
  const collapsible    = document.querySelector('[data-testid="test-todo-collapsible-section"]');
  const expandToggle   = document.querySelector('[data-testid="test-todo-expand-toggle"]');
  const editBtn        = document.querySelector('[data-testid="test-todo-edit-button"]');
  const deleteBtn      = document.querySelector('[data-testid="test-todo-delete-button"]');
  const editForm       = document.querySelector('[data-testid="test-todo-edit-form"]');
  const cardView       = document.getElementById("card-view");

  // Edit form inputs
  const editTitleInput  = document.querySelector('[data-testid="test-todo-edit-title-input"]');
  const editDescInput   = document.querySelector('[data-testid="test-todo-edit-description-input"]');
  const editPriority    = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
  const editDueDate     = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
  const saveBtn         = document.querySelector('[data-testid="test-todo-save-button"]');
  const cancelBtn       = document.querySelector('[data-testid="test-todo-cancel-button"]');


  // ===== STATE =====
  // Let one object holds all our task data, so its easy to save or restore when editing
  let taskState = {
    title: titleEl.textContent.trim(),
    description: descriptionEl.textContent.trim(),
    priority: "high",
    dueDate: "2026-04-19",
    status: "inprogress",
    isDone: false
  };

  // Timer reference — we need this to stop it when task is done
  let timerInterval = null;


  // ===== EXPAND / COLLAPSE =====
  // Check if description is long enough to need collapsing
  // We use scrollHeight vs clientHeight to detect overflow
  function setupExpandCollapse() {
    collapsible.classList.add("collapsed");

    // If content is taller than 2 lines (~52px), show the toggle
    if (collapsible.scrollHeight > 56) {
      expandToggle.classList.remove("hidden");
    } else {
      expandToggle.classList.add("hidden");
    }
  }

  expandToggle.addEventListener("click", function () {
    const isExpanded = expandToggle.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      // Collapse it
      collapsible.classList.add("collapsed");
      expandToggle.setAttribute("aria-expanded", "false");
      expandToggle.textContent = "Show more";
    } else {
      // Expand it
      collapsible.classList.remove("collapsed");
      expandToggle.setAttribute("aria-expanded", "true");
      expandToggle.textContent = "Show less";
    }
  });

  setupExpandCollapse();


  // ===== STATUS HELPERS =====
  // One function that updates ALL status-related UI at once, this keeps the ui in sync

  function applyStatus(statusValue) {
    taskState.status = statusValue;
    taskState.isDone = statusValue === "done";

    // Update the status badge text + colour
    const statusMap = {
      pending:    { text: "Pending",     className: "badge status-pending" },
      inprogress: { text: "In Progress", className: "badge status-inprogress" },
      done:       { text: "Done",         className: "badge status-done" }
    };

    const s = statusMap[statusValue];
    statusBadge.textContent = s.text;
    statusBadge.className   = s.className;
    statusBadge.setAttribute("aria-label", `Status: ${s.text.replace(/^\S+\s/, "")}`);

    // Sync dropdown
    statusControl.value = statusValue;

    // Sync checkbox
    toggle.checked = taskState.isDone;

    // Sync card visual
    if (taskState.isDone) {
      card.classList.add("is-complete");
    } else {
      card.classList.remove("is-complete");
    }

    // If done, stop the timer and show "Completed"
    if (taskState.isDone) {
      stopTimer();
      timeRemaining.textContent = "Completed";
      timeRemaining.classList.remove("overdue");
      overdueIndicator.classList.add("hidden");
    } else {
      startTimer();
    }
  }


  // ===== CHECKBOX TOGGLE =====
  toggle.addEventListener("change", function () {
    if (toggle.checked) {
      applyStatus("done");
    } else {
      applyStatus("pending");
    }
  });


  // ===== STATUS DROPDOWN =====
  statusControl.addEventListener("change", function () {
    applyStatus(statusControl.value);
  });


  // ===== PRIORITY HELPERS =====
  function applyPriority(priorityValue) {
    taskState.priority = priorityValue;

    // Update badge
    const priorityMap = {
      low:    { text: "Low",    className: "badge priority-low" },
      medium: { text: "Medium", className: "badge priority-medium" },
      high:   { text: "High",   className: "badge priority-high" }
    };

    const p = priorityMap[priorityValue];
    priorityBadge.textContent = p.text;
    priorityBadge.className   = p.className;

    // Update the left-border indicator
    priorityIndicator.className = `priority-indicator priority-${priorityValue}`;
    priorityIndicator.setAttribute("aria-label", `Priority: ${priorityValue}`);
  }


  // ===== TIME REMAINING =====
  let dueDate = new Date(taskState.dueDate + "T18:00:00");

  function getTimeRemaining() {
    const now  = new Date();
    const diff = dueDate - now;

    const minutes = Math.floor(Math.abs(diff) / (1000 * 60));
    const hours   = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
    const days    = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      // Overdue
      timeRemaining.classList.add("overdue");
      overdueIndicator.classList.remove("hidden");

      if (days >= 1)    return `Overdue by ${days} day${days > 1 ? "s" : ""}`;
      if (hours >= 1)   return `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
      return `Overdue by ${minutes} minute${minutes !== 1 ? "s" : ""}`;

    } else {
      // Not overdue
      timeRemaining.classList.remove("overdue");
      overdueIndicator.classList.add("hidden");

      if (minutes < 60)  return "Due now!";
      if (hours < 24)    return `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
      if (days === 1)    return "Due tomorrow";
      return `Due in ${days} days`;
    }
  }

  function updateTimeDisplay() {
    if (!taskState.isDone) {
      timeRemaining.textContent = getTimeRemaining();
    }
  }

  function startTimer() {
    if (timerInterval) return; // don't start if already running
    updateTimeDisplay();
    timerInterval = setInterval(updateTimeDisplay, 30000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }


  // ===== EDIT MODE =====
  function openEditMode() {
    // Populate form with current values before showing it
    editTitleInput.value  = taskState.title;
    editDescInput.value   = taskState.description;
    editPriority.value    = taskState.priority;
    editDueDate.value     = taskState.dueDate;

    // Hide view, show form
    cardView.classList.add("hidden");
    editForm.classList.remove("hidden");

    // Focus the first field — good UX
    editTitleInput.focus();
  }

  function closeEditMode() {
    // Hide form, show view
    editForm.classList.add("hidden");
    cardView.classList.remove("hidden");

    // Return focus to edit button — accessibility requirement
    editBtn.focus();
  }

  editBtn.addEventListener("click", openEditMode);

  cancelBtn.addEventListener("click", closeEditMode);

  saveBtn.addEventListener("click", function () {
    // Read values from the form
    const newTitle    = editTitleInput.value.trim();
    const newDesc     = editDescInput.value.trim();
    const newPriority = editPriority.value;
    const newDueDate  = editDueDate.value;

    // Only update if title isn't empty
    if (!newTitle) {
      editTitleInput.focus();
      editTitleInput.style.borderColor = "#dc2626";
      return;
    }

    // Apply new values to the card
    titleEl.textContent       = newTitle;
    descriptionEl.textContent = newDesc;
    taskState.title           = newTitle;
    taskState.description     = newDesc;
    taskState.dueDate         = newDueDate;

    // Update due date display
    if (newDueDate) {
      const formatted = new Date(newDueDate + "T12:00:00")
        .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      document.querySelector('[data-testid="test-todo-due-date"]').textContent = ` Due ${formatted}`;
      document.querySelector('[data-testid="test-todo-due-date"]').setAttribute("datetime", newDueDate);
      dueDate = new Date(newDueDate + "T18:00:00");
    }

    applyPriority(newPriority);
    setupExpandCollapse(); // re-check collapse after description changes

    closeEditMode();
  });


  // ===== DELETE =====
  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      card.style.opacity    = "0";
      card.style.transform  = "scale(0.95)";
      setTimeout(() => card.remove(), 300);
    }
  });


  // ===== INITIALISE =====
  // Run these on page load to set the initial state
  applyPriority(taskState.priority);
  applyStatus(taskState.status);
  startTimer();

});
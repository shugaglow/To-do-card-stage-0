# Todo Card — Stage 1

A single interactive Todo Card component built with HTML, CSS, and JavaScript.

https://to-do-card-stage-0.vercel.app/

---

## What Changed from Stage 0

### New Features Added
- **Edit Mode** — clicking the Edit button opens an inline form to update
  the title, description, priority, and due date. Saving updates the card 
  live. Cancelling restores the previous values.
- **Status Control** — a dropdown lets users manually set the status to 
  Pending, In Progress, or Done. The checkbox, status badge, and dropdown 
  all stay in sync with each other.
- **Priority Indicator** — a colored left border accent on the card 
  visually reflects the current priority (green = low, amber = medium, 
  red = high).
- **Expand / Collapse** — long descriptions are collapsed to 2 lines by 
  default. A "Show more" button reveals the full text.
- **Overdue Indicator** — a red warning banner appears automatically when 
  the due date has passed.
- **Granular Time Display** — time remaining now shows hours and minutes 
  (e.g. "Due in 3 hours", "Overdue by 45 minutes") and updates every 
  30 seconds.
- **Delete Animation** — the card fades out smoothly when deleted.

---

## Design Decisions

- **Priority indicator as a left border** rather than just a badge — gives 
  an at-a-glance visual signal without cluttering the card.
- **Single state object (`taskState`)** in JavaScript — all task data lives 
  in one place, making save/cancel/restore logic simple and reliable.
- **`applyStatus()` and `applyPriority()` helper functions** — any change 
  to status or priority goes through one function, so the UI is always 
  in sync (badge, checkbox, dropdown, timer all update together).
- **Edit mode swaps the card body** — instead of a separate modal, the 
  edit form replaces the card content inline, keeping focus within the card.
- **Timer stops when status is Done** — avoids confusing "Overdue" messages 
  on completed tasks.

---

## Known Limitations

- Tags are currently hardcoded — the edit form does not support adding or 
  removing tags yet.
- No persistent storage — refreshing the page resets the card to its 
  default state.
- Only one card is supported — this is a single card component, not a 
  full todo list app.
- Due date input shows a browser-native date picker which varies in 
  appearance across browsers.

---

## Accessibility Notes

- Checkbox uses a visually hidden native `<input type="checkbox">` so it 
  remains keyboard and screen reader accessible, while showing a custom 
  styled box.
- All form fields in edit mode have visible `<label for="">` elements tied 
  to their inputs.
- The expand/collapse toggle uses `aria-expanded` and `aria-controls` to 
  communicate state to screen readers.
- The overdue indicator uses `role="alert"` and `aria-live="assertive"` so 
  screen readers announce it immediately when it appears.
- Time remaining uses `aria-live="polite"` so updates are announced without 
  interrupting the user.
- Closing the edit form returns focus to the Edit button automatically.
- All interactive elements are keyboard focusable with visible focus rings.
- Color is never the only indicator — text labels accompany all 
  color-coded badges.

---

## Built With

- HTML5 (semantic elements: article, time, ul, label, button)
- CSS3 (flexbox, CSS transitions, media queries)
- Vanilla JavaScript (no frameworks or libraries)
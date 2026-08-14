const STORAGE_KEY = "pythonLearningLabProgress";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function lessonProgress(lessonId) {
  const progress = loadProgress();
  const lesson = progress[lessonId];
  const completedSteps = lesson?.completedSteps || [];
  return {
    completedSteps,
    percent: Math.round((completedSteps.length / 4) * 100),
    complete: completedSteps.length === 4
  };
}

function isLessonUnlocked(index) {
  if (index === 0) return true;

  const previousLesson = window.LESSONS[index - 1];
  return lessonProgress(previousLesson.id).complete;
}

function renderDashboard() {
  const grid = document.getElementById("lessonGrid");
  grid.innerHTML = "";

  let completedCount = 0;

  window.LESSONS.forEach((lesson, index) => {
    const state = lessonProgress(lesson.id);
    const unlocked = isLessonUnlocked(index);

    if (state.complete) completedCount += 1;

    const card = document.createElement(unlocked ? "a" : "article");
    card.className = `lesson-tile ${unlocked ? "" : "locked"}`;

    if (unlocked) {
      card.href = `lesson.html?id=${encodeURIComponent(lesson.id)}`;
    }

    const statusText = !unlocked
      ? "Locked"
      : state.complete
        ? "Complete ✓"
        : state.percent > 0
          ? `${state.percent}% complete`
          : "Start →";

    card.innerHTML = `
      <div class="lesson-number">${String(lesson.number).padStart(2, "0")}</div>
      <div class="lesson-tile-body">
        <div class="lesson-title-row">
          <h3>${lesson.title}</h3>
          <span class="lesson-status ${state.complete ? "done" : ""}">${statusText}</span>
        </div>
        <p>${lesson.description}</p>
        <div class="progress-track lesson-progress-track">
          <div class="progress-bar" style="width: ${state.percent}%"></div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  const total = window.LESSONS.length;
  document.getElementById("moduleProgressText").textContent = `${completedCount} of ${total} lessons complete`;
  document.getElementById("moduleProgressBar").style.width = `${Math.round((completedCount / total) * 100)}%`;
}

document.getElementById("resetProgress").addEventListener("click", () => {
  const confirmed = window.confirm("Reset all saved Python Learning Lab progress in this browser?");
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  renderDashboard();
});

renderDashboard();

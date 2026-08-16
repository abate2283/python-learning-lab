function loadProgress() {
  return window.PythonLabStorage.getProgress();
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

function renderProfileControls() {
  const active = window.PythonLabStorage.getActiveProfile();
  const profiles = window.PythonLabStorage.getProfiles();
  const select = document.getElementById("profileSelect");

  select.innerHTML = profiles
    .map(profile => `<option value="${profile.id}" ${profile.id === active.id ? "selected" : ""}>${profile.name}</option>`)
    .join("");

  document.getElementById("welcomeLearner").textContent = `Welcome back, ${active.name}!`;
}

function renderDashboard() {
  renderProfileControls();

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

document.getElementById("profileSelect").addEventListener("change", event => {
  window.PythonLabStorage.setActiveProfile(event.target.value);
  renderDashboard();
});

document.getElementById("addProfile").addEventListener("click", () => {
  const name = window.prompt("Learner name:");
  if (name === null) return;

  try {
    window.PythonLabStorage.createProfile(name);
    renderDashboard();
  } catch (error) {
    window.alert(error.message);
  }
});

document.getElementById("renameProfile").addEventListener("click", () => {
  const active = window.PythonLabStorage.getActiveProfile();
  const name = window.prompt("Rename learner:", active.name);
  if (name === null) return;

  try {
    window.PythonLabStorage.renameActiveProfile(name);
    renderDashboard();
  } catch (error) {
    window.alert(error.message);
  }
});

document.getElementById("resetProgress").addEventListener("click", () => {
  const active = window.PythonLabStorage.getActiveProfile();
  const confirmed = window.confirm(`Reset all saved progress for ${active.name} on this browser?`);
  if (!confirmed) return;

  window.PythonLabStorage.resetActiveProgress();
  renderDashboard();
});

renderDashboard();

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

function lessonsForModule(moduleId) {
  return window.LESSONS.filter(lesson => lesson.moduleId === moduleId);
}

function moduleProgress(moduleId) {
  const lessons = lessonsForModule(moduleId);
  const completed = lessons.filter(lesson => lessonProgress(lesson.id).complete).length;
  return {
    completed,
    total: lessons.length,
    percent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
    complete: lessons.length > 0 && completed === lessons.length
  };
}

function isModuleUnlocked(moduleIndex) {
  if (moduleIndex === 0) return true;
  const module = window.MODULES[moduleIndex];
  if (module?.testUnlocked) return true;
  const previousModule = window.MODULES[moduleIndex - 1];
  return moduleProgress(previousModule.id).complete;
}

function isLessonUnlocked(lesson) {
  const moduleIndex = window.MODULES.findIndex(module => module.id === lesson.moduleId);
  if (!isModuleUnlocked(moduleIndex)) return false;

  const moduleLessons = lessonsForModule(lesson.moduleId);
  const lessonIndex = moduleLessons.findIndex(item => item.id === lesson.id);
  if (lessonIndex === 0) return true;

  return lessonProgress(moduleLessons[lessonIndex - 1].id).complete;
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

function renderLessonCard(lesson) {
  const state = lessonProgress(lesson.id);
  const unlocked = isLessonUnlocked(lesson);
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

  return card;
}

function renderDashboard() {
  renderProfileControls();

  const container = document.getElementById("modulesContainer");
  container.innerHTML = "";

  window.MODULES.forEach((module, moduleIndex) => {
    const state = moduleProgress(module.id);
    const unlocked = isModuleUnlocked(moduleIndex);
    const section = document.createElement("section");
    section.className = `module-section ${unlocked ? "" : "module-locked"}`;

    section.innerHTML = `
      <div class="module-heading-row">
        <div>
          <p class="eyebrow dashboard-eyebrow">Module ${module.number}</p>
          <h2>${module.title}</h2>
          <p class="dashboard-copy">${module.description}</p>
        </div>
        <div class="module-progress-card compact-module-progress">
          <span>Module progress</span>
          <strong>${state.completed} of ${state.total} lessons complete</strong>
          <div class="progress-track"><div class="progress-bar" style="width: ${state.percent}%"></div></div>
          ${module.testUnlocked && moduleIndex > 0 ? '<small class="test-badge">Open for testing</small>' : ""}
        </div>
      </div>
      <div class="lesson-grid" data-module-grid="${module.id}"></div>
    `;

    const grid = section.querySelector(".lesson-grid");
    lessonsForModule(module.id).forEach(lesson => grid.appendChild(renderLessonCard(lesson)));
    container.appendChild(section);
  });
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

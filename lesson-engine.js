let pyodide = null;

const STORAGE_KEY = "pythonLearningLabProgress";
const params = new URLSearchParams(window.location.search);
const lessonId = params.get("id") || "string-variables";
const lessonIndex = window.LESSONS.findIndex(item => item.id === lessonId);
const lesson = lessonIndex >= 0 ? window.LESSONS[lessonIndex] : null;

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function lessonProgress(id) {
  const progress = loadProgress();
  const completedSteps = progress[id]?.completedSteps || [];
  return {
    completedSteps,
    percent: Math.round((completedSteps.length / 4) * 100),
    complete: completedSteps.length === 4
  };
}

function isLessonUnlocked(index) {
  if (index === 0) return true;
  if (index < 0) return false;

  const previousLesson = window.LESSONS[index - 1];
  return lessonProgress(previousLesson.id).complete;
}

function hasLessonContent(item) {
  return Boolean(
    item?.concept &&
    item?.example &&
    item?.practice &&
    item?.challenge
  );
}

function getCompletedSteps() {
  return new Set(lessonProgress(lessonId).completedSteps);
}

function persistCompletedSteps(completed) {
  const progress = loadProgress();
  progress[lessonId] = {
    completedSteps: [...completed],
    completed: completed.size === 4
  };
  saveProgress(progress);
}

const completed = getCompletedSteps();

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

function setHtml(id, html) {
  document.getElementById(id).innerHTML = html;
}

function renderUnavailable(title, message) {
  document.body.innerHTML = `
    <main class="empty-state">
      <h1>${title}</h1>
      <p>${message}</p>
      <a class="primary-link" href="index.html">Back to dashboard</a>
    </main>
  `;
}

function renderLesson() {
  if (!lesson) {
    renderUnavailable("Lesson unavailable", "This lesson could not be found.");
    return false;
  }

  if (!isLessonUnlocked(lessonIndex)) {
    renderUnavailable("Lesson locked", "Complete the previous lesson to unlock this one.");
    return false;
  }

  if (!hasLessonContent(lesson)) {
    renderUnavailable("Lesson coming next", `${lesson.title} is unlocked, but its interactive content has not been added yet.`);
    return false;
  }

  document.title = `Python Learning Lab — ${lesson.title}`;
  setText("lessonTitle", `Lesson ${lesson.number}: ${lesson.title}`);
  setText("lessonSubtitle", lesson.description);

  setText("conceptTitle", lesson.concept.title);
  setHtml("conceptBody", lesson.concept.body);
  setText("conceptCode", lesson.concept.code);
  setHtml("conceptCallout", lesson.concept.callout);

  setText("exampleTitle", lesson.example.title);
  setHtml("exampleBody", lesson.example.body);
  setText("exampleCode", lesson.example.code);
  setText("exampleOutput", lesson.example.output);

  setText("practiceTitle", lesson.practice.title);
  setHtml("practicePrompt", lesson.practice.prompt);
  setHtml("practiceHint", lesson.practice.hint);
  document.getElementById("practiceCode").value = lesson.practice.starterCode;

  setText("challengeTitle", lesson.challenge.title);
  setHtml("challengePrompt", lesson.challenge.prompt);
  document.getElementById("challengeCode").value = lesson.challenge.starterCode;
  setHtml("challengeHint", lesson.challenge.hint);

  restoreCompletedUi();
  updateProgress();
  return true;
}

async function bootPython() {
  const status = document.getElementById("pythonStatus");
  if (!status) return;

  try {
    pyodide = await loadPyodide();
    status.textContent = "Python ready ✓";
  } catch (error) {
    status.textContent = "Python failed to load";
    console.error(error);
  }
}

function updateProgress() {
  const percent = Math.round((completed.size / 4) * 100);
  setText("progressText", `${percent}%`);
  document.getElementById("progressBar").style.width = `${percent}%`;

  if (completed.size === 4) {
    document.getElementById("completionCard").classList.add("show");
    setText("completionText", `You completed ${lesson.title}. Your progress is saved in this browser.`);
  }
}

function markComplete(step) {
  completed.add(step);
  persistCompletedSteps(completed);
  updateProgress();
  restoreCompletedUi();
}

function restoreCompletedUi() {
  document.querySelectorAll(".complete-btn").forEach(btn => {
    if (completed.has(btn.dataset.complete)) {
      btn.textContent = "Completed ✓";
      btn.disabled = true;
    }
  });
}

async function executePython(code) {
  if (!pyodide) {
    return { ok: false, output: "Python is still loading. Try again in a moment." };
  }

  const wrapped = `
import sys, io, traceback
_buffer = io.StringIO()
_old_stdout = sys.stdout
sys.stdout = _buffer
try:
    exec(${JSON.stringify(code)}, globals())
    _result = {"ok": True, "output": _buffer.getvalue()}
except Exception:
    _result = {"ok": False, "output": traceback.format_exc()}
finally:
    sys.stdout = _old_stdout
_result
`;

  try {
    const proxy = await pyodide.runPythonAsync(wrapped);
    const result = proxy.toJs({ dict_converter: Object.fromEntries });
    proxy.destroy();
    return result;
  } catch (error) {
    return { ok: false, output: String(error) };
  }
}

function setFeedback(elementId, type, html) {
  const el = document.getElementById(elementId);
  el.className = `feedback ${type}`;
  el.innerHTML = html;
}

async function verifyExercise(code, output, exercise) {
  const requirementsJson = JSON.stringify(exercise.requirements || []);
  const mustPrintJson = JSON.stringify(exercise.mustPrint || []);

  const checker = `
import sys, io, json
_code = ${JSON.stringify(code)}
_requirements = json.loads(${JSON.stringify(requirementsJson)})
_must_print = json.loads(${JSON.stringify(mustPrintJson)})
_ns = {}
_tmp = io.StringIO()
_old = sys.stdout
sys.stdout = _tmp
try:
    exec(_code, _ns)
finally:
    sys.stdout = _old

def _type_ok(value, expected):
    if expected == "str":
        return isinstance(value, str)
    if expected == "int":
        return isinstance(value, int) and not isinstance(value, bool)
    if expected == "float":
        return isinstance(value, float)
    return True

_checks = []
for req in _requirements:
    name = req["name"]
    exists = name in _ns
    value = _ns.get(name)
    ok = exists and _type_ok(value, req.get("type"))
    if ok and req.get("nonEmpty"):
        ok = bool(str(value).strip())
    _checks.append((name, ok, value if exists else None))

_print_checks = []
_output = ${JSON.stringify(output)}
for name in _must_print:
    value = _ns.get(name)
    _print_checks.append((name, value is not None and str(value) in _output))

{"checks": _checks, "print_checks": _print_checks}
`;

  const proxy = pyodide.runPython(checker);
  const result = proxy.toJs({ dict_converter: Object.fromEntries });
  proxy.destroy();
  return result;
}

function describeFailure(checks, printChecks) {
  const failedRequirement = checks.find(([, ok]) => !ok);
  if (failedRequirement) {
    return `Check the required variable <code>${failedRequirement[0]}</code> and make sure it has the correct type and value.`;
  }

  const failedPrint = printChecks.find(([, ok]) => !ok);
  if (failedPrint) {
    return `Your variable looks good. Now make sure you print <code>${failedPrint[0]}</code>.`;
  }

  return "Almost there. Review the instructions and try again.";
}

async function evaluateExercise(kind) {
  const exercise = lesson[kind];
  const codeId = kind === "practice" ? "practiceCode" : "challengeCode";
  const outputId = kind === "practice" ? "practiceOutput" : "challengeOutput";
  const feedbackId = kind === "practice" ? "practiceFeedback" : "challengeFeedback";

  const code = document.getElementById(codeId).value;
  const output = document.getElementById(outputId);
  output.textContent = kind === "practice" ? "Running…" : "Checking…";

  const result = await executePython(code);
  output.textContent = result.output || "(No output)";

  if (!result.ok) {
    setFeedback(feedbackId, "error", "<strong>There is a Python error.</strong><br>Read the last line of the output, fix the code, and try again.");
    return;
  }

  try {
    const verification = await verifyExercise(code, result.output, exercise);
    const checks = verification.checks || [];
    const printChecks = verification.print_checks || [];
    const passed = checks.every(([, ok]) => ok) && printChecks.every(([, ok]) => ok);

    if (passed) {
      setFeedback(feedbackId, "success", `<strong>${exercise.success}</strong>`);
      markComplete(kind);
    } else {
      setFeedback(feedbackId, "error", `<strong>Almost.</strong><br>${describeFailure(checks, printChecks)}`);
    }
  } catch (error) {
    console.error(error);
    setFeedback(feedbackId, "error", "I could not verify this exercise yet. Check the required variable names and try again.");
  }
}

if (renderLesson()) {
  document.querySelectorAll(".complete-btn").forEach(btn => {
    btn.addEventListener("click", () => markComplete(btn.dataset.complete));
  });

  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.getElementById("runPractice").addEventListener("click", () => evaluateExercise("practice"));
  document.getElementById("runChallenge").addEventListener("click", () => evaluateExercise("challenge"));
  document.getElementById("resetPractice").addEventListener("click", () => {
    document.getElementById("practiceCode").value = lesson.practice.starterCode;
    document.getElementById("practiceOutput").textContent = 'Click “Run code”.';
    setFeedback("practiceFeedback", "neutral", "Your feedback will appear here.");
  });
  document.getElementById("showHint").addEventListener("click", () => {
    document.getElementById("challengeHint").classList.toggle("hidden");
  });

  bootPython();
}

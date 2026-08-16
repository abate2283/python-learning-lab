let pyodide = null;

const params = new URLSearchParams(window.location.search);
const lessonId = params.get("id") || "string-variables";
const lessonIndex = window.LESSONS.findIndex(item => item.id === lessonId);
const lesson = lessonIndex >= 0 ? window.LESSONS[lessonIndex] : null;

function loadProgress() {
  return window.PythonLabStorage.getProgress();
}

function saveProgress(progress) {
  window.PythonLabStorage.saveProgress(progress);
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

function lessonsForModule(moduleId) {
  return window.LESSONS.filter(item => item.moduleId === moduleId);
}

function moduleProgress(moduleId) {
  const lessons = lessonsForModule(moduleId);
  const completed = lessons.filter(item => lessonProgress(item.id).complete).length;
  return {
    completed,
    total: lessons.length,
    complete: lessons.length > 0 && completed === lessons.length
  };
}

function isModuleUnlocked(moduleId) {
  const moduleIndex = window.MODULES.findIndex(item => item.id === moduleId);
  if (moduleIndex === 0) return true;
  if (moduleIndex < 0) return false;

  const module = window.MODULES[moduleIndex];
  if (module.testUnlocked) return true;

  const previousModule = window.MODULES[moduleIndex - 1];
  return moduleProgress(previousModule.id).complete;
}

function isLessonUnlocked(item) {
  if (!item || !isModuleUnlocked(item.moduleId)) return false;

  const moduleLessons = lessonsForModule(item.moduleId);
  const index = moduleLessons.findIndex(candidate => candidate.id === item.id);
  if (index === 0) return true;
  if (index < 0) return false;

  return lessonProgress(moduleLessons[index - 1].id).complete;
}

function hasLessonContent(item) {
  return Boolean(item?.concept && item?.example && item?.practice && item?.challenge);
}

function getCompletedSteps() {
  return new Set(lessonProgress(lessonId).completedSteps);
}

function persistCompletedSteps(completed) {
  const progress = loadProgress();
  progress[lessonId] = {
    ...(progress[lessonId] || {}),
    completedSteps: [...completed],
    completed: completed.size === 4,
    updatedAt: new Date().toISOString()
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

  if (!isLessonUnlocked(lesson)) {
    renderUnavailable("Lesson locked", "Complete the previous lesson in this module to unlock this one.");
    return false;
  }

  if (!hasLessonContent(lesson)) {
    renderUnavailable("Lesson coming next", `${lesson.title} is unlocked, but its interactive content has not been added yet.`);
    return false;
  }

  const module = window.MODULES.find(item => item.id === lesson.moduleId);
  document.title = `Python Learning Lab — ${lesson.title}`;
  setText("lessonEyebrow", module ? `Module ${module.number} · ${module.title}` : "Python Learning Lab");
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
    setText("completionText", `You completed ${lesson.title}. Your progress is saved for the current learner on this browser.`);
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
    return { ok: false, output: "Python is still loading. Try again in a moment.", inputs: [] };
  }

  const wrapped = `
import sys, io, traceback, builtins
from js import window

_buffer = io.StringIO()
_old_stdout = sys.stdout
_old_input = builtins.input
_captured_inputs = []

def _browser_input(prompt=""):
    value = window.prompt(str(prompt))
    if value is None:
        raise EOFError("Input was cancelled by the learner.")
    value = str(value)
    _captured_inputs.append(value)
    print(f"{prompt}{value}")
    return value

sys.stdout = _buffer
builtins.input = _browser_input
try:
    _ns = {}
    exec(${JSON.stringify(code)}, _ns)
    _result = {
        "ok": True,
        "output": _buffer.getvalue(),
        "inputs": _captured_inputs
    }
except Exception:
    _result = {
        "ok": False,
        "output": traceback.format_exc(),
        "inputs": _captured_inputs
    }
finally:
    sys.stdout = _old_stdout
    builtins.input = _old_input
_result
`;

  try {
    const proxy = await pyodide.runPythonAsync(wrapped);
    const result = proxy.toJs({ dict_converter: Object.fromEntries });
    proxy.destroy();
    return result;
  } catch (error) {
    return { ok: false, output: String(error), inputs: [] };
  }
}

function setFeedback(elementId, type, html) {
  const el = document.getElementById(elementId);
  el.className = `feedback ${type}`;
  el.innerHTML = html;
}

async function verifyExercise(code, output, exercise, inputs = []) {
  const requirementsJson = JSON.stringify(exercise.requirements || []);
  const mustPrintJson = JSON.stringify(exercise.mustPrint || []);
  const inputsJson = JSON.stringify(inputs || []);
  const hiddenTestsJson = JSON.stringify(exercise.hiddenTests || []);

  const checker = `
import sys, io, json, builtins, traceback
_code = ${JSON.stringify(code)}
_requirements = json.loads(${JSON.stringify(requirementsJson)})
_must_print = json.loads(${JSON.stringify(mustPrintJson)})
_saved_inputs = json.loads(${JSON.stringify(inputsJson)})
_hidden_tests = json.loads(${JSON.stringify(hiddenTestsJson)})

def _type_ok(value, expected):
    if expected == "str":
        return isinstance(value, str)
    if expected == "int":
        return isinstance(value, int) and not isinstance(value, bool)
    if expected == "float":
        return isinstance(value, float)
    return True

def _run_with_inputs(values):
    input_iter = iter(values)
    ns = {}
    tmp = io.StringIO()
    old_stdout = sys.stdout
    old_input = builtins.input

    def replay_input(prompt=""):
        try:
            return next(input_iter)
        except StopIteration:
            raise EOFError("No saved input remains for this exercise.")

    sys.stdout = tmp
    builtins.input = replay_input
    try:
        exec(_code, ns)
        return {"ok": True, "ns": ns, "output": tmp.getvalue(), "error": ""}
    except Exception:
        return {"ok": False, "ns": ns, "output": tmp.getvalue(), "error": traceback.format_exc()}
    finally:
        sys.stdout = old_stdout
        builtins.input = old_input

_current = _run_with_inputs(_saved_inputs)
_ns = _current["ns"]
_checks = []
for req in _requirements:
    name = req["name"]
    exists = name in _ns
    value = _ns.get(name)
    ok = exists and _type_ok(value, req.get("type"))
    if ok and req.get("nonEmpty"):
        ok = bool(str(value).strip())
    if ok and "equals" in req:
        ok = value == req["equals"]
    _checks.append((name, ok, value if exists else None))

_print_checks = []
_output = ${JSON.stringify(output)}
for name in _must_print:
    value = _ns.get(name)
    _print_checks.append((name, value is not None and str(value) in _output))

_hidden_results = []
for idx, test in enumerate(_hidden_tests, start=1):
    run = _run_with_inputs(test.get("inputs", []))
    ok = run["ok"]
    if ok:
        for name, expected in test.get("expected", {}).items():
            if run["ns"].get(name) != expected:
                ok = False
                break
    _hidden_results.append((idx, ok))

{"checks": _checks, "print_checks": _print_checks, "hidden_tests": _hidden_results}
`;

  const proxy = pyodide.runPython(checker);
  const result = proxy.toJs({ dict_converter: Object.fromEntries });
  proxy.destroy();
  return result;
}

function describeFailure(checks, printChecks, hiddenTests) {
  const failedRequirement = checks.find(([, ok]) => !ok);
  if (failedRequirement) {
    return `Check the required variable <code>${failedRequirement[0]}</code> and make sure it has the correct type and value.`;
  }

  const failedPrint = printChecks.find(([, ok]) => !ok);
  if (failedPrint) {
    return `Your variable looks good. Now make sure you print <code>${failedPrint[0]}</code>.`;
  }

  const failedHidden = hiddenTests.find(([, ok]) => !ok);
  if (failedHidden) {
    return `Your program ran, but hidden test ${failedHidden[0]} failed. Avoid fixed answers and make sure your solution works with any valid input values.`;
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
    const verification = await verifyExercise(code, result.output, exercise, result.inputs || []);
    const checks = verification.checks || [];
    const printChecks = verification.print_checks || [];
    const hiddenTests = verification.hidden_tests || [];
    const passed = checks.every(([, ok]) => ok) &&
      printChecks.every(([, ok]) => ok) &&
      hiddenTests.every(([, ok]) => ok);

    if (passed) {
      const testNote = hiddenTests.length
        ? `<br><span class="test-pass-note">🧪 ${hiddenTests.length} hidden tests passed.</span>`
        : "";
      setFeedback(feedbackId, "success", `<strong>${exercise.success}</strong>${testNote}`);
      markComplete(kind);
    } else {
      setFeedback(feedbackId, "error", `<strong>Almost.</strong><br>${describeFailure(checks, printChecks, hiddenTests)}`);
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

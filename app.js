let pyodide = null;
const completed = new Set();

async function bootPython() {
  const status = document.getElementById("pythonStatus");
  try {
    pyodide = await loadPyodide();
    status.textContent = "Python ready ✓";
  } catch (error) {
    status.textContent = "Python failed to load";
    console.error(error);
  }
}

function markComplete(step) {
  completed.add(step);
  const percent = Math.round((completed.size / 4) * 100);
  document.getElementById("progressText").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;
  if (completed.size === 4) {
    document.getElementById("completionCard").classList.add("show");
  }
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

async function evaluatePractice() {
  const code = document.getElementById("practiceCode").value;
  const output = document.getElementById("practiceOutput");
  output.textContent = "Running…";

  const result = await executePython(code);
  output.textContent = result.output || "(No output)";

  if (!result.ok) {
    setFeedback("practiceFeedback", "error", "<strong>Not quite yet.</strong><br>Your code produced an error. Read the last line of the output and try again.");
    return;
  }

  try {
    const checker = `
_code = ${JSON.stringify(code)}
_ns = {}
exec(_code, _ns)
(
    "favorite_food" in _ns
    and isinstance(_ns["favorite_food"], str)
    and bool(_ns["favorite_food"].strip())
)
`;
    const passed = pyodide.runPython(checker);

    if (passed) {
      setFeedback("practiceFeedback", "success", "<strong>Excellent!</strong><br>You created <code>favorite_food</code> and stored a non-empty string in it.");
      markComplete("practice");
    } else {
      setFeedback("practiceFeedback", "error", "<strong>Almost.</strong><br>Create a variable named <code>favorite_food</code> and give it a text value inside quotation marks.");
    }
  } catch {
    setFeedback("practiceFeedback", "error", "Your code ran, but the required <code>favorite_food</code> string variable was not found.");
  }
}

async function evaluateChallenge() {
  const code = document.getElementById("challengeCode").value;
  const output = document.getElementById("challengeOutput");
  output.textContent = "Checking…";

  const result = await executePython(code);
  output.textContent = result.output || "(No output)";

  if (!result.ok) {
    setFeedback("challengeFeedback", "error", "<strong>There is a Python error.</strong><br>Use the output to find it, fix it, then run the challenge again.");
    return;
  }

  const checker = `
_code = ${JSON.stringify(code)}
_ns = {}
exec(_code, _ns)
_ok_vars = (
    "first_name" in _ns and isinstance(_ns["first_name"], str) and bool(_ns["first_name"].strip())
    and "city" in _ns and isinstance(_ns["city"], str) and bool(_ns["city"].strip())
)
_printed = (
    str(_ns.get("first_name", "")) in ${JSON.stringify(result.output)}
    and str(_ns.get("city", "")) in ${JSON.stringify(result.output)}
)
(_ok_vars, _printed)
`;

  try {
    const proxy = pyodide.runPython(checker);
    const [okVars, printed] = proxy.toJs();
    proxy.destroy();

    if (okVars && printed) {
      setFeedback("challengeFeedback", "success", "<strong>Challenge passed! 🎉</strong><br>You created both required string variables and printed their values.");
      markComplete("challenge");
    } else if (!okVars) {
      setFeedback("challengeFeedback", "error", "Both <code>first_name</code> and <code>city</code> must contain non-empty string values.");
    } else {
      setFeedback("challengeFeedback", "error", "Your variables look good. Now make sure you print both values.");
    }
  } catch {
    setFeedback("challengeFeedback", "error", "I could not verify the challenge yet. Check your variable names and try again.");
  }
}

document.querySelectorAll(".complete-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    markComplete(btn.dataset.complete);
    btn.textContent = "Completed ✓";
    btn.disabled = true;
  });
});

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.getElementById("runPractice").addEventListener("click", evaluatePractice);
document.getElementById("runChallenge").addEventListener("click", evaluateChallenge);
document.getElementById("resetPractice").addEventListener("click", () => {
  document.getElementById("practiceCode").value = 'favorite_food = "Pizza"\nprint(favorite_food)';
  document.getElementById("practiceOutput").textContent = 'Click “Run code”.';
  setFeedback("practiceFeedback", "neutral", "Your feedback will appear here.");
});
document.getElementById("showHint").addEventListener("click", () => {
  document.getElementById("challengeHint").classList.toggle("hidden");
});

bootPython();

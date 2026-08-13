# Python Curriculum POC

A one-lesson, interactive Python learning proof of concept inspired by the immediate-feedback style of interactive courseware.

## POC lesson
**Lesson 1: String Variables**

The learner can:
- read a short concept explanation
- inspect examples
- type real Python code
- run Python directly in the browser
- receive immediate feedback
- complete a small challenge
- see lesson progress

## How Python runs
This prototype uses **Pyodide**, which runs Python through WebAssembly inside the browser. No backend server is required for this POC.

## Local test
Because Pyodide loads from a CDN, open the project using a small local web server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages deployment
The repository includes:

```text
.github/workflows/pages.yml
```

In GitHub:

1. Open **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main`
4. Open the **Actions** tab and watch the Pages workflow
5. When it finishes, GitHub will provide the public site URL

## Suggested next POC lessons
1. Numbers and arithmetic
2. User input
3. Conditionals
4. Loops
5. Lists
6. Functions

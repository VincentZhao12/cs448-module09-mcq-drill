(function () {
  "use strict";

  const app = document.querySelector("#app");
  const bankCount = document.querySelector("#bank-count");
  const sessionScore = document.querySelector("#session-score");
  const letters = ["a", "b", "c", "d"];
  const modules = [
    "09-01 Query Processing Algorithms",
    "09-02 Query Evaluation Pipelines",
    "10 Query Optimization",
    "11 Transaction Management",
    "12 Concurrency Control",
    "13 Crash Recovery"
  ];

  const state = {
    questions: [],
    index: 0,
    selected: null,
    answers: [],
    lastConfig: null
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function questionsForConfig(config) {
    let pool = window.CS448_QUESTIONS || [];
    if (config.module !== "mixed") {
      pool = pool.filter((q) => q.module === config.module);
    }
    if (config.shuffle) {
      pool = shuffle(pool);
    }
    return pool.slice(0, config.count);
  }

  function countByModule() {
    return modules.map((module) => ({
      module,
      count: (window.CS448_QUESTIONS || []).filter((q) => q.module === module).length
    }));
  }

  function updateTopStats() {
    const total = (window.CS448_QUESTIONS || []).length;
    const correct = state.answers.filter((a) => a.correct).length;
    bankCount.textContent = `${total} questions`;
    sessionScore.textContent = `${correct} / ${state.answers.length}`;
  }

  function renderHome() {
    updateTopStats();
    const moduleRows = countByModule()
      .map((row) => `
        <div class="module-row">
          <span>${escapeHtml(row.module)}</span>
          <span class="muted">${row.count}</span>
        </div>
      `)
      .join("");

    app.innerHTML = `
      <div class="home">
        <div class="home-grid">
          <div>
            <p class="summary-line">
              Final-style MCQ grinder built from modules 09 onward. It leans hard into the stuff that punishes fuzzy recall: costs, protocol edge cases, iterator state, selectivity, and ARIES.
            </p>
            <div class="module-list">${moduleRows}</div>
          </div>
          <form id="start-form" class="controls">
            <div class="field">
              <label for="module">Module filter</label>
              <select id="module" name="module">
                <option value="mixed">Mixed final mode</option>
                ${modules.map((m) => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="count">Question count</label>
              <input id="count" name="count" type="number" min="5" max="${window.CS448_QUESTIONS.length}" value="40">
            </div>
            <label class="check-row">
              <input id="shuffle" name="shuffle" type="checkbox" checked>
              Shuffle questions
            </label>
            <button class="primary" type="submit">Start drill</button>
          </form>
        </div>
      </div>
    `;

    document.querySelector("#start-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const config = {
        module: form.get("module"),
        count: Math.max(5, Math.min(Number(form.get("count")) || 40, window.CS448_QUESTIONS.length)),
        shuffle: form.get("shuffle") === "on"
      };
      startQuiz(config);
    });
  }

  function startQuiz(config, overrideQuestions) {
    state.questions = overrideQuestions || questionsForConfig(config);
    state.index = 0;
    state.selected = null;
    state.answers = [];
    state.lastConfig = config;
    renderQuestion();
  }

  function renderQuestion() {
    updateTopStats();
    if (state.index >= state.questions.length) {
      renderResults();
      return;
    }

    const q = state.questions[state.index];
    const answered = state.selected !== null;
    const chosen = state.selected;
    const width = ((state.index) / state.questions.length) * 100;

    app.innerHTML = `
      <div class="quiz">
        <div class="question-head">
          <div>
            <div class="tags">
              <span class="tag hot">${escapeHtml(q.module)}</span>
              <span class="tag">${escapeHtml(q.topic)}</span>
              <span class="tag">${escapeHtml(q.difficulty)}</span>
              <span class="tag">${escapeHtml(q.source)}</span>
            </div>
            <h2 class="prompt">${escapeHtml(q.prompt)}</h2>
          </div>
          <div class="progress-wrap">
            <strong>${state.index + 1} / ${state.questions.length}</strong>
            <div class="progress" aria-hidden="true"><span style="width:${width}%"></span></div>
          </div>
        </div>
        <div class="choices">
          ${letters.map((letter) => {
            const isCorrect = q.answer === letter;
            const isChosen = chosen === letter;
            const cls = answered && isCorrect ? " correct" : answered && isChosen ? " wrong" : "";
            return `
              <button class="choice${cls}" type="button" data-choice="${letter}" ${answered ? "disabled" : ""}>
                <span class="letter">${letter}</span>
                <span>${escapeHtml(q.choices[letter])}</span>
              </button>
            `;
          }).join("")}
        </div>
        ${answered ? renderFeedback(q, chosen) : ""}
      </div>
    `;

    document.querySelectorAll(".choice").forEach((button) => {
      button.addEventListener("click", () => answerQuestion(button.dataset.choice));
    });
    const next = document.querySelector("#next-question");
    if (next) {
      next.focus();
      next.addEventListener("click", () => {
        state.index += 1;
        state.selected = null;
        renderQuestion();
      });
    }
    const quit = document.querySelector("#quit");
    if (quit) {
      quit.addEventListener("click", renderHome);
    }
  }

  function renderFeedback(q, chosen) {
    const correct = chosen === q.answer;
    return `
      <div class="feedback ${correct ? "good" : "bad"}">
        <strong>${correct ? "Correct." : `Nope. Correct answer: ${q.answer.toUpperCase()}.`}</strong>
        <p class="muted">${escapeHtml(q.explanation)}</p>
        <div class="actions">
          <button id="next-question" class="primary" type="button">${state.index + 1 === state.questions.length ? "Finish" : "Next"}</button>
          <button id="quit" class="ghost" type="button">Quit</button>
        </div>
      </div>
    `;
  }

  function answerQuestion(choice) {
    if (state.selected !== null) return;
    const q = state.questions[state.index];
    state.selected = choice;
    state.answers.push({
      id: q.id,
      module: q.module,
      topic: q.topic,
      correct: choice === q.answer,
      chosen: choice
    });
    renderQuestion();
  }

  function renderResults() {
    updateTopStats();
    const correct = state.answers.filter((a) => a.correct).length;
    const pct = state.answers.length ? Math.round((correct / state.answers.length) * 100) : 0;
    const byModule = modules
      .map((module) => {
        const rows = state.answers.filter((a) => a.module === module);
        const ok = rows.filter((a) => a.correct).length;
        return { module, total: rows.length, ok };
      })
      .filter((row) => row.total);
    const misses = state.answers.filter((a) => !a.correct);
    const weakTopics = [...misses.reduce((map, miss) => {
      map.set(miss.topic, (map.get(miss.topic) || 0) + 1);
      return map;
    }, new Map())]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    app.innerHTML = `
      <div class="results">
        <div class="split">
          <div class="mini-panel">
            <div class="big-score">${pct}%</div>
            <p class="muted">${correct} correct out of ${state.answers.length}. ${pct >= 85 ? "That is real exam-day shape." : "Good. Now attack the misses."}</p>
            <div class="actions">
              <button id="retry-missed" class="primary" type="button" ${misses.length ? "" : "disabled"}>Retry missed</button>
              <button id="again" class="secondary" type="button">Fresh mixed set</button>
              <button id="home" class="ghost" type="button">Home</button>
            </div>
          </div>
          <div class="mini-panel">
            <h3>Weak spots</h3>
            <div class="weak-list">
              ${weakTopics.length ? weakTopics.map(([topic, count]) => `<span class="tag">${escapeHtml(topic)}: ${count}</span>`).join("") : `<span class="muted">No misses in this set.</span>`}
            </div>
          </div>
        </div>
        <div class="mini-panel" style="margin-top:18px">
          <h3>Module accuracy</h3>
          ${byModule.map((row) => `
            <div class="result-row">
              <span>${escapeHtml(row.module)}</span>
              <span class="muted">${row.ok} / ${row.total}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    document.querySelector("#retry-missed").addEventListener("click", () => {
      const missedIds = new Set(misses.map((m) => m.id));
      const retry = state.questions.filter((q) => missedIds.has(q.id));
      startQuiz(state.lastConfig || { module: "mixed", count: retry.length, shuffle: true }, retry);
    });
    document.querySelector("#again").addEventListener("click", () => {
      startQuiz({ module: "mixed", count: Math.min(40, window.CS448_QUESTIONS.length), shuffle: true });
    });
    document.querySelector("#home").addEventListener("click", renderHome);
  }

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (letters.includes(key) && state.questions.length && state.selected === null) {
      answerQuestion(key);
    }
    if (event.key === "Enter") {
      const next = document.querySelector("#next-question");
      if (next) next.click();
    }
  });

  renderHome();
})();

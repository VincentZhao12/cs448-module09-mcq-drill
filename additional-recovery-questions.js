(function () {
  "use strict";

  const authored = [
    {
      module: "Crash Recovery",
      topic: "Commit durability",
      difficulty: "Medium",
      prompt: "A transaction has updated several pages, and none of those pages has been written to disk yet. Under a no-force policy with write-ahead logging, what must be forced to stable storage before the DBMS can report the transaction as committed?",
      choices: { a: "All data pages updated by the transaction", b: "The transaction's log records through its commit record", c: "Only the most recent checkpoint record", d: "No records, because no-force delays all persistent writes" },
      answer: "b",
      explanation: "No-force lets dirty data pages remain in memory at commit, but durability requires the log through the commit record to be stable so the updates can be redone."
    },
    {
      module: "Crash Recovery",
      topic: "Fuzzy checkpoints",
      difficulty: "Hard",
      prompt: "Why can a fuzzy checkpoint complete without first forcing every dirty data page to disk?",
      choices: { a: "It records enough recovery metadata, such as dirty pages and active transactions, for recovery to find the needed redo and undo work", b: "It disables steal until all active transactions commit", c: "It makes all earlier log records unnecessary immediately", d: "It converts every uncommitted update into a committed update" },
      answer: "a",
      explanation: "A fuzzy checkpoint captures the state needed to restart recovery without pausing normal page flushing or forcing all dirty pages immediately."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES repeat history",
      difficulty: "Hard",
      prompt: "In ARIES restart recovery, why does the redo phase repeat updates from both committed transactions and loser transactions before undo begins?",
      choices: { a: "Redo reconstructs the database state as it was at the instant of the crash, including loser updates that undo will later roll back using compensation log records", b: "Redo commits every transaction whose update record appears in the log, so there are no loser transactions left to undo", c: "Redo must skip committed updates until undo finishes, because only loser updates can be safely repeated first", d: "Redo scans the log backward and therefore reaches only updates that were already undone before the crash" },
      answer: "a",
      explanation: "ARIES uses redo to repeat history: it first restores the crash-time state of the database, even if that state includes updates from transactions that did not commit. The undo phase then rolls back those loser transactions and writes CLRs so that the rollback work itself is recoverable."
    }
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    const start = window.DBMS_QUESTIONS.length + 1;
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `additional-recovery-${start + index}`,
      source: question.module
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

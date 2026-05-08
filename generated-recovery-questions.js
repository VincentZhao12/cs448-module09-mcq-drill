(function () {
  "use strict";

  const authored = [
    {
      module: "Crash Recovery",
      topic: "WAL ordering",
      difficulty: "Medium",
      prompt: "A transaction updates page P using log record LSN 130, then later commits at LSN 170. Before the buffer manager writes P to disk, which WAL condition must be true?",
      choices: { a: "The log must be flushed at least through LSN 130", b: "The page must be forced only after the transaction's end record is written", c: "Every dirty page in the database must be flushed first", d: "The transaction table must no longer contain the transaction" },
      answer: "a",
      explanation: "The page-write rule of WAL requires the update log record describing a page change to be on stable storage before the changed page reaches disk. The later commit and end records are separate concerns.",
    },
    {
      module: "Crash Recovery",
      topic: "Commit protocol",
      difficulty: "Medium",
      prompt: "Under write-ahead logging with no-force, what must be forced to stable storage before a transaction may be reported as committed?",
      choices: { a: "All data pages updated by the transaction", b: "All log records for the transaction through its commit record", c: "Only the transaction's first update log record", d: "The latest checkpoint's dirty page table" },
      answer: "b",
      explanation: "No-force does not require updated data pages to be written at commit. Durability is provided by forcing the transaction's log records, including the commit record, so the changes can be redone after a crash.",
    },
    {
      module: "Crash Recovery",
      topic: "Steal and no-force",
      difficulty: "Medium",
      prompt: "Why is the steal/no-force combination attractive but recovery-intensive?",
      choices: { a: "It improves buffer flexibility and commit latency, but requires both undo and redo support", b: "It prevents dirty pages from ever reaching disk, but requires long checkpoints", c: "It eliminates logging, but requires strict two-phase locking", d: "It forces all pages at commit, but requires undo of committed data" },
      answer: "a",
      explanation: "Steal allows frames containing uncommitted updates to be written, so undo may be needed. No-force lets commits return without forcing data pages, so redo may be needed.",
    },
    {
      module: "Crash Recovery",
      topic: "Fuzzy checkpoints",
      difficulty: "Hard",
      prompt: "A fuzzy checkpoint writes an end_checkpoint record containing the transaction table and dirty page table. Which statement best describes what that checkpoint guarantees?",
      choices: { a: "It gives a restart snapshot to begin analysis, while transactions and page flushing may have continued during the checkpoint", b: "It guarantees every dirty page listed in the checkpoint has already reached disk", c: "It guarantees no transaction active at begin_checkpoint can commit before end_checkpoint", d: "It makes all log records before begin_checkpoint unnecessary for any future recovery" },
      answer: "a",
      explanation: "A fuzzy checkpoint captures useful restart state without stopping normal processing or forcing dirty pages. Recovery still scans forward from the checkpoint and may need older changes if they remain reflected in recLSN values.",
    },
    {
      module: "Crash Recovery",
      topic: "Dirty page table",
      difficulty: "Hard",
      prompt: "During ARIES analysis, page P is not currently in the dirty page table. The scan encounters an update to P at LSN 420. What entry should analysis create for P?",
      choices: { a: "P with recLSN 420", b: "P with recLSN equal to the transaction's first log record", c: "P with recLSN equal to the latest checkpoint LSN", d: "No entry until P is updated a second time" },
      answer: "a",
      explanation: "When analysis first discovers that a page became dirty after the reconstructed checkpoint state, it adds the page to the dirty page table with recLSN equal to that first dirtying update's LSN.",
    },
    {
      module: "Crash Recovery",
      topic: "recLSN semantics",
      difficulty: "Medium",
      prompt: "What does the recLSN for a page in the dirty page table represent?",
      choices: { a: "The earliest log record that might need redo for that page", b: "The most recent committed transaction that touched the page", c: "The LSN stored in the page header after every disk flush", d: "The next log record to undo for the page" },
      answer: "a",
      explanation: "recLSN is the LSN of the update that first made the page dirty in the current dirty interval. Redo can start at the smallest recLSN because earlier updates are known not to require repeating for dirty pages.",
    },
    {
      module: "Crash Recovery",
      topic: "Transaction table",
      difficulty: "Hard",
      prompt: "During analysis, the scan sees an end record for transaction T. What should happen to T in the transaction table?",
      choices: { a: "Remove T from the transaction table", b: "Mark T as a loser transaction", c: "Set T's lastLSN to the checkpoint LSN", d: "Move every page T updated out of the dirty page table" },
      answer: "a",
      explanation: "An end record means commit or abort processing has fully completed for the transaction, so restart no longer needs a transaction table entry for it.",
    },
    {
      module: "Crash Recovery",
      topic: "Analysis winners and losers",
      difficulty: "Hard",
      prompt: "After analysis, T1 has status committed and lastLSN pointing to its commit record, T2 has status running, and T3 has status aborting with no end record. Which transactions are losers for undo?",
      choices: { a: "T2 and T3", b: "Only T1", c: "T1 and T2", d: "All three transactions" },
      answer: "a",
      explanation: "Transactions that have not completed with an end record and have not committed are losers. A committed transaction may need an end record, but its updates are not undone.",
    },
    {
      module: "Crash Recovery",
      topic: "Redo starting point",
      difficulty: "Medium",
      prompt: "After analysis, the dirty page table contains P1 with recLSN 90, P2 with recLSN 140, and P3 with recLSN 110. Where should ARIES redo begin scanning?",
      choices: { a: "LSN 90", b: "LSN 110", c: "LSN 140", d: "The first loser transaction's lastLSN" },
      answer: "a",
      explanation: "Redo begins at the smallest recLSN in the dirty page table, since that is the earliest update that might not have made it to disk.",
    },
    {
      module: "Crash Recovery",
      topic: "Redo skip tests",
      difficulty: "Hard",
      prompt: "During redo, an update log record at LSN 300 affects page P. The dirty page table contains P with recLSN 350. What should redo do with the LSN 300 record?",
      choices: { a: "Skip it because P's recLSN is greater than the log record's LSN", b: "Redo it because P appears in the dirty page table", c: "Undo it because it precedes P's recLSN", d: "Redo it only if the transaction committed before the crash" },
      answer: "a",
      explanation: "If a page's recLSN is greater than the record's LSN, the page was not considered dirty from that earlier record, so that action is not a candidate for redo in the current dirty interval.",
    },
    {
      module: "Crash Recovery",
      topic: "pageLSN",
      difficulty: "Hard",
      prompt: "Redo reads page P from disk and finds pageLSN 800. The log record being considered is an update to P at LSN 760, and P's recLSN is 700. What should redo do?",
      choices: { a: "Skip the update because the disk page already reflects at least LSN 760", b: "Redo the update because 760 is greater than recLSN 700", c: "Undo the update because pageLSN is larger than the log record", d: "Reset pageLSN to 700 and continue" },
      answer: "a",
      explanation: "The pageLSN records the latest update reflected on the disk page. If pageLSN is at least the log record's LSN, the action is already present and should not be reapplied.",
    },
    {
      module: "Crash Recovery",
      topic: "Repeating history",
      difficulty: "Hard",
      prompt: "ARIES redo repeats history. Which action is consistent with that principle?",
      choices: { a: "Redo updates and CLRs for both committed and loser transactions when the redo tests say they are needed", b: "Redo only the updates of transactions that committed before the crash", c: "Undo all loser updates before the redo scan begins", d: "Skip every CLR because CLRs are generated during undo" },
      answer: "a",
      explanation: "ARIES reconstructs the database state as of the crash by redoing all necessary history, including loser updates and prior undo actions recorded as CLRs. Losers are cleaned up afterward in the undo phase.",
    },
    {
      module: "Crash Recovery",
      topic: "Compensation log records",
      difficulty: "Medium",
      prompt: "What is the main purpose of a compensation log record in ARIES?",
      choices: { a: "To record an undo action so recovery can redo that undo if another crash occurs", b: "To replace the original update log record and shrink the log immediately", c: "To mark a transaction as committed after all pages are flushed", d: "To store the dirty page table inside every data page" },
      answer: "a",
      explanation: "ARIES logs its undo actions with CLRs. Because CLRs are redoable and are not undone, a crash during rollback can resume without losing track of work already undone.",
    },
    {
      module: "Crash Recovery",
      topic: "Undo with CLRs",
      difficulty: "Hard",
      prompt: "During undo, recovery encounters a CLR whose undonextLSN is 240. What should it do for that transaction?",
      choices: { a: "Add LSN 240 to ToUndo and continue backward from there", b: "Undo the CLR by restoring the after-image of the original update", c: "Write another CLR for the CLR and then stop the transaction", d: "Redo every log record between 240 and the CLR" },
      answer: "a",
      explanation: "CLRs are not undone. Their undonextLSN field tells recovery where to continue the backward undo chain, skipping work that the CLR already compensated.",
    },
    {
      module: "Crash Recovery",
      topic: "Undo ordering",
      difficulty: "Hard",
      prompt: "ARIES undo has ToUndo = {120, 450, 300}. Which LSN is normally processed next, and why?",
      choices: { a: "450, because undo works backward by repeatedly choosing the largest outstanding LSN", b: "120, because undo must start with the oldest update in the log", c: "300, because undo chooses the median LSN to balance transactions", d: "The checkpoint LSN, because ToUndo is only advisory" },
      answer: "a",
      explanation: "The undo phase proceeds backward through loser transactions' log chains, typically selecting the largest LSN in ToUndo at each step.",
    },
    {
      module: "Crash Recovery",
      topic: "Crash during restart",
      difficulty: "Hard",
      prompt: "A crash occurs during the undo phase after recovery wrote a CLR for undoing transaction T's update at LSN 600. On the next restart, how does ARIES avoid undoing that original update a second time?",
      choices: { a: "The CLR is redone during repeat-history redo, and its undonextLSN directs undo to the next earlier record", b: "The original update record is deleted from the log before the second restart", c: "The transaction is treated as committed because a CLR exists", d: "The dirty page table permanently removes every page touched by T" },
      answer: "a",
      explanation: "CLRs make restart idempotent across repeated crashes. Redo repeats the recorded undo, and undo follows undonextLSN rather than undoing the compensated update again.",
    },
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    const start = window.DBMS_QUESTIONS.length + 1;
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `generated-recovery-${start + index}`,
      source: question.module,
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

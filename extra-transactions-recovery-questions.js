(function () {
  "use strict";

  const authored = [
    {
      module: "Transaction Management",
      topic: "Conflict serializability",
      difficulty: "Hard",
      prompt: "In the schedule r1(A), w2(A), r2(B), w1(B), c1, c2, ri(X) means transaction Ti reads X, wi(X) means Ti writes X, and ci means Ti commits. Which statement is correct?",
      choices: { a: "It is conflict-serializable with equivalent order T1 before T2", b: "It is conflict-serializable with equivalent order T2 before T1", c: "It is not conflict-serializable because the precedence graph has a cycle", d: "It is not recoverable because T1 commits before T2" },
      answer: "c",
      explanation: "The conflict on A gives edge T1 -> T2, while the conflict on B gives edge T2 -> T1, so the precedence graph has a cycle."
    },
    {
      module: "Transaction Management",
      topic: "Recoverable schedules",
      difficulty: "Medium",
      prompt: "T1 writes X, T2 reads the uncommitted value of X written by T1, and then T2 commits while T1 is still uncommitted. If T1 later aborts, what is the most precise problem with the schedule?",
      choices: { a: "It is unrecoverable because T2 committed after reading uncommitted data", b: "It is conflict-serializable but not view-serializable", c: "It is strict because T2 committed first", d: "It only violates durability, not recoverability" },
      answer: "a",
      explanation: "A transaction that reads another transaction's uncommitted value must not commit before the writer commits; otherwise the schedule is unrecoverable."
    },
    {
      module: "Transaction Management",
      topic: "Cascading aborts",
      difficulty: "Medium",
      prompt: "T1 writes row R. Before T1 commits, T2 reads T1's uncommitted value of R and updates S. Before T2 commits, T3 reads T2's uncommitted value of S. If T1 aborts, which outcome illustrates cascading aborts?",
      choices: { a: "Only T1 must be undone because T2 and T3 touched different rows", b: "T2 and T3 must also abort because their work depends on uncommitted data derived from T1", c: "T2 can commit safely if T3 has not committed", d: "T3 must commit before T2 to preserve serial order" },
      answer: "b",
      explanation: "Cascading aborts occur when transactions that read data derived from an aborted transaction must also be rolled back."
    },
    {
      module: "Transaction Management",
      topic: "Strict schedules",
      difficulty: "Medium",
      prompt: "A DBMS rule says that once T writes item X, no other transaction may read or write X until T either commits or aborts. What class of schedules does this rule enforce?",
      choices: { a: "Strict schedules", b: "Unrecoverable schedules", c: "View-serializable schedules only", d: "Schedules with no read-write conflicts" },
      answer: "a",
      explanation: "Strict schedules delay both reads and writes of an item written by an uncommitted transaction, which prevents dirty reads and dirty writes."
    },
    {
      module: "Transaction Management",
      topic: "Isolation anomalies",
      difficulty: "Medium",
      prompt: "Two transactions both read inventory count X = 10. T1 writes X = 9 and commits; T2, based on its earlier read, writes X = 8 and commits. Which anomaly occurred?",
      choices: { a: "Lost update", b: "Phantom read", c: "Fuzzy checkpoint", d: "Cascading rollback" },
      answer: "a",
      explanation: "T2 overwrote T1's committed change using a stale value, so one update was lost."
    },
    {
      module: "Transaction Management",
      topic: "Serial equivalence",
      difficulty: "Hard",
      prompt: "T1 transfers $10 from A to B, and T2 computes A + B. In an interleaving, T2 reads A after T1 debits it but reads B before T1 credits it. What is the best characterization?",
      choices: { a: "The schedule is equivalent to running T1 before T2", b: "The schedule is equivalent to running T2 before T1", c: "T2 can observe a state that is not produced by any serial order", d: "The schedule is serial because each individual read is atomic" },
      answer: "c",
      explanation: "T2 sees only half of T1's transfer, so its observed sum may match neither serial order."
    },
    {
      module: "Concurrency Control",
      topic: "Two-phase locking",
      difficulty: "Medium",
      prompt: "After releasing its shared lock on A, a transaction later requests an exclusive lock on B. Why does this violate basic two-phase locking?",
      choices: { a: "A transaction may not acquire any new lock after it has released a lock", b: "Shared locks must always be held until system shutdown", c: "Exclusive locks must be requested before shared locks", d: "Two-phase locking allows locks only on two objects" },
      answer: "a",
      explanation: "Under two-phase locking, a transaction has a growing phase for acquiring locks and a shrinking phase after the first release."
    },
    {
      module: "Concurrency Control",
      topic: "Strict two-phase locking",
      difficulty: "Medium",
      prompt: "Under strict two-phase locking, T1 has written X and still holds its exclusive lock. What must happen before T2 can read X?",
      choices: { a: "T2 must wait until T1 commits or aborts and releases the lock", b: "T2 may read X immediately if it promises not to write X", c: "T2 may read X if it has a smaller timestamp than T1", d: "T1 must downgrade the lock as soon as the write operation finishes" },
      answer: "a",
      explanation: "Strict 2PL holds exclusive locks until commit or abort, preventing other transactions from reading uncommitted writes."
    },
    {
      module: "Concurrency Control",
      topic: "Deadlocks",
      difficulty: "Medium",
      prompt: "T1 holds an exclusive lock on A and requests B. T2 holds an exclusive lock on B and requests A. What does the waits-for graph contain?",
      choices: { a: "A cycle T1 -> T2 -> T1, indicating deadlock", b: "A single edge T1 -> T2, so no deadlock is possible", c: "No edge because both transactions already hold locks", d: "Two edges from each data item to itself" },
      answer: "a",
      explanation: "Each transaction is waiting for the other to release a lock, creating a cycle in the waits-for graph."
    },
    {
      module: "Concurrency Control",
      topic: "Multiple granularity locking",
      difficulty: "Hard",
      prompt: "T1 holds an IS lock on table T because it will read individual rows. T2 wants an IX lock on T because it will update selected rows. At the table level, what should the lock manager do?",
      choices: { a: "Grant the IX lock because IS and IX are compatible", b: "Block the IX lock because any intent locks conflict", c: "Upgrade T1 to S automatically", d: "Abort T1 because readers cannot coexist with writers" },
      answer: "a",
      explanation: "IS and IX table locks are compatible; conflicts are checked at lower-level objects when row locks are requested."
    },
    {
      module: "Concurrency Control",
      topic: "Predicate locking",
      difficulty: "Hard",
      prompt: "T1 executes SELECT COUNT(*) FROM Orders WHERE amount > 1000 twice. Between the reads, T2 inserts a new order with amount = 1500 and commits. Which phenomenon can T1 observe without predicate or range protection?",
      choices: { a: "A phantom", b: "A dirty write", c: "A torn page", d: "A non-repeatable read of an existing row only" },
      answer: "a",
      explanation: "The inserted row newly satisfies T1's predicate, so the second predicate read can see a phantom."
    },
    {
      module: "Concurrency Control",
      topic: "Timestamp ordering",
      difficulty: "Hard",
      prompt: "Under timestamp ordering, TS(T1)=10 and TS(T2)=20. T2 has already read object X, so RTS(X)=20. T1 now tries to write X. What should happen?",
      choices: { a: "Allow the write because T1 is older", b: "Abort T1 because a younger transaction has already read the old value of X", c: "Delay T1 until T2 commits, then allow the write", d: "Allow the write and set RTS(X)=10" },
      answer: "b",
      explanation: "If TS(T) is less than RTS(X), T cannot write X because doing so would invalidate a read by a transaction that should appear later."
    },
    {
      module: "Concurrency Control",
      topic: "Thomas Write Rule",
      difficulty: "Hard",
      prompt: "Using Thomas Write Rule, transaction T has TS(T)=15 and attempts to write X, but WTS(X)=20 and RTS(X)=10. What should the system do?",
      choices: { a: "Ignore T's obsolete write without aborting T", b: "Abort T because WTS(X) is greater than TS(T)", c: "Allow the write and set WTS(X)=15", d: "Block T until the transaction with timestamp 20 commits" },
      answer: "a",
      explanation: "Thomas Write Rule permits skipping an obsolete write when TS(T) < WTS(X), as a newer write is already in the serialization order."
    },
    {
      module: "Crash Recovery",
      topic: "Write-ahead logging",
      difficulty: "Medium",
      prompt: "A transaction updates page P with log record LSN 240. The buffer manager wants to flush P, but the stable log is forced only through LSN 210. What must happen before P can be flushed?",
      choices: { a: "Force the log at least through LSN 240", b: "Force only the transaction's commit record", c: "Undo the update on P before flushing", d: "Wait for the next checkpoint even if the log is forced" },
      answer: "a",
      explanation: "WAL requires every log record describing a page update to reach stable storage before the updated page is written."
    },
    {
      module: "Crash Recovery",
      topic: "Steal and no-force policies",
      difficulty: "Medium",
      prompt: "A system uses steal and no-force buffer policies. Which recovery capabilities are required?",
      choices: { a: "Undo only, because committed pages are always forced at commit", b: "Redo only, because uncommitted pages are never written", c: "Both undo and redo", d: "Neither undo nor redo if checkpoints are frequent" },
      answer: "c",
      explanation: "Steal can write uncommitted updates and therefore needs undo; no-force may leave committed updates only in memory and therefore needs redo."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES analysis",
      difficulty: "Hard",
      prompt: "At the end of ARIES analysis after a crash, T1 has a commit log record but no end record, and T2 has update records but no commit or abort record. How are they classified?",
      choices: { a: "T1 is a loser and T2 is a winner", b: "Both T1 and T2 are winners", c: "T1 is a winner that needs cleanup; T2 is a loser to be undone", d: "Both T1 and T2 must be redone but neither can be undone" },
      answer: "c",
      explanation: "A transaction with a commit record is a winner even if its end record is missing, while a transaction without commit or abort completion is a loser."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES redo",
      difficulty: "Hard",
      prompt: "During ARIES redo, an update log record for page P has LSN 500. P is in the dirty page table with recLSN 450, and the page read from disk has pageLSN 520. What should recovery do?",
      choices: { a: "Redo the update because 500 is at or after recLSN 450", b: "Skip the update because the disk page already reflects an update at least as recent as LSN 500", c: "Undo the update because pageLSN is greater than recLSN", d: "Remove P from the dirty page table and restart analysis" },
      answer: "b",
      explanation: "Redo is skipped when the page's pageLSN on disk is greater than or equal to the log record's LSN."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES undo",
      difficulty: "Hard",
      prompt: "During ARIES undo, recovery undoes T3's update log record at LSN 700 whose prevLSN is 620. What log record is written, and what is placed back into ToUndo for T3?",
      choices: { a: "A compensation log record is written, and LSN 620 is added to ToUndo", b: "A commit record is written, and LSN 700 is added to ToUndo again", c: "No log record is written, and T3 is removed from ToUndo", d: "A begin-checkpoint record is written, and all earlier T3 records are skipped" },
      answer: "a",
      explanation: "ARIES logs undo actions using CLRs and then continues backward through the transaction's prevLSN chain."
    }
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    const start = window.DBMS_QUESTIONS.length + 1;
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `draft-trx-recovery-${start + index}`,
      source: question.module
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

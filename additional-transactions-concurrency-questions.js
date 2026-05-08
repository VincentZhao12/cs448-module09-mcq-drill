(function () {
  "use strict";

  const authored = [
    {
      id: "additional-trx-concurrency-1",
      module: "Concurrency Control",
      topic: "Lock conversion",
      difficulty: "Medium",
      prompt: "T1 holds a shared lock on row R after reading it. Later, T1 decides to update R. What should a lock-based DBMS do before allowing the write?",
      choices: { a: "Upgrade T1's shared lock to an exclusive lock when no incompatible locks remain", b: "Allow the write because a shared lock already proves T1 has access to R", c: "Release the shared lock and let T1 write without any lock", d: "Abort every other transaction that has read R, even if T1 can wait" },
      answer: "a",
      explanation: "A write requires an exclusive lock, so the shared lock must be converted once conflicting shared locks are gone."
    },
    {
      id: "additional-trx-concurrency-2",
      module: "Concurrency Control",
      topic: "Deadlock prevention",
      difficulty: "Hard",
      prompt: "In the wait-die deadlock prevention scheme, T1 has timestamp 10 and T2 has timestamp 30, where smaller timestamps mean older transactions. T2 holds a lock that T1 requests. What happens?",
      choices: { a: "T1 waits because the requester is older than the holder", b: "T1 aborts because older transactions never wait", c: "T2 aborts because younger lock holders are always preempted", d: "Both transactions wait until timeout detection finds a cycle" },
      answer: "a",
      explanation: "Wait-die lets an older requester wait for a younger holder; a younger requester would abort instead."
    },
    {
      id: "additional-trx-concurrency-3",
      module: "Concurrency Control",
      topic: "Optimistic concurrency control",
      difficulty: "Hard",
      prompt: "Under optimistic concurrency control, T1 reads X and later enters validation. Meanwhile, T2 committed after writing X during T1's read phase. Why may T1 have to abort?",
      choices: { a: "T1 may have read a value invalidated by T2's committed write", b: "Optimistic methods abort every transaction that performs a read", c: "T2's commit is undone because readers always have priority", d: "Validation ignores read and write sets and checks only lock compatibility" },
      answer: "a",
      explanation: "Validation checks whether committed writes overlap the transaction's reads; such an overlap can make T1's execution nonserializable."
    }
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    window.DBMS_QUESTIONS.push(...authored.map((question) => ({
      ...question,
      source: question.module
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

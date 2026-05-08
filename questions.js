(function () {
  "use strict";

  const questions = [
    {
      module: "Query Processing Algorithms",
      source: "Join cost",
      topic: "Join algorithms",
      difficulty: "Hard",
      prompt: "Relations R and S occupy 100 and 1,000 pages respectively, and R contains 10,000 tuples. If tuple-oriented nested-loops join scans R as the outer relation, what is the I/O cost?",
      choices: { a: "100 + 100 * 1,000", b: "100 + 10,000 * 1,000", c: "1,000 + 1,000 * 100", d: "100 + ceil(100 / 20) * 1,000" },
      answer: "b",
      explanation: "Tuple-oriented nested-loops join scans the inner relation once per outer tuple, so the cost is Nr + |R| * Ns.",
      wrongExplanations: {
        a: "This uses the number of outer pages as the repeat count, which is block nested-loops reasoning rather than tuple-oriented nested loops.",
        c: "This switches S to the outer relation and still uses page counts, not the 10,000 outer tuples from R.",
        d: "This is the block nested-loops formula with 20-page outer blocks, not tuple-oriented nested loops."
      }
    },
    {
      module: "Query Processing Algorithms",
      source: "Join cost",
      topic: "Block nested-loops join",
      difficulty: "Hard",
      prompt: "Relations R and S occupy 100 and 1,000 pages respectively. With a block size of 20 pages for the outer relation, what is the I/O cost of block nested-loops join using R as the outer relation?",
      choices: { a: "100 + 10,000 * 1,000", b: "100 + 100 * 1,000", c: "100 + ceil(100 / 20) * 1,000", d: "1,000 + ceil(100 / 20) * 100" },
      answer: "c",
      explanation: "Block nested-loops join reads the outer relation once and scans the inner relation once per outer block: Nr + ceil(Nr / B) * Ns."
    },
    {
      module: "Query Optimization",
      source: "Selectivity",
      topic: "Selectivity",
      difficulty: "Hard",
      prompt: "A relation has a non-key attribute A with 50 distinct values. Under a uniform-distribution assumption, what selectivity should the optimizer estimate for the predicate A = c?",
      choices: { a: "1 / |R|", b: "1 / 50", c: "50 / |R|", d: "max(A) - min(A)" },
      answer: "b",
      explanation: "For equality on a non-key attribute, the usual estimate is 1 divided by the number of distinct values.",
      wrongExplanations: {
        a: "That estimate is appropriate for equality on a key, where at most one tuple matches, not for a non-key attribute.",
        c: "This divides the distinct-value count by the relation size; selectivity should be the fraction of tuples expected to match one value.",
        d: "The numeric range does not give the equality selectivity unless it is first translated into distinct value counts."
      }
    },
    {
      module: "Concurrency Control",
      source: "Timestamp ordering",
      topic: "Timestamp ordering",
      difficulty: "Hard",
      prompt: "Transaction T has timestamp 7. Object O has read timestamp 9 and write timestamp 4. Under basic timestamp ordering, what happens when T tries to write O?",
      choices: { a: "The write succeeds because WTS(O) < TS(T)", b: "T waits until the transaction with timestamp 9 commits", c: "T aborts because RTS(O) > TS(T)", d: "The write is ignored by Thomas Write Rule because WTS(O) < TS(T)" },
      answer: "c",
      explanation: "A younger transaction has already read the old value, so allowing the older write would violate timestamp order."
    },
    {
      module: "Crash Recovery",
      source: "WAL",
      topic: "Write-ahead logging",
      difficulty: "Hard",
      prompt: "A dirty page has pageLSN 80, while the stable log has been flushed only through LSN 70. Under write-ahead logging, can the DBMS flush that page to disk now?",
      choices: { a: "Yes, because the pageLSN is newer than the flushedLSN", b: "No, the log must be flushed at least through LSN 80 first", c: "Yes, if the transaction that dirtied the page has committed", d: "No, pages are never flushed under a no-force policy" },
      answer: "b",
      explanation: "WAL requires the log record for an update to reach stable storage before the corresponding dirty data page is written.",
      wrongExplanations: {
        a: "A newer pageLSN is exactly the problem: the corresponding log record has not reached stable storage yet.",
        c: "Commit status does not override WAL; the update log record still must be flushed before the dirty page.",
        d: "No-force means dirty pages are not required at commit, but they may still be flushed later once WAL is satisfied."
      }
    },
    {
      module: "Crash Recovery",
      source: "ARIES",
      topic: "ARIES redo",
      difficulty: "Hard",
      prompt: "During ARIES redo, recovery sees an update log record with LSN 50 for page P. The dirty page table contains P with recLSN 60. What should recovery do with that log record?",
      choices: { a: "Redo it because all update records repeat history", b: "Skip it because P's recLSN is greater than the log record's LSN", c: "Undo it because it is before recLSN", d: "Write a compensation log record immediately" },
      answer: "b",
      explanation: "If recLSN is greater than the log record's LSN, that log record did not cause the dirty page state that may need redo."
    }
  ];

  window.DBMS_QUESTIONS = questions.map((question, index) => ({
    ...question,
    id: `core-${index + 1}`
  }));
})();

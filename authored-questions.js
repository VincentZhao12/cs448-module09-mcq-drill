(function () {
  "use strict";

  const authored = [
    {
      module: "Query Processing Algorithms",
      topic: "External sorting",
      difficulty: "Medium",
      prompt: "A relation occupies N = 64 disk pages. Using two-way merge sort with the optimization that combines the initial local sort and first merge pass, what is the total I/O cost?",
      choices: { a: "128 I/Os", b: "384 I/Os", c: "768 I/Os", d: "896 I/Os" },
      answer: "c",
      explanation: "With the combined pass, cost is 2N * ceil(log2 N) = 2 * 64 * 6 = 768."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Selection with indexes",
      difficulty: "Hard",
      prompt: "A table has an unclustered tree index on A. A range predicate A > 100 qualifies many tuples. What should the optimizer usually prefer?",
      choices: { a: "Use the unclustered index and fetch each qualifying tuple immediately", b: "Use a hash index on A", c: "Perform a table scan", d: "Use the index only if the output must be sorted" },
      answer: "c",
      explanation: "For many qualifying tuples, an unclustered range scan can cause many random page reads, making a table scan preferable."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Join algorithms",
      difficulty: "Hard",
      prompt: "Relations r and s have Nr = 100 pages, Ns = 1000 pages, |r| = 10,000 tuples, and |s| = 50,000 tuples. For tuple-oriented nested-loops join, which outer relation gives the lower I/O cost?",
      choices: { a: "r as outer, with cost 10,000,100 I/Os", b: "s as outer, with cost 5,001,000 I/Os", c: "r as outer, with cost 100,100 I/Os", d: "s as outer, with cost 101,000 I/Os" },
      answer: "b",
      explanation: "Tuple nested-loops cost is outer pages plus outer tuples times inner pages; using s as outer gives 1000 + 50,000 * 100."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Iterator model",
      difficulty: "Medium",
      prompt: "In the iterator model, a parent operator calls GetNext() on its child only when it needs another tuple. What evaluation style does this represent?",
      choices: { a: "Eager push-based evaluation", b: "Lazy pull-based evaluation", c: "Batch-only evaluation", d: "Materialized-only evaluation" },
      answer: "b",
      explanation: "The iterator model is lazy and pull-based: tuples are produced only when requested."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Select iterator",
      difficulty: "Medium",
      prompt: "A select operator receives tuples from a table scan below it. Its predicate rejects the first three tuples and accepts the fourth. What should one GetNext() call to the select operator return?",
      choices: { a: "The first rejected tuple", b: "Null immediately after the first rejection", c: "The fourth tuple, after repeatedly requesting tuples from below", d: "All four tuples as a batch" },
      answer: "c",
      explanation: "Select keeps calling GetNext() below until it finds a tuple satisfying the predicate or reaches the end."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Physical query plans",
      difficulty: "Hard",
      prompt: "A logical plan joins A, B, and C. Table A is already sorted on its join attribute, and a selection on A preserves that order. Which physical plan choice best uses this property?",
      choices: { a: "Use a sort-merge join without sorting A again", b: "Force tuple nested-loops join for all joins", c: "Materialize A into a temporary table before every GetNext()", d: "Ignore the ordering because selections always destroy sort order" },
      answer: "a",
      explanation: "If A is already sorted and the selection preserves order, sort-merge join can avoid sorting A."
    },
    {
      module: "Query Optimization",
      topic: "Index cost estimation",
      difficulty: "Hard",
      prompt: "A B+-tree index has height 3. It is used for an equality predicate on a key attribute, and the index stores key-tid pairs. What cost estimate should be used to retrieve the matching tuple?",
      choices: { a: "3 I/Os", b: "4 I/Os", c: "Height plus the number of leaf pages", d: "Height times the number of duplicate values" },
      answer: "b",
      explanation: "For equality on a key with key-tid entries, cost is height plus one data-page fetch."
    },
    {
      module: "Query Optimization",
      topic: "Join selectivity",
      difficulty: "Hard",
      prompt: "Orders has 100,000 tuples and Customers has 10,000 tuples. Orders.customer_id is a foreign key referencing Customers.customer_id. What is the estimated selectivity of the join?",
      choices: { a: "1/100,000", b: "1/10,000", c: "10,000/100,000", d: "100,000 * 10,000" },
      answer: "b",
      explanation: "For a foreign-key/primary-key join, selectivity is about 1 divided by the referenced table size."
    },
    {
      module: "Query Optimization",
      topic: "Interesting orders",
      difficulty: "Medium",
      prompt: "A plan is slightly more expensive than the current cheapest plan, but it outputs tuples sorted on the attribute needed by a later sort-merge join. Why might the optimizer keep it?",
      choices: { a: "It may avoid a later sort and become cheaper overall", b: "Sorted output always has lower selectivity", c: "It guarantees a smaller join output", d: "It removes the need to estimate costs" },
      answer: "a",
      explanation: "An interesting order can save later sorting for joins, ordering, grouping, or duplicate elimination."
    },
    {
      module: "Transaction Management",
      topic: "ACID properties",
      difficulty: "Medium",
      prompt: "A money-transfer transaction debits account A but the system crashes before crediting account B. Which ACID property requires the DBMS to avoid leaving only the debit in the database?",
      choices: { a: "Atomicity", b: "Consistency", c: "Isolation", d: "Durability" },
      answer: "a",
      explanation: "Atomicity requires that either all transaction steps happen or none do."
    },
    {
      module: "Transaction Management",
      topic: "Serializable schedules",
      difficulty: "Medium",
      prompt: "Two concurrent transactions produce an interleaved schedule whose final database state matches running T2 completely before T1. How should this schedule be classified?",
      choices: { a: "Serializable", b: "Dirty", c: "Unrecoverable by definition", d: "Non-isolated by definition" },
      answer: "a",
      explanation: "A schedule is serializable if it is equivalent to some serial execution."
    },
    {
      module: "Transaction Management",
      topic: "Dirty reads",
      difficulty: "Medium",
      prompt: "T1 writes A but has not committed. T2 then reads A and uses that value to update B. If T1 later aborts, what anomaly occurred?",
      choices: { a: "Dirty read", b: "Unrepeatable read", c: "Lost update", d: "One-to-one conflict" },
      answer: "a",
      explanation: "Reading data written by an uncommitted transaction is a dirty read."
    },
    {
      module: "Concurrency Control",
      topic: "Multiple Granularity Locking",
      difficulty: "Medium",
      prompt: "A transaction scans an entire table and updates only a few tuples that satisfy a condition. Which table-level lock best matches this access pattern?",
      choices: { a: "IS, because the transaction only intends to read lower-level objects", b: "IX, because it never reads the whole table", c: "SIX, because it shares the table while intending exclusive locks on selected tuples", d: "X, because every tuple must be individually updated" },
      answer: "c",
      explanation: "SIX combines a shared lock at the table level with intent to update lower-level objects."
    },
    {
      module: "Concurrency Control",
      topic: "Predicate and Range Locking",
      difficulty: "Medium",
      prompt: "T computes the average salary for employees aged 18 through 21 twice in one transaction. Another transaction inserts a new employee aged 20 between the reads. Which mechanism prevents the second average from changing?",
      choices: { a: "A shared lock on only the tuples that existed at the first read", b: "A range or predicate lock covering ages 18 through 21", c: "A latch on the buffer frame containing the first tuple", d: "A commit record written before the second read" },
      answer: "b",
      explanation: "Range or predicate locks block inserts that would satisfy the locked condition."
    },
    {
      module: "Concurrency Control",
      topic: "Timestamp Ordering",
      difficulty: "Hard",
      prompt: "Transaction T has TS(T)=5 and attempts to read object O with WTS(O)=8. What should timestamp-ordering concurrency control do?",
      choices: { a: "Allow the read and set RTS(O)=8", b: "Allow the read only if O is locked in shared mode", c: "Abort T because O was written by a future transaction", d: "Ignore the read using Thomas Write Rule" },
      answer: "c",
      explanation: "A transaction cannot read an object whose write timestamp is greater than its own timestamp."
    },
    {
      module: "Crash Recovery",
      topic: "Write-Ahead Logging",
      difficulty: "Medium",
      prompt: "A page has pageLSN=120 and the system's flushedLSN is 100. Under WAL, can this page be written to persistent storage now?",
      choices: { a: "Yes, because the pageLSN is newer than the flushedLSN", b: "Yes, but only if the transaction has not committed", c: "No, because the log record for the page update has not been forced yet", d: "No, because data pages are never written before checkpoints" },
      answer: "c",
      explanation: "WAL requires pageLSN <= flushedLSN before a data page is written."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES Redo",
      difficulty: "Hard",
      prompt: "During REDO, recovery sees an update log record with LSN 80 for page P. P is in the dirty page table with recLSN 100. What should recovery do with this log record?",
      choices: { a: "Redo it because all update records are always redone", b: "Skip it because P's recLSN is greater than the log record's LSN", c: "Undo it because it belongs to a loser transaction", d: "Write a CLR immediately" },
      answer: "b",
      explanation: "REDO is skipped when the page's recLSN is greater than the log record's LSN."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES Undo",
      difficulty: "Hard",
      prompt: "During UNDO, the largest LSN in ToUndo is a CLR whose undonextLSN is not NULL. What should recovery do next?",
      choices: { a: "Undo the CLR and write another CLR", b: "Add undonextLSN to ToUndo", c: "Write an End record immediately", d: "Restart from the last checkpoint" },
      answer: "b",
      explanation: "CLRs are never undone; their undonextLSN identifies the next log record to undo."
    }
  ];

  const start = window.DBMS_QUESTIONS.length + 1;
  window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
    ...question,
    id: `authored-${start + index}`,
    source: question.module
  })));
})();

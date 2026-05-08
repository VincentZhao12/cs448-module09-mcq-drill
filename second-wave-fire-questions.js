(function () {
  "use strict";

  const authored = [
    {
      module: "Transaction Management",
      topic: "ACID edge cases",
      difficulty: "Hard",
      prompt: "A programmer writes a transaction that always subtracts 100 from account A but forgets to add 100 to account B, and the transaction commits successfully. Which statement is most accurate?",
      choices: { a: "The DBMS violated atomicity because only one account changed", b: "The DBMS violated durability because the wrong result persisted", c: "ACID consistency assumes the transaction logic and constraints are correct; the DBMS cannot infer the missing business step by itself", d: "Isolation requires the DBMS to add the missing credit automatically" },
      answer: "c",
      explanation: "Consistency is not magic application repair: if the transaction program is logically wrong and no declared constraint catches it, the DBMS can still execute it atomically and durably."
    },
    {
      module: "Transaction Management",
      topic: "Conflict serializability",
      difficulty: "Hard",
      prompt: "For the schedule r1(A), w2(B), r1(B), w3(A), w2(C), r3(C), which conflict-serial order is implied by the precedence graph?",
      choices: { a: "T1, T2, T3", b: "T2, T1, T3", c: "T3, T2, T1", d: "No serial order exists because the graph has a cycle" },
      answer: "b",
      explanation: "The conflicts give T2 -> T1 on B, T1 -> T3 on A, and T2 -> T3 on C. The graph is acyclic, with T2 before T1 before T3."
    },
    {
      module: "Transaction Management",
      topic: "Conflict serializability",
      difficulty: "Hard",
      prompt: "Consider w1(A), r2(A), w2(B), r3(B), w3(C), r1(C). What is the best classification of this schedule?",
      choices: { a: "Conflict-serializable with order T1, T2, T3", b: "Conflict-serializable with order T3, T2, T1", c: "Not conflict-serializable because the precedence graph contains T1 -> T2 -> T3 -> T1", d: "Serializable only because every transaction writes a different item first" },
      answer: "c",
      explanation: "The conflicts create edges T1 -> T2 on A, T2 -> T3 on B, and T3 -> T1 on C, so the precedence graph has a cycle."
    },
    {
      module: "Transaction Management",
      topic: "Commit order versus serial order",
      difficulty: "Medium",
      prompt: "A schedule has operations r2(X), w1(X), c1, c2. Ignoring recovery constraints and considering only conflict serializability, which statement is correct?",
      choices: { a: "It is equivalent to serial order T2 before T1 even though T1 commits first", b: "It is equivalent to serial order T1 before T2 because T1 commits first", c: "It is not conflict-serializable because commits are out of order", d: "It has no conflicts because the read and write are by different transactions" },
      answer: "a",
      explanation: "The read of X by T2 occurs before T1 writes X, giving edge T2 -> T1. Commit order does not determine the conflict-serial order."
    },
    {
      module: "Transaction Management",
      topic: "Recoverable, cascadeless, and strict schedules",
      difficulty: "Hard",
      prompt: "In the schedule w1(X), w2(X), c1, c2, T2 overwrites X before T1 commits, and no transaction reads X. Which classification is most precise?",
      choices: { a: "Strict, because no dirty read occurs", b: "Cascadeless but not strict, because there is a dirty write but no dirty read", c: "Unrecoverable, because T2 commits after T1", d: "Not recoverable, because every write-write conflict violates recoverability" },
      answer: "b",
      explanation: "Cascadeless schedules forbid reading uncommitted data; this schedule has no reads. Strict schedules also forbid another transaction from writing an item written by an uncommitted transaction."
    },
    {
      module: "Transaction Management",
      topic: "Schedule class relationships",
      difficulty: "Medium",
      prompt: "Which implication between schedule classes is always valid?",
      choices: { a: "Strict implies cascadeless, and cascadeless implies recoverable", b: "Recoverable implies strict, and strict implies serial", c: "Conflict-serializable implies strict", d: "Cascadeless implies conflict-serializable" },
      answer: "a",
      explanation: "Strict schedules prevent dirty reads and dirty writes, so they are cascadeless; cascadeless schedules are recoverable."
    },
    {
      module: "Transaction Management",
      topic: "Recoverability",
      difficulty: "Medium",
      prompt: "T1 writes X, T2 reads that value of X, T2 commits, and only afterward T1 commits. What is the most precise recovery problem?",
      choices: { a: "The schedule is unrecoverable because T2 committed before the transaction it read from committed", b: "The schedule is strict because T1 eventually commits", c: "The schedule is cascadeless because T2 committed first", d: "The schedule is serializable only if T1 aborts" },
      answer: "a",
      explanation: "A transaction that reads another transaction's value must not commit before the writer commits; otherwise the system cannot recover cleanly if the writer aborts."
    },
    {
      module: "Transaction Management",
      topic: "Isolation anomalies",
      difficulty: "Medium",
      prompt: "Within one transaction, T1 reads row R and sees balance = 50. T2 then updates R to balance = 70 and commits. T1 reads row R again and now sees 70. Which anomaly did T1 observe?",
      choices: { a: "Dirty read", b: "Non-repeatable read", c: "Phantom read", d: "Lost update" },
      answer: "b",
      explanation: "A non-repeatable read occurs when a transaction rereads the same existing row and sees a committed change made by another transaction."
    },
    {
      module: "Transaction Management",
      topic: "Isolation anomalies",
      difficulty: "Medium",
      prompt: "T1 counts all orders with status = 'OPEN'. T2 inserts a new OPEN order and commits. When T1 repeats the same predicate query, the count is larger. Which anomaly is this?",
      choices: { a: "Phantom read", b: "Dirty write", c: "Unrepeatable final write", d: "Cascading abort" },
      answer: "a",
      explanation: "The second predicate read sees a newly inserted qualifying row, which is the classic phantom phenomenon."
    },
    {
      module: "Transaction Management",
      topic: "View serializability",
      difficulty: "Hard",
      prompt: "Consider the schedule r1(X), w2(X), w1(X), where r1(X) reads the initial value of X and the final write on X is by T1. Which statement is correct?",
      choices: { a: "It is view-equivalent to serial order T1, T2", b: "It is view-equivalent to serial order T2, T1", c: "It is not view-serializable because no serial order preserves both T1's initial read and T1's final write", d: "It must be view-serializable because it has only one read" },
      answer: "c",
      explanation: "If T1 runs before T2, the final write would be by T2. If T2 runs before T1, T1 would read T2's value rather than the initial value."
    },
    {
      module: "Query Processing Algorithms",
      topic: "External sorting",
      difficulty: "Hard",
      prompt: "A relation has 600 pages and external merge sort has 25 buffer pages total. Initial run generation can sort 25 pages per run, and later merge passes can merge 24 runs at a time. Counting reads and writes for every pass, what is the I/O cost to produce a fully sorted file?",
      choices: { a: "1,200 I/Os", b: "2,400 I/Os", c: "3,600 I/Os", d: "14,400 I/Os" },
      answer: "b",
      explanation: "Initial run generation creates ceil(600/25)=24 runs, and one 24-way merge pass can merge them all. There are 2 passes, each reading and writing 600 pages."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Hash duplicate elimination",
      difficulty: "Hard",
      prompt: "A duplicate-eliminating projection is implemented with an in-memory hash table over the projected attributes. The input has 2,000 pages, but the projected result has only 8,000 distinct values. Which fact is most relevant to whether a one-pass hash duplicate-elimination plan is feasible?",
      choices: { a: "Whether the hash table entries for the 8,000 distinct projected values fit in memory", b: "Whether all 2,000 input pages fit in memory at the same time", c: "Whether the input is already sorted on the projected attributes", d: "Whether the projection list contains every column of the input relation" },
      answer: "a",
      explanation: "One-pass hash duplicate elimination needs enough memory for the set of distinct projected values, not the whole input."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Unclustered index range scans",
      difficulty: "Hard",
      prompt: "An unclustered B+-tree range scan finds 10,000 matching tuple IDs. Those tuples are spread over only 600 data pages. Why might the executor sort the tuple IDs by page id before fetching records?",
      choices: { a: "To turn the B+-tree into a clustered index permanently", b: "To fetch each touched data page once and retrieve all matching slots from it", c: "To make the range predicate more selective", d: "To avoid reading the B+-tree leaf pages" },
      answer: "b",
      explanation: "Sorting tuple IDs by page id can convert many repeated random tuple fetches into roughly one read per touched data page."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Grace hash join feasibility",
      difficulty: "Hard",
      prompt: "R has 900 pages, S has 1,600 pages, and 31 buffer pages are available. A two-pass Grace hash join partitions into B-1 partitions and then builds each smaller-side partition using B-2 pages. Ignoring skew, is the two-pass plan guaranteed by the usual memory estimate?",
      choices: { a: "Yes, because 900 pages is less than 31 * 31", b: "Yes, because the total input size is less than 31 * 100 pages", c: "No, because the expected R partition size is 900 / 30 = 30 pages, which exceeds the B-2 = 29 build pages", d: "No, because hash join requires the larger relation to fit entirely in memory" },
      answer: "c",
      explanation: "The smaller relation's partitions are expected to be 30 pages each, but only 29 pages are available for the build partition after reserving buffers."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Join algorithm choice",
      difficulty: "Hard",
      prompt: "R has 2,500 pages, S has 4,000 pages, and 52 buffer pages are available. There are no useful indexes, and the join is an equijoin. Which plan is usually most attractive under the standard I/O model, assuming uniform hashing?",
      choices: { a: "Block nested-loops with R outer, costing 2,500 + ceil(2,500/50) * 4,000 = 202,500 I/Os", b: "Two-pass Grace hash join, costing about 3 * (2,500 + 4,000) = 19,500 I/Os", c: "Tuple nested-loops join, because it avoids partitioning", d: "Index nested-loops join, because equijoins always create an index automatically" },
      answer: "b",
      explanation: "With 52 buffers, the smaller side's expected partition size is about 2,500/51 pages, which fits in B-2 = 50 pages. Hash join is far cheaper than block nested loops here."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Sort-based grouping",
      difficulty: "Hard",
      prompt: "A GROUP BY department computes COUNT(*) and SUM(salary). The input is already sorted by department. What advantage does a sort-based grouping operator have in this case?",
      choices: { a: "It can finalize each department when the next department begins, without first sorting the input", b: "It can compute SUM without reading salary values", c: "It must materialize all groups before producing any result", d: "It no longer needs to remember the current department's running count and sum" },
      answer: "a",
      explanation: "When tuples arrive grouped by key, the operator can maintain running aggregates for the current group and emit that group once the key changes."
    },
    {
      module: "Query Optimization",
      topic: "Interesting orders",
      difficulty: "Hard",
      prompt: "A query joins R and S on k and then returns ORDER BY k. R and S are both already sorted on k. A hash join has slightly lower estimated join I/O than sort-merge join but produces unordered output. Why might the optimizer choose sort-merge join anyway?",
      choices: { a: "Sort-merge join may preserve the k order and avoid a separate final sort", b: "Hash join cannot evaluate equality joins", c: "ORDER BY k makes the join output smaller", d: "Sort-merge join never needs to compare duplicate key values" },
      answer: "a",
      explanation: "The existing order is a physical property. A sort-merge plan can exploit and preserve it, making the complete plan cheaper if the hash plan would need a later sort."
    },
    {
      module: "Query Optimization",
      topic: "Selection ordering",
      difficulty: "Hard",
      prompt: "A table scan applies two independent predicates: P has selectivity 0.02 and is cheap to evaluate; Q has selectivity 0.50 and calls an expensive user-defined function. If both must be checked for surviving rows, which evaluation order is usually best?",
      choices: { a: "Evaluate P first, because it discards most rows before the expensive predicate is called", b: "Evaluate Q first, because larger selectivity means better filtering", c: "Evaluate both in random order because conjunct order cannot affect CPU cost", d: "Evaluate Q only, because P is redundant whenever predicates are independent" },
      answer: "a",
      explanation: "Applying a cheap highly selective predicate first can greatly reduce the number of rows that reach the expensive predicate."
    },
    {
      module: "Query Optimization",
      topic: "Join order intuition",
      difficulty: "Hard",
      prompt: "Three relations are joined as A join B join C. A has a local predicate that reduces it from 1,000,000 rows to 1,000 rows. B and C each have 500,000 rows, and B join C is not selective. Which left-deep join order is most likely to avoid a huge intermediate result?",
      choices: { a: "Join B and C first, then join A", b: "Apply A's predicate and join the reduced A with one of its join partners first", c: "Start with the largest base relation because scans dominate all costs", d: "Delay all selections until after the final join" },
      answer: "b",
      explanation: "Reducing A early makes the first join much smaller. Joining two large, weakly selective relations first can create a large intermediate."
    },
    {
      module: "Query Optimization",
      topic: "Selectivity correlation",
      difficulty: "Hard",
      prompt: "A table has 1,000,000 rows. The optimizer estimates state = 'IN' as 1/50 and city = 'Indianapolis' as 1/10,000, then multiplies them to estimate 2 rows for both predicates. In reality, almost every Indianapolis row has state = 'IN'. What is the estimation trap?",
      choices: { a: "The predicates are correlated, so multiplying independent selectivities can drastically underestimate the result", b: "The city predicate should be treated as a join predicate", c: "Equality predicates on strings always have selectivity 1", d: "The estimate is invalid because range predicates require histograms but equality predicates do not" },
      answer: "a",
      explanation: "City and state are not independent. Once city is Indianapolis, state is almost determined, so multiplying the two marginal selectivities double-counts the filtering effect."
    },
    {
      module: "Query Optimization",
      topic: "Join cardinality",
      difficulty: "Hard",
      prompt: "R has 120,000 tuples and S has 80,000 tuples. They are joined on attribute x. The catalog says V(R,x)=6,000 and V(S,x)=2,000. Using the common uniform containment estimate, what is the estimated join cardinality?",
      choices: { a: "16,000 tuples", b: "80,000 tuples", c: "1,600,000 tuples", d: "9,600,000,000 tuples" },
      answer: "c",
      explanation: "The estimate is |R| * |S| / max(V(R,x), V(S,x)) = 120,000 * 80,000 / 6,000 = 1,600,000."
    },
    {
      module: "Query Optimization",
      topic: "Projection pushdown",
      difficulty: "Hard",
      prompt: "A plan joins R(a, b, c, d) with S(d, e, f), filters on R.c, joins on R.d = S.d, and finally outputs R.a and S.e. Which projection pushdown is valid before the join?",
      choices: { a: "Keep only R.a, R.c, R.d from R and S.d, S.e from S", b: "Keep only R.a from R and S.e from S", c: "Keep only R.d and S.d because output columns can be recovered after the join", d: "Drop R.c before filtering because it is not in the final SELECT list" },
      answer: "a",
      explanation: "Projection pushdown can remove unused columns, but it must retain output attributes, join attributes, and attributes needed by predicates."
    },
    {
      module: "Concurrency Control",
      topic: "Multiple granularity locking",
      difficulty: "Hard",
      prompt: "T1 holds a SIX lock on table R because it is scanning R and may update selected rows. T2 wants an IS lock on R so it can read a few individual rows. What should the lock manager do at the table level?",
      choices: { a: "Grant T2's IS lock, because IS is compatible with SIX", b: "Block T2's IS lock, because SIX conflicts with every other table lock", c: "Grant T2 a table-level S lock instead", d: "Abort T1 because SIX locks cannot coexist with readers" },
      answer: "a",
      explanation: "In the intention-lock compatibility matrix, IS is compatible with SIX. T2 may still need compatible S locks on the lower-level rows it reads."
    },
    {
      module: "Concurrency Control",
      topic: "Multiple granularity locking",
      difficulty: "Hard",
      prompt: "T holds IX on table R and X on row r1 of R. Before releasing X(r1), T tries to release IX(R). Which rule is being violated?",
      choices: { a: "A transaction cannot release a parent lock while it still holds a lock on a descendant", b: "A transaction cannot hold an IX lock and an X lock in the same hierarchy", c: "Exclusive row locks must be released before commit under strict 2PL", d: "IX locks are compatible only with table-level S locks" },
      answer: "a",
      explanation: "Multiple-granularity protocols require ancestors to remain locked while descendants are locked, so the parent intention lock cannot be released first."
    },
    {
      module: "Concurrency Control",
      topic: "Deadlock detection",
      difficulty: "Medium",
      prompt: "A waits-for graph has edges T1 -> T2, T2 -> T3, T3 -> T2, and T4 -> T1. If the DBMS uses deadlock detection, which action is sufficient to break the detected deadlock?",
      choices: { a: "Abort or roll back either T2 or T3", b: "Abort T4 because it is indirectly waiting", c: "Abort T1 because it appears first in the graph", d: "Do nothing because the graph is acyclic if T4 is ignored" },
      answer: "a",
      explanation: "The cycle is T2 -> T3 -> T2. Aborting one transaction in that cycle breaks the deadlock."
    },
    {
      module: "Concurrency Control",
      topic: "Deadlock prevention",
      difficulty: "Hard",
      prompt: "In wait-die, smaller timestamps mean older transactions. Tyoung has TS=50 and requests a lock held by Told with TS=10. What should happen, and why is this prevention rather than detection?",
      choices: { a: "Tyoung aborts before waiting, so the system avoids adding an edge that could help form a cycle", b: "Tyoung waits, and the waits-for graph is checked later for cycles", c: "Told aborts because holders always yield to requesters", d: "Both transactions wait, but the younger one receives priority at commit time" },
      answer: "a",
      explanation: "Wait-die lets older requesters wait for younger holders, but younger requesters abort when blocked by older holders."
    },
    {
      module: "Concurrency Control",
      topic: "Timestamp ordering",
      difficulty: "Medium",
      prompt: "Under basic timestamp ordering, TS(T)=30. Object X has WTS(X)=20 and RTS(X)=45. T tries to read X. What happens?",
      choices: { a: "The read succeeds, and RTS(X) remains 45", b: "The read succeeds, and RTS(X) is lowered to 30", c: "T aborts because RTS(X) is greater than TS(T)", d: "T waits for the transaction with timestamp 45" },
      answer: "a",
      explanation: "A read is rejected only if WTS(X) > TS(T). Since X was last written by an older transaction, T can read it; RTS(X) stays max(45, 30) = 45."
    },
    {
      module: "Concurrency Control",
      topic: "Timestamp ordering",
      difficulty: "Hard",
      prompt: "Under basic timestamp ordering, TS(T)=25, WTS(X)=40, and RTS(X)=20. T tries to write X. What is the difference between basic timestamp ordering and Thomas Write Rule here?",
      choices: { a: "Basic timestamp ordering aborts T, while Thomas Write Rule can ignore T's obsolete write", b: "Both protocols must abort T because RTS(X) is less than TS(T)", c: "Both protocols allow T to overwrite X and set WTS(X)=25", d: "Thomas Write Rule delays T until the transaction with timestamp 40 commits" },
      answer: "a",
      explanation: "Basic timestamp ordering rejects a write when TS(T) < WTS(X). Thomas Write Rule can treat that write as obsolete if it does not violate the read timestamp condition."
    },
    {
      module: "Concurrency Control",
      topic: "Optimistic concurrency control",
      difficulty: "Hard",
      prompt: "In OCC validation for T, transaction U started after T began, wrote object A, and committed before T's write phase. T read A during its read phase. Which validation condition fails?",
      choices: { a: "RS(T) intersects WS(U), so T may have read a value made stale by U", b: "WS(T) intersects RS(U), so U must be undone", c: "U committed before T's write phase, so U is automatically harmless", d: "Only write-write conflicts matter in optimistic validation" },
      answer: "a",
      explanation: "For overlapping transactions where U commits before T writes, T must not have read items written by U."
    },
    {
      module: "Concurrency Control",
      topic: "Optimistic concurrency control",
      difficulty: "Hard",
      prompt: "In OCC, T and U overlap. U finishes its read phase before T finishes, and U commits before T commits. T writes B, and U also wrote B, but T never read B. Why can T still fail validation?",
      choices: { a: "WS(T) intersects WS(U), creating a write-write race", b: "OCC aborts every transaction that writes an item", c: "Read sets are irrelevant whenever write sets overlap", d: "U must be younger than T because it committed first" },
      answer: "a",
      explanation: "Validation must rule out both stale reads and racing overwrites. A nonempty write-set intersection can violate the intended serial order."
    },
    {
      module: "Crash Recovery",
      topic: "Fuzzy checkpoints",
      difficulty: "Hard",
      prompt: "The master record points to a begin_checkpoint at LSN 500. The checkpoint's dirty page table contains page P with recLSN 320. After a crash, why might ARIES redo need to scan from LSN 320 rather than 500?",
      choices: { a: "P may have first become dirty before the checkpoint and still not have reached disk", b: "The begin_checkpoint record is always ignored during recovery", c: "Redo must start from the oldest transaction's begin record, even if no page is dirty", d: "The recLSN is used only during undo, not redo" },
      answer: "a",
      explanation: "A fuzzy checkpoint does not force dirty pages. A page listed with recLSN 320 may still be missing updates from before the checkpoint."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES analysis",
      difficulty: "Hard",
      prompt: "During ARIES analysis, T has an abort log record and later update records, but no end record before the crash. How should T be treated after analysis?",
      choices: { a: "As a loser transaction that must continue being undone", b: "As a winner transaction because it has an abort record", c: "As completed, because abort records are equivalent to end records", d: "As ignored, because aborted transactions are never in the transaction table" },
      answer: "a",
      explanation: "An abort record says rollback had begun, not that rollback finished. Without an end record, ARIES must continue undo for that loser transaction."
    },
    {
      module: "Crash Recovery",
      topic: "Compensation log records",
      difficulty: "Hard",
      prompt: "During redo, ARIES encounters a CLR for page P at LSN 900. P is in the dirty page table, and the disk pageLSN is 850. What should redo do?",
      choices: { a: "Redo the CLR's action and set P's pageLSN to 900", b: "Skip the CLR because compensation records are used only during undo", c: "Undo the CLR by following its undonextLSN", d: "Abort recovery because CLRs indicate a previous crash during undo" },
      answer: "a",
      explanation: "CLRs are redoable log records. If the page does not already reflect the CLR, redo reapplies the compensation action and advances the pageLSN."
    },
    {
      module: "Crash Recovery",
      topic: "WAL and pageLSN",
      difficulty: "Hard",
      prompt: "Undo of T writes a CLR at LSN 760 for page P and applies the undo to P in the buffer pool, making P's pageLSN 760. The stable log is flushed only through LSN 700. Can P be flushed now?",
      choices: { a: "No, the log must be forced through at least LSN 760 first", b: "Yes, because undo records do not participate in WAL", c: "Yes, because the original update being undone was already logged", d: "No, because pages modified by undo can never be flushed before restart completes" },
      answer: "a",
      explanation: "A CLR is itself a log record describing the new page state. WAL requires the log through the page's pageLSN to be stable before that page is written."
    }
  ];

  if (typeof window !== "undefined" && Array.isArray(window.DBMS_QUESTIONS)) {
    const start = window.DBMS_QUESTIONS.length + 1;
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `second-wave-fire-${start + index}`,
      source: question.module
    })));
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = authored;
  }
})();

(function () {
  "use strict";

  const authored = [
    {
      module: "Query Processing Algorithms",
      topic: "External sorting",
      difficulty: "Hard",
      prompt: "A relation has N = 1,024 pages. A multi-way external merge sort can use 8 input buffers and 1 output buffer, so each merge pass can merge 8 runs. Ignoring replacement selection and using the cost model where each pass reads and writes the whole relation, what is the I/O cost?",
      choices: { a: "2,048 I/Os", b: "6,144 I/Os", c: "8,192 I/Os", d: "16,384 I/Os" },
      answer: "c",
      explanation: "The number of passes is ceil(log_8(1024)) = 4. Each pass costs 2N, so the total is 2 * 1,024 * 4 = 8,192 I/Os."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Sorting with indexes",
      difficulty: "Medium",
      prompt: "A table has N data pages and n tuples, with many tuples per page. A query needs all tuples sorted by attribute A. There is an unclustered B+-tree on A. Why might external sorting be cheaper than scanning the index leaves and fetching tuples in index order?",
      choices: { a: "An unclustered index cannot represent the values of A in sorted order", b: "Fetching tuples in index order may cause nearly one random data-page I/O per tuple", c: "External sorting never writes temporary runs to disk", d: "B+-tree leaves are sorted only for equality predicates, not range predicates" },
      answer: "b",
      explanation: "The leaf entries are sorted, but with an unclustered index the referenced data tuples may be scattered across pages. In the worst case, producing all tuples in sorted order can approach n data-page I/Os."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Selection access paths",
      difficulty: "Hard",
      prompt: "A relation has two predicates P1 and P2 connected by AND, and there is a separate unclustered index for each predicate. Which plan best captures how both indexes can be useful together?",
      choices: { a: "Scan one index, fetch every tuple it returns, and ignore the other index", b: "Fetch all tuples from both indexes and concatenate the results", c: "Collect the qualifying tuple IDs from both indexes, intersect the ID sets, then fetch only the tuples in the intersection", d: "Use both indexes only if one of them is clustered" },
      answer: "c",
      explanation: "For conjunctive predicates, separate indexes can be combined by intersecting their tuple ID sets, reducing data-page fetches when the intersection is much smaller."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Block nested-loops join",
      difficulty: "Hard",
      prompt: "R has 480 pages and S has 3,000 pages. A block nested-loops join can keep 60 pages of the outer relation in memory at a time. Which choice gives the cheaper outer relation and its I/O cost?",
      choices: { a: "Use R as outer; 480 + ceil(480 / 60) * 3,000 = 24,480 I/Os", b: "Use R as outer; 480 * 3,000 = 1,440,000 I/Os", c: "Use S as outer; 3,000 + ceil(3,000 / 60) * 480 = 27,000 I/Os", d: "Use S as outer; 3,000 + 480 = 3,480 I/Os" },
      answer: "a",
      explanation: "R as outer costs 480 + 8 * 3,000 = 24,480, while S as outer costs 3,000 + 50 * 480 = 27,000."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Indexed nested-loops join",
      difficulty: "Hard",
      prompt: "R has 2,000 tuples stored in 80 pages. S is the inner relation and has an index on the join key. In the cost model, each outer tuple causes 5 I/Os to probe the index and retrieve its matching S tuple. What is the estimated cost of indexed nested-loops join using R as outer?",
      choices: { a: "80 + 2,000 * 5 = 10,080 I/Os", b: "2,000 + 80 * 5 = 2,400 I/Os", c: "80 * 2,000 * 5 = 800,000 I/Os", d: "80 + 5 = 85 I/Os" },
      answer: "a",
      explanation: "The outer relation is scanned once, then the inner index is probed once per outer tuple: 80 + 2,000 * 5 = 10,080."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Hash join",
      difficulty: "Medium",
      prompt: "A hash join partitions R and S on the join key using the same hash function. R has 700 pages and S has 1,300 pages. If all corresponding partition pairs fit in memory after one partitioning phase, what is the usual Grace hash join I/O cost estimate?",
      choices: { a: "700 + 1,300 = 2,000 I/Os", b: "2 * (700 + 1,300) = 4,000 I/Os", c: "3 * (700 + 1,300) = 6,000 I/Os", d: "700 * 1,300 = 910,000 I/Os" },
      answer: "c",
      explanation: "Grace hash join reads and writes both inputs during partitioning, then reads partitions again to join them: about 3(Nr + Ns)."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Sort-merge join",
      difficulty: "Hard",
      prompt: "In a sort-merge equijoin, both inputs are sorted on the join key. The current key value appears 3 times in R and 4 times in S. What must the join do for this key?",
      choices: { a: "Output one joined tuple and advance both inputs past the key", b: "Output 3 joined tuples because R has 3 matching tuples", c: "Output 4 joined tuples because S has 4 matching tuples", d: "Output all 3 * 4 matching pairs before advancing past the key" },
      answer: "d",
      explanation: "For duplicate join-key runs, every tuple in the R run joins with every tuple in the S run."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Theta joins",
      difficulty: "Medium",
      prompt: "A join predicate is R.x < S.y rather than equality. Which physical join family is generally applicable without requiring an equality hash key?",
      choices: { a: "Hash join using R.x and S.y as hash keys", b: "Sort-merge equijoin without modification", c: "Nested-loops join, possibly with an index if the inequality can use an ordered access path", d: "Duplicate elimination followed by union" },
      answer: "c",
      explanation: "General theta joins can be evaluated with nested loops. Ordinary hash join is designed for equality matches."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Projection",
      difficulty: "Medium",
      prompt: "A projection keeps attributes A and B from relation R. The pair (A, B) contains a key of R. Which optimization is valid?",
      choices: { a: "Use duplicate-preserving projection because the projected tuples cannot contain duplicates", b: "Sort the output twice to guarantee duplicate elimination", c: "Replace the projection with a Cartesian product", d: "Use hash-based duplicate elimination because keys always create many duplicates" },
      answer: "a",
      explanation: "If the projected attributes include a key, no two input tuples can produce the same projected tuple."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Grouped aggregation",
      difficulty: "Hard",
      prompt: "A hash-based GROUP BY computes AVG(salary) by department. What information is sufficient to maintain in each department's hash-table entry while scanning the input?",
      choices: { a: "Only the most recent salary seen for the department", b: "The running sum and count for the department", c: "All input tuples sorted by salary", d: "Only the number of disk pages in the relation" },
      answer: "b",
      explanation: "AVG can be computed from sum and count, which are updated per group as tuples arrive."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Set operations",
      difficulty: "Medium",
      prompt: "For duplicate-eliminating union R UNION S using a hash-based strategy, why should tuples inserted from S also be added to the hash table?",
      choices: { a: "So repeated copies of the same new S tuple are not output multiple times", b: "So R is sorted before S is scanned", c: "So every tuple from S is guaranteed to be output", d: "So the algorithm becomes a tuple-oriented nested-loops join" },
      answer: "a",
      explanation: "If a tuple appears multiple times in S but not in R, inserting its first occurrence prevents later duplicates from being output."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Right-deep plans",
      difficulty: "Hard",
      prompt: "In a right-deep iterator plan A join (B join C), suppose the top join uses A as the outer input and must rescan the right child for each A tuple. What problem can occur if the B join C subtree is not materialized?",
      choices: { a: "The B join C result may be recomputed from scratch for multiple A tuples", b: "The plan cannot call Open() on any table scan", c: "The join predicate is automatically converted to duplicate elimination", d: "The right child will always produce incorrect tuples" },
      answer: "a",
      explanation: "If a parent repeatedly rescans a complex join subtree, the subtree may redo the same work many times."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Temp operators",
      difficulty: "Hard",
      prompt: "A Temp operator sits above a join subtree. Under the usual iterator behavior, what happens the first time the Temp operator is asked for tuples?",
      choices: { a: "It returns a random tuple without calling its child", b: "It fully or substantially consumes its child to build a temporary relation, then serves tuples from that stored result", c: "It deletes the child subtree and replaces it with an index definition", d: "It forces the parent operator to become push-based" },
      answer: "b",
      explanation: "A Temp operator materializes the output of its child subtree, breaking the pipeline at first use but enabling later reuse."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Predicate hints",
      difficulty: "Medium",
      prompt: "A physical plan replaces TableScan -> Select with a TableScan that has the selection predicate as a hint. What is the main execution benefit?",
      choices: { a: "The scan can apply the predicate while reading tuples, reducing the number of tuples passed upward", b: "The scan no longer needs to read pages from disk", c: "The predicate is evaluated by the query parser instead of at runtime", d: "The table scan becomes a sort-merge join" },
      answer: "a",
      explanation: "Embedding the predicate in the scan lets nonqualifying tuples be filtered at the leaf operator."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Vectorized execution",
      difficulty: "Medium",
      prompt: "Why can vectorized execution reduce overhead compared with a tuple-at-a-time iterator pipeline?",
      choices: { a: "It removes the need for all Open() and Close() calls", b: "It passes batches of tuples per call and can apply operations to many values at once", c: "It makes every sort operator nonblocking", d: "It guarantees that all indexes become clustered" },
      answer: "b",
      explanation: "Vectorized execution amortizes iterator-call overhead across a batch and can exploit CPU-friendly operations."
    },
    {
      module: "Query Optimization",
      topic: "Range selectivity",
      difficulty: "Medium",
      prompt: "A table has 1,000,000 rows. Attribute age is uniformly distributed from 0 through 99. What cardinality should an optimizer estimate for the predicate age >= 20 AND age < 30?",
      choices: { a: "10,000 rows", b: "100,000 rows", c: "200,000 rows", d: "300,000 rows" },
      answer: "b",
      explanation: "The range covers 10 out of 100 equally likely age values, so the estimate is 0.10 * 1,000,000 = 100,000 rows."
    },
    {
      module: "Query Optimization",
      topic: "Conjunct selectivity",
      difficulty: "Hard",
      prompt: "A table has 500,000 rows. The optimizer estimates selectivity 0.10 for status = 'OPEN' and 0.20 for region = 'WEST'. If it assumes the predicates are independent, what is the estimated output cardinality for both predicates together?",
      choices: { a: "10,000 rows", b: "50,000 rows", c: "100,000 rows", d: "150,000 rows" },
      answer: "a",
      explanation: "Under independence, conjunct selectivities multiply: 0.10 * 0.20 = 0.02, and 0.02 * 500,000 = 10,000."
    },
    {
      module: "Query Optimization",
      topic: "Correlation pitfalls",
      difficulty: "Hard",
      prompt: "A catalog records that car_type has 10 distinct values and color has 10 distinct values. The optimizer estimates car_type = 'taxi' AND color = 'yellow' by multiplying 1/10 by 1/10, but most taxis are yellow. What is the main problem with this estimate?",
      choices: { a: "It assumes independence between attributes that are actually correlated", b: "It treats equality predicates as range predicates", c: "It ignores the number of pages in the table scan", d: "It assumes the join output cannot exceed the input size" },
      answer: "a",
      explanation: "Multiplying selectivities is only reasonable when predicates are independent."
    },
    {
      module: "Query Optimization",
      topic: "Join cardinality",
      difficulty: "Hard",
      prompt: "Relation R has 20,000 tuples and 2,000 distinct values of join attribute k. Relation S has 60,000 tuples and 3,000 distinct values of k. Under the common uniform many-to-many estimate, what is the estimated cardinality of R join S on k?",
      choices: { a: "20,000 tuples", b: "60,000 tuples", c: "400,000 tuples", d: "600,000 tuples" },
      answer: "c",
      explanation: "A common estimate is |R| * |S| / max(V(R,k), V(S,k)) = 20,000 * 60,000 / 3,000 = 400,000."
    },
    {
      module: "Query Optimization",
      topic: "Clustered indexes",
      difficulty: "Medium",
      prompt: "A clustered B+-tree index on timestamp is used for a predicate selecting a narrow contiguous time range. Why can this be much cheaper than using an unclustered index for the same range?",
      choices: { a: "The matching data records are stored near each other, so the scan reads mostly contiguous pages", b: "Clustered indexes never require reading leaf pages", c: "Clustered indexes make the predicate selectivity equal to zero", d: "The optimizer does not need table statistics when an index is clustered" },
      answer: "a",
      explanation: "A clustered index keeps data records in index order or close to it, so range scans tend to touch fewer, more sequential pages."
    },
    {
      module: "Query Optimization",
      topic: "Physical properties",
      difficulty: "Medium",
      prompt: "An index scan on R produces tuples ordered by R.a. A selection above it filters rows using R.b > 10 but does not reorder tuples. What physical property is retained by the selection output?",
      choices: { a: "The output remains ordered by R.a", b: "The output becomes ordered by R.b", c: "The output is guaranteed to be hash-partitioned on R.b", d: "The output loses all tuple order because every selection is blocking" },
      answer: "a",
      explanation: "A simple selection filters tuples as they pass through and preserves the input order of surviving tuples."
    },
    {
      module: "Query Optimization",
      topic: "Interesting orders",
      difficulty: "Hard",
      prompt: "During dynamic programming, Plan X for a subset of relations is more expensive than Plan Y for the same subset, but Plan X outputs tuples sorted on an attribute needed by a later GROUP BY. Why might the optimizer keep Plan X?",
      choices: { a: "The sorted output may avoid a later sort or hashing step, making the full plan cheaper", b: "A sorted intermediate result always has fewer tuples than an unsorted one", c: "Dynamic programming requires keeping every generated plan forever", d: "GROUP BY can only be evaluated immediately after a table scan" },
      answer: "a",
      explanation: "An interesting order can be valuable later for grouping, ordering, duplicate elimination, or sort-merge joins."
    },
    {
      module: "Query Optimization",
      topic: "Selinger-style dynamic programming",
      difficulty: "Hard",
      prompt: "A left-deep dynamic-programming optimizer has already found best plans for all two-relation subsets. How does it typically build candidate three-relation left-deep plans?",
      choices: { a: "Join each two-relation plan with one remaining base relation using applicable join predicates and access paths", b: "Enumerate only the alphabetical join order and discard all other orders", c: "Build only bushy trees that join two intermediate results together", d: "Choose the relation with the largest page count and place it last without costing alternatives" },
      answer: "a",
      explanation: "Selinger-style optimization builds larger left-deep plans from smaller retained plans, extending a k-1 relation plan by one base relation."
    },
    {
      module: "Query Optimization",
      topic: "Histograms and skew",
      difficulty: "Hard",
      prompt: "A column zip_code has 20,000 distinct values, but one zip code accounts for 8% of all rows. Which statistic would most directly help the optimizer avoid underestimating zip_code = 'that_popular_zip'?",
      choices: { a: "A histogram or most-common-values statistic for zip_code", b: "Only the maximum tuple size of the table", c: "The height of an unrelated B+-tree index", d: "The number of operators in the query plan" },
      answer: "a",
      explanation: "Distinct-value counts imply a rough uniform estimate, while histograms or frequent-value statistics capture skew."
    },
    {
      module: "Query Optimization",
      topic: "Cost-model pitfalls",
      difficulty: "Hard",
      prompt: "An optimizer chooses an index nested-loops plan because it estimates 100 outer rows, but the predicate actually returns 1,000,000 outer rows due to stale statistics. What is the likely consequence?",
      choices: { a: "The plan may perform far more index probes and random I/O than expected", b: "The plan automatically switches to hash join during execution in every DBMS", c: "The join result becomes semantically incorrect", d: "The query must be rejected before execution begins" },
      answer: "a",
      explanation: "Bad cardinality estimates can make repeated-lookups plans look cheap when they are actually expensive."
    },
    {
      module: "Query Optimization",
      topic: "Projection pushdown",
      difficulty: "Medium",
      prompt: "A query joins R and S but ultimately returns only R.name and S.city. Why might an optimizer push projections below the join while keeping the join attributes?",
      choices: { a: "To reduce tuple width in intermediate results while retaining the columns needed to join correctly", b: "To remove the join predicate from the query", c: "To force the join to become a Cartesian product", d: "To make the output cardinality equal to the number of projected columns" },
      answer: "a",
      explanation: "Projection pushdown can reduce data carried through the plan, but it must preserve attributes needed for joins, predicates, and output."
    },
    {
      module: "Transaction Management",
      topic: "Conflict serializability",
      difficulty: "Hard",
      prompt: "For the schedule r1(A), r2(A), w1(B), r3(B), w2(C), r1(C), w3(A), which statement about the precedence graph is correct?",
      choices: { a: "It has edges T1 -> T3, T2 -> T1, and T3 -> T1, so it is not conflict-serializable", b: "It has edges T1 -> T3, T2 -> T1, and T2 -> T3, so it is conflict-serializable in order T2, T1, T3", c: "It has no conflicts because every item is read before it is written", d: "It is conflict-serializable only if T1 commits before T2" },
      answer: "b",
      explanation: "w3(A) conflicts with earlier reads by T1 and T2; w1(B) conflicts with r3(B); w2(C) conflicts with r1(C). The graph is acyclic with order T2, T1, T3."
    },
    {
      module: "Transaction Management",
      topic: "View serializability",
      difficulty: "Hard",
      prompt: "Consider w1(X), w2(X), w1(X). There are no reads, and the final write on X is by T1. What is the best classification of this schedule?",
      choices: { a: "It is conflict-serializable with order T1 before T2", b: "It is conflict-serializable with order T2 before T1", c: "It is view-serializable but not conflict-serializable", d: "It is not view-serializable because blind writes are always invalid" },
      answer: "c",
      explanation: "The conflicts create a cycle, so it is not conflict-serializable. With no reads and final write by T1, it is view-equivalent to serial order T2 then T1."
    },
    {
      module: "Transaction Management",
      topic: "Recoverability and strictness",
      difficulty: "Hard",
      prompt: "T1 writes X, T2 reads X from T1, T1 commits, then T2 commits. No transaction reads or writes X while T1 is uncommitted except T2's read. Which classification is most precise?",
      choices: { a: "Recoverable but not cascadeless and not strict", b: "Cascadeless but not recoverable", c: "Strict because T2 commits after T1", d: "Unrecoverable because T2 read a value written by T1" },
      answer: "a",
      explanation: "The schedule is recoverable because T2 commits after T1, but it is not cascadeless or strict because T2 read X before T1 committed."
    },
    {
      module: "Concurrency Control",
      topic: "Two-phase locking",
      difficulty: "Medium",
      prompt: "A transaction obtains S(A), obtains X(B), releases S(A), reads B, and then obtains S(C). Which statement is correct under basic two-phase locking?",
      choices: { a: "The transaction violates 2PL because it acquires S(C) after releasing a lock", b: "The transaction satisfies 2PL because S(C) is only a shared lock", c: "The transaction satisfies 2PL because A, B, and C are different objects", d: "The transaction violates 2PL only if it later aborts" },
      answer: "a",
      explanation: "Once a transaction releases any lock, it has entered the shrinking phase and may not acquire additional locks."
    },
    {
      module: "Concurrency Control",
      topic: "Deadlock prevention",
      difficulty: "Hard",
      prompt: "In wound-wait, older transactions may preempt younger lock holders, while younger transactions wait for older holders. If TS(T1)=5 and TS(T2)=20, with smaller timestamps meaning older, and T1 requests a lock held by T2, what happens?",
      choices: { a: "T1 wounds T2, so T2 is aborted or rolled back", b: "T1 waits because older transactions never preempt younger ones", c: "T2 wounds T1 because T2 currently holds the lock", d: "Both transactions wait until deadlock detection runs" },
      answer: "a",
      explanation: "In wound-wait, an older requester preempts a younger holder to avoid cycles."
    },
    {
      module: "Concurrency Control",
      topic: "Deadlock detection",
      difficulty: "Medium",
      prompt: "A waits-for graph contains edges T1 -> T2, T2 -> T3, T3 -> T4, and T4 -> T2. What should the lock manager conclude?",
      choices: { a: "There is a deadlock involving T2, T3, and T4", b: "There is no deadlock because T1 is not part of the cycle", c: "Only T1 must be aborted because it is waiting first", d: "The graph is safe because every transaction has at most one outgoing edge" },
      answer: "a",
      explanation: "A cycle in the waits-for graph indicates deadlock; here T2 -> T3 -> T4 -> T2 is a cycle."
    },
    {
      module: "Concurrency Control",
      topic: "Timestamp ordering",
      difficulty: "Hard",
      prompt: "Under basic timestamp ordering, TS(T)=30. For object X, WTS(X)=20 and RTS(X)=40. What happens when T tries to write X?",
      choices: { a: "T must abort because a younger transaction has already read X", b: "T writes X because WTS(X) is less than TS(T)", c: "T waits until the transaction with timestamp 40 commits", d: "T writes X but leaves WTS(X) unchanged" },
      answer: "a",
      explanation: "A write is rejected if TS(T) is less than RTS(X), because a transaction that should appear later has already read the old value."
    },
    {
      module: "Concurrency Control",
      topic: "Thomas Write Rule",
      difficulty: "Hard",
      prompt: "Using Thomas Write Rule, TS(T)=25, WTS(X)=40, and RTS(X)=30. T tries to write X. What should happen?",
      choices: { a: "T must abort because a younger transaction has already read the old value of X", b: "T's write is ignored as obsolete because WTS(X) is greater than TS(T)", c: "T waits until all younger transactions finish", d: "T writes X and sets WTS(X)=25" },
      answer: "a",
      explanation: "Thomas Write Rule can ignore obsolete writes when TS(T) < WTS(X), but it cannot ignore the violation TS(T) < RTS(X)."
    },
    {
      module: "Concurrency Control",
      topic: "Predicate and range locking",
      difficulty: "Hard",
      prompt: "A transaction reads all rows with 10 <= salary < 20 and must be serializable with concurrent inserts. Which lock best prevents a phantom in an indexed table?",
      choices: { a: "A range lock covering the index interval from 10 up to but not including 20", b: "A shared lock only on the rows that currently exist in the range", c: "An exclusive lock on the first row returned by the query", d: "No lock is needed if the transaction repeats the query before committing" },
      answer: "a",
      explanation: "Locking only existing rows does not block insertion of new qualifying rows; a range or predicate lock protects the gap."
    },
    {
      module: "Crash Recovery",
      topic: "Write-ahead logging",
      difficulty: "Medium",
      prompt: "A transaction has written log records through LSN 900 and then writes a commit record at LSN 930. Under WAL, what must be forced before the DBMS reports commit success?",
      choices: { a: "The log through at least LSN 930", b: "Every dirty page modified by the transaction", c: "Only the first update log record for the transaction", d: "The dirty page table and transaction table as data pages" },
      answer: "a",
      explanation: "Durability requires the commit record and all earlier log records for the transaction to be stable before commit is acknowledged."
    },
    {
      module: "Crash Recovery",
      topic: "Checkpoints",
      difficulty: "Hard",
      prompt: "After ARIES analysis, the dirty page table contains P1 with recLSN 120, P2 with recLSN 80, and P3 with recLSN 200. Where should redo begin?",
      choices: { a: "At LSN 80", b: "At LSN 120", c: "At LSN 200", d: "At the first commit record after the checkpoint" },
      answer: "a",
      explanation: "ARIES redo starts from the smallest recLSN in the dirty page table because that is the earliest update that might not have reached disk."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES analysis",
      difficulty: "Hard",
      prompt: "During ARIES analysis, recovery scans an update log record for transaction T on page P at LSN 300. T is not in the transaction table, and P is not in the dirty page table. What should analysis do?",
      choices: { a: "Add T to the transaction table with lastLSN 300 and add P to the dirty page table with recLSN 300", b: "Redo the update immediately and remove T from the transaction table", c: "Ignore the record unless T has already committed", d: "Abort T immediately because it was absent from the checkpoint transaction table" },
      answer: "a",
      explanation: "Analysis reconstructs state by adding seen transactions and dirty pages; the first update seen for a page establishes that page's recLSN."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES redo",
      difficulty: "Hard",
      prompt: "During ARIES redo, an update log record has LSN 410 for page P. P is in the dirty page table with recLSN 300, and the page read from disk has pageLSN 350. What should recovery do?",
      choices: { a: "Redo the update and set the pageLSN to 410", b: "Skip the update because P's recLSN is less than 410", c: "Undo the update because the pageLSN is lower than 410", d: "Skip all later records for P" },
      answer: "a",
      explanation: "The record is at or after recLSN, and the disk pageLSN is less than the log record's LSN, so the update may be missing on disk."
    },
    {
      module: "Crash Recovery",
      topic: "ARIES undo",
      difficulty: "Hard",
      prompt: "ARIES undo chooses a loser transaction's update record at LSN 600. The record's prevLSN is 480. What is the normal next step after applying the physical undo?",
      choices: { a: "Write a CLR whose undonextLSN points to 480", b: "Delete the original update record from the log", c: "Write a commit record for the loser transaction", d: "Restart redo from LSN 480" },
      answer: "a",
      explanation: "ARIES logs undo work using a compensation log record, whose undonextLSN records where undo should continue."
    },
    {
      module: "Crash Recovery",
      topic: "Compensation log records",
      difficulty: "Hard",
      prompt: "A crash occurs during restart undo after recovery has written a CLR for undoing T's update at LSN 700. On the next restart, why should ARIES not undo the original LSN 700 update a second time?",
      choices: { a: "The CLR is redone during repeat-history redo, and its undonextLSN tells undo to continue before LSN 700", b: "All loser transactions become winners after any restart crash", c: "The original update record is removed from the log when the CLR is written", d: "Redo skips every CLR because CLRs are not real updates" },
      answer: "a",
      explanation: "CLRs make undo actions redoable and prevent repeated undo of the same update by linking undo to the next earlier log record."
    },
    {
      module: "Crash Recovery",
      topic: "Steal and no-force policies",
      difficulty: "Medium",
      prompt: "Why does a steal/no-force buffer manager make both undo and redo necessary?",
      choices: { a: "Steal can place uncommitted updates on disk, and no-force can leave committed updates only in memory", b: "Steal prevents all dirty pages from reaching disk, and no-force writes every page at commit", c: "Steal eliminates the need for WAL, and no-force eliminates checkpoints", d: "Both policies guarantee that disk always contains exactly the last committed database state" },
      answer: "a",
      explanation: "Steal creates a need to undo uncommitted disk updates after a crash; no-force creates a need to redo committed updates not yet on disk."
    }
  ];

  if (typeof window !== "undefined" && Array.isArray(window.DBMS_QUESTIONS)) {
    const start = window.DBMS_QUESTIONS.length + 1;
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `final-fire-${start + index}`,
      source: question.module
    })));
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = authored;
  }
})();

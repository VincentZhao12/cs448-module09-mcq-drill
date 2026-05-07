(function () {
  "use strict";

  const banks = [
    {
      module: "09-01 Query Processing Algorithms",
      source: "slides 1-49",
      facts: [
        ["External sorting", "Two-way merge sort needs at least three buffer pages: two input buffers and one output buffer.", "Treating disk sorting as n log n tuple work instead of I/O over N pages", "Hard"],
        ["External sorting", "Each full external-sort pass costs 2N I/Os because it reads and writes the whole relation.", "Counting only reads and forgetting writes in every pass", "Hard"],
        ["External sorting", "Two-way merge sort costs 2N*(ceil(log2(N))+1), or 2N*ceil(log2(N)) when pass 0 and pass 1 are combined.", "Dropping the initial local sort pass without stating the combined-pass optimization", "Hard"],
        ["External sorting", "With B input buffers and one output buffer, B-way merge sort costs 2N*ceil(logB(N)).", "Assuming extra output buffers improve merge fan-in", "Hard"],
        ["External sorting", "Double buffering overlaps reading from storage with merging by splitting buffers into two halves.", "Changing the asymptotic I/O cost rather than hiding latency", "Medium"],
        ["B+ tree sorting", "A clustered B+ tree can provide sorted order by scanning the leaf level with roughly log N plus N page I/Os.", "Confusing leaf order with cheap tuple retrieval for unclustered indexes", "Hard"],
        ["B+ tree sorting", "An unclustered B+ tree can be terrible for full sorted retrieval because tuple lookups may cost about n I/Os.", "Comparing n tuple fetches to N data pages and choosing the index blindly", "Hard"],
        ["Blocking operators", "Sorting is blocking because no output tuple can be produced until the input has been seen.", "Thinking pipelining begins after the first page is sorted", "Medium"],
        ["Duplicate elimination", "Sort-based duplicate elimination sorts first, then scans adjacent equal tuples.", "Forgetting the extra scan after sort", "Medium"],
        ["Duplicate elimination", "Hash-based duplicate elimination probes a hash table and can report a new distinct tuple when first seen.", "Assuming every duplicate-elimination method is blocking", "Hard"],
        ["Duplicate elimination", "If ORDER BY already requires sorting, sort-based duplicate elimination may be better than hashing.", "Always choosing hash because it is typically efficient", "Hard"],
        ["Selection", "A table-scan select over r with N data pages costs N I/O reads.", "Multiplying by tuple count when the scan reads pages", "Easy"],
        ["Selection", "Hash indexes support equality predicates; tree indexes support equality and range predicates.", "Using a hash index for one-sided or two-sided range predicates", "Hard"],
        ["Selection", "A clustered index is usually useful for index-based selection; an unclustered range index is useful only when few tuples qualify.", "Using an unclustered range index for a large fraction of the table", "Hard"],
        ["Selection", "For many unclustered range matches, sort TIDs by page-id to avoid repeatedly reading the same page.", "Retrieving TIDs in leaf order without page-id batching", "Hard"],
        ["Selection", "With two indexed predicates P1 and P2, one plan intersects the two TID sets before fetching tuples.", "Fetching all tuples for both predicates before intersecting", "Hard"],
        ["Projection", "Plain relational projection eliminates duplicates; duplicate-preserving projection does not.", "Treating SQL projection as always duplicate-preserving in relational algebra notation", "Medium"],
        ["Projection", "If projected attributes include a key, duplicate elimination is unnecessary.", "Hashing projected tuples even when a key is retained", "Hard"],
        ["Group-by", "Sort-based group-by sorts on grouping columns, then scans each group block to compute aggregates.", "Sorting on aggregate columns rather than group-by columns", "Medium"],
        ["Group-by", "Hash-based group-by hashes on group-by attributes and maintains running statistics such as sum and count.", "Averaging averages without maintaining count", "Hard"],
        ["Set operations", "Nested-loop union copies r, then inserts each s tuple only if not found in r/results.", "Ignoring duplicates coming from s after a missing tuple is inserted", "Hard"],
        ["Set operations", "Sort-merge set operations sort both inputs and decide output during the merge.", "Thinking sort-merge union requires a nested scan of r for each tuple of s", "Medium"],
        ["Set operations", "Hash-based union inserts r into a hash table, then probes each tuple of s.", "Forgetting to insert newly accepted s tuples into the hash table", "Hard"],
        ["Join algorithms", "Tuple-oriented nested loops with r outer costs Nr + |r|*Ns.", "Using Nr + Nr*Ns, which is page-oriented NLJ", "Hard"],
        ["Join algorithms", "Page-oriented nested loops with r outer costs Nr + Nr*Ns.", "Using tuple count for the outer in page-oriented NLJ", "Hard"],
        ["Join algorithms", "Block nested loops with r outer and block size B costs Nr + ceil(Nr/B)*Ns.", "Dividing the inner relation by B instead of the outer relation", "Hard"],
        ["Join algorithms", "Indexed nested loops with r outer and an inner tree index costs Nr + |r|*logF(Ns) in the simplified slide model.", "Building the index on the outer relation for each inner tuple", "Hard"],
        ["Join algorithms", "Sort-merge join sorts both relations on join attributes, then merges equal groups.", "Assuming it applies cleanly to arbitrary theta predicates", "Hard"],
        ["Join algorithms", "Hash join partitions both tables on the join attributes using the same hash function.", "Hashing only the smaller table and never partitioning the larger one when both exceed memory", "Medium"],
        ["Theta joins", "General theta joins use nested loops; inequalities may use indexed nested loops, but hash and sort-merge are mainly for equijoins.", "Using hash join for r.a < s.b", "Hard"]
      ]
    },
    {
      module: "09-02 Query Evaluation Pipelines",
      source: "slides 1-126",
      facts: [
        ["SQL to RA", "Conceptual SQL evaluation maps FROM tables to a cross product, WHERE predicates to selection, and SELECT attributes to projection.", "Pushing projection before selection even when predicates need projected-away attributes", "Medium"],
        ["QEP pipeline", "The processing path is parser/rewrite, optimizer, physical QEP, then query processor execution.", "Treating a logical relational algebra tree as already choosing physical algorithms", "Medium"],
        ["Iterator model", "The iterator model is pull-based, lazy, and tuple-at-a-time.", "Calling it push-based because operators pass tuples upward", "Hard"],
        ["Iterator model", "Every physical operator follows Open, GetNext, Close, and often Reset.", "Letting a parent inspect child implementation details instead of using the protocol", "Medium"],
        ["Table scan", "TableScan.Open opens the table and positions the cursor at the beginning.", "Making GetNext reopen the table on every tuple", "Medium"],
        ["Selection iterator", "Select.GetNext repeatedly asks its child for tuples until one satisfies P or the child is done.", "Returning null immediately after the first nonqualifying tuple", "Hard"],
        ["Join iterator", "A nested-loop join iterator must preserve left and right tuple state across GetNext calls.", "Restarting both children on every GetNext and duplicating earlier answers", "Hard"],
        ["Physical QEP", "Logical operators become physical operators such as table scan, index scan, temp, sort, and specific join algorithms.", "Assuming a logical join always means nested-loops join", "Hard"],
        ["Hints", "A table scan or index scan can receive a select predicate as a hint to combine filtering with access.", "Adding a separate selection operator when the access method can filter", "Medium"],
        ["Operator opacity", "Operators do not need to know the implementation of the operator below them if all obey iterator protocol.", "Coupling a selection operator to a concrete file scan class", "Medium"],
        ["Left-deep QEP", "Left-deep trees are favorable because they support pipelining without writing temporary tables for intermediate joins.", "Assuming every join result must be materialized", "Hard"],
        ["Right-deep QEP", "Naive right-deep QEPs can repeatedly reevaluate a lower join unless a temp operator materializes it.", "Claiming right-deep trees are always cheaper because the right side is smaller", "Hard"],
        ["Temp operator", "A Temp operator saves a join result into a temporary table so future requests can scan it rather than recompute it.", "Putting Temp under base table scans instead of over the repeated subplan", "Hard"],
        ["QEP shape", "The shape of a QEP matters because it changes pipelining, blocking, and recomputation behavior.", "Treating algebraic equivalence as identical execution behavior", "Hard"],
        ["Blocking", "Sort and Temp break pure tuple-at-a-time pipelining because they need materialized input/output.", "Classifying every iterator as non-blocking merely because it has GetNext", "Hard"],
        ["Vectorization", "Vectorized execution sends a block/vector of tuples through the pipeline to reduce GetNext overhead.", "Changing query semantics rather than batching operator calls", "Medium"],
        ["SIMD", "SIMD such as AVX operates on multiple data values in one instruction, complementing vectorized processing.", "Equating SIMD with multithreading transactions", "Medium"],
        ["Physical operators", "Index-only plans can use IndexScan when required attributes are available from the index.", "Fetching data pages even when the index covers the needed attributes", "Hard"],
        ["Physical operators", "Create-index and bulk-load are physical operators/actions in the broader execution toolbox.", "Restricting physical operators only to relational algebra symbols", "Medium"],
        ["Left vs right", "Left-deep plans avoid rereading intermediate right subtrees in the slide comparison.", "Saying right-deep is identical because joins are associative", "Hard"]
      ]
    },
    {
      module: "10 Query Optimization",
      source: "slides 1-36",
      facts: [
        ["Algebraic transforms", "A selection over a cross product can become a join when the predicate links the relations.", "Leaving sigma(r x s) as a literal cross product even for join predicates", "Medium"],
        ["Algebraic transforms", "Join is commutative and associative for inner joins, enabling join reordering.", "Applying the same freedom to outer joins without checking semantics", "Hard"],
        ["Selection pushdown", "Selections should be pushed toward base relations when attributes permit.", "Pushing a predicate below a relation that lacks its attributes", "Hard"],
        ["Projection pushdown", "Projection can reduce tuple width but must keep attributes needed later for joins, predicates, grouping, and output.", "Dropping join columns too early", "Hard"],
        ["Join ordering", "For n joined tables, the join-order search space is exponential.", "Expecting the optimizer to enumerate every plan for large n without a time budget", "Medium"],
        ["Cost estimation", "Costing physical operators requires estimating input and output cardinalities.", "Costing only the algorithm and ignoring output size feeding the next operator", "Hard"],
        ["Index costing", "B+ tree height estimates I/Os needed to reach the first qualifying leaf.", "Using table cardinality instead of tree height for root-to-leaf descent", "Medium"],
        ["Clustered range", "Clustered range access can read qualifying leaf/data pages sequentially and is much better for broad ranges than unclustered access.", "Treating clustered and unclustered range access as the same", "Hard"],
        ["Statistics", "Catalog statistics include tuple count, page count, min/max, and number of distinct values.", "Estimating selectivity without any base-table statistics", "Medium"],
        ["Selectivity", "Selectivity is output size divided by input size.", "Calling a highly selective predicate one that returns most tuples", "Hard"],
        ["Key equality", "Equality on a key has selectivity about 1/|r|.", "Using 1/V(A,r) for a key when V equals table cardinality is okay, but forgetting key uniqueness is not", "Medium"],
        ["Non-key equality", "Equality on non-key A is estimated with 1 divided by number of distinct A values.", "Using min/max range width for equality", "Medium"],
        ["Range uniformity", "Uniform range selectivity uses the fraction of the attribute domain covered by the range.", "Assuming every range predicate has selectivity 1/3 regardless of bounds", "Hard"],
        ["Histograms", "Histograms improve range selectivity by summing bucket contributions.", "Using only global min/max when skew is known by histogram", "Hard"],
        ["Join selectivity", "Many-to-many equijoin selectivity is based on max(distinct values in r, distinct values in s).", "Dividing by min distinct values and overestimating", "Hard"],
        ["PK/FK join", "A foreign-key/primary-key many-to-one join has output roughly the referencing relation size when referential integrity holds.", "Multiplying both table sizes as the final output", "Hard"],
        ["Heuristics", "High selectivity in the slide wording means a strong reduction factor, so do highly filtering operations early.", "Postponing filters until after joins for no reason", "Medium"],
        ["Multi-table plans", "Left-deep dynamic programming keeps cheapest subplans for subsets and extends them pass by pass.", "Building only one greedy order and calling it exhaustive optimization", "Hard"],
        ["Interesting orders", "A plan with a useful output ordering may be kept even if not currently cheapest.", "Discarding all non-cheapest plans and losing sort-merge/order-by benefits", "Hard"],
        ["Group-by pushdown", "Pushing group-by below a join can help when it shrinks data without changing semantics.", "Pushing every group-by below every join blindly", "Hard"]
      ]
    },
    {
      module: "11 Transaction Management",
      source: "slides 1-26",
      facts: [
        ["Transactions", "A transaction is a sequence of steps that takes the database from one consistent state to another if run alone.", "Treating each individual read or write as a full transaction", "Easy"],
        ["ACID", "Atomicity means all actions happen or none happen.", "Confusing atomicity with isolation from other transactions", "Medium"],
        ["ACID", "Consistency means consistent transactions preserve database consistency.", "Confusing it with commit durability", "Medium"],
        ["ACID", "Isolation is enforced by concurrency control.", "Assigning isolation primarily to the recovery manager", "Medium"],
        ["ACID", "Durability is enforced by recovery so committed effects survive crashes.", "Thinking durability applies to uncommitted writes", "Medium"],
        ["Managers", "Recovery manager enforces atomicity and durability; concurrency control manager enforces isolation.", "Swapping those responsibilities", "Hard"],
        ["Schedules", "A serial schedule runs one transaction completely before the next.", "Calling any non-conflicting interleaving serial", "Easy"],
        ["Schedules", "Different serial orders can produce different correct final states.", "Assuming T1,T2 and T2,T1 must always have same values", "Medium"],
        ["Serializability", "A schedule is serializable if equivalent to some serial schedule.", "Requiring it to look serial syntactically", "Medium"],
        ["Equivalence", "Schedule equivalence is about producing the same database effect for the relevant transactions.", "Comparing only operation count rather than object interactions", "Hard"],
        ["Dirty read", "A dirty read is a WR conflict where a transaction reads data written by an uncommitted transaction.", "Calling a read after the writer commits dirty", "Hard"],
        ["Unrepeatable read", "An unrepeatable read is an RW conflict where rereading a tuple sees a changed committed value.", "Confusing it with reading an uncommitted value", "Hard"],
        ["Lost update", "Lost update is a WW conflict where one uncommitted write overwrites another.", "Treating it as a read-only anomaly", "Medium"],
        ["Concurrency", "Concurrency improves utilization and response time but creates correctness hazards.", "Queueing every transaction and still calling it concurrent support", "Easy"],
        ["Schedules", "An interleaving can be correct if equivalent to T1 then T2 or T2 then T1.", "Rejecting all interleavings automatically", "Medium"],
        ["Abstraction", "For concurrency reasoning, transactions are abstracted as reads and writes on database objects.", "Depending on application source code lines rather than read/write conflicts", "Medium"]
      ]
    },
    {
      module: "12 Concurrency Control",
      source: "slides 1-77",
      facts: [
        ["Isolation levels", "The listed isolation levels include read uncommitted, read committed, repeatable read, snapshot isolation, and serializable.", "Treating snapshot isolation as the same as serializable", "Hard"],
        ["Lock compatibility", "Shared locks are compatible with shared locks, but exclusive locks conflict with shared and exclusive locks.", "Allowing S and X on the same object for different transactions", "Easy"],
        ["Locks", "Locks are transaction-level controls over data objects.", "Confusing locks with latches over data structures", "Medium"],
        ["2PL", "Two-phase locking has a growing phase for acquiring locks and a shrinking phase for releasing locks.", "Acquiring a new lock after releasing one", "Hard"],
        ["2PL", "Basic 2PL guarantees conflict serializability but may allow dirty reads if exclusive locks are released before commit.", "Assuming basic 2PL is automatically strict/recoverable", "Hard"],
        ["Rigorous 2PL", "Rigorous/strict-style locking holds locks until commit to avoid dirty reads and cascading aborts.", "Unlocking after the first object update in a transfer", "Hard"],
        ["Deadlock", "2PL can deadlock when transactions hold locks while waiting for each other.", "Claiming 2PL prevents all waiting cycles", "Medium"],
        ["Wait-for graph", "Deadlock detection uses a wait-for graph and aborts a victim when a cycle is found.", "Using the precedence graph as the lock manager's wait structure", "Hard"],
        ["Deadlock prevention", "Prevention can use transaction priorities such as timestamps instead of detecting cycles.", "Maintaining no priority and no wait graph but still detecting cycles", "Medium"],
        ["Lock manager", "The lock manager maintains lock tables, compatibility, wait queues, and deadlock handling.", "Letting each page independently decide transaction conflicts", "Medium"],
        ["Multi-granularity", "IS means intention to take shared locks below; IX means intention to take exclusive locks below.", "Treating intention locks as actual tuple reads/writes", "Hard"],
        ["SIX", "SIX means shared lock at this node plus intention exclusive below.", "Interpreting SIX as S compatible with every IX request", "Hard"],
        ["Multi-granularity", "A parent must have a suitable intention lock before a child is locked.", "Taking an X lock on a tuple with no intention lock on ancestors", "Hard"],
        ["Multi-granularity", "A parent cannot be unlocked while a child still has a lock.", "Unlocking top-down before releasing lower locks", "Hard"],
        ["Predicate locking", "Predicate locking blocks inserts or updates that would satisfy the locked predicate.", "Locking only currently existing tuples and missing phantoms", "Hard"],
        ["Range locking", "Range locking is a special case of predicate locking often supported by indexes.", "Solving phantoms with tuple locks only", "Hard"],
        ["Locks vs latches", "Latches protect data structures and are managed by algorithms; locks protect data and are managed by CC.", "Holding a B+ tree latch until transaction commit", "Hard"],
        ["B+ tree concurrency", "Search can latch/lock-couple down the tree, releasing ancestors as safe child access is obtained.", "Holding every ancestor unnecessarily for the whole operation", "Medium"],
        ["B+ tree concurrency", "Insert/delete care about safe nodes that will not split/merge during the operation.", "Treating every descent as requiring exclusive locks to the root forever", "Hard"],
        ["Optimistic CC", "Optimistic concurrency assumes conflicts are rare and validates before writing.", "Taking locks on every object before reads", "Medium"],
        ["Timestamp ordering", "Timestamp ordering fixes serial order by transaction timestamps.", "Letting commit order override timestamp order", "Hard"],
        ["Timestamp read", "T may read O if WTS(O) <= TS(T); if WTS(O) > TS(T), T aborts.", "Reading a future write", "Hard"],
        ["Timestamp read", "A successful read sets RTS(O) to max(RTS(O), TS(T)).", "Lowering RTS when an older transaction reads", "Medium"],
        ["Timestamp write", "T may write O only if RTS(O) <= TS(T) and WTS(O) <= TS(T), otherwise it aborts/restarts under basic TO.", "Ignoring a younger read captured in RTS", "Hard"],
        ["Timestamp ordering", "Timestamp ordering has no waiting and therefore no deadlocks.", "Adding waits-for edges to timestamp ordering", "Medium"],
        ["Timestamp ordering", "Timestamp ordering can cascade aborts and be unrecoverable without extra commit/read rules.", "Assuming timestamp serializability alone guarantees recoverability", "Hard"],
        ["Thomas Write Rule", "Thomas Write Rule ignores obsolete writes with TS(T) < WTS(O) instead of aborting, admitting more schedules.", "Ignoring obsolete reads too", "Hard"],
        ["OCC phases", "Kung-Robinson OCC has read/execute, validation, and write phases.", "Writing to the database during the read phase", "Medium"],
        ["OCC metadata", "Validation uses read sets, write sets, and phase timestamps.", "Validating without knowing RS(T) and WS(T)", "Hard"],
        ["OCC case 1", "A transaction that completed before T began does not conflict with T.", "Checking read/write intersections for already-finished non-overlapping transactions", "Medium"],
        ["OCC case 2", "If U finishes before T writes, require RS(T) ∩ WS(U) = empty to avoid dirty/stale reads.", "Checking only write-write conflicts", "Hard"],
        ["OCC case 3", "For overlapping transactions, validation checks both RS(T) ∩ WS(U) and WS(T) ∩ WS(U).", "Allowing racing overwrites", "Hard"]
      ]
    },
    {
      module: "13 Crash Recovery",
      source: "slides 1-32",
      facts: [
        ["Recovery goal", "Recovery guarantees atomicity and durability after aborts and crashes.", "Using recovery to enforce isolation between live transactions", "Medium"],
        ["STEAL", "STEAL allows flushing pages dirtied by uncommitted transactions, so UNDO information is required.", "Thinking STEAL makes atomicity trivial", "Hard"],
        ["NO-FORCE", "NO-FORCE lets commit return without forcing all data pages, so REDO information is required.", "Thinking NO-FORCE removes durability obligations", "Hard"],
        ["WAL", "Before a dirty data page reaches disk, the corresponding update log record must be forced.", "Flushing the page before its log record", "Hard"],
        ["WAL", "Before commit, all log records for that transaction must be written to stable storage.", "Forcing all data pages instead of the transaction log", "Hard"],
        ["LSN", "Every log record has an increasing LSN.", "Reusing LSNs per transaction", "Easy"],
        ["pageLSN", "A pageLSN stores the LSN of the most recent update applied to that page.", "Storing the transaction's first LSN instead", "Medium"],
        ["flushedLSN", "WAL requires pageLSN <= flushedLSN before a page is written.", "Checking pageLSN against the transaction timestamp", "Hard"],
        ["Log records", "Update log records include XID, pageID, offset, length, old data, and new data.", "Logging only the after-image when UNDO may be needed", "Hard"],
        ["Transaction table", "The transaction table tracks active transaction id, status, and lastLSN.", "Putting one entry per dirty page in the transaction table", "Medium"],
        ["Dirty page table", "The dirty page table tracks dirty page id and recLSN, the first LSN that dirtied the page.", "Updating recLSN to every later update", "Hard"],
        ["Checkpointing", "A fuzzy checkpoint logs begin_checkpoint and end_checkpoint without stopping transactions or forcing all dirty pages.", "Assuming checkpoint means all pages are clean on disk", "Hard"],
        ["Abort", "Abort follows prevLSN backward from lastLSN to undo a transaction.", "Scanning forward and redoing old values", "Medium"],
        ["CLR", "A CLR is written while undoing and includes undonextLSN.", "Undoing CLRs again during later recovery", "Hard"],
        ["CLR", "CLRs are redone during repeat history but never undone.", "Treating CLR as a normal update during undo", "Hard"],
        ["Commit", "Commit writes a commit record, flushes log through lastLSN, returns, then writes end.", "Waiting for every dirty page to flush before commit returns", "Hard"],
        ["Analysis", "Analysis starts from the checkpoint and reconstructs transaction and dirty page tables.", "Starting redo immediately from the end of the log", "Medium"],
        ["Analysis", "End records remove transactions from the transaction table.", "Keeping ended transactions as losers", "Hard"],
        ["REDO", "Redo repeats history, including updates of transactions that later abort.", "Redoing only committed transactions", "Hard"],
        ["REDO start", "Redo scans forward from the smallest recLSN in the dirty page table.", "Starting from the latest checkpoint end regardless of recLSN", "Hard"],
        ["REDO test", "Do not redo if the page is not dirty, recLSN > LSN, or pageLSN >= LSN.", "Redoing every update log record unconditionally", "Hard"],
        ["UNDO", "Undo begins with lastLSNs of loser transactions and repeatedly chooses the largest LSN.", "Undoing in arbitrary oldest-first order", "Hard"],
        ["UNDO", "When undoing an update, restore the old value, write a CLR, and add prevLSN to ToUndo.", "Writing no log record during undo", "Hard"],
        ["Crash during restart", "CLRs and undonextLSN make recovery restartable after a crash during undo.", "Depending on remembering RAM-only undo progress", "Hard"],
        ["ARIES phases", "ARIES recovery phases are Analysis, Redo, and Undo.", "Running Undo before Redo and losing repeat-history simplicity", "Hard"],
        ["Summary", "Redo repeats history; Undo removes loser effects.", "Redoing only winners and doing no loser cleanup", "Medium"]
      ]
    }
  ];

  const combos = [
    {
      pick: "a",
      make: (f) => ({
        prompt: `Which statement is the trap-free version of the CS448 rule about ${f[0]}?`,
        choices: {
          a: f[1],
          b: f[2],
          c: `The optimizer can ignore ${f[0]} whenever the logical algebra expression is equivalent.`,
          d: `${f[0]} is only relevant for main-memory execution and not for disk-backed DBMSs.`
        }
      })
    },
    {
      pick: "c",
      make: (f) => ({
        prompt: `For ${f[0]}, consider:\n\ni. ${f[1]}\nii. ${f[2]}\niii. The detail affects correctness or I/O cost in the module 09+ slides.\niv. The detail can always be deferred to the final projection with no cost/correctness impact.\n\nWhich are correct?`,
        choices: {
          a: "i only",
          b: "i and ii only",
          c: "i and iii only",
          d: "i, iii, and iv only"
        }
      })
    },
    {
      pick: "b",
      make: (f) => ({
        prompt: `A final asks you to choose a plan/rule involving ${f[0]}. What should make you suspicious?`,
        choices: {
          a: f[1],
          b: f[2],
          c: "The answer mentions page I/O, state, timestamps, locks, or log records where the slides use them.",
          d: "The answer distinguishes logical algebra from physical execution."
        }
      })
    },
    {
      pick: "d",
      make: (f) => ({
        prompt: `Which answer best explains why ${f[0]} is exam-dangerous?`,
        choices: {
          a: "The topic is mostly notation, so equivalent-looking answers are interchangeable.",
          b: "The course treats it as implementation-free theory with no cost or state consequences.",
          c: f[2],
          d: `${f[1]} The common wrong move is: ${f[2]}.`
        }
      })
    },
    {
      pick: "a",
      make: (f) => ({
        prompt: `Pick the statement that would survive a picky CS448 grading rubric for ${f[0]}.`,
        choices: {
          a: f[1],
          b: f[1].replaceAll("must", "may").replaceAll("requires", "suggests"),
          c: f[2],
          d: `All implementations of ${f[0]} have the same I/O behavior once the logical result is fixed.`
        }
      })
    },
    {
      pick: "c",
      make: (f) => ({
        prompt: `For ${f[0]}, which combination is right?\n\ni. The slide-level rule: ${f[1]}\nii. The tempting mistake: ${f[2]}\niii. The tempting mistake should be rejected.\niv. The tempting mistake is equivalent under all physical plans.\n\nChoose one.`,
        choices: {
          a: "i and ii only",
          b: "ii and iv only",
          c: "i and iii only",
          d: "i, ii, iii, and iv"
        }
      })
    }
  ];

  const special = [
    {
      module: "09-01 Query Processing Algorithms",
      source: "join cost slides",
      topic: "Join algorithms",
      difficulty: "Hard",
      prompt: "Given Nr=100 pages, |r|=10,000 tuples, Ns=1,000 pages. Tuple-oriented nested loops with r outer costs what?",
      choices: { a: "100 + 100*1,000", b: "100 + 10,000*1,000", c: "1,000 + 1,000*100", d: "100 + ceil(100/20)*1,000" },
      answer: "b",
      explanation: "Tuple-oriented NLJ scans the inner once per outer tuple: Nr + |r|*Ns."
    },
    {
      module: "09-01 Query Processing Algorithms",
      source: "join cost slides",
      topic: "Join algorithms",
      difficulty: "Hard",
      prompt: "Given Nr=100, Ns=1,000, block size B=20 pages, block nested loops with r outer costs what?",
      choices: { a: "100 + 10,000*1,000", b: "100 + 100*1,000", c: "100 + ceil(100/20)*1,000", d: "1,000 + ceil(100/20)*100" },
      answer: "c",
      explanation: "Block NLJ divides the outer page count by the block size: Nr + ceil(Nr/B)*Ns."
    },
    {
      module: "10 Query Optimization",
      source: "selectivity slides",
      topic: "Selectivity",
      difficulty: "Hard",
      prompt: "A non-key equality predicate A=c has V(A,r)=50 distinct values. Under the uniform assumption, the selectivity is closest to:",
      choices: { a: "1/|r|", b: "1/50", c: "50/|r|", d: "max(A)-min(A)" },
      answer: "b",
      explanation: "For non-key equality, estimate selectivity as 1 divided by the number of distinct values."
    },
    {
      module: "12 Concurrency Control",
      source: "timestamp slides",
      topic: "Timestamp ordering",
      difficulty: "Hard",
      prompt: "TS(T)=7, RTS(O)=9, WTS(O)=4. Under basic timestamp ordering, T issues Write(O). What happens?",
      choices: { a: "Write succeeds because WTS(O) < TS(T)", b: "T waits for the transaction that read O", c: "T aborts because RTS(O) > TS(T)", d: "The write is ignored by Thomas Write Rule because WTS(O) < TS(T)" },
      answer: "c",
      explanation: "A younger transaction already read the old value, so the older write would violate timestamp order."
    },
    {
      module: "13 Crash Recovery",
      source: "WAL slides",
      topic: "WAL",
      difficulty: "Hard",
      prompt: "A page has pageLSN=80 and flushedLSN=70. Can the DBMS flush that page under WAL?",
      choices: { a: "Yes, because pageLSN is newer", b: "No, the log must be flushed at least through LSN 80 first", c: "Yes, if the transaction has committed", d: "No, pages are never flushed under NO-FORCE" },
      answer: "b",
      explanation: "WAL requires pageLSN <= flushedLSN before the corresponding data page reaches disk."
    },
    {
      module: "13 Crash Recovery",
      source: "ARIES slides",
      topic: "REDO",
      difficulty: "Hard",
      prompt: "During ARIES REDO, an update log record has LSN=50 for page P. P is in the dirty page table with recLSN=60. What should happen?",
      choices: { a: "Redo it because all update records repeat history", b: "Skip it because recLSN > LSN", c: "Undo it because it is before recLSN", d: "Write a CLR immediately" },
      answer: "b",
      explanation: "If recLSN is greater than the log record LSN, that record did not cause the dirty page needing redo."
    }
  ];

  function makeQuestion(fact, bank, variant, index) {
    const made = variant.make(fact);
    return {
      id: `${bank.module.slice(0, 5)}-${index}`,
      module: bank.module,
      source: bank.source,
      topic: fact[0],
      difficulty: fact[3],
      prompt: made.prompt,
      choices: made.choices,
      answer: variant.pick,
      explanation: `${fact[1]} Watch out for: ${fact[2]}.`
    };
  }

  const generated = [];
  let id = 1;
  for (const bank of banks) {
    for (const fact of bank.facts) {
      for (let i = 0; i < 2; i += 1) {
        generated.push(makeQuestion(fact, bank, combos[(id + i) % combos.length], id));
        id += 1;
      }
    }
  }

  special.forEach((q, i) => generated.push({ ...q, id: `special-${i + 1}` }));

  window.CS448_QUESTIONS = generated;
})();

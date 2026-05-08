(function () {
  "use strict";

  const authored = [
    {
      module: "Query Evaluation Pipelines",
      topic: "Operator state",
      difficulty: "Medium",
      prompt: "Which statement best describes operator state during iterator-based query execution?",
      choices: { a: "Operators are stateless because each GetNext() call recomputes the entire subtree from scratch", b: "Only the root operator may keep state; child operators must be pure functions", c: "Each operator may keep private state that lets it resume work across repeated GetNext() calls", d: "State is stored only in the query optimizer and is unavailable during execution" },
      answer: "c",
      explanation: "Operators often remember scan position, current join state, hash-table contents, sort progress, or other execution details so GetNext() can continue where it left off."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Pull-based execution",
      difficulty: "Medium",
      prompt: "In a pull-based query execution pipeline, what typically triggers a child operator to do work?",
      choices: { a: "The child periodically pushes tuples upward on a fixed timer", b: "The storage manager broadcasts every page to all operators", c: "The optimizer sends a new plan after every tuple", d: "The parent operator calls GetNext() on the child when it needs another input tuple" },
      answer: "d",
      explanation: "Iterator execution is demand-driven. A parent asks a child for the next tuple only when the parent needs input to produce its own next result."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Pipelining",
      difficulty: "Easy",
      prompt: "What is the key advantage of pipelining between query operators?",
      choices: { a: "It requires every intermediate relation to be sorted", b: "It can pass tuples directly from one operator to another without fully materializing intermediate results", c: "It prevents predicates from being applied until the end of the query", d: "It eliminates the need for any operator-specific state" },
      answer: "b",
      explanation: "Pipelining lets operators stream tuples through the plan, often reducing temporary storage and allowing earlier production of answers."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Blocking operators",
      difficulty: "Medium",
      prompt: "Which operator behavior is characteristic of a blocking operator?",
      choices: { a: "It can return its first output tuple as soon as it receives its first input tuple", b: "It never needs memory or disk space", c: "It must consume a substantial portion, often all, of its input before producing output", d: "It can only appear as a leaf in a physical query plan" },
      answer: "c",
      explanation: "Blocking operators such as full sorting or some aggregation strategies may need to see much or all of the input before they know what output is correct."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Nonblocking operators",
      difficulty: "Easy",
      prompt: "Which operation is typically nonblocking when duplicate elimination is not required?",
      choices: { a: "External sort", b: "Sort-based grouping", c: "Duplicate-preserving projection", d: "Full relation materialization" },
      answer: "c",
      explanation: "A duplicate-preserving projection can transform each input tuple independently by keeping only selected attributes, so it can stream results."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Materialization",
      difficulty: "Medium",
      prompt: "What does it mean to materialize an intermediate result during query execution?",
      choices: { a: "To store the output of an operator as a temporary relation before another operator consumes it", b: "To replace a physical operator with a logical algebra expression", c: "To call Close() before Open() on every operator", d: "To require all joins to use indexes" },
      answer: "a",
      explanation: "Materialization breaks a pipeline by storing an intermediate result, often in memory or on disk, so later operators can read it as an input relation."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Temp operators",
      difficulty: "Hard",
      prompt: "Why might a query plan include an explicit temporary materialization operator between two physical operators?",
      choices: { a: "To guarantee that all predicates are evaluated by the optimizer", b: "To create a reusable or fully produced input when direct streaming would recompute work or violate an operator's needs", c: "To make a sequential scan behave like a hash index", d: "To remove the need for Open() and Close() calls" },
      answer: "b",
      explanation: "A temporary materialization operator stores a subtree result when the next part of the plan needs reuse, rescanning, or a fully generated input."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Left-deep plans",
      difficulty: "Medium",
      prompt: "Why are left-deep join plans often attractive for pipelined execution?",
      choices: { a: "They always avoid scanning base tables", b: "They require every join result to be written to disk", c: "They allow the growing intermediate result to stream into the next join while the other side can be a base input or indexed access", d: "They are the only plans that can represent more than two joins" },
      answer: "c",
      explanation: "In a left-deep plan, the intermediate result stays on one side of the tree, which often makes it easier to pipeline into the next join."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Right-deep plans",
      difficulty: "Hard",
      prompt: "What execution issue can arise with a right-deep join plan in an iterator engine?",
      choices: { a: "Right-deep plans cannot be represented as trees", b: "Right-deep plans always produce incorrect join results", c: "Every right-deep plan must use duplicate elimination", d: "An upper join may have a complex join subtree on one side, which can make pipelining, rescanning, or materialization choices more constrained" },
      answer: "d",
      explanation: "Right-deep plans can be useful, but their shape may put a join subtree where an operator expects an input that is easy to scan, build, or reuse."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Bushy plans",
      difficulty: "Hard",
      prompt: "What is a practical implication of using a bushy join plan?",
      choices: { a: "Independent join subtrees may be evaluated separately, but their intermediate outputs may need coordination or materialization before the final join", b: "The plan can contain only one base relation", c: "The plan eliminates all blocking operators by definition", d: "The plan guarantees that every GetNext() call reads exactly one disk page" },
      answer: "a",
      explanation: "Bushy plans join subsets of relations in separate subtrees. This can expose useful alternatives, but intermediate results may need to be stored or synchronized before being combined."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Nested-loops rescanning",
      difficulty: "Medium",
      prompt: "A tuple-at-a-time nested-loops join uses a left child as the outer input and a right child as the inner input. After the right child reaches end-of-input for the current outer tuple, what is usually required before trying the next outer tuple?",
      choices: { a: "Close the entire join and force the parent to reopen it", b: "Reset or reopen the right child so it can be scanned again for the next outer tuple", c: "Discard the next outer tuple because the right child has no remaining tuples", d: "Materialize the outer child because the inner child cannot be reused" },
      answer: "b",
      explanation: "Nested-loops join compares each outer tuple with the inner input, so the inner subtree must be scanned repeatedly unless another physical strategy avoids that."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Materialization",
      difficulty: "Medium",
      prompt: "Which situation best illustrates why materializing an intermediate result can prevent recomputation?",
      choices: { a: "A filter is applied immediately above a table scan and is read once by one parent", b: "A sort operator must read all input before producing its first output tuple", c: "The same expensive subtree is needed multiple times, so its result is stored once and scanned repeatedly", d: "A LIMIT operator requests only the first tuple from a nonblocking child" },
      answer: "c",
      explanation: "Materialization trades storage and write/read cost for avoiding repeated execution of an expensive producer."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Push versus pull execution",
      difficulty: "Medium",
      prompt: "Which statement correctly contrasts pull-based and push-based execution?",
      choices: { a: "In pull-based execution, parents request tuples from children; in push-based execution, producers send tuples onward without waiting for individual requests", b: "Pull-based execution always materializes every intermediate result; push-based execution never materializes", c: "Pull-based execution is only for joins; push-based execution is only for scans", d: "Pull-based execution requires batches; push-based execution requires one tuple at a time" },
      answer: "a",
      explanation: "The core distinction is control flow: demand from consumers versus production from upstream operators."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Lazy evaluation",
      difficulty: "Medium",
      prompt: "In a lazy iterator plan, the parent repeatedly asks the root operator for one tuple at a time. Which behavior is most consistent with that execution style?",
      choices: { a: "Every table is fully scanned during Open(), before any GetNext() call", b: "Every operator produces all output eagerly and stores it in a temporary table", c: "Work propagates downward only as needed to produce the next requested output tuple", d: "The root operator cannot call GetNext() on its children" },
      answer: "c",
      explanation: "Lazy iterator execution does just enough work to satisfy the current request, while preserving state for later calls."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Early termination",
      difficulty: "Medium",
      prompt: "A nonblocking selection is placed below LIMIT 10, with no blocking operator between them. If qualifying tuples are found early, what is the main benefit?",
      choices: { a: "The selection predicate no longer needs to be evaluated", b: "The scan is guaranteed to read exactly ten physical tuples", c: "The LIMIT must still wait for the entire input to finish", d: "The plan may stop pulling from the scan once enough qualifying tuples have been returned" },
      answer: "d",
      explanation: "With only streaming operators below it, LIMIT can stop demand early after receiving enough output."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Vectorized execution",
      difficulty: "Medium",
      prompt: "Compared with tuple-at-a-time execution, what is a typical advantage of vectorized or batch execution?",
      choices: { a: "It avoids all operator state between calls", b: "It can reduce per-tuple function-call overhead and use CPU/cache behavior more effectively", c: "It makes every blocking operator nonblocking", d: "It guarantees fewer disk I/Os for every query plan" },
      answer: "b",
      explanation: "Batch processing amortizes interpretation and call overhead across many tuples and can improve locality."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Hash join blocking",
      difficulty: "Medium",
      prompt: "In a hash join that first builds a hash table on one input and then probes with the other input, which statement best describes its pipeline behavior?",
      choices: { a: "Both inputs can produce joined output before either input is read", b: "The build input streams directly to the parent without being stored", c: "The probe input must always be fully materialized before probing begins", d: "The build side is a pipeline breaker, but the probe side can often produce output incrementally after the hash table is built" },
      answer: "d",
      explanation: "The build relation must be consumed to construct the hash table, but probe tuples can then be processed one at a time."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Resource lifetime",
      difficulty: "Medium",
      prompt: "Why is the Close() operation important in an iterator-based execution plan?",
      choices: { a: "It releases resources such as cursors, buffers, temporary files, or hash tables held by the operator", b: "It chooses the logical query plan", c: "It estimates predicate selectivity", d: "It converts every blocking operator into a streaming operator" },
      answer: "a",
      explanation: "Operators may hold execution resources while open, and Close() gives them a structured point to clean those resources up."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Grouped aggregation",
      difficulty: "Medium",
      prompt: "When can grouped aggregation produce some final group results before reading the entire input?",
      choices: { a: "Only when the query contains no GROUP BY clause", b: "Only when the input is randomly ordered", c: "When the input is ordered by group key, so a group can be finalized once the next group begins", d: "Never, because all grouped aggregation must be fully blocking" },
      answer: "c",
      explanation: "With grouped input, the operator can finish one group after it has seen all tuples for that group, even if later groups remain unread."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Pipeline breakers",
      difficulty: "Medium",
      prompt: "Which plan is least likely to produce its first final output tuple quickly?",
      choices: { a: "TableScan -> Selection -> Projection", b: "IndexScan -> Selection -> Projection", c: "TableScan -> Projection -> Limit", d: "TableScan -> Sort -> Projection" },
      answer: "d",
      explanation: "The full sort breaks the pipeline because it may need to consume and order the input before projection can receive any tuple."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Partially blocking operators",
      difficulty: "Hard",
      prompt: "Why is it useful to distinguish fully blocking operators from operators that are only blocking for part of their input?",
      choices: { a: "Because all operators eventually become table scans", b: "Because some operators can produce output after one phase finishes, even though they cannot stream from the very first tuple", c: "Because partially blocking operators are never allowed in iterator plans", d: "Because blocking behavior affects only optimizer statistics and never runtime execution" },
      answer: "b",
      explanation: "For example, a build-then-probe hash join blocks on its build phase but can stream probe-side matches after the build structure is ready."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Backpressure",
      difficulty: "Hard",
      prompt: "In a pull-based iterator engine, how can a slow parent naturally limit the work done by its children?",
      choices: { a: "Children generally do not run far ahead unless the parent asks for more tuples", b: "Children must always materialize their full outputs before the parent can run", c: "The optimizer recompiles the query after every slow tuple", d: "The storage manager deletes unrequested pages from disk" },
      answer: "a",
      explanation: "Because work is driven by parent requests, children usually advance only as far as needed to satisfy current demand."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Rescannability",
      difficulty: "Hard",
      prompt: "Why might a physical operator care whether its child subtree is rescannable?",
      choices: { a: "A child that cannot be restarted or replayed may need to be materialized if the parent must read it more than once", b: "Rescannability means the child has no output schema", c: "Only logical algebra operators can be rescannable", d: "A rescannable child always has lower cardinality than a non-rescannable child" },
      answer: "a",
      explanation: "Operators such as nested-loops joins may need to read an inner input repeatedly. If a subtree cannot be rescanned cheaply, storing its output can make repeated reads possible."
    }
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    const start = window.DBMS_QUESTIONS.length + 1;
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `generated-pipeline-conceptual-${start + index}`,
      source: question.module
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

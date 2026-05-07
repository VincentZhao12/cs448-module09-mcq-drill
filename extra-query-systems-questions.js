(function () {
  "use strict";

  const authored = [
    {
      module: "Query Processing Algorithms",
      topic: "External sorting",
      difficulty: "Hard",
      prompt: "A relation has 1,000 pages and the system has 11 buffer pages available for external merge sort. Assuming replacement selection is not used, and counting both reads and writes for every pass including writing the final sorted file, what is the estimated I/O cost?",
      choices: { a: "2,000 I/Os", b: "4,000 I/Os", c: "6,000 I/Os", d: "8,000 I/Os" },
      answer: "c",
      explanation: "Initial run generation creates ceil(1000/11)=91 runs. With fan-in 10, two merge passes are needed, so the total is 2N times 3 passes = 6,000 I/Os."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Block nested-loops join",
      difficulty: "Hard",
      prompt: "Relation R has 200 pages, relation S has 1,500 pages, and 52 buffer pages are available. Using block nested-loops join with R as the outer relation, what is the I/O cost?",
      choices: { a: "1,700 I/Os", b: "6,200 I/Os", c: "7,700 I/Os", d: "300,200 I/Os" },
      answer: "b",
      explanation: "Block nested-loops join reads the outer once and scans the inner once per outer chunk. With B-2=50 outer pages per chunk, cost is 200 + ceil(200/50) * 1500 = 6,200."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Grace hash join",
      difficulty: "Hard",
      prompt: "A two-pass Grace hash join is planned with 11 buffer pages. The smaller input has 90 pages. Ignoring skew, which statement best describes whether the two-pass plan is feasible?",
      choices: { a: "Feasible, because each smaller-side partition is expected to have about 9 pages and can fit in memory", b: "Feasible only if the larger input has fewer than 90 pages", c: "Not feasible, because the smaller input must be no larger than 11 pages", d: "Not feasible, because hash join requires both inputs to be sorted first" },
      answer: "a",
      explanation: "The partitioning pass creates up to B-1=10 partitions. The smaller input's partitions are expected to be about 90/10=9 pages, which fit within the B-2 build space."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Index nested-loops join",
      difficulty: "Medium",
      prompt: "R has 1,000 tuples stored in 100 pages. S has a B+-tree index that costs 3 page I/Os per lookup on the join attribute, and each matching S tuple is on one data page. If R is scanned as the outer relation and each R tuple has exactly one match in S, what is the estimated I/O cost?",
      choices: { a: "100 I/Os", b: "3,100 I/Os", c: "4,100 I/Os", d: "100,000 I/Os" },
      answer: "c",
      explanation: "The plan scans R once, then performs 1,000 index lookups. Each lookup costs 3 index I/Os plus 1 data-page fetch, giving 100 + 1,000 * 4 = 4,100."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Selection access paths",
      difficulty: "Medium",
      prompt: "A query selects 2% of a large table using a predicate on column A. There is a clustered B+-tree index on A and the qualifying values form a contiguous range. Why is the clustered index often attractive?",
      choices: { a: "It can locate the first qualifying entry and then read mostly contiguous data pages", b: "It guarantees that no data pages need to be read", c: "It avoids evaluating the predicate on returned tuples", d: "It always beats a table scan regardless of selectivity" },
      answer: "a",
      explanation: "A clustered range index keeps nearby key values near each other on disk, so the qualifying records can often be fetched with far fewer random reads."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Duplicate elimination",
      difficulty: "Medium",
      prompt: "A DISTINCT query must remove duplicates from a relation that is too large to fit in memory. Which physical strategy naturally produces a sorted result as a byproduct?",
      choices: { a: "Sort the relation on the DISTINCT columns and suppress repeated adjacent values", b: "Use tuple nested-loops over the relation", c: "Build an unclustered index on an unrelated column", d: "Apply a selection predicate before reading any pages" },
      answer: "a",
      explanation: "Sort-based duplicate elimination groups equal values next to each other, so duplicates can be removed during the scan of the sorted runs and the output remains sorted."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Blocking operators",
      difficulty: "Medium",
      prompt: "A plan contains TableScan -> Sort -> Limit 10. Why can the first call to GetNext() above the Sort be delayed even though only 10 rows are requested?",
      choices: { a: "Sort is blocking and may need to consume all input before returning the first tuple", b: "Limit is blocking and must consume the entire sorted output", c: "TableScan can only return tuples after all pages have been pinned", d: "The iterator model requires every operator to materialize its output" },
      answer: "a",
      explanation: "A full sort cannot know the first tuple in sorted order until it has consumed and ordered its input, so it breaks the pipeline before Limit can receive rows."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Iterator state",
      difficulty: "Medium",
      prompt: "A nested-loops join iterator has already returned several matching pairs for the current outer tuple. On its next GetNext() call, what state must it remember to continue correctly?",
      choices: { a: "Only the total number of pages in the inner relation", b: "The current outer tuple and the current position in the inner input", c: "Only the final cardinality estimate for the join", d: "No state, because GetNext() calls are independent" },
      answer: "b",
      explanation: "The iterator must resume where it left off, keeping enough state to continue scanning the inner input for the current outer tuple before advancing."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Pipeline breakers",
      difficulty: "Hard",
      prompt: "A left-deep plan computes ((R join S) join T). The R-S join is a hash join implemented by fully building a hash table on S before probing with R. Which input can be streamed during probing to produce output incrementally?",
      choices: { a: "S during the build phase", b: "R during the probe phase", c: "Both R and S before either input is read completely", d: "Neither input, because every hash join always writes both inputs to disk" },
      answer: "b",
      explanation: "The build input must be consumed before probing starts, but once the hash table exists, probe tuples from R can flow through and produce join output incrementally."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Materialization",
      difficulty: "Medium",
      prompt: "An intermediate result is consumed twice by different parent operators. Which plan choice is most likely to avoid recomputing the intermediate result?",
      choices: { a: "Pipeline it directly into the first parent and discard each tuple", b: "Materialize it once, then let both parents scan the stored result", c: "Force every operator above it to be a selection", d: "Replace all indexes with table scans" },
      answer: "b",
      explanation: "Materialization stores the intermediate output so multiple consumers can read it without rerunning the entire producer subtree."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Operator placement",
      difficulty: "Medium",
      prompt: "A selection predicate references only columns of R in the plan R join S. What is the main pipeline benefit of placing the selection immediately above the R scan when possible?",
      choices: { a: "It can reduce the number of R tuples flowing into later operators", b: "It forces the join output to be sorted", c: "It makes the join result larger but easier to estimate", d: "It guarantees that no indexes are needed" },
      answer: "a",
      explanation: "Pushing a selection close to its input filters tuples early, reducing work and memory pressure for downstream pipeline operators."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Open-GetNext-Close protocol",
      difficulty: "Easy",
      prompt: "In a standard iterator execution engine, what is the role of Open() for an operator?",
      choices: { a: "Initialize the operator's local state and open its children", b: "Return every tuple produced by the operator", c: "Estimate the cost of all possible join orders", d: "Force the transaction to commit before execution" },
      answer: "a",
      explanation: "Open() prepares the operator for execution, commonly by initializing state and recursively opening child operators before GetNext() is called."
    },
    {
      module: "Query Optimization",
      topic: "Selection selectivity",
      difficulty: "Medium",
      prompt: "A table has 1,000,000 tuples. Column status has 20 distinct values, and the optimizer assumes values are uniformly distributed. What cardinality should it estimate for status = 'ACTIVE'?",
      choices: { a: "20 tuples", b: "50,000 tuples", c: "500,000 tuples", d: "1,000,000 tuples" },
      answer: "b",
      explanation: "Under the uniformity assumption, an equality predicate on one of 20 distinct values has selectivity 1/20, so the estimate is 50,000 tuples."
    },
    {
      module: "Query Optimization",
      topic: "Join cardinality",
      difficulty: "Hard",
      prompt: "R(A, B) has 40,000 tuples and S(B, C) has 10,000 tuples. The optimizer knows V(R, B)=2,000 and V(S, B)=500. Using the common containment estimate for an equijoin on B, what is the estimated join size?",
      choices: { a: "50,000 tuples", b: "200,000 tuples", c: "800,000 tuples", d: "400,000,000 tuples" },
      answer: "b",
      explanation: "The standard estimate is |R| * |S| / max(V(R,B), V(S,B)) = 40,000 * 10,000 / 2,000 = 200,000."
    },
    {
      module: "Query Optimization",
      topic: "Selection pushdown",
      difficulty: "Medium",
      prompt: "A query joins Orders and Customers, then filters Customers.region = 'West'. Which rewrite is usually valid and beneficial?",
      choices: { a: "Apply Customers.region = 'West' before joining Customers with Orders", b: "Apply Customers.region = 'West' to Orders before the join", c: "Remove the join because a selection is present", d: "Delay the selection until after all projections are removed" },
      answer: "a",
      explanation: "A predicate that references only Customers can be pushed below the join on the Customers input, reducing the join input without changing query semantics."
    },
    {
      module: "Query Optimization",
      topic: "Dynamic programming join order",
      difficulty: "Hard",
      prompt: "A Selinger-style optimizer considers left-deep plans for four relations A, B, C, and D. What is the key dynamic-programming idea that prevents enumerating every physical plan from scratch?",
      choices: { a: "Keep the best known plan for each subset of joined relations, possibly per interesting order", b: "Always join relations in alphabetical order", c: "Choose the largest relation first and never reconsider it", d: "Estimate only final output cardinality and ignore intermediate costs" },
      answer: "a",
      explanation: "Dynamic programming builds larger plans from optimal smaller subplans for relation subsets, while retaining extra winners when physical properties such as interesting orders may help later."
    },
    {
      module: "Query Optimization",
      topic: "Histograms and skew",
      difficulty: "Medium",
      prompt: "A column has severe skew: one value appears in 40% of rows, while most values are rare. Why can a histogram improve estimates over using only the number of distinct values?",
      choices: { a: "It can represent non-uniform value frequencies instead of assuming every value is equally likely", b: "It makes every index clustered", c: "It computes the exact result of every future query", d: "It eliminates the need to estimate join costs" },
      answer: "a",
      explanation: "Distinct-value counts alone often imply a uniform distribution; histograms give the optimizer information about skewed ranges or frequent values."
    },
    {
      module: "Query Optimization",
      topic: "Interesting orders",
      difficulty: "Hard",
      prompt: "A query joins R and S on k and then evaluates ORDER BY k. Plan A is cheapest for the join but outputs unsorted tuples. Plan B costs slightly more for the join but outputs tuples ordered by k. Why might an optimizer retain Plan B?",
      choices: { a: "Its order may avoid a later sort, making the complete query cheaper", b: "Ordered output always means the join result has fewer tuples", c: "ORDER BY k changes the join predicate into a selection", d: "The optimizer must keep every possible plan regardless of cost" },
      answer: "a",
      explanation: "An interesting order can reduce downstream work. A locally more expensive plan may be globally cheaper if it provides an order needed later."
    }
  ];

  const start = window.DBMS_QUESTIONS.length + 1;
  window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
    ...question,
    id: `draft-query-systems-${start + index}`,
    source: question.module
  })));
})();

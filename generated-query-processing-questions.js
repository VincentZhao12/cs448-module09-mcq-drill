(function () {
  "use strict";

  const authored = [
    {
      module: "Query Processing Algorithms",
      topic: "External sorting",
      difficulty: "Medium",
      prompt: "A two-way external merge sort is run on a file with 128 pages using the basic version where pass 0 sorts each page and every pass reads and writes the whole file. How many I/Os are required?",
      choices: { a: "256 I/Os", b: "1,792 I/Os", c: "2,048 I/Os", d: "16,384 I/Os" },
      answer: "c",
      explanation: "The basic two-way method takes ceil(log2 128) + 1 = 8 passes. Each pass costs 2N I/Os, so the total is 2 * 128 * 8 = 2,048."
    },
    {
      module: "Query Processing Algorithms",
      topic: "External sorting",
      difficulty: "Hard",
      prompt: "A relation has 900 pages and 31 buffer pages are available for external merge sort. Initial runs use all buffers, and each merge pass can merge 30 runs. Counting the final write, what is the total sort cost?",
      choices: { a: "1,800 I/Os", b: "3,600 I/Os", c: "5,400 I/Os", d: "27,000 I/Os" },
      answer: "b",
      explanation: "Run generation creates ceil(900 / 31) = 30 runs, which fit in one 30-way merge pass. Two full read/write passes cost 2N * 2 = 3,600 I/Os."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Sort-based duplicate elimination",
      difficulty: "Medium",
      prompt: "After a table is sorted on all DISTINCT attributes, why can duplicate elimination be performed with a single sequential pass?",
      choices: { a: "Equal projected tuples appear adjacent to each other", b: "Sorting changes every duplicate into a null value", c: "The table's primary key is automatically removed", d: "Every page contains at most one tuple after sorting" },
      answer: "a",
      explanation: "Sorting clusters identical values together, so the scan only needs to compare the current tuple with the last distinct tuple emitted."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Hash-based duplicate elimination",
      difficulty: "Medium",
      prompt: "A hash-based DISTINCT operator keeps a hash table of values already seen. Under what condition can it emit a newly seen tuple immediately?",
      choices: { a: "When probing the hash table finds no equal tuple", b: "Only after the complete input has been sorted", c: "Only after reading the final input page", d: "When the tuple is smaller than the previous tuple in sort order" },
      answer: "a",
      explanation: "If no equal tuple has been seen, the operator inserts the value into the hash table and can output it as a distinct result immediately."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Selection algorithms",
      difficulty: "Medium",
      prompt: "A selection predicate is A = 17. The table has both a hash index on A and a B+ tree index on A. Which access path is usually most directly suited to the equality lookup?",
      choices: { a: "The hash index, because equality probes are its natural use case", b: "Only a full table scan, because indexes cannot evaluate equality", c: "The B+ tree only if the predicate is changed to A < 17", d: "External sort followed by a merge pass" },
      answer: "a",
      explanation: "Hash indexes are designed for direct equality probes. A tree index can also support equality, but the hash index is the most direct match."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Selection algorithms",
      difficulty: "Medium",
      prompt: "A query asks for 40% of a heap file through an unclustered secondary index. Why might a table scan be cheaper than using the index?",
      choices: { a: "The index may cause many random data-page fetches, possibly approaching one per qualifying tuple", b: "Unclustered indexes cannot store record identifiers", c: "A table scan reads only qualifying pages and skips all others for free", d: "The index must first sort the entire table on disk" },
      answer: "a",
      explanation: "With high selectivity, an unclustered index can turn into many random page reads, while a table scan reads each page once sequentially."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Projection algorithms",
      difficulty: "Medium",
      prompt: "Projection without duplicate elimination is applied to a table scan. Which behavior best describes the physical operator?",
      choices: { a: "For each input tuple, output only the requested attributes and continue", b: "Sort the entire input before returning any projected tuple", c: "Build a hash table keyed by the entire original tuple", d: "Probe the join index once for every projected attribute" },
      answer: "a",
      explanation: "Duplicate-preserving projection can be pipelined tuple by tuple because it only removes columns, not repeated rows."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Projection algorithms",
      difficulty: "Hard",
      prompt: "A projection list contains a declared key of relation R. What optimization is valid for ordinary relational projection that normally removes duplicates?",
      choices: { a: "Use duplicate-preserving projection because two input tuples cannot agree on all projected attributes", b: "Replace the projection with a Cartesian product", c: "Force sort-based duplicate elimination anyway", d: "Drop the key attribute before scanning R" },
      answer: "a",
      explanation: "If the projected attributes include a key, distinct input tuples remain distinct after projection, so duplicate elimination is unnecessary."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Nested-loops join cost",
      difficulty: "Hard",
      prompt: "R has 80 pages and 8,000 tuples. S has 500 pages. What is the I/O cost of tuple-oriented nested-loops join with R as the outer input?",
      choices: { a: "580 I/Os", b: "40,080 I/Os", c: "4,000,080 I/Os", d: "4,000,000,000 I/Os" },
      answer: "c",
      explanation: "Tuple nested-loops join scans the inner once per outer tuple: Nr + |R| * Ns = 80 + 8,000 * 500 = 4,000,080 I/Os."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Block nested-loops join cost",
      difficulty: "Hard",
      prompt: "R has 240 pages, S has 1,200 pages, and a block nested-loops join can hold 30 pages of the outer relation per chunk. Using R as outer, what is the I/O cost?",
      choices: { a: "1,440 I/Os", b: "9,840 I/Os", c: "288,240 I/Os", d: "1,200 + 30 * 240 I/Os" },
      answer: "b",
      explanation: "The outer is read once, and the inner is scanned for ceil(240 / 30) = 8 chunks. Cost is 240 + 8 * 1,200 = 9,840."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Indexed nested-loops join",
      difficulty: "Medium",
      prompt: "In an indexed nested-loops join, why is the index normally placed on the inner relation's join attribute?",
      choices: { a: "Each outer tuple can use its join value to probe matching inner tuples", b: "The outer relation must be sorted before every probe", c: "The index prevents the outer relation from being scanned", d: "Indexes can only be built on temporary join outputs" },
      answer: "a",
      explanation: "The algorithm scans the outer input and uses each outer tuple's join key to look up matching tuples from the inner input."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Hash join",
      difficulty: "Medium",
      prompt: "A Grace hash join partitions both relations using the same hash function on the join key. What is the reason corresponding partitions can be joined independently?",
      choices: { a: "Any two tuples with equal join keys are sent to corresponding partitions", b: "The hash function sorts each partition internally", c: "Each partition is guaranteed to have no duplicates", d: "Only nonmatching tuples are written during partitioning" },
      answer: "a",
      explanation: "Using the same hash function ensures that possible matches land in the same partition pair, so different pairs do not need to be compared."
    },
    {
      module: "Query Processing Algorithms",
      topic: "Join algorithm choice",
      difficulty: "Medium",
      prompt: "Which join family is generally applicable to an arbitrary theta join predicate such as R.x + S.y < 10 when no helpful index exists?",
      choices: { a: "Nested-loops join", b: "Hash join", c: "Sort-merge equijoin", d: "Duplicate-preserving projection" },
      answer: "a",
      explanation: "Nested-loops join can test any predicate on tuple pairs. Hash and sort-merge joins mainly exploit equality or ordered comparisons."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Iterator model",
      difficulty: "Easy",
      prompt: "In the iterator model, which call asks an operator to produce its next available tuple, or report end-of-input?",
      choices: { a: "Open()", b: "GetNext()", c: "Close()", d: "Explain()" },
      answer: "b",
      explanation: "Open initializes the operator, GetNext requests the next tuple, and Close releases resources."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Blocking vs pipelined operators",
      difficulty: "Medium",
      prompt: "Which operator is most clearly blocking for a full result because it cannot produce the first globally ordered tuple until it has consumed its input?",
      choices: { a: "Full external sort", b: "Table scan", c: "Simple selection", d: "Duplicate-preserving projection" },
      answer: "a",
      explanation: "A full sort must inspect and order the input before it can safely emit the first tuple in global sorted order."
    },
    {
      module: "Query Evaluation Pipelines",
      topic: "Pipelined operators",
      difficulty: "Medium",
      prompt: "A selection operator sits above a table scan in a pull-based pipeline. If the next scan tuple fails the predicate, what should the selection operator do during the same GetNext() call?",
      choices: { a: "Keep pulling from its child until it finds a qualifying tuple or reaches end-of-input", b: "Return the failed tuple and let the parent discard it", c: "Close the table scan permanently", d: "Materialize the entire table before checking the predicate" },
      answer: "a",
      explanation: "A selection iterator hides rejected tuples from its parent by continuing to request child tuples until it can return a qualifying tuple or done."
    }
  ];

  const start = window.DBMS_QUESTIONS.length + 1;
  window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
    ...question,
    id: `generated-query-processing-${start + index}`,
    source: question.module
  })));
})();

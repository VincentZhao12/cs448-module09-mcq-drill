(function () {
  "use strict";

  const authored = [
    {
      module: "Query Optimization",
      topic: "Logical rewrites",
      difficulty: "Medium",
      prompt: "A query contains R CROSS JOIN S followed by a predicate R.a = S.a. Which logical rewrite is usually the optimizer's first step?",
      choices: { a: "Replace the cross product and predicate with an equijoin on R.a = S.a", b: "Remove S because the predicate mentions R", c: "Sort both tables before any cardinality estimates are made", d: "Convert the predicate into a projection on R.a" },
      answer: "a",
      explanation: "A cross product followed by a join predicate is equivalent to a join, and the join form gives the optimizer better physical choices."
    },
    {
      module: "Query Optimization",
      topic: "Selection pushdown",
      difficulty: "Medium",
      prompt: "In the expression sigma_R.status='open'(R join S), the predicate references only R. Why is pushing the selection below the join usually beneficial?",
      choices: { a: "It reduces the number of R tuples that participate in the join", b: "It changes an inner join into an outer join", c: "It guarantees that the join output is sorted", d: "It makes the predicate independent of table statistics" },
      answer: "a",
      explanation: "Applying a single-table predicate before the join preserves semantics and can shrink the input to later operators."
    },
    {
      module: "Query Optimization",
      topic: "Projection pushdown",
      difficulty: "Hard",
      prompt: "A plan computes pi_R.name,S.grade(R join_{R.sid=S.sid} S). Which projection-pushdown rewrite is safe before the join?",
      choices: { a: "Project R to {name, sid} and S to {grade, sid}", b: "Project R to {name} and S to {grade}", c: "Project both inputs to only {sid}", d: "Remove all projections until after physical operator selection" },
      answer: "a",
      explanation: "Projection may be pushed below a join only if each side keeps the attributes needed later plus the join attributes needed to perform the join."
    },
    {
      module: "Query Optimization",
      topic: "Selectivity estimation",
      difficulty: "Medium",
      prompt: "A table has 600,000 tuples. Attribute dept has 30 distinct values, and the optimizer assumes uniform distribution. What cardinality should it estimate for dept = 'Sales'?",
      choices: { a: "20,000 tuples", b: "30,000 tuples", c: "300,000 tuples", d: "600,000 tuples" },
      answer: "a",
      explanation: "Under uniformity, equality on one of 30 distinct values has selectivity 1/30, so 600,000 / 30 = 20,000."
    },
    {
      module: "Query Optimization",
      topic: "Range selectivity",
      difficulty: "Medium",
      prompt: "A column age has minimum 0 and maximum 100. Assuming a uniform distribution, what selectivity should be estimated for age between 20 and 50?",
      choices: { a: "0.20", b: "0.30", c: "0.50", d: "0.70" },
      answer: "b",
      explanation: "The range covers 30 units out of the 100-unit domain, so the estimated selectivity is about 0.30."
    },
    {
      module: "Query Optimization",
      topic: "Join cardinality",
      difficulty: "Hard",
      prompt: "R(A, B) has 80,000 tuples with V(R,B)=4,000. S(B, C) has 25,000 tuples with V(S,B)=1,000. Using the common containment estimate for an equijoin on B, what is the estimated join cardinality?",
      choices: { a: "20,000 tuples", b: "100,000 tuples", c: "500,000 tuples", d: "2,000,000,000 tuples" },
      answer: "c",
      explanation: "The standard estimate is |R| * |S| / max(V(R,B), V(S,B)) = 80,000 * 25,000 / 4,000 = 500,000."
    },
    {
      module: "Query Optimization",
      topic: "Foreign-key joins",
      difficulty: "Medium",
      prompt: "Lineitem.order_id is a foreign key referencing Orders.order_id. If Lineitem has 5,000,000 tuples and every lineitem has a matching order, what is the estimated size of Lineitem join Orders on order_id?",
      choices: { a: "The number of Orders tuples", b: "5,000,000 tuples", c: "The product of the two table sizes", d: "The number of distinct order_id values in Orders squared" },
      answer: "b",
      explanation: "For a many-to-one foreign-key/primary-key join with referential integrity, each referencing tuple matches one referenced tuple."
    },
    {
      module: "Query Optimization",
      topic: "Cost models",
      difficulty: "Hard",
      prompt: "A B+-tree has height 3 and stores key-tid pairs. A key equality predicate matches exactly one tuple. In a simple I/O model, what access cost is most appropriate?",
      choices: { a: "3 I/Os, because only the index path is read", b: "4 I/Os, for the index path plus one data-page fetch", c: "3 times the number of table pages", d: "The number of distinct key values" },
      answer: "b",
      explanation: "With key-tid entries, the lookup descends the index and then fetches the data page containing the matching tuple."
    },
    {
      module: "Query Optimization",
      topic: "Cost models",
      difficulty: "Medium",
      prompt: "Why can an unclustered B+-tree range scan be more expensive than a full table scan when many tuples qualify?",
      choices: { a: "It may perform many random data-page fetches after reading index entries", b: "Unclustered indexes cannot support range predicates", c: "It always requires sorting the base table first", d: "It returns incorrect duplicates unless the table is scanned too" },
      answer: "a",
      explanation: "When many qualifying records are scattered across pages, following many tids can cost more random I/O than simply scanning the table."
    },
    {
      module: "Query Optimization",
      topic: "Join ordering",
      difficulty: "Medium",
      prompt: "For a query joining four tables, how many left-deep logical join orders are considered if every permutation is allowed?",
      choices: { a: "4", b: "8", c: "16", d: "24" },
      answer: "d",
      explanation: "A left-deep plan fixes an ordered sequence of tables. With four tables, there are 4! = 24 possible orders."
    },
    {
      module: "Query Optimization",
      topic: "Dynamic programming",
      difficulty: "Hard",
      prompt: "In a bottom-up dynamic-programming optimizer for left-deep plans, what is the main reason to store the best plan for each subset of joined tables?",
      choices: { a: "Larger plans can reuse the best known subplans instead of re-enumerating all internal choices", b: "It proves that selectivities are always independent", c: "It eliminates the need to consider physical join algorithms", d: "It makes bushy and left-deep trees have the same search space" },
      answer: "a",
      explanation: "Dynamic programming builds larger alternatives from previously optimized smaller subsets, reducing repeated work while preserving useful candidates."
    },
    {
      module: "Query Optimization",
      topic: "Interesting orders",
      difficulty: "Medium",
      prompt: "A one-table access path is not the cheapest way to read R, but it returns R sorted on R.a. Why might the optimizer keep this plan?",
      choices: { a: "The order may avoid a later sort for a merge join, ORDER BY, GROUP BY, or duplicate elimination", b: "Sorted tuples always have lower cardinality", c: "A sorted access path makes all predicates independent", d: "The cheapest plan is never useful in later passes" },
      answer: "a",
      explanation: "Interesting orders can make a locally more expensive plan globally cheaper by saving later sorting work."
    },
    {
      module: "Query Optimization",
      topic: "Interesting orders",
      difficulty: "Hard",
      prompt: "Two plans for R join S have the same output cardinality. Plan P costs 1,000 and is unordered. Plan Q costs 1,150 and outputs tuples sorted on the next join key with T. What should a Selinger-style optimizer often do?",
      choices: { a: "Discard Q because it is not the cheapest plan for the same relations", b: "Keep both P and Q, because Q has an interesting order", c: "Discard P because sorted plans always dominate unordered plans", d: "Replace both plans with a table scan of T" },
      answer: "b",
      explanation: "The optimizer keeps the cheapest plan and also plans with useful physical properties such as sort order that may reduce future cost."
    },
    {
      module: "Query Optimization",
      topic: "Histograms and skew",
      difficulty: "Medium",
      prompt: "A column has 1,000,000 rows and 100 distinct values, but one value, 'UNKNOWN', appears in 400,000 rows. What is the main risk of estimating status = 'UNKNOWN' using only 1/V(status)?",
      choices: { a: "The optimizer will likely underestimate the predicate output", b: "The optimizer will likely overestimate the predicate output", c: "The optimizer will know the exact count anyway", d: "The estimate will be unaffected by skew" },
      answer: "a",
      explanation: "A uniform estimate would predict 10,000 rows, far below the true 400,000 rows for the skewed frequent value."
    },
    {
      module: "Query Optimization",
      topic: "Histograms and skew",
      difficulty: "Hard",
      prompt: "A range predicate overlaps only part of a histogram bucket. What is the usual estimation approach inside that bucket when no more detailed statistics are available?",
      choices: { a: "Interpolate within the bucket using an assumption such as uniformity inside the bucket", b: "Ignore the entire bucket to avoid overestimation", c: "Count the entire bucket as qualifying regardless of overlap", d: "Treat the predicate as an equality predicate on the bucket boundary" },
      answer: "a",
      explanation: "Histograms often require interpolation for partially covered buckets, commonly assuming values are uniform within that bucket."
    },
    {
      module: "Query Optimization",
      topic: "Query rewrite heuristics",
      difficulty: "Hard",
      prompt: "A query computes a join of Sales and Products and then groups by Products.category. In which situation can pushing aggregation below the join be especially helpful?",
      choices: { a: "When many Sales rows can be pre-aggregated by product or join key before joining", b: "When the join key is not needed after the rewrite", c: "When grouping makes the join predicate false", d: "When the optimizer has no statistics on either table" },
      answer: "a",
      explanation: "Pre-aggregating on keys compatible with the join can reduce the number of tuples flowing into the join while preserving aggregate results."
    }
  ];

  const start = window.DBMS_QUESTIONS.length + 1;
  window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
    ...question,
    id: `generated-optimization-${start + index}`,
    source: question.module
  })));
})();

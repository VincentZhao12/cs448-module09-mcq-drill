(function () {
  "use strict";

  const authored = [
    {
      id: "additional-optimization-1",
      module: "Query Optimization",
      topic: "Sargable predicates",
      difficulty: "Medium",
      prompt: "A table has a B+-tree index on order_date. Which predicate is most likely to let the optimizer use an efficient index range scan?",
      choices: { a: "YEAR(order_date) = 2026", b: "order_date >= DATE '2026-01-01' AND order_date < DATE '2027-01-01'", c: "CAST(order_date AS CHAR) LIKE '2026%'", d: "order_date + INTERVAL '1' DAY >= DATE '2026-01-02'" },
      answer: "b",
      explanation: "The range predicate compares the indexed column directly to constants, so the optimizer can navigate to the first matching key and scan the contiguous range."
    },
    {
      id: "additional-optimization-2",
      module: "Query Optimization",
      topic: "Subquery decorrelation",
      difficulty: "Hard",
      prompt: "A query returns customers for whom EXISTS finds at least one matching order with the same customer_id. Why might an optimizer rewrite the correlated EXISTS subquery as a semijoin?",
      choices: { a: "A semijoin can avoid rerunning the subquery separately for every customer while preserving the existence test", b: "A semijoin always returns every matching order row as part of the final output", c: "A semijoin changes EXISTS into a count of all matching orders", d: "A semijoin is valid only when the Orders table has no indexes" },
      answer: "a",
      explanation: "Decorrelating EXISTS into a semijoin lets the optimizer choose join algorithms and access paths while still returning each qualifying outer row at most once."
    },
    {
      id: "additional-optimization-3",
      module: "Query Optimization",
      topic: "Cost model tradeoffs",
      difficulty: "Medium",
      prompt: "Two equivalent plans produce the same rows. Plan A has fewer estimated disk I/Os, but Plan B avoids a large sort and has much lower estimated CPU cost. What should a cost-based optimizer do?",
      choices: { a: "Choose Plan A because disk I/O is the only cost that matters", b: "Choose Plan B automatically because sorts are never useful", c: "Compare the total estimated cost under the system's cost model", d: "Reject both plans because equivalent logical plans cannot have different physical costs" },
      answer: "c",
      explanation: "A cost-based optimizer combines modeled resources such as I/O, CPU, memory, and sorting work; the best plan is the one with the lowest total estimated cost."
    }
  ];

  if (typeof window !== "undefined" && Array.isArray(window.DBMS_QUESTIONS)) {
    window.DBMS_QUESTIONS.push(...authored.map((question) => ({
      ...question,
      source: question.module
    })));
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = authored;
  }
})();

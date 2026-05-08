(function () {
  "use strict";

  const authored = [
    {
      id: "additional-query-systems-1",
      module: "Query Processing Algorithms",
      topic: "Sort-merge join",
      difficulty: "Medium",
      prompt: "Two inputs to an equijoin are already sorted on the join key. Compared with first sorting both inputs, what is the main advantage of using sort-merge join in this situation?",
      choices: { a: "It can scan the sorted inputs and produce matches without an additional sort phase", b: "It avoids reading one of the input relations entirely", c: "It guarantees lower cost than every hash join for all data distributions", d: "It can join on non-equality predicates without comparing key values" },
      answer: "a",
      explanation: "When both inputs are already ordered on the join key, sort-merge join can merge the streams directly and avoid paying to sort them again."
    },
    {
      id: "additional-query-systems-2",
      module: "Query Processing Algorithms",
      topic: "Hash aggregation",
      difficulty: "Medium",
      prompt: "A hash-based GROUP BY starts building an in-memory hash table of groups, but the number of distinct groups becomes larger than memory can hold. What is a common response?",
      choices: { a: "Partition the input or partial groups to disk, then aggregate each partition separately", b: "Return only the groups that fit in memory and discard the rest", c: "Switch to tuple nested-loops join because grouping is no longer possible", d: "Sort the final output by every column before any grouping occurs" },
      answer: "a",
      explanation: "When a hash aggregate spills, the system can partition data so each partition's groups are small enough to finish in memory."
    },
    {
      id: "additional-query-systems-3",
      module: "Query Evaluation Pipelines",
      topic: "Pipeline startup",
      difficulty: "Medium",
      prompt: "In a pipelined iterator plan, which operator can usually return its first output tuple before consuming all of its input?",
      choices: { a: "A selection operator whose predicate is satisfied by an early input tuple", b: "A full external sort operator", c: "A duplicate-elimination operator that must compare all tuples", d: "A hash aggregate computing COUNT(*) for the entire relation" },
      answer: "a",
      explanation: "Selection is nonblocking: it can pass along each qualifying tuple as it is found, while sort, duplicate elimination, and full-relation aggregation typically must see more input first."
    }
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    window.DBMS_QUESTIONS.push(...authored.map((question) => ({
      ...question,
      source: question.module
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

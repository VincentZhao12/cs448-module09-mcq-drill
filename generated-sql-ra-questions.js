(function () {
  "use strict";

  const authored = [
    {
      module: "SQL",
      topic: "Bag semantics and DISTINCT",
      difficulty: "Medium",
      prompt: "Table Enrolled has three rows with grades A, A, and B. What does SELECT grade FROM Enrolled return in standard SQL if DISTINCT is not specified?",
      choices: { a: "One row: A", b: "Two rows: A and B", c: "Three rows: A, A, and B", d: "An error, because grade is not a key" },
      answer: "c",
      explanation: "SQL query results use bag semantics by default, so duplicate projected rows are retained unless DISTINCT or a set operator removes them."
    },
    {
      module: "SQL",
      topic: "DISTINCT and keys",
      difficulty: "Medium",
      prompt: "Students(sid, name, gpa) has sid as a key. Which statement about SELECT DISTINCT sid, name FROM Students is correct?",
      choices: { a: "DISTINCT can remove rows that share the same name", b: "DISTINCT has no effect because sid uniquely identifies each input row", c: "The query is invalid unless name is also a key", d: "The result must be sorted by sid" },
      answer: "b",
      explanation: "If a key is included in the projection list, no two projected rows from the same relation instance can be identical, so DISTINCT removes nothing."
    },
    {
      module: "SQL",
      topic: "NULL and predicates",
      difficulty: "Medium",
      prompt: "A row has salary = NULL. In a WHERE clause, how is the predicate salary > 50000 evaluated for that row?",
      choices: { a: "TRUE, because NULL is treated as infinity", b: "FALSE, because NULL is treated as zero", c: "UNKNOWN, so the row is not selected by WHERE", d: "A runtime error is raised" },
      answer: "c",
      explanation: "Comparisons with NULL usually evaluate to UNKNOWN. WHERE keeps only rows for which the predicate is TRUE."
    },
    {
      module: "SQL",
      topic: "Three-valued logic",
      difficulty: "Medium",
      prompt: "Under SQL three-valued logic, what is the result of (UNKNOWN OR TRUE) AND NOT UNKNOWN?",
      choices: { a: "TRUE", b: "FALSE", c: "UNKNOWN", d: "NULL is converted to FALSE before evaluation" },
      answer: "c",
      explanation: "UNKNOWN OR TRUE is TRUE, while NOT UNKNOWN is UNKNOWN. TRUE AND UNKNOWN evaluates to UNKNOWN."
    },
    {
      module: "SQL",
      topic: "Aggregates and NULL",
      difficulty: "Medium",
      prompt: "A group contains three rows where bonus values are NULL, 10, and 20. What is AVG(bonus) for the group?",
      choices: { a: "10", b: "15", c: "30", d: "NULL because the group contains a NULL" },
      answer: "b",
      explanation: "SQL aggregate functions such as AVG ignore NULL input values, so the average is computed over 10 and 20 only."
    },
    {
      module: "SQL",
      topic: "GROUP BY legality",
      difficulty: "Medium",
      prompt: "For Students(sid, name, age, gpa), which SELECT list is legal with GROUP BY age in standard SQL?",
      choices: { a: "SELECT age, AVG(gpa)", b: "SELECT age, name, AVG(gpa)", c: "SELECT sid, age, AVG(gpa)", d: "SELECT name, MIN(gpa)" },
      answer: "a",
      explanation: "Every non-aggregated attribute in the SELECT list must be included in the GROUP BY clause, so age with AVG(gpa) is legal."
    },
    {
      module: "SQL",
      topic: "WHERE versus HAVING",
      difficulty: "Medium",
      prompt: "Which clause should be used to keep only age groups with at least three students after grouping Students by age?",
      choices: { a: "WHERE COUNT(*) >= 3", b: "HAVING COUNT(*) >= 3", c: "GROUP BY COUNT(*) >= 3", d: "SELECT COUNT(*) >= 3" },
      answer: "b",
      explanation: "WHERE filters individual rows before grouping; HAVING filters groups after aggregate values such as COUNT(*) have been computed."
    },
    {
      module: "SQL",
      topic: "Correlated subqueries",
      difficulty: "Hard",
      prompt: "In SELECT i.name FROM Instructor i WHERE EXISTS (SELECT * FROM Teaches t WHERE t.iid = i.iid AND t.cid = 'CS1'), why is the subquery correlated?",
      choices: { a: "It contains a string literal", b: "It references i.iid from the outer query", c: "It uses EXISTS instead of IN", d: "It returns more than one column" },
      answer: "b",
      explanation: "A correlated subquery depends on variables from the outer query block; here the inner query refers to the outer tuple variable i."
    },
    {
      module: "SQL",
      topic: "NOT IN and NULL",
      difficulty: "Hard",
      prompt: "Suppose a subquery used by x NOT IN (subquery) returns the values 1, 2, and NULL. What happens for an outer row with x = 3?",
      choices: { a: "The predicate is TRUE because 3 is not 1 or 2", b: "The predicate is FALSE because NULL equals every value", c: "The predicate is UNKNOWN, so the row is not selected by WHERE", d: "The NULL is ignored exactly as in AVG" },
      answer: "c",
      explanation: "NOT IN is affected by NULLs: because x <> NULL is UNKNOWN, the conjunction needed to prove that x is not in the set becomes UNKNOWN."
    },
    {
      module: "Relational Algebra",
      topic: "Projection and duplicate elimination",
      difficulty: "Medium",
      prompt: "In classical relational algebra, what happens if projection removes the only attribute that distinguished two tuples?",
      choices: { a: "Both duplicate projected tuples remain", b: "One copy remains because relations are sets", c: "The projection is invalid", d: "A NULL is inserted to preserve tuple identity" },
      answer: "b",
      explanation: "Classical relational algebra is set-based, so projection eliminates duplicate tuples that arise after attributes are removed."
    },
    {
      module: "Relational Algebra",
      topic: "Selection and cross product",
      difficulty: "Medium",
      prompt: "The SQL query SELECT A, B FROM R, S WHERE R.x = S.x is conceptually closest to which relational algebra expression?",
      choices: { a: "pi_A,B(sigma_R.x = S.x(R x S))", b: "sigma_A,B(pi_R.x = S.x(R - S))", c: "R union S", d: "pi_R.x = S.x(R) x pi_A,B(S)" },
      answer: "a",
      explanation: "The conceptual evaluation forms the cross product of the FROM relations, applies the WHERE predicate as selection, then projects the SELECT attributes."
    },
    {
      module: "Relational Algebra",
      topic: "Union compatibility",
      difficulty: "Medium",
      prompt: "When is R union S well-defined in classical relational algebra?",
      choices: { a: "Only when R and S have the same number of attributes with compatible corresponding domains", b: "Whenever R and S share at least one attribute name", c: "Only when R has a foreign key referencing S", d: "Whenever both relations are nonempty" },
      answer: "a",
      explanation: "Set operations such as union, intersection, and difference require union-compatible input schemas."
    },
    {
      module: "Relational Algebra",
      topic: "Set difference",
      difficulty: "Medium",
      prompt: "Which statement about relational algebra set difference is correct?",
      choices: { a: "R - S is always the same as S - R", b: "R - S contains tuples in R that are not in S", c: "R - S is defined even when schemas are incompatible", d: "R - S contains only tuples common to both relations" },
      answer: "b",
      explanation: "Set difference is not commutative: R - S keeps compatible-schema tuples that appear in R and not in S."
    },
    {
      module: "Relational Algebra",
      topic: "Natural join versus equi-join",
      difficulty: "Hard",
      prompt: "R(a, b) natural-joins S(b, c). Which output schema should a natural join produce?",
      choices: { a: "(a, b, b, c), keeping both copies of b", b: "(a, c), dropping the common attribute", c: "(a, b, c), keeping one copy of the common attribute b", d: "(b), keeping only the join attribute" },
      answer: "c",
      explanation: "A natural join equates attributes with the same name and keeps only one copy of each common attribute in the output schema."
    },
    {
      module: "Relational Algebra",
      topic: "Division",
      difficulty: "Hard",
      prompt: "R(sid, cid) records enrollments, and S(cid) lists required courses. What does R divided by S return?",
      choices: { a: "Courses that have at least one enrolled student", b: "Students who are enrolled in every course listed in S", c: "Pairs of students and required courses they are missing", d: "Students who are enrolled in no required courses" },
      answer: "b",
      explanation: "Division finds values from R's non-S attributes that are associated in R with all tuples from S."
    },
    {
      module: "Relational Algebra",
      topic: "Outer join",
      difficulty: "Medium",
      prompt: "What distinguishes a left outer join from an inner join?",
      choices: { a: "It returns only rows that have matches on both sides", b: "It preserves unmatched left-side tuples, padding missing right-side attributes with NULLs", c: "It removes all NULL values before joining", d: "It requires the two input schemas to be identical" },
      answer: "b",
      explanation: "A left outer join includes the ordinary join result plus left input tuples that found no match, extended with NULLs for right-side attributes."
    }
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `generated-sql-ra-${index + 1}`,
      source: question.module
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

(function () {
  "use strict";

  const authored = [
    {
      module: "Normalization Theory",
      topic: "Functional dependencies",
      difficulty: "Medium",
      prompt: "In relation R(A, B, C, D), suppose the functional dependencies are A -> B and B -> CD. Which dependency must also hold?",
      choices: { a: "A -> CD", b: "C -> A", c: "D -> B", d: "BC -> A" },
      answer: "a",
      explanation: "By transitivity, A -> B and B -> CD imply A -> CD. The other dependencies are not implied by the given FDs."
    },
    {
      module: "Normalization Theory",
      topic: "Attribute closure",
      difficulty: "Medium",
      prompt: "For R(A, B, C, D, E) with FDs A -> BC, C -> D, and DE -> A, what is A+?",
      choices: { a: "{A, B, C}", b: "{A, B, C, D}", c: "{A, B, C, D, E}", d: "{A, D, E}" },
      answer: "b",
      explanation: "Starting with A, use A -> BC to add B and C, then C -> D to add D. E cannot be derived, so A+ = {A, B, C, D}."
    },
    {
      module: "Normalization Theory",
      topic: "Candidate keys",
      difficulty: "Hard",
      prompt: "For R(A, B, C, D) with FDs A -> C and C -> D, which set is a candidate key?",
      choices: { a: "{A, B}", b: "{B, C}", c: "{C, D}", d: "{A, D}" },
      answer: "a",
      explanation: "AB+ gives A and B, then C from A -> C, and D from C -> D. Neither A nor B alone determines all attributes, so AB is minimal."
    },
    {
      module: "Normalization Theory",
      topic: "Candidate keys",
      difficulty: "Hard",
      prompt: "For R(A, B, C, D, E) with FDs A -> B, C -> D, and BD -> E, which attribute set is a candidate key?",
      choices: { a: "{A, C}", b: "{A, B}", c: "{B, D}", d: "{C, E}" },
      answer: "a",
      explanation: "AC+ includes A and C, then B from A -> B, D from C -> D, and E from BD -> E. A or C alone cannot determine all attributes, so AC is minimal."
    },
    {
      module: "Normalization Theory",
      topic: "Anomalies",
      difficulty: "Medium",
      prompt: "A table stores EmployeeID, EmployeeName, Department, and DepartmentHead. The FD Department -> DepartmentHead holds, and many employees can be in the same department. Which problem best illustrates an update anomaly?",
      choices: { a: "Changing a department head requires modifying many employee rows consistently", b: "The table cannot store more than one employee in a department", c: "EmployeeID no longer determines EmployeeName", d: "Every query must use a natural join" },
      answer: "a",
      explanation: "When the same DepartmentHead value is repeated across rows, a department-head change must be applied everywhere or inconsistent data can result."
    },
    {
      module: "Normalization Theory",
      topic: "Anomalies",
      difficulty: "Medium",
      prompt: "A relation stores StudentID, CourseID, InstructorID, and InstructorOffice, with InstructorID -> InstructorOffice. If the only row for an instructor is deleted when a student drops a course, which anomaly can occur?",
      choices: { a: "Delete anomaly", b: "Update anomaly", c: "Dirty read anomaly", d: "Phantom anomaly" },
      answer: "a",
      explanation: "Deleting an enrollment row may accidentally remove the only stored fact about the instructor's office, which is a delete anomaly caused by redundancy."
    },
    {
      module: "Normalization Theory",
      topic: "BCNF",
      difficulty: "Medium",
      prompt: "R(A, B, C) has FDs A -> B and B -> C. If A is the only candidate key, why is R not in BCNF?",
      choices: { a: "Because B -> C has a non-key determinant", b: "Because A -> B is nontrivial", c: "Because every relation with three attributes violates BCNF", d: "Because C is not on the left side of any FD" },
      answer: "a",
      explanation: "BCNF requires every nontrivial FD X -> Y to have X as a superkey. B is not a superkey, so B -> C violates BCNF."
    },
    {
      module: "Normalization Theory",
      topic: "3NF",
      difficulty: "Hard",
      prompt: "R(A, B, C) has FDs C -> A and AB -> C. The candidate keys are AB and BC. Which statement is correct?",
      choices: { a: "R is in BCNF because every determinant is a key", b: "R is in 3NF but not BCNF because C is not a superkey and A is prime", c: "R is not in 3NF because every FD must have a superkey determinant", d: "R violates 1NF because A appears in two keys" },
      answer: "b",
      explanation: "C -> A violates BCNF because C is not a superkey. It satisfies 3NF because A is a prime attribute, meaning it is part of a candidate key."
    },
    {
      module: "Normalization Theory",
      topic: "BCNF and 3NF",
      difficulty: "Medium",
      prompt: "Which statement about BCNF and 3NF is always true?",
      choices: { a: "Every BCNF relation is also in 3NF", b: "Every 3NF relation is also in BCNF", c: "BCNF always preserves all dependencies after decomposition", d: "3NF always eliminates all possible redundancy" },
      answer: "a",
      explanation: "BCNF is stricter than 3NF. 3NF permits some non-superkey dependencies when the right-hand side is prime, so the reverse is not guaranteed."
    },
    {
      module: "Normalization Theory",
      topic: "Lossless decomposition",
      difficulty: "Hard",
      prompt: "R(A, B, C) is decomposed into R1(A, B) and R2(B, C). Which FD is sufficient to guarantee this binary decomposition is lossless?",
      choices: { a: "B -> C", b: "A -> C", c: "C -> A", d: "A -> B" },
      answer: "a",
      explanation: "The common attribute is B. A binary decomposition is lossless if the common attributes determine all attributes of at least one component; B -> C gives B -> BC, so B determines R2."
    },
    {
      module: "Normalization Theory",
      topic: "Lossy decomposition",
      difficulty: "Medium",
      prompt: "R(A, B, C) is decomposed into R1(A, B) and R2(C). What is the main warning sign that the decomposition may be lossy?",
      choices: { a: "The two schemas have no common attribute to constrain the join", b: "R1 has more attributes than R2", c: "C appears only on the right side of the decomposition", d: "The original relation has exactly three attributes" },
      answer: "a",
      explanation: "With no shared attribute, joining the projections forms a Cartesian product, which can introduce spurious tuples and fail to reconstruct the original relation."
    },
    {
      module: "Normalization Theory",
      topic: "Dependency preservation",
      difficulty: "Hard",
      prompt: "R(A, B, C) has FDs A -> B and B -> C. It is decomposed into R1(A, B) and R2(A, C). Which dependency is not directly preserved in one decomposed relation?",
      choices: { a: "A -> B", b: "B -> C", c: "A -> A", d: "A -> C" },
      answer: "b",
      explanation: "B -> C uses attributes split across R1 and R2, so enforcing it may require joining the decomposed relations. A -> B is contained in R1."
    },
    {
      module: "Normalization Theory",
      topic: "Dependency preservation",
      difficulty: "Medium",
      prompt: "Why is dependency preservation a useful property of a decomposition?",
      choices: { a: "It lets the DBMS enforce the original FDs by checking individual decomposed relations instead of always joining them", b: "It guarantees that no query will ever need a join", c: "It guarantees every decomposed relation has exactly two attributes", d: "It makes lossy decompositions acceptable" },
      answer: "a",
      explanation: "If dependencies are preserved, constraints can be checked locally on the decomposed schemas. Without preservation, enforcing some FDs may require reconstructing the original relation by join."
    },
    {
      module: "Normalization Theory",
      topic: "Denormalization",
      difficulty: "Medium",
      prompt: "A design team intentionally stores CustomerName redundantly in an Orders table even though CustomerID -> CustomerName and a Customers table exists. What is the most defensible reason?",
      choices: { a: "To speed up a common read workload while accepting some update-anomaly risk", b: "To make the schema automatically satisfy BCNF", c: "To make CustomerID stop being a determinant", d: "To guarantee dependency preservation after every future decomposition" },
      answer: "a",
      explanation: "Denormalization may trade redundancy and possible anomalies for faster common queries by avoiding joins or simplifying access paths."
    }
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    const start = window.DBMS_QUESTIONS.length + 1;
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `generated-normalization-${start + index}`,
      source: question.module
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

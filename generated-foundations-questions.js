(function () {
  "use strict";

  const authored = [
    {
      module: "Database Systems Foundations",
      topic: "DBMS responsibilities",
      difficulty: "Easy",
      prompt: "Which capability is a central reason to use a DBMS instead of storing application data only in ordinary files?",
      choices: { a: "It removes the need to define what the data means", b: "It manages data independence, integrity, concurrency, recovery, and access control", c: "It guarantees that every query will run in constant time", d: "It stores all data in a single physical file format visible to applications" },
      answer: "b",
      explanation: "A DBMS provides services such as logical and physical data independence, integrity constraints, transaction/concurrency control, crash recovery, and security that ordinary file handling leaves largely to application code."
    },
    {
      module: "Database Systems Foundations",
      topic: "Data modeling concepts",
      difficulty: "Easy",
      prompt: "In conceptual database modeling, what is the best distinction among entities, attributes, and relationships?",
      choices: { a: "Entities are objects of interest, attributes describe them, and relationships associate entities", b: "Entities are columns, attributes are rows, and relationships are indexes", c: "Entities are query results, attributes are transactions, and relationships are log records", d: "Entities are always physical files, attributes are always pages, and relationships are always pointers" },
      answer: "a",
      explanation: "A data model captures a real-world scenario by identifying objects of interest, descriptive properties of those objects, and associations among those objects."
    },
    {
      module: "Relational Model",
      topic: "Schema and instance",
      difficulty: "Medium",
      prompt: "For a relation Students(sid: string, name: string, age: integer, gpa: real), which statement correctly describes degree and cardinality?",
      choices: { a: "The degree is the number of tuples currently stored, and the cardinality is the number of attributes", b: "The degree is 4, and the cardinality is the number of tuples in a particular instance", c: "The degree is the number of candidate keys, and the cardinality is fixed by the schema", d: "Both degree and cardinality are determined only after a query optimizer chooses a plan" },
      answer: "b",
      explanation: "The degree, or arity, is the number of attributes in the schema. The cardinality is the number of tuples in a specific relation instance and can change over time."
    },
    {
      module: "Relational Model",
      topic: "Relation instance semantics",
      difficulty: "Medium",
      prompt: "Under the mathematical relational model, which property holds for tuples in a relation instance?",
      choices: { a: "Tuple order is significant and duplicate tuples are allowed", b: "Tuple order is insignificant and duplicate tuples are not part of the relation", c: "Tuple order is significant only when a primary key exists", d: "Duplicate tuples are allowed unless a foreign key is declared" },
      answer: "b",
      explanation: "A relation instance is a set of tuples. In set semantics, order does not matter and the same tuple cannot appear twice."
    },
    {
      module: "Relational Model",
      topic: "Candidate keys and superkeys",
      difficulty: "Medium",
      prompt: "A relation R(A, B, C, D) has candidate keys {A, B} and {C}. Which set of attributes is a superkey but not a candidate key?",
      choices: { a: "{A}", b: "{B, D}", c: "{C, D}", d: "{B, C} only if C is not unique" },
      answer: "c",
      explanation: "A superkey contains a candidate key and therefore uniquely identifies tuples. {C, D} contains candidate key {C}, but it is not minimal because D can be removed."
    },
    {
      module: "Relational Model",
      topic: "Key semantics",
      difficulty: "Hard",
      prompt: "A relation Teaches(instructor_id, course_id, year, term) records course-teaching events. What semantic constraint is imposed if the key is chosen as (course_id, year, term)?",
      choices: { a: "An instructor can teach at most one course in their entire career", b: "A course can be taught by at most one instructor in a given year and term", c: "The same instructor can never teach the same course twice", d: "Every instructor must teach every term" },
      answer: "b",
      explanation: "If (course_id, year, term) is the key, no two tuples can share those three values. Thus each course offering in a year and term has at most one recorded teaching tuple."
    },
    {
      module: "Relational Model",
      topic: "Foreign keys",
      difficulty: "Medium",
      prompt: "Suppose Orders(customer_id) is a foreign key referencing Customers(id). What does this constraint require?",
      choices: { a: "Every Customers.id value must appear in Orders.customer_id", b: "Every non-null Orders.customer_id value must match the referenced key value of some Customers tuple", c: "Orders.customer_id and Customers.id must have the same attribute name", d: "Orders.customer_id must be the primary key of Orders" },
      answer: "b",
      explanation: "A foreign key restricts referencing values to values that exist in the referenced candidate or primary key. The attribute names need not be identical."
    },
    {
      module: "Relational Model",
      topic: "Query language styles",
      difficulty: "Medium",
      prompt: "Which statement best contrasts relational algebra with tuple relational calculus or SQL-style querying?",
      choices: { a: "Relational algebra is procedural in the sense that it describes operations to compute a result, while calculus-style languages describe what result is desired", b: "Relational algebra can express only updates, while tuple relational calculus can express only storage layouts", c: "Relational algebra is unrelated to query engines, while SQL engines do not perform optimization", d: "Relational algebra requires duplicate rows, while tuple relational calculus forbids predicates" },
      answer: "a",
      explanation: "Relational algebra is an operational foundation for query evaluation, while declarative languages state the desired result and rely on the DBMS to compile and optimize an evaluation plan."
    },
    {
      module: "Database Design",
      topic: "ER design process",
      difficulty: "Medium",
      prompt: "In a typical database design workflow, what is the main role of an ER model before relational schemas are created?",
      choices: { a: "It gives a conceptual description of entities, relationships, attributes, and constraints in the real-world scenario", b: "It specifies the exact disk pages on which every tuple will be stored", c: "It replaces the need to refine schemas for redundancy and anomalies", d: "It directly chooses the cheapest physical query plan" },
      answer: "a",
      explanation: "The ER model is used during conceptual design to capture the relevant structure and constraints of the application domain before translating the design to relational tables."
    },
    {
      module: "Database Design",
      topic: "Cardinality and participation constraints",
      difficulty: "Hard",
      prompt: "An ER relationship WorksFor between Employee and Department has total participation on Employee and a many-to-one constraint from Employee to Department. Which interpretation is correct?",
      choices: { a: "Every employee works for exactly one department, while a department may have many employees", b: "Every department must have exactly one employee", c: "An employee may work for many departments, but each department has at most one employee", d: "Employees and departments are unrelated unless a separate weak entity exists" },
      answer: "a",
      explanation: "Total participation on Employee means every employee participates at least once. The many-to-one constraint means each employee is associated with at most one department, while many employees can share a department."
    },
    {
      module: "Database Design",
      topic: "Weak entity sets",
      difficulty: "Hard",
      prompt: "A dependent can be identified only by the employee who owns it plus the dependent's name. Which relational schema best represents this weak entity set?",
      choices: { a: "Dependent(dep_name, age) with dep_name as the primary key", b: "Dependent(employee_id, dep_name, age) with primary key (employee_id, dep_name) and employee_id as a foreign key", c: "Employee(employee_id, dep_name, age) with employee_id as the only key", d: "Dependent(employee_id, age) with age as a foreign key" },
      answer: "b",
      explanation: "A weak entity table includes the identifying owner's key plus the discriminator. Together they form the weak entity's primary key, and the owner key is also a foreign key."
    },
    {
      module: "Database Design",
      topic: "Relationship translation",
      difficulty: "Hard",
      prompt: "When translating a many-to-one ER relationship R between E1(A, B) and E2(C, D), with total participation by E1 and relationship attribute F, why can the separate relationship table often be merged into E1?",
      choices: { a: "Each E1 entity participates in exactly one R relationship, so C and F can be stored with the E1 tuple without losing information", b: "Many-to-one relationships never have attributes", c: "The key of E2 can be discarded because total participation makes it redundant", d: "The merge is required only when both sides have partial participation" },
      answer: "a",
      explanation: "With total participation and at most one related E2 per E1, each E1 tuple needs exactly one referenced E2 key and one set of relationship attributes, so merging avoids an extra table."
    },
    {
      module: "Database Design",
      topic: "Specialization constraints",
      difficulty: "Medium",
      prompt: "In an ER specialization hierarchy, what do disjointness and total coverage mean?",
      choices: { a: "Disjointness means an entity belongs to at most one subclass; total coverage means every superclass entity belongs to at least one subclass", b: "Disjointness means subclasses share all attributes; total coverage means subclass tables must store nulls", c: "Disjointness means every entity has a generated integer key; total coverage means relationships cannot have attributes", d: "Disjointness means the hierarchy cannot be translated to relations; total coverage means the superclass has no key" },
      answer: "a",
      explanation: "Disjointness controls whether subclass membership can overlap. Total coverage controls whether every superclass entity must appear in some subclass."
    },
    {
      module: "Database Design",
      topic: "Attributes in ER-to-relational mapping",
      difficulty: "Medium",
      prompt: "Which mapping is usually appropriate for an ER entity Person with a composite Name attribute and a multivalued Phone attribute?",
      choices: { a: "Flatten Name into component columns and place Phone values in a separate relation keyed by Person's key", b: "Store all Name and Phone values in one uninterpreted string column", c: "Make each component of Name a separate entity and discard Person's key", d: "Store exactly one Phone value and reject all people with multiple phones" },
      answer: "a",
      explanation: "Composite attributes are commonly flattened into their components. A multivalued attribute is commonly represented by a separate relation containing the owner's key and one value per tuple."
    }
  ];

  const start = window.DBMS_QUESTIONS.length + 1;
  window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
    ...question,
    id: `generated-foundations-${start + index}`,
    source: question.module
  })));
})();

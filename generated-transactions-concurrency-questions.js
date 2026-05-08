(function () {
  "use strict";

  const authored = [
    {
      module: "Transaction Management",
      topic: "ACID properties",
      difficulty: "Medium",
      prompt: "A transaction inserts an order row, reserves inventory, and charges a payment method. If the charge fails, the DBMS must ensure that the order and inventory reservation are not left behind as partial effects. Which ACID property is most directly involved?",
      choices: { a: "Atomicity", b: "Isolation", c: "Durability", d: "Physical data independence" },
      answer: "a",
      explanation: "Atomicity treats the transaction as an all-or-nothing unit, so partial effects must be undone when the transaction cannot complete."
    },
    {
      module: "Transaction Management",
      topic: "ACID properties",
      difficulty: "Medium",
      prompt: "A transaction commits after changing a customer's address. Immediately afterward the system loses power. Which ACID property requires the committed address change to survive recovery?",
      choices: { a: "Consistency", b: "Durability", c: "Isolation", d: "Serializability" },
      answer: "b",
      explanation: "Durability means that once a transaction commits, its effects persist despite later crashes or failures."
    },
    {
      module: "Transaction Management",
      topic: "Conflict serializability",
      difficulty: "Hard",
      prompt: "Consider the schedule r1(X), r2(Y), w1(Y), w2(X), c1, c2. Which statement about conflict serializability is correct?",
      choices: { a: "It is conflict-serializable only as T1 before T2", b: "It is conflict-serializable only as T2 before T1", c: "It is not conflict-serializable because the precedence graph has edges both ways", d: "It is serial because all reads occur before all writes" },
      answer: "c",
      explanation: "r2(Y) conflicts with w1(Y), giving T2 -> T1, while r1(X) conflicts with w2(X), giving T1 -> T2. The cycle means the schedule is not conflict-serializable."
    },
    {
      module: "Transaction Management",
      topic: "Precedence graphs",
      difficulty: "Medium",
      prompt: "A precedence graph for a schedule has edges T1 -> T3, T2 -> T3, and T1 -> T2, with no other edges. What can be concluded?",
      choices: { a: "The schedule is conflict-serializable, and T1 must appear before both T2 and T3 in an equivalent serial order", b: "The schedule is not conflict-serializable because it has more than two edges", c: "The schedule is serial only if T3 commits first", d: "The schedule is view-serializable but never conflict-serializable" },
      answer: "a",
      explanation: "The graph is acyclic, so the schedule is conflict-serializable. Any topological order must place T1 before T2 and T3."
    },
    {
      module: "Transaction Management",
      topic: "View serializability",
      difficulty: "Hard",
      prompt: "Which condition is part of view equivalence between two schedules?",
      choices: { a: "Every pair of conflicting operations must occur in the same order", b: "Each read must read the value written by the same transaction, or the same initial value, in both schedules", c: "Every transaction must request locks in the same order", d: "Every write must be followed immediately by a commit" },
      answer: "b",
      explanation: "View equivalence preserves reads-from relationships, reads of initial values, and final writers. Conflict ordering is stronger than view equivalence."
    },
    {
      module: "Transaction Management",
      topic: "Recoverable schedules",
      difficulty: "Medium",
      prompt: "T1 writes A. T2 reads that value of A before T1 commits. T1 commits, and only then T2 commits. Which classification is most precise?",
      choices: { a: "Recoverable, but not cascadeless", b: "Unrecoverable", c: "Strict, because T1 committed before T2", d: "Not serializable by definition" },
      answer: "a",
      explanation: "The schedule is recoverable because T2 commits after the transaction it read from. It is not cascadeless because T2 performed a dirty read before T1 committed."
    },
    {
      module: "Transaction Management",
      topic: "Cascadeless schedules",
      difficulty: "Medium",
      prompt: "Which rule is sufficient to avoid cascading aborts caused by dirty reads?",
      choices: { a: "A transaction may read an item only after the transaction that last wrote that item has committed", b: "A transaction must commit before it performs any read", c: "All transactions must use the same timestamp", d: "Exclusive locks should be released immediately after each write" },
      answer: "a",
      explanation: "Cascadeless schedules prevent transactions from reading uncommitted writes, so an abort of the writer does not force readers to roll back."
    },
    {
      module: "Transaction Management",
      topic: "Strict schedules",
      difficulty: "Hard",
      prompt: "T1 writes X and has not committed. T2 wants to overwrite X without reading it. Which schedule property forbids T2's write until T1 commits or aborts?",
      choices: { a: "Strictness", b: "Recoverability only", c: "Read committed only", d: "View equivalence" },
      answer: "a",
      explanation: "Strict schedules prevent other transactions from reading or writing an item written by an uncommitted transaction, blocking both dirty reads and dirty writes."
    },
    {
      module: "Concurrency Control",
      topic: "Lock compatibility",
      difficulty: "Medium",
      prompt: "T1 holds a shared lock on row R. T2 requests a shared lock on R, and T3 requests an exclusive lock on R. What should a standard S/X lock manager do?",
      choices: { a: "Grant T2's request and make T3 wait", b: "Make both T2 and T3 wait", c: "Grant T3's request because exclusive locks have priority", d: "Abort T1 because multiple lock requests exist" },
      answer: "a",
      explanation: "Shared locks are compatible with other shared locks, but an exclusive lock conflicts with an already granted shared lock."
    },
    {
      module: "Concurrency Control",
      topic: "Two-phase locking",
      difficulty: "Medium",
      prompt: "Under basic two-phase locking, what event marks the point after which a transaction cannot acquire any new locks?",
      choices: { a: "Its first lock release", b: "Its first read operation", c: "Its first write operation", d: "The creation of its timestamp" },
      answer: "a",
      explanation: "Two-phase locking has a growing phase followed by a shrinking phase. Once the transaction releases a lock, it has entered the shrinking phase."
    },
    {
      module: "Concurrency Control",
      topic: "Rigorous two-phase locking",
      difficulty: "Medium",
      prompt: "A system requires every transaction to hold all shared and exclusive locks until it commits or aborts, then release them together. Which protocol is being described?",
      choices: { a: "Rigorous two-phase locking", b: "Basic timestamp ordering", c: "Thomas Write Rule", d: "Optimistic validation without locking" },
      answer: "a",
      explanation: "Rigorous 2PL holds all locks to transaction end, producing serializable schedules while also avoiding dirty reads and unrecoverable behavior caused by early unlocks."
    },
    {
      module: "Concurrency Control",
      topic: "Deadlock handling",
      difficulty: "Medium",
      prompt: "A lock manager periodically builds a waits-for graph and aborts one transaction if it finds a cycle. Which deadlock strategy is this?",
      choices: { a: "Detection and resolution", b: "Prevention by lock ordering", c: "Timestamp ordering", d: "Predicate locking" },
      answer: "a",
      explanation: "Deadlock detection allows waits to occur, searches for cycles in the waits-for graph, and resolves a detected deadlock by aborting a victim."
    },
    {
      module: "Concurrency Control",
      topic: "Deadlock prevention",
      difficulty: "Hard",
      prompt: "Why can requiring all transactions to request locks in a single global order prevent deadlocks?",
      choices: { a: "It prevents cycles in the waits-for graph", b: "It makes exclusive locks compatible with shared locks", c: "It removes all write-write conflicts from schedules", d: "It guarantees that no transaction ever waits" },
      answer: "a",
      explanation: "If every transaction asks for locks in the same order, waiting relationships cannot form a circular chain over differently ordered resources."
    },
    {
      module: "Concurrency Control",
      topic: "Multiple granularity locking",
      difficulty: "Hard",
      prompt: "A transaction wants an exclusive lock on one tuple in table T. Under multiple granularity locking, which lock is normally needed on T before locking the tuple exclusively?",
      choices: { a: "IX on T", b: "S on T", c: "IS on T only", d: "No table-level lock, because tuple locks are independent" },
      answer: "a",
      explanation: "An IX lock at the table level announces an intention to take exclusive locks at lower levels, allowing the hierarchy compatibility checks to work."
    },
    {
      module: "Concurrency Control",
      topic: "Multiple granularity locking",
      difficulty: "Hard",
      prompt: "T1 holds SIX on a table because it scans the table and may update some rows. T2 requests S on the same table to scan all rows. What should happen at the table level?",
      choices: { a: "T2 should wait because SIX and S are incompatible", b: "T2 should be granted because both locks include shared access", c: "T1 should be downgraded automatically to IS", d: "Both locks should be replaced by tuple-level X locks" },
      answer: "a",
      explanation: "SIX includes a table-level shared lock plus intent to update lower-level objects, so another full-table S lock is incompatible with it."
    },
    {
      module: "Concurrency Control",
      topic: "Predicate and range locking",
      difficulty: "Medium",
      prompt: "T1 reads all accounts with balance between 100 and 200. T2 tries to insert a new account with balance 150 before T1 finishes. What is the purpose of a range or predicate lock here?",
      choices: { a: "Block the insert because it would create a phantom matching T1's predicate", b: "Allow the insert but hide only the primary key from T1", c: "Convert T1's read into a dirty read", d: "Force T1 to use a hash index instead of a B+ tree" },
      answer: "a",
      explanation: "Predicate or range locks protect the set described by the search condition, including matching records that do not yet exist."
    },
    {
      module: "Concurrency Control",
      topic: "Index range locking",
      difficulty: "Hard",
      prompt: "A DBMS implements range locking using a B+ tree index on salary. Which action best protects the predicate salary < 60000 from phantoms?",
      choices: { a: "Lock the relevant index key range or gaps, not just the currently qualifying records", b: "Lock one arbitrary leaf page after the scan finishes", c: "Use exclusive locks only on records that T1 updates", d: "Ignore inserts until crash recovery" },
      answer: "a",
      explanation: "To prevent phantoms, the lock must cover the key range and gaps where new qualifying entries could be inserted."
    },
    {
      module: "Concurrency Control",
      topic: "Timestamp ordering",
      difficulty: "Hard",
      prompt: "Under basic timestamp ordering, TS(T)=30 and object X has WTS(X)=40. T tries to read X. What should happen?",
      choices: { a: "Abort T because X was written by a transaction that is later in timestamp order", b: "Allow the read and set RTS(X)=30", c: "Ignore the read using Thomas Write Rule", d: "Make T wait for the writer with timestamp 40" },
      answer: "a",
      explanation: "A transaction cannot read a value written by a transaction with a larger timestamp, because that would make it read from the future in the timestamp order."
    },
    {
      module: "Concurrency Control",
      topic: "Timestamp ordering",
      difficulty: "Hard",
      prompt: "In timestamp ordering, TS(T)=50, RTS(Y)=35, and WTS(Y)=20. T wants to write Y. What is the correct basic timestamp-ordering action?",
      choices: { a: "Allow the write and set WTS(Y)=50", b: "Abort T because RTS(Y) is less than TS(T)", c: "Ignore the write because WTS(Y) is less than TS(T)", d: "Make T wait until all older transactions finish" },
      answer: "a",
      explanation: "The write is allowed because no later transaction has read or written Y: both RTS(Y) and WTS(Y) are less than TS(T)."
    },
    {
      module: "Concurrency Control",
      topic: "Thomas Write Rule",
      difficulty: "Hard",
      prompt: "Thomas Write Rule differs from basic timestamp ordering mainly in which situation?",
      choices: { a: "It can ignore an obsolete write when a newer write timestamp already exists", b: "It allows dirty reads to commit without restriction", c: "It replaces timestamps with shared and exclusive locks", d: "It aborts every transaction whose write timestamp is the newest" },
      answer: "a",
      explanation: "Thomas Write Rule treats a write with TS(T) less than the object's WTS as obsolete, so the system may skip that write instead of aborting T."
    }
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `generated-trx-concurrency-${index + 1}`,
      source: question.module
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

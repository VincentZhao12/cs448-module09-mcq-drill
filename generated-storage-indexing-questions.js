(function () {
  "use strict";

  const authored = [
    {
      module: "Data Storage",
      topic: "Page-oriented storage",
      difficulty: "Easy",
      prompt: "A disk-resident DBMS stores table data in fixed-size pages. What is the main reason query execution and buffer management usually talk about pages rather than individual bytes?",
      choices: { a: "Pages are the typical unit transferred between non-volatile storage and memory", b: "Every tuple must be exactly one page long", c: "Page identifiers are always the same as primary keys", d: "Byte-addressable storage cannot contain database files" },
      answer: "a",
      explanation: "Disk and SSD storage are commonly accessed in blocks or pages, so the buffer manager loads and evicts whole pages even when a query needs only a few tuples."
    },
    {
      module: "Data Storage",
      topic: "Disk access cost",
      difficulty: "Medium",
      prompt: "For a spinning disk, which request pattern is usually most expensive?",
      choices: { a: "Reading many adjacent pages after the head is already positioned", b: "Reading pages whose locations require many independent seeks and rotational waits", c: "Reading two consecutive sectors on the same track", d: "Transferring bytes from an already selected sector" },
      answer: "b",
      explanation: "Random disk access repeatedly pays seek and rotational delay. Sequential access amortizes positioning cost across many pages."
    },
    {
      module: "Data Storage",
      topic: "Row and column layout",
      difficulty: "Medium",
      prompt: "A query computes AVG(salary) over a very wide employee table and does not need the other attributes. Which physical layout is most likely to reduce unnecessary I/O?",
      choices: { a: "Column-oriented storage for the salary column", b: "A heap file ordered only by insertion time", c: "A row store with every employee tuple packed together", d: "A page directory sorted by page identifier" },
      answer: "a",
      explanation: "Column storage keeps values from the same attribute together, so an aggregate over one column can avoid reading unrelated attributes from every row."
    },
    {
      module: "Data Storage",
      topic: "Slotted pages",
      difficulty: "Medium",
      prompt: "In a slotted-page layout for variable-length records, a tuple identifier is often represented as (page id, slot id). Why is the slot id useful?",
      choices: { a: "It lets the record move within the page while the external tuple identifier stays stable", b: "It guarantees that all records have the same length", c: "It removes the need to track free space", d: "It stores the full contents of the record inside the tuple identifier" },
      answer: "a",
      explanation: "The slot points to a directory entry containing the record offset and size. If compaction moves the record, the directory entry can change while the slot id remains the same."
    },
    {
      module: "Data Storage",
      topic: "Free space management",
      difficulty: "Medium",
      prompt: "A table stores variable-length records. Which page-header information is most directly useful for deciding whether a new record may fit on a page?",
      choices: { a: "The amount and location of free space on the page", b: "The total number of transactions in the system", c: "The primary-key value of the first tuple in the database", d: "The CPU cache-line size used by the processor" },
      answer: "a",
      explanation: "Variable-length pages need metadata such as free-space size and pointers because insertion depends on available contiguous or reclaimable space within the page."
    },
    {
      module: "Data Storage",
      topic: "Heap and sorted files",
      difficulty: "Medium",
      prompt: "Compared with a heap file, what is a major maintenance cost of keeping a table physically sorted by a search key?",
      choices: { a: "Inserts may require placing a tuple between existing tuples and preserving order", b: "Sequential scans become impossible", c: "Every tuple must be duplicated in a hash bucket", d: "The table can no longer have pages" },
      answer: "a",
      explanation: "Sorted storage can speed ordered or range access, but inserting a new key may require finding the correct position and handling page space, movement, or overflow."
    },
    {
      module: "Data Storage",
      topic: "Buffer pool metadata",
      difficulty: "Medium",
      prompt: "A buffer frame contains a page whose dirty bit is set. What must the buffer manager account for before evicting that page?",
      choices: { a: "The page must be written back to storage before its frame is reused", b: "The page can be discarded because it is identical to the disk copy", c: "The page's pin count must be increased permanently", d: "The page must be converted to a column-store page" },
      answer: "a",
      explanation: "A dirty page differs from the persistent copy, so eviction must preserve the update by writing the page back before replacement."
    },
    {
      module: "Data Storage",
      topic: "Pinned pages",
      difficulty: "Medium",
      prompt: "Why does a buffer manager maintain a pin count for each page in the buffer pool?",
      choices: { a: "To avoid evicting a page while one or more operations are actively using it", b: "To record how many tuples fit in the page format", c: "To decide whether the page belongs to a primary or secondary index", d: "To replace the page identifier in every tuple id" },
      answer: "a",
      explanation: "A nonzero pin count means the page is currently in use. Replacement policies should choose only unpinned frames as eviction candidates."
    },
    {
      module: "Data Indexing",
      topic: "Search keys",
      difficulty: "Easy",
      prompt: "In an index, what is the search key?",
      choices: { a: "The attribute or attributes whose values are used to look up matching index entries", b: "The physical page number of the table's first page", c: "The SQL text of the query being optimized", d: "The buffer frame selected for replacement" },
      answer: "a",
      explanation: "An index maps search-key values, possibly composite values, to records or record identifiers that satisfy equality or range predicates."
    },
    {
      module: "Data Indexing",
      topic: "Primary and secondary indexes",
      difficulty: "Medium",
      prompt: "Which statement best distinguishes a secondary-key index from a primary-key index?",
      choices: { a: "A secondary-key index may have many table tuples with the same search-key value", b: "A secondary-key index can only be stored in main memory", c: "A secondary-key index cannot contain tuple identifiers", d: "A secondary-key index is always clustered" },
      answer: "a",
      explanation: "A primary-key index is on a unique key, while a secondary-key index may index a nonunique attribute and therefore may map one key value to multiple tuple identifiers."
    },
    {
      module: "Data Indexing",
      topic: "Dense and sparse indexes",
      difficulty: "Medium",
      prompt: "A table is sorted on attribute A, and an index stores one entry per data page containing the first A value on that page. What kind of index is this?",
      choices: { a: "Sparse index", b: "Dense index", c: "Hash index with overflow only", d: "Bitmap-free buffer index" },
      answer: "a",
      explanation: "A sparse index has fewer entries than data records, often one per page or range, and relies on the underlying file order to find records after locating the page."
    },
    {
      module: "Data Indexing",
      topic: "Clustered indexes",
      difficulty: "Medium",
      prompt: "A B+ tree is built on column A, and the table's data records are physically ordered by A. Which access pattern benefits most from this clustering?",
      choices: { a: "A range predicate such as A BETWEEN 100 AND 200", b: "A query that never references A", c: "A lookup through an unrelated hash function", d: "A scan of only the system catalog" },
      answer: "a",
      explanation: "With a clustered index, nearby search-key values tend to live on nearby data pages, so a qualifying range can be read with far fewer random page fetches."
    },
    {
      module: "Data Indexing",
      topic: "Unclustered indexes",
      difficulty: "Hard",
      prompt: "A predicate using an unclustered secondary index returns 10,000 qualifying tuples from a large table. Why might a full table scan be cheaper than using the index?",
      choices: { a: "The matching tuple identifiers may point to many different data pages, causing many random I/Os", b: "Unclustered indexes cannot answer equality predicates", c: "A table scan must read fewer than one page", d: "The index leaf pages always contain the entire table sorted by the predicate" },
      answer: "a",
      explanation: "An unclustered index can locate tuple identifiers efficiently, but fetching many scattered data records may cost about one random I/O per tuple or page."
    },
    {
      module: "Data Indexing",
      topic: "B+ tree range access",
      difficulty: "Medium",
      prompt: "Why are B+ trees well suited for range predicates?",
      choices: { a: "After finding the first qualifying leaf entry, the scan can follow leaf-level order through the range", b: "They hash every key directly to a single bucket", c: "They store pages only in insertion order", d: "They avoid all page reads for nonunique keys" },
      answer: "a",
      explanation: "B+ tree leaves are kept in key order, typically with sibling links, so range access is a search to the first key followed by a sequential leaf scan."
    },
    {
      module: "Data Indexing",
      topic: "Hash indexes",
      difficulty: "Medium",
      prompt: "For which predicate is a traditional hash index usually the best conceptual fit?",
      choices: { a: "customer_id = 42", b: "customer_id BETWEEN 100 AND 200", c: "ORDER BY customer_id", d: "customer_id is the minimum key in the table" },
      answer: "a",
      explanation: "Hashing maps a specific search-key value to a bucket, making equality lookup natural. It does not preserve key order for range scans or ordering."
    },
    {
      module: "Data Indexing",
      topic: "Hash index overflow",
      difficulty: "Medium",
      prompt: "A static hash index receives many inserts after it was built, and several buckets develop long overflow chains. What is the likely performance effect?",
      choices: { a: "Equality lookup may require reading extra overflow pages after the target bucket", b: "Range scans become perfectly sequential", c: "Every lookup becomes a B+ tree traversal", d: "The table is automatically reclustered by the hash value" },
      answer: "a",
      explanation: "Overflow chains add page reads to bucket lookup. Dynamic hashing schemes try to reduce this problem by splitting buckets as the file grows."
    }
  ];

  if (typeof window !== "undefined" && window.DBMS_QUESTIONS) {
    const start = window.DBMS_QUESTIONS.length + 1;
    window.DBMS_QUESTIONS.push(...authored.map((question, index) => ({
      ...question,
      id: `generated-storage-indexing-${start + index}`,
      source: question.module
    })));
  }

  if (typeof module !== "undefined") {
    module.exports = authored;
  }
})();

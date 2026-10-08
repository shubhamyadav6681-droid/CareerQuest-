import { GranularTopic, SkillCategorySummary } from '../types/career';

export const INITIAL_GRANULAR_TOPICS: GranularTopic[] = [
  // ================= JAVA (Granular Topics) =================
  {
    id: 'java-io',
    name: 'Input / Output',
    parentSkill: 'Java',
    parentNodeId: 'java-fundamentals',
    status: 'COMPLETED',
    completedDate: '2026-09-15',
    lastRevisedDate: '2026-10-01',
    assessmentScore: 92,
    practiceAccuracy: 95,
    learnedNotes: 'Mastered Scanner vs BufferedReader for fast I/O in competitive programming and System.out formatting.',
    evidenceNotes: ['Passed Java Basics Quiz with 92%', 'Solved 3 Fast I/O HackerRank problems'],
    importance: 'Foundational',
  },
  {
    id: 'java-variables',
    name: 'Variables',
    parentSkill: 'Java',
    parentNodeId: 'java-fundamentals',
    status: 'COMPLETED',
    completedDate: '2026-09-16',
    lastRevisedDate: '2026-10-01',
    assessmentScore: 95,
    practiceAccuracy: 98,
    learnedNotes: 'Scope of local vs instance vs static variables and thread-stack vs heap memory allocation.',
    evidenceNotes: ['Score 95% on Memory Allocation quiz'],
    importance: 'Foundational',
  },
  {
    id: 'java-datatypes',
    name: 'Data Types',
    parentSkill: 'Java',
    parentNodeId: 'java-fundamentals',
    status: 'COMPLETED',
    completedDate: '2026-09-18',
    lastRevisedDate: '2026-10-02',
    assessmentScore: 94,
    practiceAccuracy: 96,
    learnedNotes: '8 primitives (byte, short, int, long, float, double, char, boolean), overflow edge cases, wrapper classes.',
    evidenceNotes: ['Understood primitive wrapping & autoboxing'],
    importance: 'Foundational',
  },
  {
    id: 'java-operators',
    name: 'Operators',
    parentSkill: 'Java',
    parentNodeId: 'java-fundamentals',
    status: 'COMPLETED',
    completedDate: '2026-09-20',
    lastRevisedDate: '2026-10-02',
    assessmentScore: 90,
    practiceAccuracy: 92,
    learnedNotes: 'Bitwise (>>, >>>, <<), arithmetic, logical short-circuiting (&& vs &).',
    evidenceNotes: ['Bitwise manipulation quiz passed'],
    importance: 'Foundational',
  },
  {
    id: 'java-conditions',
    name: 'Conditions',
    parentSkill: 'Java',
    parentNodeId: 'java-fundamentals',
    status: 'COMPLETED',
    completedDate: '2026-09-22',
    lastRevisedDate: '2026-10-03',
    assessmentScore: 91,
    practiceAccuracy: 94,
    learnedNotes: 'if-else chains, ternary operator, switch expressions with arrow syntax.',
    importance: 'Foundational',
  },
  {
    id: 'java-loops',
    name: 'Loops',
    parentSkill: 'Java',
    parentNodeId: 'java-fundamentals',
    status: 'COMPLETED',
    completedDate: '2026-09-25',
    lastRevisedDate: '2026-10-04',
    assessmentScore: 89,
    practiceAccuracy: 90,
    learnedNotes: 'for, while, do-while, enhanced for-each loop, break/continue with labels.',
    importance: 'Foundational',
  },
  {
    id: 'java-arrays',
    name: 'Arrays',
    parentSkill: 'Java',
    parentNodeId: 'java-methods-arrays',
    status: 'COMPLETED',
    completedDate: '2026-09-28',
    lastRevisedDate: '2026-10-02',
    assessmentScore: 85,
    practiceAccuracy: 58, // Prompts revision warning! Completed > 30 days or low practice accuracy
    learnedNotes: '1D & 2D arrays, contiguous memory allocation, indexing, traversal, System.arraycopy, Arrays utility methods.',
    evidenceNotes: ['Completed LeetCode 2D Matrix rotation with 85% quiz score'],
    importance: 'High-Yield',
  },
  {
    id: 'java-strings',
    name: 'Strings',
    parentSkill: 'Java',
    parentNodeId: 'java-methods-arrays',
    status: 'IN PROGRESS',
    progressPercent: 60,
    assessmentScore: 78,
    practiceAccuracy: 75,
    learnedNotes: 'String Constant Pool (SCP), immutability reason, StringBuilder vs StringBuffer performance comparison.',
    importance: 'High-Yield',
  },
  {
    id: 'java-methods',
    name: 'Methods',
    parentSkill: 'Java',
    parentNodeId: 'java-methods-arrays',
    status: 'IN PROGRESS',
    progressPercent: 45,
    learnedNotes: 'Pass-by-value semantics in Java, method overloading, call stack frame creation.',
    importance: 'Foundational',
  },
  {
    id: 'java-oop',
    name: 'OOP',
    parentSkill: 'Java',
    parentNodeId: 'java-oop',
    status: 'IN PROGRESS',
    progressPercent: 30,
    learnedNotes: 'Classes, Objects, Constructors, Encapsulation with getters/setters, early Inheritance exercises.',
    importance: 'Target-Critical',
  },
  {
    id: 'java-collections',
    name: 'Collections',
    parentSkill: 'Java',
    parentNodeId: 'java-collections',
    status: 'LOCKED',
    importance: 'Target-Critical',
    prerequisites: ['java-oop'],
  },
  {
    id: 'java-exceptions',
    name: 'Exception Handling',
    parentSkill: 'Java',
    parentNodeId: 'java-exceptions',
    status: 'LOCKED',
    importance: 'Foundational',
    prerequisites: ['java-collections'],
  },
  {
    id: 'java-generics',
    name: 'Generics',
    parentSkill: 'Java',
    parentNodeId: 'java-exceptions',
    status: 'LOCKED',
    importance: 'High-Yield',
    prerequisites: ['java-collections'],
  },
  {
    id: 'java-multithreading',
    name: 'Multithreading & Concurrency',
    parentSkill: 'Java',
    parentNodeId: 'java-advanced',
    status: 'LOCKED',
    importance: 'Target-Critical',
    prerequisites: ['java-exceptions'],
  },

  // ================= DATA STRUCTURES & ALGORITHMS =================
  {
    id: 'dsa-complexity-basics',
    name: 'Complexity Basics',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-complexity',
    status: 'COMPLETED',
    completedDate: '2026-09-20',
    lastRevisedDate: '2026-10-03',
    assessmentScore: 92,
    practiceAccuracy: 95,
    learnedNotes: 'Big-O, Omega, Theta notation, calculating loop iterations and recursive stack depth.',
    importance: 'Foundational',
  },
  {
    id: 'dsa-arrays',
    name: 'Arrays & Subarrays',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-arrays-pointers',
    status: 'COMPLETED',
    completedDate: '2026-09-29',
    lastRevisedDate: '2026-10-04',
    assessmentScore: 88,
    practiceAccuracy: 84,
    learnedNotes: 'Maximum Subarray Sum (Kadane algorithm), Dutch National Flag 3-way partition.',
    importance: 'High-Yield',
  },
  {
    id: 'dsa-searching',
    name: 'Basic Searching',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-arrays-pointers',
    status: 'COMPLETED',
    completedDate: '2026-10-02',
    lastRevisedDate: '2026-10-05',
    assessmentScore: 90,
    practiceAccuracy: 88,
    learnedNotes: 'Linear search O(N), iterative & recursive Binary Search O(log N) with lower_bound & upper_bound.',
    importance: 'High-Yield',
  },
  {
    id: 'dsa-two-pointers',
    name: 'Two Pointers',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-arrays-pointers',
    status: 'IN PROGRESS',
    progressPercent: 65,
    assessmentScore: 80,
    practiceAccuracy: 75,
    learnedNotes: 'Opposite direction two pointers for sorted arrays (Two Sum II), same direction runner pointers.',
    importance: 'High-Yield',
  },
  {
    id: 'dsa-sliding-window',
    name: 'Sliding Window',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-arrays-pointers',
    status: 'IN PROGRESS',
    progressPercent: 40,
    learnedNotes: 'Fixed size window sum vs variable size window with HashMap for substring without repeats.',
    importance: 'High-Yield',
  },
  {
    id: 'dsa-prefix-sum',
    name: 'Prefix Sum & Hashing',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-arrays-pointers',
    status: 'NOT STARTED',
    importance: 'High-Yield',
  },
  {
    id: 'dsa-linked-list',
    name: 'Linked List',
    parentSkill: 'DSA',
    parentNodeId: 'track-dsa',
    status: 'NOT STARTED',
    importance: 'Target-Critical',
  },
  {
    id: 'dsa-stack-queue',
    name: 'Stack & Queue',
    parentSkill: 'DSA',
    parentNodeId: 'track-dsa',
    status: 'NOT STARTED',
    importance: 'High-Yield',
  },
  {
    id: 'dsa-recursion',
    name: 'Recursion & Call Stack',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-recursion',
    status: 'NEEDS REVISION', // Explicitly flagged in prompt
    completedDate: '2026-09-12',
    lastRevisedDate: '2026-09-14',
    assessmentScore: 42,
    practiceAccuracy: 40,
    learnedNotes: 'Struggled with recognizing inductive step and tracing multiple branch recursion trees.',
    evidenceNotes: ['Low assessment score (42%)', 'Needs structured tree visualization practice'],
    importance: 'Target-Critical',
  },
  {
    id: 'dsa-backtracking',
    name: 'Backtracking',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-recursion',
    status: 'LOCKED',
    importance: 'Target-Critical',
    prerequisites: ['dsa-recursion'],
  },
  {
    id: 'dsa-trees',
    name: 'Binary Trees & BST',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-trees-bst',
    status: 'LOCKED',
    importance: 'Target-Critical',
    prerequisites: ['dsa-recursion'],
  },
  {
    id: 'dsa-graphs',
    name: 'Graphs (BFS/DFS)',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-graphs',
    status: 'LOCKED',
    importance: 'Target-Critical',
    prerequisites: ['dsa-trees'],
  },
  {
    id: 'dsa-dp',
    name: 'Dynamic Programming',
    parentSkill: 'DSA',
    parentNodeId: 'dsa-dp',
    status: 'LOCKED',
    importance: 'Target-Critical',
    prerequisites: ['dsa-recursion'],
  },

  // ================= DATABASE MANAGEMENT SYSTEMS (DBMS) =================
  {
    id: 'dbms-intro',
    name: 'Introduction to DBMS',
    parentSkill: 'DBMS',
    parentNodeId: 'cs-dbms',
    status: 'COMPLETED',
    completedDate: '2026-10-01',
    lastRevisedDate: '2026-10-04',
    assessmentScore: 88,
    practiceAccuracy: 90,
    learnedNotes: 'File system limitations vs DBMS, 3-tier schema architecture, relational model entities and relations.',
    importance: 'Foundational',
  },
  {
    id: 'dbms-sql',
    name: 'SQL Queries & Joins',
    parentSkill: 'DBMS',
    parentNodeId: 'cs-dbms',
    status: 'IN PROGRESS',
    progressPercent: 45,
    learnedNotes: 'SELECT, GROUP BY, HAVING, INNER/LEFT/RIGHT JOINs, basic nested subqueries.',
    importance: 'High-Yield',
  },
  {
    id: 'dbms-normalization',
    name: 'Normalization (1NF, 2NF, 3NF, BCNF)',
    parentSkill: 'DBMS',
    parentNodeId: 'cs-dbms',
    status: 'NOT STARTED',
    importance: 'High-Yield',
  },
  {
    id: 'dbms-acid',
    name: 'Transactions & ACID Properties',
    parentSkill: 'DBMS',
    parentNodeId: 'cs-dbms',
    status: 'NOT STARTED',
    importance: 'Target-Critical',
  },
  {
    id: 'dbms-indexing',
    name: 'Indexing & B+ Trees',
    parentSkill: 'DBMS',
    parentNodeId: 'cs-dbms',
    status: 'LOCKED',
    importance: 'Target-Critical',
    prerequisites: ['dbms-sql'],
  },

  // ================= OPERATING SYSTEMS (OS) =================
  {
    id: 'os-processes',
    name: 'Processes & Threads',
    parentSkill: 'Operating Systems',
    parentNodeId: 'cs-os',
    status: 'IN PROGRESS',
    progressPercent: 55,
    learnedNotes: 'PCB (Process Control Block), Thread stack vs Shared Heap, Context Switch overhead.',
    importance: 'Target-Critical',
  },
  {
    id: 'os-scheduling',
    name: 'CPU Scheduling Algorithms',
    parentSkill: 'Operating Systems',
    parentNodeId: 'cs-os',
    status: 'NOT STARTED',
    importance: 'High-Yield',
  },
  {
    id: 'os-memory',
    name: 'Virtual Memory & Paging',
    parentSkill: 'Operating Systems',
    parentNodeId: 'cs-os',
    status: 'NOT STARTED',
    importance: 'Target-Critical',
  },
  {
    id: 'os-deadlocks',
    name: 'Deadlocks & Coffman Conditions',
    parentSkill: 'Operating Systems',
    parentNodeId: 'cs-os',
    status: 'LOCKED',
    importance: 'Target-Critical',
    prerequisites: ['os-processes'],
  },

  // ================= COMPUTER NETWORKS (CN) =================
  {
    id: 'cn-models',
    name: 'OSI & TCP/IP Reference Models',
    parentSkill: 'Computer Networks',
    parentNodeId: 'cs-cn',
    status: 'NOT STARTED',
    importance: 'Foundational',
  },
  {
    id: 'cn-tcp-handshake',
    name: 'TCP 3-Way Handshake & UDP',
    parentSkill: 'Computer Networks',
    parentNodeId: 'cs-cn',
    status: 'NOT STARTED',
    importance: 'Target-Critical',
  },
  {
    id: 'cn-dns-http',
    name: 'DNS, HTTP/2 & HTTPS TLS',
    parentSkill: 'Computer Networks',
    parentNodeId: 'cs-cn',
    status: 'LOCKED',
    importance: 'Target-Critical',
  },
];

// Helper to group topics by skill name
export function getSkillSummaries(topics: GranularTopic[]): SkillCategorySummary[] {
  const skillsMap = new Map<string, GranularTopic[]>();

  topics.forEach((t) => {
    if (!skillsMap.has(t.parentSkill)) {
      skillsMap.set(t.parentSkill, []);
    }
    skillsMap.get(t.parentSkill)!.push(t);
  });

  const summaries: SkillCategorySummary[] = [];

  skillsMap.forEach((topicList, skillName) => {
    const totalCount = topicList.length;
    const completedCount = topicList.filter(
      (t) => t.status === 'COMPLETED' || t.status === 'MASTERED'
    ).length;
    const inProgressCount = topicList.filter((t) => t.status === 'IN PROGRESS').length;
    const needsRevisionCount = topicList.filter((t) => t.status === 'NEEDS REVISION').length;
    const masteredCount = topicList.filter((t) => t.status === 'MASTERED').length;

    // Calculate percentage based on completed + weighted in-progress
    let progressScore = 0;
    topicList.forEach((t) => {
      if (t.status === 'COMPLETED') progressScore += 1;
      else if (t.status === 'MASTERED') progressScore += 1;
      else if (t.status === 'IN PROGRESS') progressScore += (t.progressPercent || 50) / 100;
      else if (t.status === 'NEEDS REVISION') progressScore += 0.5;
    });

    const progressPercent = totalCount > 0 ? Math.round((progressScore / totalCount) * 100) : 0;

    summaries.push({
      skillName,
      iconName: skillName,
      completedCount,
      totalCount,
      progressPercent,
      inProgressCount,
      needsRevisionCount,
      masteredCount,
      topics: topicList,
    });
  });

  return summaries;
}

// Calculate high-level progress percentages
export function calculateOverallProgressMetrics(topics: GranularTopic[]) {
  const summaries = getSkillSummaries(topics);

  const javaSummary = summaries.find((s) => s.skillName === 'Java');
  const dsaSummary = summaries.find((s) => s.skillName === 'DSA');
  const dbmsSummary = summaries.find((s) => s.skillName === 'DBMS');
  const osSummary = summaries.find((s) => s.skillName === 'Operating Systems');
  const cnSummary = summaries.find((s) => s.skillName === 'Computer Networks');

  const javaPercent = javaSummary ? javaSummary.progressPercent : 0;
  const dsaPercent = dsaSummary ? dsaSummary.progressPercent : 0;
  const dbmsPercent = dbmsSummary ? dbmsSummary.progressPercent : 0;
  const osPercent = osSummary ? osSummary.progressPercent : 0;
  const cnPercent = cnSummary ? cnSummary.progressPercent : 0;

  // Overall Technical Progress (mean of active tracks)
  const allCompleted = topics.filter(
    (t) => t.status === 'COMPLETED' || t.status === 'MASTERED'
  ).length;
  const overallTechPercent = Math.round((allCompleted / topics.length) * 100);

  // Target Career Progress (weighted: Java 30%, DSA 45%, CS Core 25%)
  const targetCareerPercent = Math.round(
    javaPercent * 0.3 + dsaPercent * 0.45 + ((dbmsPercent + osPercent + cnPercent) / 3) * 0.25
  );

  return {
    javaPercent,
    dsaPercent,
    dbmsPercent,
    osPercent,
    cnPercent,
    overallTechPercent,
    targetCareerPercent,
  };
}

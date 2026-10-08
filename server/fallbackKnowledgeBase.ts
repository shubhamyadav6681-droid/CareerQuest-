import { StudentProfile } from '../src/types/career';

export interface FallbackAnswer {
  match: (q: string) => boolean;
  generate: (q: string, profile: StudentProfile, completedTopics: string[]) => {
    content: string;
    actions: Array<{ label: string; actionType: string; payload?: any }>;
  };
}

export const FALLBACK_KNOWLEDGE_BASE: FallbackAnswer[] = [
  // 1. WHAT SHOULD I LEARN IN JAVA?
  {
    match: (q) =>
      (q.includes('what should i learn in java') || q.includes('how to learn java') || q.includes('java curriculum') || q.includes('order of java') || q.includes('java roadmap')),
    generate: (_, profile, completed) => {
      const isArraysDone = completed.some((c) => c.toLowerCase().includes('array'));
      return {
        content: `Based on your goal of **${profile.targetRole} at ${profile.targetCompany}** and your current completed skills, I recommend learning Java in this exact foundational order:

1. **Variables and Data Types** (Primitive types, memory sizes, wrapper classes)
2. **Input/Output** (Scanner, BufferedReader, formatting)
3. **Conditions** (if-else, switch expressions)
4. **Loops** (for, while, do-while, enhanced for-each)
5. **Arrays** (1D/2D arrays, indexing, contiguous memory)
6. **Strings** (String Constant Pool, Immutability, StringBuilder)
7. **Methods** (Pass-by-value semantics, method overloading)
8. **Object-Oriented Programming (OOP)** (Classes, Encapsulation, Inheritance, Polymorphism, Abstraction)
9. **Exception Handling** (Checked vs Unchecked, try-with-resources)
10. **Collections Framework** (ArrayList, LinkedList, HashMap, HashSet, PriorityQueue)
11. **File Handling & I/O Streams**
12. **Multithreading & Concurrency** (Thread lifecycle, Synchronization, Locks)
13. **JDBC & Database Connectivity**

${isArraysDone ? `### 🎯 Your Immediate Next Step: **Java Strings**
Since you have already completed **Arrays**, your next topic should be **Strings**.

**Why Strings is the next step:**
In Java, a String is internally backed by an array of bytes/chars, but it behaves very differently due to the **String Constant Pool (SCP)** and **immutability**. Understanding arrays first gives you the mental model of how Strings store data, while mastering Strings is mandatory because $>60\%$ of tech interview screening problems at ${profile.targetCompany} involve string manipulation (two pointers, palindromes, sliding window).` : 'Start with Variables and Input/Output to build strong syntax discipline.'}`,
        actions: [
          { label: 'Start Java Strings', actionType: 'start-topic', payload: { topic: 'Strings' } },
          { label: 'Take Arrays Assessment', actionType: 'give-practice', payload: { topic: 'Arrays' } },
          { label: 'Explain String Pool (SCP)', actionType: 'explain-more' },
          { label: 'Add Strings to Sprint', actionType: 'add-to-this-week', payload: { task: 'Java Strings & Immutability' } },
        ],
      };
    },
  },

  // 2. WHAT IS AN ARRAY?
  {
    match: (q) => q.includes('what is an array') || q.includes('what is array') || q.includes('explain array'),
    generate: () => ({
      content: `### STEP 1 — Understand the concept
An **array** is a linear data structure that stores a collection of elements of the same data type in contiguous (adjacent) memory locations.

### STEP 2 — Explain it in simple language
Think of an array like a row of numbered lockers in a school hallway.
- Every locker has the exact same size.
- The lockers are placed side by side with no gaps.
- You can instantly open locker #4 if you know where locker #0 is because they are in a straight, numbered line.

### STEP 3 — Show a small example
\`\`\`java
// Declaring and initializing an array of integers in Java
int[] marks = new int[5]; // Stores 5 integers
marks[0] = 85;
marks[1] = 92;
marks[2] = 78;
marks[3] = 90;
marks[4] = 88;
\`\`\`

### STEP 4 — Explain the example
- \`int[] marks\`: Tells the Java compiler that \`marks\` will reference an array of integers.
- \`new int[5]\`: Allocates memory on the JVM Heap for 5 consecutive integer slots (each taking 4 bytes).
- \`marks[0]\`: Arrays in Java are **0-indexed**. The first item is at index 0, and the last is at index $N - 1$.

### STEP 5 — Practical use in software
1. Fast lookup: Accessing \`marks[i]\` takes $O(1)$ constant time because the CPU calculates: \`Address = BaseAddress + (index * 4 bytes)\`.
2. Building blocks: Hash tables, heaps, and matrices all rely internally on arrays.

### STEP 6 — Common mistakes to avoid
1. **ArrayIndexOutOfBoundsException**: Trying to access \`marks[5]\` when size is 5 (valid indices are only 0 through 4).
2. **Fixed Size**: In standard Java, arrays cannot grow or shrink dynamically once created. Use \`ArrayList\` if dynamic resizing is needed.

### STEP 7 — Practice Task
Write a Java method that accepts an \`int[] arr\` and returns the maximum element using a single loop scan ($O(N)$ time, $O(1)$ space).

### STEP 8 — Recommended next topic
**Java Strings** or **Two Pointers Technique** on sorted arrays.`,
      actions: [
        { label: 'Give Array Code Example', actionType: 'give-example' },
        { label: 'Give 5 Array Questions', actionType: 'give-practice' },
        { label: 'What is an ArrayList?', actionType: 'explain-more' },
      ],
    }),
  },

  // 3. WHAT IS RECURSION? / I DON'T UNDERSTAND RECURSION
  {
    match: (q) => q.includes('recursion') || q.includes('recursive'),
    generate: (_, profile) => ({
      content: `### STEP 1 — Understand the concept
**Recursion** is a programming technique where a method solves a large problem by calling itself with smaller instances of the same problem until it reaches a terminating condition called the **base case**.

### STEP 2 — Explain it in simple language
Imagine Russian nesting dolls (Matryoshka).
- You open a big doll to find a slightly smaller doll inside.
- You keep opening each doll until you reach the tiniest, solid doll in the center that cannot open. That is your **Base Case**.
- Once you reach the center doll, you close them back up, layer by layer, until the whole doll is assembled.

### STEP 3 — Show a small example
\`\`\`java
// Factorial of N: N! = N * (N - 1)!
public static int factorial(int n) {
    // 1. BASE CASE (The emergency brake)
    if (n <= 1) {
        return 1;
    }
    // 2. RECURSIVE STEP (Trust the subproblem)
    return n * factorial(n - 1);
}
\`\`\`

### STEP 4 — Explain the example
When you call \`factorial(3)\`:
1. \`factorial(3)\` pushes a frame onto the Thread Call Stack, waiting for \`3 * factorial(2)\`.
2. \`factorial(2)\` pushes another frame, waiting for \`2 * factorial(1)\`.
3. \`factorial(1)\` hits the base case and immediately returns \`1\`.
4. Now the stack unwinds: \`2 * 1 = 2\`, then \`3 * 2 = 6\`. Result is 6.

### STEP 5 — Practical use in software
Recursion is the natural engine for **Binary Trees (DFS)**, **Graphs**, and **Backtracking** (e.g. Sudoku solvers, file system directory crawling).

### STEP 6 — Common mistakes
1. **StackOverflowError**: Forgetting the base case or making the recursive argument move away from the base case.
2. Excessive memory: Each recursive call adds a stack activation frame ($O(N)$ auxiliary space).

### STEP 7 — Practice Task
Draw the recursion tree on a piece of paper for \`fibonacci(4)\`. Notice how many duplicate subproblems are calculated.

### STEP 8 — Recommended next topic
**Backtracking (Subsets & Combinations)**, followed by **Memoization (Dynamic Programming)**.`,
      actions: [
        { label: 'Show Recursion Call Stack', actionType: 'explain-more' },
        { label: 'Add Recursion Revision to Roadmap', actionType: 'add-to-roadmap', payload: { topic: 'Recursion Call Stack & Backtracking' } },
        { label: 'Give 3 LeetCode Recursion Questions', actionType: 'give-practice' },
      ],
    }),
  },

  // 4. WHAT IS DSA?
  {
    match: (q) => q.includes('what is dsa') || q.includes('explain dsa') || q.includes('why dsa'),
    generate: (_, profile) => ({
      content: `### STEP 1 — Understand the concept
**DSA** stands for **Data Structures and Algorithms**.
- **Data Structure**: A specialized format for organizing, storing, and managing data efficiently in memory (e.g., Array, Stack, Queue, Hash Table, Tree, Graph).
- **Algorithm**: A step-by-step mathematical recipe for solving a specific computational problem using those data structures (e.g., Binary Search, Merge Sort, Dijkstra's).

### STEP 2 — Explain it in simple language
- Data Structure = The kitchen organizer (the spice rack, refrigerator, cutlery drawer).
- Algorithm = The recipe (chop onions, simmer for 10 minutes, stir).
If your spices are thrown into a chaotic pile, your cooking is slow. If your data is structured properly, your algorithm can execute in milliseconds even on millions of users.

### STEP 3 — Practical use at Big Tech (${profile.targetCompany})
Companies like ${profile.targetCompany} don't test DSA just to memorize puzzles. They test it because their servers handle billions of requests per second. An algorithm with time complexity $O(N^2)$ could freeze an Azure or Windows cloud datacenter, whereas an optimal $O(N \\log N)$ algorithm runs in 0.05 seconds.

### STEP 4 — The recommended learning path:
1. **Asymptotic Complexity (Big-O)**
2. **Linear Structures**: Arrays, Strings, Two Pointers, Sliding Window
3. **Linked Lists, Stacks, Queues**
4. **Recursion & Backtracking**
5. **Trees & Binary Search Trees**
6. **Heaps & Priority Queues**
7. **Graphs (BFS, DFS, Shortest Paths)**
8. **Dynamic Programming & Greedy**`,
      actions: [
        { label: 'What is Big-O Complexity?', actionType: 'explain-more' },
        { label: 'Start Two Pointers', actionType: 'start-topic' },
        { label: 'Give 5 Beginner DSA Problems', actionType: 'give-practice' },
      ],
    }),
  },

  // 5. DAILY STUDY PLAN (e.g. "I can study 2 hours today")
  {
    match: (q) =>
      q.includes('study 2 hours') ||
      q.includes('2 hours today') ||
      q.includes('study plan today') ||
      q.includes('i have 2 hours') ||
      q.includes('i can study') ||
      q.includes('daily plan'),
    generate: (q, profile) => {
      return {
        content: `### 🎯 TODAY'S 2-HOUR HIGH-IMPACT STUDY PLAN (120 Minutes)
*Tailored for your target: ${profile.targetRole} @ ${profile.targetCompany}*

| Time | Topic | Difficulty | Reason | XP Reward |
| :--- | :--- | :--- | :--- | :--- |
| **45 min** | **Java Strings & Immutability** | Medium | Strings SCP & StringBuilder tested in 70% of phone screens | +50 XP |
| **30 min** | **DSA: Two Pointers Practice** | Medium | Essential for solving LeetCode arrays efficiently | +40 XP |
| **25 min** | **Hands-On Problem Solving** | Easy/Med | 2 problems on LeetCode / IDE to reinforce pattern | +35 XP |
| **10 min** | **Quick Concept Quiz** | Easy | Test retention on pass-by-value and SCP | +20 XP |
| **10 min** | **Daily Retrospective & Log** | Review | Record what you learned in your permanent progress memory | +15 XP |

**Total Time:** 120 minutes (2.0 hours)
**Focus Rule:** Use 25-minute Pomodoro sprints with 5-minute pauses. Keep your phone in another room!`,
        actions: [
          { label: 'Add Strings to Today Sprint', actionType: 'add-to-this-week', payload: { task: 'Java Strings & Immutability' } },
          { label: 'Start 25-min Pomodoro Timer', actionType: 'create-study-plan' },
          { label: 'Give 2 Practice Problems for Today', actionType: 'give-practice' },
        ],
      };
    },
  },

  // 6. WEEKLY PLAN (e.g. "I want to complete Java Arrays and Strings this week")
  {
    match: (q) =>
      q.includes('this week') || q.includes('weekly plan') || q.includes('weekly goal') || q.includes('7-day plan'),
    generate: (_, profile) => ({
      content: `### 📅 REALISTIC 7-DAY WEEKLY SPRINT: ARRAYS & STRINGS MASTERY
*Engineered for ${profile.dailyStudyHours} hours/day study pace*

- **MONDAY**: Array Basics & Memory Allocation — Declaration, contiguous Heap layout, and indexing ($O(1)$ access).
- **TUESDAY**: Array Traversal & In-Place Algorithms — Kadane's algorithm (Max Subarray Sum), Two Pointers scan.
- **WEDNESDAY**: LeetCode Array Problems — Solve 2 Medium problems (Two Sum II, Move Zeroes).
- **THURSDAY**: Strings Fundamentals — String Constant Pool (SCP), immutability reasons, comparison (\`==\` vs \`.equals()\`).
- **FRIDAY**: StringBuilder & Advanced String Methods — Fast concatenation, substring, character frequencies.
- **SATURDAY**: Mixed Problem Solving & Quiz — 3 problems combining Arrays + Strings (e.g., Valid Anagram, Longest Common Prefix).
- **SUNDAY**: Revision & Speed Drill — Timed assessment + update your CareerQuest progress memory.

---
### 💡 Missed a Day?
Life happens! If you fall behind:
- Do **not** try to cram 4 hours on one day.
- Simply shift the remaining targets forward or hit the **[Rebuild My Week]** action.`,
      actions: [
        { label: 'Add Week Sprint to Tasks', actionType: 'add-to-this-week' },
        { label: 'Start Monday: Array Traversal', actionType: 'start-topic' },
        { label: 'Rebuild My Week', actionType: 'create-study-plan' },
      ],
    }),
  },

  // 7. PREPARE FOR MICROSOFT / AMAZON / BIG TECH
  {
    match: (q) =>
      q.includes('prepare for microsoft') ||
      q.includes('microsoft preparation') ||
      q.includes('how to crack microsoft') ||
      q.includes('prepare for amazon') ||
      q.includes('crack amazon'),
    generate: (q, profile) => {
      const company = q.includes('amazon') ? 'Amazon' : 'Microsoft';
      return {
        content: `### 🎯 ${company.toUpperCase()} SDE-1 PREPARATION ROADMAP
*Calibrated for your current university stage: ${profile.yearSemester} (${profile.dailyStudyHours} hrs/day)*

Here is how ${company}'s interview committee evaluates engineering candidates:

1. **Programming Language Fluency (Java / C++)**
   - Deep memory mechanics: Garbage collection, JVM Metaspace, Object-Oriented SOLID principles.
2. **Data Structures & Algorithms (The Core Gate)**
   - Solve 150+ curated problems. Microsoft focuses heavily on **Arrays, Strings, Trees (BST, LCA), and Graphs (BFS/DFS)**.
   - Amazon focuses heavily on **HashMaps, Two Pointers, Priority Queues / Heaps, and BFS**.
3. **Computer Science Fundamentals**
   - **Operating Systems**: Threads, Virtual Memory, Process Context Switch, Deadlocks.
   - **DBMS**: ACID transactions, B+ Tree indexing, SQL Joins.
   - **Computer Networks**: TCP 3-way handshake, DNS, HTTPS TLS.
4. **High-Impact Portfolio Project**
   - Build a production service with real engineering tradeoffs (e.g. our recommended *Distributed In-Memory LRU Cache in Java*).
5. **Behavioral & Culture (STAR Method)**
   - ${company === 'Amazon' ? 'Master the 16 Amazon Leadership Principles with 2 concrete stories per principle.' : 'Demonstrate Satya Nadella’s "Growth Mindset" (Learn-it-all vs Know-it-all), empathy, and resilience.'}`,
        actions: [
          { label: `View ${company} Reverse Engineering`, actionType: 'create-study-plan' },
          { label: 'Give 5 Typical Interview Questions', actionType: 'give-practice' },
          { label: 'Explain STAR Behavioral Method', actionType: 'explain-more' },
        ],
      };
    },
  },

  // 8. WHAT IS OOP?
  {
    match: (q) => q.includes('what is oop') || q.includes('explain oop') || q.includes('object oriented'),
    generate: () => ({
      content: `### STEP 1 — Understand the concept
**Object-Oriented Programming (OOP)** is a programming paradigm based on the concept of **Objects**, which bundle data (attributes/fields) and behavior (methods) together into reusable blueprints called **Classes**.

### STEP 2 — Explain it in simple language
Think of a **Class** as the architectural blueprint for a house.
The blueprint itself isn't a house—you can't live in it.
When a builder uses that blueprint to construct an actual building with bricks and paint, that living house is an **Object** (an instance of the Class).

### STEP 3 — The 4 Core Pillars of OOP:
1. **Encapsulation**: Keeping data private inside the class and providing controlled public access via getters/setters (data hiding).
2. **Inheritance**: Creating new classes based on existing ones to reuse code (\`Dog extends Animal\`).
3. **Polymorphism**: The ability of an object to take many forms (Method Overloading and Method Overriding).
4. **Abstraction**: Hiding internal implementation details and exposing only essential interfaces (e.g., using a car steering wheel without needing to know engine piston mechanics).

### STEP 4 — Small Java Example
\`\`\`java
// Encapsulation & Inheritance in Java
public class BankAccount {
    private double balance; // Encapsulated private field

    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}
\`\`\`

### STEP 5 — Practice Task
Design a \`Vehicle\` base class and extend it into \`ElectricCar\` that overrides a \`drive()\` method and tracks battery percentage.`,
      actions: [
        { label: 'Explain Polymorphism in Depth', actionType: 'explain-more' },
        { label: 'Give OOP Interview Questions', actionType: 'give-practice' },
        { label: 'Start OOP Milestone', actionType: 'start-topic' },
      ],
    }),
  },

  // 9. GIVE ME 5 ARRAY QUESTIONS
  {
    match: (q) => q.includes('5 array questions') || q.includes('array problems') || q.includes('array practice'),
    generate: () => ({
      content: `### 🧠 5 HIGH-YIELD ARRAY PROBLEMS FOR INTERVIEWS

Here are 5 hand-picked array problems with difficulty and key pattern tags:

1. **Two Sum** (Easy)
   - *Pattern:* Hash Map single-pass scan
   - *Key takeaway:* Trade $O(N)$ space to eliminate an $O(N^2)$ nested loop down to $O(N)$ time.
2. **Best Time to Buy and Sell Stock** (Easy)
   - *Pattern:* Running minimum prefix tracking
   - *Key takeaway:* Maintain current min price while calculating max profit.
3. **Maximum Subarray (Kadane’s Algorithm)** (Medium)
   - *Pattern:* Dynamic Programming / Running prefix sum
   - *Key takeaway:* If your running sum becomes negative, reset it to 0.
4. **Product of Array Except Self** (Medium)
   - *Pattern:* Prefix & Suffix products in-place
   - *Key takeaway:* Solve in $O(N)$ time without using the division operator.
5. **Container With Most Water** (Medium)
   - *Pattern:* Two Pointers moving inward
   - *Key takeaway:* Always move the pointer pointing to the shorter wall.`,
      actions: [
        { label: 'Give Hint for Kadane’s Algorithm', actionType: 'explain-more' },
        { label: 'Show Code for Two Sum', actionType: 'give-example' },
        { label: 'Add to Today Sprint', actionType: 'add-to-this-week', payload: { task: 'Solve 2 LeetCode Array Problems' } },
      ],
    }),
  },
];

export function findFallbackAnswer(query: string, profile: StudentProfile, completedTopics: string[]) {
  const cleanQ = query.toLowerCase().trim();
  for (const item of FALLBACK_KNOWLEDGE_BASE) {
    if (item.match(cleanQ)) {
      return item.generate(cleanQ, profile, completedTopics);
    }
  }
  return null;
}

// Initial seed data for the Knowledge Decay Predictor & Smart Revision Assistant

export const INITIAL_TOPICS = [
  {
    id: "topic-1",
    title: "Dynamic Programming",
    lastStudied: "2026-06-15",
    duration: 120, // in minutes
    confidenceScore: 2, // 1 to 5
    quizScore: 60, // percentage
    revisionCount: 1,
    difficulty: "Hard"
  },
  {
    id: "topic-2",
    title: "Graph Algorithms",
    lastStudied: "2026-06-12",
    duration: 90,
    confidenceScore: 3,
    quizScore: 70,
    revisionCount: 2,
    difficulty: "Hard"
  },
  {
    id: "topic-3",
    title: "Binary Search",
    lastStudied: "2026-06-19",
    duration: 45,
    confidenceScore: 5,
    quizScore: 95,
    revisionCount: 4,
    difficulty: "Easy"
  },
  {
    id: "topic-4",
    title: "Operating Systems - Virtual Memory",
    lastStudied: "2026-06-10",
    duration: 80,
    confidenceScore: 1,
    quizScore: 40,
    revisionCount: 0,
    difficulty: "Hard"
  },
  {
    id: "topic-5",
    title: "React Lifecycle & Hooks",
    lastStudied: "2026-06-18",
    duration: 60,
    confidenceScore: 4,
    quizScore: 88,
    revisionCount: 3,
    difficulty: "Medium"
  }
];

export const INITIAL_NOTES = [
  {
    id: "note-1",
    title: "Dynamic Programming - Memoization vs Tabulation",
    content: "Memoization (Top-down): Solves subproblems recursively and caches results. Useful when not all subproblems need to be solved.\nTabulation (Bottom-up): Solves subproblems iteratively, starting from the base cases. Generally faster due to no recursion overhead.\nKey steps:\n1. Define state variables.\n2. Formulate recurrence relation.\n3. Determine base cases.",
    tags: ["Algorithms", "DP"],
    updatedAt: "2026-06-15"
  },
  {
    id: "note-2",
    title: "Graph Traversal - BFS vs DFS Comparison",
    content: "Breadth-First Search (BFS):\n- Uses a Queue.\n- Finds the shortest path in unweighted graphs.\n- Time Complexity: O(V + E).\n\nDepth-First Search (DFS):\n- Uses a Stack or Recursion.\n- Good for cycle detection and topological sorting.\n- Time Complexity: O(V + E).",
    tags: ["Algorithms", "Graphs"],
    updatedAt: "2026-06-12"
  },
  {
    id: "note-3",
    title: "Virtual Memory - Page Replacement Algorithms",
    content: "FIFO (First In First Out): Suffers from Belady's Anomaly (more frames can lead to more page faults).\nLRU (Least Recently Used): Replaces the page that has not been used for the longest time. Optimal in practice but hard to implement efficiently without hardware support.\nOptimal Page Replacement: Replaces page that will not be used for the longest duration in the future (theoretical baseline).",
    tags: ["OS", "Memory"],
    updatedAt: "2026-06-10"
  }
];

export const CHAT_BOT_ANSWERS = [
  {
    keywords: ["why", "revise", "dynamic programming", "dp"],
    answer: "You should revise Dynamic Programming because your confidence score is medium (2/5), you've only revised it once, and it has been 5 days since you last studied it. High complexity topics degrade quickly without active recall!"
  },
  {
    keywords: ["why", "revise", "virtual memory", "operating systems", "os"],
    answer: "Virtual Memory has been flagged as HIGH RISK. Your confidence score is low (1/5), your last quiz score was 40%, and you haven't revised it since you studied it 10 days ago. Revise this immediately to prevent memory decay."
  },
  {
    keywords: ["forgetting risk", "risk score", "calculate", "ml"],
    answer: "The platform predicts knowledge decay based on: 1) Days elapsed since last study, 2) Study duration, 3) Self-assessed confidence, and 4) Quiz score. A higher number of elapsed days coupled with low scores creates a high Forgetting Risk."
  },
  {
    keywords: ["how to use", "guide", "help"],
    answer: "Welcome to the Revision Assistant! Here is how you can use this platform:\n1. Log your study sessions on the 'Study Tracker' page.\n2. Check your 'Dashboard' for forgetting risk predictions and upcoming revisions.\n3. Add study notes on the 'Notes' page to keep summary materials close.\n4. Ask me any conceptual questions right here!"
  }
];

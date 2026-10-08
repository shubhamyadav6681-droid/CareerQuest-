export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type NodeStatus =
  | 'completed'          // Green
  | 'current'            // Blue
  | 'needs-improvement'  // Orange
  | 'critical-gap'       // Red
  | 'locked'             // Grey
  | 'recommended';       // Purple

export type TopicStatus =
  | 'LOCKED'
  | 'NOT STARTED'
  | 'IN PROGRESS'
  | 'COMPLETED'
  | 'NEEDS REVISION'
  | 'MASTERED';

export type NodeCategory =
  | 'language'
  | 'dsa'
  | 'cs-core'
  | 'development'
  | 'project'
  | 'interview'
  | 'system-design'
  | 'milestone';

export interface LearningResource {
  title: string;
  type: 'video' | 'documentation' | 'book' | 'article';
  url?: string;
  authorOrSource?: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform?: 'LeetCode' | 'HackerRank' | 'GeeksforGeeks' | 'CodeStudio';
  concept: string;
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GranularTopic {
  id: string;
  name: string;
  parentSkill: string; // e.g. 'Java', 'DSA', 'DBMS', 'OS', 'Networks', 'Projects'
  parentNodeId?: string; // e.g. 'java-fundamentals'
  status: TopicStatus;
  progressPercent?: number; // 0 - 100 for 'IN PROGRESS'
  completedDate?: string;
  lastRevisedDate?: string;
  assessmentScore?: number; // 0 to 100
  practiceAccuracy?: number; // 0 to 100
  learnedNotes?: string;
  evidenceNotes?: string[];
  prerequisites?: string[];
  importance?: 'Foundational' | 'High-Yield' | 'Target-Critical';
}

export interface RoadmapNode {
  id: string;
  title: string;
  subtitle?: string;
  category: NodeCategory;
  status: NodeStatus;
  topicStatus?: TopicStatus;
  parentId?: string;
  childrenIds?: string[];
  prerequisites: string[];
  estimatedHours: number;
  importance: 'Foundational' | 'High-Yield' | 'Target-Critical' | 'Specialized';
  whyItMatters: string;
  whatToLearn: string[];
  granularTopics?: GranularTopic[];
  resources: LearningResource[];
  practiceProblems: PracticeProblem[];
  miniProjectIdea?: string;
  quiz?: QuizQuestion[];
  userNotes?: string;
  userLearnedNotes?: string;
  masteryScore?: number; // 0 to 100
  completedDate?: string;
  lastRevisedDate?: string;
  isRecommendedForRevision?: boolean;
  practiceAccuracy?: number;
  level: number; // Tier level in the graph (0, 1, 2, 3...)
  tags: string[];
}

export interface StudentProfile {
  name: string;
  college: string;
  degree: string;
  branch: string;
  yearSemester: string;
  cgpa?: string;
  knownLanguages: string[];
  technicalSkills: string[];
  currentProjects: string[];
  targetCompany: string;
  targetRole: string;
  careerGoal: string;
  currentSkillLevel: SkillLevel;
  dailyStudyHours: number;
  preferredLearningStyle: 'Hands-on Projects' | 'Video Tutorials' | 'Interactive Problem Solving' | 'Reading & Docs';
  completedTopics: string[];
  inProgressTopics?: string[];
  needsRevisionTopics?: string[];
  weakAreas: string[];
  targetTimeline: string;
}

export interface ActionButton {
  label: string;
  actionType:
    | 'explain-more'
    | 'simple-explanation'
    | 'give-example'
    | 'give-practice'
    | 'create-study-plan'
    | 'add-to-roadmap'
    | 'add-to-this-week'
    | 'save-note'
    | 'start-topic'
    | 'revise-topic'
    | 'retry';
  payload?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
  contextNodeId?: string;
  suggestedActions?: ActionButton[];
  isStreaming?: boolean;
}

export interface SkillGapItem {
  skill: string;
  category: string;
  importance: 'Critical' | 'Recommended' | 'Bonus';
  currentLevel: 'Missing' | 'Basic' | 'Proficient';
  targetExpectation: string;
  recommendedAction: string;
}

export interface ReverseEngineeringAnalysis {
  targetRole: string;
  targetCompany: string;
  companyTierDescription: string;
  matchScore: number; // 0 to 100
  hiringFocus: string[];
  breakdown: {
    programmingLanguages: string[];
    dsaKeyTopics: string[];
    csFundamentals: string[];
    databases: string[];
    developmentSkills: string[];
    highImpactProjects: string[];
    interviewPreparation: string[];
    resumeRequirements: string[];
  };
  skillGaps: SkillGapItem[];
  weeklyStrategy: string[];
  customMilestones: {
    phase: string;
    duration: string;
    focus: string;
    keyDeliverables: string[];
  }[];
}

export interface DailyTask {
  id: string;
  title: string;
  category: NodeCategory;
  durationMinutes: number;
  nodeId?: string;
  completed: boolean;
  notes?: string;
}

export interface DailySprint {
  date: string;
  totalStudyMinutes: number;
  tasks: DailyTask[];
  motivationalQuote: string;
  completedCount: number;
}

export interface SkillCategorySummary {
  skillName: string;
  iconName: string;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  inProgressCount: number;
  needsRevisionCount: number;
  masteredCount: number;
  topics: GranularTopic[];
}

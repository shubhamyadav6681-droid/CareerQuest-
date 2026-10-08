import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { StudentProfile } from '../src/types/career';
import { findFallbackAnswer } from './fallbackKnowledgeBase';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// Follow official guidelines: initialize with User-Agent header
export const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Clean text helper to extract base64 data and mimeType
function parseBase64Image(dataUrl: string): { data: string; mimeType: string } | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2],
  };
}

export async function handleMentorChat(
  messages: Array<{ role: 'user' | 'assistant'; content: string; imageUrl?: string }>,
  profile: StudentProfile,
  roadmapContext?: string,
  granularContext?: {
    completedTopics?: string[];
    inProgressTopics?: string[];
    needsRevisionTopics?: string[];
    revisionTriggers?: string[];
  }
): Promise<{
  content: string;
  suggestedActions: Array<{ label: string; actionType: string; payload?: any }>;
  isError?: boolean;
}> {
  const completedList = granularContext?.completedTopics || profile.completedTopics;
  const inProgressList = granularContext?.inProgressTopics || profile.inProgressTopics || [];
  const needsRevisionList = granularContext?.needsRevisionTopics || profile.needsRevisionTopics || [];

  const systemInstruction = `
You are CareerQuest AI, an elite Personal AI Tutor, Career Mentor, Study Planner, and Doubt Solver for engineering students.

CURRENT STUDENT CONTEXT & VERIFIED PROGRESS MEMORY:
- Name: ${profile.name}
- College & Degree: ${profile.degree} in ${profile.branch} (${profile.college}), Year/Sem: ${profile.yearSemester}
- Current CGPA: ${profile.cgpa || 'Not specified'}
- Known Languages: ${profile.knownLanguages.join(', ')}
- Technical Skills: ${profile.technicalSkills.join(', ')}
- Current Projects: ${profile.currentProjects.join(', ')}
- Target Dream Goal: ${profile.targetRole} at ${profile.targetCompany}
- Available Daily Study Time: ${profile.dailyStudyHours} hours/day
- Preferred Learning Style: ${profile.preferredLearningStyle}

PERMANENT COMPLETED TOPIC MEMORY:
- COMPLETED TOPICS (DO NOT RE-TEACH AS NEW): ${completedList.join(', ')}
- IN-PROGRESS TOPICS: ${inProgressList.join(', ')}
- TOPICS NEEDING REVISION: ${needsRevisionList.join(', ')}
- Known Weak Areas: ${profile.weakAreas.join(', ')}
- Timeline: ${profile.targetTimeline}
${roadmapContext ? `\nACTIVE ROADMAP SUMMARY:\n${roadmapContext}` : ''}

CRITICAL MENTOR BEHAVIORS & STRUCTURE:
1. NEVER respond with vague generic placeholders (e.g., "Keep learning", "Try again later", "Let's stay focused"). Always answer the specific student question with depth, empathy, and technical rigor.
2. STEP-BY-STEP EXPLANATIONS: For conceptual technical questions (e.g., "What is an array?", "Explain recursion", "What is Big-O?"), use this structured flow:
   - STEP 1 — Understand the concept
   - STEP 2 — Explain it in simple language (using intuitive everyday analogies)
   - STEP 3 — Show a small clean code example (in Java or language requested)
   - STEP 4 — Explain the example line-by-line
   - STEP 5 — Show practical use at ${profile.targetCompany}
   - STEP 6 — Explain common mistakes & pitfalls to avoid
   - STEP 7 — Give a small practice task
   - STEP 8 — Recommend the next sequential topic
3. CODE EXPLANATION MODE: If the student provides code or asks "Why does this error occur?":
   - 1. Understand the code and what it is trying to achieve
   - 2. Explain what the code does
   - 3. Walk through important lines
   - 4. Identify errors/bugs (e.g. NullPointerException, off-by-one, memory leak)
   - 5. Explain why the error occurs
   - 6. Provide corrected, idiomatic code
   - 7. Explain the fix
   - 8. Give a similar practice problem
4. IMAGE / PHOTO QUESTIONS: When an image is attached (screenshot of IDE, error trace, textbook page, LeetCode problem, math formula):
   - 1. Identify the question in the image
   - 2. Explain what is being asked
   - 3. Identify relevant concepts
   - 4. Solve/explain step-by-step
   - 5. Give final solution
   - 6. If the image is blurry/unreadable, say: "I can't clearly read this part of the image. Please upload a clearer image or crop the question."
5. COMPLETED TOPIC RESPECT: Never recommend topics the student already completed. If Java Arrays is completed, recommend Java Strings next and explain WHY Strings is the next step.
6. DAILY & WEEKLY STUDY PLANS:
   - When asked for daily plans (e.g., "I can study 2 hours today"): Break down into minutes (e.g. 45 min, 30 min, 25 min, 10 min, 10 min) with Topic, Estimated Time, Difficulty, Reason, and XP reward (+50 XP).
   - When asked for weekly plans: Provide Monday to Sunday breakdown with missed task rescheduling instructions.
7. LEARNING RESOURCES: Only recommend verified resources (e.g. Effective Java, CLRS, Silberschatz OS; creators like Kunal Kushwaha, Striver, NeetCode, Abdul Bari; platforms like LeetCode, HackerRank). Do not hallucinate resources.

Provide 3 to 5 contextual actions at the end in a JSON block labeled \`\`\`json:actions ... \`\`\`.
Allowed actionType values:
- 'explain-more'
- 'simple-explanation'
- 'give-example'
- 'give-practice'
- 'create-study-plan'
- 'add-to-roadmap'
- 'add-to-this-week'
- 'save-note'
- 'start-topic'
- 'revise-topic'
- 'retry'
`;

  const latestUserMsg = messages[messages.length - 1]?.content || '';

  // If no AI key configured or in preview fallback mode, consult local fallback knowledge base
  if (!ai) {
    const fallback = findFallbackAnswer(latestUserMsg, profile, completedList);
    if (fallback) {
      return {
        content: fallback.content,
        suggestedActions: fallback.actions,
      };
    }

    return {
      content: `I analyzed your question regarding your goal (**${profile.targetRole} @ ${profile.targetCompany}**) and verified memory of your completed topics.

### 🎯 Strategic Guidance:
- You have already completed **Java Fundamentals & Arrays**, **DSA Complexity Basics**, and **DBMS Intro**.
- Your active focus is **Java Strings** (In Progress) and **Two Pointers**.
- Next sequential milestone: **Java Strings (String Constant Pool & Immutability)**, which directly prepares you for LeetCode string algorithms and object-oriented class design.

Would you like a step-by-step concept breakdown, code example, or practice problems?`,
      suggestedActions: [
        { label: 'Start Java Strings', actionType: 'start-topic', payload: { topic: 'Strings' } },
        { label: 'Give 5 Practice Questions', actionType: 'give-practice' },
        { label: 'What should I study today?', actionType: 'create-study-plan' },
        { label: 'Revise Java Arrays', actionType: 'revise-topic', payload: { topic: 'Arrays' } },
      ],
    };
  }

  // Try calling Gemini API with internal retry
  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      // Build multimodal contents
      const contents: any[] = [];

      for (const msg of messages) {
        const parts: any[] = [];
        if (msg.imageUrl) {
          const parsed = parseBase64Image(msg.imageUrl);
          if (parsed) {
            parts.push({
              inlineData: {
                mimeType: parsed.mimeType,
                data: parsed.data,
              },
            });
          }
        }
        if (msg.content) {
          parts.push({ text: msg.content });
        }
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts,
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const rawText = response.text || '';
      if (!rawText) throw new Error('Empty response');

      // Extract actions json block if present
      const actionsMatch = rawText.match(/```json:actions\s*([\s\S]*?)\s*```/);
      let actions: any[] = [];
      let cleanText = rawText;

      if (actionsMatch) {
        cleanText = rawText.replace(actionsMatch[0], '').trim();
        try {
          actions = JSON.parse(actionsMatch[1]);
        } catch {
          // ignore
        }
      }

      if (!actions || actions.length === 0) {
        actions = [
          { label: 'Explain More', actionType: 'explain-more' },
          { label: 'Give Code Example', actionType: 'give-example' },
          { label: 'Give Practice Questions', actionType: 'give-practice' },
          { label: 'Add to My Roadmap', actionType: 'add-to-roadmap' },
        ];
      }

      return {
        content: cleanText,
        suggestedActions: actions,
      };
    } catch (error: any) {
      console.warn(`Gemini attempt ${attempts} failed:`, error?.message);
      if (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }
    }
  }

  // If Gemini fails after retries, try educational fallback knowledge base first
  const fallback = findFallbackAnswer(latestUserMsg, profile, completedList);
  if (fallback) {
    return {
      content: fallback.content,
      suggestedActions: fallback.actions,
    };
  }

  // Clean, student-friendly message (Section 14: NEVER show raw technical errors like 503, core reasoning engine)
  return {
    content: `AI Mentor is temporarily busy. Your question is saved. Please try again in a moment.`,
    isError: true,
    suggestedActions: [
      { label: 'Retry Question', actionType: 'retry' },
      { label: 'Save Question', actionType: 'save-note' },
      { label: 'What should I study today?', actionType: 'create-study-plan' },
    ],
  };
}

export async function handleReverseEngineer(
  targetCompany: string,
  targetRole: string,
  jobDescription?: string,
  profile?: StudentProfile
) {
  const prompt = `
You are the CareerQuest AI Reverse-Engineering Engine.
Reverse engineer the job requirements for:
Role: "${targetRole}"
Target Company: "${targetCompany}"
${jobDescription ? `Custom Job Description provided:\n"${jobDescription}"` : ''}

Current Student Context:
- Current Degree: ${profile?.degree || 'B.Tech CSE'}, Year: ${profile?.yearSemester || '1st Year'}
- Known Languages: ${profile?.knownLanguages?.join(', ') || 'C, HTML, Basic Java'}
- Technical Skills: ${profile?.technicalSkills?.join(', ') || 'Procedural programming'}
- Current Projects: ${profile?.currentProjects?.join(', ') || 'Basic portfolio'}
- Available study time: ${profile?.dailyStudyHours || 2} hours/day
- Flagged Weak Areas: ${profile?.weakAreas?.join(', ') || 'Recursion, OOP'}

Break this down into an actionable, comprehensive reverse-engineering analysis.
Return STRICT JSON ONLY conforming to the following structure:
{
  "targetRole": "${targetRole}",
  "targetCompany": "${targetCompany}",
  "companyTierDescription": "A concise 2-sentence breakdown of what this company's hiring committee values most (e.g. Microsoft values clean modular code, scalable architecture, and growth mindset).",
  "matchScore": 38,
  "hiringFocus": ["Algorithmic Depth & LeetCode Medium/Hard", "Object-Oriented Design & Clean Code", "Operating Systems & Concurrency", "Behavioral Alignment"],
  "breakdown": {
    "programmingLanguages": ["Java 17+ or C++", "Memory Management", "JVM Internals"],
    "dsaKeyTopics": ["Arrays & Sliding Window", "Recursion & Trees", "Graphs (BFS/DFS)", "Dynamic Programming"],
    "csFundamentals": ["Operating Systems (Threads, Virtual Memory)", "DBMS (SQL, B+ Trees, ACID)", "Computer Networks (TCP/IP)"],
    "databases": ["PostgreSQL/MySQL", "Redis (In-Memory Caching)"],
    "developmentSkills": ["Spring Boot or ASP.NET Core", "RESTful API Design", "Git & CI/CD", "Docker basics"],
    "highImpactProjects": [
      "Distributed In-Memory Key-Value Cache with LRU Eviction",
      "Real-Time Collaborative Code Editor with WebSockets"
    ],
    "interviewPreparation": [
      "Online Assessment (Codility 2 Mediums in 70 mins)",
      "Technical Round 1: DSA + Edge Cases",
      "Technical Round 2: Data Structures + Low-Level Design (LLD)",
      "Technical Round 3: CS Fundamentals + Deep Project Dive",
      "AA / Behavioral Round: Growth Mindset & STAR Stories"
    ],
    "resumeRequirements": [
      "Quantifiable metrics in projects (e.g. 'processed 10k concurrent requests with <20ms latency')",
      "Clean GitHub repository with README, architecture diagram, and unit tests"
    ]
  },
  "skillGaps": [
    {
      "skill": "Java OOP & Collections",
      "category": "Language",
      "importance": "Critical",
      "currentLevel": "Basic",
      "targetExpectation": "Deep understanding of HashMap collision resolution, interfaces, and clean design patterns",
      "recommendedAction": "Spend 2 weeks mastering Collections and building an LLD project"
    },
    {
      "skill": "Recursion & Dynamic Programming",
      "category": "DSA",
      "importance": "Critical",
      "currentLevel": "Missing",
      "targetExpectation": "Solve 20+ Medium recursion and 15+ DP problems independently",
      "recommendedAction": "Focus 3 weeks on Recursion trees before touching memoization"
    },
    {
      "skill": "Operating Systems & Concurrency",
      "category": "CS-Core",
      "importance": "Recommended",
      "currentLevel": "Missing",
      "targetExpectation": "Explain thread synchronization, deadlock conditions, and virtual memory",
      "recommendedAction": "Study Silberschatz OS concepts alongside Java multithreading"
    }
  ],
  "weeklyStrategy": [
    "Weeks 1-4: Solidify Java Fundamentals & OOP Mastery (2 hrs/day)",
    "Weeks 5-10: DSA Core (Arrays, Strings, Two Pointers, Linked Lists)",
    "Weeks 11-16: Recursion, Trees, and Graphs",
    "Weeks 17-20: Build standout Distributed Cache Project",
    "Weeks 21-24: CS Fundamentals (OS & DBMS) + Mock Interviews"
  ],
  "customMilestones": [
    {
      "phase": "Phase 1: Language Mastery",
      "duration": "4 Weeks",
      "focus": "Transition from C syntax to idiomatic Java OOP & Collections",
      "keyDeliverables": ["Complete 20 Java OOP exercises", "Build CLI Banking System"]
    },
    {
      "phase": "Phase 2: Data Structures Engine",
      "duration": "10 Weeks",
      "focus": "Master LeetCode patterns tested in Microsoft OAs",
      "keyDeliverables": ["Solve 100 curated LeetCode problems", "Master Recursion trees"]
    },
    {
      "phase": "Phase 3: Production Project & CS Core",
      "duration": "6 Weeks",
      "focus": "Build resume-grade project + revise OS & DBMS",
      "keyDeliverables": ["Deploy Distributed Cache project on cloud", "Pass 5 mock technical interviews"]
    }
  ]
}
`;

  if (!ai) {
    // Return structured benchmark fallback
    return {
      targetRole,
      targetCompany,
      companyTierDescription: `${targetCompany} expects rock-solid algorithmic competence, clean object-oriented modularity, and demonstrable passion for continuous learning.`,
      matchScore: 35,
      hiringFocus: [
        'Data Structures & Algorithmic Problem Solving (LeetCode Medium)',
        'Object-Oriented Design & Clean Code Practices',
        'Computer Science Fundamentals (OS, DBMS, Networks)',
        'Growth Mindset & Behavioral Fit',
      ],
      breakdown: {
        programmingLanguages: ['Java 17+', 'Memory Management', 'JVM Architecture'],
        dsaKeyTopics: ['Arrays & Sliding Window', 'Two Pointers', 'Recursion & Trees', 'Graphs', 'Dynamic Programming'],
        csFundamentals: ['Operating Systems (Threads, Virtual Memory)', 'DBMS (ACID, Indexing)', 'Computer Networks (TCP/IP)'],
        databases: ['PostgreSQL / MySQL', 'Redis'],
        developmentSkills: ['REST APIs', 'Spring Boot', 'Git', 'Docker basics'],
        highImpactProjects: ['Distributed In-Memory LRU Cache', 'Real-time Messaging System'],
        interviewPreparation: ['Online Assessment', '2-3 Coding Screen Rounds', 'Low-Level Design', 'Behavioral STAR Round'],
        resumeRequirements: ['One-page clean format', 'Quantified project impact', 'GitHub links with test suites'],
      },
      skillGaps: [
        {
          skill: 'Java OOP & Collections',
          category: 'Language',
          importance: 'Critical',
          currentLevel: 'Basic',
          targetExpectation: 'Fluency in Collections (HashMap, PriorityQueue) & Clean Class Design',
          recommendedAction: 'Dedicate 15 hours to OOP patterns and Collections internals',
        },
        {
          skill: 'Recursion & Backtracking',
          category: 'DSA',
          importance: 'Critical',
          currentLevel: 'Missing',
          targetExpectation: 'Intuition for call stacks, base conditions, and branching recursion trees',
          recommendedAction: 'Solve 15 recursion problems starting with easy subsets and permutations',
        },
        {
          skill: 'Operating Systems & Concurrency',
          category: 'CS-Core',
          importance: 'Recommended',
          currentLevel: 'Missing',
          targetExpectation: 'Explain thread synchronization, race conditions, and deadlocks',
          recommendedAction: 'Complete OS modules on processes, threads, and memory virtualization',
        },
      ],
      weeklyStrategy: [
        'Weeks 1-4: Master Java OOP & Collections (2 hrs/day)',
        'Weeks 5-10: DSA Foundations (Arrays, Two Pointers, Linked Lists)',
        'Weeks 11-16: Recursion, Trees & Graphs',
        'Weeks 17-20: Build & Benchmark In-Memory Cache Project',
        'Weeks 21-24: CS Fundamentals revision & Microsoft Mock Interviews',
      ],
      customMilestones: [
        {
          phase: 'Phase 1: Language Mastery',
          duration: '4 Weeks',
          focus: 'Master Java OOP & Collections Framework',
          keyDeliverables: ['Complete 25 OOP exercises', 'Build CLI Banking Simulator'],
        },
        {
          phase: 'Phase 2: Algorithmic Problem Solving',
          duration: '10 Weeks',
          focus: 'Solve LeetCode patterns frequently asked by Microsoft',
          keyDeliverables: ['75 LeetCode Easy/Medium problems', 'Conquer Recursion bottleneck'],
        },
        {
          phase: 'Phase 3: Flagship Project & Interview Loops',
          duration: '6 Weeks',
          focus: 'Build resume differentiator and practice STAR stories',
          keyDeliverables: ['Deploy Distributed Cache project', 'Perform 3 peer mock interviews'],
        },
      ],
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (err) {
    console.error('Reverse engineer error:', err);
    throw err;
  }
}

export async function handleGenerateQuiz(topicTitle: string, userLevel: string) {
  const prompt = `
Generate 3 high-yield multiple-choice questions to test an engineering student's mastery of the topic: "${topicTitle}".
Student Level: "${userLevel}".
Return STRICT JSON format:
{
  "questions": [
    {
      "id": "q-1",
      "question": "Clear technical question...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear educational explanation of why this answer is correct and why common misconceptions are wrong."
    }
  ]
}
`;

  if (!ai) {
    return {
      questions: [
        {
          id: 'q-default-1',
          question: `What is the primary conceptual principle behind ${topicTitle}?`,
          options: [
            'Decomposing state into reusable and isolated logical components',
            'Maximizing execution memory at runtime',
            'Avoiding all function calls',
            'Forcing all variables to be global',
          ],
          correctIndex: 0,
          explanation: 'Clean software engineering models isolate state and encapsulate concerns to prevent regressions and enable scale.',
        },
        {
          id: 'q-default-2',
          question: `In a timed coding interview for ${topicTitle}, what is the first step you should take?`,
          options: [
            'Clarify input constraints, edge cases (null/empty), and discuss expected time/space complexity',
            'Immediately write the code without speaking',
            'Copy code from memory without verifying bounds',
            'Assume the input is always sorted and non-empty',
          ],
          correctIndex: 0,
          explanation: 'Interviewers look for communicative engineers who clarify constraints and state complexity assumptions up front.',
        },
      ],
    };
  }

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });
    return JSON.parse(res.text || '{"questions":[]}');
  } catch (err) {
    console.error('Quiz generation error:', err);
    return { questions: [] };
  }
}

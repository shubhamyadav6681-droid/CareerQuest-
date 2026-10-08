import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { InteractiveCareerMap } from './components/InteractiveCareerMap';
import { MySkillsView } from './components/MySkillsView';
import { MultimodalMentor } from './components/MultimodalMentor';
import { DreamJobReverseEngineer } from './components/DreamJobReverseEngineer';
import { DailySprintTracker } from './components/DailySprintTracker';
import { ProfileView } from './components/ProfileView';
import { NodeDrawer } from './components/NodeDrawer';
import { OnboardingModal } from './components/OnboardingModal';

import {
  StudentProfile,
  RoadmapNode,
  NodeStatus,
  DailySprint,
  ReverseEngineeringAnalysis,
  GranularTopic,
  TopicStatus,
  NodeCategory,
} from './types/career';
import { DEFAULT_STUDENT_PROFILE } from './data/defaultProfile';
import { INITIAL_ROADMAP_NODES } from './data/defaultRoadmaps';
import { INITIAL_GRANULAR_TOPICS } from './data/granularSkills';
import { getRecommendedRevisionNodes } from './utils/revisionChecker';

const STORAGE_KEYS = {
  PROFILE: 'careerquest_profile_v1',
  NODES: 'careerquest_nodes_v1',
  TOPICS: 'careerquest_topics_v1',
  SPRINT: 'careerquest_sprint_v1',
  STREAK: 'careerquest_streak_v1',
};

export default function App() {
  // Load saved state or default
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
    } catch {
      return DEFAULT_STUDENT_PROFILE;
    }
  });

  const [nodes, setNodes] = useState<RoadmapNode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NODES);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure lastRevisedDate from initial dataset is retained if missing from older cached storage
        return parsed.map((p: RoadmapNode) => {
          const init = INITIAL_ROADMAP_NODES.find((i) => i.id === p.id);
          if (init && !p.lastRevisedDate && init.lastRevisedDate) {
            return { ...p, lastRevisedDate: init.lastRevisedDate };
          }
          return p;
        });
      }
      return INITIAL_ROADMAP_NODES;
    } catch {
      return INITIAL_ROADMAP_NODES;
    }
  });

  const [granularTopics, setGranularTopics] = useState<GranularTopic[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOPICS);
      return saved ? JSON.parse(saved) : INITIAL_GRANULAR_TOPICS;
    } catch {
      return INITIAL_GRANULAR_TOPICS;
    }
  });

  const [activeTab, setActiveTab] = useState<
    'map' | 'skills' | 'mentor' | 'reverse-engineer' | 'sprint' | 'profile'
  >('map');
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [mentorInitialPrompt, setMentorInitialPrompt] = useState<string | undefined>(undefined);
  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
      return saved ? parseInt(saved, 10) : 4;
    } catch {
      return 4;
    }
  });

  // Daily Sprint State
  const [sprint, setSprint] = useState<DailySprint>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPRINT);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
      totalStudyMinutes: 120, // 2 hours based on Rahul's profile
      motivationalQuote:
        'Consistency is what turns average effort into Big Tech offers. 2 hours of deliberate practice every day compounds massively.',
      completedCount: 1,
      tasks: [
        {
          id: 't-1',
          title: 'Java Strings: Master String Constant Pool (SCP) immutability & StringBuilder',
          category: 'language',
          durationMinutes: 45,
          completed: false,
        },
        {
          id: 't-2',
          title: 'DSA Practice: Two Pointers opposite-direction scan on sorted arrays',
          category: 'dsa',
          durationMinutes: 45,
          completed: false,
        },
        {
          id: 't-3',
          title: 'CS Core: Process vs Thread context switching memory structures in OS',
          category: 'cs-core',
          durationMinutes: 30,
          completed: true,
        },
      ],
    };
  });

  // Save to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(nodes));
    } catch (e) {}
  }, [nodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(granularTopics));
    } catch (e) {}
  }, [granularTopics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPRINT, JSON.stringify(sprint));
    } catch (e) {}
  }, [sprint]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, streakDays.toString());
    } catch (e) {}
  }, [streakDays]);

  // Dynamic Overall Match Readiness Score (Calculated across nodes and granular skills)
  const readinessScore = useMemo(() => {
    let completedPoints = 0;
    let totalPoints = 0;

    nodes.forEach((n) => {
      const weight = n.importance === 'Target-Critical' ? 3 : n.importance === 'High-Yield' ? 2 : 1;
      totalPoints += weight;
      if (n.status === 'completed') {
        completedPoints += weight;
      } else if (n.status === 'current') {
        completedPoints += weight * 0.45;
      } else if (n.status === 'needs-improvement') {
        completedPoints += weight * 0.25;
      }
    });

    if (totalPoints === 0) return 42;
    return Math.min(Math.round((completedPoints / totalPoints) * 100), 98);
  }, [nodes]);

  // Automated Revision Alert Detection (Spaced Repetition engine)
  const revisionAlertNodes = useMemo(() => {
    return getRecommendedRevisionNodes(nodes);
  }, [nodes]);

  // Mark node revised today (updates lastRevisedDate to today and bumps mastery score)
  const handleMarkNodeRevised = (nodeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const updated: RoadmapNode = {
            ...n,
            lastRevisedDate: today,
            masteryScore: Math.min(100, (n.masteryScore || 60) + 15),
          };
          if (selectedNode && selectedNode.id === nodeId) {
            setSelectedNode(updated);
          }
          return updated;
        }
        return n;
      })
    );
  };

  // Add revision task to today's sprint
  const handleAddRevisionTaskToSprint = (node: RoadmapNode) => {
    handleAddTaskToSprint(`[Revision] ${node.title} (Spaced Practice)`, 30);
    setActiveTab('sprint');
  };

  // Update granular topic in memory
  const handleUpdateGranularTopic = (topicId: string, updates: Partial<GranularTopic>) => {
    setGranularTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const updated = { ...t, ...updates };

          // If marked completed, check if corresponding RoadmapNode should update
          if (updates.status === 'COMPLETED' || updates.status === 'MASTERED') {
            if (t.parentNodeId) {
              // check if all subtopics for this node are done
              const siblings = prev.filter(
                (s) => s.parentNodeId === t.parentNodeId && s.id !== topicId
              );
              const allDone = siblings.every(
                (s) => s.status === 'COMPLETED' || s.status === 'MASTERED'
              );
              if (allDone) {
                handleUpdateNodeStatus(t.parentNodeId, 'completed', 90);
              }
            }
          }

          return updated;
        }
        return t;
      })
    );
  };

  // Add custom topic/skill into granular memory
  const handleAddCustomTopic = (newTopic: Partial<GranularTopic>) => {
    const id = `custom-topic-${Date.now()}`;
    const topic: GranularTopic = {
      id,
      name: newTopic.name || 'Custom Skill',
      parentSkill: newTopic.parentSkill || 'Java',
      status: newTopicStatus(newTopic.status),
      progressPercent: newTopic.progressPercent || (newTopic.status === 'COMPLETED' ? 100 : 50),
      completedDate: newTopic.completedDate,
      learnedNotes: newTopic.learnedNotes || 'Added by student to personalized profile memory.',
      importance: 'High-Yield',
    };

    setGranularTopics((prev) => [topic, ...prev]);

    // Also update known languages or skills if applicable
    if (newTopic.status === 'COMPLETED') {
      setProfile((prev) => {
        const skills = new Set(prev.technicalSkills);
        skills.add(topic.name);
        return {
          ...prev,
          technicalSkills: Array.from(skills),
        };
      });
    }
  };

  const newTopicStatus = (s?: TopicStatus): TopicStatus => {
    return s || 'COMPLETED';
  };

  // Toggle granular topic status directly
  const handleToggleGranularTopic = (topicId: string, status: TopicStatus) => {
    handleUpdateGranularTopic(topicId, {
      status,
      completedDate: status === 'COMPLETED' ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  // Dynamic roadmap node updater
  const handleUpdateNodeStatus = (
    nodeId: string,
    newStatus: NodeStatus,
    masteryScore?: number,
    learnedNotes?: string
  ) => {
    setNodes((prevNodes) => {
      return prevNodes.map((n) => {
        if (n.id === nodeId) {
          const updated: RoadmapNode = {
            ...n,
            status: newStatus,
            masteryScore: masteryScore !== undefined ? masteryScore : n.masteryScore,
            userLearnedNotes: learnedNotes !== undefined ? learnedNotes : n.userLearnedNotes,
            completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : n.completedDate,
            lastRevisedDate: new Date().toISOString().split('T')[0],
          };

          if (selectedNode && selectedNode.id === nodeId) {
            setSelectedNode(updated);
          }
          return updated;
        }

        // Adaptive unlocking rule: If parent node completed, unlock downstream locked children
        if (newStatus === 'completed' && n.parentId === nodeId && n.status === 'locked') {
          return { ...n, status: 'recommended' as NodeStatus };
        }

        return n;
      });
    });
  };

  // Quick toggle node status from canvas card
  const handleToggleNodeFromCanvas = (nodeId: string) => {
    const target = nodes.find((n) => n.id === nodeId);
    if (!target) return;
    const nextStatus: NodeStatus = target.status === 'completed' ? 'current' : 'completed';
    handleUpdateNodeStatus(nodeId, nextStatus, nextStatus === 'completed' ? 100 : 60);
  };

  // Recalculate Roadmap (Section 8L: Recalculate Roadmap)
  const handleRecalculateRoadmap = () => {
    // Re-evaluate unlock status based on completed nodes & prerequisites
    setNodes((prev) => {
      const completedNodeIds = new Set(
        prev.filter((n) => n.status === 'completed').map((n) => n.id)
      );

      return prev.map((node) => {
        if (node.status === 'completed') return node;

        const allPrereqsMet = node.prerequisites.every(
          (p) =>
            completedNodeIds.has(p) ||
            granularTopics.some(
              (g) => g.id === p && (g.status === 'COMPLETED' || g.status === 'MASTERED')
            )
        );

        if (allPrereqsMet && node.status === 'locked') {
          return { ...node, status: 'recommended' as NodeStatus };
        }

        return node;
      });
    });
  };

  // Reset progress to baseline
  const handleResetProgress = () => {
    if (window.confirm('Reset all progress back to initial default baseline?')) {
      localStorage.removeItem(STORAGE_KEYS.NODES);
      localStorage.removeItem(STORAGE_KEYS.TOPICS);
      localStorage.removeItem(STORAGE_KEYS.SPRINT);
      setNodes(INITIAL_ROADMAP_NODES);
      setGranularTopics(INITIAL_GRANULAR_TOPICS);
    }
  };

  // Add custom skill to Roadmap canvas (Section 8L)
  const handleAddCustomSkill = (skill: {
    title: string;
    category: NodeCategory;
    whyItMatters?: string;
  }) => {
    const newNodeId = `custom-skill-${Date.now()}`;
    const newNode: RoadmapNode = {
      id: newNodeId,
      title: skill.title,
      subtitle: `Custom Track Milestone (${skill.category})`,
      category: skill.category,
      status: 'current',
      level: 3,
      estimatedHours: 20,
      importance: 'High-Yield',
      prerequisites: [],
      whyItMatters: skill.whyItMatters || 'Custom roadmap milestone added by student.',
      whatToLearn: [
        `Core principles and implementation patterns of ${skill.title}`,
        'Writing clean, modular code following production standards',
        'Solving realistic interview questions and building a demo prototype',
      ],
      resources: [],
      practiceProblems: [],
      tags: ['Custom', skill.category],
      childrenIds: [],
    };

    setNodes((prev) => [newNode, ...prev]);

    // Also add to granular topics
    handleAddCustomTopic({
      name: skill.title,
      parentSkill: skill.category === 'language' ? 'Java' : skill.category === 'dsa' ? 'DSA' : 'CS Core',
      status: 'IN PROGRESS',
    });
  };

  // When AI Mentor or action button adds a topic
  const handleAddNodeToRoadmap = (
    topicName: string,
    category: 'dsa' | 'language' | 'cs-core' | 'project'
  ) => {
    handleAddCustomSkill({
      title: topicName,
      category,
      whyItMatters: `Diagnosed by AI Career Mentor based on your verified progress toward ${profile.targetCompany}.`,
    });
  };

  // Add task to daily sprint
  const handleAddTaskToSprint = (title: string, durationMinutes: number) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      category: 'dsa' as const,
      durationMinutes,
      completed: false,
    };
    setSprint((prev) => ({
      ...prev,
      totalStudyMinutes: prev.totalStudyMinutes + durationMinutes,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  // Toggle sprint task
  const handleToggleSprintTask = (taskId: string) => {
    setSprint((prev) => {
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const isNewlyDone = updatedTasks.find((t) => t.id === taskId)?.completed;
      if (isNewlyDone) {
        setStreakDays((s) => s + 1);
      }
      return {
        ...prev,
        tasks: updatedTasks,
        completedCount: updatedTasks.filter((t) => t.completed).length,
      };
    });
  };

  // Remove task from sprint
  const handleRemoveSprintTask = (taskId: string) => {
    setSprint((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  // Apply new Reverse-Engineering result into active student target & roadmap
  const handleApplyReverseEngineering = (analysis: ReverseEngineeringAnalysis) => {
    setProfile((prev) => ({
      ...prev,
      targetCompany: analysis.targetCompany,
      targetRole: analysis.targetRole,
    }));

    // Update target milestone node
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'target-msft-sde') {
          return {
            ...n,
            title: `🎯 ${analysis.targetRole} at ${analysis.targetCompany}`,
            subtitle: `Target Blueprint calibrated for ${analysis.targetCompany}`,
            whyItMatters: analysis.companyTierDescription,
          };
        }
        return n;
      })
    );
  };

  // Save profile from onboarding
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setSprint((prev) => ({
      ...prev,
      totalStudyMinutes: Math.round(newProfile.dailyStudyHours * 60),
    }));
  };

  // Launch mentor prompt from any component
  const handleOpenMentorWithPrompt = (prompt: string) => {
    setMentorInitialPrompt(prompt);
    setActiveTab('mentor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        readinessScore={readinessScore}
        streakDays={streakDays}
        revisionCount={revisionAlertNodes.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'map' && (
          <InteractiveCareerMap
            nodes={nodes}
            onSelectNode={(node) => setSelectedNode(node)}
            profile={profile}
            onOpenMentorPrompt={handleOpenMentorWithPrompt}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onAddCustomSkill={handleAddCustomSkill}
            onRecalculateRoadmap={handleRecalculateRoadmap}
            onResetProgress={handleResetProgress}
            onToggleNodeStatus={handleToggleNodeFromCanvas}
          />
        )}

        {activeTab === 'skills' && (
          <MySkillsView
            topics={granularTopics}
            profile={profile}
            onUpdateTopic={handleUpdateGranularTopic}
            onAddCustomTopic={handleAddCustomTopic}
            onAskMentorAboutTopic={(topic) => {
              handleOpenMentorWithPrompt(
                `Explain the topic "${topic.parentSkill}: ${topic.name}". I have it marked as ${topic.status}. What are the highest-yield interview questions on this for ${profile.targetCompany}?`
              );
            }}
          />
        )}

        {activeTab === 'mentor' && (
          <MultimodalMentor
            profile={profile}
            roadmapNodes={nodes}
            granularTopics={granularTopics}
            onAddNodeToRoadmap={handleAddNodeToRoadmap}
            onAddTaskToSprint={handleAddTaskToSprint}
            initialPrompt={mentorInitialPrompt}
            onClearInitialPrompt={() => setMentorInitialPrompt(undefined)}
          />
        )}

        {activeTab === 'reverse-engineer' && (
          <DreamJobReverseEngineer
            profile={profile}
            onApplyNewRoadmap={handleApplyReverseEngineering}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'sprint' && (
          <DailySprintTracker
            profile={profile}
            sprint={sprint}
            onToggleTask={handleToggleSprintTask}
            onAddTask={handleAddTaskToSprint}
            onRemoveTask={handleRemoveSprintTask}
            onOpenMentorPrompt={handleOpenMentorWithPrompt}
            roadmapNodes={nodes}
            onMarkNodeRevised={handleMarkNodeRevised}
            onAddRevisionTask={handleAddRevisionTaskToSprint}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            readinessScore={readinessScore}
          />
        )}
      </main>

      {/* Slide-out Deep-Dive Node Drawer */}
      <NodeDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdateStatus={handleUpdateNodeStatus}
        onAskMentorAboutNode={(node) => {
          setSelectedNode(null);
          handleOpenMentorWithPrompt(
            `Explain the topic "${node.title}" in depth. Why does ${profile.targetCompany} ask this in interviews, and what are the top 3 edge cases to know?`
          );
        }}
        granularTopics={granularTopics}
        onToggleGranularTopic={handleToggleGranularTopic}
      />

      {/* Multi-step Onboarding & Profile Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}

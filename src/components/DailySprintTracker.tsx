import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  Plus,
  Trash2,
  Brain,
  Check,
  Award,
  Zap,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { DailySprint, DailyTask, StudentProfile, RoadmapNode } from '../types/career';
import { getRecommendedRevisionNodes } from '../utils/revisionChecker';

interface WeeklyDayPlan {
  day: string;
  dateStr: string;
  topic: string;
  status: 'Completed' | 'In Progress' | 'Up Next' | 'Missed';
  tasks: string[];
}

interface DailySprintTrackerProps {
  profile: StudentProfile;
  sprint: DailySprint;
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, durationMinutes: number) => void;
  onRemoveTask: (taskId: string) => void;
  onOpenMentorPrompt: (prompt: string) => void;
  roadmapNodes?: RoadmapNode[];
  onMarkNodeRevised?: (nodeId: string) => void;
  onAddRevisionTask?: (node: RoadmapNode) => void;
}

export const DailySprintTracker: React.FC<DailySprintTrackerProps> = ({
  profile,
  sprint,
  onToggleTask,
  onAddTask,
  onRemoveTask,
  onOpenMentorPrompt,
  roadmapNodes = [],
  onMarkNodeRevised,
  onAddRevisionTask,
}) => {
  const [activeSprintTab, setActiveSprintTab] = useState<'daily' | 'weekly'>('daily');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('30');

  // Automated Revision Alert Detection (Spaced Repetition engine)
  const revisionAlertNodes = React.useMemo(() => {
    return getRecommendedRevisionNodes(roadmapNodes);
  }, [roadmapNodes]);

  // Pomodoro Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');

  // Weekly Plan State (Section 10)
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyDayPlan[]>([
    {
      day: 'Monday',
      dateStr: 'Oct 5',
      topic: 'Java Array Basics & Memory Allocation',
      status: 'Completed',
      tasks: ['Array declaration on Heap', 'O(1) indexing mechanics'],
    },
    {
      day: 'Tuesday',
      dateStr: 'Oct 6',
      topic: 'Array Traversal & Kadane Algorithm',
      status: 'Completed',
      tasks: ['Maximum Subarray Sum', 'Two Pointers opposite scan'],
    },
    {
      day: 'Wednesday',
      dateStr: 'Oct 7',
      topic: 'LeetCode Array Problems Practice',
      status: 'In Progress',
      tasks: ['Two Sum II', 'Move Zeroes'],
    },
    {
      day: 'Thursday',
      dateStr: 'Oct 8',
      topic: 'Java Strings & String Constant Pool',
      status: 'Up Next',
      tasks: ['SCP immutability reasons', 'String vs StringBuilder performance'],
    },
    {
      day: 'Friday',
      dateStr: 'Oct 9',
      topic: 'String Manipulation & Methods',
      status: 'Up Next',
      tasks: ['Anagrams checking', 'Substring frequency table'],
    },
    {
      day: 'Saturday',
      dateStr: 'Oct 10',
      topic: 'Practice Contest & Mini Assessment',
      status: 'Up Next',
      tasks: ['3 Timed LeetCode problems', 'Arrays & Strings Quiz'],
    },
    {
      day: 'Sunday',
      dateStr: 'Oct 11',
      topic: 'Weekly Revision & Retrospective',
      status: 'Up Next',
      tasks: ['Revision of weak concepts', 'Roadmap update for next week'],
    },
  ]);

  const [missedTasks, setMissedTasks] = useState<string[]>([
    'Matrix 2D Rotation (LeetCode Medium) — Missed during midterms revision',
  ]);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      if (timerMode === 'study') {
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('study');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, timerMode]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), parseInt(newTaskDuration) || 30);
    setNewTaskTitle('');
  };

  const completedCount = sprint.tasks.filter((t) => t.completed).length;
  const progressPercent = sprint.tasks.length
    ? Math.round((completedCount / sprint.tasks.length) * 100)
    : 0;

  // Rich task metadata helper (Topic, Difficulty, Reason, XP reward)
  const getTaskMeta = (task: DailyTask, idx: number) => {
    const metas = [
      {
        topic: 'Java Strings & Immutability',
        difficulty: 'Medium',
        reason: 'SCP & StringBuilder tested in 70% of Big Tech phone screens',
        xp: '+50 XP',
      },
      {
        topic: 'DSA: Two Pointers Practice',
        difficulty: 'Medium',
        reason: 'Foundational pattern for LeetCode arrays and strings',
        xp: '+45 XP',
      },
      {
        topic: 'CS Core: Virtual Memory & Threads',
        difficulty: 'Foundational',
        reason: 'Microsoft OS fundamentals evaluation benchmark',
        xp: '+30 XP',
      },
      {
        topic: 'Coding Practice & Edge Cases',
        difficulty: 'Practice',
        reason: 'Reinforce hands-on memory and syntax speed',
        xp: '+35 XP',
      },
    ];
    return metas[idx % metas.length];
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                Personalized Study System
              </span>
              {revisionAlertNodes.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30 animate-pulse">
                  <AlertCircle className="h-3 w-3 text-amber-400" />
                  {revisionAlertNodes.length} Revision Due (&gt;30d &lt;80%)
                </span>
              )}
              <span className="text-xs text-slate-400">{sprint.date}</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-white">
              {activeSprintTab === 'daily'
                ? `Today's ${profile.dailyStudyHours}-Hour Target Sprint`
                : `Weekly 7-Day Goal Timeline`}
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Calibrated for <b className="text-white">{profile.name}</b> targeting{' '}
              <span className="text-cyan-300 font-semibold">{profile.targetRole} @ {profile.targetCompany}</span>.
            </p>
          </div>

          {/* Toggle between Daily & Weekly view */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/90 p-1">
            <button
              onClick={() => setActiveSprintTab('daily')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeSprintTab === 'daily'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today's Plan
            </button>
            <button
              onClick={() => setActiveSprintTab('weekly')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeSprintTab === 'weekly'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly Goal
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 border-t border-slate-800/80 pt-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">
              Daily Sprint Velocity: {completedCount} / {sprint.tasks.length} Completed
            </span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Automated Revision Check Notification (User Request 6 requirement) */}
      {revisionAlertNodes.length > 0 && (
        <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-slate-900/95 to-slate-950 p-5 shadow-xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
                <AlertCircle className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    Automated Revision Notification ({revisionAlertNodes.length} Topics Recommended)
                  </h3>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    Spaced Repetition Check
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Automated check detected topics where <span className="text-amber-200 font-semibold">last revised date is older than 30 days</span> and <span className="text-rose-300 font-semibold">mastery score is below 80%</span>.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              Action Required
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {revisionAlertNodes.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between rounded-2xl border border-amber-500/30 bg-slate-950/80 p-4 hover:border-amber-400/50 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs text-white leading-snug">{rev.title}</h4>
                    <span className="shrink-0 rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-rose-300 border border-rose-500/30">
                      {rev.masteryScore}% score
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Last revised <span className="font-bold text-amber-300">{rev.daysAgo} days ago</span> (Threshold: 30d)
                  </p>
                  <p className="mt-1.5 text-[10px] text-slate-300 leading-relaxed line-clamp-2">
                    {rev.whyItMatters}
                  </p>
                </div>

                <div className="mt-3.5 flex items-center gap-1.5 pt-2.5 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      if (onAddRevisionTask) {
                        onAddRevisionTask(rev);
                      } else {
                        onAddTask(`[Revision] ${rev.title} (Spaced Practice)`, 30);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-2 py-1.5 text-[11px] font-bold text-white shadow transition-colors"
                    title="Add 30-min focused revision block to today's sprint"
                  >
                    <Plus className="h-3 w-3" /> Add to Sprint
                  </button>

                  <button
                    onClick={() =>
                      onOpenMentorPrompt(
                        `I need to revise "${rev.title}". It was last revised ${rev.daysAgo} days ago and my current mastery score is ${rev.masteryScore}%. What are the 3 most critical points and 1 practice exercise I must master today?`
                      )
                    }
                    className="flex items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-950/50 hover:bg-indigo-900/60 p-1.5 text-indigo-300 transition-colors"
                    title="Revise with AI Mentor"
                  >
                    <Brain className="h-3.5 w-3.5" />
                  </button>

                  {onMarkNodeRevised && (
                    <button
                      onClick={() => onMarkNodeRevised(rev.id)}
                      className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-emerald-950 hover:border-emerald-500/50 hover:text-emerald-300 p-1.5 text-slate-300 transition-colors"
                      title="Mark as revised today (clears this alert)"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAILY VIEW */}
      {activeSprintTab === 'daily' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left 2 Cols: Today's Tasks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Today's Focus Tasks (120 Mins Total)</h3>
              <span className="text-xs text-slate-400">Total: {sprint.totalStudyMinutes} mins scheduled</span>
            </div>

            {/* Task List with Topic, Estimated Time, Difficulty, Reason, XP */}
            <div className="space-y-3">
              {sprint.tasks.map((task, idx) => {
                const meta = getTaskMeta(task, idx);
                return (
                  <div
                    key={task.id}
                    className={`group rounded-2xl border p-4 transition-all ${
                      task.completed
                        ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-400'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                            task.completed
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-slate-600 bg-slate-950 hover:border-indigo-400'
                          }`}
                        >
                          {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </button>

                        <div>
                          <p
                            className={`text-sm font-semibold transition-all ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                            }`}
                          >
                            {task.title}
                          </p>

                          {/* Task Metadata: Estimated time, Difficulty, Reason, XP (Section 9) */}
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="flex items-center gap-1 font-semibold text-slate-300">
                              <Clock className="h-3 w-3 text-indigo-400" />
                              {task.durationMinutes} min
                            </span>
                            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">
                              {meta.difficulty}
                            </span>
                            {task.title.includes('[Revision]') && (
                              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                                Spaced Revision
                              </span>
                            )}
                            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                              {meta.xp}
                            </span>
                          </div>

                          <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                            <span className="text-slate-500 font-medium">Why today:</span> {meta.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            onOpenMentorPrompt(
                              `Explain this study task step by step: "${task.title}". What is the core concept and 1 code example?`
                            )
                          }
                          className="rounded-lg p-1.5 text-xs text-indigo-400 hover:bg-slate-800 transition-colors"
                          title="Ask AI Mentor about this task"
                        >
                          <Brain className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRemoveTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-xs text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add custom task form */}
            <form
              onSubmit={handleCreateTask}
              className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-2.5"
            >
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add custom task (e.g. Solve 2 Two Sum variations)..."
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <select
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
              </select>
              <button
                type="submit"
                className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" /> Add Task
              </button>
            </form>
          </div>

          {/* Right Col: Built-in Pomodoro Focus Timer */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-center shadow-xl">
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                    timerMode === 'study'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {timerMode === 'study' ? 'Deep Focus Session' : 'Quick Rest Break'}
                </span>
              </div>

              {/* Timer Digits */}
              <div className="my-6">
                <span className="font-mono text-5xl font-extrabold tracking-tight text-white">
                  {formatTimer(timerSeconds)}
                </span>
                <p className="mt-1 text-xs text-slate-400">
                  {timerMode === 'study' ? 'Stay in the flow' : 'Rest your eyes'}
                </p>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all ${
                    timerRunning
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110 shadow-indigo-500/25'
                  }`}
                >
                  {timerRunning ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-white" /> Start Focus
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white"
                  title="Reset Timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
              <span className="font-bold text-indigo-400">Daily Mentor Insight:</span>
              <p className="mt-1 leading-relaxed italic text-slate-300">"{sprint.motivationalQuote}"</p>
            </div>
          </div>
        </div>
      ) : (
        /* WEEKLY VIEW (Section 10: Weekly Goal System) */
        <div className="space-y-6">
          {/* Missed Tasks Banner with Reschedule Actions */}
          {missedTasks.length > 0 && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <span>Missed Tasks (No shame — let’s adjust your path!)</span>
              </div>
              <div className="space-y-2">
                {missedTasks.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-amber-500/20 bg-slate-950/70 p-3 text-xs"
                  >
                    <span className="text-slate-200">{m}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onAddTask('Matrix 2D Rotation (LeetCode)', 45);
                          setMissedTasks([]);
                        }}
                        className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-500"
                      >
                        Add to Tomorrow
                      </button>
                      <button
                        onClick={() => {
                          onOpenMentorPrompt(
                            'I missed a study day. Can you rebuild my week so I stay on track without burnout?'
                          );
                        }}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white"
                      >
                        Rebuild My Week
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-Day Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyPlan.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-indigo-400 uppercase">{item.day}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                        item.status === 'Completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : item.status === 'In Progress'
                          ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700/50'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-white">{item.topic}</h4>

                  <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                    {item.tasks.map((t, tIdx) => (
                      <li key={tIdx} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-slate-500" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{item.dateStr}</span>
                  <button
                    onClick={() =>
                      onOpenMentorPrompt(`Guide me through the weekly goal for ${item.day}: ${item.topic}`)
                    }
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Study Plan &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

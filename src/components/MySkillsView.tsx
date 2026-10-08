import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Lock,
  Search,
  Filter,
  Sparkles,
  RotateCcw,
  Plus,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  TrendingUp,
  Brain,
  FileEdit,
  Flame,
  ArrowRight,
  Target,
  Code2,
  Server,
  Database,
  Layers,
} from 'lucide-react';
import { GranularTopic, TopicStatus, StudentProfile } from '../types/career';
import { getSkillSummaries, calculateOverallProgressMetrics } from '../data/granularSkills';

interface MySkillsViewProps {
  topics: GranularTopic[];
  profile: StudentProfile;
  onUpdateTopic: (topicId: string, updates: Partial<GranularTopic>) => void;
  onAddCustomTopic: (newTopic: Partial<GranularTopic>) => void;
  onAskMentorAboutTopic: (topic: GranularTopic) => void;
}

export const MySkillsView: React.FC<MySkillsViewProps> = ({
  topics,
  profile,
  onUpdateTopic,
  onAddCustomTopic,
  onAskMentorAboutTopic,
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTopic, setEditingTopic] = useState<GranularTopic | null>(null);

  // Modal / Drawer state for updating learning notes
  const [notesInput, setNotesInput] = useState('');
  const [statusSelect, setStatusSelect] = useState<TopicStatus>('COMPLETED');
  const [progressInput, setProgressInput] = useState<number>(50);

  // New Custom Topic Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicSkill, setNewTopicSkill] = useState('Java');
  const [newTopicStatus, setNewTopicStatus] = useState<TopicStatus>('COMPLETED');

  // Compute skill summaries & metrics
  const summaries = useMemo(() => getSkillSummaries(topics), [topics]);
  const metrics = useMemo(() => calculateOverallProgressMetrics(topics), [topics]);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchSkill = selectedSkillFilter === 'all' || t.parentSkill === selectedSkillFilter;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.parentSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.learnedNotes && t.learnedNotes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSkill && matchStatus && matchSearch;
    });
  }, [topics, selectedSkillFilter, statusFilter, searchQuery]);

  // Open edit drawer
  const handleOpenEdit = (topic: GranularTopic) => {
    setEditingTopic(topic);
    setNotesInput(topic.learnedNotes || '');
    setStatusSelect(topic.status);
    setProgressInput(topic.progressPercent || 50);
  };

  // Save topic updates
  const handleSaveTopicUpdate = () => {
    if (!editingTopic) return;

    const updates: Partial<GranularTopic> = {
      status: statusSelect,
      learnedNotes: notesInput.trim(),
      progressPercent: statusSelect === 'IN PROGRESS' ? progressInput : statusSelect === 'COMPLETED' || statusSelect === 'MASTERED' ? 100 : 0,
      lastRevisedDate: new Date().toISOString().split('T')[0],
    };

    if (statusSelect === 'COMPLETED' && !editingTopic.completedDate) {
      updates.completedDate = new Date().toISOString().split('T')[0];
    }

    if (statusSelect === 'MASTERED') {
      updates.assessmentScore = Math.max(editingTopic.assessmentScore || 85, 90);
      updates.practiceAccuracy = Math.max(editingTopic.practiceAccuracy || 85, 90);
    }

    onUpdateTopic(editingTopic.id, updates);
    setEditingTopic(null);
  };

  // Handle adding a custom topic/skill
  const handleCreateCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    onAddCustomTopic({
      name: newTopicName.trim(),
      parentSkill: newTopicSkill,
      status: newTopicStatus,
      completedDate: newTopicStatus === 'COMPLETED' ? new Date().toISOString().split('T')[0] : undefined,
      progressPercent: newTopicStatus === 'IN PROGRESS' ? 50 : newTopicStatus === 'COMPLETED' ? 100 : 0,
    });

    setNewTopicName('');
    setIsAddModalOpen(false);
  };

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
          label: 'Completed ✓',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
      case 'MASTERED':
        return {
          icon: <Award className="h-3.5 w-3.5 text-amber-400" />,
          label: 'Mastered 🏆',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30',
        };
      case 'IN PROGRESS':
        return {
          icon: <Clock className="h-3.5 w-3.5 text-blue-400 animate-spin-slow" />,
          label: 'In Progress ⏳',
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        };
      case 'NEEDS REVISION':
        return {
          icon: <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />,
          label: 'Needs Revision ⚠️',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold',
        };
      case 'LOCKED':
        return {
          icon: <Lock className="h-3.5 w-3.5 text-slate-500" />,
          label: 'Locked 🔒',
          badge: 'bg-slate-800 text-slate-400 border-slate-700/50',
        };
      case 'NOT STARTED':
      default:
        return {
          icon: <span className="h-2 w-2 rounded-full border border-slate-400" />,
          label: 'Not Started ○',
          badge: 'bg-slate-800/80 text-slate-300 border-slate-700/40',
        };
    }
  };

  // Flag topics requiring revision (low accuracy or needs revision)
  const revisionAlerts = useMemo(() => {
    return topics.filter(
      (t) =>
        t.status === 'NEEDS REVISION' ||
        (t.status === 'COMPLETED' && t.practiceAccuracy !== undefined && t.practiceAccuracy < 65)
    );
  }, [topics]);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner with Multi-Level Progress Percentage Cards */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Granular Learning Progress Tracker
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Skills & Completed Topic Memory
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
              CareerQuest records every single concept you conquer. The AI uses this permanent memory to bypass
              topics you already know and pinpoint the exact prerequisite to tackle next.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Add Skill / Topic
            </button>
          </div>
        </div>

        {/* Multi-Level Progress Rings / Bars */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 border-t border-slate-800/80 pt-6">
          {/* Overall Tech Progress */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Overall Tech</span>
            <div className="my-1.5 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-extrabold text-white">{metrics.overallTechPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                style={{ width: `${metrics.overallTechPercent}%` }}
              />
            </div>
          </div>

          {/* Target Career Progress */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-3.5 text-center ring-1 ring-indigo-500/20">
            <span className="text-[11px] font-bold text-indigo-300 uppercase">Target Readiness</span>
            <div className="my-1.5 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-extrabold text-cyan-300">{metrics.targetCareerPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: `${metrics.targetCareerPercent}%` }}
              />
            </div>
          </div>

          {/* Java Progress */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
            <span className="text-[11px] font-bold text-cyan-400 uppercase">Java</span>
            <div className="my-1.5 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-extrabold text-white">{metrics.javaPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${metrics.javaPercent}%` }}
              />
            </div>
          </div>

          {/* DSA Progress */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
            <span className="text-[11px] font-bold text-indigo-400 uppercase">DSA</span>
            <div className="my-1.5 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-extrabold text-white">{metrics.dsaPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-400"
                style={{ width: `${metrics.dsaPercent}%` }}
              />
            </div>
          </div>

          {/* DBMS Progress */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
            <span className="text-[11px] font-bold text-purple-400 uppercase">DBMS</span>
            <div className="my-1.5 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-extrabold text-white">{metrics.dbmsPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-purple-400"
                style={{ width: `${metrics.dbmsPercent}%` }}
              />
            </div>
          </div>

          {/* OS Progress */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-center">
            <span className="text-[11px] font-bold text-teal-400 uppercase">OS & Networks</span>
            <div className="my-1.5 flex items-baseline justify-center gap-1">
              <span className="text-2xl font-extrabold text-white">{metrics.osPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-teal-400"
                style={{ width: `${metrics.osPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Revision Alerts Section (Section 8H: Completed does not always mean permanently mastered) */}
      {revisionAlerts.length > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <span>AI Revision Diagnostics ({revisionAlerts.length} topics flagged)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {revisionAlerts.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl border border-rose-500/20 bg-slate-950/80 p-3.5 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rev.parentSkill}: {rev.name}</span>
                    <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] text-rose-300 font-semibold">
                      {rev.status === 'NEEDS REVISION' ? 'Diagnostic Gap' : `Accuracy: ${rev.practiceAccuracy}%`}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    {rev.name === 'Arrays'
                      ? 'Completed earlier with 58% practice accuracy. A quick 15-min drill is recommended.'
                      : rev.name === 'Recursion & Call Stack'
                      ? 'Assessment score was 42%. Call stack tree induction requires structured review.'
                      : 'Time elapsed since last practice. Revise to maintain Big Tech interview readiness.'}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => onAskMentorAboutTopic(rev)}
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow"
                  >
                    Revise with AI
                  </button>
                  <button
                    onClick={() => onUpdateTopic(rev.id, { status: 'IN PROGRESS', practiceAccuracy: 75 })}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
                  >
                    Mark In Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        {/* Skill Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedSkillFilter('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedSkillFilter === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Skills ({topics.length})
          </button>
          {summaries.map((s) => (
            <button
              key={s.skillName}
              onClick={() => setSelectedSkillFilter(s.skillName)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedSkillFilter === s.skillName
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s.skillName} ({s.completedCount}/{s.totalCount})
            </button>
          ))}
        </div>

        {/* Status Dropdown & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter topics..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Status: All</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="NEEDS REVISION">Needs Revision</option>
            <option value="MASTERED">Mastered</option>
            <option value="LOCKED">Locked</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Skill Cards & Granular Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaries
          .filter((s) => selectedSkillFilter === 'all' || s.skillName === selectedSkillFilter)
          .map((summary) => {
            const skillTopics = filteredTopics.filter((t) => t.parentSkill === summary.skillName);
            if (skillTopics.length === 0 && searchQuery) return null;

            return (
              <div
                key={summary.skillName}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Skill Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-indigo-400 border border-slate-700">
                        {summary.skillName === 'Java' && <Code2 className="h-5 w-5 text-cyan-400" />}
                        {summary.skillName === 'DSA' && <Brain className="h-5 w-5 text-indigo-400" />}
                        {summary.skillName === 'DBMS' && <Database className="h-5 w-5 text-purple-400" />}
                        {summary.skillName === 'Operating Systems' && <Server className="h-5 w-5 text-teal-400" />}
                        {summary.skillName === 'Computer Networks' && <Layers className="h-5 w-5 text-amber-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white">{summary.skillName}</h3>
                        <p className="text-[11px] text-slate-400">
                          {summary.completedCount} / {summary.totalCount} completed
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-extrabold text-cyan-300">
                        {summary.progressPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Topic Checkbox List (Smallest useful learning level) */}
                  <div className="mt-4 space-y-2">
                    {skillTopics.map((topic) => {
                      const badge = getStatusBadge(topic.status);
                      return (
                        <div
                          key={topic.id}
                          onClick={() => handleOpenEdit(topic)}
                          className="group flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 text-xs transition-all hover:border-indigo-500/40 hover:bg-slate-900/90 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStatus: TopicStatus =
                                  topic.status === 'COMPLETED' ? 'IN PROGRESS' : 'COMPLETED';
                                onUpdateTopic(topic.id, {
                                  status: nextStatus,
                                  completedDate: nextStatus === 'COMPLETED' ? new Date().toISOString().split('T')[0] : undefined,
                                });
                              }}
                              className="shrink-0 p-0.5 rounded hover:bg-slate-800"
                              title="Toggle completed"
                            >
                              {badge.icon}
                            </button>

                            <div>
                              <span
                                className={`font-semibold transition-colors ${
                                  topic.status === 'COMPLETED' || topic.status === 'MASTERED'
                                    ? 'text-slate-200'
                                    : topic.status === 'NEEDS REVISION'
                                    ? 'text-rose-300'
                                    : 'text-slate-300'
                                }`}
                              >
                                {topic.name}
                              </span>
                              {topic.learnedNotes && (
                                <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                                  "{topic.learnedNotes}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${badge.badge}`}
                            >
                              {topic.status === 'IN PROGRESS' && topic.progressPercent
                                ? `${topic.progressPercent}%`
                                : badge.label}
                            </span>
                            <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Edit / Deep-Dive Topic Drawer */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 uppercase">
                  {editingTopic.parentSkill}
                </span>
                <h3 className="mt-1.5 text-lg font-bold text-white">{editingTopic.name}</h3>
                <p className="text-xs text-slate-400">
                  Update your learning status, quiz score, and personal notes.
                </p>
              </div>
              <button
                onClick={() => setEditingTopic(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Status Picker Buttons */}
              <div>
                <label className="font-semibold text-slate-300">Set Current Status</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { val: 'COMPLETED', label: '✓ Completed' },
                    { val: 'IN PROGRESS', label: '⏳ In Progress' },
                    { val: 'NEEDS REVISION', label: '⚠️ Need Revision' },
                    { val: 'MASTERED', label: '🏆 Mastered' },
                    { val: 'NOT STARTED', label: '○ Not Started' },
                    { val: 'LOCKED', label: '🔒 Locked' },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setStatusSelect(s.val as TopicStatus)}
                      className={`rounded-xl border p-2 text-center font-semibold transition-all ${
                        statusSelect === s.val
                          ? 'border-indigo-500 bg-indigo-950/60 text-white ring-1 ring-indigo-500/40'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Slider if In Progress */}
              {statusSelect === 'IN PROGRESS' && (
                <div>
                  <div className="flex items-center justify-between text-slate-300 font-semibold">
                    <span>In-Progress Percentage</span>
                    <span className="text-cyan-300">{progressInput}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={progressInput}
                    onChange={(e) => setProgressInput(parseInt(e.target.value))}
                    className="mt-2 w-full cursor-pointer accent-indigo-500"
                  />
                </div>
              )}

              {/* Add What I Learned (Section 8D) */}
              <div>
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileEdit className="h-3.5 w-3.5 text-indigo-400" />
                  What I Learned / Personal Revision Notes
                </label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={3}
                  placeholder="e.g. I learned array declaration, indexing, memory traversal and basic LeetCode two pointers..."
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Progress History Box (Section 8I) */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-white uppercase text-[10px]">Verified History:</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Completed Date:</span>
                  <span>{editingTopic.completedDate || 'Not yet recorded'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Revised:</span>
                  <span>{editingTopic.lastRevisedDate || 'None'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assessment Score:</span>
                  <span>{editingTopic.assessmentScore ? `${editingTopic.assessmentScore}%` : 'Not taken'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Practice Accuracy:</span>
                  <span>{editingTopic.practiceAccuracy ? `${editingTopic.practiceAccuracy}%` : 'Not tracked'}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => {
                  onAskMentorAboutTopic(editingTopic);
                  setEditingTopic(null);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <Brain className="h-3.5 w-3.5" /> Ask Mentor About This
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTopicUpdate}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-1.5 text-xs font-bold text-white shadow hover:brightness-110"
                >
                  Save Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Topic Modal (Section 8L: Editable Career Roadmap) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Add Custom Skill or Topic</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomTopic} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Topic / Skill Name</label>
                <input
                  type="text"
                  required
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="e.g. React.js, Python, or Redis Caching"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Category / Track</label>
                <select
                  value={newTopicSkill}
                  onChange={(e) => setNewTopicSkill(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Java">Java</option>
                  <option value="DSA">DSA</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Web Development">Web Development</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Current Status</label>
                <select
                  value={newTopicStatus}
                  onChange={(e) => setNewTopicStatus(e.target.value as TopicStatus)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="COMPLETED">Completed ✓ (I already know this)</option>
                  <option value="IN PROGRESS">In Progress ⏳</option>
                  <option value="NOT STARTED">Not Started ○</option>
                </select>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

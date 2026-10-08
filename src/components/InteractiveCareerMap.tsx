import React, { useState, useRef, useMemo } from 'react';
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Code,
  Brain,
  Server,
  FolderGit2,
  Trophy,
  AlertCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  Zap,
  Plus,
  RefreshCw,
  Edit3,
  Check,
  X,
} from 'lucide-react';
import { RoadmapNode, NodeStatus, NodeCategory, StudentProfile } from '../types/career';
import { checkNeedsRevision } from '../utils/revisionChecker';

interface InteractiveCareerMapProps {
  nodes: RoadmapNode[];
  onSelectNode: (node: RoadmapNode) => void;
  profile: StudentProfile;
  onOpenMentorPrompt: (prompt: string) => void;
  onOpenOnboarding: () => void;
  onAddCustomSkill?: (skill: { title: string; category: NodeCategory; whyItMatters?: string }) => void;
  onRecalculateRoadmap?: () => void;
  onResetProgress?: () => void;
  onToggleNodeStatus?: (nodeId: string) => void;
}

export const InteractiveCareerMap: React.FC<InteractiveCareerMapProps> = ({
  nodes,
  onSelectNode,
  profile,
  onOpenMentorPrompt,
  onOpenOnboarding,
  onAddCustomSkill,
  onRecalculateRoadmap,
  onResetProgress,
  onToggleNodeStatus,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Add skill modal
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<NodeCategory>('language');
  const [newSkillWhy, setNewSkillWhy] = useState('');
  const [recalculatingAnimation, setRecalculatingAnimation] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Group nodes by levels or categories for visual layout
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch =
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (node.subtitle && node.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || node.category === selectedCategory;

      const matchesStatus =
        selectedStatusFilter === 'all'
          ? true
          : selectedStatusFilter === 'revision-needed'
          ? checkNeedsRevision(node).isRecommended
          : node.status === selectedStatusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [nodes, searchQuery, selectedCategory, selectedStatusFilter]);

  // Node status styling config
  const getNodeColor = (status: NodeStatus) => {
    switch (status) {
      case 'completed':
        return {
          border: 'border-emerald-500/60 hover:border-emerald-400',
          bg: 'bg-emerald-950/40 hover:bg-emerald-950/60',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          glow: 'shadow-emerald-500/10',
          dot: 'bg-emerald-400',
          label: 'Completed ✓',
        };
      case 'current':
        return {
          border: 'border-blue-500/80 hover:border-blue-400 ring-2 ring-blue-500/30',
          bg: 'bg-blue-950/50 hover:bg-blue-950/70',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          glow: 'shadow-blue-500/25 shadow-lg',
          dot: 'bg-blue-400 animate-pulse',
          label: 'In Progress ⏳',
        };
      case 'needs-improvement':
        return {
          border: 'border-amber-500/70 hover:border-amber-400',
          bg: 'bg-amber-950/40 hover:bg-amber-950/60',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          glow: 'shadow-amber-500/15',
          dot: 'bg-amber-400',
          label: 'Need Revision ⚠️',
        };
      case 'critical-gap':
        return {
          border: 'border-rose-500/70 hover:border-rose-400',
          bg: 'bg-rose-950/40 hover:bg-rose-950/60',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          glow: 'shadow-rose-500/20',
          dot: 'bg-rose-400',
          label: 'Critical Gap',
        };
      case 'recommended':
        return {
          border: 'border-purple-500/70 hover:border-purple-400',
          bg: 'bg-purple-950/40 hover:bg-purple-950/60',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          glow: 'shadow-purple-500/20',
          dot: 'bg-purple-400',
          label: 'Recommended Next',
        };
      case 'locked':
      default:
        return {
          border: 'border-slate-800 hover:border-slate-700',
          bg: 'bg-slate-900/40 hover:bg-slate-900/60 opacity-65',
          badgeBg: 'bg-slate-800 text-slate-400 border-slate-700/60',
          glow: 'shadow-none',
          dot: 'bg-slate-500',
          label: 'Locked 🔒',
        };
    }
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Dragging handlers for canvas panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node-card')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Trigger recalculate animation
  const handleTriggerRecalculate = () => {
    setRecalculatingAnimation(true);
    if (onRecalculateRoadmap) onRecalculateRoadmap();
    setTimeout(() => setRecalculatingAnimation(false), 1200);
  };

  // Submit new skill
  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillTitle.trim()) return;
    if (onAddCustomSkill) {
      onAddCustomSkill({
        title: newSkillTitle.trim(),
        category: newSkillCategory,
        whyItMatters: newSkillWhy.trim() || `Added to customize ${profile.name}'s target roadmap.`,
      });
    }
    setNewSkillTitle('');
    setNewSkillWhy('');
    setIsAddSkillModalOpen(false);
  };

  // Counts for status overview
  const stats = useMemo(() => {
    let completed = 0;
    let current = 0;
    let needsImp = 0;
    let critical = 0;
    let revisionCount = 0;
    nodes.forEach((n) => {
      if (n.status === 'completed') completed++;
      else if (n.status === 'current') current++;
      else if (n.status === 'needs-improvement') needsImp++;
      else if (n.status === 'critical-gap') critical++;

      if (checkNeedsRevision(n).isRecommended) {
        revisionCount++;
      }
    });
    return { completed, current, needsImp, critical, revisionCount, total: nodes.length };
  }, [nodes]);

  // Partition nodes by track for structured hierarchical rendering
  const tracks = useMemo(() => {
    return [
      {
        id: 'language',
        title: 'Java Architecture & Core Track',
        desc: 'Syntax, OOP, Collections Framework & Multithreading',
        color: 'from-cyan-500/20 to-blue-500/5',
        nodes: filteredNodes.filter((n) => n.category === 'language'),
      },
      {
        id: 'dsa',
        title: 'Data Structures & Algorithms Engine',
        desc: 'Complexity, Two Pointers, Recursion, Trees, Graphs & DP',
        color: 'from-indigo-500/20 to-purple-500/5',
        nodes: filteredNodes.filter((n) => n.category === 'dsa'),
      },
      {
        id: 'cs-core',
        title: 'Computer Science Core Track',
        desc: 'Operating Systems, DBMS & Relational SQL, Computer Networks',
        color: 'from-purple-500/20 to-pink-500/5',
        nodes: filteredNodes.filter((n) => n.category === 'cs-core'),
      },
      {
        id: 'project',
        title: 'High-Impact Portfolio Projects',
        desc: 'Distributed In-Memory Cache with LRU & Production Deployments',
        color: 'from-teal-500/20 to-emerald-500/5',
        nodes: filteredNodes.filter((n) => n.category === 'project'),
      },
      {
        id: 'interview',
        title: 'Target Company Screening & Interview Mastery',
        desc: 'Online Assessment Speed Drills & STAR Behavioral Growth Mindset',
        color: 'from-amber-500/20 to-orange-500/5',
        nodes: filteredNodes.filter((n) => n.category === 'interview' || n.category === 'milestone'),
      },
    ].filter((t) => t.nodes.length > 0);
  }, [filteredNodes]);

  return (
    <div className="relative flex flex-col h-[calc(100vh-65px)] overflow-hidden bg-slate-950">
      {/* Dynamic Adaptation Notice Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-slate-950 px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-indigo-200">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <span>
            <strong className="text-white">Living Adaptive Roadmap Active:</strong> Tuned for{' '}
            <span className="font-semibold text-cyan-300">{profile.name}</span> ({profile.yearSemester},{' '}
            {profile.dailyStudyHours} hrs/day) aiming for{' '}
            <span className="font-semibold text-indigo-300">{profile.targetRole} @ {profile.targetCompany}</span>.
          </span>
        </div>

        {/* Section 8L: Roadmap Customization Controls */}
        <div className="flex items-center gap-2">
          {stats.revisionCount > 0 && (
            <button
              onClick={() =>
                setSelectedStatusFilter(
                  selectedStatusFilter === 'revision-needed' ? 'all' : 'revision-needed'
                )
              }
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-all ${
                selectedStatusFilter === 'revision-needed'
                  ? 'border-amber-400 bg-amber-500/30 text-amber-200 ring-2 ring-amber-500/40'
                  : 'border-amber-500/40 bg-amber-950/60 text-amber-300 hover:bg-amber-900/60'
              }`}
              title="Filter to nodes where last revised date is >30 days ago and mastery score is <80%"
            >
              <AlertCircle className="h-3 w-3 text-amber-400" />
              <span>{stats.revisionCount} Revision Due</span>
            </button>
          )}

          <button
            onClick={() => setIsAddSkillModalOpen(true)}
            className="flex items-center gap-1 rounded-lg border border-indigo-500/40 bg-indigo-950/50 px-2.5 py-1 text-[11px] font-bold text-indigo-200 hover:bg-indigo-900/60"
            title="Add a custom skill (e.g. React, Python)"
          >
            <Plus className="h-3 w-3" /> Add Skill
          </button>

          <button
            onClick={handleTriggerRecalculate}
            disabled={recalculatingAnimation}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white"
            title="Recalculate prerequisite unlocks"
          >
            <RefreshCw className={`h-3 w-3 ${recalculatingAnimation ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Recalculate</span>
          </button>

          {onResetProgress && (
            <button
              onClick={onResetProgress}
              className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200"
              title="Reset progress to default baseline"
            >
              Reset
            </button>
          )}

          <button
            onClick={() => onOpenMentorPrompt('How should I adapt my roadmap this week based on my current completed topics?')}
            className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-900/30 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-900/50"
          >
            <Brain className="h-3 w-3" /> Re-adapt AI
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Category Filters, Zoom, Status Legend */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/80 px-4 py-3 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes (e.g. Recursion, Collections, OS)..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="hidden items-center gap-1.5 lg:flex">
          {[
            { id: 'all', label: 'All Tracks' },
            { id: 'language', label: '☕ Java' },
            { id: 'dsa', label: '🧠 DSA' },
            { id: 'cs-core', label: '💻 CS Core' },
            { id: 'project', label: '🚀 Projects' },
            { id: 'interview', label: '🎯 Interview' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filter Dropdown / Pills */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">Status: All Nodes</option>
            <option value="revision-needed">⚠️ Recommended for Revision ({stats.revisionCount})</option>
            <option value="completed">Completed ({stats.completed})</option>
            <option value="current">In Progress ({stats.current})</option>
            <option value="needs-improvement">Need Revision ({stats.needsImp})</option>
            <option value="critical-gap">Critical Gap ({stats.critical})</option>
            <option value="recommended">Recommended Next</option>
          </select>

          {/* Zoom Controls */}
          <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800/60 p-0.5 shadow-sm">
            <button
              onClick={handleZoomOut}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 text-[11px] font-bold text-slate-300 min-w-[42px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="border-l border-slate-700 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
              title="Reset View"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`flex-1 overflow-auto p-6 transition-all cursor-grab active:cursor-grabbing select-none`}
        style={{
          backgroundImage:
            'radial-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px, 16px 16px',
        }}
      >
        <div
          className="mx-auto max-w-6xl transition-transform duration-100 origin-top"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          }}
        >
          {/* Target Hero Node at Top of Career Tree */}
          <div className="mb-10 flex justify-center">
            {nodes
              .filter((n) => n.id === 'target-msft-sde')
              .map((targetNode) => (
                <div
                  key={targetNode.id}
                  onClick={() => onSelectNode(targetNode)}
                  className="interactive-node-card group relative max-w-xl cursor-pointer rounded-2xl border-2 border-indigo-500/60 bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-slate-950 p-5 shadow-2xl shadow-indigo-500/20 transition-all hover:scale-102 hover:border-indigo-400"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-indigo-400 bg-indigo-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow">
                    Apex Career Milestone
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                          {targetNode.title}
                        </h3>
                        <p className="text-xs text-slate-300">{targetNode.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                        ~{targetNode.estimatedHours} Prep Hrs
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-300 line-clamp-2">
                    {targetNode.whyItMatters}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                    <span className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px]">
                      <Sparkles className="h-3.5 w-3.5" /> 5 Interconnected Tracks Below
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 group-hover:text-white transition-colors">
                      Open Node Drawer <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {/* Swimlane / Track Graph Breakdown */}
          <div className="space-y-10">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-xl backdrop-blur-sm"
              >
                {/* Track Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-indigo-400 border border-slate-700">
                      {track.id === 'language' && <Code className="h-4 w-4 text-cyan-400" />}
                      {track.id === 'dsa' && <Brain className="h-4 w-4 text-indigo-400" />}
                      {track.id === 'cs-core' && <Server className="h-4 w-4 text-purple-400" />}
                      {track.id === 'project' && <FolderGit2 className="h-4 w-4 text-teal-400" />}
                      {track.id === 'interview' && <Trophy className="h-4 w-4 text-amber-400" />}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white tracking-tight">{track.title}</h4>
                      <p className="text-xs text-slate-400">{track.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">
                      {track.nodes.filter((n) => n.status === 'completed').length} / {track.nodes.length} Completed
                    </span>
                    <div className="h-2 w-24 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                        style={{
                          width: `${(track.nodes.filter((n) => n.status === 'completed').length / track.nodes.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Nodes Grid for this Track */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {track.nodes.map((node) => {
                    const styling = getNodeColor(node.status);
                    const revCheck = checkNeedsRevision(node);
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode(node)}
                        className={`interactive-node-card group relative cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                          revCheck.isRecommended
                            ? 'border-amber-500/60 bg-amber-950/20 shadow-amber-500/10'
                            : styling.border + ' ' + styling.bg + ' ' + styling.glow
                        }`}
                      >
                        {/* Status & Category Bar */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${styling.badgeBg}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${styling.dot}`} />
                              {styling.label}
                            </span>

                            {revCheck.isRecommended && (
                              <span
                                className="inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 animate-pulse shadow-sm"
                                title={`Automated check: last revised ${revCheck.daysAgo} days ago (>30d) & mastery is ${node.masteryScore}% (<80%)`}
                              >
                                <AlertCircle className="h-2.5 w-2.5 text-amber-400" />
                                Revision Due
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            {onToggleNodeStatus && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleNodeStatus(node.id);
                                }}
                                className={`rounded p-1 transition-colors ${
                                  node.status === 'completed'
                                    ? 'text-emerald-400 hover:bg-emerald-950'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                }`}
                                title="Toggle node complete"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span>{node.estimatedHours}h</span>
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <h5 className="mt-2.5 font-bold text-sm text-white group-hover:text-indigo-200 transition-colors">
                          {node.title}
                        </h5>
                        {node.subtitle && (
                          <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">{node.subtitle}</p>
                        )}

                        {/* Automated Recommended for Revision Indicator */}
                        {revCheck.isRecommended && (
                          <div className="mt-2.5 flex items-center justify-between rounded-lg border border-amber-500/40 bg-gradient-to-r from-amber-950/60 to-slate-900/90 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 shadow-sm">
                            <div className="flex items-center gap-1.5">
                              <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
                              <span>Recommended for Revision</span>
                            </div>
                            <span className="text-[10px] text-amber-300/90 font-mono">
                              {revCheck.daysAgo}d ago • {node.masteryScore}% score
                            </span>
                          </div>
                        )}

                        {/* Learned Notes preview if present */}
                        {node.userLearnedNotes && (
                          <p className="mt-2 text-[10px] text-cyan-300/90 italic bg-slate-950/40 p-1.5 rounded-lg border border-slate-800">
                            "{node.userLearnedNotes}"
                          </p>
                        )}

                        {/* Why it Matters snippet */}
                        <p className="mt-2 text-[11px] leading-relaxed text-slate-300 line-clamp-2">
                          {node.whyItMatters}
                        </p>

                        {/* Node Card Footer */}
                        <div className="mt-3.5 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-[11px]">
                          <div className="flex items-center gap-1 text-slate-400">
                            {node.practiceProblems.length > 0 && (
                              <span className="rounded bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
                                {node.practiceProblems.length} Problems
                              </span>
                            )}
                            {node.quiz && node.quiz.length > 0 && (
                              <span className="rounded bg-indigo-950/60 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">
                                Quiz
                              </span>
                            )}
                          </div>

                          <span className="flex items-center gap-0.5 font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                            Open <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add Custom Skill to Roadmap (Section 8L) */}
      {isAddSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Add New Skill to Career Roadmap</h3>
              <button
                onClick={() => setIsAddSkillModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkillSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Skill / Milestone Title</label>
                <input
                  type="text"
                  required
                  value={newSkillTitle}
                  onChange={(e) => setNewSkillTitle(e.target.value)}
                  placeholder="e.g. React.js Fundamentals, Redis Caching, or Go"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Target Track</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as NodeCategory)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="language">Language Track (Java, Python, C++)</option>
                  <option value="dsa">DSA & Algorithms</option>
                  <option value="cs-core">CS Core (OS, DBMS, Networks)</option>
                  <option value="project">Production Projects</option>
                  <option value="interview">Interview Readiness</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Why It Matters (Goal)</label>
                <textarea
                  value={newSkillWhy}
                  onChange={(e) => setNewSkillWhy(e.target.value)}
                  rows={2}
                  placeholder="Explain why this skill helps you stand out..."
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSkillModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-1.5 text-xs font-bold text-white shadow hover:brightness-110"
                >
                  Add to Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

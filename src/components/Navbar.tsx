import React from 'react';
import {
  Compass,
  Sparkles,
  Target,
  Brain,
  Calendar,
  User,
  Zap,
  Flame,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { StudentProfile } from '../types/career';

interface NavbarProps {
  activeTab: 'map' | 'skills' | 'mentor' | 'reverse-engineer' | 'sprint' | 'profile';
  setActiveTab: (tab: 'map' | 'skills' | 'mentor' | 'reverse-engineer' | 'sprint' | 'profile') => void;
  profile: StudentProfile;
  onOpenOnboarding: () => void;
  readinessScore: number;
  streakDays: number;
  revisionCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenOnboarding,
  readinessScore,
  streakDays,
  revisionCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('map')}
            className="group flex cursor-pointer items-center gap-2.5"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/90">
                <Compass className="h-5 w-5 text-indigo-400 transition-transform duration-300 group-hover:rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">
                  CAREER<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">QUEST</span>
                </span>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Your Dream Job. Your Personalized Path.
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="hidden items-center rounded-full border border-slate-800 bg-slate-900/60 p-1 shadow-inner md:flex">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'map'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Interactive Map</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'skills'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>My Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('mentor')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'mentor'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>AI Mentor</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('reverse-engineer')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'reverse-engineer'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>Dream Job Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('sprint')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'sprint'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Daily Sprint</span>
            {revisionCount > 0 && (
              <span
                className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"
                title={`${revisionCount} topics recommended for revision`}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Profile</span>
          </button>
        </nav>

        {/* Student Target & Quick Stats Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 lg:flex">
            <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>{streakDays} Day Streak</span>
          </div>

          {/* Target Chip */}
          <button
            onClick={onOpenOnboarding}
            className="group flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-medium text-slate-200 transition-all hover:border-indigo-400/50 hover:bg-indigo-900/40"
            title="Click to customize target and profile"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-400">
              <Sparkles className="h-3 w-3" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-300">
                <span>{profile.targetCompany}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 truncate max-w-[90px] sm:max-w-[130px]">{profile.targetRole}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="text-emerald-400 font-semibold">{readinessScore}% Match</span>
                <span className="text-slate-500">•</span>
                <span>{profile.dailyStudyHours}h/day</span>
              </div>
            </div>
            <ChevronRight className="h-3 w-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex border-t border-slate-800/60 bg-slate-900/80 px-2 py-1.5 md:hidden justify-around">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center py-1 text-[10px] font-medium ${
            activeTab === 'map' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="h-4 w-4 mb-0.5" />
          <span>Map</span>
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex flex-col items-center py-1 text-[10px] font-medium ${
            activeTab === 'skills' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Zap className="h-4 w-4 mb-0.5 text-amber-400" />
          <span>My Skills</span>
        </button>
        <button
          onClick={() => setActiveTab('mentor')}
          className={`flex flex-col items-center py-1 text-[10px] font-medium ${
            activeTab === 'mentor' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Brain className="h-4 w-4 mb-0.5" />
          <span>AI Mentor</span>
        </button>
        <button
          onClick={() => setActiveTab('reverse-engineer')}
          className={`flex flex-col items-center py-1 text-[10px] font-medium ${
            activeTab === 'reverse-engineer' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Target className="h-4 w-4 mb-0.5" />
          <span>Target Engine</span>
        </button>
        <button
          onClick={() => setActiveTab('sprint')}
          className={`flex flex-col items-center py-1 text-[10px] font-medium ${
            activeTab === 'sprint' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calendar className="h-4 w-4 mb-0.5" />
          <span>Sprint</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 text-[10px] font-medium ${
            activeTab === 'profile' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <User className="h-4 w-4 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building,
  Briefcase,
  Layers,
  Code2,
  Brain,
  Server,
  Database,
  Award,
  Zap,
  RotateCcw,
  BookOpen,
  FolderGit2,
} from 'lucide-react';
import {
  StudentProfile,
  ReverseEngineeringAnalysis,
  RoadmapNode,
} from '../types/career';

interface DreamJobReverseEngineerProps {
  profile: StudentProfile;
  onApplyNewRoadmap: (analysis: ReverseEngineeringAnalysis) => void;
  onNavigateToTab: (tab: 'map' | 'mentor' | 'sprint') => void;
}

export const DreamJobReverseEngineer: React.FC<DreamJobReverseEngineerProps> = ({
  profile,
  onApplyNewRoadmap,
  onNavigateToTab,
}) => {
  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Software Engineer');
  const [targetCompany, setTargetCompany] = useState(profile.targetCompany || 'Microsoft');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ReverseEngineeringAnalysis | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const handleReverseEngineer = async () => {
    setIsLoading(true);
    setAppliedNotice(false);

    try {
      const response = await fetch('/api/reverse-engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          targetCompany,
          jobDescription,
          profile,
        }),
      });

      if (!response.ok) {
        throw new Error('Reverse engineer API failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error during reverse engineering:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToRoadmap = () => {
    if (!analysis) return;
    onApplyNewRoadmap(analysis);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 4000);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Generative AI Reverse-Engineering Engine
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Deconstruct Any Dream Job Role into an Actionable Path
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enter any Big Tech target (Microsoft, Amazon, Google, Stripe) or paste a real job posting.
              CareerQuest AI performs algorithmic decomposition, skill gap analysis against your profile,
              and generates a calibrated milestone plan.
            </p>
            <p className="mt-2 text-[11px] text-slate-400 italic">
              *Disclaimer: CareerQuest AI provides structured preparation guidance and does not guarantee employment or selection.
            </p>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fast Presets</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setTargetRole('Software Engineer');
                  setTargetCompany('Microsoft');
                }}
                className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-900/40"
              >
                Microsoft SDE
              </button>
              <button
                onClick={() => {
                  setTargetRole('SDE-1');
                  setTargetCompany('Amazon');
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Amazon SDE
              </button>
              <button
                onClick={() => {
                  setTargetRole('Software Engineer (SWE)');
                  setTargetCompany('Google');
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Google SWE
              </button>
              <button
                onClick={() => {
                  setTargetRole('Software Engineer');
                  setTargetCompany('Apple');
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Apple SWE
              </button>
              <button
                onClick={() => {
                  setTargetRole('Production Engineer');
                  setTargetCompany('Meta');
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Meta SWE
              </button>
            </div>
          </div>
        </div>

        {/* Target Input Form */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Target Role Title</label>
            <div className="relative mt-1">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer / SDE-1"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Target Company</label>
            <div className="relative mt-1">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Microsoft, Amazon, Google"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            <button
              onClick={handleReverseEngineer}
              disabled={isLoading || !targetCompany || !targetRole}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:brightness-110 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" /> Reverse Engineering...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Reverse Engineer Target Role
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Custom Job Description Drawer */}
        <div className="mt-4">
          <details className="text-xs text-slate-400">
            <summary className="cursor-pointer font-medium text-indigo-300 hover:text-indigo-200">
              + Or paste a specific job description / LinkedIn JD text (Optional)
            </summary>
            <div className="mt-2">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                placeholder="Paste requirements, tech stack, or qualification bullets here..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950/90 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </details>
        </div>
      </div>

      {/* Applied Notice Banner */}
      {appliedNotice && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/80 p-4 text-xs font-semibold text-emerald-200 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Success: Your interactive career roadmap has been calibrated for {analysis?.targetRole} @ {analysis?.targetCompany}!</span>
          </div>
          <button
            onClick={() => onNavigateToTab('map')}
            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
          >
            View Map
          </button>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6">
          {/* Readiness Score & Hiring Committee Focus Banner */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Match Score Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Match Readiness</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    {analysis.matchScore}%
                  </span>
                  <span className="text-xs font-medium text-slate-400">Calculated baseline</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400"
                    style={{ width: `${analysis.matchScore}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
                <p className="font-semibold text-white">Path Velocity:</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  With {profile.dailyStudyHours} hours/day study time, reach 85%+ readiness in {profile.targetTimeline}.
                </p>
              </div>
            </div>

            {/* Hiring Committee Insights */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {analysis.targetCompany} Hiring Committee Blueprint
              </span>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-200">
                {analysis.companyTierDescription}
              </p>

              <div className="mt-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Top Evaluation Dimensions:
                </span>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.hiringFocus.map((focus, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/50 p-2.5 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Flow Matrix: Skill Gap Analysis */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Target Skill Gap Breakdown</h3>
                <p className="text-xs text-slate-400">
                  Direct comparison: {profile.name}'s current skillset vs {analysis.targetCompany} expectations
                </p>
              </div>
              <button
                onClick={handleApplyToRoadmap}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-teal-500/20 hover:brightness-110"
              >
                <Zap className="h-3.5 w-3.5" /> Sync Roadmap with Gaps
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {analysis.skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-colors hover:border-slate-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{gap.skill}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 uppercase">
                        {gap.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                          gap.importance === 'Critical'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {gap.importance} Gap
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Current: <b className="text-slate-200">{gap.currentLevel}</b>
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-300">
                    <span className="text-slate-400 font-medium">Expectation: </span>
                    {gap.targetExpectation}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs text-indigo-300 font-medium">
                    <ArrowRight className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>Action: {gap.recommendedAction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categorized Requirements Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Programming Languages */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Code2 className="h-4 w-4" /> Languages & Internals
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-200">
                {analysis.breakdown.programmingLanguages.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DSA Key Topics */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Brain className="h-4 w-4" /> High-Yield DSA Patterns
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-200">
                {analysis.breakdown.dsaKeyTopics.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CS Fundamentals */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                <Server className="h-4 w-4" /> CS Fundamentals (OS/DBMS/CN)
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-200">
                {analysis.breakdown.csFundamentals.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* High-Impact Projects */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <FolderGit2 className="h-4 w-4" /> Standout Resume Projects
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-200">
                {analysis.breakdown.highImpactProjects.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Prep Rounds */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Award className="h-4 w-4" /> Company Interview Stages
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-200">
                {analysis.breakdown.interviewPreparation.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resume Requirements */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <BookOpen className="h-4 w-4" /> Resume & GitHub Standards
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-200">
                {analysis.breakdown.resumeRequirements.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3-Phase Milestone Action Plan */}
          <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-6">
            <h3 className="text-base font-bold text-white">Recommended Phased Preparation Roadmap</h3>
            <p className="text-xs text-slate-400">
              Generated execution plan based on {profile.dailyStudyHours} hrs/day daily pace
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.customMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-indigo-400">{m.phase}</span>
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-300">
                        {m.duration}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 font-medium">{m.focus}</p>

                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Key Deliverables:</span>
                      {m.keyDeliverables.map((del, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

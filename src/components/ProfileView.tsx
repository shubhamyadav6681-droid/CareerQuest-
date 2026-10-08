import React from 'react';
import {
  User,
  GraduationCap,
  Building,
  Target,
  Clock,
  BookOpen,
  Code2,
  Award,
  AlertTriangle,
  Edit3,
  CheckCircle2,
  Flame,
  Brain,
} from 'lucide-react';
import { StudentProfile } from '../types/career';

interface ProfileViewProps {
  profile: StudentProfile;
  onOpenOnboarding: () => void;
  readinessScore: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onOpenOnboarding,
  readinessScore,
}) => {
  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-xl shadow-indigo-500/30 text-2xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{profile.name}</h1>
                <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                  {profile.currentSkillLevel}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {profile.degree} in {profile.branch} • {profile.college} ({profile.yearSemester})
              </p>
              {profile.cgpa && (
                <p className="text-[11px] text-slate-400 mt-0.5">Current CGPA: {profile.cgpa}</p>
              )}
            </div>
          </div>

          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-2 text-xs font-bold text-indigo-200 hover:bg-indigo-900/50 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile & Targets
          </button>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-slate-800/80 pt-4 text-xs">
          <div>
            <span className="text-[11px] text-slate-400">Target Role</span>
            <p className="font-bold text-white truncate">{profile.targetRole}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Target Company</span>
            <p className="font-bold text-cyan-300">{profile.targetCompany}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Daily Study Pace</span>
            <p className="font-bold text-emerald-400">{profile.dailyStudyHours} Hours/Day</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">Overall Match Readiness</span>
            <p className="font-bold text-indigo-400">{readinessScore}% Match</p>
          </div>
        </div>
      </div>

      {/* Grid of Profile Attributes */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Languages & Technical Skills */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Code2 className="h-4 w-4" /> Programming Languages & Skills Known
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.knownLanguages.map((lang, idx) => (
              <span
                key={idx}
                className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-xs font-semibold text-cyan-300"
              >
                {lang}
              </span>
            ))}
            {profile.technicalSkills.map((sk, idx) => (
              <span
                key={idx}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs text-slate-200"
              >
                {sk}
              </span>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Current Projects:
            </span>
            <div className="mt-2 space-y-1.5 text-xs text-slate-300">
              {profile.currentProjects.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weak Areas & Adaptive Focus */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <AlertTriangle className="h-4 w-4" /> Focus & Known Weak Areas (AI Adapts To These)
          </div>
          <p className="text-xs text-slate-300">
            CareerQuest automatically schedules diagnostic practice and concept breakdowns for topics flagged here:
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.weakAreas.map((w, idx) => (
              <span
                key={idx}
                className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-300"
              >
                {w}
              </span>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Completed Topics:
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.completedTopics.map((c, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-1 text-xs text-emerald-300 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

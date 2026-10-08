import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Clock,
  BookOpen,
  Code2,
  Building,
  Target,
  Wand2,
} from 'lucide-react';
import { StudentProfile } from '../types/career';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StudentProfile>(currentProfile);

  if (!isOpen) return null;

  const handleApplyPreset = (presetType: 'rahul' | 'priya' | 'alex') => {
    if (presetType === 'rahul') {
      setFormData({
        name: 'Rahul Sharma',
        college: 'National Institute of Technology (NIT)',
        degree: 'B.Tech',
        branch: 'Computer Science & Engineering',
        yearSemester: '1st Year / 2nd Sem',
        cgpa: '8.4',
        knownLanguages: ['C (Basics)', 'HTML/CSS', 'Java (Beginner)'],
        technicalSkills: ['Procedural Programming', 'Web Fundamentals', 'Git Basics'],
        currentProjects: ['Personal Portfolio Website', 'Console Student Record in C'],
        targetCompany: 'Microsoft',
        targetRole: 'Software Engineer',
        careerGoal: 'Crack Microsoft On-Campus / Summer Internship & Secure SDE-1 Offer',
        currentSkillLevel: 'Beginner',
        dailyStudyHours: 2,
        preferredLearningStyle: 'Interactive Problem Solving',
        completedTopics: ['C Basics & Pointers', 'HTML/CSS Fundamentals', 'Java Syntax & Loops'],
        weakAreas: ['Recursion & Backtracking', 'Object-Oriented Design', 'Time Complexity Analysis'],
        targetTimeline: '12 Months',
      });
    } else if (presetType === 'priya') {
      setFormData({
        name: 'Priya Patel',
        college: 'IIT Roorkee',
        degree: 'B.Tech',
        branch: 'Information Technology',
        yearSemester: '3rd Year / 5th Sem',
        cgpa: '8.9',
        knownLanguages: ['Java (Proficient)', 'C++', 'SQL'],
        technicalSkills: ['Spring Boot', 'Data Structures', 'REST APIs', 'MySQL'],
        currentProjects: ['E-Commerce Backend Microservice', 'Real-Time Chat App'],
        targetCompany: 'Amazon',
        targetRole: 'SDE-1 (Software Development Engineer)',
        careerGoal: 'Ace Amazon Online Assessment and 3-Round Virtual Onsite',
        currentSkillLevel: 'Intermediate',
        dailyStudyHours: 3,
        preferredLearningStyle: 'Hands-on Projects',
        completedTopics: ['Java OOP & Collections', 'Arrays & Strings', 'Linked Lists', 'Binary Trees'],
        weakAreas: ['Dynamic Programming', 'System Design & High-Level Architecture', 'Graphs (Dijkstra)'],
        targetTimeline: '6 Months',
      });
    } else {
      setFormData({
        name: 'Alex Chen',
        college: 'BITS Pilani',
        degree: 'B.Tech',
        branch: 'Computer Science',
        yearSemester: '2nd Year / 3rd Sem',
        cgpa: '8.6',
        knownLanguages: ['Python', 'TypeScript', 'Java'],
        technicalSkills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
        currentProjects: ['API Gateway with Rate Limiter', 'Discord Bot in TypeScript'],
        targetCompany: 'Google',
        targetRole: 'Software Engineer (SWE)',
        careerGoal: 'Excel at Google Summer of Code & Off-Campus SWE hiring pipeline',
        currentSkillLevel: 'Intermediate',
        dailyStudyHours: 2.5,
        preferredLearningStyle: 'Interactive Problem Solving',
        completedTopics: ['Python Scripting', 'Basic Web Dev', 'Basic Sorting & Searching'],
        weakAreas: ['Graph Theory & Shortest Path', 'Bit Manipulation', 'Segment Trees'],
        targetTimeline: '9 Months',
      });
    }
  };

  const handleArrayInput = (
    field: 'knownLanguages' | 'technicalSkills' | 'currentProjects' | 'completedTopics' | 'weakAreas',
    valueStr: string
  ) => {
    const list = valueStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: list }));
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-indigo-500/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Student Career Onboarding</h2>
              <p className="text-xs text-slate-400">Step {step} of 4 — Building your adaptive career roadmap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Preset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 bg-slate-950/50 px-6 py-2.5 text-xs">
          <span className="font-medium text-slate-400 flex items-center gap-1.5">
            <Wand2 className="h-3.5 w-3.5 text-indigo-400" /> Fast-fill benchmark profiles:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('rahul')}
              className="rounded-lg border border-indigo-500/40 bg-indigo-950/40 px-2.5 py-1 font-semibold text-indigo-300 hover:bg-indigo-900/50"
            >
              Rahul (1st Yr CSE → Microsoft)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('priya')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-medium text-slate-300 hover:bg-slate-700"
            >
              Priya (3rd Yr → Amazon)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('alex')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-medium text-slate-300 hover:bg-slate-700"
            >
              Alex (2nd Yr → Google)
            </button>
          </div>
        </div>

        {/* Body content based on step */}
        <form onSubmit={handleFinish} className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
                <GraduationCap className="h-4 w-4" /> Academic & Personal Background
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">College / University</label>
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. National Institute of Technology (NIT)"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Degree & Branch</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      placeholder="B.Tech"
                    />
                    <input
                      type="text"
                      required
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      placeholder="CSE / IT"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Year / Semester & CGPA</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={formData.yearSemester}
                      onChange={(e) => setFormData({ ...formData, yearSemester: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      placeholder="1st Year"
                    />
                    <input
                      type="text"
                      value={formData.cgpa}
                      onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      placeholder="8.4 CGPA"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
                <Code2 className="h-4 w-4" /> Current Technical Foundation
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Programming Languages Known <span className="text-slate-500">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.knownLanguages.join(', ')}
                  onChange={(e) => handleArrayInput('knownLanguages', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. C basics, HTML/CSS, Basic Java"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Technical Skills & Concepts Known <span className="text-slate-500">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.technicalSkills.join(', ')}
                  onChange={(e) => handleArrayInput('technicalSkills', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Procedural Programming, Loops, Git Basics"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Current Projects Built So Far <span className="text-slate-500">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.currentProjects.join(', ')}
                  onChange={(e) => handleArrayInput('currentProjects', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Personal Portfolio Website, Console Record System in C"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Topics Already Completed <span className="text-slate-500">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.completedTopics.join(', ')}
                  onChange={(e) => handleArrayInput('completedTopics', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. C Basics & Pointers, HTML Fundamentals, Java Syntax"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
                <Target className="h-4 w-4" /> Dream Ambition & Target Role
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-300">Target Dream Company</label>
                  <input
                    type="text"
                    required
                    value={formData.targetCompany}
                    onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Microsoft"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Target Job Role</label>
                  <input
                    type="text"
                    required
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Software Engineer / SDE-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Career Goal & Milestone</label>
                <input
                  type="text"
                  required
                  value={formData.careerGoal}
                  onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Crack Microsoft On-Campus / Summer Internship & Secure SDE-1 Offer"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Known Weak Subjects or Skills <span className="text-slate-500">(CareerQuest will adapt to these)</span>
                </label>
                <input
                  type="text"
                  value={formData.weakAreas.join(', ')}
                  onChange={(e) => handleArrayInput('weakAreas', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Recursion & Backtracking, OOP Design, Complexity Analysis"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
                <Clock className="h-4 w-4" /> Learning Pace & Schedule
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-300">Available Daily Study Time</label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="0.5"
                      value={formData.dailyStudyHours}
                      onChange={(e) => setFormData({ ...formData, dailyStudyHours: parseFloat(e.target.value) })}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-indigo-500"
                    />
                    <span className="min-w-[70px] rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-2 py-1 text-center text-xs font-bold text-indigo-300">
                      {formData.dailyStudyHours} hrs/day
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Current Self-Assessed Level</label>
                  <select
                    value={formData.currentSkillLevel}
                    onChange={(e) => setFormData({ ...formData, currentSkillLevel: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner (1st/2nd Year foundation)</option>
                    <option value="Intermediate">Intermediate (Solved 50+ problems)</option>
                    <option value="Advanced">Advanced (Interview ready)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Preferred Learning Style</label>
                  <select
                    value={formData.preferredLearningStyle}
                    onChange={(e) => setFormData({ ...formData, preferredLearningStyle: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Interactive Problem Solving">Interactive Problem Solving</option>
                    <option value="Hands-on Projects">Hands-on Projects</option>
                    <option value="Video Tutorials">Video Tutorials</option>
                    <option value="Reading & Docs">Reading & Docs</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Target Preparation Timeline</label>
                  <input
                    type="text"
                    value={formData.targetTimeline}
                    onChange={(e) => setFormData({ ...formData, targetTimeline: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. 12 Months"
                  />
                </div>
              </div>

              {/* Summary Preview Box */}
              <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 text-xs text-indigo-200">
                <span className="font-semibold text-white">✨ Ready to initialize: </span>
                Customizing path for <span className="font-bold text-white">{formData.name}</span> ({formData.degree} in {formData.branch}) targeting{' '}
                <span className="font-bold text-cyan-300">{formData.targetRole} @ {formData.targetCompany}</span> at {formData.dailyStudyHours} hours/day.
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:brightness-110"
              >
                Next Step <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:brightness-110"
              >
                <Sparkles className="h-4 w-4" /> Generate Adaptive Roadmap
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

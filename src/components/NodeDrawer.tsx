import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  Code2,
  Brain,
  AlertTriangle,
  Layers,
  HelpCircle,
  Check,
  ChevronRight,
  Flame,
  FileEdit,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { RoadmapNode, NodeStatus, QuizQuestion, GranularTopic, TopicStatus } from '../types/career';
import { checkNeedsRevision } from '../utils/revisionChecker';

interface NodeDrawerProps {
  node: RoadmapNode | null;
  onClose: () => void;
  onUpdateStatus: (
    nodeId: string,
    newStatus: NodeStatus,
    masteryScore?: number,
    learnedNotes?: string
  ) => void;
  onAskMentorAboutNode: (node: RoadmapNode) => void;
  granularTopics?: GranularTopic[];
  onToggleGranularTopic?: (topicId: string, status: TopicStatus) => void;
}

export const NodeDrawer: React.FC<NodeDrawerProps> = ({
  node,
  onClose,
  onUpdateStatus,
  onAskMentorAboutNode,
  granularTopics = [],
  onToggleGranularTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subtopics' | 'practice' | 'quiz'>('overview');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [learnedNotesText, setLearnedNotesText] = useState('');
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  useEffect(() => {
    if (node) {
      setLearnedNotesText(node.userLearnedNotes || node.userNotes || '');
      setSelectedAnswers({});
      setQuizSubmitted(false);
    }
  }, [node]);

  if (!node) return null;

  // Filter granular subtopics belonging to this node
  const relatedSubtopics = granularTopics.filter(
    (t) => t.parentNodeId === node.id || t.parentSkill.toLowerCase() === node.title.toLowerCase()
  );

  const getStatusBadge = (status: NodeStatus) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed ✓',
          classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'current':
        return {
          label: 'In Progress ⏳',
          classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30 ring-2 ring-blue-500/20',
          dot: 'bg-blue-400 animate-ping',
        };
      case 'needs-improvement':
        return {
          label: 'Need Revision ⚠️',
          classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'critical-gap':
        return {
          label: 'Critical Gap',
          classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400',
        };
      case 'recommended':
        return {
          label: 'Recommended Next',
          classes: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          dot: 'bg-purple-400',
        };
      case 'locked':
      default:
        return {
          label: 'Locked 🔒',
          classes: 'bg-slate-700/20 text-slate-400 border-slate-700/40',
          dot: 'bg-slate-500',
        };
    }
  };

  const badge = getStatusBadge(node.status);

  // Save notes
  const handleSaveNotes = () => {
    onUpdateStatus(node.id, node.status, node.masteryScore, learnedNotesText.trim());
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 2500);
  };

  // Evaluate quiz
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleGradeQuiz = () => {
    if (!node.quiz || node.quiz.length === 0) return;
    setQuizSubmitted(true);
    let correct = 0;
    node.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const score = Math.round((correct / node.quiz.length) * 100);
    if (score >= 70) {
      onUpdateStatus(node.id, 'completed', score, learnedNotesText);
    } else {
      onUpdateStatus(node.id, 'needs-improvement', score, learnedNotesText);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const revCheck = checkNeedsRevision(node);

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur-2xl">
      {/* Drawer Header */}
      <div className="border-b border-slate-800 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.classes}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                {badge.label}
              </span>
              {revCheck.isRecommended && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 animate-pulse">
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                  Recommended for Revision
                </span>
              )}
              <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                {node.category.toUpperCase()}
              </span>
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300">
                {node.importance}
              </span>
            </div>

            <h2 className="mt-2 text-xl font-bold text-white tracking-tight">{node.title}</h2>
            {node.subtitle && <p className="text-xs text-slate-400 mt-0.5">{node.subtitle}</p>}
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700/60 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Automated Revision Check Alert Banner */}
        {revCheck.isRecommended && (
          <div className="mt-3 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 to-slate-900/90 p-3 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0 animate-pulse" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-amber-200">Recommended for Revision</span>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                      Spaced Repetition
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">
                    Last revised <span className="font-bold text-amber-300">{revCheck.daysAgo} days ago</span> (&gt; 30d) • Current mastery: <span className="font-bold text-rose-300">{node.masteryScore}%</span> (&lt; 80%).
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onUpdateStatus(
                    node.id,
                    node.status,
                    Math.min(100, (node.masteryScore || 60) + 15),
                    learnedNotesText
                  );
                }}
                className="self-start sm:self-center shrink-0 flex items-center gap-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition-all"
                title="Mark revised today (updates lastRevisedDate to today and clears alert)"
              >
                <Check className="h-3 w-3" /> Mark Revised Today
              </button>
            </div>
          </div>
        )}

        {/* Manual Progress Update Action Bar (Section 8D & 8E) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400 font-semibold text-[11px]">Set Status:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onUpdateStatus(node.id, 'completed', 100, learnedNotesText)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                node.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Check className="h-3 w-3" /> Completed
            </button>

            <button
              onClick={() => onUpdateStatus(node.id, 'current', node.masteryScore, learnedNotesText)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                node.status === 'current'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              In Progress
            </button>

            <button
              onClick={() => onUpdateStatus(node.id, 'needs-improvement', 40, learnedNotesText)}
              className={`rounded-lg px-2 py-1 text-[11px] font-semibold border transition-all ${
                node.status === 'needs-improvement'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Need Revision
            </button>

            <button
              onClick={() => onUpdateStatus(node.id, 'locked', 0, '')}
              className="rounded-lg p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              title="Reset progress for this node"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mt-4 flex gap-1 border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 px-3 py-2 text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Curriculum
          </button>
          <button
            onClick={() => setActiveTab('subtopics')}
            className={`border-b-2 px-3 py-2 text-xs font-semibold transition-all ${
              activeTab === 'subtopics'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Granular Skills {relatedSubtopics.length > 0 ? `(${relatedSubtopics.length})` : ''}
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`border-b-2 px-3 py-2 text-xs font-semibold transition-all ${
              activeTab === 'practice'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Practice ({node.practiceProblems.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`border-b-2 px-3 py-2 text-xs font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Assessment {node.quiz?.length ? `(${node.quiz.length} Qs)` : ''}
          </button>
        </div>
      </div>

      {/* Drawer Body Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Why it Matters Card */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Why This Matters for Your Target Company
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{node.whyItMatters}</p>
            </div>

            {/* "Add What I Learned" (Section 8D & 8I) */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileEdit className="h-4 w-4 text-indigo-400" /> What I Learned (Notes & Memory)
                </label>
                {notesSavedNotice && (
                  <span className="text-[11px] font-semibold text-emerald-400">✓ Notes saved permanently</span>
                )}
              </div>
              <textarea
                value={learnedNotesText}
                onChange={(e) => setLearnedNotesText(e.target.value)}
                rows={3}
                placeholder="e.g. I learned array declaration, indexing, traversal and solved 2 LeetCode medium problems on two pointers..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Save Learning Note
                </button>
              </div>
            </div>

            {/* Verified Progress History Card (Section 8I) */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Progress & Mastery History:
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500 text-[10px] block">Completed Date:</span>
                  <b>{node.completedDate || (node.status === 'completed' ? 'Recorded' : 'Not completed')}</b>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Last Revised:</span>
                  <b>{node.lastRevisedDate || 'None'}</b>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Assessment Score:</span>
                  <b className="text-emerald-400">{node.masteryScore ? `${node.masteryScore}%` : 'Pending'}</b>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Practice Accuracy:</span>
                  <b className="text-cyan-400">{node.practiceAccuracy ? `${node.practiceAccuracy}%` : '85% avg'}</b>
                </div>
              </div>
            </div>

            {/* What to Learn Checklist */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Concepts to Master
              </h4>
              <ul className="mt-2 space-y-2">
                {node.whatToLearn.map((concept, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-800/70 bg-slate-950/40 p-3 text-xs text-slate-200"
                  >
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px]">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Granular Subtopics Tab (Section 8A: Smallest useful learning level) */}
        {activeTab === 'subtopics' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 text-xs text-indigo-300">
              <span className="font-semibold text-white">Smallest Learning Level: </span>
              Mark individual subtopics as completed. CareerQuest remembers each checked topic permanently.
            </div>

            <div className="space-y-2">
              {relatedSubtopics.length > 0 ? (
                relatedSubtopics.map((subtopic) => {
                  const isDone = subtopic.status === 'COMPLETED' || subtopic.status === 'MASTERED';
                  return (
                    <div
                      key={subtopic.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs transition-colors hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (onToggleGranularTopic) {
                              onToggleGranularTopic(
                                subtopic.id,
                                isDone ? 'IN PROGRESS' : 'COMPLETED'
                              );
                            }
                          }}
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                            isDone
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-slate-600 bg-slate-900 hover:border-indigo-400'
                          }`}
                        >
                          {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </button>

                        <div>
                          <p className={`font-semibold ${isDone ? 'text-slate-200' : 'text-slate-300'}`}>
                            {subtopic.name}
                          </p>
                          {subtopic.learnedNotes && (
                            <p className="text-[10px] text-slate-400 italic">"{subtopic.learnedNotes}"</p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                          isDone
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : subtopic.status === 'IN PROGRESS'
                            ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700/50'
                        }`}
                      >
                        {subtopic.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400">
                  Subtopics for this node are inherited from the primary curriculum. Use the main completion button to track this node.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Practice Problems ({node.practiceProblems.length})
            </h4>

            {node.practiceProblems.map((prob) => (
              <div
                key={prob.id}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 transition-colors hover:border-indigo-500/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-200">{prob.title}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Concept: {prob.concept}</p>
                  </div>
                </div>

                {prob.hint && (
                  <div className="mt-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-[11px] text-amber-300/90">
                    💡 <span className="font-medium">Hint:</span> {prob.hint}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 text-xs text-indigo-300">
              <span className="flex items-center gap-1.5 font-medium">
                <HelpCircle className="h-4 w-4" /> Quick Mastery Assessment
              </span>
              <span>Pass with &ge;70% to mark node Completed</span>
            </div>

            {node.quiz && node.quiz.length > 0 ? (
              <div className="space-y-4">
                {node.quiz.map((q, qIndex) => {
                  const selected = selectedAnswers[q.id];
                  const isCorrect = selected === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <p className="text-xs font-semibold text-slate-200">
                        {qIndex + 1}. {q.question}
                      </p>

                      <div className="mt-3 space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isChosen = selected === optIndex;
                          let optStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';

                          if (quizSubmitted) {
                            if (optIndex === q.correctIndex) {
                              optStyle = 'border-emerald-500/50 bg-emerald-950/50 text-emerald-200 font-semibold';
                            } else if (isChosen && !isCorrect) {
                              optStyle = 'border-rose-500/50 bg-rose-950/50 text-rose-200';
                            }
                          } else if (isChosen) {
                            optStyle = 'border-indigo-500 bg-indigo-950/60 text-indigo-200 font-semibold';
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleAnswerSelect(q.id, optIndex)}
                              className={`w-full rounded-xl border p-2.5 text-left text-xs transition-colors ${optStyle}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-700 text-[10px]">
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`mt-3 rounded-lg p-2.5 text-xs ${isCorrect ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/20' : 'bg-rose-950/30 text-rose-300 border border-rose-500/20'}`}>
                          <p className="font-semibold">{isCorrect ? '✓ Correct!' : '✗ Not quite'}</p>
                          <p className="mt-1 text-[11px] text-slate-300">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleGradeQuiz}
                      disabled={Object.keys(selectedAnswers).length < node.quiz.length}
                      className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:brightness-110 disabled:opacity-50"
                    >
                      Submit Assessment & Verify Mastery
                    </button>
                  ) : (
                    <button
                      onClick={handleRetakeQuiz}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      Retake Quiz
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Drawer Footer with Quick Mentor Action */}
      <div className="border-t border-slate-800 bg-slate-950/80 p-4">
        <button
          onClick={() => {
            onAskMentorAboutNode(node);
            onClose();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 p-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:brightness-110"
        >
          <Brain className="h-4 w-4" /> Ask AI Mentor About "{node.title}"
        </button>
      </div>
    </div>
  );
};

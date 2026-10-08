import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Upload,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Brain,
  X,
  Image as ImageIcon,
  CheckCircle2,
  BookOpen,
  CalendarPlus,
  ArrowRight,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Camera,
  Paperclip,
  FileCode,
  Bookmark,
  RefreshCw,
  AlertCircle,
  Terminal,
  Clock,
  Layers,
} from 'lucide-react';
import {
  ChatMessage,
  ActionButton,
  StudentProfile,
  RoadmapNode,
  GranularTopic,
} from '../types/career';

interface MultimodalMentorProps {
  profile: StudentProfile;
  roadmapNodes: RoadmapNode[];
  granularTopics?: GranularTopic[];
  onAddNodeToRoadmap: (topicName: string, category: 'dsa' | 'language' | 'cs-core' | 'project') => void;
  onAddTaskToSprint: (taskTitle: string, durationMinutes: number) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onMarkTopicCompleted?: (topicName: string) => void;
}

export const MultimodalMentor: React.FC<MultimodalMentorProps> = ({
  profile,
  roadmapNodes,
  granularTopics = [],
  onAddNodeToRoadmap,
  onAddTaskToSprint,
  initialPrompt,
  onClearInitialPrompt,
  onMarkTopicCompleted,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello ${profile.name}! 👋 I am your **CareerQuest AI Personal Mentor, Tutor & Study Planner**.

I have loaded your profile and verified learning memory:
- **Target Goal:** ${profile.targetRole} at ${profile.targetCompany}
- **Academic Stage:** ${profile.degree} in ${profile.branch} (${profile.yearSemester})
- **Daily Pace:** ${profile.dailyStudyHours} hours/day
- **Completed Skills Memory:** Java Fundamentals & Arrays, DSA Complexity Basics, Basic Searching, DBMS Intro
- **Active Focus:** Java Strings & Two Pointers (In Progress), Recursion (Flagged for Revision)

**How can I help you excel today?**
- Ask technical concepts step-by-step (e.g. *"What should I learn in Java?"*, *"Explain recursion"*)
- Upload coding error screenshots or textbook/DSA questions using the photo/camera buttons
- Paste your code to enter **Code Explanation Mode**
- Request a personalized 2-hour daily study sprint!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'What should I learn in Java?', actionType: 'start-topic' },
        { label: 'What should I learn next?', actionType: 'start-topic' },
        { label: 'I can study 2 hours today.', actionType: 'create-study-plan' },
        { label: 'Explain recursion step by step.', actionType: 'explain-more' },
      ],
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved Questions storage (Section 14 & 15)
  const [savedQuestions, setSavedQuestions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('careerquest_saved_questions');
      return saved ? JSON.parse(saved) : [
        'What should I learn in Java?',
        'I don’t understand recursion.',
        'Why does my Java code show ArrayIndexOutOfBoundsException?',
      ];
    } catch {
      return [];
    }
  });
  const [isSavedQuestionsDrawerOpen, setIsSavedQuestionsDrawerOpen] = useState(false);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const codeFileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Persist saved questions
  useEffect(() => {
    try {
      localStorage.setItem('careerquest_saved_questions', JSON.stringify(savedQuestions));
    } catch {}
  }, [savedQuestions]);

  // Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputValue(transcript);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      showToast('Speech recognition is not supported in this browser.');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  };

  // Text-to-speech
  const handleSpeakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis is not available in your browser.');
      return;
    }

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeech = text
      .replace(/```[\s\S]*?```/g, 'Code snippet provided in text.')
      .replace(/[#*`_~|]/g, '')
      .replace(/\[.*?\]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setAttachedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Code File Upload handler (.java, .cpp, .py, .txt)
  const handleCodeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const textContent = reader.result as string;
      const snippet = `I need help understanding this code file (${file.name}):\n\n\`\`\`${file.name.endsWith('.py') ? 'python' : file.name.endsWith('.cpp') ? 'cpp' : 'java'}\n${textContent.slice(0, 3000)}\n\`\`\``;
      setInputValue(snippet);
      showToast(`Loaded ${file.name} into question box.`);
    };
    reader.readAsText(file);
  };

  // Save question for later
  const handleSaveQuestion = (qText: string) => {
    if (!qText.trim()) return;
    if (!savedQuestions.includes(qText.trim())) {
      setSavedQuestions((prev) => [qText.trim(), ...prev]);
      showToast('📌 Question saved to your study drawer!');
    } else {
      showToast('Question already in saved list.');
    }
  };

  // Send message with automatic client-side retry
  const handleSendMessage = async (textToSend?: string, isRetry = false) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent && !selectedImage) return;

    if (!isRetry) {
      setLastUserPrompt(messageContent);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    const imagePayload = selectedImage;
    setSelectedImage(null);
    setAttachedFileName(null);
    setIsLoading(true);

    // Call API with client-side retry
    const sendWithRetry = async (retryCount = 0): Promise<any> => {
      try {
        const roadmapSummary = roadmapNodes
          .slice(0, 10)
          .map((n) => `${n.title} (${n.status})`)
          .join(', ');

        const completedTopics = granularTopics
          .filter((t) => t.status === 'COMPLETED' || t.status === 'MASTERED')
          .map((t) => `${t.parentSkill}: ${t.name}`);
        const inProgressTopics = granularTopics
          .filter((t) => t.status === 'IN PROGRESS')
          .map((t) => `${t.parentSkill}: ${t.name} (${t.progressPercent || 50}%)`);
        const needsRevisionTopics = granularTopics
          .filter((t) => t.status === 'NEEDS REVISION')
          .map((t) => `${t.parentSkill}: ${t.name}`);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg],
            profile,
            roadmapContext: roadmapSummary,
            granularContext: {
              completedTopics,
              inProgressTopics,
              needsRevisionTopics,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('API busy');
        }

        return await response.json();
      } catch (err) {
        if (retryCount < 1) {
          await new Promise((r) => setTimeout(r, 1000));
          return sendWithRetry(retryCount + 1);
        }
        throw err;
      }
    };

    try {
      const data = await sendWithRetry();

      const mentorMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [],
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch {
      // Friendly, non-technical failure message (Section 14)
      const fallbackMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        role: 'assistant',
        content: `AI Mentor is temporarily busy. Your question is saved. Please try again in a moment.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Retry Question', actionType: 'retry' },
          { label: 'Save Question for Later', actionType: 'save-note' },
          { label: 'What should I study today?', actionType: 'create-study-plan' },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Action Buttons underneath assistant responses
  const handleActionClick = (action: ActionButton) => {
    switch (action.actionType) {
      case 'retry':
        if (lastUserPrompt) {
          handleSendMessage(lastUserPrompt, true);
        } else {
          handleSendMessage('What should I learn in Java?');
        }
        break;
      case 'start-topic':
        {
          const topic = action.payload?.topic || 'Strings';
          handleSendMessage(`Let's start learning ${topic}. Explain it step by step with a code example.`);
          onAddTaskToSprint(`Study ${topic}: Concepts & Implementation`, 45);
          showToast(`⚡ Started "${topic}" & added 45m block to Today's Sprint!`);
        }
        break;
      case 'revise-topic':
        {
          const topic = action.payload?.topic || 'Arrays';
          handleSendMessage(`I need a quick 15-minute diagnostic revision of ${topic}. What are the top 3 tricky edge cases tested by ${profile.targetCompany}?`);
          showToast(`⚠️ Scheduled revision drill for "${topic}"!`);
        }
        break;
      case 'explain-more':
        handleSendMessage('Can you explain this in greater depth with internal memory mechanics and step-by-step breakdown?');
        break;
      case 'simple-explanation':
        handleSendMessage('Can you explain this in very simple language using an intuitive real-world analogy?');
        break;
      case 'give-example':
        handleSendMessage('Please give me a clean, complete Java code example illustrating this with comments.');
        break;
      case 'give-practice':
        handleSendMessage('Give me 3 LeetCode problems (Easy, Medium, Hard) on this topic with hints and key patterns.');
        break;
      case 'create-study-plan':
        handleSendMessage(`I can study ${profile.dailyStudyHours} hours today. Create today's structured hourly study plan with time, difficulty, reason, and XP reward.`);
        break;
      case 'add-to-roadmap':
        {
          const topic = action.payload?.topic || 'Recursion & Backtracking Deep-Dive';
          onAddNodeToRoadmap(topic, 'dsa');
          showToast(`✨ Added "${topic}" directly to your interactive Career Roadmap!`);
        }
        break;
      case 'add-to-this-week':
        {
          const title = action.payload?.task || 'Mastery Practice: 2 LeetCode Mediums';
          onAddTaskToSprint(title, 45);
          showToast(`⚡ Added "${title}" to your Daily Sprint schedule!`);
        }
        break;
      case 'save-note':
        if (lastUserPrompt) {
          handleSaveQuestion(lastUserPrompt);
        } else {
          showToast('📌 Saved to your question collection!');
        }
        break;
      default:
        handleSendMessage(action.label);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick prompt chips
  const quickPrompts = [
    'What should I learn in Java?',
    'What should I learn next?',
    'I can study 2 hours today.',
    'I want to complete Java Arrays and Strings this week.',
    'Explain recursion step by step.',
    'Give me 5 array questions.',
    'How should I prepare for Microsoft?',
    'I already know Python.',
  ];

  return (
    <div className="relative flex flex-col h-[calc(100vh-65px)] bg-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-indigo-500/40 bg-indigo-950/90 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Mentor Header Profile Strip with Friendly Avatar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/70 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Friendly AI Mentor Avatar */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
              <Brain className="h-6 w-6 text-indigo-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">CareerQuest AI Personal Mentor</h3>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Active Tutor & Doubt Solver
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Mentoring <span className="text-slate-200 font-medium">{profile.name}</span> for{' '}
              <span className="text-cyan-300 font-semibold">{profile.targetRole} @ {profile.targetCompany}</span> ({profile.dailyStudyHours}h/day pace)
            </p>
          </div>
        </div>

        {/* Saved Questions Drawer Button & Sprint Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSavedQuestionsDrawerOpen(!isSavedQuestionsDrawerOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Bookmark className="h-3.5 w-3.5 text-amber-400" />
            <span>Saved Questions ({savedQuestions.length})</span>
          </button>
          <button
            onClick={() => handleSendMessage(`Create today's high-impact ${profile.dailyStudyHours}-hour study plan.`)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/40"
          >
            <CalendarPlus className="h-3.5 w-3.5 text-indigo-400" />
            <span>Today's Plan</span>
          </button>
        </div>
      </div>

      {/* Saved Questions Side Drawer */}
      {isSavedQuestionsDrawerOpen && (
        <div className="absolute top-[65px] right-4 z-40 w-80 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="font-bold text-xs text-white flex items-center gap-1.5">
              <Bookmark className="h-4 w-4 text-amber-400" /> Saved Questions
            </span>
            <button
              onClick={() => setIsSavedQuestionsDrawerOpen(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
            {savedQuestions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No saved questions yet.</p>
            ) : (
              savedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleSendMessage(q);
                    setIsSavedQuestionsDrawerOpen(false);
                  }}
                  className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-xs text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/40 cursor-pointer transition-all"
                >
                  <span className="line-clamp-2">{q}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 ml-2" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`relative max-w-3xl rounded-2xl p-4 sm:p-5 shadow-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border border-indigo-500/40'
                  : 'border border-slate-800 bg-slate-900/90 text-slate-100 shadow-slate-950/50'
              }`}
            >
              {/* Image Preview inside message */}
              {msg.imageUrl && (
                <div className="mb-3 overflow-hidden rounded-xl border border-slate-700 max-w-sm">
                  <img
                    src={msg.imageUrl}
                    alt="Uploaded question or error screenshot"
                    className="max-h-64 w-full object-cover"
                  />
                  <div className="bg-slate-950/80 px-2.5 py-1 text-[11px] text-slate-400 flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> Question / Screenshot Asset Analyzed
                  </div>
                </div>
              )}

              {/* Message Content formatted */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>

              {/* Message Footer Controls */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="flex items-center gap-1 hover:text-slate-200"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  {msg.role === 'user' && (
                    <button
                      onClick={() => handleSaveQuestion(msg.content)}
                      className="flex items-center gap-1 hover:text-amber-300"
                      title="Save this question"
                    >
                      <Bookmark className="h-3 w-3" />
                      <span>Save</span>
                    </button>
                  )}

                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleSpeakText(msg.id, msg.content)}
                      className={`flex items-center gap-1 hover:text-slate-200 ${
                        isSpeaking === msg.id ? 'text-indigo-400 font-bold' : ''
                      }`}
                      title="Read aloud"
                    >
                      {isSpeaking === msg.id ? (
                        <>
                          <VolumeX className="h-3 w-3" /> Stop Voice
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3" /> Listen
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Contextual Action Buttons beneath AI Responses */}
            {msg.role === 'assistant' && msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2 max-w-3xl">
                {msg.suggestedActions.map((action, actionIdx) => (
                  <button
                    key={actionIdx}
                    onClick={() => handleActionClick(action)}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-indigo-300 shadow-sm transition-all hover:border-indigo-400 hover:bg-indigo-950/60 hover:text-white"
                  >
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 max-w-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 animate-pulse">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">AI Mentor is analyzing your question...</p>
              <p className="text-[11px] text-slate-400">Step-by-step reasoning based on your target and completed skills</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel Bar */}
      <div className="border-t border-slate-800/60 bg-slate-950/90 px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Queries:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Multimodal Input Form (Section 4 & 5: [📎] [📷] [🎤] [Type your question...] [➤]) */}
      <div className="border-t border-slate-800 bg-slate-900/95 p-4 backdrop-blur-md">
        {/* Selected Image/File Preview before sending */}
        {selectedImage && (
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-slate-950 p-2.5">
            <img
              src={selectedImage}
              alt="Thumbnail"
              className="h-12 w-12 rounded-lg object-cover border border-slate-800"
            />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-slate-200">
                {attachedFileName ? attachedFileName : 'Image Attached'}
              </p>
              <p className="text-[11px] text-slate-400">
                Ready to analyze programming errors, IDE traces, or problem questions step-by-step
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedImage(null);
                setAttachedFileName(null);
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Hidden file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          <input
            type="file"
            ref={codeFileInputRef}
            onChange={handleCodeFileUpload}
            accept=".java,.py,.cpp,.c,.js,.ts,.txt,.sql"
            className="hidden"
          />

          {/* [📎] File / Code Attachment Button */}
          <button
            type="button"
            onClick={() => codeFileInputRef.current?.click()}
            className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            title="Upload code file (.java, .cpp, .py, .sql, .txt)"
          >
            <Paperclip className="h-4 w-4 text-slate-300" />
          </button>

          {/* [📷] Camera / Photo Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            title="Upload question screenshot, error message, or textbook page"
          >
            <Camera className="h-4 w-4 text-indigo-400" />
          </button>

          {/* [🎤] Voice Input Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`flex items-center justify-center rounded-xl border p-2.5 transition-all ${
              isRecording
                ? 'border-rose-500 bg-rose-950/80 text-rose-300 animate-pulse'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Speak your question using microphone"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-cyan-400" />}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask your Career Mentor anything (e.g. 'What is an array?', 'Explain recursion')..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* [➤] Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={(!inputValue.trim() && !selectedImage) || isLoading}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:brightness-110 disabled:opacity-40"
            title="Send question"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

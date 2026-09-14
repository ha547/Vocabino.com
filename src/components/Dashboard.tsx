import React, { useState } from "react";
import { TestSection, IeltsDatabase } from "../types/ielts";
import { ProgressState } from "../utils/storage";
import { CreatorProfileModal } from "./CreatorProfileModal";
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  Search,
  ShieldCheck,
  FileCheck,
  Download,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Users,
  Star,
  Target,
  Check,
  Play,
  Layers,
  Sparkle,
  Youtube,
  Newspaper,
  UserCheck,
  User
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  database: IeltsDatabase;
  progress: ProgressState;
  onSelectTest: (section: TestSection, id: number) => void;
  onSelectSection: (section: TestSection) => void;
  onOpenCertificate?: () => void;
  onSelectFullTests?: () => void;
  onOpenVerificationPortal?: () => void;
  onOpenBlog?: () => void;
  onOpenVideos?: () => void;
  onOpenCreatorProfile?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  database,
  progress,
  onSelectTest,
  onSelectSection,
  onOpenCertificate,
  onSelectFullTests,
  onOpenVerificationPortal,
  onOpenBlog,
  onOpenVideos,
  onOpenCreatorProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState<TestSection | "all">("all");
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  const handleOpenCreator = () => {
    if (onOpenCreatorProfile) {
      onOpenCreatorProfile();
    } else {
      setIsCreatorModalOpen(true);
    }
  };

  const completedCount = Object.keys(progress.completed).length;
  const totalCount = 80;
  const overallPercentage = Math.round((completedCount / totalCount) * 100);

  const sectionsInfo: {
    key: TestSection;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badgeColor: string;
    time: string;
    description: string;
    count: number;
    highlight: string;
  }[] = [
    {
      key: "reading",
      title: "Academic Reading",
      icon: BookOpen,
      color: "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      time: "60 mins • 3 passages • 40 Qs",
      description: "Authentic academic research papers, TFNG, matching headings, and sentence completions with instant answer analysis.",
      count: database.reading.length,
      highlight: "Split-view passage & question layout",
    },
    {
      key: "listening",
      title: "IELTS Listening",
      icon: Headphones,
      color: "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      time: "30 mins • 4 parts • 40 Qs",
      description: "High-clarity audio simulations ranging from daily social dialogues to university tutorials with auto-scoring.",
      count: database.listening.length,
      highlight: "Chronological audio playback engine",
    },
    {
      key: "writing",
      title: "Academic Writing",
      icon: PenTool,
      color: "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      time: "60 mins • Tasks 1 & 2",
      description: "Interactive visual chart descriptions plus Task 2 essays with instant AI criterion band scoring and grammar feedback.",
      count: database.writing.length,
      highlight: "Examiner AI 4-criterion evaluation",
    },
    {
      key: "speaking",
      title: "IELTS Speaking",
      icon: Mic,
      color: "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      time: "11–14 mins • 3 parts",
      description: "Examiner video prompts, Part 2 60-second preparation countdown, voice recording, live transcript, and AI speech analysis.",
      count: database.speaking.length,
      highlight: "Live voice recording & speech AI",
    },
  ];

  // Testimonials with human photos of students
  const studentTestimonials = [
    {
      name: "Sophia Lin",
      role: "Accepted to Univ. of Oxford",
      score: "Band 8.5",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      review: "The computer-delivered interface matches the real IDP exam precisely. Practicing all 20 full mock tests gave me the calm confidence to score Band 8.5 on my first try!",
      target: "L: 9.0 • R: 8.5 • W: 8.0 • S: 8.5",
    },
    {
      name: "Marcus Chen",
      role: "Emigrating to Vancouver, Canada",
      score: "Band 8.0",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
      review: "ApeUni and AlfaPTE are great, but Vocabino's AI writing feedback and speaking coach provide much deeper analysis of lexical resource and coherence. Outstanding platform!",
      target: "L: 8.5 • R: 8.5 • W: 7.5 • S: 8.0",
    },
    {
      name: "Amina Al-Mansoor",
      role: "Medical Residency, Melbourne",
      score: "Band 8.5",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      review: "Our institution verified my Test Report Form immediately. The direct cryptographic verification system with Vocabino Institute is seamless and trusted.",
      target: "L: 9.0 • R: 9.0 • W: 8.0 • S: 8.0",
    },
    {
      name: "David Adeleke",
      role: "Master of Science, Toronto",
      score: "Band 8.0",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      review: "Having 20 complete mock tests with real audio recordings and official timers makes all the difference. Scoring is strictly recorded from your highest attempt!",
      target: "L: 8.5 • R: 8.0 • W: 7.5 • S: 8.0",
    },
  ];

  // Filtered test catalog
  const filteredTests = (() => {
    const list: { section: TestSection; id: number; title: string; subtitle: string }[] = [];
    
    if (filterSection === "all" || filterSection === "reading") {
      database.reading.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "reading", id: t.id, title: t.title, subtitle: "3 passages • 40 questions • 60 mins" });
        }
      });
    }
    if (filterSection === "all" || filterSection === "listening") {
      database.listening.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "listening", id: t.id, title: t.title, subtitle: "4 parts • 40 questions • ~30 mins" });
        }
      });
    }
    if (filterSection === "all" || filterSection === "writing") {
      database.writing.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "writing", id: t.id, title: t.title, subtitle: `Task 1 (${t.task1_type}) + Task 2 Essay • 60 mins` });
        }
      });
    }
    if (filterSection === "all" || filterSection === "speaking") {
      database.speaking.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "speaking", id: t.id, title: t.title, subtitle: "Interview • Cue card • Discussion • 14 mins" });
        }
      });
    }
    return list;
  })();

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO SECTION (Vocabino Institute Aesthetic with Real Human Student Imagery & Elevated UI) */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-[0_4px_24px_rgba(15,23,42,0.04)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Vocabino Institute Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-blue-950">Vocabino Institute of Language & Testing</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">
                Official IELTS Academic Examination Platform
              </span>
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[44px] leading-tight">
              Master Academic IELTS with Real-Exam AI Practice & Scored Mocks
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Engineered for high-stakes test takers aiming for Band 7.5+. Practice with <strong>80 authentic practice tests</strong> across Reading, Listening, Writing, and Speaking, plus <strong>20 complete 4-skill mock simulations</strong> with live speech analysis and verifiable Test Report Forms.
            </p>

            {/* CTAs - BEAUTIFUL, MODERN BUTTONS WITH REFINED SHADOWS & HOVER STATES */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {onSelectFullTests && (
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onSelectFullTests}
                  className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 px-6 py-4 text-xs sm:text-sm font-black text-white shadow-[0_4px_16px_rgba(15,23,42,0.25)] border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20 group-hover:rotate-6 transition-transform">
                    <Layers className="h-4 w-4 text-amber-400" />
                  </span>
                  <span className="tracking-wide">Start 20 Full Mock Tests</span>
                  <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectSection("reading")}
                className="group inline-flex items-center gap-2.5 rounded-2xl border border-slate-300 bg-slate-100/80 px-5 py-4 text-xs sm:text-sm font-black text-slate-900 transition-all hover:bg-slate-200/90 hover:border-slate-400 cursor-pointer shadow-2xs"
              >
                <BookOpen className="h-4 w-4 text-blue-700 group-hover:scale-110 transition-transform" />
                <span>Practice by Section</span>
              </motion.button>

              {onOpenCertificate && (
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenCertificate}
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-slate-900 px-5 py-4 text-xs sm:text-sm font-black text-amber-300 border border-slate-700 hover:bg-slate-850 hover:border-amber-400/40 shadow-2xs transition-all cursor-pointer"
                >
                  <Award className="h-4 w-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>Official TRF Certificate</span>
                </motion.button>
              )}

              {/* About Creator & Owner CTA */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenCreator}
                className="group inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 px-5 py-4 text-xs sm:text-sm font-black text-amber-950 transition-all hover:bg-amber-100 hover:border-amber-400 shadow-2xs cursor-pointer"
                title="About Creator & Platform Owner: Hamid Ali"
              >
                <UserCheck className="h-4 w-4 text-amber-700 group-hover:scale-110 transition-transform" />
                <span>About Creator: Hamid Ali</span>
              </motion.button>
            </div>

            {/* Live Trust & Community Statistics Bar */}
            <div className="pt-3 grid grid-cols-3 gap-3 border-t border-slate-200/80">
              <div>
                <div className="flex items-center gap-1.5 text-slate-950 font-black text-xl sm:text-2xl tracking-tight">
                  <span>5 Million+</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 font-extrabold tracking-tight">Students Practicing Worldwide</p>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center gap-1 text-slate-900 font-black text-xl sm:text-2xl tracking-tight">
                  <span>80 Full Tests</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">20 per Skill • 100% Authentic</p>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center gap-1 text-emerald-700 font-black text-xl sm:text-2xl tracking-tight">
                  <span>Band 8.0+</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Recorded Highest Scores</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Craft Student Composition */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Photo Card */}
            <div className="relative w-full max-w-md">
              {/* Main Student Image */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80" 
                  alt="University Students preparing for IELTS Academic exam" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Photo Bottom Caption */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Real Computer-Delivered IELTS Experience</span>
                  </div>
                  <p className="text-[11px] text-slate-200 mt-0.5">
                    IDP & British Council format • Vocabino Institute (vocabino.com)
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Top Right High Scorer Badge */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-3 -right-3 sm:-right-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md flex items-center gap-3"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Student portrait" 
                  className="h-10 w-10 rounded-full object-cover border-2 border-emerald-400"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-extrabold text-slate-900">Sophia L.</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-black text-emerald-800">
                      Band 8.5
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Listening 9.0 • Reading 8.5</span>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left Vocabino Institute Accreditation */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleOpenCreator}
                className="absolute -bottom-4 -left-3 sm:-left-4 rounded-2xl border border-amber-300/80 bg-slate-950 text-white p-3 shadow-lg flex items-center gap-2.5 max-w-[270px] cursor-pointer hover:border-amber-400 transition"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black text-xs">
                  V
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-black text-amber-300 block truncate">
                    Vocabino Institute
                  </span>
                  <span className="text-[10px] text-slate-300 block truncate">
                    Created & Owned by Hamid Ali (IIUI) ↗
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. APEUNI & ALFAPTE STYLE: QUICK PRACTICE HUB (4 Core Skills) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Core Skill Practice Hub</h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                80 Tests Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose a section to practice individual authentic 20-test banks with official timer and instant scoring
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Progress:</span>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-800">
              {completedCount}/80 completed ({overallPercentage}%)
            </span>
          </div>
        </div>

        {/* 4 Skill Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectionsInfo.map(sec => {
            const Icon = sec.icon;
            let secDone = 0;
            for (let i = 1; i <= 20; i++) {
              if (progress.completed[`${sec.key}-${i}`]) secDone++;
            }
            const secPct = Math.round((secDone / 20) * 100);

            return (
              <div
                key={sec.key}
                onClick={() => onSelectSection(sec.key)}
                className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all cursor-pointer ${sec.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
                      <Icon className="h-5 w-5 text-slate-700 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold border ${sec.badgeColor}`}>
                      {secDone}/20 done
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-slate-950 transition-colors">
                    {sec.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {sec.time}
                  </p>
                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2">
                    {sec.description}
                  </p>

                  <div className="mt-2.5 inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    <Sparkle className="h-2.5 w-2.5 text-amber-500" />
                    <span>{sec.highlight}</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    <span>Practice Tests 1–20</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-slate-900 transition-all duration-300"
                      style={{ width: `${secPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 20 FULL MOCK SIMULATIONS (Sequenced 4-Skill Tests) */}
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
              <Sparkles className="h-3.5 w-3.5" />
              Complete Computer-Delivered Exam Simulation
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              20 Full Academic IELTS Mock Tests with AI Scoring
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the full 2 hour 45 minute exam: <strong>Listening (40 Qs) → Reading (40 Qs) → Writing (Tasks 1 & 2) → Speaking (Parts 1-3)</strong>. 
              Scores are automatically recorded from your highest achieved attempt and encrypted onto your official Test Report Form.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-amber-300 font-semibold pt-1">
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Genuine British Council Timers</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Speech & Essay AI Feedback</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Non-Editable Highest Scores</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onSelectFullTests && (
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSelectFullTests}
                className="group flex items-center justify-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 px-7 py-4 text-sm font-black text-slate-950 shadow-md transition-all cursor-pointer"
              >
                <Layers className="h-4 w-4 group-hover:rotate-6 transition-transform" />
                <span>Browse 20 Full Tests</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* 4. STUDENT SUCCESS & REAL TESTIMONIALS WITH HUMAN PORTRAITS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Student Success Stories</h2>
            <p className="text-xs text-slate-500">
              Over 5 Million students practicing worldwide — real candidates who achieved their target band with Vocabino Institute
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="ml-1 text-slate-800 font-extrabold">4.9 / 5.0 Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {studentTestimonials.map((st, idx) => (
            <div 
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={st.photo} 
                    alt={st.name} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-slate-300 shadow-2xs shrink-0" 
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{st.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{st.role}</p>
                    <span className="inline-block mt-0.5 rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-black text-emerald-800">
                      {st.score}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{st.review}"
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Verified TRF</span>
                <span className="font-bold text-slate-800">{st.target}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VOCABINO INSTITUTE & OFFICIAL TRF SECURITY */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 p-6 sm:p-8 shadow-md text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-black text-amber-300 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>Vocabino Institute of Language & Testing</span>
            </div>

            <h3 className="text-2xl font-serif font-black text-white">
              Official Examination System & Verifiable TRF Reports
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every IELTS Test Report Form generated on Vocabino is securely recorded and verifiable online. Created and engineered by <strong>Hamid Ali (IIUI)</strong>, test scores cannot be manually modified or fabricated — they are recorded strictly from the candidate's highest achieved score in completed tests.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Integrity Mandate</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">Non-Editable Highest Score Ledger</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verification Protocol</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">Zero Barcode/QR Scanning Criteria</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Framework Standards</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">Aligned with British Council & IDP</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            {onOpenCertificate && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenCertificate}
                className="flex items-center justify-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 px-6 py-3.5 text-xs sm:text-sm font-black text-slate-950 shadow-md transition-all cursor-pointer"
              >
                <Download className="h-4 w-4 text-slate-950" />
                <span>View My Official TRF Certificate</span>
              </motion.button>
            )}

            {onOpenVerificationPortal && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenVerificationPortal()}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-xs sm:text-sm font-black text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
              >
                <Search className="h-4 w-4 text-amber-400" />
                <span>Direct Verification Portal</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenCreator}
              className="flex items-center justify-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-6 py-3.5 text-xs sm:text-sm font-black text-amber-300 hover:bg-amber-400/20 transition-all cursor-pointer"
            >
              <UserCheck className="h-4 w-4 text-amber-400" />
              <span>About Creator: Hamid Ali</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* 6. IELTS STORIES, BLOG MASTERCLASSES & YOUTUBE VIDEO HUB */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stories & Blog Card */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-7 text-white shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-200">
              <Newspaper className="h-3.5 w-3.5 text-indigo-300" />
              <span>110+ In-Depth Articles & Case Studies</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              Candidate Stories, Band 9 Breakthroughs & Examiner Deconstructions
            </h3>

            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Read real test journeys from Band 6.0 to 8.5+, official Band 9 sample essays with examiner commentary, and curated C1/C2 academic vocabulary banks.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-indigo-300 font-semibold">
              SEO Optimized • Rich Visual Guides
            </span>

            {onOpenBlog && (
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenBlog}
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-slate-950 shadow-md hover:bg-slate-100 active:scale-95 transition cursor-pointer"
              >
                <span>Read Masterclasses</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>

        {/* YouTube Video Hub Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-7 text-white shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-500/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-red-300">
              <Youtube className="h-3.5 w-3.5 text-red-400" />
              <span>Embedded YouTube Streaming & Search</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              Watch Official IELTS Video Lessons & Search Any YouTube Topic
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stream curated lectures by former examiners and top educators for all 4 skills. Search all YouTube IELTS tutorials or paste any link to watch directly in Vocabino.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">
              HD Player • Key Timestamps • Practice Linkage
            </span>

            {onOpenVideos && (
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenVideos}
                className="group inline-flex items-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 px-5 py-3 text-xs font-black text-slate-950 shadow-md active:scale-95 transition cursor-pointer"
              >
                <span>Open Video Hub</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* 7. COMPREHENSIVE TEST CATALOG & SEARCH (All 80 Tests) */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">All 80 Practice Tests Directory</h2>
            <p className="text-xs text-slate-500">Filter by skill section or search by academic topic</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search test topic..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(["all", "reading", "listening", "writing", "speaking"] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setFilterSection(sec)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-colors ${
                    filterSection === sec
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sec === "all" ? "All (80)" : sec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test List Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map(t => {
            const isDone = !!progress.completed[`${t.section}-${t.id}`];
            const attempt = progress.attempts[`${t.section}-${t.id}`];

            return (
              <div
                key={`${t.section}-${t.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-400 hover:shadow-xs"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                        t.section === "reading"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : t.section === "listening"
                          ? "bg-cyan-50 text-cyan-800 border border-cyan-200"
                          : t.section === "writing"
                          ? "bg-amber-50 text-amber-900 border border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {t.section} #{t.id}
                    </span>
                    {isDone && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" />
                        {attempt?.band ? `Band ${attempt.band}` : "Done"}
                      </span>
                    )}
                  </div>
                  <h4 className="truncate text-sm font-bold text-slate-900">{t.title}</h4>
                  <p className="truncate text-xs text-slate-500">{t.subtitle}</p>
                </div>

                <button
                  onClick={() => onSelectTest(t.section, t.id)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                    isDone
                      ? "border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
                      : "bg-slate-900 text-white hover:bg-slate-800 hover:text-amber-300 active:scale-95"
                  }`}
                >
                  {isDone ? "Review" : "Start"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Creator & Owner Profile Modal (Hamid Ali) */}
      <CreatorProfileModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
      />
    </div>
  );
};

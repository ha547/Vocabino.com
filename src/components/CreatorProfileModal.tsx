import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Award,
  BookOpen,
  Code2,
  GraduationCap,
  Sparkles,
  User,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  PenTool,
  Globe2,
  Bookmark
} from "lucide-react";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200/90 z-10 scrollbar-none"
        >
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#09152b] via-[#0f244a] to-[#1a386d] p-6 sm:p-8 text-white">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close creator profile"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer ring-1 ring-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Verification Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300 border border-amber-400/30 mb-4 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Creator & Platform Owner</span>
            </div>

            {/* Hero Profile Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Creator Photo Avatar */}
              <div className="relative shrink-0 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(245,158,11,0.35)] ring-4 ring-white/15 bg-slate-900">
                <img
                  src="/creator-portrait.jpg"
                  alt="Hamid Ali"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-[#09152b]" title="Verified Creator & Author">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
              </div>

              {/* Name & Title */}
              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Hamid Ali
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-blue-200">
                  Developer • IELTS Educator • Writer • Researcher
                </p>

                {/* Key Meta Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-300 font-medium">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 border border-white/10">
                    <Calendar className="h-3 w-3 text-amber-300" />
                    <span>Born: 2003</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 border border-white/10">
                    <MapPin className="h-3 w-3 text-emerald-300" />
                    <span>Islamabad / Rawalpindi, Pakistan</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 border border-white/10">
                    <GraduationCap className="h-3 w-3 text-blue-300" />
                    <span>IIUI Alumnus / Scholar</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-7 text-slate-700">
            {/* Biography Narrative */}
            <div className="space-y-3.5 text-sm sm:text-[15px] leading-relaxed text-slate-600">
              <p>
                <strong className="text-slate-900 font-bold">Hamid Ali</strong> is a Pakistani developer, IELTS educator, writer and researcher associated with the <strong className="text-slate-900">International Islamic University Islamabad (IIUI)</strong>. Born in 2003, he has combined his interests in <span className="font-bold text-slate-800">English language, education, literature and technology</span> to develop digital learning solutions for students.
              </p>
              <p>
                He is the <strong className="text-blue-900 font-extrabold">creator and developer of this IELTS testing platform (Vocabino)</strong>, an independent educational technology project designed to provide students worldwide with a structured environment for authentic IELTS practice and computer-delivered examination simulations.
              </p>
              <p>
                Alongside technology and education, Hamid Ali has developed a body of literary work. He is the author of <em className="text-slate-900 font-semibold">A Day Below the Line</em>, <em className="text-slate-900 font-semibold">The Lost Happiness</em>, <em className="text-slate-900 font-semibold">Factual Shift to Adventures</em> and other literary and educational works.
              </p>
              <p>
                His work reflects an interest in <strong className="text-slate-900">human behaviour, education, literature, technology and contemporary society</strong>. Through his IELTS teaching and digital projects, he aims to make English-language learning and IELTS preparation more accessible to students.
              </p>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Notable Works Card */}
              <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-amber-50/40 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900 mb-3">
                  <Bookmark className="h-4 w-4 text-amber-600" />
                  <span>Notable Works & Publications</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>
                      <strong className="text-slate-900">Creator & Developer</strong> — IELTS Testing Platform (Vocabino)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>
                      <strong className="text-slate-900">Author</strong> — <em>A Day Below the Line</em>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>
                      <strong className="text-slate-900">Author</strong> — <em>The Lost Happiness</em>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>
                      <strong className="text-slate-900">Author</strong> — <em>Factual Shift to Adventures</em>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>
                      <strong className="text-slate-900">Author</strong> — <em>Awoken Love of Poetry</em>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Areas of Work Card */}
              <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-blue-50/40 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-900 mb-3">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <span>Areas of Work & Expertise</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "IELTS Education & Assessment",
                    "Web Development",
                    "Educational Technology",
                    "English Language & Linguistics",
                    "Literature & Creative Writing",
                    "Research",
                    "Digital Learning",
                  ].map((area) => (
                    <span
                      key={area}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-800 border border-slate-200/80 shadow-2xs"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Credentials Strip */}
            <div className="rounded-2xl bg-slate-900 p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-300">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">Affiliation & Alma Mater</div>
                  <div className="text-sm font-black text-white">International Islamic University Islamabad (IIUI)</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4 w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nationality</span>
                  <span className="font-bold text-white">Pakistani</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Born</span>
                  <span className="font-bold text-white">2003</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Platform</span>
                  <span className="font-bold text-amber-300">Vocabino</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Vocabino • Engineered & Owned by Hamid Ali
            </span>
            <button
              onClick={onClose}
              className="rounded-xl bg-[#09152b] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#14284d] transition-colors cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

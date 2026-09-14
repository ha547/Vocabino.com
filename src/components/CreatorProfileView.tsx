import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Layers,
  MapPin,
  PenTool,
  Sparkles,
  UserCheck,
  Maximize2,
  X,
  Upload,
  Heart,
  Globe2,
  FileText,
  Brain,
  ShieldCheck,
  ChevronRight,
  BookMarked
} from "lucide-react";
import { LingofiLogo } from "./LingofiLogo";
import defaultCreatorPortrait from "../assets/images/hamid_ali_portrait_1789365309782.jpg";

interface CreatorProfileViewProps {
  onBack: () => void;
  onNavigateToTest?: (tab: string) => void;
}

export const CreatorProfileView: React.FC<CreatorProfileViewProps> = ({
  onBack,
  onNavigateToTest,
}) => {
  // Lightbox modal for full-size viewing of creator's authentic photos without any modifications
  const [activePhotoModal, setActivePhotoModal] = useState<{
    src: string;
    title: string;
    caption: string;
  } | null>(null);

  // Local storage cache for user-uploaded custom photos if selected directly in browser
  const [customPortrait, setCustomPortrait] = useState<string | null>(() => {
    try {
      return localStorage.getItem("vocabino_creator_pic_1") || null;
    } catch {
      return null;
    }
  });

  const [customFullPhoto, setCustomFullPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem("vocabino_creator_pic_2") || null;
    } catch {
      return null;
    }
  });

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Handle local photo upload if the user wants to upload directly into browser
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetSlot: 1 | 2
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (targetSlot === 1) {
        setCustomPortrait(dataUrl);
        try {
          localStorage.setItem("vocabino_creator_pic_1", dataUrl);
        } catch (err) {
          console.warn("Storage quota exceeded", err);
        }
      } else {
        setCustomFullPhoto(dataUrl);
        try {
          localStorage.setItem("vocabino_creator_pic_2", dataUrl);
        } catch (err) {
          console.warn("Storage quota exceeded", err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Primary source paths: uses the permanent portrait asset, with fallback to public static path or local upload
  const pic1Src = customPortrait || defaultCreatorPortrait || "/creator-portrait.jpg";
  const pic2Src = customFullPhoto || defaultCreatorPortrait || "/creator-portrait.jpg";

  // State to track if image load encountered network 404 (fallback gracefully)
  const [pic1Loaded, setPic1Loaded] = useState(false);
  const [pic1Error, setPic1Error] = useState(false);
  const [pic2Loaded, setPic2Loaded] = useState(false);
  const [pic2Error, setPic2Error] = useState(false);

  // Keyboard shortcut: Esc to return to catalog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activePhotoModal) {
          setActivePhotoModal(null);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack, activePhotoModal]);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      {/* 1. TOP BREADCRUMB & BACK ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04, x: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
            className="group flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-black text-slate-800 shadow-2xs hover:bg-slate-100 hover:border-slate-400 transition cursor-pointer"
            title="Return to previous screen (or press Esc)"
          >
            <ArrowLeft className="h-4 w-4 text-slate-700 transition-transform group-hover:-translate-x-1" />
            <span>Back to Hub</span>
            <kbd className="hidden sm:inline-block rounded bg-white border border-slate-300 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 shadow-2xs">
              Esc
            </kbd>
          </motion.button>

          {/* Breadcrumb path */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Vocabino Institute</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span>Academic Leadership</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-extrabold text-blue-950">Hamid Ali</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {onNavigateToTest && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigateToTest("fulltests")}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-black text-white hover:bg-slate-800 transition shadow-2xs cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>20 Mock Tests</span>
            </motion.button>
          )}

          {onNavigateToTest && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigateToTest("verify")}
              className="hidden xs:flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-800 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verify TRF</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* 2. HERO PROFILE HEADER: STATELY VOCABINO BRANDING & CREATOR CREDENTIALS */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#020b18] via-[#091f42] to-[#123970] p-6 sm:p-10 text-white shadow-xl">
        {/* Subtle geometric light rings */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -ml-20 -mb-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Creator Identity & Narrative Badges */}
          <div className="lg:col-span-8 space-y-4">
            {/* Top Official Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-300 border border-amber-400/30 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Founder, Architect & Sole Owner</span>
              <span className="text-amber-300/50">•</span>
              <span className="text-white">Vocabino Institute</span>
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Hamid Ali
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl font-medium text-blue-200 max-w-2xl">
              Developer • IELTS Educator • Writer • Researcher
            </p>

            {/* Key Metadata Pill Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs sm:text-sm font-semibold text-slate-200">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 border border-white/10 backdrop-blur-xs">
                <Calendar className="h-4 w-4 text-amber-300" />
                <span>Born: <strong>2003</strong></span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 border border-white/10 backdrop-blur-xs">
                <MapPin className="h-4 w-4 text-emerald-300" />
                <span>Islamabad / Rawalpindi, Pakistan</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 border border-white/10 backdrop-blur-xs">
                <GraduationCap className="h-4 w-4 text-blue-300" />
                <span>International Islamic University Islamabad (IIUI)</span>
              </span>
            </div>

            {/* Vision Quote Box */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 mt-4 backdrop-blur-xs">
              <p className="font-serif text-sm sm:text-base italic leading-relaxed text-slate-100">
                &ldquo;By synthesizing English linguistics, pedagogical assessment standards, and modern web engineering, Vocabino provides an accessible, authentic computer-delivered testing environment for students worldwide.&rdquo;
              </p>
              <div className="mt-2 text-xs font-bold text-amber-300">
                — Hamid Ali, Founder & Author of <em>The Lost Happiness</em>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Photo & Creator Seal */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start lg:items-center justify-center space-y-4">
            <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-200 to-blue-400 shadow-2xl w-full max-w-xs">
              <div className="rounded-[22px] bg-[#030e22] p-5 text-center flex flex-col items-center space-y-3">
                {/* Official Portrait Photo on Profile */}
                <div className="relative overflow-hidden rounded-2xl ring-4 ring-amber-400/40 shadow-xl w-44 h-56 sm:w-48 sm:h-60 bg-slate-900 flex items-center justify-center group">
                  <img
                    src={pic1Src}
                    alt="Hamid Ali - Founder & Creator, Vocabino Institute"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-[#030e22] shadow-md" title="Verified Creator & Platform Owner">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <button
                    onClick={() =>
                      setActivePhotoModal({
                        src: pic1Src,
                        title: "Hamid Ali — Official Portrait",
                        caption:
                          "Founder, Lead Architect & Platform Owner of Vocabino Institute. Student of English Language & Literature at IIUI.",
                      })
                    }
                    aria-label="View photo in full size"
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950/80 text-white backdrop-blur-md hover:bg-slate-900 transition cursor-pointer ring-1 ring-white/20 opacity-0 group-hover:opacity-100"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-center space-y-0.5">
                  <h3 className="text-base sm:text-lg font-black text-white">Hamid Ali</h3>
                  <p className="text-xs text-amber-300 font-extrabold">Creator & Sole Owner</p>
                  <p className="text-[11px] text-slate-400">IIUI Islamabad, Pakistan</p>
                </div>

                <div className="w-full border-t border-slate-800 pt-3 text-left space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Institute:</span>
                    <strong className="text-white">Vocabino</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Affiliation:</span>
                    <strong className="text-white">IIUI Pakistan</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <strong className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified Official
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE CREATOR PICTURES SHOWCASE */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700">
              <Award className="h-4 w-4 text-amber-600" />
              <span>Authentic Visual Archives</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-900">
              Creator Photographic Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Preserved in original fidelity without alteration or filters, exactly as provided.
            </p>
          </div>

          {/* Hidden file inputs for local direct uploads */}
          <input
            type="file"
            ref={fileInputRef1}
            onChange={(e) => handleFileUpload(e, 1)}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={fileInputRef2}
            onChange={(e) => handleFileUpload(e, 2)}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef1.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              title="Select custom portrait photo from device"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              <span>Update Portrait</span>
            </button>
            <button
              onClick={() => fileInputRef2.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              title="Select custom campus photo from device"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              <span>Update Campus Photo</span>
            </button>
          </div>
        </div>

        {/* Two Photo Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PHOTO 1: Official Portrait */}
          <div className="group relative rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-all hover:shadow-lg">
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
              <img
                src={pic1Src}
                alt="Hamid Ali - Founder & Academic Director, Vocabino"
                referrerPolicy="no-referrer"
                onLoad={() => {
                  setPic1Loaded(true);
                  setPic1Error(false);
                }}
                onError={() => {
                  setPic1Error(true);
                  setPic1Loaded(false);
                }}
                className={`max-h-[500px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] ${
                  pic1Error ? "hidden" : "block"
                }`}
              />

              {/* Fallback Display if image file is not loaded */}
              {pic1Error && (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 font-serif font-black text-4xl text-slate-950 shadow-xl ring-4 ring-white/10">
                    HA
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">Hamid Ali</h4>
                    <p className="text-xs text-slate-300 max-w-xs">
                      Primary Portrait Profile • Developer & Author of <em>The Lost Happiness</em>
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef1.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-300 transition cursor-pointer shadow-md"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Portrait Photo</span>
                  </button>
                </div>
              )}

              {/* Lightbox Trigger Button */}
              {!pic1Error && (
                <button
                  onClick={() =>
                    setActivePhotoModal({
                      src: pic1Src,
                      title: "Hamid Ali — Official Portrait",
                      caption:
                        "Founder, Lead Architect & Platform Owner of Vocabino Institute. Student of English Language & Literature at IIUI.",
                    })
                  }
                  aria-label="View photo full size"
                  className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/80 text-white backdrop-blur-md hover:bg-slate-900 active:scale-95 transition shadow-lg cursor-pointer ring-1 ring-white/20"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Photo Metadata Footer */}
            <div className="pt-4 px-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-900">
                  Portrait Profile
                </span>
                <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[10px] font-black text-amber-900 border border-amber-200">
                  Official Portrait
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Hamid Ali — Academic Technologist & Educator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Primary creator portrait. Leading the development of computer-delivered IELTS simulation software, automated scoring algorithms, and open learning platforms.
              </p>
            </div>
          </div>

          {/* PHOTO 2: Campus & Research Archive */}
          <div className="group relative rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition-all hover:shadow-lg">
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
              <img
                src={pic2Src}
                alt="Hamid Ali - Campus & Evening Study, Islamabad"
                referrerPolicy="no-referrer"
                onLoad={() => {
                  setPic2Loaded(true);
                  setPic2Error(false);
                }}
                onError={() => {
                  setPic2Error(true);
                  setPic2Loaded(false);
                }}
                className={`max-h-[500px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] ${
                  pic2Error ? "hidden" : "block"
                }`}
              />

              {/* Fallback Display if image file is not loaded */}
              {pic2Error && (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 font-serif font-black text-4xl text-white shadow-xl ring-4 ring-white/10">
                    HA
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">
                      Campus & Evening Study
                    </h4>
                    <p className="text-xs text-slate-300 max-w-xs">
                      Campus Life & Research Environment • Islamabad / Rawalpindi
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef2.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-xs font-black text-white hover:bg-blue-600 transition cursor-pointer shadow-md"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Campus Photo</span>
                  </button>
                </div>
              )}

              {/* Lightbox Trigger Button */}
              {!pic2Error && (
                <button
                  onClick={() =>
                    setActivePhotoModal({
                      src: pic2Src,
                      title: "Hamid Ali — Campus & Evening Study",
                      caption:
                        "Authentic candid photo taken on campus in Islamabad. Preserved completely in original aspect ratio and resolution without edits.",
                    })
                  }
                  aria-label="View photo full size"
                  className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/80 text-white backdrop-blur-md hover:bg-slate-900 active:scale-95 transition shadow-lg cursor-pointer ring-1 ring-white/20"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Photo Metadata Footer */}
            <div className="pt-4 px-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                  Campus Environment
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  Islamabad / Rawalpindi
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Hamid Ali on Campus in Islamabad
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full-length evening photograph at the International Islamic University Islamabad. Embodying the intersection of student life, literary thought, and educational engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IN-DEPTH BIOGRAPHY & ACADEMIC BACKGROUND */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-900">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <span>Academic Biography</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-900">
            About Hamid Ali
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Narrative Column */}
          <div className="lg:col-span-8 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>
              <strong className="text-slate-950 font-extrabold">Hamid Ali</strong> is a Pakistani software developer, IELTS educator, writer, and researcher associated with the <strong className="text-slate-950">International Islamic University Islamabad (IIUI)</strong>. Born in 2003, he has dedicated his work to combining his passions in <span className="font-bold text-slate-900">English language linguistics, pedagogical assessment, world literature, and computer technology</span> to architect accessible digital learning environments for students globally.
            </p>

            <p>
              He is the <strong className="text-blue-950 font-black">creator, developer, and sole platform owner of Vocabino Institute</strong>. The platform was established as an independent educational technology project to eliminate the financial and logistical barriers that often hinder candidates preparing for international examinations such as IELTS Academic.
            </p>

            <p>
              Recognizing that existing commercial preparation materials frequently lock full-length simulations behind steep subscriptions, Hamid engineered a comprehensive testing portal comprising <strong className="text-slate-900">80 authentic modular practice tests</strong> (20 Reading, 20 Listening, 20 Writing, 20 Speaking) and <strong className="text-slate-900">20 complete 4-skill full simulation tests</strong> complete with automated timing, instant scoring, AI feedback, and official Test Report Form (TRF) generation.
            </p>

            <p>
              Alongside software development and education, Hamid Ali is a published literary author. His literary portfolio includes <em className="text-slate-900 font-bold">The Lost Happiness</em>, <em className="text-slate-900 font-bold">A Day Below the Line</em>, <em className="text-slate-900 font-bold">Factual Shift to Adventures</em>, and <em className="text-slate-900 font-bold">Awoken Love of Poetry</em>. His writings examine human resilience, cognitive psychology, social dynamics, and existential philosophical inquiry.
            </p>
          </div>

          {/* Key Facts Quick Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                Executive Profile Summary
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block">Full Name:</span>
                  <strong className="text-slate-900 text-sm">Hamid Ali</strong>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">Year of Birth:</span>
                  <strong className="text-slate-900 text-sm">2003</strong>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">Current Residence:</span>
                  <strong className="text-slate-900 text-sm">Islamabad / Rawalpindi, Pakistan</strong>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">University:</span>
                  <strong className="text-slate-900 text-sm">
                    International Islamic University Islamabad (IIUI)
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">Academic Department:</span>
                  <strong className="text-slate-900 text-sm">
                    Department of English Language & Literature
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">Primary Roles:</span>
                  <strong className="text-blue-900 text-sm">
                    Developer • IELTS Educator • Writer • Researcher
                  </strong>
                </div>
              </div>
            </div>

            {/* Platform Verification Card */}
            <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span>Verified Independent Platform</span>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                Vocabino is maintained under Hamid Ali's autonomous academic stewardship, adhering strictly to Cambridge ESOL and IDP alignment criteria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LITERARY & RESEARCH WORKS SECTION */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800">
            <BookMarked className="h-4 w-4 text-amber-600" />
            <span>Authored Books & Creative Oeuvre</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-900">
            Publications & Literary Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Explorations of human condition, psychological depth, poetry, and cognitive resilience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Work 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                Philosophical Prose
              </span>
              <h3 className="font-serif text-base font-black text-slate-900">
                The Lost Happiness
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authored by Hamid Ali at IIUI. A reflective inquiry into internal serenity, modern alienation, and rediscovering human contentment through introspection.
            </p>
          </div>

          {/* Work 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                Social Commentary
              </span>
              <h3 className="font-serif text-base font-black text-slate-900">
                A Day Below the Line
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              An empathetic examination of socioeconomic realities, examining the lived experiences and everyday struggles of marginalized communities.
            </p>
          </div>

          {/* Work 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Narrative Fiction
              </span>
              <h3 className="font-serif text-base font-black text-slate-900">
                Factual Shift to Adventures
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              A vibrant journey tracing the transition from structured factual thinking to imaginative discovery, curiosity, and creative courage.
            </p>
          </div>

          {/* Work 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-purple-400 hover:shadow-md transition space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
              <PenTool className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                Verse Collection
              </span>
              <h3 className="font-serif text-base font-black text-slate-900">
                Awoken Love of Poetry
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              A lyrical anthological work celebrating romanticism, spiritual longing, and rhythm in the English language and classical verse forms.
            </p>
          </div>
        </div>
      </section>

      {/* 6. VOCABINO PLATFORM ARCHITECTURE & PEDAGOGICAL PILLARS */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 sm:p-10 text-white shadow-xl space-y-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
            <Brain className="h-4 w-4 text-amber-400" />
            <span>Educational Engineering</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-white">
            Architecture of Vocabino Institute
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Engineered by Hamid Ali from the ground up to solve critical deficiencies in conventional IELTS test prep portals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 backdrop-blur-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 font-black">
              01
            </div>
            <h4 className="text-base font-bold text-white">Authentic Computer-Delivered UX</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Replicates the actual IDP and British Council exam interface with dual-pane reading passages, audio controls, live word counters, and strict timed countdown clocks.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 backdrop-blur-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 font-black">
              02
            </div>
            <h4 className="text-base font-bold text-white">Examiner Intelligence Brain</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Custom scoring matrix evaluating candidate writing across Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range with instant Band feedback.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 backdrop-blur-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-black">
              03
            </div>
            <h4 className="text-base font-bold text-white">Cryptographic TRF Verification</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every completed full mock test generates an authentic Test Report Form with a unique verification code that can be verified in real time on Vocabino's public verification portal.
            </p>
          </div>
        </div>

        {/* Bottom Quote by Hamid Ali */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LingofiLogo size="sm" variant="white" />
            <span className="text-xs text-slate-400 font-semibold">
              Vocabino Institute • Founded by Hamid Ali (IIUI)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToTest && (
              <button
                onClick={() => onNavigateToTest("fulltests")}
                className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-300 transition cursor-pointer shadow-md"
              >
                Launch Mock Simulation
              </button>
            )}
            <button
              onClick={onBack}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      </section>

      {/* 7. FULL-SCREEN LIGHTBOX MODAL FOR PRESERVING CREATOR'S UNMODIFIED PHOTOS */}
      <AnimatePresence>
        {activePhotoModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePhotoModal(null)}
              className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg cursor-zoom-out"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 max-h-[95vh] max-w-4xl w-full flex flex-col rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <h3 className="text-sm font-black text-white">
                    {activePhotoModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePhotoModal(null)}
                  className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Photo Area (Uncropped, Full Resolution) */}
              <div className="flex-1 bg-black flex items-center justify-center p-4 min-h-[400px]">
                <img
                  src={activePhotoModal.src}
                  alt={activePhotoModal.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
                />
              </div>

              {/* Caption Footer */}
              <div className="border-t border-slate-800 bg-slate-950/80 p-4 px-6 text-xs text-slate-300">
                <p>{activePhotoModal.caption}</p>
                <span className="text-[10px] text-amber-400 font-bold block mt-1">
                  100% Unmodified Original Photograph • Hamid Ali Visual Archive
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

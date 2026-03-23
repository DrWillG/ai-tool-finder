"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SmoothScroll from "./components/SmoothScroll";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import QuizStep from "./components/QuizStep";
import Results from "./components/Results";
import { SUBJECTS } from "./data/subjects";
import { scoreTools, type Answers, type ScoredTool } from "./lib/scoring";

type Phase = "hero" | "quiz" | "loading" | "results";

const STEP_VARIANTS = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const TRANSITION = {
  duration: 0.35,
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

export default function Home() {
  const [phase, setPhase] = useState<Phase>("hero");
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [results, setResults] = useState<ScoredTool[]>([]);

  const scrollToTop = useCallback(() => {
    const lenis = (
      window as unknown as Record<
        string,
        { scrollTo: (target: number, options?: Record<string, unknown>) => void }
      >
    ).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setStep(1);
    scrollToTop();
  }, [scrollToTop]);

  const handleSelect = useCallback(
    (stepNum: number, value: string) => {
      const newAnswers = { ...answers };

      switch (stepNum) {
        case 1:
          newAnswers.grade = value;
          break;
        case 2:
          newAnswers.subject = value;
          break;
        case 3:
          newAnswers.ecosystem = value;
          break;
        case 4:
          newAnswers.need = value;
          break;
        case 5:
          newAnswers.budget = value;
          break;
      }

      setAnswers(newAnswers);

      // Auto-advance after selection
      setTimeout(() => {
        if (stepNum < 5) {
          setStep(stepNum + 1);
        } else {
          // Show loading then results
          setPhase("loading");
          scrollToTop();
          setTimeout(() => {
            const scored = scoreTools(newAnswers as Answers);
            setResults(scored);
            setPhase("results");
            scrollToTop();
          }, 1600);
        }
      }, 200);
    },
    [answers, scrollToTop]
  );

  const handleReset = useCallback(() => {
    setAnswers({});
    setResults([]);
    setStep(1);
    setPhase("hero");
    scrollToTop();
  }, [scrollToTop]);

  const handleTabClick = useCallback(
    (tabNum: number) => {
      const answerKeys: (keyof Answers)[] = [
        "grade",
        "subject",
        "ecosystem",
        "need",
        "budget",
      ];
      if (answers[answerKeys[tabNum - 1]] !== undefined || tabNum === step) {
        setStep(tabNum);
      }
    },
    [answers, step]
  );

  // Get subjects for current grade
  const gradeSubjects = answers.grade
    ? (SUBJECTS[answers.grade] || SUBJECTS.all).map((s) => ({
        id: s.id,
        label: s.t,
        description: s.d,
        icon: s.t.charAt(0),
      }))
    : [];

  return (
    <>
      <SmoothScroll />
      <Nav />

      {/* Hero */}
      {phase === "hero" && <Hero onStart={handleStart} />}

      {/* Quiz */}
      {phase === "quiz" && (
        <div className="max-w-[580px] mx-auto px-5 pt-[calc(56px+clamp(32px,6vh,48px))] pb-24">
          {/* Tab bar */}
          <div
            className="flex gap-0 mb-9"
            style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
          >
            {["Grade", "Subject", "Ecosystem", "Need", "Budget"].map(
              (label, i) => {
                const tabNum = i + 1;
                const answerKeys: (keyof Answers)[] = [
                  "grade",
                  "subject",
                  "ecosystem",
                  "need",
                  "budget",
                ];
                const isDone = answers[answerKeys[i]] !== undefined;
                const isActive = step === tabNum;

                return (
                  <div
                    key={label}
                    onClick={() => handleTabClick(tabNum)}
                    className={`flex-1 py-2.5 text-xs font-medium text-center transition-all duration-200 ${
                      isActive
                        ? "text-accent border-b-2 border-accent"
                        : isDone
                        ? "text-success cursor-pointer border-b-2 border-transparent"
                        : "border-b-2 border-transparent cursor-default"
                    }`}
                    style={
                      !isActive && !isDone
                        ? { color: "rgba(255,255,255,0.2)" }
                        : isActive
                        ? { color: "#8c85ff", borderBottomColor: "#8c85ff" }
                        : undefined
                    }
                  >
                    {label}
                  </div>
                );
              }
            )}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={STEP_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={TRANSITION}
            >
              {step === 1 && (
                <QuizStep
                  stepNumber={1}
                  question="Grade level?"
                  hint="Helps us match tools to your students."
                  selected={answers.grade || null}
                  onSelect={(v) => handleSelect(1, v)}
                  options={[
                    {
                      id: "k2",
                      label: "K \u2013 2",
                      description: "Early elementary",
                      icon: "K-2",
                    },
                    {
                      id: "35",
                      label: "3 \u2013 5",
                      description: "Upper elementary",
                      icon: "3-5",
                    },
                    {
                      id: "68",
                      label: "6 \u2013 8",
                      description: "Middle school",
                      icon: "6-8",
                    },
                    {
                      id: "912",
                      label: "9 \u2013 12",
                      description: "High school",
                      icon: "9+",
                    },
                    {
                      id: "all",
                      label: "District-wide",
                      description: "Across grade levels",
                      icon: "All",
                    },
                  ]}
                />
              )}

              {step === 2 && (
                <QuizStep
                  stepNumber={2}
                  question="Subject?"
                  hint="Tools built for your content area."
                  selected={answers.subject || null}
                  onSelect={(v) => handleSelect(2, v)}
                  useGrid
                  options={gradeSubjects}
                />
              )}

              {step === 3 && (
                <QuizStep
                  stepNumber={3}
                  question="Your school's ecosystem?"
                  hint="Tools that integrate with your platform."
                  selected={answers.ecosystem || null}
                  onSelect={(v) => handleSelect(3, v)}
                  options={[
                    {
                      id: "google",
                      label: "Google Workspace",
                      description: "Chromebooks, Classroom, Docs",
                      icon: "G",
                    },
                    {
                      id: "microsoft",
                      label: "Microsoft 365",
                      description: "Teams, OneNote, PowerPoint",
                      icon: "M",
                    },
                    { id: "mixed", label: "Mixed / Not sure", icon: "B" },
                  ]}
                />
              )}

              {step === 4 && (
                <QuizStep
                  stepNumber={4}
                  question="Biggest need?"
                  hint="We'll prioritize your top challenge."
                  selected={answers.need || null}
                  onSelect={(v) => handleSelect(4, v)}
                  options={[
                    {
                      id: "save_time",
                      label: "Save time on planning & grading",
                      icon: "\u23F1",
                    },
                    {
                      id: "differentiate",
                      label: "Differentiate for diverse learners",
                      icon: "\u2696",
                    },
                    {
                      id: "engage",
                      label: "Create engaging content",
                      icon: "\u26A1",
                    },
                    {
                      id: "assess",
                      label: "Better assessments & feedback",
                      icon: "\u270E",
                    },
                    {
                      id: "detect",
                      label: "Detect AI-generated work",
                      icon: "\uD83D\uDD0D",
                    },
                    {
                      id: "student_ai",
                      label: "Teach students to use AI well",
                      icon: "\uD83E\uDD16",
                    },
                  ]}
                />
              )}

              {step === 5 && (
                <QuizStep
                  stepNumber={5}
                  question="Budget?"
                  hint="Most top tools have free tiers."
                  selected={answers.budget || null}
                  onSelect={(v) => handleSelect(5, v)}
                  options={[
                    { id: "free", label: "Free only", icon: "$0" },
                    { id: "low", label: "Under $20/month", icon: "$$" },
                    {
                      id: "district",
                      label: "District can purchase",
                      icon: "DST",
                    },
                  ]}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Loading */}
      {phase === "loading" && (
        <div className="flex flex-col items-center justify-center pt-[calc(56px+80px)] pb-20 px-5">
          <div
            className="w-8 h-8 rounded-full mb-5"
            style={{
              border: "2px solid rgba(103,61,230,0.12)",
              borderTopColor: "var(--color-accent)",
              animation: "spin 0.6s linear infinite",
            }}
          />
          <div
            className="text-base font-bold text-ink"
            style={{ letterSpacing: "-0.5px" }}
          >
            Building your toolkit
          </div>
          <div className="text-[13px] text-ink-secondary mt-1">
            Matching tools to your profile
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Results */}
      {phase === "results" && results.length > 0 && (
        <div className="pt-[calc(56px+clamp(32px,6vh,48px))]">
          <Results
            tools={results}
            answers={answers as Answers}
            onReset={handleReset}
          />
        </div>
      )}

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center mt-16"
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          background: "rgba(19, 10, 46, 0.6)",
        }}
      >
        <div className="flex justify-center mb-2">
          <img
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/AoPGRoQEpqhB0VyW/wordpress-transparent-AE04Jj2yR1cR3NRw.png"
            alt="The Right Path"
            className="h-7 opacity-70"
          />
        </div>
        <div
          className="text-[13px] font-bold text-white"
          style={{ letterSpacing: "-0.2px" }}
        >
          The Right Path Educational Consulting
        </div>
        <div
          className="text-[10px] mt-0.5"
          style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}
        >
          EDUCATE &middot; EMPLOY &middot; EMPOWER
        </div>
        <div className="text-xs mt-2.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          contactus@rightpathed.com &middot; 310-497-9072
        </div>
        <div
          className="max-w-[480px] mx-auto mt-4 pt-3 text-[9px] leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.15)",
            borderTop: "0.5px solid rgba(255,255,255,0.04)",
          }}
        >
          For informational purposes only. Not legal advice or endorsement. All
          tools must be vetted by your district. Comply with FERPA, COPPA, CIPA,
          and district policies. No liability assumed. &copy;{" "}
          {new Date().getFullYear()} The Right Path Educational Consulting.
        </div>
      </footer>
    </>
  );
}

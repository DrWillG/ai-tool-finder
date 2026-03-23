"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface Option {
  id: string;
  label: string;
  description?: string;
  icon: string;
}

interface QuizStepProps {
  stepNumber: number;
  question: string;
  hint: string;
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
  useGrid?: boolean;
}

export default function QuizStep({
  stepNumber,
  question,
  hint,
  options,
  selected,
  onSelect,
  useGrid = false,
}: QuizStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current.querySelectorAll(".step-header > *"),
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.06 }
    );

    if (optionsRef.current) {
      tl.fromTo(
        optionsRef.current.children,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power2.out", stagger: 0.04 },
        "-=0.2"
      );
    }
  }, []);

  return (
    <div ref={containerRef}>
      <div className="step-header">
        <div
          className="text-[11px] font-medium mb-2"
          style={{
            color: "#8c85ff",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Step {stepNumber}
        </div>
        <div
          className="text-[clamp(22px,4vw,30px)] font-bold leading-[1.15] text-white mb-1.5"
          style={{ letterSpacing: "-1px" }}
        >
          {question}
        </div>
        <div className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
          {hint}
        </div>
      </div>

      <div
        ref={optionsRef}
        className={
          useGrid
            ? "grid grid-cols-2 max-[480px]:grid-cols-1 gap-[0.5px]"
            : "flex flex-col"
        }
        style={useGrid ? { background: "rgba(255,255,255,0.04)" } : undefined}
      >
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150"
            style={{
              background:
                selected === opt.id
                  ? "rgba(103, 61, 230, 0.12)"
                  : useGrid
                  ? "rgba(19, 10, 46, 0.95)"
                  : "transparent",
              borderBottom: !useGrid
                ? "0.5px solid rgba(255,255,255,0.05)"
                : undefined,
            }}
            onMouseEnter={(e) => {
              if (selected !== opt.id) {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.04)";
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== opt.id) {
                (e.currentTarget as HTMLElement).style.background = useGrid
                  ? "rgba(19, 10, 46, 0.95)"
                  : "transparent";
              }
            }}
          >
            <div
              className="w-8 h-8 rounded-md grid place-items-center text-[13px] font-bold shrink-0"
              style={{
                background: "rgba(103, 61, 230, 0.15)",
                color: "#8c85ff",
              }}
            >
              {opt.icon}
            </div>
            <div>
              <div
                className="text-sm font-medium text-white"
                style={{ letterSpacing: "-0.2px" }}
              >
                {opt.label}
              </div>
              {opt.description && (
                <div
                  className="text-[11px] mt-0.5"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {opt.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ScoredTool, Answers } from "../lib/scoring";
import { getSubjectName } from "../lib/scoring";
import { GRADE_LABELS, ECO_LABELS } from "../data/subjects";

gsap.registerPlugin(ScrollTrigger);

interface ResultsProps {
  tools: ScoredTool[];
  answers: Answers;
  onReset: () => void;
}

function StarRating({ rating }: { rating: string }) {
  const r = parseFloat(rating);
  const full = Math.floor(r);
  const half = r - full >= 0.3;
  let stars = "";
  for (let i = 0; i < full; i++) stars += "\u2605";
  if (half) stars += "\u2606";
  return <span className="star-filled text-[11px] tracking-wider">{stars}</span>;
}

function PricingBadge({ pt }: { pt: string }) {
  if (pt === "f")
    return (
      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
        style={{ background: "rgba(0,176,144,0.15)", color: "#00d4a8" }}
      >
        Free
      </span>
    );
  if (pt === "fm")
    return (
      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
        style={{ background: "rgba(53,125,249,0.15)", color: "#6da3ff" }}
      >
        Free tier
      </span>
    );
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
      style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}
    >
      Paid
    </span>
  );
}

export default function Results({ tools, answers, onReset }: ResultsProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const subjectName = getSubjectName(answers.subject, answers.grade);
  const profileTag = `${subjectName} \u00B7 ${GRADE_LABELS[answers.grade] || answers.grade} \u00B7 ${ECO_LABELS[answers.ecosystem] || answers.ecosystem}`;
  const dateStr = new Date("2026-03-22T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const grouped: Record<string, ScoredTool[]> = {};
  tools.forEach((t) => {
    if (!grouped[t.tool.c]) grouped[t.tool.c] = [];
    grouped[t.tool.c].push(t);
  });

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.08 }
      );
    }

    if (listRef.current) {
      const items = listRef.current.querySelectorAll(".tool-item");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.15 + i * 0.06,
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }

    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [tools]);

  return (
    <div className="max-w-[580px] mx-auto px-5 pb-6">
      {/* Header */}
      <div ref={headerRef} className="text-center mb-9">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3.5"
          style={{
            background: "rgba(103, 61, 230, 0.15)",
            border: "0.5px solid rgba(140, 133, 255, 0.2)",
          }}
        >
          <span className="w-[5px] h-[5px] rounded-full" style={{ background: "#8c85ff" }} />
          <span className="text-[11px] font-medium" style={{ color: "#8c85ff" }}>
            {profileTag}
          </span>
        </div>
        <h2
          className="text-[clamp(26px,5vw,36px)] font-bold text-white mb-1.5"
          style={{ letterSpacing: "-1.5px" }}
        >
          Your{" "}
          <span style={{ color: "rgba(255,255,255,0.25)" }}>AI Toolkit</span>
        </h2>
        <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Curated for your subject, grade, and ecosystem.
        </div>
        <div
          className="text-[11px] mt-2 flex items-center justify-center gap-1.5"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <span className="w-[5px] h-[5px] rounded-full bg-success" />
          Updated {dateStr}
        </div>
      </div>

      {/* Tool list */}
      <div ref={listRef}>
        {Object.entries(grouped).map(([category, categoryTools]) => (
          <div key={category}>
            <div
              className="flex items-baseline gap-2 py-3.5 mt-7"
              style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
            >
              <span
                className="text-[13px] font-bold text-white"
                style={{ letterSpacing: "-0.2px" }}
              >
                {category}
              </span>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                {categoryTools.length}
              </span>
            </div>

            {categoryTools.map((scored, idx) => {
              const t = scored.tool;
              const isTop = tools.indexOf(scored) === 0;
              const ecoBadges: string[] = [];
              if (t.ec.includes("google")) ecoBadges.push("Google");
              if (t.ec.includes("microsoft")) ecoBadges.push("Microsoft");

              return (
                <div
                  key={scored.id}
                  className={`tool-item py-[18px] ${isTop ? "px-4 rounded-lg mb-1" : ""}`}
                  style={
                    isTop
                      ? {
                          background: "rgba(103, 61, 230, 0.08)",
                          border: "0.5px solid rgba(140, 133, 255, 0.15)",
                        }
                      : idx < categoryTools.length - 1
                      ? { borderBottom: "0.5px solid rgba(255,255,255,0.04)" }
                      : undefined
                  }
                >
                  {isTop && (
                    <div
                      className="text-[10px] font-bold mb-2"
                      style={{
                        color: "#8c85ff",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Top pick
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div
                      className="w-7 h-7 rounded-md grid place-items-center font-bold text-xs text-white shrink-0"
                      style={{ background: scored.color }}
                    >
                      {t.i}
                    </div>
                    <div>
                      <div
                        className="text-sm font-bold text-white"
                        style={{ letterSpacing: "-0.2px" }}
                      >
                        {t.n}
                      </div>
                      <div
                        className="text-[10px] font-semibold"
                        style={{
                          color: "#8c85ff",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        {t.c}
                      </div>
                    </div>
                  </div>

                  <div
                    className="text-[13px] leading-relaxed mb-1.5"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {t.d}
                  </div>

                  <div className="flex gap-1 flex-wrap mb-1.5">
                    <PricingBadge pt={t.pt} />
                    {ecoBadges.map((eco) => (
                      <span
                        key={eco}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(103, 61, 230, 0.12)",
                          color: "#8c85ff",
                        }}
                      >
                        {eco}
                      </span>
                    ))}
                    {t.tg.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] mb-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {t.p}
                  </div>

                  <div
                    className="rounded-md p-2 px-3"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <StarRating rating={t.rv.r} />
                      <span className="text-[11px] font-bold text-white">
                        {t.rv.r}/5
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {t.rv.s}
                      </span>
                    </div>
                    <div
                      className="text-[11px] italic leading-relaxed pl-2"
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        borderLeft: "2px solid rgba(140, 133, 255, 0.2)",
                      }}
                    >
                      &ldquo;{t.rv.q}&rdquo;
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <details
        className="mt-9 pt-4"
        style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
      >
        <summary
          className="text-xs font-medium cursor-pointer list-none [&::-webkit-details-marker]:hidden"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Disclaimer &amp; Terms
        </summary>
        <p
          className="text-[11px] mt-2.5 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          For informational purposes only. Not an endorsement.{" "}
          <strong style={{ color: "rgba(255,255,255,0.45)" }}>
            Vet with your district.
          </strong>{" "}
          Comply with FERPA, COPPA, CIPA. Verify DPAs before entering student data.
          Pricing changes frequently. Third-party reviews sourced at time of
          collection.{" "}
          <strong style={{ color: "rgba(255,255,255,0.45)" }}>
            No liability assumed.
          </strong>
        </p>
      </details>

      {/* Pedagogy CTA */}
      <div
        ref={ctaRef}
        className="mt-9 p-7 rounded-lg"
        style={{
          background: "rgba(103, 61, 230, 0.08)",
          border: "0.5px solid rgba(140, 133, 255, 0.15)",
        }}
      >
        <h3
          className="text-[17px] font-bold text-white mb-2"
          style={{ letterSpacing: "-0.5px" }}
        >
          Tools alone don&apos;t transform teaching.
        </h3>
        <p
          className="text-sm leading-relaxed max-w-[420px]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <strong className="text-white">
            Tools without pedagogy are shiny objects.
          </strong>{" "}
          We help educators integrate AI into inquiry-based learning, UDL, and
          culturally responsive teaching.
        </p>
        <span
          className="inline-flex items-center gap-1.5 mt-3.5 text-white text-[13px] font-semibold px-[18px] py-2 rounded-md cursor-default"
          style={{
            background: "linear-gradient(135deg, #673de6 0%, #8c85ff 100%)",
            boxShadow: "0 4px 16px rgba(103, 61, 230, 0.25)",
          }}
        >
          Let&apos;s talk &rarr;
        </span>
      </div>

      {/* Brand bar */}
      <div
        className="mt-3 p-7 rounded-lg text-center"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div
          className="text-[10px] font-semibold mb-1.5"
          style={{
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Educate &middot; Employ &middot; Empower
        </div>
        <h3
          className="text-[15px] font-bold text-white mb-1"
          style={{ letterSpacing: "-0.3px" }}
        >
          The Right Path Educational Consulting
        </h3>
        <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          AI implementation with purpose, equity, and measurable outcomes.
        </p>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="block mx-auto mt-6 text-xs font-medium px-5 py-2 rounded-md cursor-pointer transition-colors duration-150"
        style={{
          background: "transparent",
          border: "0.5px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.4)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(140,133,255,0.3)";
          (e.currentTarget as HTMLElement).style.color = "#8c85ff";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
        }}
      >
        Start over
      </button>
    </div>
  );
}

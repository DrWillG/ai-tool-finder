"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TOOLS } from "../data/tools";
import HeroBackground from "./HeroBackground";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  const toolCount = Object.keys(TOOLS).length;
  const updated = new Date("2026-03-22T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      pillRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    )
      .fromTo(
        headlineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.25"
      )
      .fromTo(
        subtextRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.35"
      )
      .fromTo(
        btnsRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.25"
      )
      .fromTo(
        statsRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.15"
      )
      .fromTo(
        logosRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.1"
      );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-14 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1a0e3e 0%, #2f1c6a 50%, #1a0e3e 100%)",
      }}
    >
      <HeroBackground />
      <div className="relative z-10 px-[clamp(20px,5vw,48px)] py-[clamp(72px,14vh,120px)] pb-[clamp(48px,10vh,90px)] text-center">
        {/* Pill badge */}
        <div
          ref={pillRef}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full mb-6 opacity-0"
          style={{
            background: "rgba(103, 61, 230, 0.15)",
            border: "0.5px solid rgba(140, 133, 255, 0.25)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-xs font-medium" style={{ color: "#8c85ff" }}>
            Free for every educator
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-[clamp(34px,6.5vw,56px)] font-bold leading-[1.06] text-white mb-4 opacity-0"
          style={{ letterSpacing: "-1.5px" }}
        >
          Find your AI tools
          <br />
          <span style={{ color: "rgba(255,255,255,0.3)" }}>in five questions.</span>
        </h1>

        {/* Subtext */}
        <div
          ref={subtextRef}
          className="text-base leading-relaxed max-w-[420px] mx-auto mb-8 opacity-0"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Matched to your subject, grade level, and ecosystem. Real educator
          reviews, not marketing copy.
        </div>

        {/* Button */}
        <div
          ref={btnsRef}
          className="flex gap-2.5 justify-center flex-wrap opacity-0"
        >
          <button
            onClick={onStart}
            className="text-white text-sm font-semibold px-8 py-3 rounded-lg border-none cursor-pointer transition-all duration-200 hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #673de6 0%, #8c85ff 100%)",
              boxShadow: "0 4px 24px rgba(103, 61, 230, 0.3)",
            }}
          >
            Start the finder
          </button>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="flex justify-center gap-[clamp(28px,6vw,56px)] mt-10 pt-7 opacity-0"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <div>
            <div
              className="text-xl font-bold text-white"
              style={{ letterSpacing: "-0.5px" }}
            >
              {toolCount}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Tools reviewed
            </div>
          </div>
          <div>
            <div
              className="text-xl font-bold text-white"
              style={{ letterSpacing: "-0.5px" }}
            >
              12
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Categories
            </div>
          </div>
          <div>
            <div
              className="text-xl font-bold text-white"
              style={{ letterSpacing: "-0.5px" }}
            >
              {updated}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Updated
            </div>
          </div>
        </div>

        {/* Trust logos */}
        <div
          ref={logosRef}
          className="flex justify-center gap-7 pt-[18px] mt-1 opacity-0"
        >
          {["G2 VERIFIED", "COMMON SENSE", "EDSURGE", "ISTE"].map((name) => (
            <span
              key={name}
              className="text-[10px] font-semibold"
              style={{ color: "rgba(255,255,255,0.12)", letterSpacing: "0.08em" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

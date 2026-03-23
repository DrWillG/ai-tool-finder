"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LOGO_URL =
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/AoPGRoQEpqhB0VyW/wordpress-transparent-AE04Jj2yR1cR3NRw.png";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.fromTo(
      nav,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.1 }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[clamp(16px,4vw,40px)] h-14 opacity-0"
      style={{
        background: "rgba(19, 10, 46, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <img src={LOGO_URL} alt="The Right Path" className="h-8" />
        <span
          className="text-sm font-bold text-white"
          style={{ letterSpacing: "-0.5px" }}
        >
          The Right Path
        </span>
      </div>
      <span
        className="text-[13px] font-semibold px-4 py-1.5 rounded-md cursor-default"
        style={{
          color: "#8c85ff",
          border: "1.5px solid rgba(140, 133, 255, 0.3)",
        }}
      >
        Contact Us
      </span>
    </nav>
  );
}

import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/UseAuth";
import { useGreeting } from "../hooks/useGreeting";

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fname;
  const greeting = useGreeting(firstName);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const week = Math.ceil(now.getDate() / 7);

  return (
    <header
      className="sticky top-0 z-30 shrink-0 flex items-center gap-2.5 px-4 py-3 border-b"
      style={{
        background: "rgba(247,244,239,0.95)",
        backdropFilter: "blur(8px)",
        borderColor: "rgba(13,17,23,0.1)",
      }}
    >
      <button
        id="ham-btn"
        onClick={onMenuClick}
        className="lg:hidden w-[38px] h-[38px] flex items-center justify-center bg-white border rounded-[10px] cursor-pointer shrink-0"
        style={{ borderColor: "rgba(13,17,23,0.1)" }}
      >
        <Menu size={17} className="text-ink" />
      </button>

      <div className="flex-1 min-w-0">
        <h1
          className="font-display text-ink whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ fontSize: "clamp(16px,3vw,22px)", fontFamily: '"DM Serif Display", serif' }}
        >
          {greeting} <span style={{ color: "#4A7C59", fontStyle: "italic" }}>✦</span>
        </h1>
        <p className="text-slate text-[12px] hidden sm:block mt-0.5">
          {dateStr} · Week {week}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          className="relative w-[38px] h-[38px] flex items-center justify-center bg-white border rounded-[10px] cursor-pointer"
          style={{ borderColor: "rgba(13,17,23,0.1)" }}
        >
          <Bell size={17} className="text-ink" />
          <span className="absolute top-2 right-2 w-[7px] h-[7px] bg-blush rounded-full" />
        </button>
      </div>
    </header>
  );
}
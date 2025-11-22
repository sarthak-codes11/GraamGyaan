"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/BottomBar";
import { DropZones } from "~/components/game/DropZones";
import { DraggableItem } from "~/components/game/DraggableItem";
import { EndScreen } from "~/components/game/EndScreen";
import { ScoreTimer } from "~/components/game/ScoreTimer";
import { GAME_ITEMS } from "~/components/game/data";
import type { GameItem } from "~/components/game/types";

const TOTAL_SECONDS = 60;

function playBeep(type: "success" | "error") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = type === "success" ? "triangle" : "square";
    o.frequency.value = type === "success" ? 880 : 220; // A5 or A3
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  } catch {}
}

const classifyChoice = (item: GameItem): [left: string, right: string, correct: "left" | "right"] => {
  return ["soluble", "insoluble", item.solubleInsoluble === "soluble" ? "left" : "right"];
};

const GamePage: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [lastHint, setLastHint] = useState<string>("");

  const leftZoneRef = useRef<HTMLDivElement>(null);
  const rightZoneRef = useRef<HTMLDivElement>(null);

  // initial reset
  useEffect(() => {
    setSecondsLeft(TOTAL_SECONDS);
    setScore(0);
    setCompleted({});
    setLastHint("");
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const allDone = useMemo(() => GAME_ITEMS.every((i) => completed[i.key]), [completed]);
  const showEnd = secondsLeft <= 0 || allDone;

  const visibleItems = useMemo(() => GAME_ITEMS.filter((i) => !completed[i.key]), [completed]);

  const onDropAttempt = useCallback(
    (item: GameItem, point: { x: number; y: number }) => {
      const leftRect = leftZoneRef.current?.getBoundingClientRect();
      const rightRect = rightZoneRef.current?.getBoundingClientRect();
      const inRect = (r?: DOMRect | null) => !!r && point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom;

      const [leftKey, rightKey, correctSide] = classifyChoice(item);

      let dropped: "left" | "right" | null = null;
      if (inRect(leftRect)) dropped = "left";
      else if (inRect(rightRect)) dropped = "right";

      if (!dropped) return; // dropped elsewhere, ignore

      const isCorrect = dropped === correctSide;
      if (isCorrect) {
        setScore((s) => s + 10);
        setCompleted((c) => ({ ...c, [item.key]: true }));
        setLastHint("");
        playBeep("success");
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      } else {
        setLastHint(item.hint);
        playBeep("error");
      }
    },
    []
  );

  const leftLabel = "Soluble";
  const rightLabel = "Insoluble";

  const correctCount = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);

  const replay = () => {
    setSecondsLeft(TOTAL_SECONDS);
    setScore(0);
    setCompleted({});
    setLastHint("");
  };

  return (
    <>
      <TopBar backgroundColor="bg-[#680B24]" borderColor="border-[#4e071b]" />

      <div className="pt-16 pb-24 px-3 flex flex-col items-center">
        <div className="w-full max-w-3xl mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/learn" className="rounded-xl px-3 py-2 border-2 border-b-4"
              style={{ background: "#FFF4E6", borderColor: "#FFD1A3", color: "#945200" }}>
              ← Back
            </Link>
            <Link href="/games" className="rounded-xl px-3 py-2 border-2 border-b-4"
              style={{ background: "#E6FAFB", borderColor: "#8AE1E8", color: "#0D7681" }}>
              Games
            </Link>
          </div>
          <div className="flex gap-2">
            <Link href="/learn" className="rounded-xl px-3 py-2 border-2 border-b-4 font-bold"
              style={{ background: "#FFE4E6", borderColor: "#FFB4C1", color: "#9F1239" }}>
              Quit
            </Link>
            <div className="rounded-xl px-3 py-2 border-2 border-b-4 font-bold"
              style={{ background: "#FDF3FF", borderColor: "#F1C6FF", color: "#7A2E8E" }}>
              Soluble vs Insoluble
            </div>
          </div>
        </div>

        <ScoreTimer score={score} secondsLeft={secondsLeft} totalSeconds={TOTAL_SECONDS} />

        <div className="relative mt-6 w-full max-w-3xl min-h-[220px] rounded-3xl border-4 p-4 flex flex-wrap gap-3 items-center justify-center"
             style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}>
          {visibleItems.map((item) => (
            <DraggableItem key={item.key} item={item} onDropAttempt={onDropAttempt} />
          ))}

          {!visibleItems.length && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-lg font-bold" style={{ color: "#6F0E1B" }}>
              All items sorted! Great job!
            </motion.div>
          )}
        </div>

        {!!lastHint && (
          <div className="mt-3 rounded-xl px-4 py-2 border-2 text-sm"
               style={{ background: "#FFF0F0", borderColor: "#FFC7C7", color: "#9A1B1B" }}>
            {lastHint}
          </div>
        )}

        <DropZones leftLabel={leftLabel} rightLabel={rightLabel} leftRef={leftZoneRef} rightRef={rightZoneRef} />
      </div>

      {showEnd && (
        <EndScreen correctCount={correctCount} total={GAME_ITEMS.length} onReplay={replay} />
      )}

      <BottomBar selectedTab="Learn" />
    </>
  );
};

export default GamePage;

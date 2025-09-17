"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, type PanInfo, useReducedMotion } from "framer-motion";
import Image from "next/image";
import confetti from "canvas-confetti";

import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/BottomBar";

// ---- Types ----

type PartKey = "root" | "stem" | "leaf" | "flower" | "fruit" | "seed";

type PlantPart = {
  key: PartKey;
  label: string;
  color: string; // for chip color coding
  hint: string;
};

type Slot = {
  key: Exclude<PartKey, "fruit" | "seed">; // slots on diagram are for root/stem/leaf/flower
  label: string;
};

type FunctionKey =
  | "photosynthesis"
  | "absorbs-water"
  | "transport"
  | "reproduction"
  | "seeds"
  | "new-plant";

// ---- Data ----

const ALL_PARTS: PlantPart[] = [
  { key: "root", label: "Root", color: "#F9E0AE", hint: "Roots help the plant absorb water and anchor it!" },
  { key: "stem", label: "Stem", color: "#CBE8BA", hint: "Stems transport water and food across the plant." },
  { key: "leaf", label: "Leaf", color: "#BDE8E1", hint: "Leaves make food by photosynthesis!" },
  { key: "flower", label: "Flower", color: "#F3C4FB", hint: "Flowers help in reproduction." },
  { key: "fruit", label: "Fruit", color: "#FFD1A3", hint: "Fruits carry seeds." },
  { key: "seed", label: "Seed", color: "#E6E6FA", hint: "Seeds grow into new plants." },
];

const DIAGRAM_SLOTS: Slot[] = [
  { key: "root", label: "Root" },
  { key: "stem", label: "Stem" },
  { key: "leaf", label: "Leaf" },
  { key: "flower", label: "Flower" },
];

const FUNCTION_MAP: Record<PartKey, FunctionKey> = {
  root: "absorbs-water",
  stem: "transport",
  leaf: "photosynthesis",
  flower: "reproduction",
  fruit: "seeds",
  seed: "new-plant",
};

const FUNCTION_LABELS: Record<FunctionKey, string> = {
  photosynthesis: "Photosynthesis",
  "absorbs-water": "Absorbs water",
  transport: "Transport",
  reproduction: "Reproduction",
  seeds: "Seeds",
  "new-plant": "Grows into new plant",
};

// ---- Helpers ----

const TOTAL_SECONDS = 90;

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

function sparkle(x: number, y: number, color = "#7AE582") {
  confetti({
    particleCount: 60,
    angle: 90,
    spread: 45,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors: [color, "#FFFFFF"],
    scalar: 0.7,
  });
}

// ---- Page ----

const PlantsGamePage: React.FC = () => {
  // phases: assemble -> functions -> end
  const [phase, setPhase] = useState<"assemble" | "functions" | "end">("assemble");

  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // assembly state
  const [assembled, setAssembled] = useState<Record<Slot["key"], boolean>>({
    root: false,
    stem: false,
    leaf: false,
    flower: false,
  });

  // which parts are still available to drag in current phase
  const remainingAssembleParts = useMemo(
    () => ALL_PARTS.filter((p) => ["root", "stem", "leaf", "flower"].includes(p.key) && !assembled[p.key as keyof typeof assembled]),
    [assembled]
  );

  const [functionsMatched, setFunctionsMatched] = useState<Record<PartKey, boolean>>({
    root: false,
    stem: false,
    leaf: false,
    flower: false,
    fruit: false,
    seed: false,
  });

  const remainingFunctionParts = useMemo(
    () => ALL_PARTS.filter((p) => !functionsMatched[p.key]),
    [functionsMatched]
  );

  // timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setPhase("end");
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  // move to functions phase when assembly done
  useEffect(() => {
    const allSlotsDone = Object.values(assembled).every(Boolean);
    if (phase === "assemble" && allSlotsDone) {
      setTimeout(() => setPhase("functions"), 500);
    }
  }, [assembled, phase]);

  const resetGame = () => {
    setPhase("assemble");
    setSecondsLeft(TOTAL_SECONDS);
    setScore(0);
    setHint("");
    setAssembled({ root: false, stem: false, leaf: false, flower: false });
    setFunctionsMatched({ root: false, stem: false, leaf: false, flower: false, fruit: false, seed: false });
  };

  // diagram slot refs
  const slotRefs = {
    root: useRef<HTMLDivElement>(null),
    stem: useRef<HTMLDivElement>(null),
    leaf: useRef<HTMLDivElement>(null),
    flower: useRef<HTMLDivElement>(null),
  } as const;

  const functionBoxRefs: Record<FunctionKey, React.RefObject<HTMLDivElement>> = {
    photosynthesis: useRef<HTMLDivElement>(null),
    "absorbs-water": useRef<HTMLDivElement>(null),
    transport: useRef<HTMLDivElement>(null),
    reproduction: useRef<HTMLDivElement>(null),
    seeds: useRef<HTMLDivElement>(null),
    "new-plant": useRef<HTMLDivElement>(null),
  };

  const isPointInRect = (point: { x: number; y: number }, rect?: DOMRect | null) => {
    return !!rect && point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
  };

  const onDragEndAssemble = useCallback(
    (part: PlantPart, _e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const pt = { x: info.point.x, y: info.point.y };
      const targetSlot = DIAGRAM_SLOTS.find((s) => {
        const ref = slotRefs[s.key].current;
        return isPointInRect(pt, ref?.getBoundingClientRect());
      });

      if (!targetSlot) return;

      const correct = targetSlot.key === part.key;
      if (correct) {
        setAssembled((prev) => ({ ...prev, [part.key]: true }));
        setScore((v) => v + 10);
        setHint("");
        if (soundEnabled) playBeep("success");
        // leaf sparkle: special effect when leaf placed
        if (part.key === "leaf") sparkle(pt.x, pt.y, "#6EE7B7");
        else confetti({ particleCount: 40, spread: 45, origin: { y: 0.7 } });
      } else {
        setHint(part.hint);
        if (soundEnabled) playBeep("error");
      }
    },
    [soundEnabled]
  );

  const onDragEndFunctions = useCallback(
    (part: PlantPart, _e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const pt = { x: info.point.x, y: info.point.y };
      const correctBoxKey = FUNCTION_MAP[part.key];
      const correctRect = functionBoxRefs[correctBoxKey].current?.getBoundingClientRect();

      if (isPointInRect(pt, correctRect)) {
        setFunctionsMatched((prev) => ({ ...prev, [part.key]: true }));
        setScore((v) => v + 10);
        setHint("");
        if (soundEnabled) playBeep("success");
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } else {
        setHint(ALL_PARTS.find((p) => p.key === part.key)?.hint ?? "Try again!");
        if (soundEnabled) playBeep("error");
      }
    },
    [soundEnabled]
  );

  const allFunctionsDone = useMemo(() => Object.values(functionsMatched).every(Boolean), [functionsMatched]);

  useEffect(() => {
    if (phase === "functions" && allFunctionsDone) {
      setTimeout(() => setPhase("end"), 400);
    }
  }, [phase, allFunctionsDone]);

  const stars = useMemo(() => {
    const finishedQuickly = secondsLeft >= 30; // under 60s
    const maxScore = 10 * (4 + 6); // 4 assembly + 6 function matches = 10 parts picked total? Actually 4+6=10 actions
    const allCorrect = allFunctionsDone && Object.values(assembled).every(Boolean);
    if (allCorrect && finishedQuickly) return 3;
    if (score >= Math.floor(maxScore * 0.7)) return 2;
    return 1;
  }, [secondsLeft, score, allFunctionsDone, assembled]);

  return (
    <>
      <TopBar backgroundColor="bg-[#14532d]" borderColor="border-[#0b3a1d]" />

      <div className="pt-16 pb-24 px-3 flex flex-col items-center" style={{ background: "#F9FFF8" }}>
        {/* Header Controls */}
        <div className="w-full max-w-5xl mb-4 flex items-center justify-between">
          <Link
            href="/games"
            className="rounded-xl px-3 py-2 border-2 border-b-4"
            style={{ background: "#E6FAFB", borderColor: "#8AE1E8", color: "#0D7681" }}
          >
            ← Games
          </Link>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl px-4 py-2 font-extrabold border-2"
                 style={{ background: "#E9FCD4", borderColor: "#B3F17B", color: "#275D00" }}>
              Score: {score}
            </div>
            <div className="w-40">
              <div className="text-xs font-bold mb-1" style={{ color: "#064E3B" }}>Time Left: {secondsLeft}s</div>
              <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, (secondsLeft / TOTAL_SECONDS) * 100))}%`, background: "linear-gradient(90deg,#6EE7B7,#A7F3D0)" }}
                />
              </div>
            </div>
            <Link
              href="/learn"
              className="rounded-2xl px-3 py-2 font-extrabold border-2 border-b-4"
              style={{ background: "#FFE4E6", borderColor: "#FFB4C1", color: "#9F1239" }}
            >
              Quit
            </Link>
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              aria-pressed={soundEnabled}
              className="rounded-2xl px-3 py-2 font-extrabold border-2 border-b-4"
              style={{ background: soundEnabled ? "#E6FAFB" : "#F3F4F6", borderColor: soundEnabled ? "#8AE1E8" : "#D1D5DB", color: "#0D7681" }}
            >
              {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
            </button>
          </div>
        </div>

        {/* Game Board */}
        {phase !== "end" && (
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Draggables center */}
            <div className="order-2 lg:order-2 rounded-3xl border-4 p-3 sm:p-4 min-h-[200px] sm:min-h-[220px] flex flex-wrap gap-2 sm:gap-3 items-center justify-center"
                 style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}>
              {(phase === "assemble" ? remainingAssembleParts : remainingFunctionParts).map((part) => (
                <motion.div
                  key={part.key}
                  drag
                  dragMomentum={false}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={prefersReducedMotion ? undefined : { y: [0, -2, 0] }}
                  transition={prefersReducedMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: (["root","stem","leaf","flower","fruit","seed"].indexOf(part.key) % 3) * 0.2 }}
                  onDragEnd={(e, info) => (phase === "assemble" ? onDragEndAssemble(part, e, info) : onDragEndFunctions(part, e, info))}
                  className="relative z-10 select-none cursor-grab active:cursor-grabbing"
                  style={{ touchAction: "none" }}
                  whileDrag={{ zIndex: 60 }}
                >
                  <div
                    className="rounded-2xl px-3 py-2 shadow-md border-2 flex items-center gap-2 min-h-[48px] sm:min-h-[44px]"
                    style={{ background: part.color, borderColor: "#E5E7EB", color: "#14532d" }}
                    aria-label={part.label}
                    role="group"
                    tabIndex={0}
                    title={`${part.label} - drag and drop`}
                    onKeyDown={(e) => {
                      const key = e.key;
                      // helper to compute center of a DOMRect
                      const center = (r: DOMRect | undefined | null) => r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
                      if (phase === "assemble") {
                        const slotOrder = ["root", "stem", "leaf", "flower"] as const;
                        const idx = parseInt(key, 10) - 1;
                        if (!Number.isNaN(idx) && idx >= 0 && idx < slotOrder.length) {
                          e.preventDefault();
                          const slotKey = slotOrder[idx] as keyof typeof slotRefs;
                          const ref = slotRefs[slotKey].current;
                          const pt = center(ref?.getBoundingClientRect());
                          if (pt) {
                            // simulate
                            const info: any = { point: pt };
                            onDragEndAssemble(part, null as any, info);
                          }
                        }
                      } else if (phase === "functions") {
                        const funcOrder = [
                          "photosynthesis",
                          "absorbs-water",
                          "transport",
                          "reproduction",
                          "seeds",
                          "new-plant",
                        ] as const satisfies readonly FunctionKey[];
                        const idx = parseInt(key, 10) - 1;
                        if (!Number.isNaN(idx) && idx >= 0 && idx < funcOrder.length) {
                          e.preventDefault();
                          const funcKey = funcOrder[idx] as FunctionKey;
                          const ref = functionBoxRefs[funcKey].current;
                          const pt = center(ref?.getBoundingClientRect());
                          if (pt) {
                            const info: any = { point: pt };
                            onDragEndFunctions(part, null as any, info);
                          }
                        }
                      }
                    }}
                  >
                    <div className="w-8 h-8">
                      <Image src={`/plants/${part.key}.svg`} alt={part.label} width={32} height={32} />
                    </div>
                    <span className="text-sm font-extrabold">{part.label}</span>
                    <span id={`sr-instructions-${part.key}`} className="sr-only">Drag {part.label} to the correct {phase === "assemble" ? "plant slot" : "function"}.</span>
                  </div>
                </motion.div>
              ))}

              {!((phase === "assemble" ? remainingAssembleParts : remainingFunctionParts).length) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-lg font-bold" style={{ color: "#14532d" }}>
                  {phase === "assemble" ? "Great! Plant assembled." : "Awesome! All functions matched."}
                </motion.div>
              )}
            </div>

            {/* Diagram left */}
            <div className="order-1 lg:order-1 rounded-3xl border-4 p-4"
                 style={{ background: "#ECFDF5", borderColor: "#A7F3D0" }}>
              <div className="text-center font-extrabold mb-2" style={{ color: "#064E3B" }}>Plant Diagram</div>
              <div className="relative mx-auto w-full max-w-sm aspect-[3/5] bg-white rounded-2xl border-2 border-dashed flex items-center justify-center">
                {/* simple cartoon plant scaffold */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-40 h-1.5 rounded-full" style={{ background: "#D1FAE5" }} />
                {/* stem line */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-2 h-40 rounded-full" style={{ background: "#65A30D" }} />

                {/* flower pot at the base */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2" aria-hidden>
                  <div className="w-28 h-9 rounded-b-xl" style={{ background: "#B45309" }} />
                  <div className="w-36 h-4 -translate-x-4 -translate-y-2 rounded-full" style={{ background: "#92400E" }} />
                  <div className="w-24 h-2 translate-x-2 -translate-y-3 rounded-full" style={{ background: "#78350F" }} />
                </div>

                {/* two upward branches (non-interactive, no animation) */}
                <div
                  className="absolute origin-left"
                  style={{
                    left: "calc(50% - 1px)",
                    bottom: "150px",
                    width: "95px",
                    height: "8px",
                    background: "#65A30D",
                    borderRadius: "9999px",
                    transform: "translateX(-94px) rotate(-18deg)",
                  }}
                  aria-hidden
                />
                <div
                  className="absolute origin-left"
                  style={{
                    left: "calc(50% + 1px)",
                    bottom: "165px",
                    width: "100px",
                    height: "8px",
                    background: "#65A30D",
                    borderRadius: "9999px",
                    transform: "translateX(0px) rotate(18deg)",
                  }}
                  aria-hidden
                />

                {/* slots */}
                <div ref={slotRefs.root} className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <SlotBox label="Root" done={assembled.root} />
                </div>
                <div ref={slotRefs.stem} className="absolute bottom-28 left-1/2 -translate-x-1/2">
                  <SlotBox label="Stem" done={assembled.stem} />
                </div>
                {/* Leaf at end of the left branch */}
                <div ref={slotRefs.leaf} className="absolute" style={{ bottom: "170px", left: "12%" }}>
                  <SlotBox label="Leaf" done={assembled.leaf} />
                </div>
                {/* Flower at the top of the stem */}
                <div ref={slotRefs.flower} className="absolute" style={{ bottom: "220px", left: "calc(50% + 6px)" }}>
                  <SlotBox label="Flower" done={assembled.flower} />
                </div>
              </div>
            </div>

            {/* Functions right */}
            <div className="order-3 lg:order-3 rounded-3xl border-4 p-3 sm:p-4"
                 style={{ background: "#FFF7ED", borderColor: "#FED7AA" }}>
              <div className="text-center font-extrabold mb-2" style={{ color: "#92400E" }}>Functions</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {(Object.keys(FUNCTION_LABELS) as FunctionKey[]).map((k, i) => (
                  <div key={k} ref={functionBoxRefs[k]}>
                    <FunctionBox label={FUNCTION_LABELS[k]} keyHint={(i+1).toString()} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hint */}
        {!!hint && phase !== "end" && (
          <div className="mt-3 rounded-xl px-4 py-2 border-2 text-sm"
               role="status" aria-live="polite"
               style={{ background: "#FFF0F0", borderColor: "#FFC7C7", color: "#9A1B1B" }}>
            {hint}
          </div>
        )}

        {/* End Screen */}
        {phase === "end" && (
          <div className="mt-10 text-center">
            <div className="mx-4 w-full max-w-md rounded-3xl p-6 text-center shadow-2xl border-4"
                 style={{ background: "#FFFFFF", borderColor: "#A7F3D0" }}>
              <h2 className="text-2xl font-extrabold mb-2" style={{ color: "#064E3B" }}>
                You built the plant and learned its parts!
              </h2>

              <div className="flex items-center justify-center gap-2 my-4">
                {[1, 2, 3].map((i) => (
                  <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: i <= stars ? 1 : 0.7 }} transition={{ delay: i * 0.1 }} className="text-3xl">
                    {i <= stars ? "⭐" : "☆"}
                  </motion.span>
                ))}
              </div>

              <p className="mb-4" style={{ color: "#065F46" }}>Score: {score}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={resetGame}
                  className="rounded-2xl px-4 py-3 font-extrabold border-b-4"
                  style={{ background: "#E9FCD4", borderColor: "#B3F17B", color: "#275D00" }}
                >
                  Play Again
                </button>
                <Link
                  href="/games"
                  className="rounded-2xl px-4 py-3 font-extrabold border-b-4"
                  style={{ background: "#E6FAFB", borderColor: "#8AE1E8", color: "#0D7681" }}
                >
                  Choose Another Game
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomBar selectedTab="Learn" />
    </>
  );
};

export default PlantsGamePage;

// ---- UI Pieces ----

const SlotBox: React.FC<{ label: string; done?: boolean; keyHint?: string; ghost?: PartKey }> = ({ label, done, keyHint, ghost }) => {
  const prefersReducedMotion = useReducedMotion();
  const wobble = done && (ghost === "leaf" || ghost === "flower") && !prefersReducedMotion;
  return (
    <motion.div
      className={[
        "relative rounded-xl px-3 py-2 text-xs font-extrabold min-w-[84px] min-h-[36px] text-center",
        done ? "border-2" : "border-2 border-dashed animate-pulse",
      ].join(" ")}
      style={{ background: done ? "#D1FAE5" : "#FFFFFF", borderColor: done ? "#6EE7B7" : "#D1D5DB", color: "#065F46" }}
      animate={wobble ? { rotate: [-1.5, 1.5, -1.5], y: [0, -1, 0] } : undefined}
      transition={wobble ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      {!done && ghost && (
        <span className="absolute inset-0 flex items-center justify-center opacity-30">
          <Image src={`/plants/${ghost}.svg`} alt="placeholder" width={28} height={28} />
        </span>
      )}
      <span className="relative">{done ? "✓ " : ""}{label}</span>
      {keyHint && (
        <span
          className="absolute -top-2 -right-2 rounded-full w-5 h-5 text-[10px] flex items-center justify-center border-2"
          style={{ background: "#FFFFFF", borderColor: done ? "#6EE7B7" : "#A7F3D0", color: "#065F46" }}
          aria-hidden
        >
          {keyHint}
        </span>
      )}
    </motion.div>
  );
};

const FunctionBox: React.FC<{ label: string; keyHint?: string }> = ({ label, keyHint }) => (
  <div
    className="relative rounded-2xl px-3 py-3 border-2 text-sm font-extrabold text-center min-h-[56px] flex items-center justify-center"
    style={{ background: "#FFF7ED", borderColor: "#FED7AA", color: "#92400E" }}
  >
    {label}
    {keyHint && (
      <span
        className="absolute -top-2 -right-2 rounded-full w-5 h-5 text-[10px] flex items-center justify-center border-2"
        style={{ background: "#FFFFFF", borderColor: "#FDE68A", color: "#92400E" }}
        aria-hidden
      >
        {keyHint}
      </span>
    )}
  </div>
);

import { type NextPage } from "next";
import Link from "next/link";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  ActiveBookSvg,
  LockedBookSvg,
  CheckmarkSvg,
  LockedDumbbellSvg,
  FastForwardSvg,
  GoldenBookSvg,
  GoldenDumbbellSvg,
  GoldenTreasureSvg,
  GoldenTrophySvg,
  GuidebookSvg,
  LessonCompletionSvg0,
  LessonCompletionSvg1,
  LessonCompletionSvg2,
  LessonCompletionSvg3,
  LockSvg,
  StarSvg,
  LockedTreasureSvg,
  LockedTrophySvg,
  UpArrowSvg,
  ActiveTreasureSvg,
  ActiveTrophySvg,
  ActiveDumbbellSvg,
  PracticeExerciseSvg,
} from "~/components/Svgs";
import { TopBar } from "~/components/TopBar";
import dynamic from "next/dynamic";
const Chatbot = dynamic(() => import("~/components/Chatbot"), { ssr: false });
import { BottomBar } from "~/components/BottomBar";
import RightBar from "~/components/RightBar";
import { LeftBar } from "~/components/LeftBar";
import { useRouter } from "next/router";
import LoginScreen, { useLoginScreen } from "~/components/LoginScreen";
import { useBoundStore } from "~/hooks/useBoundStore";
import type { Tile, TileType, Unit } from "~/utils/units";
import { units } from "~/utils/units";
import type { UploadItem } from "~/types/uploads";

type TileStatus = "LOCKED" | "ACTIVE" | "COMPLETE";

const tileStatus = (tile: Tile, lessonsCompleted: number): TileStatus => {
  const lessonsPerTile = 1; // Each lesson completes its tile
  const tilesCompleted = Math.floor(lessonsCompleted / lessonsPerTile);
  const tiles = units.flatMap((unit) => unit.tiles);
  const tileIndex = tiles.findIndex((t) => t === tile);

  if (tileIndex < tilesCompleted) {
    return "COMPLETE";
  }
  if (tileIndex > tilesCompleted) {
    return "LOCKED";
  }
  return "ACTIVE";
};

const TileIcon = ({
  tileType,
  status,
}: {
  tileType: TileType;
  status: TileStatus;
}): JSX.Element => {
  switch (tileType) {
    case "star":
      return status === "COMPLETE" ? (
        <CheckmarkSvg />
      ) : status === "ACTIVE" ? (
        <StarSvg />
      ) : (
        <LockSvg />
      );
    case "book":
      return status === "COMPLETE" ? (
        <GoldenBookSvg />
      ) : status === "ACTIVE" ? (
        <ActiveBookSvg />
      ) : (
        <LockedBookSvg />
      );
    case "dumbbell":
      return status === "COMPLETE" ? (
        <GoldenDumbbellSvg />
      ) : status === "ACTIVE" ? (
        <ActiveDumbbellSvg />
      ) : (
        <LockedDumbbellSvg />
      );
    case "fast-forward":
      return status === "COMPLETE" ? (
        <CheckmarkSvg />
      ) : status === "ACTIVE" ? (
        <StarSvg />
      ) : (
        <FastForwardSvg />
      );
    case "treasure":
      return status === "COMPLETE" ? (
        <GoldenTreasureSvg />
      ) : status === "ACTIVE" ? (
        <ActiveTreasureSvg />
      ) : (
        <LockedTreasureSvg />
      );
    case "trophy":
      return status === "COMPLETE" ? (
        <GoldenTrophySvg />
      ) : status === "ACTIVE" ? (
        <ActiveTrophySvg />
      ) : (
        <LockedTrophySvg />
      );
  }
};

const tileLeftClassNames = [
  "left-0",
  "left-[-45px]",
  "left-[-70px]",
  "left-[-45px]",
  "left-0",
  "left-[45px]",
  "left-[70px]",
  "left-[45px]",
] as const;

type TileLeftClassName = (typeof tileLeftClassNames)[number];

// Replace zigzag computation with linear centering
const getTileLeftClassName = ({
  index,
  unitNumber,
  tilesLength,
}: {
  index: number;
  unitNumber: number;
  tilesLength: number;
}): TileLeftClassName => {
  return "left-0";
};

const tileTooltipLeftOffsets = [140, 95, 70, 95, 140, 185, 210, 185] as const;

type TileTooltipLeftOffset = (typeof tileTooltipLeftOffsets)[number];

const getTileTooltipLeftOffset = ({
  index,
  unitNumber,
  tilesLength,
}: {
  index: number;
  unitNumber: number;
  tilesLength: number;
}): TileTooltipLeftOffset => {
  // Center tooltip arrow relative to tile since tiles are centered now
  return 140;
};

const getTileColors = ({
  tileType,
  status,
  defaultColors,
}: {
  tileType: TileType;
  status: TileStatus;
  defaultColors: `border-${string} bg-${string}`;
}): `border-${string} bg-${string}` => {
  switch (status) {
    case "LOCKED":
      if (tileType === "fast-forward") return defaultColors;
      return "border-[#b7b7b7] bg-[#e5e5e5]";
    case "COMPLETE":
      return "border-yellow-500 bg-yellow-400";
    case "ACTIVE":
      return defaultColors;
  }
};

const TileTooltip = ({
  selectedTile,
  index,
  unitNumber,
  tilesLength,
  description,
  status,
  closeTooltip,
}: {
  selectedTile: number | null;
  index: number;
  unitNumber: number;
  tilesLength: number;
  description: string;
  status: TileStatus;
  closeTooltip: () => void;
}) => {
  const tileTooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const containsTileTooltip = (event: MouseEvent) => {
      if (selectedTile !== index) return;
      const clickIsInsideTooltip = tileTooltipRef.current?.contains(
        event.target as Node
      );
      if (clickIsInsideTooltip) return;
      closeTooltip();
    };
    window.addEventListener("click", containsTileTooltip, true);
    return () => window.removeEventListener("click", containsTileTooltip, true);
  }, [selectedTile, tileTooltipRef, closeTooltip, index]);

  const unit = units.find((unit) => unit.unitNumber === unitNumber);
  const activeBackgroundColor = unit?.backgroundColor ?? "bg-green-500";
  const activeTextColor = unit?.textColor ?? "text-green-500";

  return (
    <div
      className={["relative h-0 w-full", index === selectedTile ? "" : "invisible"].join(" ")}
      ref={tileTooltipRef}
    >
      <div
        className={[
          "absolute z-30 flex w-[300px] flex-col gap-4 rounded-xl p-4 font-bold transition-all duration-300",
          status === "ACTIVE"
            ? activeBackgroundColor
            : status === "LOCKED"
            ? "border-2 border-gray-200 bg-gray-100"
            : "bg-yellow-400",
          index === selectedTile ? "top-4 scale-100" : "-top-14 scale-0",
        ].join(" ")}
        style={{ left: "calc(50% - 150px)" }}
      >
        <div
          className={[
            "absolute left-[140px] top-[-8px] h-4 w-4 rotate-45",
            status === "ACTIVE"
              ? activeBackgroundColor
              : status === "LOCKED"
              ? "border-l-2 border-t-2 border-gray-200 bg-gray-100"
              : "bg-yellow-400",
          ].join(" ")}
          style={{
            left: getTileTooltipLeftOffset({ index, unitNumber, tilesLength }),
          }}
        ></div>
        <div
          className={[
            "text-lg",
            status === "ACTIVE"
              ? "text-white"
              : status === "LOCKED"
              ? "text-gray-400"
              : "text-yellow-600",
          ].join(" ")}
        >
          {description}
        </div>

        {status === "ACTIVE" ? (
          <Link
            href={`/lesson?lesson=${encodeURIComponent(description)}`}
            className={[
              "flex w-full items-center justify-center rounded-xl border-b-4 border-gray-200 bg-white p-3 uppercase",
              activeTextColor,
            ].join(" ")}
          >
            Let's Go! +25 XP
          </Link>
        ) : status === "LOCKED" ? (
          <button
            className="w-full rounded-xl bg-gray-200 p-3 uppercase text-gray-400"
            disabled
          >
            Locked
          </button>
        ) : (
          <Link
            href={`/lesson?lesson=${encodeURIComponent(description)}`}
            className="flex w-full items-center justify-center rounded-xl border-b-4 border-yellow-200 bg-white p-3 uppercase text-yellow-400"
          >
            Practice +5 XP
          </Link>
        )}
      </div>
    </div>
  );
};

const UnitSection = ({ unit }: { unit: Unit }): JSX.Element => {
  const router = useRouter();
  const [selectedTile, setSelectedTile] = useState<null | number>(null);

  useEffect(() => {
    const unselectTile = () => setSelectedTile(null);
    window.addEventListener("scroll", unselectTile);
    return () => window.removeEventListener("scroll", unselectTile);
  }, []);

  const closeTooltip = useCallback(() => setSelectedTile(null), []);

  const lessonsCompleted = useBoundStore((x) => x.lessonsCompleted);
  const increaseLessonsCompleted = useBoundStore(
    (x) => x.increaseLessonsCompleted
  );
  const increaseMilestonesOpened = useBoundStore(
    (x) => x.increaseMilestonesOpened
  );

  return (
    <>
      <UnitHeader
        unitNumber={unit.unitNumber}
        description={unit.description}
        backgroundColor={unit.backgroundColor}
        borderColor={unit.borderColor}
      />
      <div className="relative mb-8 mt-[67px] flex max-w-2xl flex-col items-center gap-4">
        {/* vertical connector line behind tiles */}
        <div className="absolute left-1/2 top-0 -z-10 h-full w-1 -translate-x-1/2 rounded bg-[#e5e5e5]" />
        {unit.tiles.map((tile, i): JSX.Element => {
          const status = tileStatus(tile, lessonsCompleted);
          return (
            <Fragment key={i}>
              {(() => {
                switch (tile.type) {
                  case "star":
                  case "book":
                  case "dumbbell":
                  case "trophy":
                  case "fast-forward":
                    if (tile.type === "trophy" && status === "COMPLETE") {
                      return (
                        <div className="relative">
                          <TileIcon tileType={tile.type} status={status} />
                          <div className="absolute left-0 right-0 top-6 flex justify-center text-lg font-bold text-yellow-700">
                            {unit.unitNumber}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        className={[
                          "relative -mb-4 h-[93px] w-[98px] left-0",
                        ].join(" ")}
                      >
                        {tile.type === "fast-forward" && status === "LOCKED" ? (
                          <HoverLabel text="Jump here?" textColor={unit.textColor} />
                        ) : selectedTile !== i && status === "ACTIVE" ? (
                          <HoverLabel text="Start" textColor={unit.textColor} />
                        ) : null}
                        <LessonCompletionSvg
                          lessonsCompleted={lessonsCompleted}
                          status={status}
                        />
                        <button
                          className={[
                            "absolute m-3 rounded-full border-b-8 p-4",
                            getTileColors({
                              tileType: tile.type,
                              status,
                              defaultColors: `${unit.borderColor} ${unit.backgroundColor}`,
                            }),
                          ].join(" ")}
                          onClick={() => {
                            if (
                              tile.type === "fast-forward" &&
                              status === "LOCKED"
                            ) {
                              void router.push(
                                `/lesson?fast-forward=${unit.unitNumber}`
                              );
                              return;
                            }
                            setSelectedTile(i);
                          }}
                        >
                          <TileIcon tileType={tile.type} status={status} />
                          <span className="sr-only">Show lesson</span>
                        </button>
                      </div>
                    );
                  case "treasure":
                    return (
                      <div
                        className={[
                          "relative -mb-4 left-0",
                        ].join(" ")}
                        onClick={() => {
                          if (status === "ACTIVE") {
                            increaseLessonsCompleted(4);
                            increaseMilestonesOpened(1);
                          }
                        }}
                        role="button"
                        tabIndex={status === "ACTIVE" ? 0 : undefined}
                        aria-hidden={status !== "ACTIVE"}
                        aria-label={
                          status === "ACTIVE" ? "Collect reward" : ""
                        }
                      >
                        {status === "ACTIVE" && (
                          <HoverLabel text="Open" textColor="text-yellow-400" />
                        )}
                        <TileIcon tileType={tile.type} status={status} />
                      </div>
                    );
                }
              })()}
              <TileTooltip
                selectedTile={selectedTile}
                index={i}
                unitNumber={unit.unitNumber}
                tilesLength={unit.tiles.length}
                description={(() => {
                  switch (tile.type) {
                    case "book":
                    case "dumbbell":
                    case "star":
                      return tile.description;
                    case "fast-forward":
                      return status === "LOCKED"
                        ? "Jump here?"
                        : tile.description;
                    case "trophy":
                      return `Unit ${unit.unitNumber} review`;
                    case "treasure":
                      return "";
                  }
                })()}
                status={status}
                closeTooltip={closeTooltip}
              />
            </Fragment>
          );
        })}
      </div>
    </>
  );
};

const getTopBarColors = (
  _scrollY: number
): {
  backgroundColor: `bg-${string}`;
  borderColor: `border-${string}`;
} => {
  // Force dark brown theme for TopBar across the page
  return {
    backgroundColor: "bg-[#680B24]",
    borderColor: "border-[#4e071b]",
  } as const;
};

const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();
  const router = useRouter();
  const { lang } = router.query as { lang?: string | string[] };
  type Lang = "en" | "hi" | "te";
  const supported = new Set<Lang>(["en", "hi", "te"]);
  const pickedLang = Array.isArray(lang) ? lang[0] : lang;
  const currentLang: Lang =
    typeof pickedLang === "string" && supported.has(pickedLang as Lang)
      ? (pickedLang as Lang)
      : "en";
      
  // Language detection for routing
  const isHindi = router.pathname.startsWith("/hindi");
  const isTelugu = router.pathname.startsWith("/telugu");

  const dailyFacts: Record<Lang, string[]> = {
    en: [
      "Honey never spoils — archaeologists found 3,000-year-old honey that was still edible!",
      "Octopuses have three hearts and blue blood.",
      "Bananas are berries, but strawberries aren’t.",
      "A day on Venus is longer than its year.",
      "Your brain uses about 20% of your body’s total energy.",
    ],
    hi: [
      "शहद कभी खराब नहीं होता — पुरातत्वविदों ने 3000 साल पुराना शहद खाने योग्य पाया!",
      "ऑक्टोपस के तीन हृदय और नीला रक्त होता है।",
      "केला एक बेरी है, लेकिन स्ट्रॉबेरी नहीं।",
      "शुक्र ग्रह पर एक दिन, उसके एक वर्ष से भी लंबा होता है।",
      "आपका मस्तिष्क आपके शरीर की कुल ऊर्जा का लगभग 20% उपयोग करता है।",
    ],
    te: [
      "తేనె ఎప్పుడూ పాడవదు — 3,000 సంవత్సరాల పాత తేనెను కూడా తినగలిగారు!",
      "ఆక్టోపస్‌కి మూడు గుండెలు, నీలి రక్తం ఉంటుంది.",
      "అరటి పండు ఒక బెర్రీ, కానీ స్ట్రాబెర్రీ కాదు.",
      "వీనస్‌పై ఒక రోజు అక్కడి సంవత్సరానికి కంటే ఎక్కువ ఉంటుంది.",
      "మీ మెదడు మీ శరీర శక్తి లో సుమారు 20% వాడుతుంది.",
    ],
  };
  const uiText: Record<Lang, { title: string; button: string }> = {
    en: { title: "Your Daily Fact for Today", button: "Got it" },
    hi: { title: "आज का रोचक तथ्य", button: "ठीक है" },
    te: { title: "ఈరోజు ఆసక్తికరమైన విషయం", button: "సరే" },
  };
  function getDayOfYear(d = new Date()): number {
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }
  function randomInt(maxExclusive: number): number {
    if (maxExclusive <= 1) return 0;
    // Prefer crypto for better randomness if available
    if (typeof window !== "undefined") {
      const cryptoObj = window.crypto;
      if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
        const array = new Uint32Array(1);
        cryptoObj.getRandomValues(array);
        // With noUncheckedIndexedAccess, array[0] is number | undefined; but length is 1, so it's safe
        return array[0]! % maxExclusive;
      }
    }
    return Math.floor(Math.random() * maxExclusive);
  }
  function pickRandomDifferent(length: number, exclude: number | null): number {
    if (length <= 1) return 0;
    let idx = randomInt(length);
    if (exclude === null) return idx;
    // Ensure different from last; try a couple of times then fallback
    if (idx === exclude) {
      idx = (idx + 1) % length;
    }
    return idx;
  }
  const facts: string[] = dailyFacts[currentLang];
  const text: { title: string; button: string } = uiText[currentLang];
  const [showFact, setShowFact] = useState(false);
  const [factIndex, setFactIndex] = useState<number | null>(null);
  useEffect(() => {
    // Choose a random fact every time the page is entered, avoid immediate repeat using localStorage
    try {
      const storageKey = `dailyFactLastIndex_${currentLang}`;
      const lastIdxStr = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
      const lastIdx = lastIdxStr !== null ? Number(lastIdxStr) : null;
      const nextIdx = pickRandomDifferent(facts.length, Number.isFinite(lastIdx ?? NaN) ? (lastIdx as number) : null);
      setFactIndex(nextIdx);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, String(nextIdx));
      }
    } catch {}
    setShowFact(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang]);

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const updateScrollY = () => setScrollY(globalThis.scrollY ?? 0);
    updateScrollY();
    document.addEventListener("scroll", updateScrollY);
    return () => document.removeEventListener("scroll", updateScrollY);
  }, []);
  const topBarColors = getTopBarColors(scrollY);

  // ===== Uploaded Notes (Guidebook) =====
  const [notes, setNotes] = useState<UploadItem[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/manageUploads?type=note");
        const data = await res.json();
        if (data?.items) setNotes(data.items as UploadItem[]);
      } catch {}
    };
    void load();
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      {/* ========== animated gradient background (fixed, behind everything) ========== */}
      <div className="pointer-events-none fixed inset-0 -z-50">
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(270deg, #FFF8F2, #F9EEDD, #FDFDFD, #FFFFFF)",
            backgroundSize: "600% 600%",
            animation: "gradientShift 10s ease infinite",
            filter: "saturate(0.9) brightness(1) opacity(0.6)",
          }}
        />
      </div>
      {/* ========== page content ========== */}

      <TopBar
        backgroundColor={topBarColors.backgroundColor}
        borderColor={topBarColors.borderColor}
      />

      {showFact && factIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-2xl bg-white p-6 text-[#0B3D0B] shadow-2xl border-2 border-b-4 border-yellow-300">
            <h3 className="mb-2 text-2xl font-extrabold">
              {text.title}
            </h3>
            <p className="mb-4 text-base">{facts[factIndex]}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowFact(false)}
                className="rounded-xl bg-[#A0522D] text-white px-4 py-2 font-semibold hover:brightness-110 hover:scale-[1.02] transition"
              >
                {text.button}
              </button>
            </div>
          </div>
        </div>
      )}

      <LeftBar selectedTab="Learn" />

      <div className="flex justify-center gap-3 pt-14 px-2 xs:px-4 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="flex max-w-2xl grow flex-col w-full">
          {/* Mobile now uses a floating toggle button within RightBar; no inline RightBar here */}

          {units.map((unit) => (
            <UnitSection unit={unit} key={unit.unitNumber} />
          ))}

          {/* Guidebook: Uploaded Notes */}
          <section className="mt-8 rounded-2xl border-2 border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-[#5C4033]">Guidebook</h2>
            <ul className="flex flex-col gap-2">
              {notes.map((n) => (
                <li key={n.id} className="flex items-center gap-2">
                  <a
                    href={n.relativePath}
                    className="text-[#7B3F00] font-semibold underline truncate"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {n.title}
                  </a>
                  {n.description && (
                    <span className="text-xs text-gray-500 ml-2 truncate">{n.description}</span>
                  )}
                </li>
              ))}
              {notes.length === 0 && (
                <li className="text-sm text-gray-500">No notes uploaded yet.</li>
              )}
            </ul>
          </section>

          <div className="sticky bottom-28 xs:bottom-32 left-0 right-0 flex items-end justify-between px-2">
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/games"
                className="flex h-14 w-14 xs:h-16 xs:w-16 items-center justify-center rounded-full border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 btn-mobile shadow-lg"
              >
                <span className="sr-only">Play sorting game</span>
                <span aria-hidden className="text-2xl">🎮</span>
              </Link>
              <Link
                href="/lesson?practice"
                className="flex h-14 w-14 xs:h-16 xs:w-16 items-center justify-center rounded-full border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 btn-mobile shadow-lg"
              >
                <span className="sr-only">Practice exercise</span>
                <PracticeExerciseSvg className="h-6 w-6 xs:h-8 xs:w-8" />
              </Link>
              <Link
                href={isHindi ? "/hindi/purchased-courses" : isTelugu ? "/telugu/purchased-courses" : "/purchased-courses"}
                className="flex h-14 w-14 xs:h-16 xs:w-16 items-center justify-center rounded-full border-2 border-b-4 border-purple-300 bg-purple-100 transition hover:bg-purple-200 hover:brightness-90 btn-mobile shadow-lg"
              >
                <span className="sr-only">My Purchased Courses</span>
                <span aria-hidden className="text-2xl">📚</span>
              </Link>
            </div>

            {scrollY > 100 && (
              <button
                className="flex h-12 w-12 xs:h-14 xs:w-14 items-center justify-center self-end rounded-2xl border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 btn-mobile shadow-lg"
                onClick={() => scrollTo(0, 0)}
              >
                <span className="sr-only">Jump to top</span>
                <UpArrowSvg />
              </button>
            )}
          </div>
        </div>
        {/* The original RightBar for desktop remains untouched */}
        <RightBar />
      </div>

      <div className="pt-[90px]" />

      <BottomBar selectedTab="Learn" />

      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />

      {/* Tutor Chatbot */}
      <Chatbot pageId="learn" locale="en" docked />
    </>
  );
};

export default Learn;

/* ---------- helper components used by the page (kept as in original) ---------- */

const LessonCompletionSvg = ({
  lessonsCompleted,
  status,
  style = {},
}: {
  lessonsCompleted: number;
  status: TileStatus;
  style?: React.HTMLAttributes<SVGElement>["style"];
}) => {
  if (status !== "ACTIVE") {
    return null;
  }
  switch (lessonsCompleted % 4) {
    case 0:
      return <LessonCompletionSvg0 style={style} />;
    case 1:
      return <LessonCompletionSvg1 style={style} />;
    case 2:
      return <LessonCompletionSvg2 style={style} />;
    case 3:
      return <LessonCompletionSvg3 style={style} />;
    default:
      return null;
  }
};

const HoverLabel = ({
  text,
  textColor,
}: {
  text: string;
  textColor: `text-${string}`;
}) => {
  const hoverElement = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState(72);

  useEffect(() => {
    setWidth(hoverElement.current?.clientWidth ?? width);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverElement.current?.clientWidth]);

  return (
    <div
      className={`absolute z-10 w-max animate-bounce rounded-lg border-2 border-gray-200 bg-white px-3 py-2 font-bold uppercase ${textColor}`}
      style={{
        top: "-25%",
        left: `calc(50% - ${width / 2}px)`,
      }}
      ref={hoverElement}
    >
      {text}
      <div
        className="absolute h-3 w-3 rotate-45 border-b-2 border-r-2 border-gray-200 bg-white"
        style={{ left: "calc(50% - 8px)", bottom: "-8px" }}
      />
    </div>
  );
};

const UnitHeader = ({
  unitNumber,
  description,
  backgroundColor,
  borderColor,
}: {
  unitNumber: number;
  description: string;
  backgroundColor: `bg-${string}`;
  borderColor: `border-${string}`;
}) => {
  const [latestNoteUrl, setLatestNoteUrl] = useState<string | null>(null);
  const [latestNoteTitle, setLatestNoteTitle] = useState<string>("Class notes");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/manageUploads?type=note");
        const data = await res.json();
        if (!mounted) return;
        type NoteLite = { relativePath: string; title?: string; uploadedAt?: string; unitNumber?: number };
        const items = (data?.items ?? []) as NoteLite[];
        if (items.length > 0) {
          // Prefer notes that match this unit number
          const forUnit = items.filter((it) => (it.unitNumber ?? -1) === unitNumber);
          const pool = forUnit.length > 0 ? forUnit : items;
          const sorted = pool
            .slice()
            .sort((a, b) => new Date(b.uploadedAt ?? 0).getTime() - new Date(a.uploadedAt ?? 0).getTime());
          const latestItem = sorted[0]!;
          setLatestNoteUrl(latestItem.relativePath);
          setLatestNoteTitle(latestItem.title || "Class notes");
        } else {
          setLatestNoteUrl(null);
        }
      } catch {
        setLatestNoteUrl(null);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <article
      className={["max-w-2xl text-white sm:rounded-xl", backgroundColor].join(
        " "
      )}
    >
      <header className="flex items-center justify-between gap-4 p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Unit {unitNumber}</h2>
          <p className="text-lg">{description}</p>
        </div>

        {latestNoteUrl && (
          <a
            href={latestNoteUrl}
            target="_blank"
            rel="noreferrer"
            className={[
              "flex items-center gap-3 rounded-2xl border-2 border-b-4 p-3 transition hover:text-gray-100",
              borderColor,
            ].join(" ")}
          >
            <GuidebookSvg />
            <span className="sr-only font-bold uppercase lg:not-sr-only">
              {latestNoteTitle}
            </span>
          </a>
        )}
      </header>
    </article>
  );
};

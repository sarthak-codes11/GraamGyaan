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

type TileStatus = "LOCKED" | "ACTIVE" | "COMPLETE";

const tileStatus = (tile: Tile, lessonsCompleted: number): TileStatus => {
  const lessonsPerTile = 1;
  const tilesCompleted = Math.floor(lessonsCompleted / lessonsPerTile);
  const tiles = units.flatMap((unit) => unit.tiles);
  const tileIndex = tiles.findIndex((t) => t === tile);
  if (tileIndex < tilesCompleted) return "COMPLETE";
  if (tileIndex > tilesCompleted) return "LOCKED";
  return "ACTIVE";
};

const TileIcon = ({ tileType, status }: { tileType: TileType; status: TileStatus }): JSX.Element => {
  switch (tileType) {
    case "star":
      return status === "COMPLETE" ? <CheckmarkSvg /> : status === "ACTIVE" ? <StarSvg /> : <LockSvg />;
    case "book":
      return status === "COMPLETE" ? <GoldenBookSvg /> : status === "ACTIVE" ? <ActiveBookSvg /> : <LockedBookSvg />;
    case "dumbbell":
      return status === "COMPLETE" ? <GoldenDumbbellSvg /> : status === "ACTIVE" ? <ActiveDumbbellSvg /> : <LockedDumbbellSvg />;
    case "fast-forward":
      return status === "COMPLETE" ? <CheckmarkSvg /> : status === "ACTIVE" ? <StarSvg /> : <FastForwardSvg />;
    case "treasure":
      return status === "COMPLETE" ? <GoldenTreasureSvg /> : status === "ACTIVE" ? <ActiveTreasureSvg /> : <LockedTreasureSvg />;
    case "trophy":
      return status === "COMPLETE" ? <GoldenTrophySvg /> : status === "ACTIVE" ? <ActiveTrophySvg /> : <LockedTrophySvg />;
  }
};

const getTileLeftClassName = ({
  index,
  unitNumber,
  tilesLength,
}: {
  index: number;
  unitNumber: number;
  tilesLength: number;
}) => {
  return "left-0" as const;
};

const getTileTooltipLeftOffset = ({
  index,
  unitNumber,
  tilesLength,
}: {
  index: number;
  unitNumber: number;
  tilesLength: number;
}) => {
  return 140 as const;
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
      const clickIsInsideTooltip = tileTooltipRef.current?.contains(event.target as Node);
      if (clickIsInsideTooltip) return;
      closeTooltip();
    };
    window.addEventListener("click", containsTileTooltip, true);
    return () => window.removeEventListener("click", containsTileTooltip, true);
  }, [selectedTile, tileTooltipRef, closeTooltip, index]);

  const unit = units.find((u) => u.unitNumber === unitNumber);
  const activeBackgroundColor = unit?.backgroundColor ?? "bg-green-500";
  const activeTextColor = unit?.textColor ?? "text-green-500";

  return (
    <div className={["relative h-0 w-full", index === selectedTile ? "" : "invisible"].join(" ")} ref={tileTooltipRef}>
      <div
        className={[
          "absolute z-30 flex w-[300px] flex-col gap-4 rounded-xl p-4 font-bold transition-all duration-300",
          status === "ACTIVE" ? activeBackgroundColor : status === "LOCKED" ? "border-2 border-gray-200 bg-gray-100" : "bg-yellow-400",
          index === selectedTile ? "top-4 scale-100" : "-top-14 scale-0",
        ].join(" ")}
        style={{ left: "calc(50% - 150px)" }}
      >
        <div
          className={["absolute left-[140px] top-[-8px] h-4 w-4 rotate-45", status === "ACTIVE" ? activeBackgroundColor : status === "LOCKED" ? "border-l-2 border-t-2 border-gray-200 bg-gray-100" : "bg-yellow-400"].join(
            " "
          )}
          style={{ left: getTileTooltipLeftOffset({ index, unitNumber, tilesLength }) }}
        />

        <div className={["text-lg", status === "ACTIVE" ? "text-white" : status === "LOCKED" ? "text-gray-400" : "text-yellow-600"].join(" ")}>{description}</div>

        {status === "ACTIVE" ? (
          <Link
            href={`/odia/lesson?lesson=${encodeURIComponent(description)}`}
            className={["flex w-full items-center justify-center rounded-xl border-b-4 border-gray-200 bg-white p-3 uppercase", activeTextColor].join(" ")}
          >
            ଆରମ୍ଭ କରନ୍ତୁ! +25 XP
          </Link>
        ) : status === "LOCKED" ? (
          <button className="w-full rounded-xl bg-gray-200 p-3 uppercase text-gray-400" disabled>
            ଲକ୍ ଅଛି
          </button>
        ) : (
          <Link
            href={`/odia/lesson?lesson=${encodeURIComponent(description)}`}
            className="flex w-full items-center justify-center rounded-xl border-b-4 border-yellow-200 bg-white p-3 uppercase text-yellow-400"
          >
            ଅଭ୍ୟାସ +5 XP
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
  const increaseLessonsCompleted = useBoundStore((x) => x.increaseLessonsCompleted);
  const increaseMilestonesOpened = useBoundStore((x) => x.increaseMilestonesOpened);

  return (
    <>
      <UnitHeader unitNumber={unit.unitNumber} description={unit.description} backgroundColor={unit.backgroundColor} borderColor={unit.borderColor} />
      <div className="relative mb-8 mt-[67px] flex max-w-2xl flex-col items-center gap-4">
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
                          <div className="absolute left-0 right-0 top-6 flex justify-center text-lg font-bold text-yellow-700">{unit.unitNumber}</div>
                        </div>
                      );
                    }
                    return (
                      <div className={["relative -mb-4 h-[93px] w-[98px]", getTileLeftClassName({ index: i, unitNumber: unit.unitNumber, tilesLength: unit.tiles.length })].join(" ")}>
                        {tile.type === "fast-forward" && status === "LOCKED" ? (
                          <HoverLabel text="ଏଠାକୁ ଯାଇବେ?" textColor={unit.textColor} />
                        ) : selectedTile !== i && status === "ACTIVE" ? (
                          <HoverLabel text="ଆରମ୍ଭ" textColor={unit.textColor} />
                        ) : null}
                        <LessonCompletionSvg lessonsCompleted={lessonsCompleted} status={status} />
                        <button
                          className={["absolute m-3 rounded-full border-b-8 p-4", getTileColors({ tileType: tile.type, status, defaultColors: `${unit.borderColor} ${unit.backgroundColor}` })].join(" ")}
                          onClick={() => {
                            if (tile.type === "fast-forward" && status === "LOCKED") {
                              void router.push(`/lesson?fast-forward=${unit.unitNumber}`);
                              return;
                            }
                            setSelectedTile(i);
                          }}
                        >
                          <TileIcon tileType={tile.type} status={status} />
                          <span className="sr-only">ପାଠ ଦେଖାନ୍ତୁ</span>
                        </button>
                      </div>
                    );
                  case "treasure":
                    return (
                      <div
                        className={["relative -mb-4", getTileLeftClassName({ index: i, unitNumber: unit.unitNumber, tilesLength: unit.tiles.length })].join(" ")}
                        onClick={() => {
                          if (status === "ACTIVE") {
                            increaseLessonsCompleted(4);
                            increaseMilestonesOpened(1);
                          }
                        }}
                        role="button"
                        tabIndex={status === "ACTIVE" ? 0 : undefined}
                        aria-hidden={status !== "ACTIVE"}
                        aria-label={status === "ACTIVE" ? "ପୁରସ୍କାର ନିଅନ୍ତୁ" : ""}
                      >
                        {status === "ACTIVE" && <HoverLabel text="ଖୋଲନ୍ତୁ" textColor="text-yellow-400" />}
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
                      return status === "LOCKED" ? "ଏଠାକୁ ଯାଇବେ?" : tile.description;
                    case "trophy":
                      return `Unit ${unit.unitNumber} ସମୀକ୍ଷା`;
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

const getTopBarColors = (_scrollY: number): { backgroundColor: `bg-${string}`; borderColor: `border-${string}` } => {
  return { backgroundColor: "bg-[#680B24]", borderColor: "border-[#4e071b]" } as const;
};

const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const updateScrollY = () => setScrollY(globalThis.scrollY ?? 0);
    updateScrollY();
    document.addEventListener("scroll", updateScrollY);
    return () => document.removeEventListener("scroll", updateScrollY);
  }, []);

  const topBarColors = getTopBarColors(scrollY);

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <TopBar backgroundColor={topBarColors.backgroundColor} borderColor={topBarColors.borderColor} />
      <LeftBar selectedTab="Learn" />

      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="flex max-w-2xl grow flex-col">
          {units.map((unit) => (
            <UnitSection unit={unit} key={unit.unitNumber} />
          ))}

          <div className="sticky bottom-28 left-0 right-0 flex items-end justify-between">
            <Link
              href="/odia/lesson?practice"
              className="absolute left-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 md:left-0"
            >
              <span className="sr-only">ଅଭ୍ୟାସ</span>
              <PracticeExerciseSvg className="h-8 w-8" />
            </Link>

            {scrollY > 100 && (
              <button
                className="absolute right-4 flex h-14 w-14 items-center justify-center self-end rounded-2xl border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 md:right-0"
                onClick={() => scrollTo(0, 0)}
              >
                <span className="sr-only">ଉପରକୁ ଯାଆନ୍ତୁ</span>
                <UpArrowSvg />
              </button>
            )}
          </div>
        </div>
        <RightBar />
      </div>

      <div className="pt-[90px]" />
      <BottomBar selectedTab="Learn" />

      <LoginScreen loginScreenState={loginScreenState} setLoginScreenState={setLoginScreenState} />
      <Chatbot pageId="odia" locale="or" docked />
    </>
  );
};

export default Learn;

const LessonCompletionSvg = ({ lessonsCompleted, status, style = {} }: { lessonsCompleted: number; status: TileStatus; style?: React.HTMLAttributes<SVGElement>["style"] }) => {
  if (status !== "ACTIVE") return null;
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

const HoverLabel = ({ text, textColor }: { text: string; textColor: `text-${string}` }) => {
  const hoverElement = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(72);
  useEffect(() => {
    setWidth(hoverElement.current?.clientWidth ?? width);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverElement.current?.clientWidth]);

  return (
    <div
      className={`absolute z-10 w-max animate-bounce rounded-lg border-2 border-gray-200 bg-white px-3 py-2 font-bold uppercase ${textColor}`}
      style={{ top: "-25%", left: `calc(50% - ${width / 2}px)` }}
      ref={hoverElement}
    >
      {text}
      <div className="absolute h-3 w-3 rotate-45 border-b-2 border-r-2 border-gray-200 bg-white" style={{ left: "calc(50% - 8px)", bottom: "-8px" }} />
    </div>
  );
};

const UnitHeader = ({ unitNumber, description, backgroundColor, borderColor }: { unitNumber: number; description: string; backgroundColor: `bg-${string}`; borderColor: `border-${string}` }) => {
  return (
    <article className={["max-w-2xl text-white sm:rounded-xl", backgroundColor].join(" ")}>
      <header className="flex items-center justify-between gap-4 p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">ୟୁନିଟ୍ {unitNumber}</h2>
          <p className="text-lg">{description}</p>
        </div>
        <div className={["flex items-center gap-3 rounded-2xl border-2 border-b-4 p-3 transition hover:text-gray-100", borderColor].join(" ")}>
          <a href="/Notes/sorting-materials-into-groups.docx" download className="flex items-center gap-3" aria-label="କ୍ଲାସ୍ ନୋଟସ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ">
            <GuidebookSvg />
            <span className="sr-only font-bold uppercase lg:not-sr-only">ଗାଇଡବୁକ୍</span>
          </a>
        </div>
      </header>
    </article>
  );
};

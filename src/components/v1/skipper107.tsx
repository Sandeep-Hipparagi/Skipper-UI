"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Team {
  name: string;
  code: string;
}

export interface MatchSide {
  team: Team | null;
  score: number | null;
  penalties?: number;
}

export interface Match {
  id: string;
  date: string;
  time?: string;
  status: "finished" | "upcoming";
  home: MatchSide;
  away: MatchSide;
  winner?: "home" | "away";
}

export interface Round {
  name: string;
  matches: Match[];
}

export const TEAMS: Record<string, Team> = {
  southAfrica: { name: "South Africa", code: "za" },
  netherlands: { name: "Netherlands", code: "nl" },
  germany: { name: "Germany", code: "de" },
  sweden: { name: "Sweden", code: "se" },
  senegal: { name: "Senegal", code: "sn" },
  bosnia: { name: "Bosnia and Herzegovina", code: "ba" },
  austria: { name: "Austria", code: "at" },
  croatia: { name: "Croatia", code: "hr" },
  ivoryCoast: { name: "Côte d'Ivoire", code: "ci" },
  ecuador: { name: "Ecuador", code: "ec" },
  drCongo: { name: "DR Congo", code: "cd" },
  algeria: { name: "Algeria", code: "dz" },
  ghana: { name: "Ghana", code: "gh" },
  australia: { name: "Australia", code: "au" },
  egypt: { name: "Egypt", code: "eg" },
  caboVerde: { name: "Cabo Verde", code: "cv" },
  canada: { name: "Canada", code: "ca" },
  morocco: { name: "Morocco", code: "ma" },
  paraguay: { name: "Paraguay", code: "py" },
  france: { name: "France", code: "fr" },
  usa: { name: "USA", code: "us" },
  belgium: { name: "Belgium", code: "be" },
  portugal: { name: "Portugal", code: "pt" },
  spain: { name: "Spain", code: "es" },
  brazil: { name: "Brazil", code: "br" },
  norway: { name: "Norway", code: "no" },
  mexico: { name: "Mexico", code: "mx" },
  england: { name: "England", code: "gb-eng" },
  switzerland: { name: "Switzerland", code: "ch" },
  colombia: { name: "Colombia", code: "co" },
  argentina: { name: "Argentina", code: "ar" },
  japan: { name: "Japan", code: "jp" },
};

export const ROUNDS: Round[] = [
  {
    name: "Round of 32",
    matches: [
      { id: "r32-1", date: "Mon, 29 Jun", status: "finished", home: { team: TEAMS.southAfrica, score: 0 }, away: { team: TEAMS.canada, score: 1 }, winner: "away" },
      { id: "r32-2", date: "Tue, 30 Jun", status: "finished", home: { team: TEAMS.netherlands, score: 1, penalties: 2 }, away: { team: TEAMS.morocco, score: 1, penalties: 3 }, winner: "away" },
      { id: "r32-3", date: "Tue, 30 Jun", status: "finished", home: { team: TEAMS.germany, score: 1, penalties: 3 }, away: { team: TEAMS.paraguay, score: 1, penalties: 4 }, winner: "away" },
      { id: "r32-4", date: "Wed, 1 Jul", status: "finished", home: { team: TEAMS.france, score: 3 }, away: { team: TEAMS.sweden, score: 0 }, winner: "home" },
      { id: "r32-5", date: "Thu, 2 Jul", status: "finished", home: { team: TEAMS.belgium, score: 3 }, away: { team: TEAMS.senegal, score: 2 }, winner: "home" },
      { id: "r32-6", date: "Thu, 2 Jul", status: "finished", home: { team: TEAMS.usa, score: 2 }, away: { team: TEAMS.bosnia, score: 0 }, winner: "home" },
      { id: "r32-7", date: "Fri, 3 Jul", status: "finished", home: { team: TEAMS.spain, score: 3 }, away: { team: TEAMS.austria, score: 0 }, winner: "home" },
      { id: "r32-8", date: "Fri, 3 Jul", status: "finished", home: { team: TEAMS.portugal, score: 2 }, away: { team: TEAMS.croatia, score: 1 }, winner: "home" },
      { id: "r32-9", date: "Mon, 29 Jun", status: "finished", home: { team: TEAMS.brazil, score: 2 }, away: { team: TEAMS.japan, score: 1 }, winner: "home" },
      { id: "r32-10", date: "Tue, 30 Jun", status: "finished", home: { team: TEAMS.ivoryCoast, score: 1 }, away: { team: TEAMS.norway, score: 2 }, winner: "away" },
      { id: "r32-11", date: "Wed, 1 Jul", status: "finished", home: { team: TEAMS.mexico, score: 2 }, away: { team: TEAMS.ecuador, score: 0 }, winner: "home" },
      { id: "r32-12", date: "Wed, 1 Jul", status: "finished", home: { team: TEAMS.england, score: 2 }, away: { team: TEAMS.drCongo, score: 1 }, winner: "home" },
      { id: "r32-13", date: "Fri, 3 Jul", status: "finished", home: { team: TEAMS.switzerland, score: 2 }, away: { team: TEAMS.algeria, score: 0 }, winner: "home" },
      { id: "r32-14", date: "Sat, 4 Jul", status: "finished", home: { team: TEAMS.colombia, score: 1 }, away: { team: TEAMS.ghana, score: 0 }, winner: "home" },
      { id: "r32-15", date: "Fri, 3 Jul", status: "finished", home: { team: TEAMS.australia, score: 1, penalties: 2 }, away: { team: TEAMS.egypt, score: 1, penalties: 4 }, winner: "away" },
      { id: "r32-16", date: "Sat, 4 Jul", status: "finished", home: { team: TEAMS.argentina, score: 3 }, away: { team: TEAMS.caboVerde, score: 2 }, winner: "home" },
    ],
  },
  {
    name: "Round of 16",
    matches: [
      { id: "r16-1", date: "Sat, 4 Jul", status: "finished", home: { team: TEAMS.canada, score: 0 }, away: { team: TEAMS.morocco, score: 3 }, winner: "away" },
      { id: "r16-2", date: "Sun, 5 Jul", status: "finished", home: { team: TEAMS.paraguay, score: 0 }, away: { team: TEAMS.france, score: 1 }, winner: "away" },
      { id: "r16-3", date: "Mon, 6 Jul", status: "finished", home: { team: TEAMS.usa, score: 1 }, away: { team: TEAMS.belgium, score: 4 }, winner: "away" },
      { id: "r16-4", date: "Mon, 6 Jul", status: "finished", home: { team: TEAMS.portugal, score: 0 }, away: { team: TEAMS.spain, score: 1 }, winner: "away" },
      { id: "r16-5", date: "Mon, 6 Jul", status: "finished", home: { team: TEAMS.brazil, score: 1 }, away: { team: TEAMS.norway, score: 2 }, winner: "away" },
      { id: "r16-6", date: "Mon, 6 Jul", status: "finished", home: { team: TEAMS.mexico, score: 2 }, away: { team: TEAMS.england, score: 3 }, winner: "away" },
      { id: "r16-7", date: "Tue, 7 Jul", status: "finished", home: { team: TEAMS.switzerland, score: 0, penalties: 4 }, away: { team: TEAMS.colombia, score: 0, penalties: 3 }, winner: "home" },
      { id: "r16-8", date: "Tue, 7 Jul", status: "finished", home: { team: TEAMS.argentina, score: 3 }, away: { team: TEAMS.egypt, score: 2 }, winner: "home" },
    ],
  },
  {
    name: "Quarter-finals",
    matches: [
      { id: "qf-1", date: "Fri, 10 Jul", time: "4:00 am", status: "finished", home: { team: TEAMS.france, score: 2 }, away: { team: TEAMS.morocco, score: 0 }, winner: "home" },
      { id: "qf-2", date: "Sat, 11 Jul", time: "3:00 am", status: "finished", home: { team: TEAMS.spain, score: 2 }, away: { team: TEAMS.belgium, score: 1 }, winner: "home" },
      { id: "qf-3", date: "Sun, 12 Jul", time: "5:00 am", status: "upcoming", home: { team: TEAMS.norway, score: null }, away: { team: TEAMS.england, score: null } },
      { id: "qf-4", date: "Sun, 12 Jul", time: "10:00 am", status: "upcoming", home: { team: TEAMS.argentina, score: null }, away: { team: TEAMS.switzerland, score: null } },
    ],
  },
  {
    name: "Semi-finals",
    matches: [
      { id: "sf-1", date: "Wed, 15 Jul", time: "4:00 am", status: "upcoming", home: { team: TEAMS.france, score: null }, away: { team: TEAMS.spain, score: null } },
      { id: "sf-2", date: "Thu, 16 Jul", time: "3:00 am", status: "upcoming", home: { team: null, score: null }, away: { team: null, score: null } },
    ],
  },
  {
    name: "Final",
    matches: [
      { id: "f-1", date: "Mon, 20 Jul", time: "3:00 am", status: "upcoming", home: { team: null, score: null }, away: { team: null, score: null } },
    ],
  },
];

const TRANSITION = { duration: 0.5, ease: [0.4, 0, 0.2, 1] } as const;

function FlagIcon({ team }: { team: Team | null }) {
  if (!team) {
    return (
      <span className="flex h-5 w-7 items-center justify-center">
        <Shield className="text-muted-foreground/50 h-4 w-4" />
      </span>
    );
  }
  const flagCode = team.code === "gb-eng" ? "gb" : team.code;
  const flag = String.fromCodePoint(
    ...[...flagCode.toUpperCase()].map((letter) => 127397 + letter.charCodeAt(0))
  );
  return (
    <span
      role="img"
      aria-label={`${team.name} flag`}
      className="border-border/40 flex h-5 w-7 items-center justify-center overflow-hidden rounded-[3px] border text-base leading-none"
      aria-hidden={false}
    >
      {flag}
    </span>
  );
}

function TeamRow({
  side,
  isWinner,
  isFinished,
}: {
  side: MatchSide;
  isWinner: boolean;
  isFinished: boolean;
}) {
  const isLoser = isFinished && !isWinner;
  return (
    <div className="flex items-center gap-3">
      <FlagIcon team={side.team} />
      <span className={cn("flex-1 truncate text-sm font-medium", isLoser && "text-muted-foreground")}>
        {side.team?.name ?? "TBD"}
      </span>
      {side.score !== null && (
        <span className={cn("text-sm font-semibold tabular-nums", isLoser && "text-muted-foreground")}>
          {side.score}
          {side.penalties !== undefined && ` (${side.penalties})`}
        </span>
      )}
      <span
        className={cn(
          "border-y-4 border-r-[6px] border-y-transparent",
          isWinner ? "border-r-foreground" : "border-r-transparent"
        )}
      />
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === "finished";

  return (
    <div
      style={{ width: 250, height: 124 }}
      className="border-border/60 bg-card hover:border-border rounded-2xl border p-4 shadow-sm transition-colors"
    >
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {match.date}
          {match.time ? `, ${match.time}` : ""}
        </span>
        {isFinished && (
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
            FT{match.home.penalties !== undefined ? " (P)" : ""}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <TeamRow
          side={match.home}
          isWinner={match.winner === "home"}
          isFinished={isFinished}
        />
        <TeamRow
          side={match.away}
          isWinner={match.winner === "away"}
          isFinished={isFinished}
        />
      </div>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Singapore",
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(time),
    [time]
  );

  return (
    <p className="text-muted-foreground text-xs italic">
      All times are in UTC+8 · Current time:{" "}
      <time dateTime={time.toISOString()} className="tabular-nums not-italic font-mono">
        {formatted}
      </time>
    </p>
  );
}

export function KnockoutBracket({
  rounds = ROUNDS,
  initialRound = 1,
  className,
}: {
  rounds?: Round[];
  initialRound?: number;
  className?: string;
}) {
  const maxRoundIndex = Math.max(0, rounds.length - 2);
  const [currentRound, setCurrentRound] = useState(() =>
    Math.min(Math.max(initialRound, 0), maxRoundIndex)
  );

  const getColX = (roundIdx: number) => 20 + (roundIdx - currentRound) * 290;

  const positions = useMemo(() => {
    const arr: number[][] = rounds.map(() => []);
    arr[currentRound] = rounds[currentRound].matches.map((_, idx) => 156 * idx + 62);

    for (let r = currentRound + 1; r < rounds.length; r++) {
      arr[r] = rounds[r].matches.map(
        (_, mIdx) => (arr[r - 1][2 * mIdx] + arr[r - 1][2 * mIdx + 1]) / 2
      );
    }
    for (let r = currentRound - 1; r >= 0; r--) {
      arr[r] = rounds[r].matches.map((_, mIdx) => arr[r + 1][Math.floor(mIdx / 2)]);
    }
    return arr;
  }, [rounds, currentRound]);

  const containerHeight = 156 * rounds[currentRound].matches.length - 32;

  return (
    <div className={cn("w-full max-w-[850px] mx-auto", className)}>
      {/* Round Header Bar with Paging Buttons */}
      <div className="relative mb-6 h-10 overflow-hidden">
        <motion.button
          type="button"
          aria-label="Previous round"
          onClick={() => setCurrentRound((c) => Math.max(0, c - 1))}
          animate={{ opacity: currentRound > 0 ? 1 : 0 }}
          transition={TRANSITION}
          className={cn(
            "text-foreground hover:bg-muted absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
            currentRound === 0 && "pointer-events-none"
          )}
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </motion.button>

        <motion.button
          type="button"
          aria-label="Next round"
          onClick={() => setCurrentRound((c) => Math.min(maxRoundIndex, c + 1))}
          animate={{ opacity: currentRound < maxRoundIndex ? 1 : 0 }}
          transition={TRANSITION}
          className={cn(
            "text-foreground hover:bg-muted absolute right-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
            currentRound >= maxRoundIndex && "pointer-events-none"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>

        {rounds.map((round, rIdx) => (
          <motion.div
            key={round.name}
            initial={false}
            animate={{
              x: getColX(rIdx),
              opacity: rIdx >= currentRound && rIdx < currentRound + 3 ? 1 : 0,
            }}
            transition={TRANSITION}
            style={{ width: 250 }}
            className="absolute top-0 flex h-10 items-center justify-center"
          >
            <span className="text-base font-semibold">{round.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Bracket Tree Layout Canvas */}
      <motion.div
        initial={false}
        animate={{ height: containerHeight }}
        transition={TRANSITION}
        className="relative overflow-hidden"
      >
        {/* Stub Connectors */}
        {rounds.map((round, rIdx) =>
          round.matches.map((m, mIdx) => (
            <motion.span
              key={`stub-${m.id}`}
              initial={false}
              animate={{
                x: getColX(rIdx) - 20,
                y: positions[rIdx][mIdx],
                opacity: rIdx === currentRound ? 1 : 0,
              }}
              transition={TRANSITION}
              style={{ width: 20 }}
              className="bg-border/60 absolute left-0 top-0 h-px"
            />
          ))
        )}

        {/* Elbow Connectors */}
        {rounds.map((round, rIdx) =>
          rIdx === 0
            ? null
            : round.matches.map((m, mIdx) => {
                const prevTop = positions[rIdx - 1][2 * mIdx];
                const prevBtm = positions[rIdx - 1][2 * mIdx + 1];
                const h = prevBtm - prevTop;
                return (
                  <motion.div
                    key={`elbow-${m.id}`}
                    initial={false}
                    animate={{
                      x: getColX(rIdx - 1) + 250,
                      y: prevTop,
                      height: Math.max(h, 1),
                      opacity: rIdx > currentRound ? 1 : 0,
                    }}
                    transition={TRANSITION}
                    style={{ width: 20 }}
                    className="border-border/60 absolute left-0 top-0 rounded-r-xl border-y border-r"
                  >
                    <span
                      style={{ width: 20 }}
                      className="bg-border/60 absolute left-full top-1/2 h-px"
                    />
                  </motion.div>
                );
              })
        )}

        {/* Match Cards */}
        {rounds.map((round, rIdx) =>
          round.matches.map((m, mIdx) => (
            <motion.div
              key={m.id}
              initial={false}
              animate={{
                x: getColX(rIdx),
                y: positions[rIdx][mIdx] - 62,
                opacity: rIdx >= currentRound ? 1 : 0,
              }}
              transition={TRANSITION}
              className={cn("absolute left-0 top-0", rIdx < currentRound && "pointer-events-none")}
            >
              <MatchCard match={m} />
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="border-border/60 mt-10 border-t pt-6">
        <LiveClock />
      </div>
    </div>
  );
}

export function Skipper107() {
  return (
    <div className="text-foreground min-h-screen w-full bg-background overflow-y-auto py-16 px-6">
      <KnockoutBracket rounds={ROUNDS} initialRound={2} />
    </div>
  );
}

export function DemoSkipper107() {
  return <Skipper107 />;
}

export default Skipper107;

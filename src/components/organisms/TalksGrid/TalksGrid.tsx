"use client";

import React, { useMemo, useState } from "react";
import {
  TalkCompany,
  TalkType,
  getYouTubeThumbnail,
  getYouTubeUrl,
} from "@/constants/talks";
import type { TalkRecord } from "@/constants/talks";
import { PlayIcon } from "@/components/icons/PlayIcon/PlayIcon";
import { classNames } from "@/utils/style";

type TalksGridProps = {
  talks: TalkRecord[];
};

const companyBadgeClassNames: Record<TalkCompany, string> = {
  [TalkCompany.Codeium]: "bg-emerald-100 text-emerald-800",
  [TalkCompany.Windsurf]: "bg-sky-100 text-sky-800",
  [TalkCompany.Antigravity]: "bg-violet-100 text-violet-800",
};

const typeLabels: Record<TalkType, string> = {
  [TalkType.Talk]: "Talk",
  [TalkType.Podcast]: "Podcast",
  [TalkType.Interview]: "Interview",
  [TalkType.Demo]: "Demo",
  [TalkType.Panel]: "Panel",
  [TalkType.Livestream]: "Livestream",
};

const formatDate = (date: string): string => {
  const [year, month] = date.split("-").map(Number);
  if (!month) return `${year}`;
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

type Filter = "All" | TalkCompany;

/**
 * Grid of YouTube video cards, styled like search results, with company filters.
 */
export const TalksGrid: React.FC<TalksGridProps> = ({ talks }) => {
  const [filter, setFilter] = useState<Filter>("All");

  const sortedTalks = useMemo(
    () => [...talks].sort((a, b) => b.date.localeCompare(a.date)),
    [talks],
  );
  const visibleTalks = sortedTalks.filter(
    (talk) => filter === "All" || talk.company === filter,
  );

  const filters: Filter[] = ["All", ...Object.values(TalkCompany)];

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {filters.map((option) => {
          const count =
            option === "All"
              ? talks.length
              : talks.filter((talk) => talk.company === option).length;
          if (count === 0) return null;
          return (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={classNames(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                filter === option
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {option}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTalks.map((talk) => (
          <a
            key={talk.youtubeId}
            href={getYouTubeUrl(talk.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm">
              <img
                src={talk.image ?? getYouTubeThumbnail(talk.youtubeId)}
                alt={talk.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                <div className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <PlayIcon className="ml-1 h-6 w-6 fill-current" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                {typeLabels[talk.type]}
              </span>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-600">
                {talk.title}
              </h3>
              {talk.channel && (
                <p className="text-sm text-gray-600">{talk.channel}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span
                  className={classNames(
                    "rounded-full px-2 py-0.5 font-medium",
                    companyBadgeClassNames[talk.company],
                  )}
                >
                  {talk.company}
                </span>
                {talk.event && <span>{talk.event}</span>}
                {talk.event && <span aria-hidden>&middot;</span>}
                <span>{formatDate(talk.date)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

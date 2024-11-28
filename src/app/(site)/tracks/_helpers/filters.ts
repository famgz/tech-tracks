import { translate } from "@/lib/translate";
import { TrackWithExtras } from "@/types/content";
import { Level } from "@prisma/client";
import { ReadonlyURLSearchParams } from "next/navigation";

const normalizeParams = (param: string | string[]) =>
  Array.isArray(param) || param === null ? param : [param];

export function parseSearchParams(searchParams: ReadonlyURLSearchParams) {
  return {
    search: searchParams.get("search") || "",
    career: normalizeParams(searchParams.getAll("career")),
    corporate: normalizeParams(searchParams.getAll("corporate")),
    level: normalizeParams(searchParams.getAll("level")),
    skill: normalizeParams(searchParams.getAll("skill")),
  };
}

export function getLevelFilters(tracks: TrackWithExtras[]) {
  return Object.keys(Level).map((level) => ({
    id: level,
    name: translate(level),
    _count: {
      tracks: tracks.reduce(
        (acc, track) => (track.level === level ? acc + 1 : acc),
        0,
      ),
    },
  }));
}

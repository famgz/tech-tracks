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

"use client";

import { IFilters } from "@/app/tracks/page";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { translate } from "@/lib/translate";
import { cn } from "@/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  filters: IFilters;
  className?: string;
}

type FilterKeys = keyof Props["filters"];

type ParsedSearchParams = {
  [K in FilterKeys]: string[];
};

export default function Filters({ filters, className }: Props) {
  const searchParams = useSearchParams();
  const parsedSearchParams: ParsedSearchParams = {
    level: searchParams.getAll("level"),
    career: searchParams.getAll("career"),
    corporate: searchParams.getAll("corporate"),
    skill: searchParams.getAll("skill"),
  };
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  function updateUrl() {
    replace(`${pathname}?${params.toString()}`);
  }

  const handleInputChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const searchString = e.target.value;
      if (searchString) {
        params.set("search", searchString);
      } else {
        params.delete("search");
      }
      updateUrl();
    },
    300,
  );

  function handleCheckboxChange(
    key: FilterKeys,
    value: string,
    checked: boolean,
  ) {
    if (checked) {
      params.append(key, value);
    } else {
      const values = params.getAll(key);
      // Remove the specific value
      values.forEach((val) => {
        if (val === value) {
          params.delete(key); // Delete all instances of the key first
          values
            .filter((v) => v !== value)
            .forEach((newValue) => {
              params.append(key, newValue); // Add back all the other values
            });
        }
      });
    }
    updateUrl();
  }

  function handleResetSearchInput() {
    params.delete("search");
    updateUrl();
  }

  function handleResetAllCheckboxs() {
    params.delete("level");
    params.delete("career");
    params.delete("corporate");
    params.delete("skill");
    updateUrl();
  }

  return (
    <div
      className={cn("flex max-w-[min(20vw,250px)] flex-col gap-3", className)}
    >
      <span className="">Filtros</span>
      <form className="flex-center gap-2 rounded-lg border px-2 py-1">
        <SearchIcon className="size-4 text-muted-foreground" />
        <input
          className="flex-1 bg-transparent text-sm outline-none"
          size={1}
          onChange={handleInputChange}
        />
        <button type="reset" onClick={handleResetSearchInput}>
          <XIcon size={12} className="text-muted-foreground" />
        </button>
      </form>
      <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
        <div className="space-y-3 overflow-x-hidden">
          {Object.entries(filters).map(([k, v]) => {
            const key = k as FilterKeys;

            return (
              <div key={key}>
                <h3 className="mb-1 text-sm font-bold capitalize">
                  {translate(k)}
                </h3>
                <div className="">
                  {v.map((x: any) => (
                    <div
                      key={x.id as string}
                      className="ml-2 flex items-center gap-2 rounded py-0.5 hover:bg-muted"
                      title={x.name}
                    >
                      <Checkbox
                        id={x.name}
                        name={x.name}
                        checked={parsedSearchParams[key].includes(x.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(key, x.id, !!checked)
                        }
                      />
                      <label
                        htmlFor={x.name}
                        className="flex flex-1 cursor-pointer items-center gap-1 truncate whitespace-nowrap text-xs"
                      >
                        <span className="inline-block max-w-[min(10vw,134px)] truncate sm:max-w-[min(10vw,200px)]">
                          {x.name}
                        </span>
                        <span>({x._count?.tracks ?? 0})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {Object.values(parsedSearchParams).some((x) => x.length) && (
        <Button variant={"outline"} onClick={handleResetAllCheckboxs}>
          Clear all
        </Button>
      )}
    </div>
  );
}

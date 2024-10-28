"use client";

import { parseSearchParams } from "@/app/(site)/tracks/_helpers/filters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { translate } from "@/lib/translate";
import { cn } from "@/lib/utils";
import { FilterKeys, IFilters } from "@/types/content";
import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  filters: IFilters;
  className?: string;
}

export default function Filters({ filters, className }: Props) {
  const searchParams = useSearchParams();
  const parsedSearchParams = parseSearchParams(searchParams);
  const searchString = parsedSearchParams.search;
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  function updateUrl() {
    window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
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
      values.forEach((val) => {
        if (val === value) {
          params.delete(key);
          values
            .filter((v) => v !== value)
            .forEach((newValue) => {
              params.append(key, newValue);
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
      className={cn(
        "flex w-full flex-col gap-3 sm:max-w-[min(20vw,250px)]",
        className,
      )}
    >
      <span className="" tabIndex={0}>
        Filtros
      </span>
      <form className="flex-center gap-2 rounded-lg border px-2 py-1">
        <SearchIcon className="size-4 text-muted-foreground" />
        <input
          className="flex-1 bg-transparent text-sm outline-none"
          size={1}
          defaultValue={searchString}
          onChange={handleInputChange}
          placeholder="Pesquise"
        />
        <button type="reset" onClick={handleResetSearchInput}>
          <XIcon size={12} className="text-muted-foreground" />
        </button>
      </form>
      <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
        <div className="overflow-x-hidden">
          {Object.entries(filters).map(([k, v]) => {
            const key = k as FilterKeys;

            return (
              <Accordion key={key} type="multiple" defaultValue={["skill"]}>
                <AccordionItem value={key} className="">
                  <AccordionTrigger className="py-2 pl-1 pr-2 hover:bg-muted/40">
                    <h3 className="text-sm font-bold capitalize">
                      {translate(k)}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="py-2">
                    {v.map((x: any) => (
                      <div
                        key={x.id as string}
                        className="ml-2 flex items-center gap-2 rounded hover:bg-muted"
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
                          className="truncatee flex flex-1 cursor-pointer items-center gap-1 whitespace-nowrap py-1 text-xs"
                        >
                          <span className="inline-block max-w-[45vw] truncate sm:max-w-[min(12vw,180px)]">
                            {x.name}
                          </span>
                          <span>({x._count?.tracks ?? 0})</span>
                        </label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </ScrollArea>

      {Object.values(parsedSearchParams).some((x) => x?.length) && (
        <Button variant={"outline"} onClick={handleResetAllCheckboxs}>
          Limpar todos
        </Button>
      )}
    </div>
  );
}

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Career, Corporate, Skill } from "@prisma/client";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  filters: {
    level: { id: string; name: string }[];
    career: Career[];
    corporate: Corporate[];
    skill: Skill[];
  };
  className?: string;
}

export default function Filters({ filters, className }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  const handleInputChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const searchString = e.target.value;
      if (searchString) {
        params.set("search", searchString);
      } else {
        params.delete("search");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    500,
  );

  function handleCheckboxChange(key: string, value: string, checked: boolean) {
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
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={cn("flex max-w-[20%] flex-col", className)}>
      <span className="mb-2">Filters</span>
      <div className="flex-center mb-4 gap-2 rounded-lg border px-2 py-1">
        <SearchIcon className="size-4 text-muted-foreground" />
        <input
          className="flex-1 bg-transparent outline-none"
          size={1}
          onChange={handleInputChange}
        />
      </div>
      <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
        <div className="space-y-3">
          {Object.entries(filters).map(([k, v]) => (
            <div key={k}>
              <h3 className="mb-1 text-sm font-bold capitalize">{k}</h3>
              <div className="">
                {v.map((x) => (
                  <div
                    key={x.id as string}
                    className="ml-2 flex items-center gap-2 rounded py-0.5 hover:bg-muted"
                    title={x.name}
                  >
                    <Checkbox
                      id={x.name}
                      name={x.name}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(k, x.id, !!checked)
                      }
                    />
                    <label
                      htmlFor={x.name}
                      className="flex-1 cursor-pointer whitespace-nowrap text-xs"
                    >
                      {x.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

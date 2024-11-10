"use client";

import Filters from "@/app/(site)/tracks/_components/filters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IFilters } from "@/types/content";
import { FilterIcon } from "lucide-react";

interface Props {
  filters: IFilters;
}

export default function FiltersWrapper({ filters }: Props) {
  return (
    <>
      {/* desktop filters */}
      <Filters filters={filters} className="desktop-only" />

      {/* mobile filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="mobile-only absolute right-4 top-4"
          >
            <FilterIcon className="" />
          </Button>
        </SheetTrigger>
        <SheetContent className="mobile-only flex">
          <Filters filters={filters} className="flex-1" />
        </SheetContent>
      </Sheet>
    </>
  );
}

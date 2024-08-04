import { Checkbox } from "@/components/ui/checkbox";

const filters = ["Technology", "Area", "Company", "Dificulty"];

export default function Filters() {
  return (
    <div className="space-y-3">
      {filters.map((x) => (
        <div key={x}>
          <h3 className="mb-1 text-sm font-bold">{x}</h3>
          <div className="space-y-1">
            {Array.from({ length: 12 }).map((x, i) => (
              <div key={i} className="ml-2 flex items-center gap-2">
                <Checkbox />
                <span className="whitespace-nowrap text-xs">
                  Lorem ipsum dolor sit scaveng
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

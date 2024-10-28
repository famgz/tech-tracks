import { LoaderCircleIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex-center size-full flex-1 flex-col gap-1 bg-background/20">
      <LoaderCircleIcon className="size-12 animate-spin stroke-[2px] text-muted-foreground" />
      <span className="text-muted-foreground">Carregando...</span>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { User } from "next-auth";

interface Props {
  trackId: string;
  user?: User;
}

export default function TrackStartButton({ trackId, user }: Props) {
  return (
    <Button
      variant={"default"}
      className="gap-2 text-xl font-semibold max-xs:w-full"
      size={"lg"}
    >
      Matricular-se
    </Button>
  );
}

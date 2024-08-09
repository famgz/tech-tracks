import DioIcon from "@/components/icons/dio";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <Card className="rounded-b-none">
        <CardContent className="_container flex items-center justify-between gap-6 py-3 text-xs text-muted-foreground">
          <p className="">
            © 2024 <span className="font-bold">Tech Tracks</span>
          </p>
          <div className="flex items-center gap-1.5">
            powered by
            <Link href="https://dio.me" target="_blank">
              <DioIcon className="size-9 fill-slate-400" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
}

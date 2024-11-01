import DioIcon from "@/components/icons/dio";
import YoutubeIcon from "@/components/icons/youtube";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <Card className="rounded-b-none">
        <CardContent className="_container flex !max-w-[500px] items-center justify-between py-3 text-xs text-muted-foreground">
          <p className="">
            ©2024{" "}
            <span className="whitespace-nowrap font-bold">Tech Tracks</span>
          </p>

          <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-0">
            <span className="whitespace-nowrap">com o suporte de</span>

            <div className="flex-center gap-2">
              <Link href="https://dio.me" target="_blank">
                <DioIcon className="w-9 fill-slate-400" />
              </Link>
              <Link href="https://youtube.com" target="_blank">
                <YoutubeIcon className="w-6 fill-slate-400" strokeWidth={1} />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
}

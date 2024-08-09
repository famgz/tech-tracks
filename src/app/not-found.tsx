import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex-center h-full w-full">
      <div className="flex-center">
        <div className="space-y-1 border-r px-12">
          <p className="text-4xl font-bold">404</p>
          <h1 className="text-2xl font-light">Not found</h1>
        </div>

        <div className="px-12">
          <Button size={"lg"}>
            <Link href={"/"} className="text-lg !font-bold">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

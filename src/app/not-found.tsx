import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex-center h-full w-full">
      <div className="flex-center">
        <div className="flex flex-col items-center border-r px-12">
          <p className="text-4xl font-bold">404</p>

          <Image
            src={"/not-found.svg"}
            width={200}
            height={200}
            alt="not found image showing a bug inside a laptop screen"
          />
          <h1 className="text-2xl font-light">
            Este recurso não foi encontrado
          </h1>
        </div>

        <div className="px-12">
          <Button size={"lg"}>
            <Link href={"/"} className="text-lg !font-bold">
              Voltar para Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

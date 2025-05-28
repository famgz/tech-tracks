'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import errorImg from "@/assets/images/error.svg";
import LogoFullIcon from "@/components/icons/logo-full";

export default function ErrorPage() {
  return (
    <div className="flex-center h-full w-full">
      <div className="flex-center max-sm:flex-col">
        <div className="flex flex-col items-center p-10 max-sm:border-b sm:border-r">
          <p className="text-4xl font-bold">Erro</p>

          <Image
            src={errorImg}
            width={200}
            height={200}
            alt="error image showing a bug inside a laptop screen"
          />
          <h1 className="text-2xl font-light">
            Algo inesperado ocorreu
          </h1>
        </div>

        <div className="flex h-full flex-col justify-between gap-12 p-10">
          <LogoFullIcon className="h-16" />

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

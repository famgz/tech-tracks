import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/images/hero.svg";

export default async function Home() {
  return (
    <div className="_container flex-center flex-col py-6 md:py-10">
      <div className="grid gap-6 md:grid-cols-2">
        {/* gretings */}
        <div className="space-y-12">
          <h1 className="text-3xl font-medium text-foreground/80 md:text-5xl">
            Aprenda a{" "}
            <span className="font-extrabold text-foreground">programar</span>,
            transforme o seu{" "}
            <span className="font-extrabold text-foreground">futuro</span>!
          </h1>

          <div className="space-y-3 font-light text-muted-foreground md:text-xl">
            <p>
              Seja bem-vindo(a) ao{" "}
              <span className="font-bold text-primary">Tech Tracks</span>, sua
              plataforma completa para aprender programação de forma prática e
              eficiente.
            </p>
            <p>
              Oferecemos cursos para todos os níveis, desde iniciantes até
              avançados, com muita prática e foco nas tecnologias mais
              demandadas pelo mercado.
            </p>

            <p>
              Estude no seu ritmo, de onde estiver, e conte com suporte contínuo
              para alcançar seus objetivos. Venha transformar seu futuro com a
              gente!
            </p>
          </div>

          <Link
            href="/tracks"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full max-w-[600px] text-lg font-bold md:text-xl",
            )}
          >
            Confira os Cursos
          </Link>
        </div>

        {/* hero image */}
        <div className="flex-center max-md:order-first">
          <Image
            src={heroImage}
            width={500}
            height={500}
            priority
            className="max-md:size-[300px]"
            alt="programmer studying"
          />
        </div>
      </div>
    </div>
  );
}

import LoginDialog from "@/components/login-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { auth } from "../../auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="_container flex flex-col items-center py-10">
      <div className="grid gap-6 py-8 md:grid-cols-2">
        {/* gretings */}
        <div className="space-y-12">
          <h1 className="text-6xl font-medium text-foreground/80">
            Aprenda a{" "}
            <span className="font-extrabold text-foreground">programar</span>,
            transforme o seu{" "}
            <span className="font-extrabold text-foreground">futuro</span>!
          </h1>

          <div className="space-y-3 text-xl font-light text-muted-foreground">
            <p>
              Seja bem-vindo(a) ao{" "}
              <span className="font-bold text-primary">Tech Tracks</span>, sua
              plataforma completa para aprender programação de forma prática e
              eficiente.
            </p>
            <p>
              Oferecemos cursos para todos os níveis, desde iniciantes até
              avançados, com foco nas tecnologias mais demandadas pelo mercado e
              muita prática.
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
              "w-full max-w-[600px] text-xl font-bold",
            )}
          >
            Confira os Cursos
          </Link>
        </div>

        {/* hero image */}
        <div className="flex-center max-md:order-first">
          <Image
            src={"/hero.svg"}
            width={500}
            height={500}
            alt="programmer studying"
          />
        </div>
      </div>
    </div>
  );
}

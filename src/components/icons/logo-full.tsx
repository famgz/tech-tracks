import { cn } from "@/lib/utils";
import Image from "next/image";
import logoImage from "@/assets/images/logo.svg";

interface Props {
  className?: string;
}

export default function LogoFullIcon({ className = "" }: Props) {
  return (
    <div className={cn("relative aspect-[2000/565] h-7", className)}>
      <Image src={logoImage} fill className="object-contain" alt="Logo" />
    </div>
  );
}

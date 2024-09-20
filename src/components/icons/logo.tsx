import Image from "next/image";

export default function Logo() {
  return (
    <div className="relative aspect-[2000/565] h-7">
      <Image src={"/logo.svg"} fill className="object-contain" alt="Logo" />
    </div>
  );
}

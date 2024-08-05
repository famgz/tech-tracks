import Image from "next/image";
import Link from "next/link";

export default function CourseCard() {
  return (
    <Link
      href={"#"}
      className="relative aspect-[1200/564] min-w-[200px] cursor-pointer overflow-hidden rounded-lg"
    >
      <Image
        src="https://hermes.dio.me/tracks/cover/eb57e789-10fe-46ee-9e32-4a7c9aa581ab.png"
        fill
        alt=""
        className="object-cover"
        sizes="(max-width: 768px) 60vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 235px"
      />
    </Link>
  );
}

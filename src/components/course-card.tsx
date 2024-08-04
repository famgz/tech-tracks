import Image from "next/image";

export default function CourseCard() {
  return (
    <div className="relative aspect-[1200/564] w-[200px] overflow-hidden rounded-lg">
      <Image
        src="https://hermes.dio.me/tracks/cover/eb57e789-10fe-46ee-9e32-4a7c9aa581ab.png"
        fill
        alt=""
        className="object-cover"
        sizes="200px"
      />
    </div>
  );
}

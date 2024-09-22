import Loading from "@/components/loading";
import { Suspense } from "react";

export default function ClassLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Loading />}>
      <main className="_main">{children}</main>
    </Suspense>
  );
}

import Footer from "@/components/footer";
import Header from "@/components/header";
import Loading from "@/components/loading";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <main className="_main">{children}</main>
      </Suspense>
      <Footer />
    </>
  );
}

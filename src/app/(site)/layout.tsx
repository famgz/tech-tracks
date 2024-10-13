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
      <main className="_main">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
      <Footer />
    </>
  );
}

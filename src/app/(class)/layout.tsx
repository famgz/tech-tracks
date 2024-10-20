export default function ClassLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="_main">{children}</main>;
}

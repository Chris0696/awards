import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function LandingLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="w-full overflow-x-hidden">
      <Header />
      {children}
      <Footer />
      {modal}
    </main>
  );
}

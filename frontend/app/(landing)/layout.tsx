"use client";
import Footer from "@/app/(landing)/components/Footer";
import Header from "@/app/(landing)/components/Header";
import { SessionProvider } from "../admin/SessionProvider";
import WelcomeModal from "@/components/modals/WelcomeModal";
//import VoteAnnouncementModal from "@/components/modals/VoteAnnoucementModal";

export default function LandingLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="w-full overflow-x-hidden">
      <WelcomeModal />
      {/* <VoteAnnouncementModal showModal={true} setShowModal={() => {}} /> */}
      <Header />
      {children}
      <Footer />
      {modal}
    </main>
  );
}

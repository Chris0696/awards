import Sidebar from "@/components/dashboard/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex p-6 h-screen ">
      <Sidebar />
      <section className="flex-1 p-5 ">{children}</section>
    </section>
  );
}

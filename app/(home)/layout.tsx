import { Leftsidebar } from "@/components/Leftsidebar";
import { PremiumCard } from "@/components/PremiumCard";
import { Searchbar } from "@/components/Searchbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col-reverse mobile:flex-row w-full max-w-fit mx-auto overflow-y-auto">
      <div className="shrink-0 flex w-18 xl:w-69">
        <Leftsidebar />
      </div>

      <section className="flex w-full min-w-0 gap-8">
        <div className="w-3xl md:w-[598px] h-full border-r border-l border-gray-200 overflow-y-scroll no-scrollbar">
          {children}
        </div>
        <aside className="hidden lg:flex flex-col gap-4 flex-shrink-0 py-2 w-85">
          <Searchbar />
          <PremiumCard />
        </aside>
      </section>
    </main>
  );
}

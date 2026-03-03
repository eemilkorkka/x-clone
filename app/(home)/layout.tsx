import { Footer } from "@/components/Footer";
import { Leftsidebar } from "@/components/Leftsidebar/Leftsidebar";
import { PremiumCard } from "@/components/PremiumCard";
import { Searchbar } from "@/components/Searchbar";
import { SplashScreen } from "@/components/SplashScreen";
import { TrendingCard } from "@/components/Trending/TrendingCard";
import { SuggestedUsersCard } from "@/components/User/SuggestedUsersCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "Home / X Clone",
    template: "%s / X Clone",
  },
  description: "Welcome to X Clone, a social media platform.",
}

export default function HomeLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col-reverse mobile:flex-row w-full md:max-w-fit mx-auto">
      <SplashScreen />

      <div className="shrink-0 flex w-18 xl:w-69">
        <Leftsidebar />
      </div>

      <section className="flex w-full min-w-0 gap-8">
        <div className="w-full md:w-[598px] h-full mobile:border-x border-border pb-19 mobile:pb-0">
          {children}
          {modal}
        </div>
        <aside className="hidden lg:flex flex-col gap-4 flex-shrink-0 py-2 w-85">
          <Searchbar />
          <PremiumCard />
          <SuggestedUsersCard />
          <TrendingCard />
          <Footer styles="mt-0" isRightSideBar={true} />
        </aside>
      </section>
    </main>
  );
}

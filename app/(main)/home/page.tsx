"use client";

import React, { useState } from "react";
import { Home, BookOpen, Trophy, User, Flame, Zap, type LucideIcon } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Learn from "@/pages/Home";
import Languages from "@/pages/Languages";
// import LessonPath from "@/components/dashboard/LessonPath";

type TabContentProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const TabPlaceholder = ({ icon: Icon, title, description }: TabContentProps) => (
  <section className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-6 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Icon className="h-8 w-8" />
    </div>
    <h1 className="font-heading text-3xl font-900 tracking-tight">{title}</h1>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </section>
);

const navItems = [
  { path: "/home", icon: Home, label: "Learn", Content: Learn },
  {
    path: "/languages",
    icon: BookOpen,
    label: "Languages",
    // Content: () => <TabPlaceholder icon={BookOpen} title="Languages" description="Choose a language to begin your learning path." />,
    Content: Languages
  },
  {
    path: "/leaderboard",
    icon: Trophy,
    label: "Ranks",
    Content: () => <TabPlaceholder icon={Trophy} title="Ranks" description="See how you compare with other learners." />,
  },
  {
    path: "/profile",
    icon: User,
    label: "Profile",
    Content: () => <TabPlaceholder icon={User} title="Profile" description="Manage your learning profile and progress." />,
  },
];

const HomePage = () => {
  const location = usePathname();
  const { isLoaded } = useUser();
  const [streak] = useState(0);
  const [totalXp] = useState(0);
  const activeTab = navItems.find((item) => item.path === location) ?? navItems[0];
  const ActiveContent = activeTab.Content;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
          <h1 className="font-heading font-900 text-2xl tracking-tight text-center">
            Sign in to continue learning
          </h1>
          <SignInButton mode="modal">
            <Button size="lg">Sign in</Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen">
          {/* Top bar - desktop */}
          <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 items-center justify-between px-6">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-900 text-xl tracking-tight">
                Mind<span className="text-primary">Forge</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                      ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">{totalXp}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/15 rounded-full">
                <Flame className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold text-accent-foreground">
                  {streak}
                </span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {/* Main content */}
          <main className="pt-0 md:pt-16 pb-20 md:pb-8">
            <ActiveContent />
          </main>

          {/* Bottom nav - mobile */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex items-center justify-around px-2 py-2 safe-area-bottom">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all
                    ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  <item.icon
                    className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : ""}`}
                  />
                  <span className="text-[10px] font-bold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </SignedIn>
    </>
  );
};

export default HomePage;

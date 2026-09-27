"use client";

<<<<<<< HEAD
import React from "react";
=======
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
// import Learn from "@/pages/Home";
import Languages from "@/pages/Languages";
import LessonPath from "@/components/dashboard/LessonPath";

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
  { path: "/home", icon: Home, label: "Learn", Content: LessonPath },
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
>>>>>>> parent of 2951ff9 (Gamification componenet)

const HomePage = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default HomePage;

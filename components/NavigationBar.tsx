"use client"

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { BookOpen, Flame, Home, Loader, Trophy, User, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { path: "/home", icon: Home, label: "Dashboard" },
  { path: "/languages", icon: BookOpen, label: "Languages" },
  { path: "/leaderboard", icon: Trophy, label: "Ranks" },
  { path: "/profile", icon: User, label: "Profile" },
];

const Navigationbar = () => {
    const pathname = usePathname();

    return (
    <div>
        {/* Top bar - desktop */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 items-center justify-between px-6">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-900 text-xl tracking-tight">
            Mind<span className="text-primary text-blue-600">Forge</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
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
            <span className="text-sm font-bold">totalXp</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/15 rounded-full">
            <Flame className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold text-accent-foreground">
              streak
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ClerkLoading>
              <Loader className="w-5 h-5 animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
              <UserButton afterSignOutUrl="/"/>
            </ClerkLoaded>
          </div>
        </div>
      </header>
    </div>
    );
};

export default Navigationbar;

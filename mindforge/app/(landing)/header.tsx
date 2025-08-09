"use client";
import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-40 z-[100]">
      <div className="flex items-center justify-between h-full">
        <h1 className="text-2xl font-bold">
          <Link href="/">
            Mind<span className="text-blue-600">F</span>orge
          </Link>
        </h1>
        <nav className="flex items-center gap-4">
          <a className="text-sm cursor-pointer">FAQ</a>
          <a href="#" className="text-sm cursor-pointer">
            ABOUT
          </a>
          <a href="#" className="text-sm cursor-pointer">
            CONTACT
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Creator
          </Button>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

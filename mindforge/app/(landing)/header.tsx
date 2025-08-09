"use client";
import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
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
          <ClerkLoading>Loading...</ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <UserButton/>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" variant="ghost">Login</Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
};

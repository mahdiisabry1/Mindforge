import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignUpButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="z-[100]">
      <div className="max-w-[1100px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-12">
        <div className="relative w-[240px] h-[240px] lg:w-[1100px] lg:h-[424px] mb-8 lg:mb-0">
          <Image src="/pngegg.png" fill alt="landing" />
        </div>
        <div className="flex flex-col items-center gap-y-10">
          <h1 className="text-xl lg:text-3xl font-bold text-black max-w-[480px] text-center">
            Welcome to MindForge! Learn, Practice, and Empower your Learning
            with Mindforge
            <span><h6>Account creation is currently disabled for security.</h6></span>
          </h1>
          <div>
              <ClerkLoading>Loading...</ClerkLoading>
              <ClerkLoaded>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button
                      className="w-full lg:w-auto"
                      variant="default"
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/learn" target="_blank">
                    <Button className="w-full lg:w-auto" variant="default" size="lg">
                      Continue Learning
                    </Button>
                  </Link>
                </SignedIn>
              </ClerkLoaded>
          </div>
        </div>
      </div>
    </div>
  );
}

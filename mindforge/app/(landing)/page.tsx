import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
        <div className="relative w-[240px] h-[240px] lg:w-[1100px] lg:h-[424px] mb-8 lg:mb-0">
          <Image
            src="/landingtemp.png"
            fill
            alt="landing"
          />
        </div>
        <div className="flex flex-col items-center gap-y-8">
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
            Welcome to MindForge! Learn, Practice, and Empower your Learning
            with Mindforge
          </h1>
          <div>
            <Link href="/learn">  
              <Button className="w-full lg:w-auto" variant="default" size="lg">
              Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

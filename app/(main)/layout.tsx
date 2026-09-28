import Navigationbar from "@/components/NavigationBar";
import React from "react";
import { getOrCreateUser } from "@/lib/user";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {

  const user = await getOrCreateUser();

  if (!user) redirect('/sign-in');

  return (
    <div className="min-h-screen w-[100%] bg-gray-100">
      <Navigationbar /> 
      <main className="max-w-[1056px] mx-auto pt-20 h-full">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
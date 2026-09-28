import Navigationbar from "@/components/navigationbar";
import React from "react";
type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
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
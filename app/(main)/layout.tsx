import React from "react";
type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
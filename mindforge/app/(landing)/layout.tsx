import Image from "next/image";
import { Footer } from "./footer";
import { Header } from "./header";

type Props = {
  children: React.ReactNode;
};

const LandingLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 ">
      {/* Header area */}
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <Image src="/background.jpg" fill alt="landing" className="opacity-15"/>
        {children}
      </main>
      {/* Footer area */}
      <Footer />
    </div>
  );
};

export default LandingLayout;

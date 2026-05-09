import { ReactNode } from "react";
import { Footer } from "components/Footer";
import { Navbar } from "components/Navbar";

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

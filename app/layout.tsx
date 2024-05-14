import "./globals.css";

import { Footer, NavBar } from "@components";

export const metadata = {
  title: "Llantas y renovado",
  description: "Llantas y renovado es una empresa dedicada a la venta de llantas y renovado de llantas en Puebla, Puebla.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='relative'>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";

import "../globals.css";
import TopBar from "@components/layout/TopBar";
import BottomBar from "@components/layout/BottomBar";
import Provider from "@components/Provider";
import ToasterContext from "@components/ToasterContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sky Chat",
  description: "Build Next 14 Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-2`}>
        <Provider>
          <ToasterContext />
          <main>
            <TopBar />
            {children}
            <BottomBar />
          </main>
        </Provider>
      </body>
    </html>
  );
}

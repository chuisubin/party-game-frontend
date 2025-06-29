import { ReactNode } from "react";

import "./globals.css";
import { WebSocketProvider } from "../components/WebSocketProvider";
import Header from "../components/layout/Header";
import LeaveRoomHandler from "../components/LeaveRoomHandler";
export const metadata = {
  title: "Party Game",
  description: "多人連線派對遊戲",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <WebSocketProvider>
          <LeaveRoomHandler />
          <div className="min-h-screen  pt-20 ">
            <Header />
            {children}
          </div>
        </WebSocketProvider>
      </body>
    </html>
  );
}

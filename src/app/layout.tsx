import { ReactNode } from "react";
import { UserIdProvider } from "../components/UserIdProviderClient";
import "./globals.css";

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
        <UserIdProvider>{children}</UserIdProvider>
      </body>
    </html>
  );
}

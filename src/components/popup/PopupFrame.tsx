//popup frame 背景半透明，中間POPUP, 圓角白色底色,內容是children
"use client";
import React from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PopupFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { player } = useWebSocket();
  const router = useRouter();
  useEffect(() => {
    if (!player.id) {
      router.push("/");
    }
  }, [player.id, router]);
  return (
    <div className="fixed inset-0 bg-black/20  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
        {children}
      </div>
    </div>
  );
};
export default PopupFrame;

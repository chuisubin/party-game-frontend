"use client";
import { usePathname } from "next/navigation";
import { useWebSocket } from "./WebSocketProvider";
import { useEffect, useRef } from "react";

const LeaveRoomHandler = () => {
  const pathname = usePathname();
  const { socket, player, roomDetail } = useWebSocket();
  const lastRoomCodeRef = useRef<string | null>(null);

  useEffect(() => {
    // 進入房間時記錄房號
    if (pathname.startsWith("/room/")) {
      const code = pathname.split("/room/")[1]?.split("/")[0];
      lastRoomCodeRef.current = code;
    } else if (lastRoomCodeRef.current && socket && player?.id) {
      // 離開房間時發送 leaveRoom
      socket.emit("leaveRoom", {
        roomCode: lastRoomCodeRef.current,
        playerId: player.id,
      });
      lastRoomCodeRef.current = null;
    }
  }, [pathname, socket, player?.id]);

  return null;
};

export default LeaveRoomHandler;

"use client";
import { useEffect, useRef } from "react";
import React from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import { fetchRoomDetailApi, checkPlayerApi } from "@/api/room"; // 假設這裡有一個 API 函數來檢查房間是否存在
import { useRouter } from "next/navigation";
import type { RoomDetail } from "@/types/room";
import WaitingPage from "./WaitingPage";
const RoomClient: React.FC<{ roomCode: string }> = ({ roomCode }) => {
  // 在這裡可以使用 roomCode 來進行房間相關的操作

  const router = useRouter();
  const { socket, roomDetail, setRoomDetail, player } = useWebSocket();

  useEffect(() => {
    if (player?.id && roomCode && socket) {
      checkRoomExists();
    }
  }, [roomCode, player.id, socket]);

  const checkRoomExists = async () => {
    if (!player.id || typeof player.id !== "string") {
      // 若 player.id 不存在或不是字串，則不執行 API 呼叫
      return;
    }

    //join room
    socket &&
      socket.emit(
        "joinRoom",
        {
          roomCode,
          player: {
            id: player.id,
            name: player.name ?? "玩家",
          },
        },
        (res: any) => {
          if (res && res.code === 0) {
          } else {
            alert("加入房間失敗，請確認房間代碼是否正確");
          }
        }
      );
  };

  return (
    <div>
      {!roomDetail ? (
        <div></div>
      ) : roomDetail.status == "waiting" ? (
        <WaitingPage />
      ) : (
        <div>game page</div>
      )}

      {/* 其他房間相關的 UI 元素 */}
    </div>
  );
};
export default RoomClient;

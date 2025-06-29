"use client";
import React, { useState } from "react";
import defaultIcon from "@/assets/images/default.png";
import { useWebSocket } from "@/components/WebSocketProvider";
import PopupFrame from "@/components/popup/PopupFrame";
import CreatePopup from "@/components/popup/CreatePopup";
import JoinPopup from "@/components/popup/JoinPopup";

export default function Home() {
  const [popup, setPopup] = useState<"create" | "join" | null>(null);

  // 由 provider 拿出 playerId
  const { player } = useWebSocket();

  const handleOpen = (mode: "create" | "join") => setPopup(mode);
  const handleClose = () => setPopup(null);

  return (
    <div className="relative min-h-full  ">
      <h1 className="text-center  text-6xl mb-5">Party Game</h1>
      {player?.name && (
        <div>
          <div className=" border-4 rounded-full  mx-auto w-fit mb-5">
            <img src={defaultIcon.src} className="w-full h-full" />
          </div>

          <div>
            <div>{player.name}</div>
          </div>

          <div className="">
            <button
              onClick={() => handleOpen("create")}
              className="bg-party-yellow text-white px-4 py-2 rounded mr-2"
            >
              建立遊戲
            </button>

            <button
              onClick={() => handleOpen("join")}
              className="bg-party-purple text-white px-4 py-2 rounded"
            >
              加入遊戲
            </button>
          </div>
        </div>
      )}

      {popup && (
        <PopupFrame>
          <div className="relative">
            <div>{popup == "create" ? <CreatePopup /> : <JoinPopup />}</div>

            <div className=" relative cursor-auto">
              <div
                onClick={() => {
                  handleClose();
                }}
              >
                返回
              </div>
            </div>
          </div>
        </PopupFrame>
      )}
    </div>
  );
}

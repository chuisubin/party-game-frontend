"use client";
import React, { useState } from "react";
import RoomPopup from "../components/RoomPopup";
import RoomList from "../components/RoomList";

export default function Home() {
  const [popup, setPopup] = useState<"create" | "join" | null>(null);

  const handleOpen = (mode: "create" | "join") => setPopup(mode);
  const handleClose = () => setPopup(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="text-3xl sm:text-5xl font-bold mb-12 text-gray-800 drop-shadow-lg">
        Party Game
      </h1>
      <RoomList />
      <div className="flex flex-col sm:flex-row gap-8">
        <button
          className="px-8 py-4 rounded-lg bg-blue-600 text-white text-xl font-semibold shadow-lg hover:bg-blue-700 transition"
          onClick={() => handleOpen("create")}
        >
          建立房間
        </button>
        <button
          className="px-8 py-4 rounded-lg bg-green-500 text-white text-xl font-semibold shadow-lg hover:bg-green-600 transition"
          onClick={() => handleOpen("join")}
        >
          加入房間
        </button>
      </div>
      <RoomPopup open={!!popup} mode={popup} onClose={handleClose} />
    </div>
  );
}

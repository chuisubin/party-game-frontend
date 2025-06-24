import React, { useState, ChangeEvent } from "react";
import { joinRoomApi, createRoomApi } from "../api/room";
import { useUserId } from "./UserIdProviderClient";

export interface RoomPopupProps {
  open: boolean;
  mode: "create" | "join" | null;
  onClose: () => void;
}

const RoomPopup: React.FC<RoomPopupProps> = ({ open, mode, onClose }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxMembers, setMaxMembers] = useState(6);
  const userId = useUserId();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCode(value);
  };
  React.useEffect(() => {
    if (open) setCode("");
  }, [open]);

  const handleAction = async () => {
    if (!userId) return;
    setLoading(true);
    if (mode === "create") {
      const res = await createRoomApi({ roomCode: code, userId, maxMembers });
      if (res.code == 0) {
        window.location.href = `/room?roomCode=${code}`;
      } else if (res.msg) {
        alert(res.msg);
      } else {
        alert("建立房間失敗");
      }
    } else if (mode === "join") {
      const res = await joinRoomApi({ roomCode: code, userId });
      if (res.code == 0) {
        window.location.href = `/room?roomCode=${code}`;
      } else if (res.msg) {
        alert(res.msg);
      } else {
        alert("加入房間失敗，請確認房間代碼是否正確");
      }
    }
    setCode("");
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 min-w-[320px] flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {mode === "create" ? "建立房間" : "加入房間"}
        </h2>
        <input
          type="text"
          inputMode="numeric"
          pattern="\\d{4}"
          maxLength={4}
          value={code}
          onChange={handleInput}
          className="border border-gray-300 rounded px-4 py-2 text-center text-lg mb-6 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          placeholder="請輸入4位數字"
          disabled={loading}
        />
        <input
          type="number"
          min={2}
          max={20}
          value={maxMembers}
          onChange={(e) => setMaxMembers(Number(e.target.value))}
          className="border border-gray-300 rounded px-4 py-2 text-center text-lg mb-4 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          placeholder="人數上限 (2-20)"
          disabled={loading || mode !== "create"}
          style={{ display: mode === "create" ? "block" : "none" }}
        />
        <div className="flex gap-4 w-full justify-center">
          <button
            className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-24 disabled:opacity-60"
            onClick={handleAction}
            disabled={code.length !== 4 || loading || !userId}
          >
            {loading ? "處理中..." : mode === "create" ? "建立" : "加入"}
          </button>
          <button
            className="px-6 py-2 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition w-24"
            onClick={onClose}
            disabled={loading}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPopup;

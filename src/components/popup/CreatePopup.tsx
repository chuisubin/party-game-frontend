import { useState } from "react";
import { useWebSocket } from "../WebSocketProvider";
import { useRouter } from "next/navigation";

const CreatePopup: React.FC = (props) => {
  const {} = props;
  const { player, socket } = useWebSocket();
  const [createLoading, setCreateLoading] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isPublic, setIsPublic] = useState(true);

  const router = useRouter();
  const createGameRoom = async () => {
    setCreateLoading(true);

    if (!socket) {
      console.error("Socket is not connected");
      setCreateLoading(false);
      return;
    }
    if (!player.id) {
      console.error("Player ID is missing");
      setCreateLoading(false);
      return;
    }
    // 改為用 socket.io emit createRoom
    socket.emit(
      "createRoom",
      {
        roomCode,
        player: {
          id: player.id,
          name: player.name ?? "玩家",
        },
        maxPlayers,
        isPublic,
      },
      (res: any) => {
        setCreateLoading(false);
        if (res && res.code === 0) {
          router.push("/room/" + roomCode);
        } else {
          alert(res.message || "建立房間失敗，請確認房間代碼是否正確");
        }
      }
    );
  };
  return (
    <div>
      <input
        placeholder="房間代碼"
        type="number"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        maxLength={4}
      />
      <input
        placeholder="人數上限"
        type="number"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(Number(e.target.value))}
        maxLength={1}
      />
      <div>選擇遊戲類型: 猜圖</div>
      <button
        className="bg-party-yellow disabled:opacity-75 enabled:cursor-pointer text-black px-4 py-2 rounded mr-2"
        onClick={createGameRoom}
        disabled={createLoading || !roomCode}
      >
        {createLoading ? <span className="ml-2">Loading...</span> : "建立遊戲"}
      </button>
    </div>
  );
};

export default CreatePopup;

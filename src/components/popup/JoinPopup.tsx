import { useState } from "react";
import { useWebSocket } from "../WebSocketProvider";
import { useRouter } from "next/navigation";

const JoinPopup: React.FC = (props) => {
  const {} = props;
  const { player, socket } = useWebSocket();
  const [createLoading, setCreateLoading] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const router = useRouter();

  const joinGameRoom = async () => {
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
    // 改為用 socket.io emit joinRoom
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
        setCreateLoading(false);
        console.log("rea", res);
        if (res && res.code === 0) {
          router.push("/room/" + roomCode);
        } else {
          alert("加入房間失敗，請確認房間代碼是否正確");
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

      <button
        className="bg-party-purple disabled:opacity-75 enabled:cursor-pointer text-black px-4 py-2 rounded mr-2"
        onClick={joinGameRoom}
        disabled={createLoading || !roomCode}
      >
        {createLoading ? <span className="ml-2">Loading...</span> : "進入遊戲"}
      </button>
    </div>
  );
};

export default JoinPopup;

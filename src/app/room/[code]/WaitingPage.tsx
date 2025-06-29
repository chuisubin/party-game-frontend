import {} from "@/api/room";
import { useWebSocket } from "@/components/WebSocketProvider";
import defaultIcon from "@/assets/images/default.png"; // 假設這是預設的玩家圖示
import { useMemo } from "react";
const WaitingPage = () => {
  const { player, roomDetail, socket } = useWebSocket();

  const isReady = useMemo(() => {
    return roomDetail?.players?.some((p) => p.id === player?.id && p.isReady);
  }, [roomDetail, player?.id]);

  const isOwner = useMemo(() => {
    return roomDetail?.ownerId === player?.id;
  }, [roomDetail, player?.id]);

  const readyHandler = () => {
    if (!socket || !player?.id || !roomDetail?.roomCode) {
      return;
    }
    socket.emit(
      "setReady",
      {
        isReady: !isReady,
        roomCode: roomDetail.roomCode,
        playerId: player.id,
      },
      (res: any) => {
        if (res && res.code === 0) {
          console.log("已準備");
        } else {
          alert("準備失敗，請稍後再試");
        }
      }
    );
  };
  return (
    <div className="TODO w-full h-full ">
      <div>
        <h1>遊戲即將開始</h1>
        <div className=" h-full ">
          <div className="flex flex-col gap-5 h-full w-72  ">
            {roomDetail?.players?.map((p, index) => {
              const ownerPlayer = p.role === "owner";
              const isMe = p.id === player?.id;
              return (
                <div
                  key={p.id}
                  className=" flex flex-col items-start gap-2  border bg-sky-blue p-2"
                >
                  <div className="flex flex-row items-center">
                    <img src={defaultIcon.src} className="w-10 h-10" />
                    <div className="text-black">
                      {p.name}
                      {ownerPlayer && " (場主)"}
                    </div>
                  </div>
                  <div>
                    {!isMe && !ownerPlayer && (
                      <div>{p.isReady ? "已準備" : "未準備"}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full flex justify-center mt-5">
            {isOwner ? (
              <button
                className="bg-party-purple text-white px-4 py-2 rounded disabled:bg-gray-300"
                disabled={
                  !roomDetail?.players
                    .filter((p) => p.role !== "owner")
                    ?.every((p) => p.isReady)
                }
              >
                開始
              </button>
            ) : (
              <button
                onClick={readyHandler}
                className="bg-party-yellow text-black px-4 py-2 rounded"
              >
                {isReady ? "取消準備" : "準備"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;

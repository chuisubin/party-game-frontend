"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { joinRoomApi, fetchRoomDetailApi } from "../../api/room";
import { useUserId } from "../../components/UserIdProviderClient";

const RoomPageClient: React.FC = () => {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("roomCode");
  const userId = useUserId();
  const router = useRouter();
  const [roomDetail, setRoomDetail] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wsMessages, setWsMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomCode) return;
    fetchRoomDetailApi(roomCode).then((data) => {
      if (data && data.code === 0) {
        setRoomDetail(data);
        setLoading(false);
      } else {
        router.replace("/");
      }
    });
  }, [roomCode, userId]);

  // 根據 roomDetail 和 userId 判斷是否為房主
  useEffect(() => {
    if (roomDetail && roomDetail.room && userId) {
      setIsOwner(roomDetail.room.ownerId === userId);
    }
  }, [roomDetail, userId]);

  // 自動補登記：如果不是成員且不是房主，則自動 join
  useEffect(() => {
    if (!roomCode || !userId || !roomDetail) return;
    if (
      roomDetail.room &&
      Array.isArray(roomDetail.room.members) &&
      !roomDetail.room.members.some((m: any) => m.userId === userId) &&
      roomDetail.room.ownerId !== userId
    ) {
      joinRoomApi({ roomCode, userId }).then((res) => {
        if (res && res.code == 0) {
          fetchRoomDetailApi(roomCode).then(setRoomDetail);
        } else {
          router.replace("/");
        }
      });
    }
  }, [roomCode, userId, roomDetail]);

  useEffect(() => {
    if (!roomCode || !userId) return;
    const wsUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
      /^http/,
      "ws"
    )}/ws?roomCode=${roomCode}&userId=${userId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "roomInfo" && data.room) {
          setRoomDetail({ room: data.room });
        }
        if (data.message) {
          setWsMessages((prev) => [...prev, data.message]);
        }
      } catch {
        setWsMessages((prev) => [...prev, event.data]);
      }
    };
    ws.onclose = () => {
      setWsMessages((prev) => [...prev, "WebSocket 已關閉"]);
    };
    ws.onerror = () => {
      setWsMessages((prev) => [...prev, "WebSocket 發生錯誤"]);
    };
    return () => {
      ws.close();
    };
  }, [roomCode, userId]);

  // 成員名單與準備按鈕
  const members = roomDetail?.room?.members || [];
  const ownerId = roomDetail?.room?.ownerId;
  const self = members.find((m: any) => m.userId === userId);
  const isReady = self?.isReady;

  // 判斷所有成員（非房主）是否都準備好
  const allReady = members
    .filter((m: any) => m.userId !== ownerId)
    .every((m: any) => m.isReady);

  const handleToggleReady = () => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(
        JSON.stringify({
          type: "setReady",
          userId,
          roomCode,
          isReady: !isReady,
        })
      );
    }
  };

  const handleStartGame = () => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(
        JSON.stringify({
          type: "startGame",
          userId,
          roomCode,
        })
      );
    }
  };

  if (loading) return <div className="text-center mt-12">載入中...</div>;
  if (!roomDetail) return <div className="text-center mt-12">找不到房間</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        房間：{roomCode}
      </h1>
      <div className="mb-4 text-lg text-blue-900">
        {isOwner ? "你是房主" : "你是房間成員"}
        <span
          className={
            "ml-3 px-2 py-1 rounded text-xs font-mono border " +
            (isOwner
              ? "bg-blue-500 text-white border-blue-600"
              : "bg-gray-200 text-gray-700 border-gray-300")
          }
        >
          {userId}
        </span>
      </div>
      <div className="mb-2 text-base text-blue-800">
        當前房間人數：{roomDetail?.room?.members?.length ?? 0}
        {roomDetail?.room?.maxMembers ? ` / ${roomDetail.room.maxMembers}` : ""}
      </div>
      <div className="w-full max-w-md bg-white rounded shadow p-4 mb-4 border border-blue-100">
        <div className="font-bold mb-2 text-blue-900">房間訊息：</div>
        <ul className="text-sm space-y-1 text-gray-700">
          {wsMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
      <div className="w-full max-w-md bg-white rounded shadow p-4 mb-4 border border-blue-100">
        <div className="font-bold mb-2 text-blue-900">成員列表：</div>
        <ul className="text-sm space-y-1 text-gray-700">
          {members.map((m: any) => {
            const isSelf = m.userId === userId;
            const isOwnerMember = m.userId === ownerId;
            return (
              <li key={m.userId} className="flex items-center gap-2">
                <span className="font-mono">{m.name || m.userId}</span>
                {isOwnerMember && (
                  <span className="ml-1 px-1 text-xs bg-blue-500 text-white rounded">
                    房主
                  </span>
                )}
                {!isOwnerMember && (
                  <span
                    className={
                      "ml-2 px-2 py-0.5 rounded text-xs " +
                      (m.isReady
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-600")
                    }
                  >
                    {m.isReady ? "已準備" : "未準備"}
                  </span>
                )}
                {isSelf && !isOwner && (
                  <button
                    className={
                      "ml-3 px-2 py-0.5 rounded text-xs border " +
                      (isReady
                        ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200")
                    }
                    onClick={handleToggleReady}
                  >
                    {isReady ? "取消準備" : "準備"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        {isOwner && (
          <button
            className={
              "mt-4 w-full px-4 py-2 rounded text-lg font-bold " +
              (allReady
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed")
            }
            onClick={handleStartGame}
            disabled={!allReady}
          >
            開始遊戲
          </button>
        )}
      </div>
      <button
        className="mb-6 px-6 py-2 rounded bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition border border-blue-200"
        onClick={() => router.replace("/")}
      >
        返回首頁
      </button>
      {/* 這裡可以顯示更多房間資訊 */}
    </div>
  );
};

export default RoomPageClient;

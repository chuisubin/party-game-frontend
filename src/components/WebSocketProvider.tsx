"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { registerSocketEvents } from "./socketEvents";
import type { RoomDetail } from "@/types/room";

interface WebSocketContextType {
  player: {
    id?: string | null;
    name?: string | null;
  };
  socket: Socket | null;
  roomDetail: RoomDetail | null;
  setRoomDetail: (detail: RoomDetail | null) => void;
  messages: { sender: string; text: string }[];
  addMessage: (msg: { sender: string; text: string }) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  player: {
    id: null,
    name: null,
  },
  socket: null,
  roomDetail: null,
  setRoomDetail: () => {},
  messages: [],
  addMessage: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState<{
    id: string | null;
    name: string | null;
  }>({
    id: null,
    name: null,
  });
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const socketRef = useRef<Socket | null>(null);

  const addMessage = (msg: { sender: string; text: string }) =>
    setMessages((prev) => [...prev, msg]);

  useEffect(() => {
    // 根據實際 socket.io server 位址修改
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    socketRef.current = socket;

    let localStoragePlayerId = localStorage.getItem("playerId") ?? null;
    if (!localStoragePlayerId) {
      //用UUID 生成的playerId
      localStoragePlayerId = crypto.randomUUID();
      localStorage.setItem("playerId", localStoragePlayerId);
    }
    let localStoragePlayerName = localStorage.getItem("playerName") ?? null;
    if (!localStoragePlayerName) {
      console.log("run !localStoragePlayerName");
      localStoragePlayerName = "玩家" + localStoragePlayerId?.slice(-4);
      localStorage.setItem("playerName", localStoragePlayerName);
    }
    setPlayer({
      id: localStoragePlayerId,
      name: localStoragePlayerName,
    });

    console.log("socket", socket);
    registerSocketEvents(socket, { setRoomDetail, addMessage });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("change roomDetail", roomDetail);
  }, [roomDetail]);

  return (
    <WebSocketContext.Provider
      value={{
        player,
        socket: socketRef.current,
        roomDetail,
        setRoomDetail,
        messages,
        addMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

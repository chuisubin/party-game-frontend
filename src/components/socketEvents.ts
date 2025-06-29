import { Socket } from "socket.io-client";

// 全域事件型別
export type SocketEventHandlers = {
  setRoomDetail?: (detail: any) => void;
  addMessage?: (msg: { sender: string; text: string }) => void;
};

export function registerSocketEvents(
  socket: Socket,
  handlers: SocketEventHandlers = {}
) {
  // 訊息事件
  socket.on("message", (data) => {
    console.log("收到 message:", data);
    handlers.addMessage && handlers.addMessage(data);
  });

  // 監聽房間細節更新
  socket.on("roomDetail", (data) => {
    handlers.setRoomDetail && handlers.setRoomDetail(data);
    console.log("data", data);
  });
  socket.on("roomUpdate", (info) => {
    console.log("update room info", info);
    handlers.setRoomDetail && handlers.setRoomDetail(info);
  });

  // 你可以在這裡註冊更多事件
  // socket.on("eventName", handler)
}

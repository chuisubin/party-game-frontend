const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export interface RoomListItem {
  _id: string;
  roomCode: string;
}

export async function fetchRoomListApi(): Promise<RoomListItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/room/list`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    // 預期格式：{ code: 0, rooms: [...] }
    return Array.isArray(data.rooms) ? data.rooms : [];
  } catch (e) {
    // 假資料 fallback
    return [
      { _id: "fake1", roomCode: "1234" },
      { _id: "fake2", roomCode: "6666" },
    ];
  }
}

export async function createRoomApi(payload: {
  roomCode: string;
  userId?: string;
  maxMembers?: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/room/create-room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (e) {
    console.error("建立房間失敗:", e);
    return e;
  }
}

export async function joinRoomApi(payload: {
  roomCode: string;
  userId?: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/room/join-room`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch (e) {
    console.error("加入房間失敗:", e);
    return e;
  }
}

export async function fetchRoomDetailApi(roomCode: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/room/detail/${roomCode}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return null;
  }
}

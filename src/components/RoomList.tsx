import React, { useEffect, useState } from "react";
import { fetchRoomListApi, RoomListItem } from "../api/room";
import { useUserId } from "../components/UserIdProviderClient";

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useUserId();

  useEffect(() => {
    // userId 初始化已由 context 處理
    fetchRoomListApi().then((data) => {
      setRooms(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="my-8 text-gray-500">載入中...</div>;
  if (!rooms.length)
    return <div className="my-8 text-gray-500">目前沒有房間</div>;

  return (
    <div className="my-8 w-full max-w-xs mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
        房間列表
      </h2>
      <ul className="space-y-2">
        {rooms.map((room) => (
          <li
            key={room.roomCode}
            className="bg-white rounded shadow p-3 text-center font-mono text-lg text-blue-700"
          >
            {room.roomCode}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;

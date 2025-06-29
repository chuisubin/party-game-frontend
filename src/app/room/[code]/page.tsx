import React from "react";
import RoomClient from "./RoomClient";

export default async function RoomPage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = await params;

  return (
    <div>
      <h1>Room Code: {code}</h1>
      <RoomClient roomCode={code} />
    </div>
  );
}

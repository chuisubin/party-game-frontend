import React, { Suspense } from "react";
import RoomPageClient from "./RoomPageClient";

// Room page server component: wraps client logic in Suspense
export default function RoomPage() {
  return (
    <Suspense fallback={<div className="text-center mt-12">載入中...</div>}>
      <RoomPageClient />
    </Suspense>
  );
}

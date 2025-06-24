"use client";
import React, { useEffect, useState, createContext, useContext } from "react";

export const UserIdContext = createContext<string | null>(null);

export function UserIdProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = "user-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", id);
    }
    setUserId(id);
    console.log("user id:", id);
  }, []);

  return (
    <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>
  );
}

export function useUserId() {
  return useContext(UserIdContext);
}

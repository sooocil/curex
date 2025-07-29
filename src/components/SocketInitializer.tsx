"use client";

import { useEffect } from "react";

export function SocketInitializer() {
  useEffect(() => {
    fetch("/api/socket");
  }, []);

  return null;
}

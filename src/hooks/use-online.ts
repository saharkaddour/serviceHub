"use client";

import { useEffect, useState } from "react";

export function useOnline() {
  const [online, setOnline] = useState(true);
  const [failedFetch, setFailedFetch] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => {
      setOnline(true);
      setFailedFetch(false);
    };
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    const onFailed = () => setFailedFetch(true);
    window.addEventListener("servicehub:fetch-failed", onFailed);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("servicehub:fetch-failed", onFailed);
    };
  }, []);

  return { online, offline: !online || failedFetch };
}

'use client';

import { useEffect, useRef } from 'react';
import { getMemoryToken } from '@/lib/api/apiClient';

const getWsBase = () => {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return api.replace(/^http/, 'ws');
};

/**
 * Opens a WebSocket to /ws/restaurant, authenticates with the stored JWT,
 * and calls onNewOrder(orderId) whenever a new-order event arrives.
 * Reconnects automatically if the connection drops.
 */
export function useRestaurantWebSocket(onNewOrder: (orderId: string) => void) {
  const onNewOrderRef = useRef(onNewOrder);
  onNewOrderRef.current = onNewOrder;

  useEffect(() => {
    let ws: WebSocket | null = null;
    let destroyed = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      const token = getMemoryToken();
      if (!token || destroyed) return;

      ws = new WebSocket(`${getWsBase()}/ws/restaurant`);

      ws.onopen = () => {
        ws!.send(JSON.stringify({ event: 'authenticate', token }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          if (msg.event === 'new-order' && msg.data?.orderId) {
            onNewOrderRef.current(msg.data.orderId);
          }
        } catch {
          // ignore malformed frames
        }
      };

      ws.onclose = () => {
        if (!destroyed) {
          retryTimer = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();

    return () => {
      destroyed = true;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
    };
  }, []);
}

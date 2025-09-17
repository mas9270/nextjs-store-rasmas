import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http";
import { Socket } from "net";
import WebSocket, { WebSocketServer } from "ws";

// Map برای نگهداری کانکشن هر کاربر
const clients = new Map<number, WebSocket>();

// نوع سفارشی برای socket در Next.js
interface NextSocket extends Socket {
  server: any & { wss?: WebSocketServer };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as NextSocket;

  if (!socket.server.wss) {
    const wss = new WebSocketServer({ noServer: true });

    // هک برای اتصال WebSocket به Next.js
    socket.server.on(
      "upgrade",
      (request: IncomingMessage, sock: Socket, head: Buffer) => {
        const url = new URL(request.url || "", `http://${request.headers.host}`);
        const userId = Number(url.searchParams.get("userId"));

        if (!userId) {
          sock.destroy();
          return;
        }

        wss.handleUpgrade(request, sock, head, (ws) => {
          wss.emit("connection", ws, userId);
        });
      }
    );

    wss.on("connection", (ws: WebSocket, userId: number) => {
      console.log("کاربر وصل شد:", userId);
      clients.set(userId, ws);

      ws.on("close", () => {
        console.log("کاربر قطع شد:", userId);
        clients.delete(userId);
      });
    });

    socket.server.wss = wss;
    console.log("WebSocket server started");
  }

  res.status(200).end();
}

// تابع برای ارسال بروزرسانی سبد خرید
export function notifyCartUpdate(userId: number, cartData: any) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "cart_update", data: cartData }));
  }
}

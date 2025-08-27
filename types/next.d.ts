// types/next.d.ts

import { Server as HTTPServer } from 'http';
import { Socket } from 'net';
import { Server as IOServer } from 'socket.io';
import type { NextApiResponse } from 'next';

declare module 'http' {
  interface Server {
    io?: IOServer;
  }
}

// ✅ Extend NextApiResponse instead of replacing it
export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

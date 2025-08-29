'use client';

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import 'xterm/css/xterm.css';

let Terminal: any;

const WebTerminal = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const [terminalReady, setTerminalReady] = useState(false);

  // First, load and set up terminal
  useEffect(() => {
    let termInstance: any;

    import('xterm').then((mod) => {
      Terminal = mod.Terminal;
      termInstance = new Terminal({ cursorBlink: true });

      if (containerRef.current) {
        termInstance.open(containerRef.current);
        termInstance.focus();
        termInstance.write('🔌 Connecting to terminal...\r\n');
        termRef.current = termInstance;
        setTerminalReady(true); // mark terminal as ready
      }
    });

    return () => {
      termRef.current?.dispose();
    };
  }, []);

  // Now safely connect socket only when terminal is ready
  useEffect(() => {
    if (!terminalReady || socketRef.current) return;

    fetch('/api/terminal').then(() => {
      const socket = io({ path: '/api/terminal' });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('✅ Socket connected:', socket.id);
        termRef.current?.write('✅ Connected to backend shell\r\n');
      });

      socket.on('output', (data: string) => {
        termRef.current?.write(data);
      });

      termRef.current?.onData((input: string) => {
          if (input === '\x7f') {
    // simulate backspace visually
    termRef.current.write('\b \b');
  }
         console.log('Typed:', JSON.stringify(input)); // 
        socket.emit('input', input);
      });

      socket.on('disconnect', () => {
        console.log('❌ Disconnected');
        termRef.current?.write('\r\n❌ Disconnected from server\r\n');
      });
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [terminalReady]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{
        marginTop:"0px",
        width: '100%',
        height: '400px',
        backgroundColor: 'black',
        color: 'white',
        fontFamily: 'monospace',
        padding: '10px',
      }}
    />
  );
};

export default WebTerminal;

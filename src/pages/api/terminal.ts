import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "../../../types/next";
import { Server } from "socket.io";
import Docker from "dockerode";
import path from "path";

// Connect to Docker daemon via TCP
const docker = new Docker({ host: "localhost", port: 2375 });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("Starting terminal WebSocket");

    const io = new Server(res.socket.server, {
      path: "/api/terminal",
      cors: {
        origin: "*", // Secure in production!
      },
    });

    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      console.log("Client connected:", socket.id);

      const containerName = "external-app-runner";
      const externalPath = path.resolve(process.cwd(), "../externalFolder/root");
      let container = docker.getContainer(containerName);

      try {
        // Check if container exists
        const info = await container.inspect();

        if (!info.State.Running) {
          console.log("Starting existing container...");
          await container.start();
        } else {
          console.log("Container already running");
        }
      } catch (err) {
        // Container doesn't exist — create it after pulling image
        console.log("Pulling image node:18...");
        try {
          await new Promise<void>((resolve, reject) => {
            docker.pull("node:18", (err:any, stream:any) => {
              if (err) return reject(err);
              docker.modem.followProgress(
                stream,
                (err: Error | null) => {
                  if (err) reject(err);
                  else resolve();
                },
                (event) => {
                  if (event.status) console.log("Pull:", event.status);
                }
              );
            });
          });
          console.log("Image pulled successfully");

          container = await docker.createContainer({
            Image: "node:18",
            name: containerName,
            Cmd: ["bash"]
,
            Tty: true,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            OpenStdin: true,
            WorkingDir: "/workspace",
            ExposedPorts: {
              "3000/tcp": {}, // 👈 Needed to expose port
            },
            HostConfig: {
              Binds: [`${externalPath}:/workspace`],
              PortBindings: {
                "3000/tcp": [
                  {
                    HostPort: "4000", // Bind container's 3000 to host's 4000
                  },
                ],
              },
            },
          });

          await container.start();
          console.log("New container started");
        } catch (createErr: any) {
          console.error("Failed to pull/create/start container:", createErr);
          socket.emit("output", `Error: ${createErr.message}`);
          socket.disconnect(true);
          return;
        }
      }

      try {
        // Start interactive bash session
        const exec = await container.exec({
          Cmd: ["bash"],
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
        });

        const stream = await exec.start({ hijack: true, Tty: true });

        stream.on("data", (chunk: Buffer) => {
          socket.emit("output", chunk.toString("utf-8"));
        });

        socket.on("input", (data: string) => {
          if (stream.writable) {
            console.log(data)
            stream.write(data);
          }
        });

        socket.on("disconnect", async () => {
          console.log("Client disconnected:", socket.id);
          if (stream && stream.writable) stream.end();
        });

        stream.on("end", () => {
          console.log("Stream ended");
          socket.disconnect(true);
        });

        stream.on("error", (err) => {
          console.error("Stream error:", err);
          socket.emit("output", `Stream error: ${err.message}`);
        });
      } catch (execErr: any) {
        console.error("Exec error:", execErr);
        socket.emit("output", `Exec error: ${execErr.message}`);
        socket.disconnect(true);
      }
    });
  } else {
    console.log("Socket.io already running");
  }

  res.end();
}

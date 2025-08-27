// docker-manager.js
import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

/**
 * Start a React container with project mounted
 */
export async function startReactContainer(projectPath: string) {
  try {
    // Step 1: Create & run container
    const container = await docker.createContainer({
      Image: "node:18", // base image
      name: "my-react-container",
      Cmd: ["bash"], // start with bash shell
      Tty: true,
      OpenStdin: true,
      HostConfig: {
        Binds: [`${projectPath}:/workspace`], // mount project
        PortBindings: {
          "3000/tcp": [{ HostPort: "3000" }], // expose React app
        },
      },
      WorkingDir: "/workspace",
    });

    await container.start();
    console.log("✅ React container started");

    // Step 2: Install dependencies inside container
    let exec = await container.exec({
      Cmd: ["npm", "install"],
      AttachStdout: true,
      AttachStderr: true,
      WorkingDir: "/workspace",
    });
    let stream = await exec.start({ hijack: true, stdin: true });
    stream.pipe(process.stdout);

    // Step 3: Start React dev server
    exec = await container.exec({
      Cmd: ["npm", "start"],
      AttachStdout: true,
      AttachStderr: true,
      WorkingDir: "/workspace",
    });
    stream = await exec.start({ hijack: true, stdin: true });
    stream.pipe(process.stdout);

    return container.id;
  } catch (err) {
    console.error("❌ Error starting React container:", err);
  }
}

/**
 * Attach shell (like docker exec -it)
 */
export async function attachShell(containerName: string) {
  const container = docker.getContainer(containerName);

  const exec = await container.exec({
    Cmd: ["bash"],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
  });

  const stream = await exec.start({ hijack: true, stdin: true });

  // Attach host stdin/stdout to container
  process.stdin.pipe(stream);
  stream.pipe(process.stdout);
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrentFile } from "@/app/contextAPi/currentFIle";
import { Icon } from "@iconify/react";

// Map extensions → iconify names
const extensionIconMap: Record<string, string> = {
  js: "vscode-icons:file-type-js",
  jsx: "vscode-icons:file-type-reactjs",
  ts: "vscode-icons:file-type-typescript",
  html: "vscode-icons:file-type-html",
  css: "vscode-icons:file-type-css",
  json: "vscode-icons:file-type-json",
  md: "vscode-icons:file-type-markdown",
  txt: "vscode-icons:file-type-text",
  pdf: "vscode-icons:file-type-pdf2",
  png: "vscode-icons:file-type-image",
  jpg: "vscode-icons:file-type-image",
  svg: "vscode-icons:file-type-svg",
  default: "vscode-icons:default-file",
};

type StructureNode = {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: StructureNode[];
};

const getFileExtension = (filename: string) => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
};

const getFileIcon = (fileName: string, type: string): string => {
  if (type === "folder") return "vscode-icons:default-folder";
  const ext = getFileExtension(fileName);
  return extensionIconMap[ext] || extensionIconMap.default;
};

type FileTreeProps = {
  node: StructureNode;
};

export const FileTree = ({ node }: FileTreeProps) => {
  const [expanded, setExpanded] = useState(false);
  const { setCurrentFile } = useCurrentFile();
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (ref.current) {
      // ref.current.className = "bg-blue-900/50";
    }

    if (node.type === "folder") {
      setExpanded((prev) => !prev);
    } else {
      setCurrentFile(node);
    }
  };

  useEffect(() => {
    if (node.name !== "root") return; // Only run for root
    const createStructure = async () => {
      await fetch("/api/create-folderStructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structure: node,
          targetPath: "generated-projects/my-app",
        }),
      });
    };
    createStructure();
  }, [node]);

  return (
    <div style={{ paddingLeft: 20 }} className="">
      <div
        ref={ref}
        onClick={handleClick}
        className=" flex text-white/80 gap-2 hover:bg-white/10 rounded-md cursor-pointer"
        // style={{
        //   cursor: "pointer",
        //   color: node.type === "folder" ? "blue" : "",
        //   display: "flex",
        //   alignItems: "center",
        //   gap: "6px",
        // }}
      >
        <Icon icon={getFileIcon(node.name, node.type)} width={18} height={18} />
        {node.name}
      </div>

      {node.type === "folder" &&
        expanded &&
        node.children?.map((child, idx) => <FileTree key={idx} node={child} />)}
    </div>
  );
};

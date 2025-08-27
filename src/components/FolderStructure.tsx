'use client';
import { useState,useEffect, useRef } from "react";
import { useFolderStructure } from "@/app/contextAPi/folderStructureContext";
import { useCurrentFile } from "@/app/contextAPi/currentFIle";

// File extension icons
const extensionIconMap: Record<string, string> = {
  js: "🟨",
  jsx: "⚛️",
  ts: "🟦",
  html: "🌐",
  css: "🎨",
  json: "🗂️",
  md: "📝",
  txt: "📄",
  pdf: "📕",
  png: "🖼️",
  jpg: "🖼️",
  svg: "📐",
  default: "📄",
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
  if (type === "folder") return "📁";
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
    ref.current && (ref.current.style.backgroundColor = "red");


    if (node.type === "folder") {
      console.log('hell')
      setExpanded((prev) => !prev);
    } else {
      console.log("hello")
      setCurrentFile(node); 
    }
  };
  
useEffect(() => {
  
  if (node.name !== "root") return; // Only run for root
  const createStructure = async () => {
    await fetch('/api/create-folderStructure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structure: node,
        targetPath: 'generated-projects/my-app'
      })
    });
  };
  createStructure();
}, [node]);


  return (
    <div  style={{ paddingLeft: 20 }}>
     {
       node.type=="folder"?<div
       ref={ref}
        onClick={handleClick}
        style={{
          cursor: "pointer",
          color: node.type === "folder" ? "blue" : "black",
        }}
      >
        {getFileIcon(node.name, node.type)} {node.name}
      </div>:<div
        onClick={handleClick}
        style={{
          cursor: "pointer",
          color: node.type === "file" ? "black" : "black",
        }}
      >
        {getFileIcon(node.name, node.type)} {node.name}
      </div>
     }

      {node.type === "folder" && expanded && node.children?.map((child, idx) => (
        <FileTree key={idx} node={child} />
      ))}
    </div>
  );
};







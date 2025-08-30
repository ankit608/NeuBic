'use client';
import dynamic from 'next/dynamic';
import { useEffect } from "react";

import { LanguageProvider } from "./contextAPi/applicationContext";
import { FolderStructureProvider, useFolderStructure } from "./contextAPi/folderStructureContext";
import { FileProvider } from "./contextAPi/currentFIle";
import { useRef } from 'react';
import { FileTree } from "@/components/FolderStructure";
import CodeEditor from "./customComponents/CodeEditor";
import WebTerminal from '@/components/webTerminal';
// ⏬ This disables SSR for xterm (critical!)
// const WebTerminal = dynamic(() => import('@/components/webTerminal'), {
//   ssr: false,
// });

// ⚠️ New wrapper component to access context inside client component
function FileTreeWrapper() {
  const { FolderStructure } = useFolderStructure();
  return <FileTree node={FolderStructure} />;
}

export default function Home() {
   const iframeRef = useRef<HTMLIFrameElement>(null);
//  useEffect(() => {
//     const interval = setInterval(() => {
//       if (iframeRef.current) {
        
//        (iframeRef.current?.contentWindow as any)?.refreshApp?.();

//       }
//     }, 5000); // every 5 seconds

//     return () => clearInterval(interval);
//   }, []);
useEffect(() => {
  const checkServerAndReload = async () => {
    try {
      // Try to fetch the server
      const res = await fetch("http://localhost:4000", { method: "HEAD" });
      if (res.ok && iframeRef.current) {
        // Reload iframe only
        iframeRef.current.src = iframeRef.current.src;
      }
    } catch (err) {
      console.log("Server not ready yet...");
    }
  };

  // Check every 5 seconds until server responds
  //

  
}, []);

  return (
       <FileProvider>
        <FolderStructureProvider>
        <LanguageProvider>
            <nav className='bg-slate-800 text-white p-1'>
                    <div className="w-full mx-auto flex justify-between items-center">
                   <div className="text-3xl font-extrabold bg-gradient-to-r from-green-200 to-green-700 bg-clip-text text-transparent"> NeuBic </div>
              </div>
                  
              
               </nav>
          <main className=' flex  bg-slate-900 h-[70vh] '>
            
            <div className='h-full overflow-x-hidden pr-2'>
               <FileTreeWrapper />
            </div>
           
            <CodeEditor /> 
           <iframe ref={iframeRef} className="flex-1 w-full h-full bg-white" src="http://localhost:4000" title='embedded app'/>
            <button onClick={() => {
              if (iframeRef.current) {
                iframeRef.current.src = iframeRef.current.src;
              }
            }}>Refresh</button>
          </main>
          {/* Uncomment if needed */}
           
          <WebTerminal />

          {/* Correct usage */}
          
          

        </LanguageProvider>
      </FolderStructureProvider>
       </FileProvider>
      
    
  );
}
function useState(arg0: boolean): [any, any] {
  throw new Error('Function not implemented.');
}


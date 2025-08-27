// src/components/CodeEditor.jsx
import React,{use, useEffect, useRef} from 'react';
import Editor, { OnMount }  from '@monaco-editor/react';
import { useLanguage } from '../contextAPi/applicationContext';
import * as monacoEditor from 'monaco-editor';
import * as monaco from "monaco-editor";
import type * as monacoType from "monaco-editor";
import { useCurrentFile } from '../contextAPi/currentFIle';
import { useFolderStructure } from '../contextAPi/folderStructureContext';

const CodeEditor = () => {

      const {language,setLanguage}= useLanguage()
      const {setCurrentFile,currentFile} = useCurrentFile()
      const {setFolderStructure,FolderStructure} = useFolderStructure()
      const currentFileRef = useRef(currentFile);
      const FolderStructureRef = useRef(FolderStructure);
      console.log(currentFile?.content,)
   const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
   useEffect(() => {
    currentFileRef.current = currentFile;
}, [currentFile]);

useEffect(() => {
    FolderStructureRef.current = FolderStructure;
}, [FolderStructure]);
  
  
  const save = () => {
    const code = editorRef.current?.getValue();
    const latestCurrentFile = currentFileRef.current;

    if (latestCurrentFile) {
        // Update the content of the file
        latestCurrentFile.content = code || undefined;

        // Trigger a re-render of the folder structure
        setFolderStructure({ ...FolderStructureRef.current });
    }
};

const handleEditorDidMount: OnMount = (editor: monacoEditor.editor.IStandaloneCodeEditor | null, monaco: { languages: { registerInlineCompletionsProvider: (arg0: string, arg1: { provideInlineCompletions(model: any, position: any, context: any, token: any): Promise<{ items: { insertText: any; range: any; }[]; }>; freeInlineCompletions: () => void; }) => void; }; Range: new (arg0: any, arg1: any, arg2: any, arg3: any) => any; }) => {
  editorRef.current = editor;

  monaco.languages.registerInlineCompletionsProvider("javascript", {
    async provideInlineCompletions(model: { getValue: () => any; }, position: { lineNumber: any; column: any; }, context: any, token: any         ) {
      const fullCode = model.getValue();

      // Send both file + cursor info
      const response = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: fullCode,
          cursor: { line: position.lineNumber, column: position.column }
        }),
      });

      const { suggestion } = await response.json();

      // 🚫 Filter: don’t repeat things already in the file
      if (fullCode.includes(suggestion.trim())) {
        return { items: [] };
      }

      return {
        items: [
          {
            insertText: suggestion,
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
          },
        ],
      };
    },
    freeInlineCompletions: () => {},
  });
};


//   useEffect(() => {
//     const intervalId = setInterval(() => {
//         save();
//     }, 10000);

//     // Cleanup function to clear the interval when the component unmounts
//     return () => clearInterval(intervalId);
// }, []);


  return (

  
    <div className='flex-1' style={{ height: "100%" }}>
        <select onChange={(e) => setLanguage(e.target.value)} value={language}>
  <option value="javascript">JavaScript</option>
  <option value="python">Python</option>
  <option value="cpp">C++</option>
  <option value="java">Java</option>
</select>
      <Editor
        height="100%"
        defaultLanguage={language}
        value={currentFile?.content}
        theme="vs-dark"
         onMount={handleEditorDidMount}
      />
      <button onClick={()=>{save()}}>run</button>
    </div>
  );
};

export default CodeEditor;

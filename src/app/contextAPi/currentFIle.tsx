import { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define types
export type FileNode = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
};

type FileStructureContextType = {
  currentFile: FileNode | null;
  setCurrentFile: React.Dispatch<React.SetStateAction<FileNode | null>>;
};

// 2. Create context
const FileContext = createContext<FileStructureContextType | undefined>(undefined);

// 3. Custom hook to use the context
export const useCurrentFile = () => {
  const context = useContext(FileContext);
  if (!context) throw new Error("useFileStructure must be used within a FolderStructureProvider");
  return context;
};

// 4. Provider component
type FolderStructureProviderProps = {
  children: ReactNode;
};

export const FileProvider = ({ children }: FolderStructureProviderProps) => {
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null);

  return (
    <FileContext.Provider value={{ currentFile, setCurrentFile }}>
      {children}
    </FileContext.Provider>
  );
};
